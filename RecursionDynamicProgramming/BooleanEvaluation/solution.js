// ============================================================================
// 8.14 BOOLEAN EVALUATION - COUNT WAYS TO PARENTHESIZE
// 8.14 EWALUACJA BOOLOWSKA - POLICZ SPOSOBY NAWISKOWANIA
// ============================================================================

// ============================================================================
// APPROACH 1: RECURSIVE (BRUTE FORCE)
// PODEJŚCIE 1: REKURENCYJNE (BRUTE FORCE)
// ============================================================================

/**
 * Boolean Evaluation - Recursive
 * Ewaluacja Boolowska - Rekurencyjna
 *
 * Count ways to parenthesize boolean expression to get desired result
 * Policz sposoby nawiskowania wyrażenia boolowskiego aby dostać pożądany wynik
 *
 * Expression: "1^0|0|1" where 1=true, 0=false, ^=XOR, &=AND, |=OR
 * Wyrażenie: "1^0|0|1" gdzie 1=prawda, 0=fałsz, ^=XOR, &=AND, |=OR
 *
 * Time: O(4^n) - Try all ways to split / Spróbuj wszystkich sposobów podziału
 * Space: O(n) for recursion stack / dla stosu rekurencji
 *
 * @param {string} expr - Boolean expression / Wyrażenie boolowskie
 * @param {boolean} result - Desired result / Pożądany wynik
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countEvalRecursive(expr, result) {
  // Base case: Single digit / Przypadek bazowy: Pojedyncza cyfra
  if (expr.length === 1) {
    const value = expr === '1';
    return value === result ? 1 : 0;
  }

  let ways = 0;

  // Try splitting at each operator / Spróbuj podziału na każdym operatorze
  for (let i = 1; i < expr.length; i += 2) {
    const operator = expr[i];

    // Skip if not operator / Pomiń jeśli nie operator
    if (operator !== '&' && operator !== '|' && operator !== '^') {
      continue;
    }

    const left = expr.substring(0, i);
    const right = expr.substring(i + 1);

    // Count ways for left and right to be true/false
    // Policz sposoby dla lewej i prawej strony aby być prawdą/fałszem
    const leftTrue = countEvalRecursive(left, true);
    const leftFalse = countEvalRecursive(left, false);
    const rightTrue = countEvalRecursive(right, true);
    const rightFalse = countEvalRecursive(right, false);

    // Total combinations / Całkowite kombinacje
    const total = (leftTrue + leftFalse) * (rightTrue + rightFalse);

    // Count ways that give desired result / Policz sposoby dające pożądany wynik
    let totalTrue = 0;

    if (operator === '^') {
      // XOR: true if different / XOR: prawda jeśli różne
      totalTrue = leftTrue * rightFalse + leftFalse * rightTrue;
    } else if (operator === '&') {
      // AND: true if both true / AND: prawda jeśli oba prawda
      totalTrue = leftTrue * rightTrue;
    } else if (operator === '|') {
      // OR: true if at least one true / OR: prawda jeśli przynajmniej jedno prawda
      totalTrue = leftTrue * rightTrue + leftFalse * rightTrue + leftTrue * rightFalse;
    }

    const totalFalse = total - totalTrue;

    ways += result ? totalTrue : totalFalse;
  }

  return ways;
}

// ============================================================================
// APPROACH 2: DYNAMIC PROGRAMMING WITH MEMOIZATION
// PODEJŚCIE 2: PROGRAMOWANIE DYNAMICZNE Z MEMOIZACJĄ
// ============================================================================

/**
 * Boolean Evaluation - DP with Memoization
 * Ewaluacja Boolowska - DP z Memoizacją
 *
 * Cache results to avoid recomputation
 * Cache'uj wyniki aby uniknąć ponownego obliczania
 *
 * Time: O(n^3) - O(n^2) subproblems, each takes O(n) / O(n^2) podproblemów, każdy O(n)
 * Space: O(n^2) for memo table / dla tabeli memo
 *
 * @param {string} expr - Boolean expression / Wyrażenie boolowskie
 * @param {boolean} result - Desired result / Pożądany wynik
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countEvalMemo(expr, result) {
  const memo = new Map();
  return countEvalMemoHelper(expr, result, memo);
}

/**
 * Helper with memoization / Pomocnicza z memoizacją
 */
function countEvalMemoHelper(expr, result, memo) {
  // Base case / Przypadek bazowy
  if (expr.length === 1) {
    const value = expr === '1';
    return value === result ? 1 : 0;
  }

  // Check memo / Sprawdź memo
  const key = `${expr}-${result}`;
  if (memo.has(key)) {
    return memo.get(key);
  }

  let ways = 0;

  // Try splitting at each operator / Spróbuj podziału na każdym operatorze
  for (let i = 1; i < expr.length; i += 2) {
    const operator = expr[i];

    if (operator !== '&' && operator !== '|' && operator !== '^') {
      continue;
    }

    const left = expr.substring(0, i);
    const right = expr.substring(i + 1);

    // Recursive calls with memoization / Wywołania rekurencyjne z memoizacją
    const leftTrue = countEvalMemoHelper(left, true, memo);
    const leftFalse = countEvalMemoHelper(left, false, memo);
    const rightTrue = countEvalMemoHelper(right, true, memo);
    const rightFalse = countEvalMemoHelper(right, false, memo);

    const total = (leftTrue + leftFalse) * (rightTrue + rightFalse);
    let totalTrue = 0;

    if (operator === '^') {
      totalTrue = leftTrue * rightFalse + leftFalse * rightTrue;
    } else if (operator === '&') {
      totalTrue = leftTrue * rightTrue;
    } else if (operator === '|') {
      totalTrue = leftTrue * rightTrue + leftFalse * rightTrue + leftTrue * rightFalse;
    }

    const totalFalse = total - totalTrue;
    ways += result ? totalTrue : totalFalse;
  }

  memo.set(key, ways);
  return ways;
}

// ============================================================================
// APPROACH 3: OPTIMIZED - COMPUTE BOTH TRUE/FALSE AT ONCE
// PODEJŚCIE 3: ZOPTYMALIZOWANE - OBLICZ OBIE PRAWDA/FAŁSZ NARAZ
// ============================================================================

/**
 * Boolean Evaluation - Optimized
 * Ewaluacja Boolowska - Zoptymalizowana
 *
 * Compute both true and false counts simultaneously
 * Oblicz zarówno liczniki prawda jak i fałsz równocześnie
 *
 * @param {string} expr - Boolean expression / Wyrażenie boolowskie
 * @param {boolean} result - Desired result / Pożądany wynik
 * @returns {number} - Number of ways / Liczba sposobów
 */
function countEvalOptimized(expr, result) {
  const memo = new Map();
  const counts = countEvalOptimizedHelper(expr, memo);
  return result ? counts.trueCount : counts.falseCount;
}

/**
 * Helper: Returns {trueCount, falseCount}
 * Pomocnicza: Zwraca {trueCount, falseCount}
 */
function countEvalOptimizedHelper(expr, memo) {
  // Base case / Przypadek bazowy
  if (expr.length === 1) {
    const isTrue = expr === '1';
    return {
      trueCount: isTrue ? 1 : 0,
      falseCount: isTrue ? 0 : 1
    };
  }

  // Check memo / Sprawdź memo
  if (memo.has(expr)) {
    return memo.get(expr);
  }

  let trueCount = 0;
  let falseCount = 0;

  // Try splitting at each operator / Spróbuj podziału na każdym operatorze
  for (let i = 1; i < expr.length; i += 2) {
    const operator = expr[i];

    if (operator !== '&' && operator !== '|' && operator !== '^') {
      continue;
    }

    const left = expr.substring(0, i);
    const right = expr.substring(i + 1);

    const leftCounts = countEvalOptimizedHelper(left, memo);
    const rightCounts = countEvalOptimizedHelper(right, memo);

    const leftTrue = leftCounts.trueCount;
    const leftFalse = leftCounts.falseCount;
    const rightTrue = rightCounts.trueCount;
    const rightFalse = rightCounts.falseCount;

    // Calculate true and false counts based on operator
    // Oblicz liczniki prawda i fałsz na podstawie operatora
    if (operator === '^') {
      trueCount += leftTrue * rightFalse + leftFalse * rightTrue;
      falseCount += leftTrue * rightTrue + leftFalse * rightFalse;
    } else if (operator === '&') {
      trueCount += leftTrue * rightTrue;
      falseCount += leftTrue * rightFalse + leftFalse * rightTrue + leftFalse * rightFalse;
    } else if (operator === '|') {
      trueCount += leftTrue * rightTrue + leftTrue * rightFalse + leftFalse * rightTrue;
      falseCount += leftFalse * rightFalse;
    }
  }

  const result = { trueCount, falseCount };
  memo.set(expr, result);
  return result;
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Evaluate expression with given parenthesization
 * Ewaluuj wyrażenie z danym nawiskowaniem
 */
function evaluateExpression(expr) {
  if (expr.length === 1) {
    return expr === '1';
  }

  // Find operator not in parentheses / Znajdź operator nie w nawiasach
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') depth--;
    else if (depth === 0 && (expr[i] === '&' || expr[i] === '|' || expr[i] === '^')) {
      const left = evaluateExpression(expr.substring(0, i));
      const right = evaluateExpression(expr.substring(i + 1));

      if (expr[i] === '&') return left && right;
      if (expr[i] === '|') return left || right;
      if (expr[i] === '^') return left !== right;
    }
  }

  // Remove outer parentheses / Usuń zewnętrzne nawiasy
  if (expr[0] === '(' && expr[expr.length - 1] === ')') {
    return evaluateExpression(expr.substring(1, expr.length - 1));
  }

  throw new Error('Invalid expression / Nieprawidłowe wyrażenie');
}

/**
 * Show some example parenthesizations / Pokaż przykładowe nawiskowania
 */
function showExampleParenthesizations(expr, result, limit = 5) {
  console.log(`\nExample parenthesizations that evaluate to ${result}:`);
  console.log(`Przykładowe nawiskowania które dają ${result}:\n`);

  // This is a simplified version - full implementation would generate all
  // To jest uproszczona wersja - pełna implementacja wygenerowałaby wszystkie

  const examples = generateParenthesizations(expr, result, limit);

  examples.forEach((example, index) => {
    console.log(`  ${index + 1}. ${example}`);
  });

  if (examples.length === 0) {
    console.log('  (None found with simple generation)');
  }

  console.log();
}

/**
 * Generate some valid parenthesizations (simplified)
 * Generuj niektóre prawidłowe nawiskowania (uproszczone)
 */
function generateParenthesizations(expr, targetResult, limit) {
  const results = [];

  function generate(str, start, end) {
    if (results.length >= limit) return;

    if (end - start === 1) {
      try {
        const value = evaluateExpression(str);
        if (value === targetResult && !results.includes(str)) {
          results.push(str);
        }
      } catch (e) {
        // Invalid expression / Nieprawidłowe wyrażenie
      }
      return;
    }

    // Try different ways to parenthesize / Spróbuj różnych sposobów nawiskowania
    for (let i = start + 1; i < end; i += 2) {
      if (str[i] === '&' || str[i] === '|' || str[i] === '^') {
        const left = str.substring(start, i);
        const right = str.substring(i + 1, end);
        const combined = `(${left})${str[i]}(${right})`;

        generate(combined, 0, combined.length);
      }
    }
  }

  generate(expr, 0, expr.length);
  return results;
}

/**
 * Test all approaches / Testuj wszystkie podejścia
 */
function testAllApproaches(expr, result, description) {
  console.log('='.repeat(70));
  console.log(description);
  console.log('='.repeat(70));
  console.log(`Expression: ${expr}`);
  console.log(`Desired result: ${result}`);
  console.log();

  // Test different approaches / Testuj różne podejścia
  console.time('Recursive (slow for long expressions)');
  const result1 = expr.length <= 15 ? countEvalRecursive(expr, result) : 'Skipped';
  console.timeEnd('Recursive (slow for long expressions)');

  console.time('Memoization');
  const result2 = countEvalMemo(expr, result);
  console.timeEnd('Memoization');

  console.time('Optimized');
  const result3 = countEvalOptimized(expr, result);
  console.timeEnd('Optimized');

  console.log();
  console.log(`Results / Wyniki:`);
  console.log(`  Recursive:   ${result1}`);
  console.log(`  Memoization: ${result2}`);
  console.log(`  Optimized:   ${result3}`);

  const allMatch = (result1 === 'Skipped' || result1 === result2) && result2 === result3;
  console.log();
  console.log(`All approaches match: ${allMatch ? '✓' : '✗'}`);
  console.log();

  // Show examples / Pokaż przykłady
  showExampleParenthesizations(expr, result, 3);

  return result3;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('\n');
console.log('='.repeat(70));
console.log('BOOLEAN EVALUATION - COUNT WAYS TO PARENTHESIZE');
console.log('EWALUACJA BOOLOWSKA - POLICZ SPOSOBY NAWISKOWANIA');
console.log('='.repeat(70));
console.log('\n');

// Test 1: Classic example from problem
testAllApproaches('1^0|0|1', false, 'TEST 1: Classic example - count false / Klasyczny przykład - policz fałsz');

// Test 2: Count true
testAllApproaches('1^0|0|1', true, 'TEST 2: Same expression - count true / To samo wyrażenie - policz prawdę');

// Test 3: Simple AND
testAllApproaches('0&0&0&1', false, 'TEST 3: Simple AND chain - count false / Prosty łańcuch AND - policz fałsz');

// Test 4: Simple OR
testAllApproaches('1|0|1', true, 'TEST 4: Simple OR chain - count true / Prosty łańcuch OR - policz prawdę');

// Test 5: Mixed operators
testAllApproaches('1&0|1', true, 'TEST 5: Mixed operators / Mieszane operatory');

// Test 6: XOR chain
testAllApproaches('1^0^1', false, 'TEST 6: XOR chain / Łańcuch XOR');

// Test 7: Longer expression
testAllApproaches('0&0&0&1^1|0', true, 'TEST 7: Longer expression / Dłuższe wyrażenie');

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log('\n');

// Edge Case 1: Single value - true
console.log('EDGE CASE 1: Single true value');
console.log('-'.repeat(70));
const single1 = countEvalOptimized('1', true);
console.log(`Expression: "1", Result: true`);
console.log(`Count: ${single1} ${single1 === 1 ? '✓' : '✗'}`);
console.log();

// Edge Case 2: Single value - false
console.log('EDGE CASE 2: Single false value');
console.log('-'.repeat(70));
const single2 = countEvalOptimized('0', false);
console.log(`Expression: "0", Result: false`);
console.log(`Count: ${single2} ${single2 === 1 ? '✓' : '✗'}`);
console.log();

// Edge Case 3: Single operation
console.log('EDGE CASE 3: Single operation');
console.log('-'.repeat(70));
const single3 = countEvalOptimized('1&0', false);
console.log(`Expression: "1&0", Result: false`);
console.log(`Count: ${single3} ${single3 === 1 ? '✓' : '✗'}`);
console.log();

// Edge Case 4: All same operators
console.log('EDGE CASE 4: All OR operators');
console.log('-'.repeat(70));
const allOr = countEvalOptimized('1|1|1|1', true);
console.log(`Expression: "1|1|1|1", Result: true`);
console.log(`Count: ${allOr}`);
console.log();

// ============================================================================
// OPERATOR TRUTH TABLES / TABLICE PRAWDY OPERATORÓW
// ============================================================================

console.log('='.repeat(70));
console.log('OPERATOR TRUTH TABLES / TABLICE PRAWDY OPERATORÓW');
console.log('='.repeat(70));
console.log('\n');

console.log('AND (&):');
console.log('  0 & 0 = 0');
console.log('  0 & 1 = 0');
console.log('  1 & 0 = 0');
console.log('  1 & 1 = 1  ✓ Only true if both true / Tylko prawda jeśli oba prawda');
console.log();

console.log('OR (|):');
console.log('  0 | 0 = 0');
console.log('  0 | 1 = 1  ✓');
console.log('  1 | 0 = 1  ✓');
console.log('  1 | 1 = 1  ✓ True if at least one true / Prawda jeśli przynajmniej jedno prawda');
console.log();

console.log('XOR (^):');
console.log('  0 ^ 0 = 0');
console.log('  0 ^ 1 = 1  ✓ True if different / Prawda jeśli różne');
console.log('  1 ^ 0 = 1  ✓');
console.log('  1 ^ 1 = 0');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Recursive Brute Force / Rekurencyjne Brute Force');
console.log('  Time:  O(4^n) - Catalan number growth / Wzrost liczby Catalana');
console.log('         Each split creates 4 recursive calls / Każdy podział tworzy 4 wywołania rekurencyjne');
console.log('  Space: O(n) - Recursion stack / Stos rekurencji');
console.log();
console.log('APPROACH 2: DP with Memoization / DP z Memoizacją');
console.log('  Time:  O(n^3) - O(n^2) unique subproblems × O(n) to compute each');
console.log('         O(n^2) unikalne podproblemy × O(n) aby obliczyć każdy');
console.log('  Space: O(n^2) - Memo table / Tabela memo');
console.log();
console.log('APPROACH 3: Optimized (BEST) / Zoptymalizowane (NAJLEPSZE)');
console.log('  Time:  O(n^3) - Same as memoization but fewer cache lookups');
console.log('         Tak samo jak memoizacja ale mniej odwołań do cache');
console.log('  Space: O(n^2) - Memo table / Tabela memo');
console.log();
console.log('Key insight: Number of ways grows as Catalan numbers');
console.log('Kluczowe spostrzeżenie: Liczba sposobów rośnie jak liczby Catalana');
console.log();
console.log('='.repeat(70));
