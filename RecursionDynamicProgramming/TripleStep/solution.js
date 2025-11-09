// ============================================================================
// 8.1 TRIPLE STEP
// ============================================================================

/**
 * Triple Step Problem
 * Zadanie Potrójnego Kroku
 *
 * A child is running up a staircase with n steps and can hop either 1, 2, or 3
 * steps at a time. Implement a method to count how many possible ways the child
 * can run up the stairs.
 *
 * Dziecko wspina się po schodach z n stopni i może przeskoczyć 1, 2 lub 3
 * stopnie naraz. Zaimplementuj metodę liczącą ile możliwych sposobów dziecko
 * ma na pokonanie schodów.
 */

// ============================================================================
// APPROACH 1: NAIVE RECURSIVE
// PODEJŚCIE 1: NAIWNA REKURENCJA
// ============================================================================

/**
 * Count ways to climb stairs - Naive Recursive
 * Policz sposoby wspinania się - Naiwna rekurencja
 *
 * Base case:
 * - n = 0: 1 way (stay at ground)
 * - n < 0: 0 ways (invalid)
 *
 * Recursive case: ways(n) = ways(n-1) + ways(n-2) + ways(n-3)
 *
 * Time: O(3^n) - exponential / wykładnicza
 * Space: O(n) - recursion stack / stos rekurencji
 *
 * @param {number} n - Number of steps / Liczba stopni
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countWaysNaive(n) {
  // Base cases / Przypadki bazowe
  if (n < 0) return 0;      // Invalid path / Nieprawidłowa ścieżka
  if (n === 0) return 1;    // One way: stay / Jeden sposób: zostań

  // Recursive case: try all three hop sizes
  // Przypadek rekurencyjny: spróbuj wszystkich trzech rozmiarów skoków
  return countWaysNaive(n - 1) +   // 1 step / 1 krok
         countWaysNaive(n - 2) +   // 2 steps / 2 kroki
         countWaysNaive(n - 3);    // 3 steps / 3 kroki
}

// ============================================================================
// APPROACH 2: MEMOIZATION (TOP-DOWN DP)
// PODEJŚCIE 2: MEMOIZACJA (DP OD GÓRY)
// ============================================================================

/**
 * Count ways to climb stairs - Memoization
 * Policz sposoby wspinania się - Memoizacja
 *
 * Uses hash map to cache previously computed results
 * Używa mapy haszującej do buforowania wcześniej obliczonych wyników
 *
 * Time: O(n) - each state computed once / każdy stan obliczany raz
 * Space: O(n) - memo + recursion stack / memo + stos rekurencji
 *
 * @param {number} n - Number of steps / Liczba stopni
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countWaysMemo(n) {
  const memo = new Map();
  return countWaysMemoHelper(n, memo);
}

/**
 * Helper function with memoization
 * Funkcja pomocnicza z memoizacją
 */
function countWaysMemoHelper(n, memo) {
  // Base cases / Przypadki bazowe
  if (n < 0) return 0;
  if (n === 0) return 1;

  // Check if already computed / Sprawdź czy już obliczone
  if (memo.has(n)) {
    return memo.get(n);
  }

  // Compute and store result / Oblicz i zapisz wynik
  const result = countWaysMemoHelper(n - 1, memo) +
                 countWaysMemoHelper(n - 2, memo) +
                 countWaysMemoHelper(n - 3, memo);

  memo.set(n, result);
  return result;
}

// ============================================================================
// APPROACH 3: TABULATION (BOTTOM-UP DP)
// PODEJŚCIE 3: TABULACJA (DP OD DOŁU)
// ============================================================================

/**
 * Count ways to climb stairs - Tabulation
 * Policz sposoby wspinania się - Tabulacja
 *
 * Builds solution iteratively from bottom up
 * Buduje rozwiązanie iteracyjnie od dołu
 *
 * Time: O(n) - single pass / jedno przejście
 * Space: O(n) - dp array / tablica dp
 *
 * @param {number} n - Number of steps / Liczba stopni
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countWaysTabulation(n) {
  if (n < 0) return 0;
  if (n === 0) return 1;

  // Create DP table / Utwórz tablicę DP
  const dp = new Array(n + 1).fill(0);

  // Base cases / Przypadki bazowe
  dp[0] = 1;  // 1 way to stay at ground / 1 sposób na zostanie na ziemi
  dp[1] = 1;  // 1 way to reach step 1: (1) / 1 sposób na dojście do stopnia 1
  dp[2] = 2;  // 2 ways to reach step 2: (1,1) or (2) / 2 sposoby: (1,1) lub (2)

  // Fill table / Wypełnij tabelę
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] +   // From 1 step below / Z 1 stopnia poniżej
            dp[i - 2] +   // From 2 steps below / Z 2 stopni poniżej
            dp[i - 3];    // From 3 steps below / Z 3 stopni poniżej
  }

  return dp[n];
}

// ============================================================================
// APPROACH 4: SPACE-OPTIMIZED DP
// PODEJŚCIE 4: DP ZOPTYMALIZOWANE PAMIĘCIOWO
// ============================================================================

/**
 * Count ways to climb stairs - Space Optimized
 * Policz sposoby wspinania się - Optymalizacja pamięciowa
 *
 * Only keeps track of last 3 values instead of entire array
 * Przechowuje tylko ostatnie 3 wartości zamiast całej tablicy
 *
 * Time: O(n) - single pass / jedno przejście
 * Space: O(1) - only 3 variables / tylko 3 zmienne
 *
 * @param {number} n - Number of steps / Liczba stopni
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countWaysOptimized(n) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return 1;
  if (n === 2) return 2;

  // Keep track of last 3 values / Śledź ostatnie 3 wartości
  let threeBack = 1;  // dp[i-3]
  let twoBack = 1;    // dp[i-2]
  let oneBack = 2;    // dp[i-1]

  // Build up to n / Buduj do n
  for (let i = 3; i <= n; i++) {
    const current = oneBack + twoBack + threeBack;

    // Shift values / Przesuń wartości
    threeBack = twoBack;
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}

// ============================================================================
// HELPER FUNCTIONS / FUNKCJE POMOCNICZE
// ============================================================================

/**
 * Print step-by-step solution for understanding
 * Wypisz rozwiązanie krok po kroku dla zrozumienia
 */
function printStepByStep(n) {
  console.log(`\nStep-by-step for n=${n}:`);
  console.log(`Krok po kroku dla n=${n}:`);
  console.log('-'.repeat(50));

  const dp = [1, 1, 2]; // Base cases

  console.log(`dp[0] = 1  (base case / przypadek bazowy)`);
  console.log(`dp[1] = 1  (base case / przypadek bazowy)`);
  console.log(`dp[2] = 2  (base case / przypadek bazowy)`);

  for (let i = 3; i <= n; i++) {
    const val = dp[i - 1] + dp[i - 2] + dp[i - 3];
    dp[i] = val;
    console.log(`dp[${i}] = dp[${i-1}] + dp[${i-2}] + dp[${i-3}] = ${dp[i-1]} + ${dp[i-2]} + ${dp[i-3]} = ${val}`);
  }

  console.log(`\nResult / Wynik: ${dp[n]} ways / sposobów`);
}

/**
 * Measure execution time
 * Zmierz czas wykonania
 */
function measureTime(fn, n, name) {
  const start = process.hrtime.bigint();
  const result = fn(n);
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to ms

  console.log(`${name}: ${result} ways, Time: ${duration.toFixed(3)}ms`);
  return result;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('TRIPLE STEP - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Small values / Małe wartości
console.log('TEST 1: Small values (0-5)');
console.log('       Małe wartości (0-5)');
console.log('-'.repeat(70));
for (let i = 0; i <= 5; i++) {
  const naive = countWaysNaive(i);
  const memo = countWaysMemo(i);
  const tab = countWaysTabulation(i);
  const opt = countWaysOptimized(i);

  const allMatch = naive === memo && memo === tab && tab === opt;

  console.log(`n=${i}: ${naive} ways | All match: ${allMatch ? '✓' : '✗'}`);
}
console.log();

// Test 2: Step-by-step example / Przykład krok po kroku
console.log('TEST 2: Step-by-step example for n=4');
console.log('       Przykład krok po kroku dla n=4');
console.log('-'.repeat(70));
printStepByStep(4);
console.log();

// Test 3: Medium values / Średnie wartości
console.log('TEST 3: Medium values (10, 15, 20)');
console.log('       Średnie wartości (10, 15, 20)');
console.log('-'.repeat(70));
[10, 15, 20].forEach(n => {
  console.log(`\nn = ${n}:`);
  // Skip naive for large n (too slow)
  const memo = measureTime(countWaysMemo, n, 'Memoization   ');
  const tab = measureTime(countWaysTabulation, n, 'Tabulation    ');
  const opt = measureTime(countWaysOptimized, n, 'Optimized     ');

  const allMatch = memo === tab && tab === opt;
  console.log(`All match: ${allMatch ? '✓' : '✗'}`);
});
console.log();

// Test 4: Large values / Duże wartości
console.log('TEST 4: Large values (30, 35)');
console.log('       Duże wartości (30, 35)');
console.log('-'.repeat(70));
[30, 35].forEach(n => {
  console.log(`\nn = ${n}:`);
  const memo = measureTime(countWaysMemo, n, 'Memoization   ');
  const tab = measureTime(countWaysTabulation, n, 'Tabulation    ');
  const opt = measureTime(countWaysOptimized, n, 'Optimized     ');

  const allMatch = memo === tab && tab === opt;
  console.log(`All match: ${allMatch ? '✓' : '✗'}`);
});
console.log();

// Test 5: Edge cases / Przypadki brzegowe
console.log('TEST 5: Edge cases');
console.log('       Przypadki brzegowe');
console.log('-'.repeat(70));

console.log('n = -1 (negative):');
console.log(`  All approaches: ${countWaysOptimized(-1)} (expected: 0)`);

console.log('\nn = 0 (zero steps):');
console.log(`  All approaches: ${countWaysOptimized(0)} (expected: 1)`);

console.log('\nn = 1 (one step):');
console.log(`  All approaches: ${countWaysOptimized(1)} (expected: 1)`);
console.log();

// Test 6: Pattern visualization / Wizualizacja wzoru
console.log('TEST 6: Pattern visualization for n=3');
console.log('       Wizualizacja wzoru dla n=3');
console.log('-'.repeat(70));
console.log('All possible ways to climb 3 steps:');
console.log('Wszystkie możliwe sposoby na 3 stopnie:');
console.log('  1. (1, 1, 1) - three 1-steps / trzy 1-krokowe');
console.log('  2. (1, 2)    - one 1-step, one 2-step / jeden 1-krok, jeden 2-krok');
console.log('  3. (2, 1)    - one 2-step, one 1-step / jeden 2-krok, jeden 1-krok');
console.log('  4. (3)       - one 3-step / jeden 3-krok');
console.log(`Result: ${countWaysOptimized(3)} ways ✓`);
console.log();

// ============================================================================
// PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI');
console.log('='.repeat(70));
console.log();

console.log('Small n (where naive is still feasible):');
console.log('Małe n (gdzie naiwne jest jeszcze wykonalne):');
console.log('-'.repeat(70));
const n1 = 10;
console.log(`n = ${n1}:`);
measureTime(countWaysNaive, n1, 'Naive (3^n)   ');
measureTime(countWaysMemo, n1, 'Memoization   ');
measureTime(countWaysTabulation, n1, 'Tabulation    ');
measureTime(countWaysOptimized, n1, 'Optimized     ');
console.log();

console.log('Medium n (naive too slow):');
console.log('Średnie n (naiwne zbyt wolne):');
console.log('-'.repeat(70));
const n2 = 25;
console.log(`n = ${n2}:`);
console.log('Naive (3^n)   : SKIPPED (too slow / zbyt wolne)');
measureTime(countWaysMemo, n2, 'Memoization   ');
measureTime(countWaysTabulation, n2, 'Tabulation    ');
measureTime(countWaysOptimized, n2, 'Optimized     ');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Naive Recursive / Naiwna Rekurencja');
console.log('  Time:  O(3^n) - Each call branches 3 ways / Każde wywołanie rozgałęzia się na 3');
console.log('  Space: O(n)   - Recursion stack depth / Głębokość stosu rekurencji');
console.log('  Usable for: n < 20 / Użyteczne dla: n < 20');
console.log();
console.log('APPROACH 2: Memoization (Top-Down DP) / Memoizacja (DP od góry)');
console.log('  Time:  O(n)   - Each subproblem computed once / Każdy podproblem raz');
console.log('  Space: O(n)   - Memo hash map + recursion stack / Mapa memo + stos');
console.log('  Pros:  Easy to implement, only computes needed states');
console.log('         Łatwe do implementacji, oblicza tylko potrzebne stany');
console.log();
console.log('APPROACH 3: Tabulation (Bottom-Up DP) / Tabulacja (DP od dołu)');
console.log('  Time:  O(n)   - Single loop through array / Jedna pętla przez tablicę');
console.log('  Space: O(n)   - DP array / Tablica DP');
console.log('  Pros:  No recursion overhead, iterative');
console.log('         Brak narzutu rekurencji, iteracyjne');
console.log();
console.log('APPROACH 4: Space-Optimized DP / DP zoptymalizowane pamięciowo');
console.log('  Time:  O(n)   - Single loop / Jedna pętla');
console.log('  Space: O(1)   - Only 3 variables / Tylko 3 zmienne');
console.log('  Pros:  OPTIMAL - Best time and space / OPTYMALNE - Najlepszy czas i przestrzeń');
console.log('='.repeat(70));
