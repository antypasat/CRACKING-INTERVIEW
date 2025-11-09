/**
 * PROBLEM 17.23 - MAX BLACK SQUARE
 *
 * Imagine you have a square matrix, where each cell (pixel) is either black or white.
 * Design an algorithm to find the maximum subsquare such that all four borders are
 * filled with black pixels.
 *
 * Example:
 * Input:
 * [
 *   [B, W, B, B, B, W],
 *   [B, W, B, B, B, B],
 *   [B, B, B, B, B, B],
 *   [W, B, B, B, B, B],
 *   [B, B, B, B, B, B],
 *   [W, W, B, B, B, B]
 * ]
 *
 * Output: Subsquare from (1,2) to (4,5) with size 4
 */

// =============================================================================
// APPROACH 1: BRUTE FORCE
// Time: O(N^4) where N is matrix dimension
// Space: O(1)
//
// Try every possible square and check if borders are all black
// =============================================================================

function maxBlackSquareBrute(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;
  let maxSize = 0;
  let maxSquare = null;

  // Try all possible top-left corners
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // Try all possible sizes starting from this corner
      const maxPossibleSize = n - Math.max(row, col);

      for (let size = maxPossibleSize; size > maxSize; size--) {
        if (isValidSquare(matrix, row, col, size)) {
          maxSize = size;
          maxSquare = { row, col, size };
          break; // Found largest for this position
        }
      }
    }
  }

  return maxSquare;
}

function isValidSquare(matrix, row, col, size) {
  // Check all four borders

  // Top and bottom borders
  for (let c = col; c < col + size; c++) {
    if (matrix[row][c] !== 1) return false; // Top
    if (matrix[row + size - 1][c] !== 1) return false; // Bottom
  }

  // Left and right borders
  for (let r = row; r < row + size; r++) {
    if (matrix[r][col] !== 1) return false; // Left
    if (matrix[r][col + size - 1] !== 1) return false; // Right
  }

  return true;
}

// =============================================================================
// APPROACH 2: OPTIMIZED WITH PREPROCESSING (BOOK SOLUTION)
// Time: O(N^3) where N is matrix dimension
// Space: O(N^2)
//
// Precompute for each cell: consecutive black cells to the right and below
// Then checking borders becomes O(1)
// =============================================================================

function maxBlackSquare(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;

  // Preprocess: for each cell, count consecutive blacks to right and below
  const processed = preprocessMatrix(matrix);

  let maxSize = 0;
  let maxSquare = null;

  // Try all possible top-left corners (start from largest possible squares)
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const maxPossibleSize = Math.min(n - row, n - col);

      // Try sizes from largest to current max
      for (let size = maxPossibleSize; size > maxSize; size--) {
        if (isValidSquareOptimized(processed, row, col, size)) {
          maxSize = size;
          maxSquare = { row, col, size };
          break;
        }
      }
    }
  }

  return maxSquare;
}

/**
 * Preprocess matrix to store consecutive black cells
 */
function preprocessMatrix(matrix) {
  const n = matrix.length;
  const processed = Array(n).fill(null).map(() =>
    Array(n).fill(null).map(() => ({ right: 0, down: 0 }))
  );

  // Process from bottom-right to top-left
  for (let row = n - 1; row >= 0; row--) {
    for (let col = n - 1; col >= 0; col--) {
      if (matrix[row][col] === 1) {
        // Count consecutive blacks to the right
        processed[row][col].right = 1;
        if (col + 1 < n) {
          processed[row][col].right += processed[row][col + 1].right;
        }

        // Count consecutive blacks below
        processed[row][col].down = 1;
        if (row + 1 < n) {
          processed[row][col].down += processed[row + 1][col].down;
        }
      }
    }
  }

  return processed;
}

/**
 * Check if square has all black borders using preprocessed data
 */
function isValidSquareOptimized(processed, row, col, size) {
  const bottomRow = row + size - 1;
  const rightCol = col + size - 1;

  // Check if we have enough consecutive blacks for borders
  // Top-left corner must have 'size' blacks to the right and down
  if (processed[row][col].right < size || processed[row][col].down < size) {
    return false;
  }

  // Top-right corner must have 'size' blacks down
  if (processed[row][rightCol].down < size) {
    return false;
  }

  // Bottom-left corner must have 'size' blacks to the right
  if (processed[bottomRow][col].right < size) {
    return false;
  }

  return true;
}

// =============================================================================
// APPROACH 3: DYNAMIC PROGRAMMING
// Time: O(N^3)
// Space: O(N^2)
//
// Build up solution using smaller squares
// =============================================================================

function maxBlackSquareDP(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;
  const processed = preprocessMatrix(matrix);

  // Find largest square by checking from biggest to smallest
  for (let size = n; size > 0; size--) {
    for (let row = 0; row <= n - size; row++) {
      for (let col = 0; col <= n - size; col++) {
        if (isValidSquareOptimized(processed, row, col, size)) {
          return { row, col, size };
        }
      }
    }
  }

  return null;
}

// =============================================================================
// APPROACH 4: WITH MEMOIZATION
// Time: O(N^3)
// Space: O(N^2)
//
// Cache results of square validity checks
// =============================================================================

function maxBlackSquareMemo(matrix) {
  if (!matrix || matrix.length === 0) return null;

  const n = matrix.length;
  const processed = preprocessMatrix(matrix);
  const memo = new Map();

  let maxSize = 0;
  let maxSquare = null;

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const size = findMaxSquareFromPosition(processed, row, col, memo);
      if (size > maxSize) {
        maxSize = size;
        maxSquare = { row, col, size };
      }
    }
  }

  return maxSquare;
}

function findMaxSquareFromPosition(processed, row, col, memo) {
  const key = `${row},${col}`;
  if (memo.has(key)) return memo.get(key);

  const n = processed.length;
  const maxPossibleSize = Math.min(n - row, n - col);

  for (let size = maxPossibleSize; size > 0; size--) {
    if (isValidSquareOptimized(processed, row, col, size)) {
      memo.set(key, size);
      return size;
    }
  }

  memo.set(key, 0);
  return 0;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create matrix from binary string representation
 */
function createMatrix(strings) {
  return strings.map(str =>
    str.split('').map(c => c === 'B' || c === '1' ? 1 : 0)
  );
}

/**
 * Visualize matrix with highlighted square
 */
function visualizeMatrix(matrix, square = null) {
  const n = matrix.length;
  let result = '';

  for (let row = 0; row < n; row++) {
    let line = '';
    for (let col = 0; col < n; col++) {
      const isInSquare = square &&
        row >= square.row &&
        row < square.row + square.size &&
        col >= square.col &&
        col < square.col + square.size;

      const isOnBorder = square && isInSquare &&
        (row === square.row ||
         row === square.row + square.size - 1 ||
         col === square.col ||
         col === square.col + square.size - 1);

      if (isOnBorder) {
        line += matrix[row][col] ? '[■]' : '[□]';
      } else if (isInSquare) {
        line += matrix[row][col] ? ' ■ ' : ' □ ';
      } else {
        line += matrix[row][col] ? ' ■ ' : ' □ ';
      }
    }
    result += line + '\n';
  }

  return result;
}

/**
 * Generate random matrix
 */
function generateRandomMatrix(size, blackProbability = 0.7) {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() =>
      Math.random() < blackProbability ? 1 : 0
    )
  );
}

/**
 * Print preprocessed data
 */
function printPreprocessed(processed) {
  const n = processed.length;
  console.log('Right counts:');
  for (let row = 0; row < n; row++) {
    console.log(processed[row].map(cell => cell.right).join(' '));
  }

  console.log('\nDown counts:');
  for (let row = 0; row < n; row++) {
    console.log(processed[row].map(cell => cell.down).join(' '));
  }
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Max Black Square...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const matrix1 = createMatrix([
    'BWBBBBW',
    'BWBBBBB',
    'BBBBBBB',
    'WBBBBBB',
    'BBBBBBB',
    'WWBBBBB'
  ]);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix1));
  const result1 = maxBlackSquare(matrix1);
  console.log('Max square:', result1);
  console.log('\nWith highlighted square:');
  console.log(visualizeMatrix(matrix1, result1));
  console.log();

  // Test 2: Simple 3x3
  console.log('Test 2: Simple 3x3 with 2x2 black square');
  const matrix2 = createMatrix([
    'BBW',
    'BBW',
    'WWW'
  ]);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix2));
  const result2 = maxBlackSquare(matrix2);
  console.log('Max square:', result2);
  console.log(visualizeMatrix(matrix2, result2));
  console.log();

  // Test 3: All black
  console.log('Test 3: All black matrix');
  const matrix3 = createMatrix([
    'BBBB',
    'BBBB',
    'BBBB',
    'BBBB'
  ]);
  const result3 = maxBlackSquare(matrix3);
  console.log('Max square:', result3);
  console.log('Expected: size 4');
  console.log();

  // Test 4: No black squares
  console.log('Test 4: No valid squares (checkerboard)');
  const matrix4 = createMatrix([
    'BWBW',
    'WBWB',
    'BWBW',
    'WBWB'
  ]);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix4));
  const result4 = maxBlackSquare(matrix4);
  console.log('Max square:', result4);
  console.log();

  // Test 5: Hollow black square
  console.log('Test 5: Hollow black square');
  const matrix5 = createMatrix([
    'BBBBB',
    'BWWWB',
    'BWWWB',
    'BWWWB',
    'BBBBB'
  ]);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix5));
  const result5 = maxBlackSquare(matrix5);
  console.log('Max square:', result5);
  console.log(visualizeMatrix(matrix5, result5));
  console.log();

  // Test 6: Multiple squares
  console.log('Test 6: Multiple possible squares');
  const matrix6 = createMatrix([
    'BBBWBBB',
    'BBBWBBB',
    'BBBWBBB',
    'WWWWWWW',
    'BBBBBBB',
    'BBBBBBB',
    'BBBBBBB'
  ]);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix6));
  const result6 = maxBlackSquare(matrix6);
  console.log('Max square:', result6);
  console.log(visualizeMatrix(matrix6, result6));
  console.log();

  // Test 7: Show preprocessing
  console.log('Test 7: Show preprocessing data');
  const matrix7 = createMatrix([
    'BBW',
    'BBB',
    'WBB'
  ]);
  const processed7 = preprocessMatrix(matrix7);
  console.log('Matrix:');
  console.log(visualizeMatrix(matrix7));
  printPreprocessed(processed7);
  console.log();

  // Performance comparison
  console.log('Performance Comparison:');
  const bigMatrix = generateRandomMatrix(50, 0.8);

  console.time('Brute Force (10x10 subset)');
  const smallMatrix = bigMatrix.slice(0, 10).map(row => row.slice(0, 10));
  maxBlackSquareBrute(smallMatrix);
  console.timeEnd('Brute Force (10x10 subset)');

  console.time('Optimized (50x50)');
  maxBlackSquare(bigMatrix);
  console.timeEnd('Optimized (50x50)');

  console.time('DP (50x50)');
  maxBlackSquareDP(bigMatrix);
  console.timeEnd('DP (50x50)');

  console.time('Memoized (50x50)');
  maxBlackSquareMemo(bigMatrix);
  console.timeEnd('Memoized (50x50)');

  console.log('\nNote: Optimized with preprocessing is the recommended solution - O(N³) time');
}

// Run tests
runTests();

// Export functions
module.exports = {
  maxBlackSquare,
  maxBlackSquareBrute,
  maxBlackSquareDP,
  maxBlackSquareMemo,
  preprocessMatrix,
  isValidSquare,
  isValidSquareOptimized,
  createMatrix,
  visualizeMatrix,
  generateRandomMatrix
};
