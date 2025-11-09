/**
 * Sub Sort - Find Unsorted Subsequence
 * Pod-Sortowanie - Znajdź Nieposortowany Podciąg
 */

/**
 * Podejście 1: Brute Force - Sortowanie i Porównanie - O(n log n)
 * Approach 1: Brute Force - Sort and Compare - O(n log n)
 *
 * Posortuj kopię i porównaj z oryginałem
 * Sort a copy and compare with original
 */
function findUnsortedSequenceBruteForce(arr) {
  if (arr.length <= 1) return { m: -1, n: -1 };

  const sorted = [...arr].sort((a, b) => a - b);

  let left = 0;
  let right = arr.length - 1;

  // Znajdź pierwszy element różny od posortowanego
  while (left < arr.length && arr[left] === sorted[left]) {
    left++;
  }

  // Jeśli cała tablica jest posortowana
  if (left === arr.length) {
    return { m: -1, n: -1 };
  }

  // Znajdź ostatni element różny od posortowanego
  while (right >= 0 && arr[right] === sorted[right]) {
    right--;
  }

  return { m: left, n: right };
}

/**
 * Podejście 2: Klasyczne Szczegółowe - O(n)
 * Approach 2: Classic Detailed - O(n)
 *
 * Znajdź lewą i prawą część, potem min/max, potem rozszerz granice
 * Find left and right parts, then min/max, then extend boundaries
 */
function findUnsortedSequenceDetailed(arr) {
  if (arr.length <= 1) return { m: -1, n: -1 };

  // Krok 1: Znajdź koniec lewej posortowanej części
  let endLeft = findEndOfLeftSubsequence(arr);
  if (endLeft >= arr.length - 1) {
    return { m: -1, n: -1 }; // Już posortowane
  }

  // Krok 2: Znajdź początek prawej posortowanej części
  let startRight = findStartOfRightSubsequence(arr);

  // Krok 3: Znajdź min i max w środkowej części
  let minIndex = endLeft + 1;
  let maxIndex = startRight;

  for (let i = endLeft + 1; i <= startRight; i++) {
    if (arr[i] < arr[minIndex]) minIndex = i;
    if (arr[i] > arr[maxIndex]) maxIndex = i;
  }

  // Krok 4: Rozszerz granice w lewo by uwzględnić minimum
  let leftBound = shrinkLeft(arr, minIndex, endLeft);

  // Krok 5: Rozszerz granice w prawo by uwzględnić maksimum
  let rightBound = shrinkRight(arr, maxIndex, startRight);

  return { m: leftBound, n: rightBound };
}

function findEndOfLeftSubsequence(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return i - 1;
    }
  }
  return arr.length - 1;
}

function findStartOfRightSubsequence(arr) {
  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > arr[i + 1]) {
      return i + 1;
    }
  }
  return 0;
}

function shrinkLeft(arr, minIndex, start) {
  let comp = arr[minIndex];
  for (let i = start; i >= 0; i--) {
    if (arr[i] <= comp) {
      return i + 1;
    }
  }
  return 0;
}

function shrinkRight(arr, maxIndex, start) {
  let comp = arr[maxIndex];
  for (let i = start; i < arr.length; i++) {
    if (arr[i] >= comp) {
      return i - 1;
    }
  }
  return arr.length - 1;
}

/**
 * Podejście 3: Uproszczone - O(n) ✓ OPTYMALNE
 * Approach 3: Simplified - O(n) ✓ OPTIMAL
 *
 * Dwa przejścia: szukaj prawej granicy od lewej, lewej granicy od prawej
 * Two passes: find right boundary from left, left boundary from right
 */
function findUnsortedSequence(arr) {
  if (arr.length <= 1) return { m: -1, n: -1 };

  // Krok 1: Znajdź prawą granicę (ostatni element "nie na miejscu")
  // Od lewej: śledzmy max, jeśli element < max to jest "nie na miejscu"
  let rightBound = -1;
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < max) {
      rightBound = i; // Ten element musi być w nieposortowanej części
    } else {
      max = arr[i]; // Aktualizuj maksimum
    }
  }

  // Jeśli nie znaleziono, tablica jest posortowana
  if (rightBound === -1) return { m: -1, n: -1 };

  // Krok 2: Znajdź lewą granicę (pierwszy element "nie na miejscu")
  // Od prawej: śledź min, jeśli element > min to jest "nie na miejscu"
  let leftBound = 0;
  let min = arr[arr.length - 1];

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > min) {
      leftBound = i; // Ten element musi być w nieposortowanej części
    } else {
      min = arr[i]; // Aktualizuj minimum
    }
  }

  return { m: leftBound, n: rightBound };
}

/**
 * Podejście 4: Z Wizualizacją - O(n)
 * Approach 4: With Visualization - O(n)
 *
 * Pokazuje krok po kroku jak algorytm działa
 * Shows step by step how the algorithm works
 */
function findUnsortedSequenceVerbose(arr) {
  console.log('\nAnaliza tablicy:', arr);

  if (arr.length <= 1) {
    console.log('Tablica ma ≤1 element, jest posortowana');
    return { m: -1, n: -1 };
  }

  // Przejście od lewej
  console.log('\n--- Przejście od lewej (szukamy prawej granicy) ---');
  let rightBound = -1;
  let max = arr[0];
  console.log(`Start: max=${max}`);

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < max) {
      rightBound = i;
      console.log(`i=${i}: arr[${i}]=${arr[i]} < max=${max} → rightBound=${i}`);
    } else {
      console.log(`i=${i}: arr[${i}]=${arr[i]} ≥ max=${max} → max=${arr[i]}`);
      max = arr[i];
    }
  }

  if (rightBound === -1) {
    console.log('\nTablica jest posortowana (rightBound=-1)');
    return { m: -1, n: -1 };
  }

  // Przejście od prawej
  console.log('\n--- Przejście od prawej (szukamy lewej granicy) ---');
  let leftBound = 0;
  let min = arr[arr.length - 1];
  console.log(`Start: min=${min}`);

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > min) {
      leftBound = i;
      console.log(`i=${i}: arr[${i}]=${arr[i]} > min=${min} → leftBound=${i}`);
    } else {
      console.log(`i=${i}: arr[${i}]=${arr[i]} ≤ min=${min} → min=${arr[i]}`);
      min = arr[i];
    }
  }

  console.log(`\nWynik: m=${leftBound}, n=${rightBound}`);
  console.log(`Podciąg do posortowania: [${arr.slice(leftBound, rightBound + 1)}]`);

  return { m: leftBound, n: rightBound };
}

/**
 * Funkcja pomocnicza: Sprawdź czy wynik jest poprawny
 * Helper function: Verify if result is correct
 */
function verifyResult(arr, m, n) {
  if (m === -1 && n === -1) {
    // Sprawdź czy tablica jest posortowana
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  }

  // Posortuj podciąg i sprawdź czy cała tablica jest posortowana
  const copy = [...arr];
  const middle = copy.slice(m, n + 1).sort((a, b) => a - b);

  for (let i = 0; i < middle.length; i++) {
    copy[m + i] = middle[i];
  }

  // Sprawdź czy cała tablica jest teraz posortowana
  for (let i = 1; i < copy.length; i++) {
    if (copy[i] < copy[i - 1]) return false;
  }

  return true;
}

/**
 * Funkcja pomocnicza: Wygeneruj losową prawie posortowaną tablicę
 * Helper function: Generate random nearly sorted array
 */
function generateNearlySortedArray(size, swaps = 5) {
  // Stwórz posortowaną tablicę
  const arr = Array.from({ length: size }, (_, i) => i + 1);

  // Wykonaj kilka losowych zamian
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }

  return arr;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Sub Sort - Find Unsorted Subsequence ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania');
const arr1 = [1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19];
console.log(`Tablica: [${arr1}]`);
const result1 = findUnsortedSequence(arr1);
console.log(`Wynik: m=${result1.m}, n=${result1.n}`);
console.log(`Oczekiwane: m=3, n=9`);
console.log(`Poprawny: ${verifyResult(arr1, result1.m, result1.n) ? '✓' : '✗'}\n`);

// Test 2: Wizualizacja
console.log('Test 2: Wizualizacja krok po kroku');
findUnsortedSequenceVerbose([1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19]);

// Test 3: Już posortowana
console.log('\nTest 3: Tablica już posortowana');
const arr3 = [1, 2, 3, 4, 5];
const result3 = findUnsortedSequence(arr3);
console.log(`Tablica: [${arr3}]`);
console.log(`Wynik: m=${result3.m}, n=${result3.n}`);
console.log(`Oczekiwane: m=-1, n=-1`);
console.log(`Poprawny: ${verifyResult(arr3, result3.m, result3.n) ? '✓' : '✗'}\n`);

// Test 4: Całkowicie odwrócona
console.log('Test 4: Całkowicie odwrócona');
const arr4 = [5, 4, 3, 2, 1];
const result4 = findUnsortedSequence(arr4);
console.log(`Tablica: [${arr4}]`);
console.log(`Wynik: m=${result4.m}, n=${result4.n}`);
console.log(`Oczekiwane: m=0, n=4`);
console.log(`Poprawny: ${verifyResult(arr4, result4.m, result4.n) ? '✓' : '✗'}\n`);

// Test 5: Dwa elementy zamienione
console.log('Test 5: Dwa elementy zamienione');
const testCases5 = [
  [1, 3, 2, 4, 5],
  [2, 1, 3, 4, 5],
  [1, 2, 3, 5, 4],
  [1, 2, 5, 4, 3],
];

testCases5.forEach((arr, idx) => {
  const result = findUnsortedSequence(arr);
  const valid = verifyResult(arr, result.m, result.n);
  console.log(`  ${idx + 1}. [${arr}] → m=${result.m}, n=${result.n} ${valid ? '✓' : '✗'}`);
});
console.log();

// Test 6: Edge cases
console.log('Test 6: Edge cases');

console.log('a) Pusta tablica:');
const result6a = findUnsortedSequence([]);
console.log(`   Wynik: m=${result6a.m}, n=${result6a.n}`);
console.log(`   Poprawny: ${verifyResult([], result6a.m, result6a.n) ? '✓' : '✗'}\n`);

console.log('b) Jeden element:');
const result6b = findUnsortedSequence([5]);
console.log(`   Wynik: m=${result6b.m}, n=${result6b.n}`);
console.log(`   Poprawny: ${verifyResult([5], result6b.m, result6b.n) ? '✓' : '✗'}\n`);

console.log('c) Dwa elementy posortowane:');
const result6c = findUnsortedSequence([1, 2]);
console.log(`   Wynik: m=${result6c.m}, n=${result6c.n}`);
console.log(`   Poprawny: ${verifyResult([1, 2], result6c.m, result6c.n) ? '✓' : '✗'}\n`);

console.log('d) Dwa elementy nieposortowane:');
const result6d = findUnsortedSequence([2, 1]);
console.log(`   Wynik: m=${result6d.m}, n=${result6d.n}`);
console.log(`   Poprawny: ${verifyResult([2, 1], result6d.m, result6d.n) ? '✓' : '✗'}\n`);

// Test 7: Duplikaty
console.log('Test 7: Duplikaty');
const duplicateTests = [
  [1, 2, 2, 3, 4],
  [1, 3, 2, 2, 4],
  [1, 1, 1, 1, 1],
  [1, 2, 3, 3, 2, 4],
];

duplicateTests.forEach((arr, idx) => {
  const result = findUnsortedSequence(arr);
  const valid = verifyResult(arr, result.m, result.n);
  console.log(`  ${idx + 1}. [${arr}] → m=${result.m}, n=${result.n} ${valid ? '✓' : '✗'}`);
});
console.log();

// Test 8: Liczby ujemne
console.log('Test 8: Liczby ujemne');
const negativeTests = [
  [-5, -3, -1, 0, 2],
  [-5, -1, -3, 0, 2],
  [1, 0, -1, -2, -3],
  [-3, -2, -1, 0, 1],
];

negativeTests.forEach((arr, idx) => {
  const result = findUnsortedSequence(arr);
  const valid = verifyResult(arr, result.m, result.n);
  console.log(`  ${idx + 1}. [${arr}] → m=${result.m}, n=${result.n} ${valid ? '✓' : '✗'}`);
});
console.log();

// Test 9: Porównanie wszystkich metod
console.log('Test 9: Porównanie wszystkich metod');
const testArr = [1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19];

const r1 = findUnsortedSequenceBruteForce(testArr);
const r2 = findUnsortedSequenceDetailed(testArr);
const r3 = findUnsortedSequence(testArr);

console.log(`Tablica: [${testArr}]`);
console.log(`Brute Force:  m=${r1.m}, n=${r1.n}`);
console.log(`Detailed:     m=${r2.m}, n=${r2.n}`);
console.log(`Simplified:   m=${r3.m}, n=${r3.n}`);
console.log(`Wszystkie zgodne: ${
  r1.m === r2.m && r2.m === r3.m && r1.n === r2.n && r2.n === r3.n ? '✓' : '✗'
}\n`);

// Test 10: Weryfikacja poprawności
console.log('Test 10: Weryfikacja poprawności wszystkich metod');
const verificationTests = [
  [1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [1, 3, 2, 4, 5],
  [1, 2, 3, 5, 4],
  [],
  [1],
  [2, 1],
];

let allCorrect = true;
verificationTests.forEach((arr, idx) => {
  const r1 = findUnsortedSequenceBruteForce(arr);
  const r2 = findUnsortedSequenceDetailed(arr);
  const r3 = findUnsortedSequence(arr);

  const v1 = verifyResult(arr, r1.m, r1.n);
  const v2 = verifyResult(arr, r2.m, r2.n);
  const v3 = verifyResult(arr, r3.m, r3.n);

  const correct = v1 && v2 && v3 && r1.m === r2.m && r2.m === r3.m && r1.n === r2.n && r2.n === r3.n;
  allCorrect = allCorrect && correct;

  console.log(`  Test ${idx + 1}: ${correct ? '✓' : '✗'} [${arr.length === 0 ? 'empty' : arr.join(', ')}]`);
  if (!correct) {
    console.log(`    BF: m=${r1.m}, n=${r1.n}, valid=${v1}`);
    console.log(`    Det: m=${r2.m}, n=${r2.n}, valid=${v2}`);
    console.log(`    Simp: m=${r3.m}, n=${r3.n}, valid=${v3}`);
  }
});

console.log(`\nWszystkie testy: ${allCorrect ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 11: Test wydajności
console.log('Test 11: Test wydajności');
const sizes = [100, 1000, 10000];

sizes.forEach(size => {
  const arr = generateNearlySortedArray(size, Math.floor(size / 10));

  let start = Date.now();
  const r1 = findUnsortedSequenceBruteForce(arr);
  const time1 = Date.now() - start;

  start = Date.now();
  const r2 = findUnsortedSequence(arr);
  const time2 = Date.now() - start;

  console.log(`  n=${size}:`);
  console.log(`    Brute Force (O(n log n)): ${time1}ms`);
  console.log(`    Optimal (O(n)):           ${time2}ms`);
  console.log(`    Speedup: ${(time1 / time2).toFixed(2)}x`);
});
console.log();

// Test 12: Wizualizacja różnych przypadków
console.log('Test 12: Wizualizacja różnych przypadków');

console.log('\na) Nieposortowany środek:');
findUnsortedSequenceVerbose([1, 2, 5, 3, 4, 6, 7]);

console.log('\nb) Nieposortowany początek:');
findUnsortedSequenceVerbose([3, 2, 1, 4, 5, 6]);

console.log('\nc) Nieposortowany koniec:');
findUnsortedSequenceVerbose([1, 2, 3, 6, 5, 4]);

// Test 13: Bardzo długie posortowane części
console.log('\nTest 13: Bardzo długie posortowane części');
const arr13 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 11, 12, 13, 14, 16, 17, 18, 19, 20];
const result13 = findUnsortedSequence(arr13);
console.log(`Tablica: [${arr13}]`);
console.log(`Wynik: m=${result13.m}, n=${result13.n}`);
console.log(`Podciąg: [${arr13.slice(result13.m, result13.n + 1)}]`);
console.log(`Poprawny: ${verifyResult(arr13, result13.m, result13.n) ? '✓' : '✗'}\n`);

// Test 14: Minimalna różnica
console.log('Test 14: Minimalna różnica (długość 2-4)');
const minimalTests = [
  [1, 3, 2],
  [2, 1, 3],
  [1, 4, 3, 2],
  [1, 2, 4, 3],
];

minimalTests.forEach((arr, idx) => {
  const result = findUnsortedSequence(arr);
  const length = result.n - result.m + 1;
  console.log(`  ${idx + 1}. [${arr}] → m=${result.m}, n=${result.n}, długość=${length}`);
});
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Sub Sort - Znajdź najmniejszy podciąg do posortowania');
console.log('\nZłożoność (optymalna metoda):');
console.log('  Czasowa:  O(n) - dwa niezależne przejścia przez tablicę');
console.log('  Pamięciowa: O(1) - tylko kilka zmiennych');
console.log('\nKluczowa idea:');
console.log('  1. Od lewej: śledź max, jeśli element < max → musi być w nieposortowanej części');
console.log('  2. Od prawej: śledź min, jeśli element > min → musi być w nieposortowanej części');
console.log('  3. To daje nam dokładnie granice podciągu do posortowania');
console.log('\nZastosowania:');
console.log('  - Optymalizacja sortowania (sortuj tylko potrzebną część)');
console.log('  - Analiza prawie posortowanych danych');
console.log('  - Walidacja integralności danych');
console.log('  - Identyfikacja anomalii w uporządkowanych sekwencjach');
