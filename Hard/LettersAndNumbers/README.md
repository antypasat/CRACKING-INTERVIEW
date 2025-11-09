# 17.5 Letters and Numbers

## Original Problem

**Letters and Numbers:** Given an array filled with letters and numbers, find the longest subarray with an equal number of letters and numbers.

Hints: #485, #574, #679

---

## Understanding the Problem

This problem asks us to find the **longest contiguous subarray** where the count of letters equals the count of numbers.

```
Example:
Input:  ['a', '1', 'b', '2', 'c', 'd', '3', '4']
         Letters: a, b, c, d (4)
         Numbers: 1, 2, 3, 4 (4)
Output: The entire array (length 8)

Input:  ['1', '2', 'a', 'b', 'c', '3', '4', '5']
Output: ['a', 'b', 'c', '3', '4', '5'] (length 6)
         3 letters (a,b,c) and 3 numbers (3,4,5)
```

### Key Insight

Transform the problem: Treat letters as **+1** and numbers as **-1**. Finding equal counts becomes finding **subarrays that sum to 0**.

```
['a', '1', 'b', '2', 'c']
[ +1,  -1,  +1,  -1,  +1]

Running sum: [1, 0, 1, 0, 1]
               ↑     ↑
         Same sum → subarray between them sums to 0!
```

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Check every possible subarray

```javascript
function findLongestSubarray(array) {
  let maxLength = 0;
  let maxStart = 0;

  for (let start = 0; start < array.length; start++) {
    let letters = 0, numbers = 0;

    for (let end = start; end < array.length; end++) {
      if (isLetter(array[end])) letters++;
      else numbers++;

      if (letters === numbers) {
        const length = end - start + 1;
        if (length > maxLength) {
          maxLength = length;
          maxStart = start;
        }
      }
    }
  }

  return array.slice(maxStart, maxStart + maxLength);
}

function isLetter(char) {
  return typeof char === 'string' && /[a-zA-Z]/.test(char);
}
```

**Time:** O(n²) - nested loops
**Space:** O(1) - only tracking counts

---

### Approach 2: Running Sum with HashMap (Optimal)

**Strategy:** Use running difference and hash map to find matching positions

```javascript
function findLongestSubarray(array) {
  // Map: running difference → first index where it occurs
  const firstOccurrence = new Map();
  firstOccurrence.set(0, -1); // Before array starts

  let delta = 0;  // letters - numbers
  let maxLength = 0;
  let maxStart = 0;

  for (let i = 0; i < array.length; i++) {
    // Update running difference
    delta += isLetter(array[i]) ? 1 : -1;

    // If we've seen this delta before
    if (firstOccurrence.has(delta)) {
      const firstIndex = firstOccurrence.get(delta);
      const length = i - firstIndex;

      if (length > maxLength) {
        maxLength = length;
        maxStart = firstIndex + 1;
      }
    } else {
      // First time seeing this delta
      firstOccurrence.set(delta, i);
    }
  }

  return array.slice(maxStart, maxStart + maxLength);
}

function isLetter(char) {
  return typeof char === 'string' && /[a-zA-Z]/.test(char);
}
```

**How it works:**

```
Array:  ['a', '1', 'b', 'c', '2', '3', 'd']
Delta:    1    0    1    2    1    0    1
Index:    0    1    2    3    4    5    6

Map after processing:
  Delta 0: first at index -1, seen again at 1 → length = 1-(-1) = 2
  Delta 0: first at index -1, seen again at 5 → length = 5-(-1) = 6 ✓
  Delta 1: first at index 0
  Delta 2: first at index 3

Best: delta=0 from index -1 to 5, giving subarray [0:6] = ['a','1','b','c','2','3']
```

**Time:** O(n) - single pass
**Space:** O(n) - hash map

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Step-by-Step Walkthrough

```
Input: ['a', '1', 'b', '2', 'c', 'd']

Initialize:
  firstOccurrence = {0: -1}
  delta = 0
  maxLength = 0

i=0, char='a' (letter):
  delta = 0 + 1 = 1
  firstOccurrence = {0: -1, 1: 0}

i=1, char='1' (number):
  delta = 1 - 1 = 0
  delta=0 seen before at index -1
  length = 1 - (-1) = 2
  maxLength = 2, maxStart = 0
  Subarray: ['a', '1']

i=2, char='b' (letter):
  delta = 0 + 1 = 1
  delta=1 seen before at index 0
  length = 2 - 0 = 2
  No improvement

i=3, char='2' (number):
  delta = 1 - 1 = 0
  delta=0 seen before at index -1
  length = 3 - (-1) = 4
  maxLength = 4, maxStart = 0
  Subarray: ['a', '1', 'b', '2']

i=4, char='c' (letter):
  delta = 0 + 1 = 1
  delta=1 seen before at index 0
  length = 4 - 0 = 4
  No improvement

i=5, char='d' (letter):
  delta = 1 + 1 = 2
  firstOccurrence = {0: -1, 1: 0, 2: 5}

Result: ['a', '1', 'b', '2'] (length 4)
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n²) | O(1) | Check all subarrays |
| Running Sum + HashMap | O(n) | O(n) | **Optimal** |

---

## Edge Cases

```javascript
// Empty array
findLongestSubarray([]) → []

// All letters
findLongestSubarray(['a', 'b', 'c']) → []

// All numbers
findLongestSubarray(['1', '2', '3']) → []

// Single letter and number
findLongestSubarray(['a', '1']) → ['a', '1']

// No equal subarray
findLongestSubarray(['a', 'b', '1']) → ['a', '1'] or ['b', '1']

// Multiple valid subarrays (return any longest)
findLongestSubarray(['a', '1', 'b', '2']) → ['a', '1', 'b', '2']
```

---

## Common Mistakes

### 1. Not handling the initial state

```javascript
// ❌ WRONG - missing delta=0 at start
const firstOccurrence = new Map();

// ✅ CORRECT - include virtual position before array
const firstOccurrence = new Map();
firstOccurrence.set(0, -1);
```

### 2. Updating first occurrence incorrectly

```javascript
// ❌ WRONG - always updating
firstOccurrence.set(delta, i);  // Overwrites first occurrence!

// ✅ CORRECT - only set if not exists
if (!firstOccurrence.has(delta)) {
  firstOccurrence.set(delta, i);
}
```

### 3. Wrong slice indices

```javascript
// ❌ WRONG
return array.slice(maxStart, maxLength);

// ✅ CORRECT
return array.slice(maxStart, maxStart + maxLength);
```

---

## Related Problems

This pattern appears in many problems:

1. **Longest Subarray with Equal 0s and 1s** - Identical problem
2. **Contiguous Array (LeetCode 525)** - Same concept
3. **Subarray Sum Equals K** - Similar hash map technique
4. **Maximum Size Subarray Sum Equals k** - Extension of concept

---

## Interview Tips

1. **Start with transformation:** "I can treat letters as +1 and numbers as -1"

2. **Draw the running sum:** Visual representation helps explain the logic

3. **Explain the hash map:** "If I see the same delta twice, the subarray between them has equal counts"

4. **Mention brute force first:** Shows you can solve it, then optimize

5. **Discuss trade-offs:** O(n) time vs O(n) space is usually worth it

6. **Handle edge cases:** Ask about empty arrays, all letters, all numbers

---

## Key Takeaways

1. **Problem transformation** is powerful: convert to "sum equals 0" problem

2. **Running sum + HashMap** is a common pattern for subarray problems

3. Store **first occurrence** of each delta to maximize length

4. Initialize map with `{0: -1}` to handle subarrays starting at index 0

5. This technique works for any "equal counts" problem

6. Time complexity improves from O(n²) to O(n) with hash map

---

**Time Complexity:** O(n)
**Space Complexity:** O(n)
**Difficulty:** Hard
