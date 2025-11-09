/**
 * Diving Board - All Possible Lengths
 * Wszystkie możliwe długości trampoliny
 */

/**
 * Podejście 1: Brute Force z Rekurencją - O(2^k)
 * Approach 1: Brute Force with Recursion - O(2^k)
 *
 * Generuje wszystkie kombinacje i używa Set do eliminacji duplikatów
 * Generates all combinations and uses Set to eliminate duplicates
 */
function allLengthsBruteForce(k, shorter, longer) {
  if (k <= 0) return [];

  const lengths = new Set();

  function generate(remaining, currentLength) {
    if (remaining === 0) {
      lengths.add(currentLength);
      return;
    }

    // Dwa wybory: użyj shorter lub longer
    // Two choices: use shorter or longer
    generate(remaining - 1, currentLength + shorter);
    generate(remaining - 1, currentLength + longer);
  }

  generate(k, 0);
  return Array.from(lengths).sort((a, b) => a - b);
}

/**
 * Podejście 2: Iteracyjne Proste - O(k)
 * Approach 2: Simple Iterative - O(k)
 *
 * Dla każdej liczby krótkich desek oblicz długość
 * For each number of short planks calculate length
 */
function allLengthsIterative(k, shorter, longer) {
  // Edge cases
  if (k <= 0) return [];
  if (shorter === longer) return [k * shorter];

  const lengths = [];

  // i = liczba krótkich desek (0 do k)
  // i = number of short planks (0 to k)
  for (let i = 0; i <= k; i++) {
    const numShorter = i;
    const numLonger = k - i;
    const length = numShorter * shorter + numLonger * longer;
    lengths.push(length);
  }

  // Sortuj jeśli shorter > longer
  // Sort if shorter > longer
  return lengths.sort((a, b) => a - b);
}

/**
 * Podejście 3: Optymalne z Matematyką - O(k)
 * Approach 3: Optimal with Math - O(k)
 *
 * Wykorzystuje fakt że każda zamiana shorter→longer dodaje stałą różnicę
 * Uses the fact that each shorter→longer swap adds constant difference
 */
function allLengths(k, shorter, longer) {
  // Edge cases
  if (k <= 0) return [];
  if (shorter === longer) return [k * shorter];

  // Zapewnij shorter < longer dla uproszczenia
  // Ensure shorter < longer for simplicity
  if (shorter > longer) {
    [shorter, longer] = [longer, shorter];
  }

  const lengths = [];
  const minLength = k * shorter;        // Wszystkie krótkie / All short
  const diff = longer - shorter;        // Różnica / Difference

  // Każda zamiana shorter → longer dodaje diff
  // Each shorter → longer swap adds diff
  for (let i = 0; i <= k; i++) {
    lengths.push(minLength + i * diff);
  }

  return lengths;
}

/**
 * Podejście 4: Najbardziej Zwięzłe - O(k)
 * Approach 4: Most Concise - O(k)
 */
function allLengthsConcise(k, shorter, longer) {
  if (k <= 0) return [];
  if (shorter === longer) return [k * shorter];

  const [min, max] = shorter < longer ? [shorter, longer] : [longer, shorter];
  const diff = max - min;

  return Array.from({ length: k + 1 }, (_, i) => k * min + i * diff);
}

/**
 * Funkcja pomocnicza: Szczegółowa analiza
 * Helper function: Detailed analysis
 */
function analyzeBoard(k, shorter, longer) {
  console.log(`\nAnaliza dla k=${k}, shorter=${shorter}, longer=${longer}:`);

  if (k <= 0) {
    console.log('  Niepoprawne k (musi być > 0)');
    return;
  }

  if (shorter === longer) {
    console.log('  Deski są tej samej długości!');
    console.log(`  Tylko jedna możliwa długość: ${k * shorter}`);
    return;
  }

  const [min, max] = shorter < longer ? [shorter, longer] : [longer, shorter];
  const diff = max - min;

  console.log(`  Minimalna długość (k × min): ${k} × ${min} = ${k * min}`);
  console.log(`  Maksymalna długość (k × max): ${k} × ${max} = ${k * max}`);
  console.log(`  Różnica między wariantami: ${diff}`);
  console.log(`  Liczba możliwych długości: ${k + 1}`);

  console.log('\n  Szczegółowy rozkład:');
  for (let i = 0; i <= Math.min(k, 10); i++) {
    const numMin = k - i;
    const numMax = i;
    const length = numMin * min + numMax * max;
    console.log(`    ${numMin} × ${min} + ${numMax} × ${max} = ${length}`);
  }

  if (k > 10) {
    console.log(`    ... (i ${k - 10} więcej)`);
  }
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Diving Board - All Possible Lengths ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład podstawowy (shorter=1, longer=2, k=3)');
const result1 = allLengths(3, 1, 2);
console.log(`Wynik: [${result1}]`);
console.log(`Oczekiwane: [3, 4, 5, 6]\n`);

// Test 2: Większe deski
console.log('Test 2: Większe deski (shorter=3, longer=5, k=4)');
const result2 = allLengths(4, 3, 5);
console.log(`Wynik: [${result2}]`);
console.log(`Oczekiwane: [12, 14, 16, 18, 20]\n`);

// Test 3: Szczegółowa analiza
console.log('Test 3: Szczegółowa analiza');
analyzeBoard(5, 2, 7);
const result3 = allLengths(5, 2, 7);
console.log(`Wynik: [${result3}]\n`);

// Test 4: Identyczne deski (edge case)
console.log('Test 4: Identyczne deski (shorter=5, longer=5, k=10)');
const result4 = allLengths(10, 5, 5);
console.log(`Wynik: [${result4}]`);
console.log(`Oczekiwane: [50] (tylko jedna długość)\n`);

// Test 5: k = 1
console.log('Test 5: Tylko jedna deska (k=1)');
const result5 = allLengths(1, 3, 7);
console.log(`Wynik: [${result5}]`);
console.log(`Oczekiwane: [3, 7] (dwie możliwości)\n`);

// Test 6: Edge cases
console.log('Test 6: Edge cases');

console.log('a) k = 0:');
const result6a = allLengths(0, 3, 5);
console.log(`   Wynik: [${result6a}] (pusta tablica)\n`);

console.log('b) k < 0:');
const result6b = allLengths(-5, 3, 5);
console.log(`   Wynik: [${result6b}] (pusta tablica)\n`);

console.log('c) shorter = 0:');
const result6c = allLengths(5, 0, 3);
console.log(`   Wynik: [${result6c}]`);
console.log(`   Oczekiwane: [0, 3, 6, 9, 12, 15]\n`);

console.log('d) Duże wartości (k=100):');
const result6d = allLengths(100, 1, 2);
console.log(`   Liczba wyników: ${result6d.length}`);
console.log(`   Pierwszy: ${result6d[0]}, Ostatni: ${result6d[result6d.length - 1]}`);
console.log(`   Oczekiwane: 101 wyników, zakres [100, 200]\n`);

// Test 7: Odwrócona kolejność (longer podane jako shorter)
console.log('Test 7: Odwrócona kolejność parametrów');
const result7a = allLengths(4, 2, 5);
const result7b = allLengths(4, 5, 2);
console.log(`shorter=2, longer=5: [${result7a}]`);
console.log(`shorter=5, longer=2: [${result7b}]`);
console.log(`Zgodne: ${JSON.stringify(result7a) === JSON.stringify(result7b) ? '✓' : '✗'}\n`);

// Test 8: Porównanie wszystkich metod
console.log('Test 8: Porównanie wszystkich metod');
const testCases = [
  { k: 3, shorter: 1, longer: 2 },
  { k: 5, shorter: 3, longer: 7 },
  { k: 10, shorter: 2, longer: 5 },
  { k: 1, shorter: 4, longer: 9 }
];

testCases.forEach(({ k, shorter, longer }, idx) => {
  const r1 = allLengthsBruteForce(k, shorter, longer);
  const r2 = allLengthsIterative(k, shorter, longer);
  const r3 = allLengths(k, shorter, longer);
  const r4 = allLengthsConcise(k, shorter, longer);

  const match = JSON.stringify(r1) === JSON.stringify(r2) &&
                JSON.stringify(r2) === JSON.stringify(r3) &&
                JSON.stringify(r3) === JSON.stringify(r4);

  console.log(`Test ${idx + 1} (k=${k}, ${shorter}, ${longer}): ${match ? '✓' : '✗'}`);
  if (!match) {
    console.log(`  Brute:     [${r1}]`);
    console.log(`  Iterative: [${r2}]`);
    console.log(`  Optimal:   [${r3}]`);
    console.log(`  Concise:   [${r4}]`);
  }
});
console.log();

// Test 9: Test wydajności
console.log('Test 9: Test wydajności (k=1000)');
const k = 1000;
const shorter = 3;
const longer = 7;

let start = Date.now();
for (let i = 0; i < 10000; i++) {
  allLengthsIterative(k, shorter, longer);
}
const timeIterative = Date.now() - start;

start = Date.now();
for (let i = 0; i < 10000; i++) {
  allLengths(k, shorter, longer);
}
const timeOptimal = Date.now() - start;

start = Date.now();
for (let i = 0; i < 10000; i++) {
  allLengthsConcise(k, shorter, longer);
}
const timeConcise = Date.now() - start;

console.log(`Iterative: ${timeIterative}ms`);
console.log(`Optimal:   ${timeOptimal}ms`);
console.log(`Concise:   ${timeConcise}ms`);
console.log(`(10,000 wywołań każda metoda)\n`);

// Test 10: Bardzo duże k
console.log('Test 10: Bardzo duże k');
const bigK = 10000;
const result10 = allLengths(bigK, 1, 3);
console.log(`k=${bigK}: Wygenerowano ${result10.length} długości`);
console.log(`Zakres: ${result10[0]} do ${result10[result10.length - 1]}`);
console.log(`Różnica między sąsiednimi: ${result10[1] - result10[0]}`);
console.log();

// Test 11: Matematyczna weryfikacja
console.log('Test 11: Matematyczna weryfikacja wzoru');
const testK = 7;
const testShorter = 2;
const testLonger = 5;

console.log(`Parametry: k=${testK}, shorter=${testShorter}, longer=${testLonger}`);
console.log('\nWzór: length(i) = k × min + i × (max - min)');
console.log('gdzie i = liczba desek max (od 0 do k)\n');

const results = allLengths(testK, testShorter, testLonger);
const min = Math.min(testShorter, testLonger);
const max = Math.max(testShorter, testLonger);
const diff = max - min;

let allMatch = true;
for (let i = 0; i <= testK; i++) {
  const expected = testK * min + i * diff;
  const actual = results[i];
  const match = expected === actual;
  allMatch = allMatch && match;

  if (i < 5 || i === testK) {
    console.log(`i=${i}: ${testK} × ${min} + ${i} × ${diff} = ${expected} ${match ? '✓' : '✗ (got ' + actual + ')'}`);
  } else if (i === 5) {
    console.log('...');
  }
}

console.log(`\nWszystkie zgodne: ${allMatch ? '✓' : '✗'}\n`);

// Test 12: Przypadki brzegowe dla identycznych desek
console.log('Test 12: Różne k dla identycznych desek');
[1, 5, 10, 100].forEach(k => {
  const result = allLengths(k, 7, 7);
  console.log(`k=${k}: [${result}] (oczekiwane: [${k * 7}])`);
});
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Złożoność czasowa: O(k)');
console.log('Złożoność pamięciowa: O(k) - wynik');
console.log('\nKluczowe optymalizacje:');
console.log('1. Sprawdź czy shorter === longer na początku');
console.log('2. Użyj wzoru: minLength + i × diff');
console.log('3. Nie potrzeba sortowania ani Set (gdy shorter ≠ longer)');
console.log('4. Liniowa złożoność zamiast eksponencjalnej!');
