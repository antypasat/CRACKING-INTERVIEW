/**
 * Parens (Valid Parentheses Combinations)
 * Generate all valid combinations of n pairs of parentheses
 *
 * Rules:
 * 1. Each valid combination has n opening and n closing parentheses
 * 2. At any point, number of closing parens cannot exceed opening parens
 * 3. Must generate all unique valid combinations
 */

/**
 * Approach 1: Backtracking with count tracking
 * Track number of left and right parentheses used
 * Time: O(4^n / sqrt(n)) = O(Catalan number), Space: O(n)
 */
function generateParens(n) {
  if (n <= 0) return [];

  const result = [];

  function backtrack(current, leftCount, rightCount) {
    // Base case: used all parentheses
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    // Can add left paren if we haven't used all n
    if (leftCount < n) {
      backtrack(current + '(', leftCount + 1, rightCount);
    }

    // Can add right paren if it won't exceed left parens
    if (rightCount < leftCount) {
      backtrack(current + ')', leftCount, rightCount + 1);
    }
  }

  backtrack('', 0, 0);
  return result;
}

/**
 * Approach 2: Recursive building with remaining counts
 * Pass remaining left and right parens as parameters
 * Time: O(4^n / sqrt(n)), Space: O(n)
 */
function generateParens2(n) {
  if (n <= 0) return [];

  const result = [];

  function build(str, leftRemaining, rightRemaining) {
    // Invalid state: more right parens added than left
    if (rightRemaining > leftRemaining) return;

    // Base case: no more parens to add
    if (leftRemaining === 0 && rightRemaining === 0) {
      result.push(str);
      return;
    }

    // Add left paren
    if (leftRemaining > 0) {
      build(str + '(', leftRemaining - 1, rightRemaining);
    }

    // Add right paren
    if (rightRemaining > 0) {
      build(str + ')', leftRemaining, rightRemaining - 1);
    }
  }

  build('', n, n);
  return result;
}

/**
 * Approach 3: Iterative with queue (BFS-like)
 * Build combinations level by level
 * Time: O(4^n / sqrt(n)), Space: O(4^n / sqrt(n))
 */
function generateParens3(n) {
  if (n <= 0) return [];

  const result = [];
  const queue = [{ str: '', left: 0, right: 0 }];

  while (queue.length > 0) {
    const { str, left, right } = queue.shift();

    // Complete combination
    if (str.length === 2 * n) {
      result.push(str);
      continue;
    }

    // Add left paren
    if (left < n) {
      queue.push({ str: str + '(', left: left + 1, right: right });
    }

    // Add right paren
    if (right < left) {
      queue.push({ str: str + ')', left: left, right: right + 1 });
    }
  }

  return result;
}

/**
 * Approach 4: Mathematical - using Catalan number formula
 * Generate based on recursive Catalan structure
 * C(n) = C(0)C(n-1) + C(1)C(n-2) + ... + C(n-1)C(0)
 */
function generateParens4(n) {
  if (n === 0) return [''];

  const result = [];

  for (let i = 0; i < n; i++) {
    // Split n pairs into i pairs inside first pair, and n-1-i pairs after
    const leftCombos = generateParens4(i);
    const rightCombos = generateParens4(n - 1 - i);

    for (const left of leftCombos) {
      for (const right of rightCombos) {
        result.push('(' + left + ')' + right);
      }
    }
  }

  return result;
}

/**
 * Helper: Calculate Catalan number (expected count)
 * Catalan(n) = (2n)! / ((n+1)! * n!)
 * Also: Catalan(n) = C(2n, n) / (n+1)
 */
function catalanNumber(n) {
  if (n <= 1) return 1;

  let result = 0;
  for (let i = 0; i < n; i++) {
    result += catalanNumber(i) * catalanNumber(n - 1 - i);
  }
  return result;
}

// Optimized Catalan calculation
function catalanNumberOptimized(n) {
  if (n <= 1) return 1;

  let catalan = 1;
  for (let i = 0; i < n; i++) {
    catalan = catalan * 2 * (2 * i + 1) / (i + 2);
  }
  return Math.round(catalan);
}

/**
 * Helper: Verify valid parentheses
 */
function isValidParens(str) {
  let count = 0;
  for (const char of str) {
    if (char === '(') count++;
    else if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

/**
 * Helper: Verify all combinations are valid and unique
 */
function verifyParens(n, combinations) {
  const expected = catalanNumberOptimized(n);
  const uniqueCombos = new Set(combinations);

  return {
    totalCount: combinations.length,
    uniqueCount: uniqueCombos.size,
    expectedCount: expected,
    hasCorrectCount: combinations.length === expected,
    allUnique: combinations.length === uniqueCombos.size,
    allCorrectLength: combinations.every(s => s.length === 2 * n),
    allValid: combinations.every(s => isValidParens(s))
  };
}

// Test cases
console.log('=== Valid Parentheses Combinations Tests ===\n');

console.log('Test 1: n=1');
console.log('-------------------');
const result1 = generateParens(1);
console.log('Combinations:', result1);
console.log('Expected: ["()"]');
const verify1 = verifyParens(1, result1);
console.log('Status:', verify1.allValid && verify1.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 2: n=2');
console.log('-------------------');
const result2 = generateParens(2);
console.log('Combinations:', result2);
console.log('Expected: ["(())", "()()"]');
const verify2 = verifyParens(2, result2);
console.log('Status:', verify2.allValid && verify2.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 3: n=3 (Classic example)');
console.log('-------------------');
const result3 = generateParens(3);
console.log('Combinations:', result3);
console.log('Expected 5 combinations:');
console.log('  ((()))', '(()())', '(()())', '()(())', '()()()');
const verify3 = verifyParens(3, result3);
console.log(`Count: ${result3.length} (expected: ${verify3.expectedCount})`);
console.log('Status:', verify3.allValid && verify3.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== Testing All Approaches ===\n');

console.log('Test 4: n=4 - Approach 1 (Backtracking with counts)');
const result4a = generateParens(4);
console.log('First 5:', result4a.slice(0, 5));
console.log('Count:', result4a.length);
console.log('Expected:', catalanNumberOptimized(4), '(Catalan number)');

console.log('\nTest 5: n=4 - Approach 2 (Remaining counts)');
const result4b = generateParens2(4);
console.log('Count:', result4b.length);
console.log('Match Approach 1:', result4a.length === result4b.length ? 'PASS' : 'FAIL');

console.log('\nTest 6: n=4 - Approach 3 (Iterative BFS)');
const result4c = generateParens3(4);
console.log('Count:', result4c.length);
console.log('Match Approach 1:', result4a.length === result4c.length ? 'PASS' : 'FAIL');

console.log('\nTest 7: n=4 - Approach 4 (Catalan structure)');
const result4d = generateParens4(4);
console.log('Count:', result4d.length);
console.log('Match Approach 1:', result4a.length === result4d.length ? 'PASS' : 'FAIL');

console.log('\n=== Larger Examples ===\n');

console.log('Test 8: n=5');
const result5 = generateParens(5);
console.log('First 10 combinations:', result5.slice(0, 10));
console.log('Total count:', result5.length);
console.log('Expected (Catalan):', catalanNumberOptimized(5));
const verify5 = verifyParens(5, result5);
console.log('All valid:', verify5.allValid ? 'PASS' : 'FAIL');
console.log('Correct count:', verify5.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 9: n=6');
const result6 = generateParens(6);
console.log('Total count:', result6.length);
console.log('Expected (Catalan):', catalanNumberOptimized(6));
const verify6 = verifyParens(6, result6);
console.log('Status:', verify6.allValid && verify6.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== Edge Cases ===\n');

console.log('Test 10: n=0');
const result0 = generateParens(0);
console.log('Result:', result0);
console.log('Expected: []');
console.log('Status:', result0.length === 0 ? 'PASS' : 'FAIL');

console.log('\n=== Catalan Numbers ===\n');

console.log('Catalan numbers (number of valid combinations):');
for (let i = 0; i <= 10; i++) {
  const catalan = catalanNumberOptimized(i);
  console.log(`  n=${i}: ${catalan} combinations`);
}

console.log('\n=== Pattern Visualization ===\n');

console.log('How combinations are built for n=3:');
console.log('Starting with empty string, at each step:');
console.log('  - Add "(" if leftCount < n');
console.log('  - Add ")" if rightCount < leftCount');
console.log('\nTree visualization:');
console.log('');
console.log('                    ""');
console.log('                    |');
console.log('                   "("');
console.log('                  /   \\');
console.log('               "(("   "()"');
console.log('              /   \\    |');
console.log('          "((("  "(()"  "()("');
console.log('            |    /  \\    |');
console.log('         "((())" "(()()" "(())" "()(()" "()()("');
console.log('                          |       |       |');
console.log('                      "((()))" "(()())" "(()()" "()(())" "()()())"');

console.log('\n=== Performance Analysis ===\n');

function measurePerformance(n, approach) {
  const start = Date.now();
  let result;
  switch (approach) {
    case 1: result = generateParens(n); break;
    case 2: result = generateParens2(n); break;
    case 3: result = generateParens3(n); break;
    case 4: result = generateParens4(n); break;
  }
  const end = Date.now();
  return { count: result.length, time: end - start };
}

console.log('Performance for n=8:');
for (let i = 1; i <= 4; i++) {
  const perf = measurePerformance(8, i);
  console.log(`  Approach ${i}: ${perf.count} combinations in ${perf.time}ms`);
}

console.log('\n=== Detailed Verification ===\n');

function detailedVerify(n) {
  const result = generateParens(n);
  const verify = verifyParens(n, result);

  console.log(`n=${n}:`);
  console.log(`  Total count: ${verify.totalCount}`);
  console.log(`  Unique count: ${verify.uniqueCount}`);
  console.log(`  Expected (Catalan): ${verify.expectedCount}`);
  console.log(`  All unique: ${verify.allUnique ? 'PASS' : 'FAIL'}`);
  console.log(`  Correct count: ${verify.hasCorrectCount ? 'PASS' : 'FAIL'}`);
  console.log(`  All valid: ${verify.allValid ? 'PASS' : 'FAIL'}`);
  console.log(`  All correct length: ${verify.allCorrectLength ? 'PASS' : 'FAIL'}`);
  console.log(`  Overall: ${
    verify.allUnique && verify.hasCorrectCount &&
    verify.allValid && verify.allCorrectLength ? 'PASS' : 'FAIL'
  }\n`);
}

[1, 2, 3, 4, 5].forEach(n => detailedVerify(n));

module.exports = {
  generateParens,
  generateParens2,
  generateParens3,
  generateParens4,
  catalanNumber,
  catalanNumberOptimized,
  isValidParens,
  verifyParens
};
