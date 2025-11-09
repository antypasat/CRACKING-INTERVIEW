// ============================================================================
// 8.3 MAGIC INDEX
// ============================================================================

/**
 * Magic Index Problem
 * Problem Magicznego Indeksu
 *
 * A magic index in an array A[0...n-1] is defined to be an index such that
 * A[i] = i. Given a sorted array of distinct integers, write a method to find
 * a magic index, if one exists, in array A.
 *
 * FOLLOW UP: What if the values are not distinct?
 *
 * Magiczny indeks w tablicy A[0...n-1] jest zdefiniowany jako indeks taki że
 * A[i] = i. Dana jest posortowana tablica różnych liczb całkowitych, napisz
 * metodę znajdującą magiczny indeks, jeśli istnieje, w tablicy A.
 *
 * UZUPEŁNIENIE: Co jeśli wartości nie są różne?
 */

// ============================================================================
// APPROACH 1: LINEAR SEARCH (BRUTE FORCE)
// PODEJŚCIE 1: WYSZUKIWANIE LINIOWE (BRUTALNA SIŁA)
// ============================================================================

/**
 * Find magic index - Linear Search
 * Znajdź magiczny indeks - Wyszukiwanie Liniowe
 *
 * Check every element in the array
 * Sprawdź każdy element w tablicy
 *
 * Time: O(n) - check all elements / sprawdź wszystkie elementy
 * Space: O(1) - no extra space / brak dodatkowej pamięci
 *
 * @param {number[]} arr - Sorted array / Posortowana tablica
 * @returns {number} - Magic index or -1 / Magiczny indeks lub -1
 */
function magicIndexLinear(arr) {
  if (!arr || arr.length === 0) return -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === i) {
      return i;
    }
  }

  return -1;
}

// ============================================================================
// APPROACH 2: BINARY SEARCH (DISTINCT VALUES)
// PODEJŚCIE 2: WYSZUKIWANIE BINARNE (RÓŻNE WARTOŚCI)
// ============================================================================

/**
 * Find magic index - Binary Search for Distinct Values
 * Znajdź magiczny indeks - Wyszukiwanie Binarne dla Różnych Wartości
 *
 * Uses binary search optimization for distinct sorted values
 * Wykorzystuje optymalizację wyszukiwania binarnego dla różnych wartości
 *
 * Key insight: If A[mid] > mid, magic index must be on left
 *              If A[mid] < mid, magic index must be on right
 *
 * Time: O(log n) - binary search / wyszukiwanie binarne
 * Space: O(log n) - recursion stack / stos rekurencji
 *
 * @param {number[]} arr - Sorted array of distinct integers
 * @returns {number} - Magic index or -1
 */
function magicIndexBinaryDistinct(arr) {
  if (!arr || arr.length === 0) return -1;
  return magicIndexBinaryDistinctHelper(arr, 0, arr.length - 1);
}

/**
 * Helper for binary search with distinct values
 * Pomocnik dla wyszukiwania binarnego z różnymi wartościami
 */
function magicIndexBinaryDistinctHelper(arr, start, end) {
  if (start > end) return -1;

  const mid = Math.floor((start + end) / 2);

  // Found magic index! / Znaleziono magiczny indeks!
  if (arr[mid] === mid) {
    return mid;
  }

  // If arr[mid] > mid, then arr[mid+1], arr[mid+2], ... are all > their indices
  // because array is sorted and values are distinct
  // Search left half / Szukaj w lewej połowie
  if (arr[mid] > mid) {
    return magicIndexBinaryDistinctHelper(arr, start, mid - 1);
  }

  // If arr[mid] < mid, search right half / Szukaj w prawej połowie
  return magicIndexBinaryDistinctHelper(arr, mid + 1, end);
}

// ============================================================================
// APPROACH 3: BINARY SEARCH (NON-DISTINCT VALUES)
// PODEJŚCIE 3: WYSZUKIWANIE BINARNE (WARTOŚCI NIEROZRÓŻNIALNE)
// ============================================================================

/**
 * Find magic index - Binary Search for Non-Distinct Values
 * Znajdź magiczny indeks - Wyszukiwanie Binarne dla Wartości Nierozróżnialnych
 *
 * When values are not distinct, we must search both sides, but can still
 * optimize by using the value at mid to skip some indices
 *
 * Gdy wartości nie są różne, musimy przeszukać obie strony, ale nadal możemy
 * optymalizować używając wartości w mid do pominięcia niektórych indeksów
 *
 * Time: O(n) worst case, but better than linear in practice
 * Space: O(log n) - recursion stack / stos rekurencji
 *
 * @param {number[]} arr - Sorted array (may have duplicates)
 * @returns {number} - Magic index or -1
 */
function magicIndexBinaryNonDistinct(arr) {
  if (!arr || arr.length === 0) return -1;
  return magicIndexBinaryNonDistinctHelper(arr, 0, arr.length - 1);
}

/**
 * Helper for binary search with non-distinct values
 * Pomocnik dla wyszukiwania binarnego z nieróżnymi wartościami
 */
function magicIndexBinaryNonDistinctHelper(arr, start, end) {
  if (start > end) return -1;

  const mid = Math.floor((start + end) / 2);
  const midValue = arr[mid];

  // Found magic index! / Znaleziono magiczny indeks!
  if (midValue === mid) {
    return mid;
  }

  // Search left side / Przeszukaj lewą stronę
  // Optimize: only search up to min(mid - 1, midValue)
  // Because if arr[mid] = 5 and mid = 7, arr[6] can't be 6 (array is sorted)
  const leftEnd = Math.min(mid - 1, midValue);
  const leftResult = magicIndexBinaryNonDistinctHelper(arr, start, leftEnd);
  if (leftResult !== -1) {
    return leftResult;
  }

  // Search right side / Przeszukaj prawą stronę
  // Optimize: only search from max(mid + 1, midValue)
  const rightStart = Math.max(mid + 1, midValue);
  return magicIndexBinaryNonDistinctHelper(arr, rightStart, end);
}

// ============================================================================
// APPROACH 4: FIND ALL MAGIC INDICES
// PODEJŚCIE 4: ZNAJDŹ WSZYSTKIE MAGICZNE INDEKSY
// ============================================================================

/**
 * Find all magic indices
 * Znajdź wszystkie magiczne indeksy
 *
 * For non-distinct arrays, there may be multiple magic indices
 * Dla tablic z powtórzeniami może być wiele magicznych indeksów
 *
 * @param {number[]} arr - Sorted array
 * @returns {number[]} - Array of all magic indices
 */
function findAllMagicIndices(arr) {
  if (!arr || arr.length === 0) return [];

  const results = [];
  findAllMagicIndicesHelper(arr, 0, arr.length - 1, results);
  return results;
}

/**
 * Helper to find all magic indices
 * Pomocnik do znalezienia wszystkich magicznych indeksów
 */
function findAllMagicIndicesHelper(arr, start, end, results) {
  if (start > end) return;

  const mid = Math.floor((start + end) / 2);
  const midValue = arr[mid];

  // Check if current index is magic / Sprawdź czy obecny indeks jest magiczny
  if (midValue === mid) {
    results.push(mid);
  }

  // Search both sides / Przeszukaj obie strony
  const leftEnd = Math.min(mid - 1, midValue);
  findAllMagicIndicesHelper(arr, start, leftEnd, results);

  const rightStart = Math.max(mid + 1, midValue);
  findAllMagicIndicesHelper(arr, rightStart, end, results);
}

// ============================================================================
// HELPER FUNCTIONS / FUNKCJE POMOCNICZE
// ============================================================================

/**
 * Visualize array with indices
 * Wizualizuj tablicę z indeksami
 */
function visualizeArray(arr, magicIndex = null) {
  if (!arr || arr.length === 0) {
    console.log('(empty array)');
    return;
  }

  const indexRow = 'i: ' + arr.map((_, i) => i.toString().padStart(4)).join('');
  const valueRow = 'A: ' + arr.map(v => v.toString().padStart(4)).join('');
  const matchRow = '   ' + arr.map((v, i) => {
    if (v === i) return '  ^^';
    return '    ';
  }).join('');

  console.log(indexRow);
  console.log(valueRow);
  console.log(matchRow);

  if (magicIndex !== null && magicIndex !== -1) {
    console.log(`Magic index found at: ${magicIndex} (A[${magicIndex}] = ${arr[magicIndex]})`);
  } else if (magicIndex === -1) {
    console.log('No magic index found');
  }
}

/**
 * Test all approaches with an array
 * Testuj wszystkie podejścia z tablicą
 */
function testAllApproaches(arr, description) {
  console.log(description);
  console.log('-'.repeat(70));
  visualizeArray(arr);

  const linear = magicIndexLinear(arr);
  const binaryDist = magicIndexBinaryDistinct(arr);
  const binaryNonDist = magicIndexBinaryNonDistinct(arr);
  const allIndices = findAllMagicIndices(arr);

  console.log(`\nLinear Search:         ${linear}`);
  console.log(`Binary (distinct):     ${binaryDist}`);
  console.log(`Binary (non-distinct): ${binaryNonDist}`);
  console.log(`All magic indices:     [${allIndices.join(', ')}]`);

  // Verify consistency / Sprawdź spójność
  const consistent = (linear === binaryDist || binaryDist === -1) &&
                     (linear === binaryNonDist || linear === -1);
  console.log(`Results consistent: ${consistent ? '✓' : '✗'}`);
  console.log();
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('MAGIC INDEX - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Simple case with magic index at middle / Prosty przypadek z magicznym indeksem w środku
console.log('TEST 1: Simple case - magic index at position 3');
console.log('       Prosty przypadek - magiczny indeks na pozycji 3');
console.log('-'.repeat(70));
const arr1 = [-10, -5, 2, 3, 7, 9, 12, 13];
testAllApproaches(arr1, 'Array with magic index at 3:');

// Test 2: Magic index at start / Magiczny indeks na początku
console.log('TEST 2: Magic index at start (position 0)');
console.log('       Magiczny indeks na początku (pozycja 0)');
console.log('-'.repeat(70));
const arr2 = [0, 2, 5, 8, 17];
testAllApproaches(arr2, 'Array with magic index at 0:');

// Test 3: Magic index at end / Magiczny indeks na końcu
console.log('TEST 3: Magic index at end');
console.log('       Magiczny indeks na końcu');
console.log('-'.repeat(70));
const arr3 = [-5, -2, 0, 1, 2, 5];
testAllApproaches(arr3, 'Array with magic index at end (5):');

// Test 4: No magic index (all values too small) / Brak magicznego indeksu (wszystkie wartości za małe)
console.log('TEST 4: No magic index - all values too small');
console.log('       Brak magicznego indeksu - wszystkie wartości za małe');
console.log('-'.repeat(70));
const arr4 = [-10, -5, -1, 0, 1, 2, 4, 6];
testAllApproaches(arr4, 'Array with no magic index:');

// Test 5: No magic index (all values too large) / Brak magicznego indeksu (wszystkie wartości za duże)
console.log('TEST 5: No magic index - all values too large');
console.log('       Brak magicznego indeksu - wszystkie wartości za duże');
console.log('-'.repeat(70));
const arr5 = [10, 11, 12, 13, 14];
testAllApproaches(arr5, 'Array with no magic index:');

// Test 6: Multiple magic indices (non-distinct) / Wiele magicznych indeksów (nierozróżnialne)
console.log('TEST 6: Multiple magic indices (non-distinct values)');
console.log('       Wiele magicznych indeksów (wartości nierozróżnialne)');
console.log('-'.repeat(70));
const arr6 = [-10, -5, 2, 2, 2, 5, 5, 7, 9, 12, 13];
testAllApproaches(arr6, 'Array with duplicates and multiple magic indices:');

// Test 7: All same value / Wszystkie te same wartości
console.log('TEST 7: All same value');
console.log('       Wszystkie te same wartości');
console.log('-'.repeat(70));
const arr7 = [5, 5, 5, 5, 5, 5];
testAllApproaches(arr7, 'Array with all same value (5):');

// Test 8: Sequential values (all magic) / Wartości sekwencyjne (wszystkie magiczne)
console.log('TEST 8: Sequential values - all indices are magic');
console.log('       Wartości sekwencyjne - wszystkie indeksy magiczne');
console.log('-'.repeat(70));
const arr8 = [0, 1, 2, 3, 4, 5];
testAllApproaches(arr8, 'Array where A[i] = i for all i:');

// Test 9: Large negative values / Duże wartości ujemne
console.log('TEST 9: Large negative values at start');
console.log('       Duże wartości ujemne na początku');
console.log('-'.repeat(70));
const arr9 = [-100, -50, -20, 3, 10, 15];
testAllApproaches(arr9, 'Array with large negative values:');

// Test 10: Single element (magic) / Pojedynczy element (magiczny)
console.log('TEST 10: Single element - magic');
console.log('        Pojedynczy element - magiczny');
console.log('-'.repeat(70));
const arr10 = [0];
testAllApproaches(arr10, 'Single element array (magic):');

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: Empty array / Pusta tablica
console.log('EDGE CASE 1: Empty array');
console.log('            Pusta tablica');
console.log('-'.repeat(70));
testAllApproaches([], 'Empty array:');

// Edge Case 2: Single element (not magic) / Pojedynczy element (niemagiczny)
console.log('EDGE CASE 2: Single element - not magic');
console.log('            Pojedynczy element - niemagiczny');
console.log('-'.repeat(70));
const arrEdge2 = [5];
testAllApproaches(arrEdge2, 'Single element (not magic):');

// Edge Case 3: Two elements / Dwa elementy
console.log('EDGE CASE 3: Two elements');
console.log('            Dwa elementy');
console.log('-'.repeat(70));
const arrEdge3 = [-1, 1];
testAllApproaches(arrEdge3, 'Two elements with magic at 1:');

// ============================================================================
// PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI');
console.log('='.repeat(70));
console.log();

/**
 * Measure execution time
 * Zmierz czas wykonania
 */
function measureTime(fn, arr, name) {
  const start = process.hrtime.bigint();
  const result = fn(arr);
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to ms

  console.log(`${name.padEnd(30)}: result=${result.toString().padStart(3)}, time=${duration.toFixed(4)}ms`);
  return result;
}

// Create large array for performance testing / Utwórz dużą tablicę do testów wydajności
const largeArr = Array.from({ length: 10000 }, (_, i) => i - 5000 + Math.floor(i / 2));
// Add a magic index around the middle / Dodaj magiczny indeks około środka
largeArr[7500] = 7500;

console.log('Large array with 10,000 elements:');
console.log('Duża tablica z 10,000 elementami:');
console.log('-'.repeat(70));
measureTime(magicIndexLinear, largeArr, 'Linear Search');
measureTime(magicIndexBinaryDistinct, largeArr, 'Binary Search (distinct)');
measureTime(magicIndexBinaryNonDistinct, largeArr, 'Binary Search (non-distinct)');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Linear Search / Wyszukiwanie Liniowe');
console.log('  Time:  O(n)     - Check every element / Sprawdź każdy element');
console.log('  Space: O(1)     - No extra space / Brak dodatkowej pamięci');
console.log('  Use:   Small arrays or unsorted data / Małe tablice lub nieposortowane dane');
console.log();
console.log('APPROACH 2: Binary Search (Distinct) / Wyszukiwanie Binarne (Różne)');
console.log('  Time:  O(log n) - Binary search / Wyszukiwanie binarne');
console.log('  Space: O(log n) - Recursion stack / Stos rekurencji');
console.log('  Use:   BEST for distinct sorted values / NAJLEPSZE dla różnych wartości');
console.log();
console.log('APPROACH 3: Binary Search (Non-Distinct) / Wyszukiwanie Binarne (Nierozróżnialne)');
console.log('  Time:  O(n) worst, better average / O(n) najgorszy, lepsze średnio');
console.log('  Space: O(log n) - Recursion stack / Stos rekurencji');
console.log('  Use:   Arrays with duplicates / Tablice z duplikatami');
console.log('  Note:  Still faster than linear in practice / Nadal szybsze niż liniowe w praktyce');
console.log();
console.log('KEY OPTIMIZATION / KLUCZOWA OPTYMALIZACJA:');
console.log('  Distinct values:     O(n) → O(log n)');
console.log('  Non-distinct values: Still better than O(n) in practice');
console.log('                       Nadal lepsze niż O(n) w praktyce');
console.log('='.repeat(70));
