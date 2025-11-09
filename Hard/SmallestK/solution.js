/**
 * CTCI 17.14 - Smallest K
 *
 * Problem:
 * Design an algorithm to find the smallest K numbers in an array.
 *
 * Example:
 * Input: arr = [1, 5, 2, 9, 3, 7, 6, 4, 8], k = 3
 * Output: [1, 2, 3]
 */

/**
 * Approach 1: Sort the Array
 *
 * The simplest approach: sort the entire array and return the first k elements.
 *
 * Time: O(n log n) - dominated by sorting
 * Space: O(1) or O(n) depending on sort implementation
 */
function smallestKSort(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    // Sort and return first k elements
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted.slice(0, k);
}

/**
 * Approach 2: Max Heap of Size K
 *
 * Maintain a max heap of size k. For each element:
 * - If heap size < k, add element
 * - If element < max in heap, remove max and add element
 *
 * Time: O(n log k) - each insertion/deletion is O(log k)
 * Space: O(k) - heap of size k
 */
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    insert(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return max;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] >= this.heap[index]) break;

            [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let largest = index;

            if (leftChild < this.heap.length &&
                this.heap[leftChild] > this.heap[largest]) {
                largest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild] > this.heap[largest]) {
                largest = rightChild;
            }

            if (largest === index) break;

            [this.heap[index], this.heap[largest]] =
                [this.heap[largest], this.heap[index]];
            index = largest;
        }
    }

    toArray() {
        return [...this.heap];
    }
}

function smallestKMaxHeap(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    const maxHeap = new MaxHeap();

    for (const num of arr) {
        if (maxHeap.size() < k) {
            maxHeap.insert(num);
        } else if (num < maxHeap.peek()) {
            maxHeap.extractMax();
            maxHeap.insert(num);
        }
    }

    return maxHeap.toArray().sort((a, b) => a - b);
}

/**
 * Approach 3: Min Heap (Priority Queue)
 *
 * Add all elements to a min heap, then extract k smallest.
 *
 * Time: O(n + k log n) - heapify is O(n), k extractions are O(k log n)
 * Space: O(n) - heap contains all elements
 */
class MinHeap {
    constructor(arr = []) {
        this.heap = [...arr];
        this.buildHeap();
    }

    buildHeap() {
        // Start from last parent node and bubble down
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.bubbleDown(i);
        }
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    insert(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] <= this.heap[index]) break;

            [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length &&
                this.heap[leftChild] < this.heap[smallest]) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild] < this.heap[smallest]) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] =
                [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

function smallestKMinHeap(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    const minHeap = new MinHeap(arr);
    const result = [];

    for (let i = 0; i < k; i++) {
        result.push(minHeap.extractMin());
    }

    return result;
}

/**
 * Approach 4: QuickSelect (Modified QuickSort)
 *
 * Use QuickSelect to partition array so that k smallest elements are on the left.
 * This modifies the array but is the most efficient for large arrays.
 *
 * Time: O(n) average case, O(n^2) worst case
 * Space: O(log n) - recursion stack
 */
function smallestKQuickSelect(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    const copy = [...arr];
    quickSelect(copy, 0, copy.length - 1, k - 1);

    // Return first k elements (not necessarily sorted)
    return copy.slice(0, k).sort((a, b) => a - b);
}

function quickSelect(arr, left, right, k) {
    if (left >= right) return;

    const pivotIndex = partition(arr, left, right);

    if (pivotIndex === k) {
        return; // Found the k-th smallest element
    } else if (pivotIndex < k) {
        quickSelect(arr, pivotIndex + 1, right, k);
    } else {
        quickSelect(arr, left, pivotIndex - 1, k);
    }
}

function partition(arr, left, right) {
    // Choose random pivot to avoid worst case
    const pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
    const pivot = arr[pivotIndex];

    // Move pivot to end
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];

    let storeIndex = left;
    for (let i = left; i < right; i++) {
        if (arr[i] < pivot) {
            [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
            storeIndex++;
        }
    }

    // Move pivot to final position
    [arr[storeIndex], arr[right]] = [arr[right], arr[storeIndex]];

    return storeIndex;
}

/**
 * Approach 5: Optimized QuickSelect with 3-way partitioning
 *
 * Better handles duplicates using Dutch National Flag algorithm.
 *
 * Time: O(n) average case
 * Space: O(log n)
 */
function smallestKQuickSelect3Way(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    const copy = [...arr];
    quickSelect3Way(copy, 0, copy.length - 1, k - 1);

    return copy.slice(0, k).sort((a, b) => a - b);
}

function quickSelect3Way(arr, left, right, k) {
    if (left >= right) return;

    const [lt, gt] = partition3Way(arr, left, right);

    if (k < lt) {
        quickSelect3Way(arr, left, lt - 1, k);
    } else if (k > gt) {
        quickSelect3Way(arr, gt + 1, right, k);
    }
    // If k is between lt and gt, we're done
}

function partition3Way(arr, left, right) {
    const pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
    const pivot = arr[pivotIndex];

    let lt = left;      // arr[left..lt-1] < pivot
    let i = left;       // arr[lt..i-1] == pivot
    let gt = right;     // arr[gt+1..right] > pivot

    while (i <= gt) {
        if (arr[i] < pivot) {
            [arr[lt], arr[i]] = [arr[i], arr[lt]];
            lt++;
            i++;
        } else if (arr[i] > pivot) {
            [arr[i], arr[gt]] = [arr[gt], arr[i]];
            gt--;
        } else {
            i++;
        }
    }

    return [lt, gt];
}

/**
 * Approach 6: Using built-in sort with custom comparator
 *
 * Most practical for small arrays or when simplicity is preferred.
 *
 * Time: O(n log n)
 * Space: O(1) or O(n)
 */
function smallestKBuiltIn(arr, k) {
    if (!arr || k <= 0) return [];
    if (k >= arr.length) return [...arr];

    return [...arr]
        .sort((a, b) => a - b)
        .slice(0, k);
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Verify that result contains k smallest elements
 */
function verifySmallestK(arr, result, k) {
    if (result.length !== k) return false;

    const sorted = [...arr].sort((a, b) => a - b);
    const expected = sorted.slice(0, k);

    const resultSorted = [...result].sort((a, b) => a - b);

    return JSON.stringify(resultSorted) === JSON.stringify(expected);
}

/**
 * Generate random array for testing
 */
function generateRandomArray(size, min = 0, max = 1000) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing Smallest K...\n');

    // Test 1: Basic example
    console.log('Test 1: Basic example');
    const arr1 = [1, 5, 2, 9, 3, 7, 6, 4, 8];
    const k1 = 3;
    console.log('Array:', arr1);
    console.log('k:', k1);
    console.log('Sort approach:', smallestKSort(arr1, k1));
    console.log('Max heap approach:', smallestKMaxHeap(arr1, k1));
    console.log('Min heap approach:', smallestKMinHeap(arr1, k1));
    console.log('QuickSelect approach:', smallestKQuickSelect(arr1, k1));
    console.log('Expected: [1, 2, 3]\n');

    // Test 2: k = 1
    console.log('Test 2: k = 1 (find minimum)');
    const arr2 = [5, 2, 8, 1, 9];
    console.log('Array:', arr2);
    console.log('Result:', smallestKMaxHeap(arr2, 1));
    console.log('Expected: [1]\n');

    // Test 3: k equals array length
    console.log('Test 3: k equals array length');
    const arr3 = [3, 1, 4, 1, 5];
    console.log('Array:', arr3);
    console.log('Result:', smallestKSort(arr3, arr3.length));
    console.log('Expected: all elements\n');

    // Test 4: Array with duplicates
    console.log('Test 4: Array with duplicates');
    const arr4 = [5, 2, 2, 8, 2, 1, 9, 2];
    const k4 = 4;
    console.log('Array:', arr4);
    console.log('k:', k4);
    console.log('Result:', smallestKMaxHeap(arr4, k4));
    console.log('Expected: [1, 2, 2, 2]\n');

    // Test 5: Already sorted array
    console.log('Test 5: Already sorted array');
    const arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log('Array:', arr5);
    console.log('Result:', smallestKQuickSelect(arr5, 5));
    console.log('Expected: [1, 2, 3, 4, 5]\n');

    // Test 6: Reverse sorted array
    console.log('Test 6: Reverse sorted array');
    const arr6 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    console.log('Array:', arr6);
    console.log('Result:', smallestKMinHeap(arr6, 4));
    console.log('Expected: [1, 2, 3, 4]\n');

    // Test 7: Single element
    console.log('Test 7: Single element');
    const arr7 = [42];
    console.log('Array:', arr7);
    console.log('Result:', smallestKMaxHeap(arr7, 1));
    console.log('Expected: [42]\n');

    // Test 8: Edge cases
    console.log('Test 8: Edge cases');
    console.log('Empty array:', smallestKSort([], 3));
    console.log('k = 0:', smallestKSort([1, 2, 3], 0));
    console.log('k negative:', smallestKSort([1, 2, 3], -1));
    console.log('Expected: [], [], []\n');

    // Test 9: Negative numbers
    console.log('Test 9: Negative numbers');
    const arr9 = [-5, 3, -2, 8, -1, 0, 4];
    console.log('Array:', arr9);
    console.log('Result:', smallestKMaxHeap(arr9, 3));
    console.log('Expected: [-5, -2, -1]\n');

    // Test 10: Performance comparison
    console.log('Test 10: Performance comparison (n=10000, k=100)');
    const largeArr = generateRandomArray(10000, 1, 10000);
    const k = 100;

    console.time('Sort approach');
    const r1 = smallestKSort(largeArr, k);
    console.timeEnd('Sort approach');

    console.time('Max heap approach');
    const r2 = smallestKMaxHeap(largeArr, k);
    console.timeEnd('Max heap approach');

    console.time('Min heap approach');
    const r3 = smallestKMinHeap(largeArr, k);
    console.timeEnd('Min heap approach');

    console.time('QuickSelect approach');
    const r4 = smallestKQuickSelect(largeArr, k);
    console.timeEnd('QuickSelect approach');

    console.time('QuickSelect 3-way');
    const r5 = smallestKQuickSelect3Way(largeArr, k);
    console.timeEnd('QuickSelect 3-way');

    // Verify all approaches give same result
    console.log('All approaches correct:',
        verifySmallestK(largeArr, r1, k) &&
        verifySmallestK(largeArr, r2, k) &&
        verifySmallestK(largeArr, r3, k) &&
        verifySmallestK(largeArr, r4, k) &&
        verifySmallestK(largeArr, r5, k)
    );

    // Test 11: When k is close to n
    console.log('\nTest 11: k close to n (n=10000, k=9900)');
    console.time('Sort approach (k large)');
    smallestKSort(largeArr, 9900);
    console.timeEnd('Sort approach (k large)');

    console.time('Max heap approach (k large)');
    smallestKMaxHeap(largeArr, 9900);
    console.timeEnd('Max heap approach (k large)');

    console.time('QuickSelect approach (k large)');
    smallestKQuickSelect(largeArr, 9900);
    console.timeEnd('QuickSelect approach (k large)');

    // Test 12: Many duplicates
    console.log('\nTest 12: Array with many duplicates');
    const arr12 = Array(1000).fill().map(() => Math.floor(Math.random() * 10));
    console.log('First 20 elements:', arr12.slice(0, 20));
    const result12 = smallestKQuickSelect3Way(arr12, 50);
    console.log('50 smallest:', result12.slice(0, 10), '...');
    console.log('Verified:', verifySmallestK(arr12, result12, 50));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        smallestKSort,
        smallestKMaxHeap,
        smallestKMinHeap,
        smallestKQuickSelect,
        smallestKQuickSelect3Way,
        smallestKBuiltIn,
        MaxHeap,
        MinHeap,
        verifySmallestK,
        generateRandomArray
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
