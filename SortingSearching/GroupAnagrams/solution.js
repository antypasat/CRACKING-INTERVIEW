/**
 * Group Anagrams - Grupowanie Anagramów
 * Podejście 1: HashMap / Approach 1: HashMap
 *
 * Sortuje tablicę stringów tak, aby wszystkie anagramy były obok siebie.
 * Sorts an array of strings so all anagrams are next to each other.
 *
 * @param {string[]} words - Tablica słów / Array of words
 * @return {string[]} - Posortowana tablica / Sorted array
 */
function groupAnagrams(words) {
  // Mapa: posortowane litery -> tablica słów
  // Map: sorted letters -> array of words
  const anagramGroups = new Map();

  // Grupuj słowa według ich posortowanych liter
  // Group words by their sorted letters
  for (let word of words) {
    // Sortuj litery słowa, aby uzyskać klucz
    // Sort word's letters to get key
    const sortedWord = word.split('').sort().join('');

    // Dodaj słowo do odpowiedniej grupy
    // Add word to appropriate group
    if (!anagramGroups.has(sortedWord)) {
      anagramGroups.set(sortedWord, []);
    }
    anagramGroups.get(sortedWord).push(word);
  }

  // Połącz wszystkie grupy w jedną tablicę
  // Combine all groups into one array
  const result = [];
  for (let group of anagramGroups.values()) {
    result.push(...group);
  }

  return result;
}

/**
 * Wersja z ignorowaniem wielkości liter
 * Version with case insensitivity
 */
function groupAnagramsCaseInsensitive(words) {
  const anagramGroups = new Map();

  for (let word of words) {
    // Konwertuj na małe litery przed sortowaniem
    // Convert to lowercase before sorting
    const sortedWord = word.toLowerCase().split('').sort().join('');

    if (!anagramGroups.has(sortedWord)) {
      anagramGroups.set(sortedWord, []);
    }
    anagramGroups.get(sortedWord).push(word);
  }

  const result = [];
  for (let group of anagramGroups.values()) {
    result.push(...group);
  }

  return result;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Podstawowy przykład / Basic example ===");
const test1 = ["acre", "race", "care", "dog", "god", "cat", "act", "tac"];
console.log("Input:", test1);
const result1 = groupAnagrams(test1);
console.log("Output:", result1);
console.log("Sprawdź: anagramy powinny być obok siebie");
console.log("Check: anagrams should be next to each other");
console.log();

console.log("=== Test 2: Klasyczne anagramy / Classic anagrams ===");
const test2 = ["listen", "silent", "enlist", "hello", "world"];
console.log("Input:", test2);
const result2 = groupAnagrams(test2);
console.log("Output:", result2);
console.log("Oczekiwane grupy / Expected groups: [listen,silent,enlist] [hello] [world]");
console.log();

console.log("=== Test 3: Brak anagramów / No anagrams ===");
const test3 = ["cat", "dog", "bird", "fish"];
console.log("Input:", test3);
const result3 = groupAnagrams(test3);
console.log("Output:", result3);
console.log("Każde słowo w osobnej grupie / Each word in separate group");
console.log();

console.log("=== Test 4: Wszystkie słowa to anagramy / All words are anagrams ===");
const test4 = ["ate", "eat", "tea", "eta"];
console.log("Input:", test4);
const result4 = groupAnagrams(test4);
console.log("Output:", result4);
console.log("Wszystkie w jednej grupie / All in one group");
console.log();

console.log("=== Test 5: Puste i pojedyncze znaki / Empty and single chars ===");
const test5 = ["", "a", "ab", "ba", "", "b"];
console.log("Input:", test5);
const result5 = groupAnagrams(test5);
console.log("Output:", result5);
console.log("Grupy: ['',''] ['a'] ['ab','ba'] ['b']");
console.log();

console.log("=== Test 6: Różna wielkość liter (case sensitive) ===");
const test6 = ["Listen", "Silent", "listen", "silent"];
console.log("Input:", test6);
const result6 = groupAnagrams(test6);
console.log("Output (case sensitive):", result6);
console.log("'Listen' i 'Silent' NIE są razem (różna wielkość)");
const result6b = groupAnagramsCaseInsensitive(test6);
console.log("Output (case insensitive):", result6b);
console.log("Wszystkie razem (ignorując wielkość)");
console.log();

console.log("=== Test 7: Długie słowa / Long words ===");
const test7 = ["conversation", "conservation", "voices", "ovices"];
console.log("Input:", test7);
const result7 = groupAnagrams(test7);
console.log("Output:", result7);
console.log();

console.log("=== Test 8: Duplikaty / Duplicates ===");
const test8 = ["cat", "tac", "cat", "dog", "god", "cat"];
console.log("Input:", test8);
const result8 = groupAnagrams(test8);
console.log("Output:", result8);
console.log("Duplikaty są razem w grupie / Duplicates are together in group");
console.log();

console.log("=== Test 9: Pusta tablica / Empty array ===");
const test9 = [];
console.log("Input:", test9);
const result9 = groupAnagrams(test9);
console.log("Output:", result9);
console.log("Oczekiwane / Expected: []");
console.log();

console.log("=== Test 10: Weryfikacja grupowania / Verify grouping ===");
const test10 = ["dear", "read", "dare", "good"];
console.log("Input:", test10);
const result10 = groupAnagrams(test10);
console.log("Output:", result10);

// Funkcja pomocnicza do weryfikacji, czy anagramy są razem
// Helper function to verify if anagrams are together
function verifyGrouping(arr) {
  const sorted = arr.map(word => word.split('').sort().join(''));
  let lastKey = null;
  const groups = [];
  let currentGroup = [];

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== lastKey && currentGroup.length > 0) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
    currentGroup.push(arr[i]);
    lastKey = sorted[i];
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

const groups10 = verifyGrouping(result10);
console.log("Zidentyfikowane grupy / Identified groups:", groups10);
console.log();

// Eksportuj funkcję / Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { groupAnagrams, groupAnagramsCaseInsensitive };
}
