/**
 * Pairs with Sum
 * Znajdowanie par liczb o danej sumie
 * Finding pairs of numbers with a given sum
 */

/**
 * Podejście 1: Brute Force - O(n²)
 * Approach 1: Brute Force - O(n²)
 *
 * Sprawdź wszystkie możliwe pary
 * Check all possible pairs
 */
function pairsWithSumBruteForce(arr, targetSum) {
  const pairs = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === targetSum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}

/**
 * Podejście 2: Hash Set - O(n)
 * Approach 2: Hash Set - O(n)
 *
 * Dla każdego elementu sprawdź czy complement był widziany
 * For each element check if complement was seen
 *
 * Uwaga: Może mieć problemy z duplikatami
 * Note: May have issues with duplicates
 */
function pairsWithSumSet(arr, targetSum) {
  const seen = new Set();
  const pairs = [];

  for (let num of arr) {
    const complement = targetSum - num;

    // Jeśli complement był już widziany, mamy parę
    // If complement was already seen, we have a pair
    if (seen.has(complement)) {
      pairs.push([complement, num]);
    }

    seen.add(num);
  }

  return pairs;
}

/**
 * Podejście 3: Hash Map z Licznikiem - O(n) ✓ OPTYMALNE
 * Approach 3: Hash Map with Counter - O(n) ✓ OPTIMAL
 *
 * Poprawnie obsługuje duplikaty
 * Correctly handles duplicates
 */
function pairsWithSum(arr, targetSum) {
  const countMap = new Map();
  const pairs = [];

  // Zlicz wystąpienia każdej liczby
  // Count occurrences of each number
  for (let num of arr) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Znajdź pary
  // Find pairs
  for (let num of countMap.keys()) {
    const complement = targetSum - num;

    if (countMap.has(complement)) {
      const count = countMap.get(num);
      const complementCount = countMap.get(complement);

      if (num === complement) {
        // Specjalny przypadek: para z samym sobą (num + num = targetSum)
        // Special case: pair with itself (num + num = targetSum)
        // Liczba par = C(count, 2) = count * (count - 1) / 2
        const numPairs = Math.floor(count * (count - 1) / 2);
        for (let i = 0; i < numPairs; i++) {
          pairs.push([num, num]);
        }
      } else if (num < complement) {
        // Unikaj duplikatów: dodaj tylko gdy num < complement
        // Avoid duplicates: only add when num < complement
        const numPairs = count * complementCount;
        for (let i = 0; i < numPairs; i++) {
          pairs.push([num, complement]);
        }
      }
    }
  }

  return pairs;
}

/**
 * Podejście 4: Sortowanie + Dwa Wskaźniki - O(n log n)
 * Approach 4: Sorting + Two Pointers - O(n log n)
 *
 * Sortuj tablicę, użyj dwóch wskaźników
 * Sort array, use two pointers
 */
function pairsWithSumTwoPointers(arr, targetSum) {
  // Sortuj kopię tablicy
  // Sort copy of array
  const sorted = [...arr].sort((a, b) => a - b);
  const pairs = [];

  let left = 0;
  let right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left] + sorted[right];

    if (sum === targetSum) {
      pairs.push([sorted[left], sorted[right]]);

      // Obsłuż duplikaty (opcjonalnie)
      // Handle duplicates (optional)
      let leftVal = sorted[left];
      let rightVal = sorted[right];

      // Pomiń duplikaty z lewej
      while (left < right && sorted[left] === leftVal) left++;
      // Pomiń duplikaty z prawej
      while (left < right && sorted[right] === rightVal) right--;
    } else if (sum < targetSum) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}

/**
 * Wariant: Zwróć tylko liczbę par (bez generowania)
 * Variant: Return only count of pairs (without generating)
 */
function countPairsWithSum(arr, targetSum) {
  const countMap = new Map();

  for (let num of arr) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  let totalPairs = 0;

  for (let num of countMap.keys()) {
    const complement = targetSum - num;

    if (countMap.has(complement)) {
      const count = countMap.get(num);
      const complementCount = countMap.get(complement);

      if (num === complement) {
        totalPairs += Math.floor(count * (count - 1) / 2);
      } else if (num < complement) {
        totalPairs += count * complementCount;
      }
    }
  }

  return totalPairs;
}

/**
 * Wariant: Unikalne wartości (każda liczba może być użyta tylko raz)
 * Variant: Unique values (each number can be used only once)
 */
function pairsWithSumUnique(arr, targetSum) {
  const available = new Set(arr);
  const pairs = [];
  const used = new Set();

  for (let num of arr) {
    if (used.has(num)) continue;

    const complement = targetSum - num;

    if (available.has(complement) && !used.has(complement) && num !== complement) {
      pairs.push([Math.min(num, complement), Math.max(num, complement)]);
      used.add(num);
      used.add(complement);
    }
  }

  return pairs;
}

/**
 * Funkcja pomocnicza: Wizualizacja procesu znajdowania par
 * Helper function: Visualize pair finding process
 */
function visualizePairFinding(arr, targetSum) {
  console.log(`\nWizualizacja dla arr=[${arr}], targetSum=${targetSum}:`);
  console.log('\nUżywam metody Hash Set:\n');

  const seen = new Set();
  const pairs = [];

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    const complement = targetSum - num;

    console.log(`i=${i}: num=${num}, complement=${complement}`);
    console.log(`  Seen: {${Array.from(seen).join(', ')}}`);

    if (seen.has(complement)) {
      console.log(`  ✓ Znaleziono parę: (${complement}, ${num})`);
      pairs.push([complement, num]);
    } else {
      console.log(`  - Complement nie znaleziony, dodaję ${num} do seen`);
    }

    seen.add(num);
  }

  console.log(`\nZnalezione pary: ${JSON.stringify(pairs)}`);
  console.log(`Liczba par: ${pairs.length}`);
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Pairs with Sum ===\n');

// Test 1: Przykład podstawowy
console.log('Test 1: Przykład podstawowy');
const arr1 = [1, 2, 3, 9, 11, 13, 14];
const target1 = 25;
console.log(`Tablica: [${arr1}]`);
console.log(`Target Sum: ${target1}`);

const result1a = pairsWithSumBruteForce(arr1, target1);
const result1b = pairsWithSum(arr1, target1);

console.log(`Brute Force: ${JSON.stringify(result1a)}`);
console.log(`Hash Map:    ${JSON.stringify(result1b)}`);
console.log();

// Test 2: Proste pary
console.log('Test 2: Proste pary');
const arr2 = [1, 2, 3, 4, 5];
const target2 = 6;
console.log(`Tablica: [${arr2}]`);
console.log(`Target Sum: ${target2}`);

const result2 = pairsWithSum(arr2, target2);
console.log(`Wynik: ${JSON.stringify(result2)}`);
console.log(`Oczekiwane: (1,5) i (2,4)\n`);

// Test 3: Wizualizacja
console.log('Test 3: Wizualizacja krok po kroku');
visualizePairFinding([1, 5, 2, 4, 3], 6);
console.log();

// Test 4: Duplikaty w tablicy
console.log('Test 4: Duplikaty w tablicy');
const arr4 = [2, 2, 3, 3];
const target4 = 5;
console.log(`Tablica: [${arr4}]`);
console.log(`Target Sum: ${target4}`);

const result4 = pairsWithSum(arr4, target4);
console.log(`Wynik: ${JSON.stringify(result4)}`);
console.log(`Oczekiwane: 4 pary (2,3) bo mamy 2×2 i 2×3`);
console.log(`Liczba par: ${result4.length}\n`);

// Test 5: Para identyczna (x + x = targetSum)
console.log('Test 5: Para identyczna (num + num = targetSum)');
const arr5 = [3, 3, 3];
const target5 = 6;
console.log(`Tablica: [${arr5}]`);
console.log(`Target Sum: ${target5}`);

const result5 = pairsWithSum(arr5, target5);
console.log(`Wynik: ${JSON.stringify(result5)}`);
console.log(`Oczekiwane: 3 pary (C(3,2) = 3)`);
console.log(`Liczba par: ${result5.length}\n`);

// Test 6: Liczenie par bez generowania
console.log('Test 6: Liczenie par bez generowania');
const arr6 = [1, 2, 3, 4, 5, 1, 2, 3];
const target6 = 5;
console.log(`Tablica: [${arr6}]`);
console.log(`Target Sum: ${target6}`);

const count6 = countPairsWithSum(arr6, target6);
const actual6 = pairsWithSum(arr6, target6);
console.log(`Policzono: ${count6} par`);
console.log(`Faktycznie: ${actual6.length} par`);
console.log(`Zgodne: ${count6 === actual6.length ? '✓' : '✗'}\n`);

// Test 7: Edge cases
console.log('Test 7: Edge cases');

console.log('a) Pusta tablica:');
const result7a = pairsWithSum([], 10);
console.log(`   Wynik: ${JSON.stringify(result7a)}\n`);

console.log('b) Jeden element:');
const result7b = pairsWithSum([5], 10);
console.log(`   Wynik: ${JSON.stringify(result7b)}\n`);

console.log('c) Brak pasujących par:');
const result7c = pairsWithSum([1, 2, 3], 100);
console.log(`   Wynik: ${JSON.stringify(result7c)}\n`);

console.log('d) Wszystkie pary pasują:');
const result7d = pairsWithSum([5, 5, 5, 5], 10);
console.log(`   Wynik: ${result7d.length} par (C(4,2) = 6)\n`);

console.log('e) Liczby ujemne:');
const result7e = pairsWithSum([-3, 1, 2, -1, 4], 1);
console.log(`   Wynik: ${JSON.stringify(result7e)}\n`);

console.log('f) Z zerem:');
const result7f = pairsWithSum([0, 1, -1, 2, -2], 0);
console.log(`   Wynik: ${JSON.stringify(result7f)}\n`);

// Test 8: Porównanie wszystkich metod
console.log('Test 8: Porównanie wszystkich metod');
const testArr = [1, 5, 2, 4, 3, 6];
const testTarget = 7;

console.log(`Tablica: [${testArr}]`);
console.log(`Target: ${testTarget}`);

const r1 = pairsWithSumBruteForce(testArr, testTarget);
const r2 = pairsWithSumSet(testArr, testTarget);
const r3 = pairsWithSum(testArr, testTarget);
const r4 = pairsWithSumTwoPointers(testArr, testTarget);

console.log(`Brute Force:   ${JSON.stringify(r1)} (${r1.length} par)`);
console.log(`Hash Set:      ${JSON.stringify(r2)} (${r2.length} par)`);
console.log(`Hash Map:      ${JSON.stringify(r3)} (${r3.length} par)`);
console.log(`Two Pointers:  ${JSON.stringify(r4)} (${r4.length} par)`);
console.log();

// Test 9: Test wydajności
console.log('Test 9: Test wydajności (n=10000)');
const bigArr = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 5000));
const bigTarget = 5000;

let start = Date.now();
const resultBrute = pairsWithSumBruteForce(bigArr.slice(0, 1000), bigTarget);
const timeBrute = Date.now() - start;

start = Date.now();
const resultSet = pairsWithSumSet(bigArr, bigTarget);
const timeSet = Date.now() - start;

start = Date.now();
const resultMap = pairsWithSum(bigArr, bigTarget);
const timeMap = Date.now() - start;

start = Date.now();
const resultTwoPtr = pairsWithSumTwoPointers(bigArr, bigTarget);
const timeTwoPtr = Date.now() - start;

console.log(`Brute Force (n=1000): ${timeBrute}ms, ${resultBrute.length} par`);
console.log(`Hash Set (n=10000):   ${timeSet}ms, ${resultSet.length} par`);
console.log(`Hash Map (n=10000):   ${timeMap}ms, ${resultMap.length} par`);
console.log(`Two Pointers:         ${timeTwoPtr}ms, ${resultTwoPtr.length} par`);
console.log();

// Test 10: Wariant - unikalne wartości
console.log('Test 10: Wariant - każda liczba użyta tylko raz');
const arr10 = [1, 5, 2, 4, 3, 6, 7];
const target10 = 7;

console.log(`Tablica: [${arr10}]`);
console.log(`Target: ${target10}`);

const resultUnique = pairsWithSumUnique(arr10, target10);
console.log(`Unikalne pary: ${JSON.stringify(resultUnique)}`);
console.log(`(Każda liczba może być użyta tylko raz)\n`);

// Test 11: Duże duplikaty
console.log('Test 11: Wiele duplikatów');
const arr11 = [5, 5, 5, 5, 5, 5]; // 6 piątek
const target11 = 10;

const result11 = pairsWithSum(arr11, target11);
console.log(`Tablica: 6 × 5`);
console.log(`Target: ${target11}`);
console.log(`Liczba par: ${result11.length}`);
console.log(`Oczekiwane: C(6,2) = 15\n`);

// Test 12: Różne kombinacje duplikatów
console.log('Test 12: Różne kombinacje duplikatów');
const testCases = [
  { arr: [1, 1, 2, 2], target: 3 },
  { arr: [2, 2, 2], target: 4 },
  { arr: [1, 1, 1, 3, 3, 3], target: 4 },
];

testCases.forEach(({ arr, target }, idx) => {
  const result = pairsWithSum(arr, target);
  const count = countPairsWithSum(arr, target);
  console.log(`  ${idx + 1}. [${arr}], target=${target}: ${result.length} par (count: ${count})`);
});
console.log();

// Test 13: Poprawność dla przypadków specjalnych
console.log('Test 13: Weryfikacja poprawności');
const verificationTests = [
  { arr: [1, 2, 3, 4], target: 5, expectedMin: 2 }, // (1,4) i (2,3)
  { arr: [5, 5], target: 10, expected: 1 },         // Jedna para (5,5)
  { arr: [1, 1, 1], target: 2, expected: 3 },       // C(3,2) = 3 pary
  { arr: [], target: 5, expected: 0 },              // Pusta tablica
  { arr: [1], target: 2, expected: 0 },             // Jeden element
];

let allCorrect = true;
verificationTests.forEach(({ arr, target, expected, expectedMin }, idx) => {
  const result = pairsWithSum(arr, target);
  const correct = expected !== undefined
    ? result.length === expected
    : result.length >= (expectedMin || 0);

  allCorrect = allCorrect && correct;
  const expectedStr = expected !== undefined ? expected : `≥${expectedMin}`;
  console.log(`  Test ${idx + 1}: [${arr}], target=${target} → ${result.length} par ${correct ? '✓' : '✗ (oczekiwane: ' + expectedStr + ')'}`);
});

console.log(`\nWszystkie testy: ${allCorrect ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 14: Matematyczna weryfikacja liczby par
console.log('Test 14: Matematyczna weryfikacja');
console.log('Wzór: Dla n identycznych elementów x, gdzie 2x = targetSum:');
console.log('      Liczba par = C(n, 2) = n × (n-1) / 2\n');

[2, 3, 4, 5, 10].forEach(n => {
  const arr = Array(n).fill(5);
  const target = 10;
  const result = pairsWithSum(arr, target);
  const expected = n * (n - 1) / 2;
  console.log(`  n=${n.toString().padStart(2)}: ${result.length} par, oczekiwane: ${expected} ${result.length === expected ? '✓' : '✗'}`);
});
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Złożoność:');
console.log('  Brute Force:   O(n²) - sprawdź wszystkie pary');
console.log('  Hash Set:      O(n)  - szybkie, ale problemy z duplikatami');
console.log('  Hash Map:      O(n)  - ✓ OPTYMALNE - obsługuje duplikaty poprawnie');
console.log('  Two Pointers:  O(n log n) - wymaga sortowania');
console.log('\nRekomendacja:');
console.log('  - Bez duplikatów: Hash Set');
console.log('  - Z duplikatami: Hash Map (najlepsze)');
console.log('  - Posortowana tablica: Two Pointers');
console.log('\nKluczowe problemy:');
console.log('  1. Obsługa duplikatów (C(n,2) dla identycznych elementów)');
console.log('  2. Unikanie duplikatów (a,b) i (b,a)');
console.log('  3. Para z samym sobą (x + x = targetSum)');
