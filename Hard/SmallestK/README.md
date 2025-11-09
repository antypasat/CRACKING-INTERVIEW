# 17.14 Smallest K

## Original Problem

**Smallest K:** Design an algorithm to find the smallest K numbers in an array.

```
Example:
Input: [7, 10, 4, 3, 20, 15], k = 3
Output: [3, 4, 7]

Input: [1, 5, 2, 9, 3], k = 2
Output: [1, 2]
```

Hints: #470, #530, #552, #593, #625, #647, #661, #678

---

## Understanding the Problem

Find the **k smallest elements** from an unsorted array. The result doesn't need to be sorted.

```
Input: [5, 2, 8, 1, 9, 3], k = 3

k smallest: [1, 2, 3] ✓
or any permutation: [2, 1, 3] ✓

Not: [1, 2, 5] if k=3 and 3 exists
```

### Key Insight

Different approaches offer different trade-offs:
- **Sorting:** O(n log n), simple
- **Max Heap:** O(n log k), space efficient
- **Quickselect:** O(n) average, in-place
- **Min Heap:** O(n + k log n)

---

## Solution Approaches

### Approach 1: Sorting

**Strategy:** Sort entire array, take first k elements

```javascript
function smallestK(array, k) {
  if (k <= 0 || k > array.length) return [];

  return array.sort((a, b) => a - b).slice(0, k);
}
```

**Pros:** Simple, works well for small arrays
**Cons:** Sorts more than needed

**Time:** O(n log n)
**Space:** O(1) if in-place sort, O(n) with slice

---

### Approach 2: Max Heap of Size K

**Strategy:** Maintain heap of k smallest elements seen so far

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
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

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index] <= this.heap[parentIndex]) break;

      [this.heap[index], this.heap[parentIndex]] =
        [this.heap[parentIndex], this.heap[index]];
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
}

function smallestK(array, k) {
  if (k <= 0 || k > array.length) return [];

  const maxHeap = new MaxHeap();

  for (const num of array) {
    if (maxHeap.size() < k) {
      maxHeap.insert(num);
    } else if (num < maxHeap.peek()) {
      maxHeap.extractMax();
      maxHeap.insert(num);
    }
  }

  return maxHeap.heap;
}
```

**How it works:**
```
Array: [7, 10, 4, 3, 20, 15], k = 3

Process 7: heap = [7]
Process 10: heap = [10, 7]
Process 4: heap = [10, 7, 4]
Process 3: 3 < 10 → remove 10, add 3
           heap = [7, 3, 4]
Process 20: 20 > 7 → skip
Process 15: 15 > 7 → skip

Result: [7, 3, 4] (or [3, 4, 7] after sorting)
```

**Time:** O(n log k) - n insertions/comparisons, log k heap operations
**Space:** O(k) - heap of size k

✅ **BEST FOR STREAMING DATA OR LARGE n, SMALL k**

---

### Approach 3: Quickselect (Selection Algorithm)

**Strategy:** Partition array to find kth smallest, return all smaller

```javascript
function smallestK(array, k) {
  if (k <= 0 || k > array.length) return [];

  // Find kth smallest element
  const kthSmallest = quickselect(array, 0, array.length - 1, k - 1);

  // Collect all elements <= kth smallest
  const result = [];
  for (const num of array) {
    if (result.length < k) {
      result.push(num);
    }
  }

  return result;
}

function quickselect(array, left, right, k) {
  if (left === right) return array[left];

  const pivotIndex = partition(array, left, right);

  if (k === pivotIndex) {
    return array[k];
  } else if (k < pivotIndex) {
    return quickselect(array, left, pivotIndex - 1, k);
  } else {
    return quickselect(array, pivotIndex + 1, right, k);
  }
}

function partition(array, left, right) {
  const pivot = array[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (array[j] < pivot) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }

  [array[i], array[right]] = [array[right], array[i]];
  return i;
}
```

**Time:** O(n) average, O(n²) worst case
**Space:** O(log n) for recursion

✅ **OPTIMAL AVERAGE CASE, IN-PLACE**

---

### Approach 4: Min Heap - Extract K Times

**Strategy:** Heapify array, extract minimum k times

```javascript
function smallestK(array, k) {
  if (k <= 0 || k > array.length) return [];

  // Build min heap
  const minHeap = buildMinHeap(array);
  const result = [];

  // Extract k smallest
  for (let i = 0; i < k; i++) {
    result.push(extractMin(minHeap));
  }

  return result;
}

function buildMinHeap(array) {
  const heap = [...array];

  // Start from last parent
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    heapifyDown(heap, i);
  }

  return heap;
}

function extractMin(heap) {
  if (heap.length === 0) return null;
  if (heap.length === 1) return heap.pop();

  const min = heap[0];
  heap[0] = heap.pop();
  heapifyDown(heap, 0);
  return min;
}

function heapifyDown(heap, index) {
  const length = heap.length;

  while (true) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < length && heap[leftChild] < heap[smallest]) {
      smallest = leftChild;
    }

    if (rightChild < length && heap[rightChild] < heap[smallest]) {
      smallest = rightChild;
    }

    if (smallest === index) break;

    [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
    index = smallest;
  }
}
```

**Time:** O(n + k log n) - O(n) heapify, O(k log n) extractions
**Space:** O(n) for heap copy

**Good when:** k is very small

---

## Complexity Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Sorting | O(n log n) | O(1)-O(n) | Simple | Overkill |
| Max Heap (size k) | O(n log k) | O(k) | Space efficient | Complex |
| Quickselect | O(n) avg | O(log n) | **Fastest avg** | Worst case O(n²) |
| Min Heap | O(n + k log n) | O(n) | Good for small k | Space |

**When to use what:**

- **k is very small (k << n):** Max Heap or Min Heap
- **k is close to n:** Sorting
- **k is moderate:** Quickselect
- **Streaming/online data:** Max Heap
- **Simplicity matters:** Sorting

---

## Edge Cases

```javascript
smallestK([], 3) → []  // Empty array

smallestK([5, 3, 1], 0) → []  // k = 0

smallestK([5, 3, 1], 5) → []  // k > length (or return all)

smallestK([1], 1) → [1]  // Single element

smallestK([1, 1, 1], 2) → [1, 1]  // Duplicates

smallestK([5, 4, 3, 2, 1], 3) → [1, 2, 3]  // Sorted descending

smallestK([1, 2, 3, 4, 5], 3) → [1, 2, 3]  // Already sorted
```

---

## Common Mistakes

### 1. Returning sorted result when not needed

```javascript
// ❌ WRONG - over-sorting
return array.sort((a, b) => a - b).slice(0, k);

// ✅ CORRECT - if order doesn't matter
// Just return k smallest, no need to sort
```

### 2. Using min heap instead of max heap

```javascript
// ❌ WRONG - min heap of size k doesn't work
// We need to remove largest from k elements

// ✅ CORRECT - max heap
// Keep k smallest, remove largest when needed
```

### 3. Off-by-one in quickselect

```javascript
// ❌ WRONG
quickselect(array, 0, n - 1, k);  // k is 1-indexed!

// ✅ CORRECT
quickselect(array, 0, n - 1, k - 1);  // Convert to 0-indexed
```

---

## Detailed Example

```
Array: [3, 7, 10, 4, 20, 15], k = 3

Approach 1 - Sorting:
  Sort: [3, 4, 7, 10, 15, 20]
  Take first 3: [3, 4, 7]
  Time: O(6 log 6) = O(15.5)

Approach 2 - Max Heap:
  Process 3: heap = [3]
  Process 7: heap = [7, 3]
  Process 10: heap = [10, 3, 7]
  Process 4: 4 < 10, remove 10, add 4
              heap = [7, 3, 4]
  Process 20: 20 > 7, skip
  Process 15: 15 > 7, skip
  Result: [7, 3, 4]
  Time: O(6 log 3) ≈ O(9.5)

Approach 3 - Quickselect:
  Find 3rd smallest (index 2)
  Partition around pivot...
  Eventually identifies [3, 4, 7]
  Time: O(6) average
```

---

## Interview Tips

1. **Ask clarifying questions:**
   - Does result need to be sorted?
   - Is array read-only?
   - Can we modify input?
   - Is data streaming?

2. **Discuss trade-offs:**
   - "For small k, max heap is best"
   - "For average case, quickselect is fastest"
   - "For simplicity, sorting works fine"

3. **Start simple:** "I'll start with sorting, then optimize"

4. **Explain heap choice:** "Max heap of size k, not min heap of all elements"

5. **Draw heap operations:**
   ```
   Max Heap (k=3):
   [10, 7, 4]
   New element 3 < 10 → remove 10, add 3
   ```

6. **Mention real-world:** "This is used in top-k queries, recommendations"

---

## Key Takeaways

1. **Multiple valid approaches** with different trade-offs

2. **Max heap of size k** is NOT min heap of all elements

3. **Quickselect** is average O(n) but has bad worst case

4. **Sorting** is overkill but acceptable for small inputs

5. Choose based on:
   - Size of k relative to n
   - Whether data is streaming
   - Space constraints
   - Whether output needs to be sorted

6. This pattern appears in: top K frequent, kth largest element, median finding

---

**Time Complexity:** O(n) to O(n log n) depending on approach
**Space Complexity:** O(1) to O(n) depending on approach
**Difficulty:** Medium-Hard (due to multiple approaches)
