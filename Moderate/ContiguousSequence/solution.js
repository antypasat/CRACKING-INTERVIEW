/**
 * Contiguous Sequence - Maximum Subarray Sum (Kadane's Algorithm)
 * Ciągły podciąg o największej sumie (Algorytm Kadane'a)
 */

/**
 * Podejście 1: Brute Force - O(n³)
 * Approach 1: Brute Force - O(n³)
 *
 * Sprawdź wszystkie możliwe podciągi
 * Check all possible subarrays
 */
function maxSubArrayBruteForce(arr) {
  if (arr.length === 0) return 0;

  let maxSum = -Infinity;

  // Wybierz punkt początkowy
  for (let i = 0; i < arr.length; i++) {
    // Wybierz punkt końcowy
    for (let j = i; j < arr.length; j++) {
      // Oblicz sumę od i do j
      let sum = 0;
      for (let k = i; k <= j; k++) {
        sum += arr[k];
      }
      maxSum = Math.max(maxSum, sum);
    }
  }

  return maxSum;
}

/**
 * Podejście 2: Brute Force Ulepszone - O(n²)
 * Approach 2: Improved Brute Force - O(n²)
 *
 * Obliczaj sumę narastająco
 * Calculate sum incrementally
 */
function maxSubArrayBetter(arr) {
  if (arr.length === 0) return 0;

  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    let currentSum = 0;
    // Rozszerzaj podciąg od i
    for (let j = i; j < arr.length; j++) {
      currentSum += arr[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}

/**
 * Podejście 3: Algorytm Kadane'a - O(n) ✓ OPTYMALNE
 * Approach 3: Kadane's Algorithm - O(n) ✓ OPTIMAL
 *
 * Klasyczny algorytm Kadane'a do maksymalnego podciągu
 * Classic Kadane's algorithm for maximum subarray
 */
function maxSubArray(arr) {
  if (arr.length === 0) return 0;

  let maxEndingHere = arr[0];  // Maksymalna suma kończąca się w tym miejscu
  let maxSoFar = arr[0];        // Maksymalna suma znaleziona do tej pory

  for (let i = 1; i < arr.length; i++) {
    // Dwa wybory: dołącz do obecnego podciągu lub zacznij nowy
    // Two choices: extend current subarray or start new one
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);

    // Aktualizuj globalne maksimum
    // Update global maximum
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

/**
 * Podejście 4: Kadane z Śledzeniem Indeksów - O(n)
 * Approach 4: Kadane with Index Tracking - O(n)
 *
 * Zwraca sumę oraz indeksy początku i końca podciągu
 * Returns sum and start/end indices of the subarray
 */
function maxSubArrayWithIndices(arr) {
  if (arr.length === 0) {
    return { sum: 0, start: -1, end: -1, subarray: [] };
  }

  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];

  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    // Jeśli zaczynamy nowy podciąg
    if (arr[i] > maxEndingHere + arr[i]) {
      maxEndingHere = arr[i];
      tempStart = i;
    } else {
      maxEndingHere = maxEndingHere + arr[i];
    }

    // Aktualizuj maksimum i indeksy
    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }
  }

  return {
    sum: maxSoFar,
    start,
    end,
    subarray: arr.slice(start, end + 1)
  };
}

/**
 * Podejście 5: Divide and Conquer - O(n log n)
 * Approach 5: Divide and Conquer - O(n log n)
 *
 * Rekurencyjne podejście dziel i zwyciężaj
 * Recursive divide and conquer approach
 */
function maxCrossingSum(arr, left, mid, right) {
  // Suma lewej strony od środka
  let leftSum = -Infinity;
  let sum = 0;
  for (let i = mid; i >= left; i--) {
    sum += arr[i];
    leftSum = Math.max(leftSum, sum);
  }

  // Suma prawej strony od środka
  let rightSum = -Infinity;
  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += arr[i];
    rightSum = Math.max(rightSum, sum);
  }

  return leftSum + rightSum;
}

function maxSubArrayDivideConquer(arr, left = 0, right = arr.length - 1) {
  if (arr.length === 0) return 0;
  if (left === right) return arr[left];

  const mid = Math.floor((left + right) / 2);

  // Rekurencyjnie znajdź maksimum w lewej i prawej połowie
  const leftMax = maxSubArrayDivideConquer(arr, left, mid);
  const rightMax = maxSubArrayDivideConquer(arr, mid + 1, right);

  // Znajdź maksimum przechodzące przez środek
  const crossMax = maxCrossingSum(arr, left, mid, right);

  // Zwróć największe z trzech
  return Math.max(leftMax, rightMax, crossMax);
}

/**
 * Funkcja pomocnicza: Wizualizacja algorytmu Kadane'a
 * Helper function: Visualize Kadane's algorithm
 */
function visualizeKadane(arr) {
  console.log('\nWizualizacja Algorytmu Kadane\'a:');
  console.log(`Tablica: [${arr}]\n`);

  if (arr.length === 0) {
    console.log('Pusta tablica!');
    return;
  }

  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];
  let start = 0, end = 0, tempStart = 0;

  console.log(`i=0: arr[0]=${arr[0]}`);
  console.log(`  maxEndingHere = ${maxEndingHere}`);
  console.log(`  maxSoFar = ${maxSoFar}`);

  for (let i = 1; i < arr.length; i++) {
    console.log(`\ni=${i}: arr[${i}]=${arr[i]}`);

    if (arr[i] > maxEndingHere + arr[i]) {
      console.log(`  ${arr[i]} > ${maxEndingHere} + ${arr[i]} = ${maxEndingHere + arr[i]}`);
      console.log(`  → Zaczynam nowy podciąg od indeksu ${i}`);
      maxEndingHere = arr[i];
      tempStart = i;
    } else {
      console.log(`  ${maxEndingHere} + ${arr[i]} = ${maxEndingHere + arr[i]} > ${arr[i]}`);
      console.log(`  → Kontynuuję obecny podciąg`);
      maxEndingHere = maxEndingHere + arr[i];
    }

    console.log(`  maxEndingHere = ${maxEndingHere}`);

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
      console.log(`  → NOWE MAKSIMUM! maxSoFar = ${maxSoFar}`);
    } else {
      console.log(`  maxSoFar = ${maxSoFar} (bez zmian)`);
    }
  }

  console.log(`\nWynik: suma=${maxSoFar}, podciąg=[${arr.slice(start, end + 1)}] (indeksy ${start}-${end})`);
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Contiguous Sequence - Maximum Subarray Sum (Kadane\'s Algorithm) ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania');
const arr1 = [2, -8, 3, -2, 4, -10];
console.log(`Tablica: [${arr1}]`);
const result1 = maxSubArray(arr1);
const details1 = maxSubArrayWithIndices(arr1);
console.log(`Wynik: ${result1}`);
console.log(`Podciąg: [${details1.subarray}] (indeksy ${details1.start}-${details1.end})`);
console.log(`Oczekiwane: 5 (podciąg [3, -2, 4])\n`);

// Test 2: Wizualizacja
console.log('Test 2: Wizualizacja krok po kroku');
visualizeKadane([2, -8, 3, -2, 4, -10]);
console.log();

// Test 3: Wszystkie liczby dodatnie
console.log('Test 3: Wszystkie liczby dodatnie');
const arr3 = [1, 2, 3, 4, 5];
const result3 = maxSubArray(arr3);
const details3 = maxSubArrayWithIndices(arr3);
console.log(`Tablica: [${arr3}]`);
console.log(`Wynik: ${result3}`);
console.log(`Podciąg: [${details3.subarray}]`);
console.log(`Oczekiwane: 15 (cała tablica)\n`);

// Test 4: Wszystkie liczby ujemne
console.log('Test 4: Wszystkie liczby ujemne');
const arr4 = [-5, -2, -8, -1, -4];
const result4 = maxSubArray(arr4);
const details4 = maxSubArrayWithIndices(arr4);
console.log(`Tablica: [${arr4}]`);
console.log(`Wynik: ${result4}`);
console.log(`Podciąg: [${details4.subarray}]`);
console.log(`Oczekiwane: -1 (najmniej ujemna liczba)\n`);

// Test 5: Mieszane wartości
console.log('Test 5: Różne kombinacje');
const testCases = [
  [1, -3, 2, -1, 3],
  [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  [5, -3, 5],
  [-1, -2, -3, -4],
  [10]
];

testCases.forEach((arr, idx) => {
  const result = maxSubArrayWithIndices(arr);
  console.log(`  ${idx + 1}. [${arr}] → suma=${result.sum}, podciąg=[${result.subarray}]`);
});
console.log();

// Test 6: Edge cases
console.log('Test 6: Edge cases');

console.log('a) Pusta tablica:');
const result6a = maxSubArray([]);
console.log(`   Wynik: ${result6a}\n`);

console.log('b) Jeden element dodatni:');
const result6b = maxSubArray([5]);
console.log(`   Wynik: ${result6b}\n`);

console.log('c) Jeden element ujemny:');
const result6c = maxSubArray([-3]);
console.log(`   Wynik: ${result6c}\n`);

console.log('d) Dwa elementy:');
const result6d = maxSubArrayWithIndices([3, -5]);
console.log(`   Wynik: suma=${result6d.sum}, podciąg=[${result6d.subarray}]\n`);

console.log('e) Zera w tablicy:');
const result6e = maxSubArrayWithIndices([0, -1, 0, -2, 0]);
console.log(`   Wynik: suma=${result6e.sum}, podciąg=[${result6e.subarray}]\n`);

// Test 7: Porównanie wszystkich metod
console.log('Test 7: Porównanie wszystkich metod');
const testArr = [2, -8, 3, -2, 4, -10];

const r1 = maxSubArrayBruteForce(testArr);
const r2 = maxSubArrayBetter(testArr);
const r3 = maxSubArray(testArr);
const r4 = maxSubArrayDivideConquer(testArr);

console.log(`Tablica: [${testArr}]`);
console.log(`Brute Force (O(n³)):     ${r1}`);
console.log(`Better Brute (O(n²)):    ${r2}`);
console.log(`Kadane (O(n)):           ${r3}`);
console.log(`Divide & Conquer (O(n log n)): ${r4}`);
console.log(`Wszystkie zgodne: ${r1 === r2 && r2 === r3 && r3 === r4 ? '✓' : '✗'}\n`);

// Test 8: Test wydajności
console.log('Test 8: Test wydajności (n=10000)');
const bigArr = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 200) - 100);

let start = Date.now();
const resultBetter = maxSubArrayBetter(bigArr.slice(0, 1000)); // Tylko 1000 dla O(n²)
const timeBetter = Date.now() - start;

start = Date.now();
const resultKadane = maxSubArray(bigArr);
const timeKadane = Date.now() - start;

start = Date.now();
const resultDC = maxSubArrayDivideConquer(bigArr);
const timeDC = Date.now() - start;

console.log(`Better Brute (n=1000): ${timeBetter}ms`);
console.log(`Kadane (n=10000):      ${timeKadane}ms`);
console.log(`Divide & Conquer:      ${timeDC}ms`);
console.log(`Kadane jest ${Math.round(timeDC / timeKadane)}x szybszy od D&C\n`);

// Test 9: Różne rozmiary tablic
console.log('Test 9: Różne rozmiary tablic');
[10, 100, 1000, 10000].forEach(size => {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100);

  const start = Date.now();
  const result = maxSubArray(arr);
  const time = Date.now() - start;

  console.log(`  n=${size.toString().padStart(5)}: ${time}ms, suma=${result}`);
});
console.log();

// Test 10: Poprawność dla wszystkich przypadków
console.log('Test 10: Weryfikacja poprawności');
const verificationTests = [
  { arr: [1, 2, 3], expected: 6 },
  { arr: [-1, -2, -3], expected: -1 },
  { arr: [2, -8, 3, -2, 4, -10], expected: 5 },
  { arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
  { arr: [5], expected: 5 },
  { arr: [-5], expected: -5 }
];

let allCorrect = true;
verificationTests.forEach(({ arr, expected }, idx) => {
  const result = maxSubArray(arr);
  const correct = result === expected;
  allCorrect = allCorrect && correct;
  console.log(`  Test ${idx + 1}: [${arr}] → ${result} ${correct ? '✓' : '✗ (oczekiwane: ' + expected + ')'}`);
});

console.log(`\nWszystkie testy: ${allCorrect ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 11: Przypadek "góra-dół-góra"
console.log('Test 11: Wzorce "góra-dół-góra"');
const arr11 = [10, -5, 10, -5, 10];
const result11 = maxSubArrayWithIndices(arr11);
console.log(`Tablica: [${arr11}]`);
console.log(`Wynik: suma=${result11.sum}, podciąg=[${result11.subarray}]`);
console.log(`(Cała tablica bo sumy dodatnie przeważają nad ujemnymi)\n`);

// Test 12: Duże wartości dodatnie i ujemne
console.log('Test 12: Ekstremalne wartości');
const arr12 = [1000, -999, 1000, -999, 1000];
const result12 = maxSubArrayWithIndices(arr12);
console.log(`Tablica: [${arr12}]`);
console.log(`Wynik: suma=${result12.sum}, podciąg=[${result12.subarray}]\n`);

// Test 13: Alternatywna implementacja Kadane'a
console.log('Test 13: Alternatywna forma Kadane\'a');

function maxSubArrayAlt(arr) {
  if (arr.length === 0) return 0;

  let currentSum = 0;
  let maxSum = -Infinity;

  for (let num of arr) {
    currentSum = currentSum + num;
    maxSum = Math.max(maxSum, currentSum);

    // Jeśli suma spadła poniżej 0, zresetuj
    if (currentSum < 0) {
      currentSum = 0;
    }
  }

  return maxSum;
}

const arr13 = [2, -8, 3, -2, 4, -10];
const result13a = maxSubArray(arr13);
const result13b = maxSubArrayAlt(arr13);
console.log(`Standardowa Kadane: ${result13a}`);
console.log(`Alternatywna forma: ${result13b}`);
console.log(`Zgodne: ${result13a === result13b ? '✓' : '✗'}\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('Algorytm Kadane\'a - Klasyczne rozwiązanie problemu maksymalnego podciągu');
console.log('\nZłożoność:');
console.log('  Czasowa:  O(n) - jedno przejście przez tablicę');
console.log('  Pamięciowa: O(1) - tylko kilka zmiennych');
console.log('\nKluczowa idea:');
console.log('  W każdym punkcie: dołącz element do obecnego podciągu');
console.log('  lub zacznij nowy podciąg, w zależności co daje większą sumę');
console.log('\nZastosowania:');
console.log('  - Analiza finansowa (najlepszy okres inwestycji)');
console.log('  - Przetwarzanie obrazu (najjaśniejsze regiony)');
console.log('  - Genomika (sekwencje o wysokiej zawartości GC)');
console.log('  - Analiza danych szeregów czasowych');
