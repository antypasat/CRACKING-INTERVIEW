# 17.18 Shortest Supersequence

## Original Problem

**Shortest Supersequence:** You are given two arrays, one shorter (with all distinct elements) and one longer. Find the shortest subarray in the longer array that contains all the elements in the shorter array. The items can appear in any order.

```
Example:
Shorter: [1, 5, 9]
Longer:  [7, 5, 9, 0, 2, 1, 3, 5, 7, 9, 1, 1, 5, 8, 8, 9, 7]
         indices: 0  1  2  3  4  5  6  7  8  9 10 11 12...

Output: [7, 10] (subarray from index 7 to 10)
         [5, 7, 9, 1] contains all elements from shorter array
```

Hints: #645, #652, #669, #681, #691, #725, #731, #741

---

## Understanding the Problem

Find the **minimum window** in the longer array that contains all elements from the shorter array.

```
Shorter: [1, 2, 3]
Longer:  [4, 1, 5, 2, 6, 3, 7]

Windows containing all:
  [4, 1, 5, 2, 6, 3] - length 6
  [1, 5, 2, 6, 3] - length 5 ✓ shortest

Return: [1, 5] (indices)
```

### Key Insight

This is the **Sliding Window with HashMap** pattern:
1. Expand window until all elements found
2. Contract window while all elements still present
3. Track minimum window

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Check every possible subarray

```javascript
function shortestSupersequence(shorter, longer) {
  const targetSet = new Set(shorter);
  let minLength = Infinity;
  let minStart = -1;
  let minEnd = -1;

  for (let start = 0; start < longer.length; start++) {
    const found = new Set();

    for (let end = start; end < longer.length; end++) {
      if (targetSet.has(longer[end])) {
        found.add(longer[end]);
      }

      if (found.size === targetSet.size) {
        const length = end - start + 1;
        if (length < minLength) {
          minLength = length;
          minStart = start;
          minEnd = end;
        }
        break;  // Found all, no need to extend further from this start
      }
    }
  }

  return minStart === -1 ? null : [minStart, minEnd];
}
```

**Time:** O(n²) where n = longer.length
**Space:** O(s) where s = shorter.length

---

### Approach 2: Sliding Window with HashMap (Optimal)

**Strategy:** Use two pointers and hash map to track counts

```javascript
function shortestSupersequence(shorter, longer) {
  const targetCounts = new Map();
  for (const num of shorter) {
    targetCounts.set(num, (targetCounts.get(num) || 0) + 1);
  }

  let left = 0;
  let minLength = Infinity;
  let minStart = -1;
  let minEnd = -1;
  let found = 0;  // Count of required elements found

  const windowCounts = new Map();

  for (let right = 0; right < longer.length; right++) {
    const rightNum = longer[right];

    // Expand window
    if (targetCounts.has(rightNum)) {
      windowCounts.set(rightNum, (windowCounts.get(rightNum) || 0) + 1);

      // Only count if we just reached the required count for this element
      if (windowCounts.get(rightNum) === 1) {
        found++;
      }
    }

    // Contract window while all elements are present
    while (found === targetCounts.size) {
      // Update minimum window
      const length = right - left + 1;
      if (length < minLength) {
        minLength = length;
        minStart = left;
        minEnd = right;
      }

      // Try to shrink from left
      const leftNum = longer[left];
      if (targetCounts.has(leftNum)) {
        windowCounts.set(leftNum, windowCounts.get(leftNum) - 1);

        if (windowCounts.get(leftNum) === 0) {
          found--;
        }
      }

      left++;
    }
  }

  return minStart === -1 ? null : [minStart, minEnd];
}
```

**Time:** O(n + s) where n = longer.length, s = shorter.length
**Space:** O(s) for hash maps

✅ **OPTIMAL SOLUTION**

---

### Approach 3: Track Last Positions

**Strategy:** Track last seen position of each target element

```javascript
function shortestSupersequence(shorter, longer) {
  const targets = new Set(shorter);
  const positions = new Map();  // element → last position
  let minLength = Infinity;
  let minStart = -1;
  let minEnd = -1;

  for (let i = 0; i < longer.length; i++) {
    const num = longer[i];

    if (targets.has(num)) {
      positions.set(num, i);

      // If we've seen all target elements
      if (positions.size === targets.size) {
        // Find earliest and latest positions
        let minPos = Infinity;
        let maxPos = -Infinity;

        for (const pos of positions.values()) {
          minPos = Math.min(minPos, pos);
          maxPos = Math.max(maxPos, pos);
        }

        const length = maxPos - minPos + 1;
        if (length < minLength) {
          minLength = length;
          minStart = minPos;
          minEnd = maxPos;
        }
      }
    }
  }

  return minStart === -1 ? null : [minStart, minEnd];
}
```

**Time:** O(n × s) - for each position, iterate through positions map
**Space:** O(s)

---

## Algorithm Explanation

### Sliding Window Example

```
Shorter: [1, 5, 9]
Longer:  [7, 5, 9, 0, 2, 1, 3, 5, 7, 9, 1]
         0  1  2  3  4  5  6  7  8  9  10

Step-by-step:

right=0, num=7: not in targets
right=1, num=5: found=1, window=[5]
right=2, num=9: found=2, window=[5,9]
right=3, num=0: not in targets
right=4, num=2: not in targets
right=5, num=1: found=3 ✓ All found!
  Window: [5,9,0,2,1] (indices 1-5, length 5)

Contract from left=1:
  Remove 5: found=2, stop

right=6, num=3: not in targets
right=7, num=5: found=3 ✓ All found!
  Window: [9,0,2,1,3,5] (indices 2-7, length 6)

Contract from left=2:
  Remove 9: found=2, stop

right=8, num=7: not in targets
right=9, num=9: found=3 ✓ All found!
  Window: [1,3,5,7,9] (indices 5-9, length 5)

Contract from left=5:
  Remove 1: found=2, stop

right=10, num=1: found=3 ✓ All found!
  Window: [5,7,9,1] (indices 7-10, length 4) ← MINIMUM!

Contract from left=7:
  Remove 5: found=2, stop

No more elements. Return [7, 10]
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n²) | O(s) | Check all subarrays |
| Sliding Window | O(n) | O(s) | **Optimal** |
| Track Positions | O(n × s) | O(s) | Simpler but slower |

---

## Edge Cases

```javascript
// Shorter array empty
shortestSupersequence([], [1,2,3]) → null or [0, -1]

// Longer array empty
shortestSupersequence([1], []) → null

// Longer doesn't contain all elements
shortestSupersequence([1,2,3], [1,2,4,5]) → null

// All elements at start
shortestSupersequence([1,2], [1,2,3,4,5]) → [0, 1]

// All elements at end
shortestSupersequence([1,2], [3,4,5,1,2]) → [3, 4]

// Perfect match
shortestSupersequence([1,2,3], [1,2,3]) → [0, 2]

// Duplicates in longer
shortestSupersequence([1,2], [1,1,2,2]) → [0, 2] or [1, 2]
```

---

## Common Mistakes

### 1. Not handling duplicates properly

```javascript
// ❌ WRONG - using Set to track found, doesn't handle duplicates in shorter
const found = new Set();

// ✅ CORRECT - track counts if shorter has duplicates
// Or use distinct count if shorter has all distinct elements
```

### 2. Wrong window contraction condition

```javascript
// ❌ WRONG - contracting before checking minimum
while (found === targetSize) {
  left++;
  // Update found
  // Update minimum ← might miss the actual minimum
}

// ✅ CORRECT - update minimum before contracting
while (found === targetSize) {
  updateMinimum();
  left++;
  // Update found
}
```

### 3. Off-by-one in return value

```javascript
// ❌ WRONG - returning length instead of indices
return [minLength];

// ✅ CORRECT - return start and end indices
return [minStart, minEnd];
```

---

## Variations

### 1. Return the actual subarray

```javascript
function shortestSupersequenceArray(shorter, longer) {
  const [start, end] = shortestSupersequence(shorter, longer);
  return start === -1 ? null : longer.slice(start, end + 1);
}
```

### 2. Find all minimum windows

```javascript
function allShortestSupersequences(shorter, longer) {
  const results = [];
  // Track all windows with minimum length
  // Modify algorithm to collect all instead of just first
}
```

### 3. With duplicates in shorter array

```javascript
// If shorter = [1, 1, 2], we need TWO 1s in the window
// Must track counts: windowCounts.get(1) >= targetCounts.get(1)
```

---

## Interview Tips

1. **Recognize the pattern:** "This is minimum window substring problem"

2. **Explain sliding window:**
   - Right pointer expands to find all elements
   - Left pointer contracts to minimize window
   - Track counts with hash map

3. **Draw the window:**
   ```
   [... | 5  9  0  2  1 | ...]
        ↑              ↑
       left          right
   ```

4. **Discuss optimization:**
   - "Two pointers give us O(n) instead of O(n²)"
   - "Each element visited at most twice"

5. **Handle edge cases:**
   - Empty arrays
   - Elements not present
   - Duplicates

6. **Mention variations:** Minimum window substring (with characters)

---

## Key Takeaways

1. **Sliding window** pattern with two pointers

2. **Hash map** to track required vs found counts

3. **Expand** right to include elements, **contract** left to minimize

4. Update minimum **before** contracting window

5. Time: O(n), Space: O(s) - linear and optimal

6. This pattern appears in:
   - Minimum Window Substring
   - Longest Substring with K Distinct Characters
   - Find All Anagrams

---

**Time Complexity:** O(n + s)
**Space Complexity:** O(s)
**Difficulty:** Hard
