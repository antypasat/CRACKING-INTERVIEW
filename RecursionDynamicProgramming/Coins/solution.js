// ============================================================================
// 8.11 COINS - WAYS TO MAKE CHANGE
// 8.11 MONETY - SPOSOBY NA WYDANIE RESZTY
// ============================================================================

// ============================================================================
// APPROACH 1: RECURSIVE (BRUTE FORCE)
// PODEJŚCIE 1: REKURENCYJNE (BRUTE FORCE)
// ============================================================================

/**
 * Coins - Recursive Brute Force
 * Monety - Rekurencyjne Brute Force
 *
 * Count ways to represent n cents using quarters (25), dimes (10), nickels (5), pennies (1)
 * Policz sposoby na reprezentację n centów używając: 25, 10, 5, 1
 *
 * Time: O(4^n) - Exponential / Wykładniczy
 * Space: O(n) for recursion stack / dla stosu rekurencji
 *
 * @param {number} n - Amount in cents / Kwota w centach
 * @returns {number} - Number of ways / Liczba sposobów
 */
function makeChangeRecursive(n) {
  const denoms = [25, 10, 5, 1]; // Quarters, dimes, nickels, pennies
  return makeChangeRecurseHelper(n, denoms, 0);
}

/**
 * Helper: Recursive function to count ways
 * Pomocnicza: Rekurencyjna funkcja do liczenia sposobów
 *
 * @param {number} amount - Remaining amount / Pozostała kwota
 * @param {number[]} denoms - Denominations / Nominały
 * @param {number} index - Current denomination index / Indeks bieżącego nominału
 */
function makeChangeRecurseHelper(amount, denoms, index) {
  // Base cases / Przypadki bazowe
  if (index >= denoms.length - 1) {
    // Only pennies left / Zostały tylko pensy
    return 1; // One way: all pennies / Jeden sposób: same pensy
  }

  const denomAmount = denoms[index];
  let ways = 0;

  // Try using 0, 1, 2, ... of current denomination / Spróbuj użyć 0, 1, 2, ... bieżącego nominału
  for (let i = 0; i * denomAmount <= amount; i++) {
    const remainingAmount = amount - i * denomAmount;
    ways += makeChangeRecurseHelper(remainingAmount, denoms, index + 1);
  }

  return ways;
}

// ============================================================================
// APPROACH 2: DYNAMIC PROGRAMMING (MEMOIZATION)
// PODEJŚCIE 2: PROGRAMOWANIE DYNAMICZNE (MEMOIZACJA)
// ============================================================================

/**
 * Coins - DP with Memoization (Top-Down)
 * Monety - DP z Memoizacją (Top-Down)
 *
 * Use memoization to cache subproblems
 * Użyj memoizacji do cache'owania podproblemów
 *
 * Time: O(n*d) where d is number of denominations / gdzie d to liczba nominałów
 * Space: O(n*d) for memo table / dla tabeli memo
 *
 * @param {number} n - Amount in cents / Kwota w centach
 * @returns {number} - Number of ways / Liczba sposobów
 */
function makeChangeMemo(n) {
  const denoms = [25, 10, 5, 1];
  const memo = new Map();
  return makeChangeMemoHelper(n, denoms, 0, memo);
}

/**
 * Helper with memoization / Pomocnicza z memoizacją
 */
function makeChangeMemoHelper(amount, denoms, index, memo) {
  // Base cases / Przypadki bazowe
  if (amount === 0) return 1; // Found a way / Znaleziono sposób
  if (index >= denoms.length) return 0; // No way / Brak sposobu

  // Create key for memoization / Utwórz klucz dla memoizacji
  const key = `${amount}-${index}`;

  if (memo.has(key)) {
    return memo.get(key);
  }

  const denomAmount = denoms[index];
  let ways = 0;

  // Try using 0, 1, 2, ... of current denomination / Spróbuj użyć 0, 1, 2, ... bieżącego nominału
  for (let i = 0; i * denomAmount <= amount; i++) {
    const remainingAmount = amount - i * denomAmount;
    ways += makeChangeMemoHelper(remainingAmount, denoms, index + 1, memo);
  }

  memo.set(key, ways);
  return ways;
}

// ============================================================================
// APPROACH 3: DYNAMIC PROGRAMMING (TABULATION/BOTTOM-UP)
// PODEJŚCIE 3: PROGRAMOWANIE DYNAMICZNE (TABULACJA/BOTTOM-UP)
// ============================================================================

/**
 * Coins - DP Tabulation (Bottom-Up)
 * Monety - DP Tabulacja (Bottom-Up)
 *
 * Build table from bottom up
 * Buduj tabelę od dołu do góry
 *
 * Time: O(n*d) where d is number of denominations / gdzie d to liczba nominałów
 * Space: O(n) - only need 1D array / tylko potrzebna tablica 1D
 *
 * @param {number} n - Amount in cents / Kwota w centach
 * @returns {number} - Number of ways / Liczba sposobów
 */
function makeChangeDP(n) {
  const denoms = [25, 10, 5, 1];

  // dp[i] = number of ways to make amount i / liczba sposobów na kwotę i
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // One way to make 0: use no coins / Jeden sposób na 0: nie używaj monet

  // For each denomination / Dla każdego nominału
  for (const denom of denoms) {
    // Update all amounts that can use this denomination
    // Aktualizuj wszystkie kwoty które mogą użyć tego nominału
    for (let amount = denom; amount <= n; amount++) {
      dp[amount] += dp[amount - denom];
    }
  }

  return dp[n];
}

// ============================================================================
// APPROACH 4: OPTIMIZED DP WITH CUSTOM DENOMINATIONS
// PODEJŚCIE 4: ZOPTYMALIZOWANE DP Z DOWOLNYMI NOMINAŁAMI
// ============================================================================

/**
 * Coins - Generic DP for any denominations
 * Monety - Ogólne DP dla dowolnych nominałów
 *
 * Works with any set of coin denominations
 * Działa z dowolnym zestawem nominałów monet
 *
 * Time: O(n*d)
 * Space: O(n)
 *
 * @param {number} n - Amount in cents / Kwota w centach
 * @param {number[]} denoms - Coin denominations / Nominały monet
 * @returns {number} - Number of ways / Liczba sposobów
 */
function makeChangeGeneric(n, denoms = [25, 10, 5, 1]) {
  if (n < 0) return 0;
  if (n === 0) return 1;

  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;

  for (const denom of denoms) {
    for (let amount = denom; amount <= n; amount++) {
      dp[amount] += dp[amount - denom];
    }
  }

  return dp[n];
}

// ============================================================================
// APPROACH 5: WITH ACTUAL COMBINATIONS (BACKTRACKING)
// PODEJŚCIE 5: Z RZECZYWISTYMI KOMBINACJAMI (BACKTRACKING)
// ============================================================================

/**
 * Find all actual combinations (not just count)
 * Znajdź wszystkie rzeczywiste kombinacje (nie tylko liczbę)
 *
 * Returns array of all ways to make change
 * Zwraca tablicę wszystkich sposobów na wydanie reszty
 *
 * @param {number} n - Amount in cents / Kwota w centach
 * @returns {number[][]} - All combinations / Wszystkie kombinacje
 */
function makeChangeCombinations(n) {
  const denoms = [25, 10, 5, 1];
  const results = [];

  function backtrack(amount, index, current) {
    if (amount === 0) {
      results.push([...current]);
      return;
    }

    if (index >= denoms.length || amount < 0) {
      return;
    }

    const denom = denoms[index];

    // Try using 0, 1, 2, ... of current coin / Spróbuj użyć 0, 1, 2, ... bieżącej monety
    for (let count = 0; count * denom <= amount; count++) {
      current[index] = count;
      backtrack(amount - count * denom, index + 1, current);
      current[index] = 0;
    }
  }

  backtrack(n, 0, [0, 0, 0, 0]);
  return results;
}

/**
 * Format combination for display / Formatuj kombinację do wyświetlenia
 */
function formatCombination(combo) {
  const [quarters, dimes, nickels, pennies] = combo;
  const parts = [];

  if (quarters > 0) parts.push(`${quarters}Q`);
  if (dimes > 0) parts.push(`${dimes}D`);
  if (nickels > 0) parts.push(`${nickels}N`);
  if (pennies > 0) parts.push(`${pennies}P`);

  return parts.join(' + ') || '0';
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Test all approaches and verify they give same result
 * Testuj wszystkie podejścia i zweryfikuj że dają ten sam wynik
 */
function testAllApproaches(n, description) {
  console.log('='.repeat(70));
  console.log(description);
  console.log('='.repeat(70));
  console.log(`Amount: ${n} cents / centów`);
  console.log();

  // Test different approaches / Testuj różne podejścia
  console.time('Recursive (slow for large n)');
  const result1 = n <= 100 ? makeChangeRecursive(n) : 'Skipped (too slow)';
  console.timeEnd('Recursive (slow for large n)');

  console.time('DP Memoization');
  const result2 = makeChangeMemo(n);
  console.timeEnd('DP Memoization');

  console.time('DP Tabulation');
  const result3 = makeChangeDP(n);
  console.timeEnd('DP Tabulation');

  console.time('Generic DP');
  const result4 = makeChangeGeneric(n);
  console.timeEnd('Generic DP');

  console.log();
  console.log(`Results / Wyniki:`);
  console.log(`  Recursive:      ${result1}`);
  console.log(`  Memoization:    ${result2}`);
  console.log(`  Tabulation:     ${result3}`);
  console.log(`  Generic:        ${result4}`);

  const allMatch = (result1 === 'Skipped (too slow)' || result1 === result2) &&
                   result2 === result3 && result3 === result4;

  console.log();
  console.log(`All approaches match: ${allMatch ? '✓' : '✗'}`);
  console.log();

  return result3;
}

/**
 * Show some example combinations / Pokaż przykładowe kombinacje
 */
function showCombinations(n, limit = 10) {
  console.log(`Example combinations for ${n} cents (showing first ${limit}):`);
  console.log(`Przykładowe kombinacje dla ${n} centów (pokazuję pierwsze ${limit}):`);
  console.log();

  const combinations = makeChangeCombinations(n);

  for (let i = 0; i < Math.min(limit, combinations.length); i++) {
    const combo = combinations[i];
    const formatted = formatCombination(combo);
    const total = combo[0] * 25 + combo[1] * 10 + combo[2] * 5 + combo[3] * 1;
    console.log(`  ${i + 1}. ${formatted.padEnd(30)} = ${total} cents`);
  }

  if (combinations.length > limit) {
    console.log(`  ... and ${combinations.length - limit} more ways`);
  }

  console.log();
  return combinations.length;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('\n');
console.log('='.repeat(70));
console.log('COINS - WAYS TO MAKE CHANGE');
console.log('MONETY - SPOSOBY NA WYDANIE RESZTY');
console.log('='.repeat(70));
console.log('\n');

// Test 1: Small amount
testAllApproaches(5, 'TEST 1: 5 cents (nickel or 5 pennies) / 5 centów');
showCombinations(5);

// Test 2: Dime
testAllApproaches(10, 'TEST 2: 10 cents (dime) / 10 centów');
showCombinations(10);

// Test 3: Quarter
testAllApproaches(25, 'TEST 3: 25 cents (quarter) / 25 centów');
showCombinations(25);

// Test 4: 50 cents
testAllApproaches(50, 'TEST 4: 50 cents (half dollar) / 50 centów');
showCombinations(50, 15);

// Test 5: 100 cents (1 dollar)
testAllApproaches(100, 'TEST 5: 100 cents (1 dollar) / 100 centów (1 dolar)');
console.log(`Total combinations for 100 cents: ${makeChangeDP(100)}`);
console.log();

// Test 6: Larger amount
testAllApproaches(200, 'TEST 6: 200 cents (2 dollars) / 200 centów (2 dolary)');

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log('\n');

// Edge Case 1: Zero cents
console.log('EDGE CASE 1: 0 cents (one way: no coins)');
console.log('            0 centów (jeden sposób: brak monet)');
console.log('-'.repeat(70));
const zero = makeChangeDP(0);
console.log(`Result: ${zero} ${zero === 1 ? '✓' : '✗'}`);
console.log();

// Edge Case 2: One cent
console.log('EDGE CASE 2: 1 cent (one penny)');
console.log('            1 cent (jeden pens)');
console.log('-'.repeat(70));
const one = makeChangeDP(1);
console.log(`Result: ${one} ${one === 1 ? '✓' : '✗'}`);
console.log();

// Edge Case 3: Custom denominations
console.log('EDGE CASE 3: Custom denominations [1, 5, 10]');
console.log('            Niestandardowe nominały [1, 5, 10]');
console.log('-'.repeat(70));
const custom = makeChangeGeneric(15, [1, 5, 10]);
console.log(`Ways to make 15 cents with [1,5,10]: ${custom}`);
showCombinations(15);

// Edge Case 4: Large amount (performance test)
console.log('EDGE CASE 4: Large amount (500 cents / 5 dollars)');
console.log('            Duża kwota (500 centów / 5 dolarów)');
console.log('-'.repeat(70));
console.time('DP for 500 cents');
const large = makeChangeDP(500);
console.timeEnd('DP for 500 cents');
console.log(`Result: ${large} ways`);
console.log();

// ============================================================================
// PATTERN ANALYSIS / ANALIZA WZORCÓW
// ============================================================================

console.log('='.repeat(70));
console.log('PATTERN ANALYSIS / ANALIZA WZORCÓW');
console.log('='.repeat(70));
console.log('\n');

console.log('Ways to make different amounts:');
console.log('Sposoby na różne kwoty:');
console.log();
console.log('Amount | Ways | Pattern');
console.log('-------|------|--------');

for (let amount of [0, 1, 5, 10, 15, 20, 25, 30, 40, 50]) {
  const ways = makeChangeDP(amount);
  console.log(`${amount.toString().padStart(6)} | ${ways.toString().padStart(4)} |`);
}
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Recursive Brute Force / Rekurencyjne Brute Force');
console.log('  Time:  O(4^n) - Exponential, very slow / Wykładnicze, bardzo wolne');
console.log('  Space: O(n) - Recursion stack / Stos rekurencji');
console.log();
console.log('APPROACH 2: DP with Memoization / DP z Memoizacją');
console.log('  Time:  O(n*d) - where d = number of denominations / liczba nominałów');
console.log('  Space: O(n*d) - Memo table / Tabela memo');
console.log();
console.log('APPROACH 3: DP Tabulation (BEST) / DP Tabulacja (NAJLEPSZE)');
console.log('  Time:  O(n*d)');
console.log('  Space: O(n) - Only 1D array / Tylko tablica 1D');
console.log();
console.log('For n=100 with 4 denominations:');
console.log('  Recursive: ~4^100 operations (practically infinite)');
console.log('  DP:        ~100*4 = 400 operations');
console.log();
console.log('='.repeat(70));
