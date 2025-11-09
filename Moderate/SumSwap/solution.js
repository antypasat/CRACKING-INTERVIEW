/**
 * Sum Swap - Find pair to swap for equal sums
 * Zamiana Sum - Znajdź parę do zamiany dla równych sum
 *
 * Matematyka: a - b = (sum1 - sum2) / 2
 * Mathematics: a - b = (sum1 - sum2) / 2
 */

/**
 * Podejście 1: Brute Force - O(n × m)
 * Approach 1: Brute Force - O(n × m)
 *
 * Wypróbuj wszystkie możliwe pary
 * Try all possible pairs
 */
function sumSwapBruteForce(array1, array2) {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
    return null;
  }

  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  for (const a of array1) {
    for (const b of array2) {
      const newSum1 = sum1 - a + b;
      const newSum2 = sum2 - b + a;

      if (newSum1 === newSum2) {
        return [a, b];
      }
    }
  }

  return null;
}

/**
 * Podejście 2: Mathematical with HashSet - O(n + m) ✓ OPTYMALNE
 * Approach 2: Mathematical with HashSet - O(n + m) ✓ OPTIMAL
 *
 * Użyj wzoru: b = a - target, gdzie target = (sum1 - sum2) / 2
 * Use formula: b = a - target, where target = (sum1 - sum2) / 2
 */
function sumSwap(array1, array2) {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
    return null;
  }

  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  // Sprawdź czy różnica jest parzysta (warunek konieczny)
  if ((sum1 - sum2) % 2 !== 0) {
    return null; // Niemożliwe
  }

  const target = (sum1 - sum2) / 2;

  // Stwórz HashSet z array2 dla O(1) lookup
  const set2 = new Set(array2);

  // Dla każdego a z array1, sprawdź czy (a - target) jest w array2
  for (const a of array1) {
    const b = a - target;

    if (set2.has(b)) {
      return [a, b];
    }
  }

  return null;
}

/**
 * Podejście 3: Two Pointers (posortowane) - O(n log n + m log m)
 * Approach 3: Two Pointers (sorted) - O(n log n + m log m)
 *
 * Posortuj obie tablice, użyj two pointers
 * Sort both arrays, use two pointers
 */
function sumSwapTwoPointers(array1, array2) {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
    return null;
  }

  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  if ((sum1 - sum2) % 2 !== 0) {
    return null;
  }

  const target = (sum1 - sum2) / 2;

  // Posortuj obie tablice
  const sorted1 = [...array1].sort((a, b) => a - b);
  const sorted2 = [...array2].sort((a, b) => a - b);

  let i = 0;
  let j = 0;

  while (i < sorted1.length && j < sorted2.length) {
    const a = sorted1[i];
    const b = sorted2[j];
    const diff = a - b;

    if (diff === target) {
      return [a, b];
    } else if (diff < target) {
      i++; // Potrzebujemy większego a
    } else {
      j++; // Potrzebujemy większego b
    }
  }

  return null;
}

/**
 * Podejście 4: Wszystkie Rozwiązania - O(n + m)
 * Approach 4: All Solutions - O(n + m)
 *
 * Znajdź wszystkie możliwe pary (może być wiele)
 * Find all possible pairs (there may be multiple)
 */
function sumSwapAll(array1, array2) {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
    return [];
  }

  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  if ((sum1 - sum2) % 2 !== 0) {
    return [];
  }

  const target = (sum1 - sum2) / 2;

  // Zlicz wystąpienia w array2
  const count2 = new Map();
  for (const b of array2) {
    count2.set(b, (count2.get(b) || 0) + 1);
  }

  const results = [];
  const seen = new Set(); // Unikaj duplikatów w wynikach

  for (const a of array1) {
    const b = a - target;

    if (count2.has(b)) {
      const key = `${a},${b}`;
      if (!seen.has(key)) {
        results.push([a, b]);
        seen.add(key);
      }
    }
  }

  return results;
}

/**
 * Podejście 5: Optymalizowane (swap for smaller)
 * Approach 5: Optimized (swap for smaller)
 *
 * Zawsze używaj mniejszej tablicy dla HashSet
 * Always use smaller array for HashSet
 */
function sumSwapOptimized(array1, array2) {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
    return null;
  }

  let sum1 = array1.reduce((a, b) => a + b, 0);
  let sum2 = array2.reduce((a, b) => a + b, 0);

  if ((sum1 - sum2) % 2 !== 0) {
    return null;
  }

  let target = (sum1 - sum2) / 2;
  let arr1 = array1;
  let arr2 = array2;
  let swapped = false;

  // Użyj mniejszej tablicy dla HashSet
  if (array1.length > array2.length) {
    arr1 = array2;
    arr2 = array1;
    target = -target;
    swapped = true;
  }

  const set2 = new Set(arr2);

  for (const a of arr1) {
    const b = a - target;

    if (set2.has(b)) {
      return swapped ? [b, a] : [a, b];
    }
  }

  return null;
}

/**
 * Funkcje pomocnicze / Helper functions
 */

/**
 * Zweryfikuj czy zamiana daje równe sumy
 * Verify if swap gives equal sums
 */
function verifySumSwap(array1, array2, a, b) {
  const sum1 = array1.reduce((x, y) => x + y, 0);
  const sum2 = array2.reduce((x, y) => x + y, 0);

  const newSum1 = sum1 - a + b;
  const newSum2 = sum2 - b + a;

  return newSum1 === newSum2;
}

/**
 * Oblicz target difference
 * Calculate target difference
 */
function calculateTarget(array1, array2) {
  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  return {
    sum1,
    sum2,
    diff: sum1 - sum2,
    target: (sum1 - sum2) / 2,
    isPossible: (sum1 - sum2) % 2 === 0
  };
}

/**
 * Wykonaj zamianę i zwróć nowe tablice
 * Perform swap and return new arrays
 */
function performSwap(array1, array2, a, b) {
  const newArray1 = array1.map(x => x === a ? b : x);
  const newArray2 = array2.map(x => x === b ? a : x);

  // Zamień tylko pierwsze wystąpienie
  let swapped1 = false;
  let swapped2 = false;

  const result1 = array1.map(x => {
    if (!swapped1 && x === a) {
      swapped1 = true;
      return b;
    }
    return x;
  });

  const result2 = array2.map(x => {
    if (!swapped2 && x === b) {
      swapped2 = true;
      return a;
    }
    return x;
  });

  return [result1, result2];
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Sum Swap ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania (from problem)');
const arr1_1 = [4, 1, 2, 1, 1, 2];
const arr1_2 = [3, 6, 3, 3];
const result1 = sumSwap(arr1_1, arr1_2);

console.log(`Array1: [${arr1_1.join(', ')}]`);
console.log(`Array2: [${arr1_2.join(', ')}]`);

const info1 = calculateTarget(arr1_1, arr1_2);
console.log(`Sum1: ${info1.sum1}, Sum2: ${info1.sum2}`);
console.log(`Diff: ${info1.diff}, Target: ${info1.target}`);
console.log(`Result: ${result1 ? `[${result1.join(', ')}]` : 'null'}`);

if (result1) {
  const valid = verifySumSwap(arr1_1, arr1_2, result1[0], result1[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);

  const [new1, new2] = performSwap(arr1_1, arr1_2, result1[0], result1[1]);
  console.log(`After swap:`);
  console.log(`  Array1: [${new1.join(', ')}] → sum = ${new1.reduce((a,b)=>a+b,0)}`);
  console.log(`  Array2: [${new2.join(', ')}] → sum = ${new2.reduce((a,b)=>a+b,0)}`);
}
console.log();

// Test 2: Niemożliwa zamiana (nieparzysta różnica)
console.log('Test 2: Niemożliwa zamiana (odd difference)');
const arr2_1 = [1, 2, 3];
const arr2_2 = [4, 5, 6];
const result2 = sumSwap(arr2_1, arr2_2);

console.log(`Array1: [${arr2_1.join(', ')}] → sum = ${arr2_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr2_2.join(', ')}] → sum = ${arr2_2.reduce((a,b)=>a+b,0)}`);

const info2 = calculateTarget(arr2_1, arr2_2);
console.log(`Diff: ${info2.diff} (nieparzyste)`);
console.log(`Result: ${result2}`);
console.log(`Test ${result2 === null ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Równe sumy (target = 0)
console.log('Test 3: Równe sumy (equal sums, target = 0)');
const arr3_1 = [1, 2, 3];
const arr3_2 = [2, 2, 2];
const result3 = sumSwap(arr3_1, arr3_2);

console.log(`Array1: [${arr3_1.join(', ')}] → sum = ${arr3_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr3_2.join(', ')}] → sum = ${arr3_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: ${result3 ? `[${result3.join(', ')}]` : 'null'}`);

if (result3) {
  console.log(`Zamiana: ${result3[0]} ↔ ${result3[1]}`);
  console.log(`(target = 0, więc szukamy a = b)`);
}
console.log();

// Test 4: Pojedyncze elementy
console.log('Test 4: Pojedyncze elementy (single elements)');
const arr4_1 = [5];
const arr4_2 = [3];
const result4 = sumSwap(arr4_1, arr4_2);

console.log(`Array1: [${arr4_1.join(', ')}], Array2: [${arr4_2.join(', ')}]`);
console.log(`Result: ${result4 ? `[${result4.join(', ')}]` : 'null'}`);
console.log(`Test ${result4 === null ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Wiele rozwiązań
console.log('Test 5: Wiele rozwiązań (multiple solutions)');
const arr5_1 = [10, 20, 30];
const arr5_2 = [15, 25, 35];
const result5 = sumSwap(arr5_1, arr5_2);
const allResults5 = sumSwapAll(arr5_1, arr5_2);

console.log(`Array1: [${arr5_1.join(', ')}] → sum = ${arr5_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr5_2.join(', ')}] → sum = ${arr5_2.reduce((a,b)=>a+b,0)}`);
console.log(`First solution: [${result5.join(', ')}]`);
console.log(`All solutions (${allResults5.length}):`);
allResults5.forEach(([a, b]) => {
  console.log(`  [${a}, ${b}] → ${a} - ${b} = ${a - b}`);
});
console.log();

// Test 6: Duplikaty
console.log('Test 6: Duplikaty (duplicates)');
const arr6_1 = [1, 1, 1, 1];
const arr6_2 = [2, 2, 2, 2];
const result6 = sumSwap(arr6_1, arr6_2);

console.log(`Array1: [${arr6_1.join(', ')}] → sum = ${arr6_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr6_2.join(', ')}] → sum = ${arr6_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: [${result6.join(', ')}]`);

if (result6) {
  const valid = verifySumSwap(arr6_1, arr6_2, result6[0], result6[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);
}
console.log();

// Test 7: Puste tablice
console.log('Test 7: Puste tablice (empty arrays)');
const arr7_1 = [];
const arr7_2 = [1, 2, 3];
const result7 = sumSwap(arr7_1, arr7_2);

console.log(`Array1: [], Array2: [${arr7_2.join(', ')}]`);
console.log(`Result: ${result7}`);
console.log(`Test ${result7 === null ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: Duże liczby
console.log('Test 8: Duże liczby (large numbers)');
const arr8_1 = [1000, 2000, 3000];
const arr8_2 = [1500, 2500, 3500];
const result8 = sumSwap(arr8_1, arr8_2);

console.log(`Array1: [${arr8_1.join(', ')}] → sum = ${arr8_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr8_2.join(', ')}] → sum = ${arr8_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: [${result8.join(', ')}]`);

const info8 = calculateTarget(arr8_1, arr8_2);
console.log(`Target: ${info8.target}`);
console.log();

// Test 9: Liczby ujemne
console.log('Test 9: Liczby ujemne (negative numbers)');
const arr9_1 = [-5, -3, -1];
const arr9_2 = [2, 4, 6];
const result9 = sumSwap(arr9_1, arr9_2);

console.log(`Array1: [${arr9_1.join(', ')}] → sum = ${arr9_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr9_2.join(', ')}] → sum = ${arr9_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: ${result9 ? `[${result9.join(', ')}]` : 'null'}`);

if (result9) {
  const valid = verifySumSwap(arr9_1, arr9_2, result9[0], result9[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);
}
console.log();

// Test 10: Porównanie wszystkich metod
console.log('Test 10: Porównanie wszystkich metod (compare methods)');
const testArr1 = [4, 1, 2, 1, 1, 2];
const testArr2 = [3, 6, 3, 3];

const resBrute = sumSwapBruteForce(testArr1, testArr2);
const resHash = sumSwap(testArr1, testArr2);
const resTwo = sumSwapTwoPointers(testArr1, testArr2);
const resOpt = sumSwapOptimized(testArr1, testArr2);

console.log(`Arrays: [${testArr1.join(', ')}] and [${testArr2.join(', ')}]`);
console.log(`Brute Force:  [${resBrute.join(', ')}]`);
console.log(`HashSet:      [${resHash.join(', ')}]`);
console.log(`Two Pointers: [${resTwo.join(', ')}]`);
console.log(`Optimized:    [${resOpt.join(', ')}]`);

const allMatch = resBrute[0] === resHash[0] && resHash[0] === resTwo[0] &&
                 resBrute[1] === resHash[1] && resHash[1] === resTwo[1];

console.log(`Wszystkie zgodne: ${allMatch ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 11: Performance test
console.log('Test 11: Performance test (duże tablice)');

// Generuj duże tablice
const largeArr1 = Array(1000).fill(0).map((_, i) => i);
const largeArr2 = Array(1000).fill(0).map((_, i) => i + 500);

let start = Date.now();
const perfBrute = sumSwapBruteForce(largeArr1.slice(0, 100), largeArr2.slice(0, 100));
const timeBrute = Date.now() - start;

start = Date.now();
const perfHash = sumSwap(largeArr1, largeArr2);
const timeHash = Date.now() - start;

start = Date.now();
const perfTwo = sumSwapTwoPointers(largeArr1, largeArr2);
const timeTwo = Date.now() - start;

console.log(`Array sizes: ${largeArr1.length} x ${largeArr2.length}`);
console.log(`Brute Force (100x100): ${timeBrute}ms`);
console.log(`HashSet (1000x1000):   ${timeHash}ms`);
console.log(`Two Pointers:          ${timeTwo}ms`);
console.log(`Result: ${perfHash ? `[${perfHash.join(', ')}]` : 'null'}\n`);

// Test 12: Zero values
console.log('Test 12: Wartości zerowe (zero values)');
const arr12_1 = [0, 1, 2];
const arr12_2 = [3, 4, 0];
const result12 = sumSwap(arr12_1, arr12_2);

console.log(`Array1: [${arr12_1.join(', ')}], Array2: [${arr12_2.join(', ')}]`);
console.log(`Result: ${result12 ? `[${result12.join(', ')}]` : 'null'}`);

if (result12) {
  const valid = verifySumSwap(arr12_1, arr12_2, result12[0], result12[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);
}
console.log();

// Test 13: Bardzo nierówne sumy
console.log('Test 13: Bardzo nierówne sumy (very unequal sums)');
const arr13_1 = [1, 2, 3];
const arr13_2 = [100, 200, 300];
const result13 = sumSwap(arr13_1, arr13_2);

console.log(`Array1: [${arr13_1.join(', ')}] → sum = ${arr13_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr13_2.join(', ')}] → sum = ${arr13_2.reduce((a,b)=>a+b,0)}`);

const info13 = calculateTarget(arr13_1, arr13_2);
console.log(`Target: ${info13.target}`);
console.log(`Result: ${result13 ? `[${result13.join(', ')}]` : 'null'}`);
console.log();

// Test 14: Wszystkie te same wartości
console.log('Test 14: Wszystkie te same wartości (all same values)');
const arr14_1 = [5, 5, 5];
const arr14_2 = [3, 3, 3, 3];
const result14 = sumSwap(arr14_1, arr14_2);

console.log(`Array1: [${arr14_1.join(', ')}] → sum = ${arr14_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr14_2.join(', ')}] → sum = ${arr14_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: ${result14 ? `[${result14.join(', ')}]` : 'null'}`);

if (result14) {
  const valid = verifySumSwap(arr14_1, arr14_2, result14[0], result14[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);
}
console.log();

// Test 15: Jeden element vs wiele
console.log('Test 15: Jeden element vs wiele (single vs many)');
const arr15_1 = [10];
const arr15_2 = [1, 2, 3, 4, 5];
const result15 = sumSwap(arr15_1, arr15_2);

console.log(`Array1: [${arr15_1.join(', ')}] → sum = ${arr15_1.reduce((a,b)=>a+b,0)}`);
console.log(`Array2: [${arr15_2.join(', ')}] → sum = ${arr15_2.reduce((a,b)=>a+b,0)}`);
console.log(`Result: ${result15 ? `[${result15.join(', ')}]` : 'null'}`);

if (result15) {
  const valid = verifySumSwap(arr15_1, arr15_2, result15[0], result15[1]);
  console.log(`Verification: ${valid ? 'PASS ✓' : 'FAIL ✗'}`);
}
console.log();

// Test 16: Wzór matematyczny
console.log('Test 16: Demonstracja wzoru matematycznego');
const demoArr1 = [10, 20];
const demoArr2 = [15, 25];

const demoInfo = calculateTarget(demoArr1, demoArr2);

console.log(`Array1: [${demoArr1.join(', ')}] → sum = ${demoInfo.sum1}`);
console.log(`Array2: [${demoArr2.join(', ')}] → sum = ${demoInfo.sum2}`);
console.log(`\nWzór / Formula:`);
console.log(`  sum1 - sum2 = ${demoInfo.diff}`);
console.log(`  target = (sum1 - sum2) / 2 = ${demoInfo.target}`);
console.log(`  Szukamy: a - b = ${demoInfo.target}`);
console.log(`\nSprawdzenie / Verification:`);

for (const a of demoArr1) {
  const b = a - demoInfo.target;
  if (demoArr2.includes(b)) {
    console.log(`  a=${a}: b = ${a} - ${demoInfo.target} = ${b} ✓ (w array2)`);
    console.log(`  newSum1 = ${demoInfo.sum1} - ${a} + ${b} = ${demoInfo.sum1 - a + b}`);
    console.log(`  newSum2 = ${demoInfo.sum2} - ${b} + ${a} = ${demoInfo.sum2 - b + a}`);
  }
}
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Sum Swap - Znajdowanie pary do zamiany dla równych sum');
console.log('\nMetody:');
console.log('  Brute Force:  O(n×m)      - wypróbuj wszystkie pary');
console.log('  HashSet:      O(n+m)      - matematyka + O(1) lookup ✓');
console.log('  Two Pointers: O(n log n)  - sortowanie + two pointers');
console.log('  All Solutions: O(n+m)     - znajdź wszystkie pary');
console.log('\nKluczowy wzór / Key formula:');
console.log('  a - b = (sum1 - sum2) / 2');
console.log('\nWarunki / Conditions:');
console.log('  1. (sum1 - sum2) musi być parzyste');
console.log('  2. Musi istnieć a ∈ array1 i b ∈ array2 gdzie b = a - target');
console.log('\nZłożoność optymalna / Optimal complexity:');
console.log('  Czasowa:    O(n + m) - HashSet lookup');
console.log('  Pamięciowa: O(m)     - HashSet dla array2');
console.log('\nZastosowania:');
console.log('  - Load balancing');
console.log('  - Resource allocation');
console.log('  - Budget balancing');
console.log('  - Team equalization');
