/**
 * Group Anagrams - Grupowanie Anagramów
 * Podejście 2: Sortowanie Niestandardowe / Approach 2: Custom Sorting
 *
 * Używa wbudowanej funkcji sort() z niestandardowym komparatorem.
 * Uses built-in sort() function with custom comparator.
 *
 * @param {string[]} words - Tablica słów / Array of words
 * @return {string[]} - Posortowana tablica / Sorted array
 */
function groupAnagramsWithSort(words) {
  // Sortuj tablicę używając komparatora, który porównuje posortowane wersje stringów
  // Sort array using comparator that compares sorted versions of strings
  return words.sort((a, b) => {
    // Posortuj litery obu słów / Sort letters of both words
    const sortedA = a.split('').sort().join('');
    const sortedB = b.split('').sort().join('');

    // Porównaj posortowane wersje / Compare sorted versions
    if (sortedA < sortedB) return -1;
    if (sortedA > sortedB) return 1;
    return 0;
  });
}

/**
 * Wersja z cache dla optymalizacji
 * Version with cache for optimization
 *
 * Cache zapobiega wielokrotnemu sortowaniu tego samego słowa
 * Cache prevents multiple sorting of the same word
 */
function groupAnagramsWithSortOptimized(words) {
  // Mapa cache: słowo -> posortowane litery
  // Cache map: word -> sorted letters
  const cache = new Map();

  // Funkcja pomocnicza do uzyskania posortowanej wersji
  // Helper function to get sorted version
  function getSortedKey(word) {
    if (!cache.has(word)) {
      cache.set(word, word.split('').sort().join(''));
    }
    return cache.get(word);
  }

  return words.sort((a, b) => {
    const sortedA = getSortedKey(a);
    const sortedB = getSortedKey(b);

    if (sortedA < sortedB) return -1;
    if (sortedA > sortedB) return 1;
    return 0;
  });
}

/**
 * Wersja hybrydowa: sortuj używając indeksów z HashMap
 * Hybrid version: sort using indices from HashMap
 *
 * Ta wersja najpierw grupuje (jak solution.js), a potem sortuje grupy
 * This version first groups (like solution.js), then sorts groups
 */
function groupAnagramsHybrid(words) {
  const anagramGroups = new Map();
  const order = []; // Zachowaj kolejność pierwszego wystąpienia / Keep order of first occurrence

  for (let word of words) {
    const sortedWord = word.split('').sort().join('');

    if (!anagramGroups.has(sortedWord)) {
      anagramGroups.set(sortedWord, []);
      order.push(sortedWord); // Zapamiętaj kolejność / Remember order
    }
    anagramGroups.get(sortedWord).push(word);
  }

  // Zbuduj wynik według zachowanej kolejności
  // Build result according to preserved order
  const result = [];
  for (let key of order) {
    result.push(...anagramGroups.get(key));
  }

  return result;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Podstawowy przykład z sortowaniem / Basic example with sorting ===");
const test1 = ["acre", "race", "care", "dog", "god", "cat", "act", "tac"];
console.log("Input:", test1);
const result1 = groupAnagramsWithSort([...test1]); // Kopia, bo sort modyfikuje / Copy because sort modifies
console.log("Output:", result1);
console.log("Anagramy są zgrupowane i alfabetycznie posortowane według kluczy");
console.log("Anagrams are grouped and alphabetically sorted by keys");
console.log();

console.log("=== Test 2: Porównanie metod / Compare methods ===");
const test2 = ["listen", "silent", "enlist", "hello", "world"];
console.log("Input:", test2);
console.log("Metoda 1 (zwykłe sortowanie):", groupAnagramsWithSort([...test2]));
console.log("Metoda 2 (z cache):", groupAnagramsWithSortOptimized([...test2]));
console.log("Metoda 3 (hybrydowa):", groupAnagramsHybrid([...test2]));
console.log();

console.log("=== Test 3: Wydajność - duplikaty / Performance - duplicates ===");
const test3 = ["cat", "cat", "cat", "tac", "tac", "dog", "dog", "god"];
console.log("Input:", test3);
console.log("Z cache (lepsze dla duplikatów):", groupAnagramsWithSortOptimized([...test3]));
console.log("Duplikaty są razem / Duplicates are together");
console.log();

console.log("=== Test 4: Zachowanie oryginalnej kolejności / Preserve original order ===");
const test4 = ["zebra", "arbez", "apple", "ppale", "dog"];
console.log("Input:", test4);
console.log("Zwykłe sortowanie (alfabetycznie):", groupAnagramsWithSort([...test4]));
console.log("Hybrydowe (kolejność pierwszego wystąpienia):", groupAnagramsHybrid([...test4]));
console.log();

console.log("=== Test 5: Edge case - pusta i jednoelementowa / Empty and single element ===");
const test5a = [];
const test5b = ["only"];
console.log("Pusta tablica / Empty array:", test5a);
console.log("Output:", groupAnagramsWithSort([...test5a]));
console.log("Jeden element / One element:", test5b);
console.log("Output:", groupAnagramsWithSort([...test5b]));
console.log();

console.log("=== Test 6: Wszystkie różne / All different ===");
const test6 = ["cat", "dog", "bird", "fish", "lion"];
console.log("Input:", test6);
console.log("Output:", groupAnagramsWithSort([...test6]));
console.log("Każde słowo w osobnej 'grupie' (posortowane alfabetycznie)");
console.log("Each word in separate 'group' (sorted alphabetically)");
console.log();

console.log("=== Test 7: Wszystkie te same anagramy / All same anagrams ===");
const test7 = ["ate", "eat", "tea", "eta", "tae"];
console.log("Input:", test7);
console.log("Output:", groupAnagramsWithSort([...test7]));
console.log("Wszystkie razem (mogą być posortowane wewnętrznie)");
console.log("All together (might be sorted internally)");
console.log();

console.log("=== Test 8: Benchmark różnych podejść / Benchmark different approaches ===");
// Generuj dużo słów dla testu wydajności
// Generate many words for performance test
function generateTestWords(count) {
  const words = ["cat", "act", "tac", "dog", "god", "listen", "silent"];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(words[i % words.length] + i); // Dodaj indeks dla unikalności / Add index for uniqueness
  }
  return result;
}

const bigTest = generateTestWords(1000);
console.log(`Testowanie z ${bigTest.length} słowami...`);
console.log(`Testing with ${bigTest.length} words...`);

console.time("Sortowanie zwykłe / Regular sort");
groupAnagramsWithSort([...bigTest]);
console.timeEnd("Sortowanie zwykłe / Regular sort");

console.time("Sortowanie z cache / Sort with cache");
groupAnagramsWithSortOptimized([...bigTest]);
console.timeEnd("Sortowanie z cache / Sort with cache");

console.time("Hybrydowe / Hybrid");
groupAnagramsHybrid([...bigTest]);
console.timeEnd("Hybrydowe / Hybrid");
console.log();

console.log("=== Wnioski / Conclusions ===");
console.log("1. Sortowanie zwykłe: O(n log n * k log k) - proste, ale wolniejsze");
console.log("   Regular sorting: O(n log n * k log k) - simple but slower");
console.log("2. Sortowanie z cache: lepsze dla duplikatów");
console.log("   Sorting with cache: better for duplicates");
console.log("3. Hybrydowe: O(n * k log k) - najszybsze, ale używa więcej pamięci");
console.log("   Hybrid: O(n * k log k) - fastest but uses more memory");

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    groupAnagramsWithSort,
    groupAnagramsWithSortOptimized,
    groupAnagramsHybrid
  };
}
