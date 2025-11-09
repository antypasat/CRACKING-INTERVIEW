# 17.9 Kth Multiple

## Original Problem

**Kth Multiple:** Design an algorithm to find the kth number such that the only prime factors are 3, 5, and 7. Note that 3, 5, and 7 do not have to be factors, but it should not have any other prime factors. For example, the first several multiples would be (in order) 1, 3, 5, 7, 9, 15, 21.

Hints: #488, #508, #550, #591, #622, #660, #686

---

## Understanding the Problem

We need to find the kth number that can be expressed as: **3^a × 5^b × 7^c**

Where a, b, c ≥ 0 (can be zero)

```
Sequence:
k=1:  1  = 3^0 × 5^0 × 7^0
k=2:  3  = 3^1 × 5^0 × 7^0
k=3:  5  = 3^0 × 5^1 × 7^0
k=4:  7  = 3^0 × 5^0 × 7^1
k=5:  9  = 3^2 × 5^0 × 7^0
k=6:  15 = 3^1 × 5^1 × 7^0
k=7:  21 = 3^1 × 5^0 × 7^1
k=8:  25 = 3^0 × 5^2 × 7^0
k=9:  27 = 3^3 × 5^0 × 7^0
k=10: 35 = 3^0 × 5^1 × 7^1
```

### Key Insight

Every number in the sequence is formed by **multiplying** a previous number by 3, 5, or 7.

```
Start with 1
  1 × 3 = 3
  1 × 5 = 5
  1 × 7 = 7

From 3:
  3 × 3 = 9
  3 × 5 = 15
  3 × 7 = 21

From 5:
  5 × 3 = 15 (duplicate!)
  5 × 5 = 25
  5 × 7 = 35

We need to generate in sorted order without duplicates!
```

---

## Solution Approaches

### Approach 1: Generate and Sort

**Strategy:** Generate many multiples, sort, and pick kth

```javascript
function getKthMagicNumber(k) {
  const multiples = new Set([1]);
  const factors = [3, 5, 7];

  // Generate enough multiples
  const limit = k * 10;  // Heuristic

  const queue = [1];
  while (queue.length > 0 && multiples.size < limit) {
    const num = queue.shift();

    for (const factor of factors) {
      const next = num * factor;
      if (!multiples.has(next) && next < Number.MAX_SAFE_INTEGER / 10) {
        multiples.add(next);
        queue.push(next);
      }
    }
  }

  // Sort and return kth
  const sorted = Array.from(multiples).sort((a, b) => a - b);
  return sorted[k - 1];
}
```

**Problems:**
- Don't know how many to generate
- Sorting is expensive
- Lots of duplicates

**Time:** O(n log n) where n is numbers generated
**Space:** O(n)

---

### Approach 2: Min Heap

**Strategy:** Use min heap to always get next smallest

```javascript
function getKthMagicNumber(k) {
  const minHeap = new MinHeap();
  const seen = new Set();

  minHeap.insert(1);
  seen.add(1);

  let current = 1;

  for (let i = 0; i < k; i++) {
    current = minHeap.extractMin();

    // Generate next candidates
    for (const factor of [3, 5, 7]) {
      const next = current * factor;
      if (!seen.has(next)) {
        minHeap.insert(next);
        seen.add(next);
      }
    }
  }

  return current;
}
```

**Time:** O(k log k) - k heap operations
**Space:** O(k) - heap + set

---

### Approach 3: Three Queues (Optimal)

**Strategy:** Maintain three queues for multiples of 3, 5, and 7

```javascript
function getKthMagicNumber(k) {
  if (k <= 0) return 0;

  const queue3 = [];
  const queue5 = [];
  const queue7 = [];

  queue3.push(1);
  let result = 1;

  for (let i = 0; i < k; i++) {
    // Find minimum among queue heads
    const min3 = queue3.length > 0 ? queue3[0] : Infinity;
    const min5 = queue5.length > 0 ? queue5[0] : Infinity;
    const min7 = queue7.length > 0 ? queue7[0] : Infinity;

    result = Math.min(min3, min5, min7);

    // Remove from queue(s) - handle duplicates
    if (result === min3) {
      queue3.shift();
      queue3.push(result * 3);  // Add to queue3
      queue5.push(result * 5);  // Add to queue5
      queue7.push(result * 7);  // Add to queue7
    } else if (result === min5) {
      queue5.shift();
      queue5.push(result * 5);  // Add to queue5
      queue7.push(result * 7);  // Add to queue7
    } else {  // result === min7
      queue7.shift();
      queue7.push(result * 7);  // Add to queue7
    }
  }

  return result;
}
```

**How it works:**

```
Initialize: Q3=[1], Q5=[], Q7=[]

i=0: min=1 (from Q3)
  Remove 1 from Q3
  Add 1×3=3 to Q3, 1×5=5 to Q5, 1×7=7 to Q7
  Q3=[3], Q5=[5], Q7=[7]
  result=1

i=1: min=3 (from Q3)
  Remove 3 from Q3
  Add 3×3=9 to Q3, 3×5=15 to Q5, 3×7=21 to Q7
  Q3=[9], Q5=[5,15], Q7=[7,21]
  result=3

i=2: min=5 (from Q5)
  Remove 5 from Q5
  Add 5×5=25 to Q5, 5×7=35 to Q7
  Q3=[9], Q5=[15,25], Q7=[7,21,35]
  result=5

i=3: min=7 (from Q7)
  Remove 7 from Q7
  Add 7×7=49 to Q7
  Q3=[9], Q5=[15,25], Q7=[21,35,49]
  result=7

i=4: min=9 (from Q3)
  result=9

And so on...
```

**Time:** O(k) - k iterations, O(1) per iteration
**Space:** O(k) - queues total size is O(k)

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Why Three Queues Work

The key insight: **Avoid duplicates by controlling where numbers go**

```
Rules:
1. Numbers from Q3 (divisible by 3):
   → Generate ×3, ×5, ×7 (all three queues)

2. Numbers from Q5 (divisible by 5 but not 3):
   → Generate ×5, ×7 (only Q5 and Q7)
   → Skip ×3 because it would be duplicate from Q3

3. Numbers from Q7 (divisible by 7 but not 3 or 5):
   → Generate ×7 (only Q7)
   → Skip ×3 and ×5 because they would be duplicates

This ensures each number appears exactly once!
```

### Detailed Example

```
k=10 (find 10th magic number)

Step  Min  Q3        Q5        Q7        Result
0     1    [1]       []        []        -
1     1    [3]       [5]       [7]       1
2     3    [9]       [5,15]    [7,21]    3
3     5    [9]       [15,25]   [7,21,35] 5
4     7    [9]       [15,25]   [21,35,49] 7
5     9    [27]      [15,25,45] [21,35,49,63] 9
6     15   [27]      [25,45,75] [21,35,49,63,105] 15
7     21   [27]      [25,45,75] [35,49,63,105,147] 21
8     25   [27]      [45,75,125] [35,49,63,105,147,175] 25
9     27   [81]      [45,75,125,135] [35,49,63,105,147,175,189] 27
10    35   [81]      [45,75,125,135] [49,63,105,147,175,189,245] 35

Result: 35
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Generate & Sort | O(n log n) | O(n) | Unknown n |
| Min Heap | O(k log k) | O(k) | Good |
| Three Queues | O(k) | O(k) | **Optimal** |

---

## Edge Cases

```javascript
getKthMagicNumber(1) → 1   // First number

getKthMagicNumber(2) → 3   // 1×3

getKthMagicNumber(3) → 5   // 1×5

getKthMagicNumber(4) → 7   // 1×7

getKthMagicNumber(0) → 0   // Invalid

getKthMagicNumber(-5) → 0  // Invalid

getKthMagicNumber(100) → 5103  // Large k
```

---

## Common Mistakes

### 1. Not handling duplicates

```javascript
// ❌ WRONG - generates duplicates
queue3.push(result * 3);
queue5.push(result * 3);  // Duplicate!

// ✅ CORRECT - controlled generation
if (result === min3) {
  queue3.push(result * 3);
  queue5.push(result * 5);
  queue7.push(result * 7);
}
```

### 2. Wrong queue initialization

```javascript
// ❌ WRONG - all queues have 1
queue3.push(1);
queue5.push(1);
queue7.push(1);

// ✅ CORRECT - only Q3 has 1
queue3.push(1);
```

### 3. Off-by-one in loop

```javascript
// ❌ WRONG - returns (k+1)th number
for (let i = 0; i <= k; i++)

// ✅ CORRECT
for (let i = 0; i < k; i++)
```

---

## Related Problems

This pattern appears in:

1. **Ugly Number II (LeetCode 264)** - Same problem with factors 2, 3, 5
2. **Super Ugly Number (LeetCode 313)** - Generalized to any factors
3. **Hamming Numbers** - Numbers of form 2^a × 3^b × 5^c

---

## Variations

### 1. Different factors

```javascript
function getKthNumber(k, factors) {
  const queues = factors.map(() => []);
  queues[0].push(1);

  let result = 1;

  for (let i = 0; i < k; i++) {
    // Find min across all queues
    const mins = queues.map(q =>
      q.length > 0 ? q[0] : Infinity
    );
    result = Math.min(...mins);

    // Process based on which queue has min
    const minIndex = mins.indexOf(result);

    queues[minIndex].shift();

    for (let j = minIndex; j < factors.length; j++) {
      queues[j].push(result * factors[j]);
    }
  }

  return result;
}
```

### 2. Return all k numbers

```javascript
function getFirstKMagicNumbers(k) {
  const result = [];
  const queue3 = [1];
  const queue5 = [];
  const queue7 = [];

  for (let i = 0; i < k; i++) {
    const min3 = queue3[0] || Infinity;
    const min5 = queue5[0] || Infinity;
    const min7 = queue7[0] || Infinity;
    const current = Math.min(min3, min5, min7);

    result.push(current);

    if (current === min3) {
      queue3.shift();
      queue3.push(current * 3);
      queue5.push(current * 5);
      queue7.push(current * 7);
    } else if (current === min5) {
      queue5.shift();
      queue5.push(current * 5);
      queue7.push(current * 7);
    } else {
      queue7.shift();
      queue7.push(current * 7);
    }
  }

  return result;
}
```

---

## Interview Tips

1. **Start with the insight:** "Each number is a previous number times 3, 5, or 7"

2. **Discuss duplicates:** "15 = 3×5 = 5×3, we need to avoid counting twice"

3. **Explain queue strategy:** "Q3 for ×3, Q5 for ×5, Q7 for ×7"

4. **Draw the generation:**
   ```
   1
   ├─ 3  ─┬─ 9
   │      ├─ 15
   │      └─ 21
   ├─ 5  ─┬─ 25
   │      └─ 35
   └─ 7  ─── 49
   ```

5. **Mention min heap alternative:** Shows breadth of knowledge

6. **Test with small k:** k=1,2,3,4,5 to verify logic

---

## Key Takeaways

1. **Three queues** elegantly avoid duplicates

2. **Controlled generation** based on source queue prevents duplicates

3. Each queue contains numbers divisible by its factor

4. **O(k) time and space** is optimal for this problem

5. Pattern extends to any set of prime factors

6. Similar to merge k sorted lists concept

---

**Time Complexity:** O(k)
**Space Complexity:** O(k)
**Difficulty:** Hard
