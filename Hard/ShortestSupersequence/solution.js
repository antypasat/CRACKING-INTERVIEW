/**
 * PROBLEM 17.18 - SHORTEST SUPERSEQUENCE
 *
 * You are given two arrays, one shorter (with all distinct elements) and one longer.
 * Find the shortest subarray in the longer array that contains all the elements in
 * the shorter array. The items can appear in any order.
 *
 * Example:
 * Input:
 *   shorter = [1, 5, 9]
 *   longer = [7, 5, 9, 0, 2, 1, 3, 5, 7, 9, 1, 1, 5, 8, 8, 9, 7]
 *                    ^              ^
 * Output: [7, 10] (inclusive indices)
 * The subarray from index 7 to 10 is [5, 7, 9, 1] which contains all elements [1, 5, 9]
 */

// =============================================================================
// APPROACH 1: BRUTE FORCE
// Time: O(b^2 * s) where b = longer array length, s = shorter array length
// Space: O(s)
// =============================================================================

function shortestSupersequenceBrute(shorter, longer) {
  if (!shorter || !longer || shorter.length === 0 || longer.length === 0) {
    return null;
  }

  const targetSet = new Set(shorter);
  let minLen = Infinity;
  let bestRange = null;

  // Try every possible starting position
  for (let start = 0; start < longer.length; start++) {
    // Try every possible ending position
    for (let end = start; end < longer.length; end++) {
      // Check if this range contains all elements
      if (containsAll(longer, start, end, targetSet)) {
        const len = end - start + 1;
        if (len < minLen) {
          minLen = len;
          bestRange = [start, end];
        }
        break; // No need to extend further from this start
      }
    }
  }

  return bestRange;
}

function containsAll(array, start, end, targetSet) {
  const seen = new Set();
  for (let i = start; i <= end; i++) {
    if (targetSet.has(array[i])) {
      seen.add(array[i]);
    }
  }
  return seen.size === targetSet.size;
}

// =============================================================================
// APPROACH 2: SLIDING WINDOW (OPTIMAL)
// Time: O(b * s) where b = longer array length, s = shorter array length
// Space: O(s)
//
// Use two pointers to maintain a sliding window. Expand right until we have
// all elements, then contract left while maintaining all elements.
// =============================================================================

function shortestSupersequence(shorter, longer) {
  if (!shorter || !longer || shorter.length === 0 || longer.length === 0) {
    return null;
  }

  // Create a set of elements we need to find
  const targetSet = new Set(shorter);

  // Find all positions of target elements in longer array
  const positions = new Map();
  for (let i = 0; i < longer.length; i++) {
    if (targetSet.has(longer[i])) {
      if (!positions.has(longer[i])) {
        positions.set(longer[i], []);
      }
      positions.get(longer[i]).push(i);
    }
  }

  // Check if all elements are present
  if (positions.size < targetSet.size) {
    return null; // Not all elements are in the longer array
  }

  // Use sliding window approach
  return findShortestWindow(positions, shorter.length);
}

function findShortestWindow(positions, targetCount) {
  // Convert positions map to array of [element, positions] pairs
  const elementPositions = Array.from(positions.values());

  // Initialize pointers for each element (pointing to first occurrence)
  const pointers = new Array(elementPositions.length).fill(0);

  let minLen = Infinity;
  let bestRange = null;

  while (true) {
    // Find the current range (min and max indices among current pointers)
    let minIndex = Infinity;
    let maxIndex = -Infinity;
    let minPointerIdx = -1;

    for (let i = 0; i < elementPositions.length; i++) {
      const currentPos = elementPositions[i][pointers[i]];

      if (currentPos < minIndex) {
        minIndex = currentPos;
        minPointerIdx = i;
      }

      if (currentPos > maxIndex) {
        maxIndex = currentPos;
      }
    }

    // Update best range if this is shorter
    const currentLen = maxIndex - minIndex + 1;
    if (currentLen < minLen) {
      minLen = currentLen;
      bestRange = [minIndex, maxIndex];
    }

    // Try to advance the pointer at minimum position
    pointers[minPointerIdx]++;

    // If we've exhausted positions for any element, we're done
    if (pointers[minPointerIdx] >= elementPositions[minPointerIdx].length) {
      break;
    }
  }

  return bestRange;
}

// =============================================================================
// APPROACH 3: OPTIMIZED SLIDING WINDOW WITH HASH MAP
// Time: O(b) where b = longer array length
// Space: O(s) where s = shorter array length
//
// This is the most intuitive and efficient approach.
// =============================================================================

function shortestSupersequenceOptimized(shorter, longer) {
  if (!shorter || !longer || shorter.length === 0 || longer.length === 0) {
    return null;
  }

  // Create target map to track what we need
  const targetMap = new Map();
  for (const num of shorter) {
    targetMap.set(num, 0);
  }

  // Sliding window variables
  let left = 0;
  let minLen = Infinity;
  let bestRange = null;
  let foundCount = 0; // Number of distinct elements found

  // Map to track elements in current window
  const windowMap = new Map();

  // Expand window with right pointer
  for (let right = 0; right < longer.length; right++) {
    const rightNum = longer[right];

    // Only process if this is a target element
    if (targetMap.has(rightNum)) {
      const count = windowMap.get(rightNum) || 0;
      windowMap.set(rightNum, count + 1);

      // If this is the first occurrence of this element
      if (count === 0) {
        foundCount++;
      }

      // Contract window while we have all elements
      while (foundCount === shorter.length) {
        // Update best range
        const currentLen = right - left + 1;
        if (currentLen < minLen) {
          minLen = currentLen;
          bestRange = [left, right];
        }

        // Try to shrink from left
        const leftNum = longer[left];

        if (targetMap.has(leftNum)) {
          const count = windowMap.get(leftNum);
          windowMap.set(leftNum, count - 1);

          if (count - 1 === 0) {
            foundCount--;
          }
        }

        left++;
      }
    }
  }

  return bestRange;
}

// =============================================================================
// APPROACH 4: TWO-PASS OPTIMIZATION
// First pass: find all positions of target elements
// Second pass: use min-heap to efficiently find shortest range
// Time: O(b + s*log(s)) where b = longer length, s = shorter length
// Space: O(positions of target elements)
// =============================================================================

class MinHeap {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;

      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length &&
          this.comparator(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length &&
          this.comparator(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

function shortestSupersequenceHeap(shorter, longer) {
  if (!shorter || !longer || shorter.length === 0 || longer.length === 0) {
    return null;
  }

  const targetSet = new Set(shorter);

  // Collect positions for each target element
  const elementPositions = new Map();
  for (let i = 0; i < longer.length; i++) {
    if (targetSet.has(longer[i])) {
      if (!elementPositions.has(longer[i])) {
        elementPositions.set(longer[i], []);
      }
      elementPositions.get(longer[i]).push(i);
    }
  }

  if (elementPositions.size < shorter.length) {
    return null;
  }

  // Min heap: stores {element, positionIndex, actualPosition}
  const heap = new MinHeap((a, b) => a.position - b.position);

  // Initialize heap with first position of each element
  const iterators = new Map();
  for (const [element, positions] of elementPositions) {
    iterators.set(element, 0);
    heap.push({ element, index: 0, position: positions[0] });
  }

  let minLen = Infinity;
  let bestRange = null;

  while (heap.size() === shorter.length) {
    // Find max position in current heap
    let maxPos = -Infinity;
    for (const item of heap.heap) {
      maxPos = Math.max(maxPos, item.position);
    }

    // Get min position
    const minItem = heap.peek();
    const minPos = minItem.position;

    // Update best range
    if (maxPos - minPos + 1 < minLen) {
      minLen = maxPos - minPos + 1;
      bestRange = [minPos, maxPos];
    }

    // Advance the element with minimum position
    const removed = heap.pop();
    const nextIndex = removed.index + 1;
    const positions = elementPositions.get(removed.element);

    if (nextIndex < positions.length) {
      heap.push({
        element: removed.element,
        index: nextIndex,
        position: positions[nextIndex]
      });
    } else {
      break; // Can't advance this element anymore
    }
  }

  return bestRange;
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Shortest Supersequence...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const shorter1 = [1, 5, 9];
  const longer1 = [7, 5, 9, 0, 2, 1, 3, 5, 7, 9, 1, 1, 5, 8, 8, 9, 7];
  const result1 = shortestSupersequenceOptimized(shorter1, longer1);
  console.log('Shorter:', shorter1);
  console.log('Longer:', longer1);
  console.log('Result:', result1);
  console.log('Subarray:', longer1.slice(result1[0], result1[1] + 1));
  console.log('Expected: [7, 10]');
  console.log();

  // Test 2: Elements at beginning
  console.log('Test 2: Elements at beginning');
  const shorter2 = [1, 2, 3];
  const longer2 = [3, 2, 1, 4, 5, 6];
  const result2 = shortestSupersequenceOptimized(shorter2, longer2);
  console.log('Shorter:', shorter2);
  console.log('Longer:', longer2);
  console.log('Result:', result2);
  console.log('Subarray:', longer2.slice(result2[0], result2[1] + 1));
  console.log();

  // Test 3: Elements at end
  console.log('Test 3: Elements at end');
  const shorter3 = [7, 8, 9];
  const longer3 = [1, 2, 3, 4, 5, 9, 8, 7];
  const result3 = shortestSupersequenceOptimized(shorter3, longer3);
  console.log('Shorter:', shorter3);
  console.log('Longer:', longer3);
  console.log('Result:', result3);
  console.log('Subarray:', longer3.slice(result3[0], result3[1] + 1));
  console.log();

  // Test 4: Minimal window
  console.log('Test 4: Minimal window (consecutive)');
  const shorter4 = [1, 2, 3];
  const longer4 = [5, 4, 1, 2, 3, 6, 7];
  const result4 = shortestSupersequenceOptimized(shorter4, longer4);
  console.log('Shorter:', shorter4);
  console.log('Longer:', longer4);
  console.log('Result:', result4);
  console.log('Subarray:', longer4.slice(result4[0], result4[1] + 1));
  console.log();

  // Test 5: Missing element
  console.log('Test 5: Missing element');
  const shorter5 = [1, 2, 3];
  const longer5 = [1, 1, 2, 2, 4, 4];
  const result5 = shortestSupersequenceOptimized(shorter5, longer5);
  console.log('Shorter:', shorter5);
  console.log('Longer:', longer5);
  console.log('Result:', result5);
  console.log('Expected: null');
  console.log();

  // Performance comparison
  console.log('Performance Comparison:');
  const bigShorter = [1, 5, 10, 15, 20];
  const bigLonger = Array.from({ length: 1000 }, (_, i) => i % 25);

  console.time('Brute Force');
  shortestSupersequenceBrute(bigShorter, bigLonger);
  console.timeEnd('Brute Force');

  console.time('Sliding Window');
  shortestSupersequence(bigShorter, bigLonger);
  console.timeEnd('Sliding Window');

  console.time('Optimized Sliding Window');
  shortestSupersequenceOptimized(bigShorter, bigLonger);
  console.timeEnd('Optimized Sliding Window');

  console.time('Heap-based');
  shortestSupersequenceHeap(bigShorter, bigLonger);
  console.timeEnd('Heap-based');
}

// Run tests
runTests();

// Export functions
module.exports = {
  shortestSupersequence,
  shortestSupersequenceBrute,
  shortestSupersequenceOptimized,
  shortestSupersequenceHeap
};
