/**
 * PROBLEM 17.19 - MISSING TWO
 *
 * You are given an array with all the numbers from 1 to N appearing exactly once,
 * except for two numbers that are missing. How can you find the two missing numbers
 * in O(N) time and O(1) space?
 *
 * Example:
 * Input: [1, 3, 4, 5, 7, 8, 9, 10] (N = 10, missing 2 and 6)
 * Output: [2, 6]
 *
 * Follow-up: What if there are three missing numbers? k missing numbers?
 */

// =============================================================================
// APPROACH 1: USING SUM AND PRODUCT
// Time: O(N)
// Space: O(1)
//
// Problem: Product can overflow for large N
// =============================================================================

function missingTwoSumProduct(arr, n) {
  // Calculate expected sum and product
  const expectedSum = (n * (n + 1)) / 2;
  const expectedProduct = factorial(n);

  // Calculate actual sum and product
  let actualSum = 0;
  let actualProduct = 1;

  for (const num of arr) {
    actualSum += num;
    actualProduct *= num;
  }

  // Missing sum and product
  const missingSum = expectedSum - actualSum;
  const missingProduct = expectedProduct / actualProduct;

  // x + y = missingSum
  // x * y = missingProduct
  // Solve quadratic equation: t^2 - missingSum*t + missingProduct = 0

  const discriminant = missingSum * missingSum - 4 * missingProduct;
  const x = (missingSum + Math.sqrt(discriminant)) / 2;
  const y = missingSum - x;

  return [Math.min(x, y), Math.max(x, y)];
}

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// =============================================================================
// APPROACH 2: USING SUM AND SUM OF SQUARES
// Time: O(N)
// Space: O(1)
//
// More stable than using product, but can still overflow for very large N
// This is the recommended approach from the book
// =============================================================================

function missingTwo(arr, n) {
  // Calculate missing sum and sum of squares
  const expectedSum = (n * (n + 1)) / 2;
  const expectedSumOfSquares = (n * (n + 1) * (2 * n + 1)) / 6;

  let actualSum = 0;
  let actualSumOfSquares = 0;

  for (const num of arr) {
    actualSum += num;
    actualSumOfSquares += num * num;
  }

  const missingSum = expectedSum - actualSum; // x + y
  const missingSumOfSquares = expectedSumOfSquares - actualSumOfSquares; // x^2 + y^2

  // We have:
  // x + y = missingSum
  // x^2 + y^2 = missingSumOfSquares
  //
  // From (x + y)^2 = x^2 + 2xy + y^2
  // We get: 2xy = (x + y)^2 - (x^2 + y^2)
  const twoXY = missingSum * missingSum - missingSumOfSquares;
  const xy = twoXY / 2;

  // Now solve x + y = missingSum and xy = xy
  // Using quadratic formula: t^2 - missingSum*t + xy = 0
  const discriminant = missingSum * missingSum - 4 * xy;
  const sqrtDiscriminant = Math.sqrt(discriminant);

  const x = (missingSum + sqrtDiscriminant) / 2;
  const y = (missingSum - sqrtDiscriminant) / 2;

  return [Math.round(Math.min(x, y)), Math.round(Math.max(x, y))];
}

// =============================================================================
// APPROACH 3: USING XOR AND BIT MANIPULATION
// Time: O(N)
// Space: O(1)
//
// Most robust approach - no overflow issues
// =============================================================================

function missingTwoXOR(arr, n) {
  // XOR all numbers from 1 to n and all numbers in array
  // Result will be xor of two missing numbers: x ^ y
  let xorAll = 0;

  for (let i = 1; i <= n; i++) {
    xorAll ^= i;
  }

  for (const num of arr) {
    xorAll ^= num;
  }

  // xorAll = x ^ y
  // Find a bit that is set in xorAll (differs between x and y)
  const setBit = xorAll & -xorAll; // Get rightmost set bit

  // Partition numbers into two groups based on this bit
  let group1 = 0;
  let group2 = 0;

  // Partition 1 to n
  for (let i = 1; i <= n; i++) {
    if ((i & setBit) !== 0) {
      group1 ^= i;
    } else {
      group2 ^= i;
    }
  }

  // Partition array
  for (const num of arr) {
    if ((num & setBit) !== 0) {
      group1 ^= num;
    } else {
      group2 ^= num;
    }
  }

  // group1 and group2 now contain the two missing numbers
  return [Math.min(group1, group2), Math.max(group1, group2)];
}

// =============================================================================
// APPROACH 4: USING ARRAY MODIFICATION (If input can be modified)
// Time: O(N)
// Space: O(1) - modifies input array
// =============================================================================

function missingTwoModify(arr, n) {
  // Create array of n elements (will modify it)
  const nums = [...arr];

  // Mark present numbers as negative at their index
  const missing = [];

  for (let i = 0; i < nums.length; i++) {
    const val = Math.abs(nums[i]);

    if (val - 1 < nums.length && nums[val - 1] > 0) {
      nums[val - 1] = -nums[val - 1];
    }
  }

  // Find positive indices - those are missing
  for (let i = 1; i <= n; i++) {
    if (i - 1 >= nums.length || nums[i - 1] > 0) {
      missing.push(i);
      if (missing.length === 2) break;
    }
  }

  return missing;
}

// =============================================================================
// APPROACH 5: SET DIFFERENCE (Uses O(N) space but very simple)
// Time: O(N)
// Space: O(N)
// =============================================================================

function missingTwoSet(arr, n) {
  const present = new Set(arr);
  const missing = [];

  for (let i = 1; i <= n; i++) {
    if (!present.has(i)) {
      missing.push(i);
      if (missing.length === 2) break;
    }
  }

  return missing;
}

// =============================================================================
// EXTENSION: K MISSING NUMBERS
// Time: O(N)
// Space: O(1) or O(k) depending on implementation
// =============================================================================

function missingKNumbers(arr, n, k) {
  // For k missing numbers, XOR approach becomes complex
  // Better to use sum-based approach with multiple equations

  if (k === 2) {
    return missingTwoXOR(arr, n);
  }

  // For k > 2, use set approach (simpler and practical)
  const present = new Set(arr);
  const missing = [];

  for (let i = 1; i <= n && missing.length < k; i++) {
    if (!present.has(i)) {
      missing.push(i);
    }
  }

  return missing;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate test array with two missing numbers
 */
function generateTestArray(n, missing1, missing2) {
  const arr = [];
  for (let i = 1; i <= n; i++) {
    if (i !== missing1 && i !== missing2) {
      arr.push(i);
    }
  }
  return arr;
}

/**
 * Shuffle array
 */
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Missing Two...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const arr1 = [1, 3, 4, 5, 7, 8, 9, 10];
  const n1 = 10;
  console.log('Input:', arr1);
  console.log('N:', n1);
  console.log('Sum approach:', missingTwo(arr1, n1));
  console.log('XOR approach:', missingTwoXOR(arr1, n1));
  console.log('Set approach:', missingTwoSet(arr1, n1));
  console.log('Expected: [2, 6]');
  console.log();

  // Test 2: Missing first and last
  console.log('Test 2: Missing first and last');
  const arr2 = [2, 3, 4, 5, 6, 7, 8, 9];
  const n2 = 10;
  console.log('Input:', arr2);
  console.log('N:', n2);
  console.log('Sum approach:', missingTwo(arr2, n2));
  console.log('XOR approach:', missingTwoXOR(arr2, n2));
  console.log('Expected: [1, 10]');
  console.log();

  // Test 3: Missing consecutive numbers
  console.log('Test 3: Missing consecutive numbers');
  const arr3 = [1, 2, 3, 6, 7, 8, 9, 10];
  const n3 = 10;
  console.log('Input:', arr3);
  console.log('N:', n3);
  console.log('Sum approach:', missingTwo(arr3, n3));
  console.log('XOR approach:', missingTwoXOR(arr3, n3));
  console.log('Expected: [4, 5]');
  console.log();

  // Test 4: Larger numbers
  console.log('Test 4: Larger array');
  const arr4 = generateTestArray(100, 42, 87);
  const shuffled4 = shuffle(arr4);
  console.log('N: 100, Missing: 42 and 87');
  console.log('Sum approach:', missingTwo(shuffled4, 100));
  console.log('XOR approach:', missingTwoXOR(shuffled4, 100));
  console.log('Expected: [42, 87]');
  console.log();

  // Test 5: Extension - K missing numbers
  console.log('Test 5: Extension - K missing numbers');
  const arr5 = [1, 2, 4, 6, 8, 9];
  const n5 = 10;
  const k5 = 4;
  console.log('Input:', arr5);
  console.log('N:', n5, ', K:', k5);
  console.log('Missing K numbers:', missingKNumbers(arr5, n5, k5));
  console.log('Expected: [3, 5, 7, 10]');
  console.log();

  // Test 6: Performance comparison
  console.log('Performance Comparison (N = 1,000,000):');
  const bigN = 1000000;
  const missing1 = 123456;
  const missing2 = 789012;
  const bigArr = generateTestArray(bigN, missing1, missing2);

  console.time('Sum approach');
  const result1 = missingTwo(bigArr, bigN);
  console.timeEnd('Sum approach');
  console.log('Result:', result1);

  console.time('XOR approach');
  const result2 = missingTwoXOR(bigArr, bigN);
  console.timeEnd('XOR approach');
  console.log('Result:', result2);

  console.time('Set approach (uses O(N) space)');
  const result3 = missingTwoSet(bigArr, bigN);
  console.timeEnd('Set approach (uses O(N) space)');
  console.log('Result:', result3);

  console.log('\nNote: XOR approach is most robust (no overflow), Sum approach is most intuitive');
}

// Run tests
runTests();

// Export functions
module.exports = {
  missingTwo,
  missingTwoSumProduct,
  missingTwoXOR,
  missingTwoModify,
  missingTwoSet,
  missingKNumbers,
  generateTestArray
};
