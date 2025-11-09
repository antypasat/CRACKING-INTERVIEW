/**
 * Factorial Trailing Zeros
 * Obliczanie liczby zer na końcu n!
 * Calculating number of trailing zeros in n!
 */

/**
 * Podejście 1: Naiwne (dla małych n) - oblicz silnię i zlicz zera
 * Approach 1: Naive (for small n) - calculate factorial and count zeros
 */
function countZerosNaive(n) {
  if (n < 0) return 0;

  // Oblicz silnię (działa tylko dla małych n, np. n < 20)
  let factorial = 1n; // BigInt dla dużych liczb
  for (let i = 2; i <= n; i++) {
    factorial *= BigInt(i);
  }

  // Zlicz zera na końcu
  let count = 0;
  const factStr = factorial.toString();
  for (let i = factStr.length - 1; i >= 0 && factStr[i] === '0'; i--) {
    count++;
  }

  return count;
}

/**
 * Podejście 2: Optymalne - zlicz piątki w rozkładzie
 * Approach 2: Optimal - count 5s in factorization
 *
 * Kluczowa obserwacja: Zera powstają z par (2,5), a dwójek jest zawsze więcej.
 * Key observation: Zeros come from pairs (2,5), and there are always more 2s.
 *
 * Zliczamy ile jest piątek:
 * - n/5 liczb podzielnych przez 5
 * - n/25 liczb podzielnych przez 25 (dodatkowa piątka)
 * - n/125 liczb podzielnych przez 125 (jeszcze jedna piątka)
 * - itd.
 */
function countTrailingZeros(n) {
  if (n < 0) return 0;

  let count = 0;
  let powerOf5 = 5;

  // Zlicz wszystkie piątki w liczbach od 1 do n
  // Count all 5s in numbers from 1 to n
  while (powerOf5 <= n) {
    count += Math.floor(n / powerOf5);
    powerOf5 *= 5;
  }

  return count;
}

/**
 * Podejście 3: Rekurencyjna wersja
 * Approach 3: Recursive version
 */
function countTrailingZerosRecursive(n) {
  if (n < 5) return 0;
  return Math.floor(n / 5) + countTrailingZerosRecursive(Math.floor(n / 5));
}

/**
 * Szczegółowa analiza - pokazuje rozkład
 * Detailed analysis - shows factorization
 */
function analyzeFactorialZeros(n) {
  console.log(`\nAnaliza zer w ${n}!:`);

  let totalFives = 0;
  let power = 5;
  const breakdown = [];

  while (power <= n) {
    const count = Math.floor(n / power);
    totalFives += count;
    breakdown.push({
      power: power,
      count: count,
      description: `Liczby podzielne przez ${power}: ${count}`
    });
    power *= 5;
  }

  breakdown.forEach(item => {
    console.log(`  ${item.description}`);
  });

  console.log(`\nCałkowita liczba piątek: ${totalFives}`);
  console.log(`Liczba zer na końcu: ${totalFives}`);

  return totalFives;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Factorial Trailing Zeros ===\n');

// Test 1: Małe wartości
console.log('Test 1: Małe wartości');
[0, 1, 2, 3, 4, 5, 6, 10, 15, 20].forEach(n => {
  const zeros = countTrailingZeros(n);
  console.log(`${n}! ma ${zeros} zer na końcu`);
});
console.log();

// Test 2: Porównanie z naiwnym podejściem (dla małych n)
console.log('Test 2: Porównanie z naiwnym podejściem');
for (let n = 5; n <= 20; n += 5) {
  const optimal = countTrailingZeros(n);
  const naive = countZerosNaive(n);
  console.log(`n=${n}: optimal=${optimal}, naive=${naive}, zgodne=${optimal === naive ? '✓' : '✗'}`);
}
console.log();

// Test 3: Szczegółowa analiza dla wybranych wartości
console.log('Test 3: Szczegółowa analiza');
analyzeFactorialZeros(25);
analyzeFactorialZeros(100);
analyzeFactorialZeros(125);

// Test 4: Duże wartości
console.log('\nTest 4: Duże wartości');
[100, 500, 1000, 5000, 10000, 100000, 1000000].forEach(n => {
  const zeros = countTrailingZeros(n);
  console.log(`${n}! ma ${zeros} zer na końcu`);
});
console.log();

// Test 5: Porównanie rekurencyjnej wersji
console.log('Test 5: Porównanie metod');
const testValue = 1000;
console.log(`Dla n = ${testValue}:`);
console.log(`Iteracyjna:  ${countTrailingZeros(testValue)}`);
console.log(`Rekurencyjna: ${countTrailingZerosRecursive(testValue)}`);
console.log();

// Test 6: Edge cases
console.log('Test 6: Edge cases');
console.log(`0! ma ${countTrailingZeros(0)} zer (0! = 1)`);
console.log(`1! ma ${countTrailingZeros(1)} zer (1! = 1)`);
console.log(`4! ma ${countTrailingZeros(4)} zer (4! = 24)`);
console.log(`5! ma ${countTrailingZeros(5)} zer (5! = 120)`);
console.log();

// Test 7: Weryfikacja z rzeczywistymi wartościami
console.log('Test 7: Weryfikacja z rzeczywistymi silniami (małe n)');
const testCases = [
  { n: 5, factorial: '120', expectedZeros: 1 },
  { n: 10, factorial: '3628800', expectedZeros: 2 },
  { n: 15, factorial: '1307674368000', expectedZeros: 3 },
  { n: 20, factorial: '2432902008176640000', expectedZeros: 4 }
];

testCases.forEach(({ n, factorial, expectedZeros }) => {
  const computed = countTrailingZeros(n);
  const actualZeros = (factorial.match(/0*$/)?.[0] || '').length;
  console.log(`${n}!:`);
  console.log(`  Silnia: ${factorial}`);
  console.log(`  Obliczone zera: ${computed}`);
  console.log(`  Oczekiwane zera: ${expectedZeros}`);
  console.log(`  Faktyczne zera: ${actualZeros}`);
  console.log(`  Poprawne: ${computed === expectedZeros && computed === actualZeros ? '✓' : '✗'}`);
});
console.log();

// Test 8: Test wydajności
console.log('Test 8: Test wydajności');
const iterations = 100000;
const testN = 10000;

console.log(`Obliczanie zer w ${testN}! ${iterations} razy...`);
const start = Date.now();
for (let i = 0; i < iterations; i++) {
  countTrailingZeros(testN);
}
const end = Date.now();

console.log(`Czas: ${end - start}ms`);
console.log(`Średnio: ${((end - start) / iterations * 1000).toFixed(2)}μs na wywołanie`);
console.log();

// Test 9: Matematyczne wyjaśnienie
console.log('Test 9: Dlaczego to działa?');
console.log('\nPrzykład dla 25!:');
console.log('Liczby z jedną 5: 5, 10, 15, 20, 25 → 5 liczb → 25/5 = 5');
console.log('Liczby z dwiema 5: 25 → 1 liczba → 25/25 = 1');
console.log('Całkowicie: 5 + 1 = 6 piątek');
console.log('Dwójek jest więcej, więc 6 par (2,5) = 6 zer');
console.log(`Obliczone: ${countTrailingZeros(25)} zer ✓`);

console.log('\n=== Podsumowanie / Summary ===');
console.log('Złożoność: O(log₅ n)');
console.log('Pamięć: O(1)');
console.log('Działa dla bardzo dużych n (nie trzeba obliczać silni!)');
