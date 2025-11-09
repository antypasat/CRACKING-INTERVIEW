/**
 * Missing Int - Brakująca Liczba Całkowita
 *
 * Znajduje liczbę całkowitą, której nie ma w pliku z miliardami liczb.
 * Finds an integer that is not contained in file with billions of numbers.
 */

/**
 * Klasa BitVector - kompaktowa reprezentacja dużego zbioru liczb
 * BitVector class - compact representation of large set of numbers
 */
class BitVector {
  constructor(size) {
    // Każdy element tablicy przechowuje 32 bity (liczby)
    // Each array element stores 32 bits (numbers)
    this.size = size;
    this.bits = new Array(Math.ceil(size / 32)).fill(0);
  }

  /**
   * Ustaw bit na pozycji index na 1
   * Set bit at position index to 1
   */
  set(index) {
    if (index < 0 || index >= this.size) return;

    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    this.bits[arrayIndex] |= (1 << bitIndex);
  }

  /**
   * Sprawdź czy bit na pozycji index jest ustawiony
   * Check if bit at position index is set
   */
  get(index) {
    if (index < 0 || index >= this.size) return false;

    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    return (this.bits[arrayIndex] & (1 << bitIndex)) !== 0;
  }

  /**
   * Oblicz użycie pamięci w bajtach
   * Calculate memory usage in bytes
   */
  getMemoryUsage() {
    return this.bits.length * 4; // 4 bajty na element (32-bit integer)
  }
}

/**
 * ROZWIĄZANIE 1: Bit Vector dla 1 GB RAM
 * SOLUTION 1: Bit Vector for 1 GB RAM
 *
 * @param {number[]} numbers - Tablica liczb (symuluje plik)
 * @param {number} maxValue - Maksymalna wartość liczby
 * @return {number} - Brakująca liczba
 */
function findMissingInt(numbers, maxValue = 100) {
  console.log(`\n=== Rozwiązanie 1: Bit Vector ===`);
  console.log(`Liczb w pliku: ${numbers.length}`);
  console.log(`Maksymalna wartość: ${maxValue}`);

  // Stwórz bit vector
  const bitVector = new BitVector(maxValue + 1);
  console.log(`Pamięć bit vector: ${bitVector.getMemoryUsage()} bajtów`);

  // Oznacz wszystkie istniejące liczby
  for (let num of numbers) {
    bitVector.set(num);
  }

  // Znajdź pierwszą brakującą
  for (let i = 0; i <= maxValue; i++) {
    if (!bitVector.get(i)) {
      console.log(`Znaleziono brakującą liczbę: ${i}`);
      return i;
    }
  }

  return -1; // Wszystkie liczby istnieją
}

/**
 * ROZWIĄZANIE 2: Podział na bloki dla 10 MB RAM
 * SOLUTION 2: Block division for 10 MB RAM
 *
 * @param {number[]} numbers - Tablica liczb (symuluje plik)
 * @param {number} maxValue - Maksymalna wartość liczby
 * @param {number} numBlocks - Liczba bloków
 * @return {number} - Brakująca liczba
 */
function findMissingIntLimitedMemory(numbers, maxValue = 100, numBlocks = 10) {
  console.log(`\n=== Rozwiązanie 2: Podział na Bloki ===`);
  console.log(`Liczb w pliku: ${numbers.length}`);
  console.log(`Maksymalna wartość: ${maxValue}`);
  console.log(`Liczba bloków: ${numBlocks}`);

  const numbersPerBlock = Math.ceil((maxValue + 1) / numBlocks);
  console.log(`Liczb na blok: ${numbersPerBlock}`);

  // PASS 1: Zlicz liczby w każdym bloku
  console.log(`\nPASS 1: Zliczanie liczb w blokach...`);
  const counters = new Array(numBlocks).fill(0);

  for (let num of numbers) {
    const blockIndex = Math.floor(num / numbersPerBlock);
    if (blockIndex < numBlocks) {
      counters[blockIndex]++;
    }
  }

  console.log(`Liczniki bloków:`, counters);

  // Znajdź blok z brakującą liczbą
  let targetBlock = -1;
  for (let i = 0; i < numBlocks; i++) {
    // Oblicz oczekiwaną liczbę elementów w tym bloku
    const blockStart = i * numbersPerBlock;
    const blockEnd = Math.min(blockStart + numbersPerBlock, maxValue + 1);
    const expectedCount = blockEnd - blockStart;

    console.log(`  Blok ${i}: ${counters[i]} liczb (oczekiwano ${expectedCount})`);

    if (counters[i] < expectedCount) {
      targetBlock = i;
      console.log(`  → Blok ${i} ma brakującą liczbę!`);
      break;
    }
  }

  if (targetBlock === -1) {
    console.log(`Nie znaleziono bloku z brakującą liczbą`);
    return -1;
  }

  // PASS 2: Bit vector dla targetBlock
  console.log(`\nPASS 2: Bit vector dla bloku ${targetBlock}...`);
  const blockStart = targetBlock * numbersPerBlock;
  const blockEnd = Math.min(blockStart + numbersPerBlock, maxValue + 1);
  const blockSize = blockEnd - blockStart;

  const bitVector = new BitVector(blockSize);
  console.log(`Zakres bloku: [${blockStart}, ${blockEnd - 1}]`);
  console.log(`Pamięć bit vector: ${bitVector.getMemoryUsage()} bajtów`);

  // Oznacz liczby z targetBlock
  for (let num of numbers) {
    if (num >= blockStart && num < blockEnd) {
      bitVector.set(num - blockStart);
    }
  }

  // Znajdź brakujący bit w tym bloku
  for (let i = 0; i < blockSize; i++) {
    if (!bitVector.get(i)) {
      const missingNumber = blockStart + i;
      console.log(`Znaleziono brakującą liczbę: ${missingNumber}`);
      return missingNumber;
    }
  }

  return -1;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("========================================");
console.log("MISSING INT - Testy");
console.log("========================================");

console.log("\n=== Test 1: Mały przykład ===");
const numbers1 = [0, 1, 2, 3, 5, 6, 7, 8, 9];
console.log("Liczby:", numbers1);
console.log("Brakuje: 4");
const result1a = findMissingInt(numbers1, 10);
const result1b = findMissingIntLimitedMemory(numbers1, 10, 3);
console.log();

console.log("=== Test 2: Brakuje 0 ===");
const numbers2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Liczby:", numbers2);
console.log("Brakuje: 0");
const result2a = findMissingInt(numbers2, 10);
const result2b = findMissingIntLimitedMemory(numbers2, 10, 3);
console.log();

console.log("=== Test 3: Brakuje ostatnia ===");
const numbers3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log("Liczby:", numbers3);
console.log("Brakuje: 10");
const result3a = findMissingInt(numbers3, 10);
const result3b = findMissingIntLimitedMemory(numbers3, 10, 3);
console.log();

console.log("=== Test 4: Brakuje środkowa ===");
const numbers4 = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
console.log("Liczby (15 elementów):", numbers4);
console.log("Brakuje: 5");
const result4a = findMissingInt(numbers4, 15);
const result4b = findMissingIntLimitedMemory(numbers4, 15, 4);
console.log();

console.log("=== Test 5: Duplikaty ===");
const numbers5 = [0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9];
console.log("Liczby (z duplikatami):", numbers5);
console.log("Brakuje: 10");
const result5a = findMissingInt(numbers5, 10);
const result5b = findMissingIntLimitedMemory(numbers5, 10, 3);
console.log();

console.log("=== Test 6: Większy przykład ===");
const numbers6 = [];
for (let i = 0; i < 1000; i++) {
  if (i !== 500) { // Brakuje 500
    numbers6.push(i);
  }
}
console.log("Zakres: [0, 999], brakuje: 500");
console.log(`Liczba elementów: ${numbers6.length}`);
const result6a = findMissingInt(numbers6, 999);
const result6b = findMissingIntLimitedMemory(numbers6, 999, 20);
console.log();

console.log("=== Test 7: Analiza pamięci ===");
console.log("\nDla różnych rozmiarów danych:");

function analyzeMemory(size) {
  const bitVectorBytes = Math.ceil(size / 8);
  const numBlocks = 1000;
  const countersBytes = numBlocks * 4;
  const blockBitVectorBytes = Math.ceil(size / numBlocks / 8);

  console.log(`\nRozmiar danych: ${size.toLocaleString()} liczb`);
  console.log(`  Rozwiązanie 1 (bit vector):`);
  console.log(`    Pamięć: ${(bitVectorBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Rozwiązanie 2 (${numBlocks} bloków):`);
  console.log(`    Liczniki: ${(countersBytes / 1024).toFixed(2)} KB`);
  console.log(`    Bit vector (1 blok): ${(blockBitVectorBytes / 1024).toFixed(2)} KB`);
  console.log(`    Łącznie: ${((countersBytes + blockBitVectorBytes) / 1024).toFixed(2)} KB`);
}

analyzeMemory(1000000);      // 1 milion
analyzeMemory(100000000);    // 100 milionów
analyzeMemory(1000000000);   // 1 miliard
analyzeMemory(4000000000);   // 4 miliardy

console.log("\n=== Test 8: Losowe dane ===");
function generateRandomNumbers(count, maxValue, missing) {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    let num;
    do {
      num = Math.floor(Math.random() * maxValue);
    } while (num === missing);
    numbers.push(num);
  }
  return numbers;
}

const missing = 42;
const numbers8 = generateRandomNumbers(100, 100, missing);
console.log(`Wygenerowano 100 losowych liczb z zakresu [0, 99]`);
console.log(`Celowo pominięto: ${missing}`);

const result8a = findMissingInt(numbers8, 99);
console.log(`Metoda 1 znalazła: ${result8a}`);

const result8b = findMissingIntLimitedMemory(numbers8, 99, 5);
console.log(`Metoda 2 znalazła: ${result8b}`);
console.log();

console.log("=== Podsumowanie / Summary ===");
console.log("\nMetoda 1 (Bit Vector):");
console.log("  ✓ Szybka - jedno przejście przez plik");
console.log("  ✓ Prosta implementacja");
console.log("  ✗ Wymaga więcej pamięci (500 MB dla 4B liczb)");

console.log("\nMetoda 2 (Bloki):");
console.log("  ✓ Minimalna pamięć (KB zamiast MB)");
console.log("  ✓ Skalowalna");
console.log("  ✗ Dwa przejścia przez plik");
console.log("  ✗ Bardziej skomplikowana");

console.log("\nWybór metody zależy od:");
console.log("  - Dostępnej pamięci RAM");
console.log("  - Rozmiaru danych");
console.log("  - Kosztu I/O (czy plik jest na dysku czy w sieci)");

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BitVector,
    findMissingInt,
    findMissingIntLimitedMemory
  };
}
