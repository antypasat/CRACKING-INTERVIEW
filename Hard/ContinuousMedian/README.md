# 17.20 Continuous Median

## Original Problem

**Continuous Median:** Numbers are randomly generated and passed to a method. Write a program to find and maintain the median value as new values are generated.

```
Example:
addNumber(1)   → median = 1
addNumber(2)   → median = 1.5
addNumber(3)   → median = 2
addNumber(4)   → median = 2.5
addNumber(5)   → median = 3
```

Hints: #519, #546, #575, #709

---

## Understanding the Problem

We need to:
1. **Add numbers** in stream fashion
2. **Get median** efficiently at any time

Median definition:
- **Odd count:** Middle element
- **Even count:** Average of two middle elements

```
Stream: [1, 3, 5]
Sorted: [1, 3, 5]
Median: 3 (middle element)

Stream: [1, 3, 5, 7]
Sorted: [1, 3, 5, 7]
Median: (3 + 5) / 2 = 4
```

### Key Insight

Use **two heaps**:
- **Max heap** for smaller half of numbers
- **Min heap** for larger half of numbers

The tops of heaps give us the middle elements!

---

## Solution Approaches

### Approach 1: Maintain Sorted Array

**Strategy:** Insert in sorted position, get median from middle

```javascript
class MedianFinder {
  constructor() {
    this.numbers = [];
  }

  addNumber(num) {
    // Binary search for insertion position
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
    const n = this.numbers.length;
    if (n === 0) return null;

    if (n % 2 === 0) {
      return (this.numbers[n / 2 - 1] + this.numbers[n / 2]) / 2;
    } else {
      return this.numbers[Math.floor(n / 2)];
    }
  }
}
```

**Time:**
- addNumber: O(n) - insertion requires shifting
- getMedian: O(1)

**Space:** O(n)

---

### Approach 2: Two Heaps (Optimal)

**Strategy:** Max heap for lower half, min heap for upper half

```javascript
class MedianFinder {
  constructor() {
    this.maxHeap = new MaxHeap();  // Lower half
    this.minHeap = new MinHeap();  // Upper half
  }

  addNumber(num) {
    // Add to max heap (lower half) by default
    if (this.maxHeap.size() === 0 || num <= this.maxHeap.peek()) {
      this.maxHeap.insert(num);
    } else {
      this.minHeap.insert(num);
    }

    // Balance heaps
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.insert(this.maxHeap.extractMax());
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      this.maxHeap.insert(this.minHeap.extractMin());
    }
  }

  getMedian() {
    if (this.maxHeap.size() === 0 && this.minHeap.size() === 0) {
      return null;
    }

    if (this.maxHeap.size() === this.minHeap.size()) {
      return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    } else {
      return this.maxHeap.peek();
    }
  }
}

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
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index] <= this.heap[parent]) break;

      [this.heap[index], this.heap[parent]] =
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let largest = index;

      if (left < this.heap.length &&
          this.heap[left] > this.heap[largest]) {
        largest = left;
      }

      if (right < this.heap.length &&
          this.heap[right] > this.heap[largest]) {
        largest = right;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] =
        [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
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

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index] >= this.heap[parent]) break;

      [this.heap[index], this.heap[parent]] =
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < this.heap.length &&
          this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }

      if (right < this.heap.length &&
          this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] =
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

**Time:**
- addNumber: O(log n) - heap insertion
- getMedian: O(1) - just peek

**Space:** O(n)

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Two Heaps Visualization

```
Numbers added: 1, 3, 5, 2, 4

After adding 1:
  maxHeap: [1]
  minHeap: []
  Median: 1

After adding 3:
  maxHeap: [1]
  minHeap: [3]
  Median: (1 + 3) / 2 = 2

After adding 5:
  maxHeap: [1]
  minHeap: [3, 5]
  Rebalance: move 3 to maxHeap
  maxHeap: [3, 1]
  minHeap: [5]
  Median: 3

After adding 2:
  maxHeap: [3, 1, 2]
  minHeap: [5]
  Rebalance: move 3 to minHeap
  maxHeap: [2, 1]
  minHeap: [3, 5]
  Median: (2 + 3) / 2 = 2.5

After adding 4:
  maxHeap: [2, 1]
  minHeap: [3, 5, 4]
  Rebalance: move 3 to maxHeap
  maxHeap: [3, 2, 1]
  minHeap: [4, 5]
  Median: 3
```

### Heap Balance Rules

```
Invariants:
1. maxHeap.size() = minHeap.size() OR
   maxHeap.size() = minHeap.size() + 1

2. All elements in maxHeap <= all elements in minHeap

Balance strategy:
- If maxHeap has > minHeap.size() + 1 elements:
  Move max from maxHeap to minHeap

- If minHeap has > maxHeap.size() elements:
  Move min from minHeap to maxHeap
```

---

## Complexity Analysis

| Approach | Add | Get Median | Space | Notes |
|----------|-----|------------|-------|-------|
| Sorted Array | O(n) | O(1) | O(n) | Insertion expensive |
| Two Heaps | O(log n) | **O(1)** | O(n) | **Optimal** ✅ |

---

## Edge Cases

```javascript
// No numbers
getMedian() → null

// Single number
addNumber(5)
getMedian() → 5

// Two numbers
addNumber(1), addNumber(2)
getMedian() → 1.5

// All same numbers
addNumber(5), addNumber(5), addNumber(5)
getMedian() → 5

// Negative numbers
addNumber(-1), addNumber(-2), addNumber(3)
getMedian() → -1

// Large difference in values
addNumber(1), addNumber(1000000)
getMedian() → 500000.5
```

---

## Common Mistakes

### 1. Wrong heap balance

```javascript
// ❌ WRONG - allowing size difference > 1
if (maxHeap.size() > minHeap.size()) {
  // This allows difference of 2, 3, etc.
}

// ✅ CORRECT
if (maxHeap.size() > minHeap.size() + 1) {
  minHeap.insert(maxHeap.extractMax());
}
```

### 2. Wrong median calculation

```javascript
// ❌ WRONG - always averaging
return (maxHeap.peek() + minHeap.peek()) / 2;

// ✅ CORRECT - check sizes
if (maxHeap.size() === minHeap.size()) {
  return (maxHeap.peek() + minHeap.peek()) / 2;
} else {
  return maxHeap.peek();  // maxHeap has one more
}
```

### 3. Wrong insertion logic

```javascript
// ❌ WRONG - always adding to maxHeap
maxHeap.insert(num);
// Then rebalance

// ✅ CORRECT - add to appropriate heap
if (maxHeap.size() === 0 || num <= maxHeap.peek()) {
  maxHeap.insert(num);
} else {
  minHeap.insert(num);
}
```

---

## Variations

### 1. Get kth percentile

```javascript
class PercentileFinder extends MedianFinder {
  getPercentile(k) {
    // k = 0 to 100
    const totalSize = this.maxHeap.size() + this.minHeap.size();
    const index = Math.floor(totalSize * k / 100);

    // Use selection algorithm or maintain sorted array
  }
}
```

### 2. Sliding window median

```javascript
// Median of last k numbers (not all numbers)
class SlidingMedian {
  constructor(k) {
    this.k = k;
    this.window = [];
    this.finder = new MedianFinder();
  }

  addNumber(num) {
    this.window.push(num);
    this.finder.addNumber(num);

    if (this.window.length > this.k) {
      const removed = this.window.shift();
      this.finder.remove(removed);  // Need to implement remove
    }

    return this.finder.getMedian();
  }
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is the classic median from data stream problem"

2. **Explain two heaps:**
   - "Max heap stores smaller half"
   - "Min heap stores larger half"
   - "Tops of heaps are middle elements"

3. **Draw it:**
   ```
   Smaller half    Larger half
   [5, 3, 1]       [7, 9, 11]
    max heap        min heap
       ↓               ↓
       5               7

   Median = (5 + 7) / 2 = 6
   ```

4. **Discuss balance:**
   - "Keep sizes equal or maxHeap has one more"
   - "This ensures median is always accessible in O(1)"

5. **Mention optimization:** "Heaps give O(log n) insertion vs O(n) for sorted array"

6. **Code structure:** Implement heap classes first, then MedianFinder

---

## Key Takeaways

1. **Two heaps** technique is the optimal solution

2. **Max heap** for lower half, **min heap** for upper half

3. Maintain balance: sizes differ by at most 1

4. **O(log n) insertion**, **O(1) median** - much better than O(n) insertion

5. This pattern appears in:
   - Find median from data stream
   - Sliding window median
   - Percentile calculations

6. Can extend to find any percentile with modifications

---

**Time Complexity:**
- addNumber: O(log n)
- getMedian: O(1)

**Space Complexity:** O(n)

**Difficulty:** Hard
