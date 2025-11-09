/**
 * Smallest Difference
 * Znajdź parę z najmniejszą różnicą między dwiema tablicami
 */

function smallestDifferenceBruteForce(arr1, arr2) {
  let minDiff = Infinity;
  let pair = null;

  for (let a of arr1) {
    for (let b of arr2) {
      const diff = Math.abs(a - b);
      if (diff < minDiff) {
        minDiff = diff;
        pair = [a, b];
      }
    }
  }

  return { difference: minDiff, pair };
}

function smallestDifference(arr1, arr2) {
  // Sortuj obie tablice / Sort both arrays
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);

  let i = 0, j = 0;
  let minDiff = Infinity;
  let pair = null;

  // Dwa wskaźniki / Two pointers
  while (i < arr1.length && j < arr2.length) {
    const diff = Math.abs(arr1[i] - arr2[j]);

    if (diff < minDiff) {
      minDiff = diff;
      pair = [arr1[i], arr2[j]];
    }

    // Przesuń wskaźnik przy mniejszej wartości
    // Move pointer at smaller value
    if (arr1[i] < arr2[j]) {
      i++;
    } else {
      j++;
    }
  }

  return { difference: minDiff, pair };
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Smallest Difference ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania');
const arr1 = [1, 3, 15, 11, 2];
const arr2 = [23, 127, 235, 19, 8];
const result1 = smallestDifference(arr1, arr2);
console.log(`Tablice: [${arr1}] i [${arr2}]`);
console.log(`Wynik: różnica=${result1.difference}, para=${result1.pair}`);
console.log(`(Oczekiwane: 3, para (11,8))\n`);

// Test 2: Identyczne wartości
console.log('Test 2: Tablice z identycznymi wartościami');
const result2 = smallestDifference([1, 5, 9], [3, 5, 7]);
console.log(`Wynik: różnica=${result2.difference}, para=${result2.pair}\n`);

// Test 3: Żadne wartości nie są bliskie
console.log('Test 3: Bardzo odległe wartości');
const result3 = smallestDifference([1, 2, 3], [100, 200, 300]);
console.log(`Wynik: różnica=${result3.difference}, para=${result3.pair}\n`);

// Test 4: Liczby ujemne
console.log('Test 4: Liczby ujemne');
const result4 = smallestDifference([-5, -2, 3], [-10, -1, 0]);
console.log(`Wynik: różnica=${result4.difference}, para=${result4.pair}\n`);

// Test 5: Porównanie wydajności
console.log('Test 5: Porównanie wydajności');
const big1 = Array.from({length: 1000}, () => Math.floor(Math.random() * 10000));
const big2 = Array.from({length: 1000}, () => Math.floor(Math.random() * 10000));

let start = Date.now();
smallestDifferenceBruteForce(big1.slice(), big2.slice());
console.log(`Brute Force: ${Date.now() - start}ms`);

start = Date.now();
smallestDifference(big1.slice(), big2.slice());
console.log(`Sortowanie + 2 wskaźniki: ${Date.now() - start}ms\n`);

console.log('=== Złożoność ===');
console.log('Brute Force: O(n*m)');
console.log('Optymalne: O(n log n + m log m)');
