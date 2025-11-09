/**
 * Find Duplicates - Znajdź Duplikaty
 *
 * Znajduje duplikaty w tablicy liczb [1, N] używając tylko 4 KB pamięci.
 * Finds duplicates in array of numbers [1, N] using only 4 KB memory.
 */

/**
 * Klasa BitVector - kompaktowa reprezentacja zbioru
 * BitVector class - compact representation of set
 */
class BitVector {
  constructor(size) {
    // Każdy element przechowuje 32 bity / Each element stores 32 bits
    this.size = size;
    this.bits = new Array(Math.ceil(size / 32)).fill(0);
  }

  /**
   * Sprawdź czy bit jest ustawiony / Check if bit is set
   */
  get(index) {
    if (index < 0 || index >= this.size) return false;

    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    return (this.bits[arrayIndex] & (1 << bitIndex)) !== 0;
  }

  /**
   * Ustaw bit / Set bit
   */
  set(index) {
    if (index < 0 || index >= this.size) return;

    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    this.bits[arrayIndex] |= (1 << bitIndex);
  }

  /**
   * Oblicz użycie pamięci / Calculate memory usage
   */
  getMemoryUsage() {
    return this.bits.length * 4; // 4 bajty na element
  }
}

/**
 * Znajduje wszystkie duplikaty w tablicy
 * Finds all duplicates in array
 *
 * @param {number[]} arr - Tablica liczb [1, N] / Array of numbers [1, N]
 * @return {number[]} - Tablica duplikatów / Array of duplicates
 */
function findDuplicates(arr) {
  const MAX_N = 32000;
  const bitVector = new BitVector(MAX_N + 1); // +1 bo liczymy od 1
  const duplicates = [];

  for (let num of arr) {
    // Sprawdź czy num jest w dozwolonym zakresie
    // Check if num is in allowed range
    if (num < 1 || num > MAX_N) {
      console.log(`Ostrzeżenie: ${num} poza zakresem [1, ${MAX_N}]`);
      continue;
    }

    // Sprawdź czy już widzieliśmy tę liczbę
    // Check if we've already seen this number
    if (bitVector.get(num)) {
      // To jest duplikat! / This is a duplicate!
      duplicates.push(num);
    } else {
      // Pierwszy raz widzimy tę liczbę / First time seeing this number
      bitVector.set(num);
    }
  }

  return duplicates;
}

/**
 * Wersja która drukuje duplikaty zamiast je zbierać
 * Version that prints duplicates instead of collecting them
 */
function printDuplicates(arr) {
  const MAX_N = 32000;
  const bitVector = new BitVector(MAX_N + 1);

  console.log("Duplikaty:");
  let count = 0;

  for (let num of arr) {
    if (num < 1 || num > MAX_N) continue;

    if (bitVector.get(num)) {
      console.log(`  ${num}`);
      count++;
    } else {
      bitVector.set(num);
    }
  }

  console.log(`Łącznie znaleziono ${count} duplikatów`);
}

/**
 * Wersja która znajduje tylko unikalne duplikaty (bez powtórzeń)
 * Version that finds only unique duplicates (without repetitions)
 */
function findUniqueDuplicates(arr) {
  const MAX_N = 32000;
  const seen = new BitVector(MAX_N + 1);
  const duplicates = new BitVector(MAX_N + 1);
  const result = [];

  for (let num of arr) {
    if (num < 1 || num > MAX_N) continue;

    if (seen.get(num)) {
      // Widzieliśmy już, ale dodaj tylko raz do duplikatów
      // Already seen, but add only once to duplicates
      if (!duplicates.get(num)) {
        duplicates.set(num);
        result.push(num);
      }
    } else {
      seen.set(num);
    }
  }

  return result;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("========================================");
console.log("FIND DUPLICATES - Testy");
console.log("========================================\n");

console.log("=== Test 1: Podstawowy przykład / Basic example ===");
const arr1 = [1, 3, 5, 3, 7, 1, 5, 9, 1];
console.log("Tablica:", arr1);
const result1 = findDuplicates(arr1);
console.log("Duplikaty (wszystkie wystąpienia):", result1);
console.log("Oczekiwane: [3, 1, 5, 1]");
const unique1 = findUniqueDuplicates(arr1);
console.log("Duplikaty (unikalne):", unique1);
console.log("Oczekiwane: [3, 1, 5]");
console.log();

console.log("=== Test 2: Brak duplikatów / No duplicates ===");
const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Tablica:", arr2);
const result2 = findDuplicates(arr2);
console.log("Duplikaty:", result2);
console.log("Oczekiwane: []");
console.log();

console.log("=== Test 3: Wszystkie duplikaty / All duplicates ===");
const arr3 = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
console.log("Tablica:", arr3);
const result3 = findDuplicates(arr3);
console.log("Duplikaty:", result3);
console.log("Oczekiwane: [1, 2, 3, 4, 5]");
console.log();

console.log("=== Test 4: Liczba występuje 3+ razy / Number appears 3+ times ===");
const arr4 = [1, 2, 1, 3, 1, 4, 1];
console.log("Tablica:", arr4);
const result4 = findDuplicates(arr4);
console.log("Duplikaty (wszystkie wystąpienia):", result4);
console.log("Oczekiwane: [1, 1, 1] - 1 pojawia się 4 razy");
console.log();

console.log("=== Test 5: Pusta tablica / Empty array ===");
const arr5 = [];
console.log("Tablica:", arr5);
const result5 = findDuplicates(arr5);
console.log("Duplikaty:", result5);
console.log("Oczekiwane: []");
console.log();

console.log("=== Test 6: Duże liczby / Large numbers ===");
const arr6 = [31999, 32000, 31999, 1, 32000, 15000, 15000];
console.log("Tablica:", arr6);
const result6 = findDuplicates(arr6);
console.log("Duplikaty:", result6);
console.log("Oczekiwane: [31999, 32000, 15000]");
console.log();

console.log("=== Test 7: Liczby poza zakresem / Numbers out of range ===");
const arr7 = [1, 2, 32001, 3, 0, 4, -5];
console.log("Tablica:", arr7);
const result7 = findDuplicates(arr7);
console.log("Duplikaty:", result7);
console.log("Liczby poza zakresem [1, 32000] są pomijane");
console.log();

console.log("=== Test 8: Użycie pamięci / Memory usage ===");
const bitVector = new BitVector(32000);
console.log(`Bit vector dla 32,000 liczb:`);
console.log(`  Użycie pamięci: ${bitVector.getMemoryUsage()} bajtów`);
console.log(`  To jest: ${(bitVector.getMemoryUsage() / 1024).toFixed(2)} KB`);
console.log(`  Limit: 4 KB ✓`);
console.log();

console.log("=== Test 9: Większa tablica / Larger array ===");
const arr9 = [];
for (let i = 1; i <= 1000; i++) {
  arr9.push(i);
  if (i % 3 === 0) arr9.push(i); // Co trzecia liczba jest duplikatem
}
console.log(`Wygenerowano tablicę z ${arr9.length} elementami`);
console.log("Co trzecia liczba jest duplikatem");
const result9 = findUniqueDuplicates(arr9);
console.log(`Znaleziono ${result9.length} unikalnych duplikatów`);
console.log("Pierwsze 10 duplikatów:", result9.slice(0, 10));
console.log("Ostatnie 10 duplikatów:", result9.slice(-10));
console.log();

console.log("=== Test 10: Wydajność / Performance ===");
const arr10 = [];
for (let i = 1; i <= 10000; i++) {
  arr10.push(Math.floor(Math.random() * 5000) + 1);
}
console.log(`Tablica z ${arr10.length} losowymi liczbami [1, 5000]`);

console.time("Znajdź duplikaty");
const result10 = findDuplicates(arr10);
console.timeEnd("Znajdź duplikaty");

console.log(`Znaleziono ${result10.length} duplikatów (z powtórzeniami)`);

const unique10 = findUniqueDuplicates(arr10);
console.log(`Znaleziono ${unique10.length} unikalnych duplikatów`);
console.log();

console.log("=== Test 11: Drukowanie duplikatów / Printing duplicates ===");
const arr11 = [1, 5, 3, 5, 7, 1, 9, 3, 1];
console.log("Tablica:", arr11);
printDuplicates(arr11);
console.log();

console.log("=== Podsumowanie / Summary ===");
console.log("\nRozwiązanie używa bit vector:");
console.log("  ✓ Tylko 1 bit na liczbę");
console.log("  ✓ 32,000 liczb = 4,000 bajtów = 4 KB");
console.log("  ✓ Złożoność czasowa: O(n)");
console.log("  ✓ Złożoność pamięciowa: O(1) - stała pamięć");
console.log("\nBit vector vs HashMap:");
console.log("  Bit vector: 32,000 bity = 4 KB");
console.log("  HashMap: 32,000 × (klucz + wartość) ≈ 256 KB+");
console.log("  → Bit vector jest ~64× bardziej efektywny pamięciowo!");

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BitVector,
    findDuplicates,
    printDuplicates,
    findUniqueDuplicates
  };
}
