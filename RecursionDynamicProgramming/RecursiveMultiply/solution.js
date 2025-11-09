/**
 * Recursive Multiply
 * Multiply two positive integers without using * operator
 * Can use: recursion, addition, subtraction, bit shifting
 * Goal: Minimize number of operations
 */

/**
 * Approach 1: Simple recursive addition
 * Time: O(smaller), Space: O(smaller) for recursion stack
 */
function recursiveMultiplySimple(a, b) {
  // Make sure we use the smaller number for recursion depth
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  return multiplyHelper(smaller, bigger);
}

function multiplyHelper(smaller, bigger) {
  if (smaller === 0) return 0;
  if (smaller === 1) return bigger;
  return bigger + multiplyHelper(smaller - 1, bigger);
}

/**
 * Approach 2: Optimized using halving
 * Key insight: a * b = (a * (b/2)) * 2
 * If b is odd: a * b = a * (b/2) * 2 + a
 * Time: O(log min(a,b)), Space: O(log min(a,b))
 */
function recursiveMultiply(a, b) {
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  return multiplyOptimized(smaller, bigger);
}

function multiplyOptimized(smaller, bigger) {
  if (smaller === 0) return 0;
  if (smaller === 1) return bigger;

  // Divide smaller by 2
  const halfSmaller = smaller >> 1; // Bit shift right (divide by 2)
  const halfProduct = multiplyOptimized(halfSmaller, bigger);

  // If smaller is even: result = halfProduct * 2
  // If smaller is odd: result = halfProduct * 2 + bigger
  if (smaller % 2 === 0) {
    return halfProduct << 1; // Bit shift left (multiply by 2)
  } else {
    return (halfProduct << 1) + bigger;
  }
}

/**
 * Approach 3: Memoized version
 * Cache intermediate results for repeated computations
 */
function recursiveMultiplyMemo(a, b) {
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  const memo = new Map();
  return multiplyMemoized(smaller, bigger, memo);
}

function multiplyMemoized(smaller, bigger, memo) {
  if (smaller === 0) return 0;
  if (smaller === 1) return bigger;

  const key = `${smaller},${bigger}`;
  if (memo.has(key)) return memo.get(key);

  const halfSmaller = smaller >> 1;
  const halfProduct = multiplyMemoized(halfSmaller, bigger, memo);

  let result;
  if (smaller % 2 === 0) {
    result = halfProduct << 1;
  } else {
    result = (halfProduct << 1) + bigger;
  }

  memo.set(key, result);
  return result;
}

/**
 * Approach 4: Using bit manipulation (Russian Peasant method)
 * Iterative version for comparison
 */
function recursiveMultiplyIterative(a, b) {
  let result = 0;
  let multiplier = a;
  let multiplicand = b;

  while (multiplier > 0) {
    // If multiplier is odd, add multiplicand to result
    if (multiplier & 1) {
      result += multiplicand;
    }
    // Halve multiplier, double multiplicand
    multiplier >>= 1;
    multiplicand <<= 1;
  }

  return result;
}

// Test cases
console.log('=== Recursive Multiply Tests ===\n');

const testCases = [
  { a: 5, b: 3, expected: 15 },
  { a: 8, b: 7, expected: 56 },
  { a: 12, b: 13, expected: 156 },
  { a: 1, b: 100, expected: 100 },
  { a: 0, b: 50, expected: 0 },
  { a: 31, b: 35, expected: 1085 },
  { a: 100, b: 1, expected: 100 },
  { a: 16, b: 16, expected: 256 },
  { a: 7, b: 9, expected: 63 },
  { a: 23, b: 41, expected: 943 }
];

console.log('Test: Simple Approach');
testCases.forEach(({ a, b, expected }, index) => {
  const result = recursiveMultiplySimple(a, b);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`  Test ${index + 1}: ${a} * ${b} = ${result} [${status}]`);
  if (result !== expected) {
    console.log(`    Expected: ${expected}`);
  }
});

console.log('\nTest: Optimized Approach (Main Solution)');
testCases.forEach(({ a, b, expected }, index) => {
  const result = recursiveMultiply(a, b);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`  Test ${index + 1}: ${a} * ${b} = ${result} [${status}]`);
  if (result !== expected) {
    console.log(`    Expected: ${expected}`);
  }
});

console.log('\nTest: Memoized Approach');
testCases.forEach(({ a, b, expected }, index) => {
  const result = recursiveMultiplyMemo(a, b);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`  Test ${index + 1}: ${a} * ${b} = ${result} [${status}]`);
  if (result !== expected) {
    console.log(`    Expected: ${expected}`);
  }
});

console.log('\nTest: Iterative Approach (Russian Peasant)');
testCases.forEach(({ a, b, expected }, index) => {
  const result = recursiveMultiplyIterative(a, b);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`  Test ${index + 1}: ${a} * ${b} = ${result} [${status}]`);
  if (result !== expected) {
    console.log(`    Expected: ${expected}`);
  }
});

console.log('\n=== Performance Comparison ===\n');

function countOperations() {
  console.log('Operation counts for 31 * 35:');
  console.log('  Simple (31 operations): 35 + 35 + ... (31 times)');
  console.log('  Optimized (log 31 ≈ 5 levels): Much fewer operations');
  console.log('  31 → 15 → 7 → 3 → 1');
}

countOperations();

console.log('\n=== Edge Cases ===\n');

const edgeCases = [
  { a: 1, b: 1, expected: 1, desc: 'Both 1' },
  { a: 0, b: 999, expected: 0, desc: 'Zero multiplier' },
  { a: 2, b: 2, expected: 4, desc: 'Same small numbers' },
  { a: 1000, b: 1, expected: 1000, desc: 'Large * 1' }
];

edgeCases.forEach(({ a, b, expected, desc }) => {
  const result = recursiveMultiply(a, b);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`  ${desc}: ${a} * ${b} = ${result} [${status}]`);
});

module.exports = {
  recursiveMultiply,
  recursiveMultiplySimple,
  recursiveMultiplyMemo,
  recursiveMultiplyIterative
};
