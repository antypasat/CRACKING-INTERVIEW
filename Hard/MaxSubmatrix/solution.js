/**
 * PROBLEM 17.24 - MAX SUBMATRIX
 *
 * Given an NxN matrix of positive and negative integers, write code to find the
 * submatrix with the largest possible sum.
 *
 * Example:
 * Input:
 * [
 *   [ 5, -4,  3,  2],
 *   [-1,  8, -2,  4],
 *   [ 3,  7,  6, -5],
 *   [-2,  4,  1,  9]
 * ]
 *
 * Output: Submatrix from (1,1) to (2,2) with sum = 21
 * [
 *   [ 8, -2,  4],
 *   [ 7,  6, -5]
 * ]
 *
 * This is a 2D extension of the maximum subarray problem (Kadane's algorithm)
 */

// =============================================================================
// APPROACH 1: BRUTE FORCE
// Time: O(N^6) - trying all possible submatrices and calculating sums
// Space: O(1)
//
// Extremely slow, only useful for tiny matrices
// =============================================================================

function maxSubmatrixBrute(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;
  let maxSum = -Infinity;
  let maxSubmatrix = null;

  // Try all possible top-left corners
  for (let r1 = 0; r1 < n; r1++) {
    for (let c1 = 0; c1 < n; c1++) {
      // Try all possible bottom-right corners
      for (let r2 = r1; r2 < n; r2++) {
        for (let c2 = c1; c2 < n; c2++) {
          // Calculate sum of this submatrix
          const sum = calculateSum(matrix, r1, c1, r2, c2);

          if (sum > maxSum) {
            maxSum = sum;
            maxSubmatrix = { r1, c1, r2, c2, sum };
          }
        }
      }
    }
  }

  return maxSubmatrix;
}

function calculateSum(matrix, r1, c1, r2, c2) {
  let sum = 0;
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      sum += matrix[r][c];
    }
  }
  return sum;
}

// =============================================================================
// APPROACH 2: OPTIMIZED WITH PREFIX SUMS
// Time: O(N^4)
// Space: O(N^2)
//
// Precompute prefix sums for O(1) submatrix sum calculation
// =============================================================================

function maxSubmatrixPrefixSum(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;

  // Build prefix sum matrix
  const prefix = buildPrefixSum(matrix);

  let maxSum = -Infinity;
  let maxSubmatrix = null;

  // Try all possible submatrices
  for (let r1 = 0; r1 < n; r1++) {
    for (let c1 = 0; c1 < n; c1++) {
      for (let r2 = r1; r2 < n; r2++) {
        for (let c2 = c1; c2 < n; c2++) {
          const sum = getSum(prefix, r1, c1, r2, c2);

          if (sum > maxSum) {
            maxSum = sum;
            maxSubmatrix = { r1, c1, r2, c2, sum };
          }
        }
      }
    }
  }

  return maxSubmatrix;
}

function buildPrefixSum(matrix) {
  const n = matrix.length;
  const prefix = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let r = 1; r <= n; r++) {
    for (let c = 1; c <= n; c++) {
      prefix[r][c] = matrix[r - 1][c - 1]
                   + prefix[r - 1][c]
                   + prefix[r][c - 1]
                   - prefix[r - 1][c - 1];
    }
  }

  return prefix;
}

function getSum(prefix, r1, c1, r2, c2) {
  return prefix[r2 + 1][c2 + 1]
       - prefix[r1][c2 + 1]
       - prefix[r2 + 1][c1]
       + prefix[r1][c1];
}

// =============================================================================
// APPROACH 3: KADANE'S ALGORITHM EXTENSION (OPTIMAL)
// Time: O(N^3)
// Space: O(N)
//
// Fix left and right columns, then use Kadane's algorithm on row sums
// This is the book's recommended solution
// =============================================================================

function maxSubmatrix(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;
  let maxSum = -Infinity;
  let maxSubmatrix = null;

  // Fix left column
  for (let left = 0; left < cols; left++) {
    // Array to store sum of rows between left and right columns
    const rowSums = new Array(rows).fill(0);

    // Expand right column
    for (let right = left; right < cols; right++) {
      // Add elements from current right column to rowSums
      for (let row = 0; row < rows; row++) {
        rowSums[row] += matrix[row][right];
      }

      // Apply Kadane's algorithm on rowSums to find best subarray
      const kadaneResult = kadaneWithIndices(rowSums);

      if (kadaneResult.sum > maxSum) {
        maxSum = kadaneResult.sum;
        maxSubmatrix = {
          r1: kadaneResult.start,
          c1: left,
          r2: kadaneResult.end,
          c2: right,
          sum: kadaneResult.sum
        };
      }
    }
  }

  return maxSubmatrix;
}

/**
 * Kadane's algorithm to find maximum subarray
 * Returns sum and indices
 */
function kadaneWithIndices(arr) {
  let maxSum = -Infinity;
  let currentSum = 0;
  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 0; i < arr.length; i++) {
    currentSum += arr[i];

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }

    if (currentSum < 0) {
      currentSum = 0;
      tempStart = i + 1;
    }
  }

  return { sum: maxSum, start, end };
}

// =============================================================================
// APPROACH 4: DYNAMIC PROGRAMMING VARIATION
// Time: O(N^3)
// Space: O(N^2)
//
// Alternative implementation using DP mindset
// =============================================================================

function maxSubmatrixDP(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;
  let maxSum = -Infinity;
  let result = null;

  // For each pair of rows
  for (let top = 0; top < n; top++) {
    const colSums = new Array(n).fill(0);

    for (let bottom = top; bottom < n; bottom++) {
      // Add current row to column sums
      for (let col = 0; col < n; col++) {
        colSums[col] += matrix[bottom][col];
      }

      // Find max subarray in colSums
      const { sum, left, right } = maxSubarraySum(colSums);

      if (sum > maxSum) {
        maxSum = sum;
        result = { r1: top, c1: left, r2: bottom, c2: right, sum };
      }
    }
  }

  return result;
}

function maxSubarraySum(arr) {
  let maxSum = -Infinity;
  let currentSum = 0;
  let left = 0;
  let right = 0;
  let tempLeft = 0;

  for (let i = 0; i < arr.length; i++) {
    currentSum += arr[i];

    if (currentSum > maxSum) {
      maxSum = currentSum;
      left = tempLeft;
      right = i;
    }

    if (currentSum < 0) {
      currentSum = 0;
      tempLeft = i + 1;
    }
  }

  return { sum: maxSum, left, right };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract submatrix from result
 */
function extractSubmatrix(matrix, result) {
  if (!result) return null;

  const submatrix = [];
  for (let r = result.r1; r <= result.r2; r++) {
    const row = [];
    for (let c = result.c1; c <= result.c2; c++) {
      row.push(matrix[r][c]);
    }
    submatrix.push(row);
  }

  return submatrix;
}

/**
 * Visualize matrix with highlighted submatrix
 */
function visualizeMatrix(matrix, result = null) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let output = '';

  for (let r = 0; r < rows; r++) {
    let line = '[';
    for (let c = 0; c < cols; c++) {
      const isInSubmatrix = result &&
        r >= result.r1 && r <= result.r2 &&
        c >= result.c1 && c <= result.c2;

      const value = matrix[r][c].toString().padStart(4);

      if (isInSubmatrix) {
        line += `*${value}*`;
      } else {
        line += ` ${value} `;
      }

      if (c < cols - 1) line += ',';
    }
    line += ']';
    output += line + '\n';
  }

  return output;
}

/**
 * Generate random matrix
 */
function generateRandomMatrix(size, min = -10, max = 10) {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() =>
      Math.floor(Math.random() * (max - min + 1)) + min
    )
  );
}

/**
 * Pretty print result
 */
function printResult(matrix, result) {
  if (!result) {
    console.log('No result found');
    return;
  }

  console.log(`Max sum: ${result.sum}`);
  console.log(`Position: (${result.r1},${result.c1}) to (${result.r2},${result.c2})`);
  console.log('\nFull matrix with highlighted submatrix (* indicates included):');
  console.log(visualizeMatrix(matrix, result));

  const submatrix = extractSubmatrix(matrix, result);
  console.log('Submatrix values:');
  for (const row of submatrix) {
    console.log('[' + row.map(v => v.toString().padStart(4)).join(', ') + ']');
  }

  // Verify sum
  let sum = 0;
  for (const row of submatrix) {
    for (const val of row) {
      sum += val;
    }
  }
  console.log(`Verified sum: ${sum}`);
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Max Submatrix...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const matrix1 = [
    [ 5, -4,  3,  2],
    [-1,  8, -2,  4],
    [ 3,  7,  6, -5],
    [-2,  4,  1,  9]
  ];
  console.log('Input matrix:');
  console.log(visualizeMatrix(matrix1));
  const result1 = maxSubmatrix(matrix1);
  printResult(matrix1, result1);
  console.log();

  // Test 2: All negative
  console.log('Test 2: All negative numbers');
  const matrix2 = [
    [-5, -4, -3],
    [-2, -1, -6],
    [-9, -8, -7]
  ];
  const result2 = maxSubmatrix(matrix2);
  printResult(matrix2, result2);
  console.log('Expected: single element -1');
  console.log();

  // Test 3: All positive
  console.log('Test 3: All positive numbers');
  const matrix3 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  const result3 = maxSubmatrix(matrix3);
  printResult(matrix3, result3);
  console.log('Expected: entire matrix, sum = 45');
  console.log();

  // Test 4: Single row
  console.log('Test 4: Best submatrix is single row');
  const matrix4 = [
    [-1, -2, -3],
    [ 9,  8,  7],
    [-4, -5, -6]
  ];
  const result4 = maxSubmatrix(matrix4);
  printResult(matrix4, result4);
  console.log();

  // Test 5: Single column
  console.log('Test 5: Best submatrix is single column');
  const matrix5 = [
    [-1,  9, -4],
    [-2,  8, -5],
    [-3,  7, -6]
  ];
  const result5 = maxSubmatrix(matrix5);
  printResult(matrix5, result5);
  console.log();

  // Test 6: Single element
  console.log('Test 6: Single element matrix');
  const matrix6 = [[42]];
  const result6 = maxSubmatrix(matrix6);
  printResult(matrix6, result6);
  console.log();

  // Test 7: Checkerboard pattern
  console.log('Test 7: Checkerboard pattern');
  const matrix7 = [
    [ 5, -5,  5, -5],
    [-5,  5, -5,  5],
    [ 5, -5,  5, -5],
    [-5,  5, -5,  5]
  ];
  const result7 = maxSubmatrix(matrix7);
  printResult(matrix7, result7);
  console.log();

  // Test 8: Compare all approaches on small matrix
  console.log('Test 8: Compare all approaches');
  const matrix8 = [
    [ 1,  2, -1, -4, -20],
    [-8, -3,  4,  2,   1],
    [ 3,  8, 10,  1,   3],
    [-4, -1,  1,  7,  -6]
  ];

  console.time('Brute Force');
  const result8a = maxSubmatrixBrute(matrix8);
  console.timeEnd('Brute Force');
  console.log('Brute result:', result8a);

  console.time('Prefix Sum');
  const result8b = maxSubmatrixPrefixSum(matrix8);
  console.timeEnd('Prefix Sum');
  console.log('Prefix result:', result8b);

  console.time('Kadane Extension (Optimal)');
  const result8c = maxSubmatrix(matrix8);
  console.timeEnd('Kadane Extension (Optimal)');
  console.log('Kadane result:', result8c);

  console.time('DP Variation');
  const result8d = maxSubmatrixDP(matrix8);
  console.timeEnd('DP Variation');
  console.log('DP result:', result8d);

  console.log('\nAll approaches should give same sum:', result8a.sum);
  console.log();

  // Performance comparison
  console.log('Performance Comparison (50x50 matrix):');
  const bigMatrix = generateRandomMatrix(50, -10, 10);

  console.time('Kadane Extension O(N³)');
  maxSubmatrix(bigMatrix);
  console.timeEnd('Kadane Extension O(N³)');

  console.time('DP Variation O(N³)');
  maxSubmatrixDP(bigMatrix);
  console.timeEnd('DP Variation O(N³)');

  console.log('\nNote: Kadane extension is the optimal solution - O(N³) time, O(N) space');
}

// Run tests
runTests();

// Export functions
module.exports = {
  maxSubmatrix,
  maxSubmatrixBrute,
  maxSubmatrixPrefixSum,
  maxSubmatrixDP,
  kadaneWithIndices,
  extractSubmatrix,
  visualizeMatrix,
  generateRandomMatrix,
  printResult
};
