/**
 * PROBLEM 17.20 - CONTINUOUS MEDIAN
 *
 * Numbers are randomly generated and passed to a method. Write a program to find
 * and maintain the median value as new values are generated.
 *
 * Median: Middle value in ordered list (or average of two middle values for even count)
 *
 * Example:
 * add(5) -> median = 5
 * add(3) -> median = 4 (average of 3 and 5)
 * add(7) -> median = 5 (middle value of 3, 5, 7)
 * add(1) -> median = 4 (average of 3 and 5)
 */

// =============================================================================
// APPROACH 1: NAIVE - SORTED ARRAY
// Time: O(N log N) for add (due to sorting), O(1) for getMedian
// Space: O(N)
//
// Simple but inefficient
// =============================================================================

class MedianTrackerNaive {
  constructor() {
    this.numbers = [];
  }

  add(num) {
    this.numbers.push(num);
    this.numbers.sort((a, b) => a - b);
  }

  getMedian() {
    if (this.numbers.length === 0) return null;

    const mid = Math.floor(this.numbers.length / 2);

    if (this.numbers.length % 2 === 1) {
      return this.numbers[mid];
    } else {
      return (this.numbers[mid - 1] + this.numbers[mid]) / 2;
    }
  }
}

// =============================================================================
// APPROACH 2: INSERTION SORT
// Time: O(N) for add (insertion), O(1) for getMedian
// Space: O(N)
//
// Better than full sort, but still O(N) per insertion
// =============================================================================

class MedianTrackerInsertionSort {
  constructor() {
    this.numbers = [];
  }

  add(num) {
    // Binary search to find insertion position
    let left = 0;
    let right = this.numbers.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.numbers[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    this.numbers.splice(left, 0, num);
  }

  getMedian() {
    if (this.numbers.length === 0) return null;

    const mid = Math.floor(this.numbers.length / 2);

    if (this.numbers.length % 2 === 1) {
      return this.numbers[mid];
    } else {
      return (this.numbers[mid - 1] + this.numbers[mid]) / 2;
    }
  }
}

// =============================================================================
// APPROACH 3: TWO HEAPS (OPTIMAL)
// Time: O(log N) for add, O(1) for getMedian
// Space: O(N)
//
// Use max heap for lower half and min heap for upper half
// Keep heaps balanced so median is always at top(s)
//
// This is the optimal solution from the book
// =============================================================================

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
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
      if (this.heap[index] <= this.heap[parentIndex]) break;

      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (leftChild < this.heap.length && this.heap[leftChild] > this.heap[largest]) {
        largest = leftChild;
      }

      if (rightChild < this.heap.length && this.heap[rightChild] > this.heap[largest]) {
        largest = rightChild;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
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
      if (this.heap[index] >= this.heap[parentIndex]) break;

      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[smallest]) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[smallest]) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

class ContinuousMedian {
  constructor() {
    this.maxHeap = new MaxHeap(); // Stores smaller half of numbers
    this.minHeap = new MinHeap(); // Stores larger half of numbers
  }

  /**
   * Add a number to the data structure
   * Time: O(log N)
   */
  add(num) {
    // Add to appropriate heap
    if (this.maxHeap.size() === 0 || num <= this.maxHeap.peek()) {
      this.maxHeap.push(num);
    } else {
      this.minHeap.push(num);
    }

    // Rebalance heaps if necessary
    this.rebalance();
  }

  /**
   * Balance the heaps so that their sizes differ by at most 1
   */
  rebalance() {
    const maxSize = this.maxHeap.size();
    const minSize = this.minHeap.size();

    if (maxSize > minSize + 1) {
      // Max heap is too big, move top element to min heap
      this.minHeap.push(this.maxHeap.pop());
    } else if (minSize > maxSize + 1) {
      // Min heap is too big, move top element to max heap
      this.maxHeap.push(this.minHeap.pop());
    }
  }

  /**
   * Get the current median
   * Time: O(1)
   */
  getMedian() {
    const maxSize = this.maxHeap.size();
    const minSize = this.minHeap.size();

    if (maxSize === 0 && minSize === 0) {
      return null;
    }

    if (maxSize > minSize) {
      return this.maxHeap.peek();
    } else if (minSize > maxSize) {
      return this.minHeap.peek();
    } else {
      return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }
  }

  /**
   * Get count of numbers added
   */
  size() {
    return this.maxHeap.size() + this.minHeap.size();
  }

  /**
   * Get all numbers in sorted order (for debugging)
   */
  getAllSorted() {
    const result = [];
    const maxCopy = [...this.maxHeap.heap];
    const minCopy = [...this.minHeap.heap];

    maxCopy.sort((a, b) => b - a);
    minCopy.sort((a, b) => a - b);

    return [...maxCopy.reverse(), ...minCopy];
  }
}

// =============================================================================
// APPROACH 4: BALANCED BST (Alternative optimal solution)
// Time: O(log N) for add, O(log N) for getMedian
// Space: O(N)
//
// More complex to implement but supports additional operations
// =============================================================================

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.size = 1; // Size of subtree rooted at this node
  }
}

class MedianTrackerBST {
  constructor() {
    this.root = null;
    this.count = 0;
  }

  add(num) {
    this.root = this.insertNode(this.root, num);
    this.count++;
  }

  insertNode(node, val) {
    if (node === null) {
      return new TreeNode(val);
    }

    if (val <= node.val) {
      node.left = this.insertNode(node.left, val);
    } else {
      node.right = this.insertNode(node.right, val);
    }

    node.size = 1 + this.getSize(node.left) + this.getSize(node.right);
    return node;
  }

  getSize(node) {
    return node ? node.size : 0;
  }

  getMedian() {
    if (this.count === 0) return null;

    if (this.count % 2 === 1) {
      return this.findKthSmallest(this.root, Math.floor(this.count / 2) + 1);
    } else {
      const mid1 = this.findKthSmallest(this.root, this.count / 2);
      const mid2 = this.findKthSmallest(this.root, this.count / 2 + 1);
      return (mid1 + mid2) / 2;
    }
  }

  findKthSmallest(node, k) {
    const leftSize = this.getSize(node.left);

    if (k === leftSize + 1) {
      return node.val;
    } else if (k <= leftSize) {
      return this.findKthSmallest(node.left, k);
    } else {
      return this.findKthSmallest(node.right, k - leftSize - 1);
    }
  }
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Continuous Median...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const tracker1 = new ContinuousMedian();
  console.log('add(5) -> median:', tracker1.add(5), tracker1.getMedian());
  console.log('add(3) -> median:', tracker1.add(3), tracker1.getMedian());
  console.log('add(7) -> median:', tracker1.add(7), tracker1.getMedian());
  console.log('add(1) -> median:', tracker1.add(1), tracker1.getMedian());
  console.log('Expected: 5, 4, 5, 4');
  console.log();

  // Test 2: Sequential numbers
  console.log('Test 2: Sequential numbers');
  const tracker2 = new ContinuousMedian();
  for (let i = 1; i <= 5; i++) {
    tracker2.add(i);
    console.log(`add(${i}) -> median: ${tracker2.getMedian()}`);
  }
  console.log();

  // Test 3: Reverse order
  console.log('Test 3: Reverse order');
  const tracker3 = new ContinuousMedian();
  for (let i = 5; i >= 1; i--) {
    tracker3.add(i);
    console.log(`add(${i}) -> median: ${tracker3.getMedian()}`);
  }
  console.log();

  // Test 4: Random numbers
  console.log('Test 4: Random numbers');
  const tracker4 = new ContinuousMedian();
  const nums = [12, 4, 5, 3, 8, 7];
  for (const num of nums) {
    tracker4.add(num);
    console.log(`add(${num}) -> median: ${tracker4.getMedian()}, data: [${tracker4.getAllSorted()}]`);
  }
  console.log();

  // Test 5: Duplicates
  console.log('Test 5: Duplicates');
  const tracker5 = new ContinuousMedian();
  const nums5 = [5, 5, 5, 5, 5];
  for (const num of nums5) {
    tracker5.add(num);
    console.log(`add(${num}) -> median: ${tracker5.getMedian()}`);
  }
  console.log();

  // Test 6: Large stream
  console.log('Test 6: Large stream (1000 random numbers)');
  const tracker6 = new ContinuousMedian();
  const trackerNaive = new MedianTrackerNaive();

  for (let i = 0; i < 100; i++) {
    const num = Math.floor(Math.random() * 1000);
    tracker6.add(num);
    trackerNaive.add(num);
  }

  console.log('Two-heap median:', tracker6.getMedian());
  console.log('Naive median:', trackerNaive.getMedian());
  console.log('Match:', Math.abs(tracker6.getMedian() - trackerNaive.getMedian()) < 0.001);
  console.log();

  // Performance comparison
  console.log('Performance Comparison (10,000 insertions):');
  const testSize = 10000;

  console.time('Two Heaps (Optimal)');
  const heapTracker = new ContinuousMedian();
  for (let i = 0; i < testSize; i++) {
    heapTracker.add(Math.random() * 10000);
    if (i % 1000 === 0) heapTracker.getMedian();
  }
  console.timeEnd('Two Heaps (Optimal)');

  console.time('Insertion Sort');
  const insertTracker = new MedianTrackerInsertionSort();
  for (let i = 0; i < Math.min(1000, testSize); i++) {
    insertTracker.add(Math.random() * 10000);
    if (i % 100 === 0) insertTracker.getMedian();
  }
  console.timeEnd('Insertion Sort');

  console.time('BST approach');
  const bstTracker = new MedianTrackerBST();
  for (let i = 0; i < testSize; i++) {
    bstTracker.add(Math.random() * 10000);
    if (i % 1000 === 0) bstTracker.getMedian();
  }
  console.timeEnd('BST approach');

  console.log('\nNote: Two Heaps is the optimal solution - O(log N) insert, O(1) median');
}

// Run tests
runTests();

// Export classes
module.exports = {
  ContinuousMedian,
  MedianTrackerNaive,
  MedianTrackerInsertionSort,
  MedianTrackerBST,
  MaxHeap,
  MinHeap
};
