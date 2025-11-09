# 17.3 Random Set

## Original Problem

**Random Set:** Write a method to randomly generate a set of m integers from an array of size n. Each element must have equal probability of being chosen.

Hints: #494, #596

---

## Understanding the Problem

Given an array of n elements, we need to select m random elements where:
- Each element has **equal probability** of being selected
- We want exactly **m distinct** elements
- The selection should be **uniform** - all possible combinations of m elements are equally likely

### Example

```
Array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  (n = 10)
Select m = 3 elements

Possible outputs (each equally likely):
  [1, 2, 3]
  [1, 2, 4]
  [3, 7, 9]
  [5, 8, 10]
  ... (C(10,3) = 120 total combinations)
```

**Total combinations:** C(n, m) = n! / (m! × (n-m)!)

For perfect uniformity, each combination should have probability **1/C(n,m)**

---

## Solution Approaches

### Approach 1: Fisher-Yates Partial Shuffle ⭐

**Strategy:** Use Fisher-Yates shuffle but only shuffle first m positions

This is the **optimal** solution!

```javascript
function randomSet(array, m) {
  const arr = [...array];
  const n = arr.length;
  m = Math.min(m, n); // Can't select more than available

  // Shuffle only first m positions
  for (let i = 0; i < m; i++) {
    // Pick random from position i to end
    const j = i + Math.floor(Math.random() * (n - i));
    // Swap
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Return first m elements
  return arr.slice(0, m);
}
```

**Why this works:**
- Same principle as Fisher-Yates shuffle
- Each of the first m positions picks uniformly from remaining elements
- Probability any specific element is in position i: 1/n, then (n-1)/(n-1), etc.
- Results in uniform distribution over all C(n,m) combinations

**Time:** O(m)
**Space:** O(n) for copy, or O(1) if modifying in-place

---

### Approach 2: Rejection Sampling

**Strategy:** Keep picking random indices until we have m distinct elements

```javascript
function randomSetRejection(array, m) {
  const n = array.length;
  const selected = new Set();
  const result = [];

  while (result.length < m) {
    const randomIndex = Math.floor(Math.random() * n);

    if (!selected.has(randomIndex)) {
      selected.add(randomIndex);
      result.push(array[randomIndex]);
    }
  }

  return result;
}
```

**Pros:**
- Simple to understand
- No array modification needed

**Cons:**
- Expected time: O(m × n/(n-m))
- Gets very slow as m approaches n
- Worst case: O(∞) theoretically (though practically unlikely)

---

### Approach 3: Create Pool and Pick

**Strategy:** Create array of indices, shuffle it, take first m

```javascript
function randomSetPool(array, m) {
  const n = array.length;
  const indices = Array.from({length: n}, (_, i) => i);

  // Full Fisher-Yates shuffle
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (n - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Take first m indices
  return indices.slice(0, m).map(i => array[i]);
}
```

**Pros:**
- Correct uniform distribution
- No rejection needed

**Cons:**
- O(n) time even though we only need m elements
- Wasteful when m << n

---

## Comparison

| Approach | Time | Space | Best When | Notes |
|----------|------|-------|-----------|-------|
| **Partial Shuffle** | **O(m)** | **O(n)** | **Always** | **OPTIMAL** |
| Rejection Sampling | O(m × n/(n-m)) | O(m) | m very small | Slow when m ≈ n |
| Full Shuffle | O(n) | O(n) | Never | Wasteful |

**Winner:** Partial Fisher-Yates shuffle (Approach 1)

---

## Detailed Example

```
Array: [10, 20, 30, 40, 50, 60, 70]  (n=7)
Select m=3

Step 0: Pick from positions 0-6
  Random: j=4 (element 50)
  Swap: [50, 20, 30, 40, 10, 60, 70]
         ^^                ^^

Step 1: Pick from positions 1-6
  Random: j=6 (element 70)
  Swap: [50, 70, 30, 40, 10, 60, 20]
             ^^                  ^^

Step 2: Pick from positions 2-6
  Random: j=3 (element 40)
  Swap: [50, 70, 40, 30, 10, 60, 20]
                 ^^  ^^

Result: [50, 70, 40]  ← First 3 elements
```

---

## Probability Analysis

For partial shuffle to select specific set {a, b, c} from array of size n:

**Position 0 gets element a:**
- Probability: 1/n

**Position 1 gets element b (given a already selected):**
- Probability: 1/(n-1)

**Position 2 gets element c (given a, b selected):**
- Probability: 1/(n-2)

**Total probability for specific ordered selection:**
- P = (1/n) × (1/(n-1)) × (1/(n-2)) = 1/(n×(n-1)×(n-2))

**Number of orderings of {a,b,c}:** 3! = 6

**Probability for specific unordered set:**
- P = 6 × 1/(n×(n-1)×(n-2))
- For n=7, m=3: P = 6/(7×6×5) = 6/210 = 1/35
- C(7,3) = 35 ✓

**Each combination has probability 1/C(n,m)** ✓ Perfect uniformity!

---

## Edge Cases

```javascript
randomSet([], 3)           → []
randomSet([1,2,3], 0)      → []
randomSet([1,2,3], 5)      → [1,2,3] (return all, m > n)
randomSet([1], 1)          → [1]
randomSet([1,2,3,4,5], 5)  → all elements in random order
```

---

## Implementation Variations

### In-Place Modification

```javascript
function randomSetInPlace(array, m) {
  const n = array.length;
  m = Math.min(m, n);

  for (let i = 0; i < m; i++) {
    const j = i + Math.floor(Math.random() * (n - i));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array.slice(0, m);
}
```

### Return Indices Instead of Values

```javascript
function randomSetIndices(n, m) {
  const indices = Array.from({length: n}, (_, i) => i);
  m = Math.min(m, n);

  for (let i = 0; i < m; i++) {
    const j = i + Math.floor(Math.random() * (n - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, m);
}
```

---

## Related Problems

1. **Reservoir Sampling:** Select k elements from stream of unknown size
2. **Weighted Random Selection:** Elements have different probabilities
3. **Random Permutation:** Special case where m = n
4. **Lottery Selection:** Pick m winners from n participants

---

## Interview Tips

1. **Clarify requirements:**
   - Should result preserve original array?
   - Are elements unique in input?
   - Order of output matter?

2. **Start with simple approach:** Rejection sampling is easy to explain

3. **Optimize to partial shuffle:** Show you understand Fisher-Yates

4. **Discuss complexity:** Explain why partial shuffle is O(m) not O(n)

5. **Mention edge cases:** m=0, m>n, empty array

6. **Prove uniformity:** Brief probability argument if time allows

---

## Key Takeaways

1. **Partial Fisher-Yates shuffle** is optimal: O(m) time
2. **Rejection sampling** works but slow when m ≈ n
3. **Don't shuffle entire array** when m << n
4. Each of C(n,m) combinations has **equal probability**
5. Can be done **in-place** to save space
6. Related to **reservoir sampling** for streams

---

**Time Complexity:** O(m)
**Space Complexity:** O(n) for copy, O(1) in-place
**Difficulty:** Medium
