/**
 * Rand7 From Rand5 - Generate uniform random 0-6 from uniform random 0-4
 * Rand7 z Rand5 - Generuj równomiernie rozłożone 0-6 z równomiernie rozłożonych 0-4
 */

/**
 * rand5() - Symulacja generatora 0-4
 * rand5() - Simulation of 0-4 generator
 */
function rand5() {
  return Math.floor(Math.random() * 5);
}

/**
 * Podejście 1: Rejection Sampling - O(1) średnio ✓ OPTYMALNE
 * Approach 1: Rejection Sampling - O(1) average ✓ OPTIMAL
 *
 * Generuj rand25, użyj tylko 0-20 (21 = 3×7)
 * Generate rand25, use only 0-20 (21 = 3×7)
 */
function rand7() {
  while (true) {
    // Generuj rand25: liczby 0-24
    const num = rand5() * 5 + rand5();

    // Użyj tylko liczb 0-20 (21 wartości = 3 × 7)
    if (num < 21) {
      return num % 7; // 0, 1, 2, 3, 4, 5, 6
    }
    // Jeśli num ∈ {21, 22, 23, 24}, odrzuć i spróbuj ponownie
  }
}

/**
 * Podejście 2: Z Liczeniem Prób - O(1) średnio
 * Approach 2: With Attempt Counting - O(1) average
 *
 * Śledź ile prób potrzebowało do sukcesu
 * Track how many attempts were needed for success
 */
function rand7WithAttempts() {
  let attempts = 0;

  while (true) {
    attempts++;
    const num = rand5() * 5 + rand5();

    if (num < 21) {
      return { value: num % 7, attempts };
    }
  }
}

/**
 * Podejście 3: Optymalizowane - Wykorzystaj Odrzucone
 * Approach 3: Optimized - Reuse Rejected Values
 *
 * Wykorzystaj wartości 21-24 zamiast je odrzucać
 * Reuse values 21-24 instead of discarding them
 */
function rand7Optimized() {
  while (true) {
    // Generuj rand25
    let num = rand5() * 5 + rand5();

    if (num < 21) {
      return num % 7;
    }

    // num ∈ {21, 22, 23, 24} → 4 wartości (przekształć na 0-3)
    // rand4 * 5 + rand5 = rand20 (0-19)
    num = (num - 21) * 5 + rand5();

    if (num < 14) {
      return num % 7; // 14 = 2×7
    }

    // num ∈ {14-19} → 6 wartości
    // Moglibyśmy kontynuować, ale zwykle wracamy do początku
    // dla uproszczenia
  }
}

/**
 * Podejście 4: Przez rand2 (rzut monetą)
 * Approach 4: Through rand2 (coin flip)
 *
 * Najpierw stwórz rand2, potem użyj do rand7
 * First create rand2, then use it for rand7
 */
function rand2FromRand5() {
  let num;
  do {
    num = rand5();
  } while (num >= 4); // Odrzuć 4, użyj tylko 0-3

  return num % 2; // 0 lub 1 z prawdopodobieństwem 1/2
}

function rand7FromRand2() {
  // Generuj 3-bitową liczbę (0-7) używając rand2
  while (true) {
    const num = rand2FromRand5() * 4 +
                rand2FromRand5() * 2 +
                rand2FromRand5(); // 0-7

    if (num < 7) {
      return num; // 0-6
    }
    // Odrzuć 7
  }
}

/**
 * Podejście 5: Uogólnione - RandN z RandM
 * Approach 5: Generalized - RandN from RandM
 *
 * Uniwersalna funkcja dla dowolnego N i M
 * Universal function for any N and M
 */
function randN_from_randM(n, m, randM) {
  // Znajdź k takie, że m^k ≥ n
  let power = 1;
  let range = m;

  while (range < n) {
    power++;
    range *= m;
  }

  // Użyj tylko floor(range/n) * n wartości
  const usable = Math.floor(range / n) * n;

  while (true) {
    let num = 0;
    for (let i = 0; i < power; i++) {
      num = num * m + randM();
    }

    if (num < usable) {
      return num % n;
    }
  }
}

function rand7Generic() {
  return randN_from_randM(7, 5, rand5);
}

/**
 * Funkcja pomocnicza: Test rozkładu
 * Helper function: Test distribution
 */
function testDistribution(randFunc, trials = 100000, expectedRange = 7) {
  const counts = new Array(expectedRange).fill(0);

  for (let i = 0; i < trials; i++) {
    const num = randFunc();
    if (num < 0 || num >= expectedRange) {
      throw new Error(`Value ${num} out of range [0, ${expectedRange - 1}]`);
    }
    counts[num]++;
  }

  const expected = trials / expectedRange;
  const results = counts.map((count, num) => {
    const percentage = (count / trials * 100).toFixed(2);
    const expectedPercentage = (100 / expectedRange).toFixed(2);
    const deviation = ((count - expected) / expected * 100).toFixed(2);
    return { num, count, percentage, expectedPercentage, deviation };
  });

  return results;
}

/**
 * Funkcja pomocnicza: Oblicz Chi-Square
 * Helper function: Calculate Chi-Square test
 */
function chiSquareTest(counts, expected) {
  let chiSquare = 0;
  for (let count of counts) {
    chiSquare += Math.pow(count - expected, 2) / expected;
  }
  return chiSquare;
}

/**
 * Funkcja pomocnicza: Test wydajności
 * Helper function: Performance test
 */
function performanceTest(randFunc, name, iterations = 10000) {
  const start = Date.now();
  let totalAttempts = 0;

  for (let i = 0; i < iterations; i++) {
    if (randFunc === rand7WithAttempts) {
      totalAttempts += randFunc().attempts;
    } else {
      randFunc();
      totalAttempts += 1; // Zakładamy 1 próbę (nie możemy zmierzyć wewnętrznych)
    }
  }

  const time = Date.now() - start;
  const avgAttempts = totalAttempts / iterations;

  return { name, time, avgAttempts };
}

/**
 * Funkcja pomocnicza: Wizualizacja rozkładu
 * Helper function: Visualize distribution
 */
function visualizeDistribution(results, maxBarLength = 50) {
  console.log('\nRozkład prawdopodobieństwa / Probability distribution:');
  console.log('─'.repeat(70));

  const maxCount = Math.max(...results.map(r => r.count));

  results.forEach(({ num, count, percentage, expectedPercentage, deviation }) => {
    const barLength = Math.round((count / maxCount) * maxBarLength);
    const bar = '█'.repeat(barLength);

    console.log(`${num}: ${bar} ${percentage}% (oczekiwane: ${expectedPercentage}%, odchylenie: ${deviation}%)`);
  });

  console.log('─'.repeat(70));
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Rand7 From Rand5 - Rejection Sampling ===\n');

// Test 1: Podstawowy test - wygeneruj kilka wartości
console.log('Test 1: Podstawowe wywołania rand7()');
console.log('10 losowych wartości:', Array.from({ length: 10 }, () => rand7()));
console.log();

// Test 2: Test rozkładu - główny test poprawności
console.log('Test 2: Test rozkładu (100,000 prób)');
const results2 = testDistribution(rand7, 100000, 7);
visualizeDistribution(results2);

const counts2 = results2.map(r => r.count);
const expected2 = 100000 / 7;
const chiSquare2 = chiSquareTest(counts2, expected2);
console.log(`\nChi-Square: ${chiSquare2.toFixed(2)}`);
console.log(`Dla 6 stopni swobody przy α=0.05, krytyczna wartość ≈ 12.59`);
console.log(`Test ${chiSquare2 < 12.59 ? 'PASS ✓' : 'FAIL ✗'} (rozkład jest ${chiSquare2 < 12.59 ? 'równomierny' : 'nierównomierny'})\n`);

// Test 3: Test z liczeniem prób
console.log('Test 3: Analiza liczby prób (10,000 wywołań)');
const attempts = [];
for (let i = 0; i < 10000; i++) {
  const result = rand7WithAttempts();
  attempts.push(result.attempts);
}

const avgAttempts = attempts.reduce((a, b) => a + b, 0) / attempts.length;
const maxAttempts = Math.max(...attempts);
const attemptCounts = {};

attempts.forEach(a => {
  attemptCounts[a] = (attemptCounts[a] || 0) + 1;
});

console.log(`Średnia liczba prób: ${avgAttempts.toFixed(3)}`);
console.log(`Teoretyczna wartość: ${(25 / 21).toFixed(3)} ≈ 1.19`);
console.log(`Maksymalna liczba prób: ${maxAttempts}`);
console.log(`\nRozkład prób:`);
Object.keys(attemptCounts).sort((a, b) => a - b).slice(0, 5).forEach(k => {
  const percentage = (attemptCounts[k] / 10000 * 100).toFixed(2);
  console.log(`  ${k} prób: ${attemptCounts[k]} razy (${percentage}%)`);
});
console.log();

// Test 4: Porównanie wszystkich metod
console.log('Test 4: Porównanie rozkładów wszystkich metod (10,000 prób każda)');

const methods = [
  { name: 'rand7 (podstawowa)', func: rand7 },
  { name: 'rand7Optimized', func: rand7Optimized },
  { name: 'rand7FromRand2', func: rand7FromRand2 },
  { name: 'rand7Generic', func: rand7Generic }
];

methods.forEach(({ name, func }) => {
  const results = testDistribution(func, 10000, 7);
  const counts = results.map(r => r.count);
  const expected = 10000 / 7;
  const chiSquare = chiSquareTest(counts, expected);

  console.log(`${name}:`);
  console.log(`  Chi-Square: ${chiSquare.toFixed(2)} ${chiSquare < 12.59 ? '✓' : '✗'}`);

  const maxDeviation = Math.max(...results.map(r => Math.abs(parseFloat(r.deviation))));
  console.log(`  Max deviation: ${maxDeviation.toFixed(2)}%\n`);
});

// Test 5: Test wydajności
console.log('Test 5: Test wydajności (100,000 wywołań)');

const perfTests = [
  { name: 'rand7', func: rand7 },
  { name: 'rand7Optimized', func: rand7Optimized },
  { name: 'rand7FromRand2', func: rand7FromRand2 },
  { name: 'rand7Generic', func: rand7Generic }
];

perfTests.forEach(({ name, func }) => {
  const start = Date.now();
  for (let i = 0; i < 100000; i++) {
    func();
  }
  const time = Date.now() - start;
  console.log(`  ${name}: ${time}ms`);
});
console.log();

// Test 6: Wizualizacja procesu rand25
console.log('Test 6: Wizualizacja procesu generowania rand25');
console.log('\nTabela rand5() * 5 + rand5():');
console.log('     | 0   1   2   3   4');
console.log('-----|------------------');

for (let i = 0; i < 5; i++) {
  let row = `${(i * 5).toString().padStart(4)} |`;
  for (let j = 0; j < 5; j++) {
    const num = i * 5 + j;
    const marker = num < 21 ? ' ' : '*';
    row += `${num.toString().padStart(3)}${marker}`;
  }
  console.log(row);
}

console.log('\n* = odrzucone wartości (21-24)');
console.log('Pozostałe 0-20 (21 wartości) dają równomierny rozkład 0-6\n');

// Test 7: Analiza grup modulo 7
console.log('Test 7: Analiza grup modulo 7 dla wartości 0-20');
const groups = {};
for (let i = 0; i <= 20; i++) {
  const mod = i % 7;
  if (!groups[mod]) groups[mod] = [];
  groups[mod].push(i);
}

Object.keys(groups).sort((a, b) => a - b).forEach(k => {
  console.log(`  ${k}: [${groups[k].join(', ')}] (${groups[k].length} wartości)`);
});

console.log('\nKażda grupa ma dokładnie 3 wartości → P(k) = 3/21 = 1/7 ✓\n');

// Test 8: Test dla różnych rozmiarów próbek
console.log('Test 8: Test równomierności dla różnych rozmiarów próbek');
const sampleSizes = [1000, 10000, 100000, 500000];

sampleSizes.forEach(size => {
  const results = testDistribution(rand7, size, 7);
  const counts = results.map(r => r.count);
  const expected = size / 7;
  const chiSquare = chiSquareTest(counts, expected);

  console.log(`  n=${size.toLocaleString()}:`);
  console.log(`    Chi-Square: ${chiSquare.toFixed(2)} ${chiSquare < 12.59 ? '✓' : '✗'}`);
});
console.log();

// Test 9: Test granic (Edge cases)
console.log('Test 9: Weryfikacja zakresu wartości');
const testCount = 100000;
let minValue = Infinity;
let maxValue = -Infinity;
let outOfRange = 0;

for (let i = 0; i < testCount; i++) {
  const val = rand7();
  minValue = Math.min(minValue, val);
  maxValue = Math.max(maxValue, val);

  if (val < 0 || val > 6) {
    outOfRange++;
  }
}

console.log(`Minimum: ${minValue} (oczekiwane: 0)`);
console.log(`Maximum: ${maxValue} (oczekiwane: 6)`);
console.log(`Wartości poza zakresem: ${outOfRange} (oczekiwane: 0)`);
console.log(`Test ${minValue === 0 && maxValue === 6 && outOfRange === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 10: Uogólnienie - rand3 z rand5
console.log('Test 10: Uogólnienie - rand3 z rand5');
function rand3() {
  return randN_from_randM(3, 5, rand5);
}

const results10 = testDistribution(rand3, 30000, 3);
console.log('Rozkład rand3 (30,000 prób):');
results10.forEach(({ num, count, percentage, expectedPercentage }) => {
  console.log(`  ${num}: ${count} (${percentage}%, oczekiwane: ${expectedPercentage}%)`);
});
console.log();

// Test 11: Uogólnienie - rand10 z rand5
console.log('Test 11: Uogólnienie - rand10 z rand5');
function rand10() {
  return randN_from_randM(10, 5, rand5);
}

const results11 = testDistribution(rand10, 50000, 10);
const counts11 = results11.map(r => r.count);
const chiSquare11 = chiSquareTest(counts11, 5000);
console.log(`Chi-Square dla rand10: ${chiSquare11.toFixed(2)}`);
console.log(`Dla 9 stopni swobody przy α=0.05, krytyczna wartość ≈ 16.92`);
console.log(`Test ${chiSquare11 < 16.92 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Prawdopodobieństwo teoretyczne vs rzeczywiste
console.log('Test 12: Analiza prawdopodobieństwa');
const theoretical = {
  acceptance: 21 / 25,
  rejection: 4 / 25,
  avgAttempts: 25 / 21
};

console.log('Teoretyczne wartości:');
console.log(`  P(akceptacja) = 21/25 = ${(theoretical.acceptance * 100).toFixed(2)}%`);
console.log(`  P(odrzucenie) = 4/25 = ${(theoretical.rejection * 100).toFixed(2)}%`);
console.log(`  Średnia liczba prób = 25/21 = ${theoretical.avgAttempts.toFixed(3)}`);
console.log();

// Test 13: Symulacja "najgorszego przypadku"
console.log('Test 13: Symulacja wielu prób');
const manyTrials = [];
for (let i = 0; i < 1000; i++) {
  const result = rand7WithAttempts();
  manyTrials.push(result.attempts);
}

const sorted = [...manyTrials].sort((a, b) => b - a);
console.log(`Top 10 największych liczb prób: ${sorted.slice(0, 10).join(', ')}`);
console.log(`Prawdopodobieństwo ≥5 prób: ${((manyTrials.filter(a => a >= 5).length / 1000) * 100).toFixed(2)}%`);
console.log(`Prawdopodobieństwo teoretyczne ≥5 prób: ${((4 / 25) ** 4 * 100).toFixed(2)}%\n`);

// Test 14: Sprawdzenie czy rand5() działa poprawnie
console.log('Test 14: Weryfikacja rand5() (bazowa funkcja)');
const results14 = testDistribution(rand5, 50000, 5);
console.log('Rozkład rand5:');
results14.forEach(({ num, count, percentage, expectedPercentage }) => {
  console.log(`  ${num}: ${count} (${percentage}%, oczekiwane: ${expectedPercentage}%)`);
});

const counts14 = results14.map(r => r.count);
const chiSquare14 = chiSquareTest(counts14, 10000);
console.log(`\nChi-Square: ${chiSquare14.toFixed(2)}`);
console.log(`Test ${chiSquare14 < 9.49 ? 'PASS ✓' : 'FAIL ✗'} (dla 4 stopni swobody)\n`);

// Test 15: Końcowy test poprawności
console.log('Test 15: Końcowy test poprawności');
const finalResults = testDistribution(rand7, 1000000, 7);
visualizeDistribution(finalResults);

const finalCounts = finalResults.map(r => r.count);
const finalExpected = 1000000 / 7;
const finalChiSquare = chiSquareTest(finalCounts, finalExpected);

console.log(`\nChi-Square: ${finalChiSquare.toFixed(2)}`);
console.log(`Dla 6 stopni swobody przy α=0.05, krytyczna wartość ≈ 12.59`);
console.log(`\nTest końcowy: ${finalChiSquare < 12.59 ? 'PASS ✓' : 'FAIL ✗'}\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('Rand7 From Rand5 - Rejection Sampling');
console.log('\nZłożoność:');
console.log('  Czasowa:  O(1) średnio - oczekiwana liczba prób ≈ 1.19');
console.log('  Pamięciowa: O(1) - tylko kilka zmiennych');
console.log('\nKluczowa idea:');
console.log('  1. Stwórz rand25 używając rand5() dwa razy');
console.log('  2. Użyj tylko 0-20 (21 wartości = 3×7) dla równomiernego rozkładu');
console.log('  3. Odrzuć 21-24 i spróbuj ponownie');
console.log('  4. num % 7 daje równomiernie rozłożone 0-6');
console.log('\nZastosowania:');
console.log('  - Symulacje Monte Carlo');
console.log('  - Generowanie fair random numbers z ograniczonych źródeł');
console.log('  - Kryptografia (generowanie równomiernie rozłożonych wartości)');
console.log('  - Sampling z niestandardowych rozkładów');
