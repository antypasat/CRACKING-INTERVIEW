/**
 * PROBLEM 17.21 - VOLUME OF HISTOGRAM
 *
 * Imagine a histogram (bar graph). Design an algorithm to compute the volume of water
 * it could hold if someone poured water across the top. You can assume that each
 * histogram bar has width 1.
 *
 * Example:
 * Input: [0, 0, 4, 0, 0, 6, 0, 0, 3, 0, 5, 0, 1, 0, 0, 0]
 *
 * Histogram visualization:
 *       |
 *       |
 *    |  |
 *    |  |
 *    |  |  |  |
 *    |  |  |  |
 * _____|__|__|_|________________
 * 0  0  4  0  0  6  0  0  3  0  5  0  1  0  0  0
 *
 * Water fills:
 *       |
 *       |≈≈≈≈≈|
 *    |≈≈|≈≈≈≈|
 *    |≈≈|≈≈≈≈|≈≈|≈≈|
 *    |≈≈|≈≈≈≈|≈≈|≈≈|
 *    |≈≈|≈≈≈≈|≈≈|≈≈|
 *
 * Output: 26
 */

// =============================================================================
// APPROACH 1: BRUTE FORCE
// Time: O(N^2)
// Space: O(1)
//
// For each position, find max height on left and right, water level is min of these
// =============================================================================

function volumeOfHistogramBrute(heights) {
  if (!heights || heights.length === 0) return 0;

  let totalVolume = 0;

  for (let i = 0; i < heights.length; i++) {
    // Find max height to the left
    let maxLeft = 0;
    for (let j = 0; j < i; j++) {
      maxLeft = Math.max(maxLeft, heights[j]);
    }

    // Find max height to the right
    let maxRight = 0;
    for (let j = i + 1; j < heights.length; j++) {
      maxRight = Math.max(maxRight, heights[j]);
    }

    // Water level at this position
    const waterLevel = Math.min(maxLeft, maxRight);

    // Water trapped at this position
    if (waterLevel > heights[i]) {
      totalVolume += waterLevel - heights[i];
    }
  }

  return totalVolume;
}

// =============================================================================
// APPROACH 2: PRECOMPUTE MAX HEIGHTS
// Time: O(N)
// Space: O(N)
//
// Precompute max height to left and right of each position
// This is the book's recommended approach
// =============================================================================

function volumeOfHistogram(heights) {
  if (!heights || heights.length === 0) return 0;

  const n = heights.length;

  // Precompute max heights to the left of each position
  const maxLeft = new Array(n);
  maxLeft[0] = 0;
  for (let i = 1; i < n; i++) {
    maxLeft[i] = Math.max(maxLeft[i - 1], heights[i - 1]);
  }

  // Precompute max heights to the right of each position
  const maxRight = new Array(n);
  maxRight[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    maxRight[i] = Math.max(maxRight[i + 1], heights[i + 1]);
  }

  // Calculate total volume
  let totalVolume = 0;
  for (let i = 0; i < n; i++) {
    const waterLevel = Math.min(maxLeft[i], maxRight[i]);
    if (waterLevel > heights[i]) {
      totalVolume += waterLevel - heights[i];
    }
  }

  return totalVolume;
}

// =============================================================================
// APPROACH 3: TWO POINTERS (OPTIMAL)
// Time: O(N)
// Space: O(1)
//
// Use two pointers from both ends, track max heights, calculate water on the fly
// Most space-efficient solution
// =============================================================================

function volumeOfHistogramTwoPointers(heights) {
  if (!heights || heights.length === 0) return 0;

  let left = 0;
  let right = heights.length - 1;
  let maxLeft = 0;
  let maxRight = 0;
  let totalVolume = 0;

  while (left < right) {
    if (heights[left] < heights[right]) {
      // Process left side
      if (heights[left] >= maxLeft) {
        maxLeft = heights[left];
      } else {
        totalVolume += maxLeft - heights[left];
      }
      left++;
    } else {
      // Process right side
      if (heights[right] >= maxRight) {
        maxRight = heights[right];
      } else {
        totalVolume += maxRight - heights[right];
      }
      right--;
    }
  }

  return totalVolume;
}

// =============================================================================
// APPROACH 4: STACK-BASED
// Time: O(N)
// Space: O(N)
//
// Use stack to find trapped water between bars
// Good for understanding the problem differently
// =============================================================================

function volumeOfHistogramStack(heights) {
  if (!heights || heights.length === 0) return 0;

  const stack = [];
  let totalVolume = 0;

  for (let i = 0; i < heights.length; i++) {
    // Pop from stack while current height is greater
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const top = stack.pop();

      if (stack.length === 0) break;

      const distance = i - stack[stack.length - 1] - 1;
      const boundedHeight = Math.min(heights[i], heights[stack[stack.length - 1]]) - heights[top];
      totalVolume += distance * boundedHeight;
    }

    stack.push(i);
  }

  return totalVolume;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Visualize histogram and water
 */
function visualizeHistogram(heights) {
  if (!heights || heights.length === 0) return '';

  const maxHeight = Math.max(...heights);
  const lines = [];

  // Build from top to bottom
  for (let h = maxHeight; h > 0; h--) {
    let line = '';
    for (let i = 0; i < heights.length; i++) {
      if (heights[i] >= h) {
        line += '█';
      } else {
        line += ' ';
      }
    }
    lines.push(line);
  }

  // Add bottom line
  lines.push('═'.repeat(heights.length));

  return lines.join('\n');
}

/**
 * Visualize histogram with water
 */
function visualizeWithWater(heights) {
  if (!heights || heights.length === 0) return '';

  const n = heights.length;
  const maxHeight = Math.max(...heights);

  // Calculate water level at each position
  const maxLeft = new Array(n);
  maxLeft[0] = 0;
  for (let i = 1; i < n; i++) {
    maxLeft[i] = Math.max(maxLeft[i - 1], heights[i - 1]);
  }

  const maxRight = new Array(n);
  maxRight[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    maxRight[i] = Math.max(maxRight[i + 1], heights[i + 1]);
  }

  const waterLevel = new Array(n);
  for (let i = 0; i < n; i++) {
    waterLevel[i] = Math.max(0, Math.min(maxLeft[i], maxRight[i]));
  }

  const lines = [];

  // Build from top to bottom
  for (let h = maxHeight; h > 0; h--) {
    let line = '';
    for (let i = 0; i < heights.length; i++) {
      if (heights[i] >= h) {
        line += '█';
      } else if (waterLevel[i] >= h) {
        line += '≈';
      } else {
        line += ' ';
      }
    }
    lines.push(line);
  }

  // Add bottom line
  lines.push('═'.repeat(heights.length));

  // Add height labels
  const labels = heights.map(h => h.toString().padStart(2)).join(' ');
  lines.push(labels);

  return lines.join('\n');
}

/**
 * Calculate volume with detailed breakdown
 */
function volumeWithDetails(heights) {
  if (!heights || heights.length === 0) return { volume: 0, details: [] };

  const n = heights.length;
  const maxLeft = new Array(n);
  maxLeft[0] = 0;
  for (let i = 1; i < n; i++) {
    maxLeft[i] = Math.max(maxLeft[i - 1], heights[i - 1]);
  }

  const maxRight = new Array(n);
  maxRight[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    maxRight[i] = Math.max(maxRight[i + 1], heights[i + 1]);
  }

  const details = [];
  let totalVolume = 0;

  for (let i = 0; i < n; i++) {
    const waterLevel = Math.min(maxLeft[i], maxRight[i]);
    const water = Math.max(0, waterLevel - heights[i]);
    totalVolume += water;

    details.push({
      index: i,
      height: heights[i],
      maxLeft: maxLeft[i],
      maxRight: maxRight[i],
      waterLevel,
      water
    });
  }

  return { volume: totalVolume, details };
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Volume of Histogram...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const heights1 = [0, 0, 4, 0, 0, 6, 0, 0, 3, 0, 5, 0, 1, 0, 0, 0];
  console.log('Heights:', heights1);
  console.log('\nHistogram:');
  console.log(visualizeHistogram(heights1));
  console.log('\nWith water:');
  console.log(visualizeWithWater(heights1));
  console.log('\nBrute force:', volumeOfHistogramBrute(heights1));
  console.log('Precompute:', volumeOfHistogram(heights1));
  console.log('Two pointers:', volumeOfHistogramTwoPointers(heights1));
  console.log('Stack-based:', volumeOfHistogramStack(heights1));
  console.log('Expected: 26');
  console.log();

  // Test 2: Simple valley
  console.log('Test 2: Simple valley');
  const heights2 = [3, 0, 2];
  console.log('Heights:', heights2);
  console.log(visualizeWithWater(heights2));
  console.log('Volume:', volumeOfHistogram(heights2));
  console.log('Expected: 2');
  console.log();

  // Test 3: Multiple valleys
  console.log('Test 3: Multiple valleys');
  const heights3 = [3, 0, 0, 2, 0, 4];
  console.log('Heights:', heights3);
  console.log(visualizeWithWater(heights3));
  console.log('Volume:', volumeOfHistogram(heights3));
  console.log('Expected: 10');
  console.log();

  // Test 4: No water (increasing)
  console.log('Test 4: No water (increasing)');
  const heights4 = [1, 2, 3, 4, 5];
  console.log('Heights:', heights4);
  console.log('Volume:', volumeOfHistogram(heights4));
  console.log('Expected: 0');
  console.log();

  // Test 5: No water (decreasing)
  console.log('Test 5: No water (decreasing)');
  const heights5 = [5, 4, 3, 2, 1];
  console.log('Heights:', heights5);
  console.log('Volume:', volumeOfHistogram(heights5));
  console.log('Expected: 0');
  console.log();

  // Test 6: Complex pattern
  console.log('Test 6: Complex pattern');
  const heights6 = [4, 2, 0, 3, 2, 5];
  console.log('Heights:', heights6);
  console.log(visualizeWithWater(heights6));
  console.log('Volume:', volumeOfHistogram(heights6));
  console.log();

  // Test 7: Detailed breakdown
  console.log('Test 7: Detailed breakdown');
  const heights7 = [3, 0, 2, 0, 4];
  const result = volumeWithDetails(heights7);
  console.log('Heights:', heights7);
  console.log('\nDetails:');
  console.table(result.details);
  console.log('Total volume:', result.volume);
  console.log();

  // Performance comparison
  console.log('Performance Comparison (large array):');
  const largeHeights = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 100));

  console.time('Brute Force (first 100 elements)');
  volumeOfHistogramBrute(largeHeights.slice(0, 100));
  console.timeEnd('Brute Force (first 100 elements)');

  console.time('Precompute (optimal)');
  volumeOfHistogram(largeHeights);
  console.timeEnd('Precompute (optimal)');

  console.time('Two Pointers (most space-efficient)');
  volumeOfHistogramTwoPointers(largeHeights);
  console.timeEnd('Two Pointers (most space-efficient)');

  console.time('Stack-based');
  volumeOfHistogramStack(largeHeights);
  console.timeEnd('Stack-based');

  console.log('\nNote: Two Pointers is optimal - O(N) time, O(1) space');
}

// Run tests
runTests();

// Export functions
module.exports = {
  volumeOfHistogram,
  volumeOfHistogramBrute,
  volumeOfHistogramTwoPointers,
  volumeOfHistogramStack,
  visualizeHistogram,
  visualizeWithWater,
  volumeWithDetails
};
