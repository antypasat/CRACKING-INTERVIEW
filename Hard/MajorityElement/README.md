# 17.10 Majority Element

## Original Problem

**Majority Element:** A majority element is an element that makes up more than half of the items in an array. Given a positive integers array, find the majority element. If there is no majority element, return -1. Do this in O(n) time and O(1) space.

```
Example:
Input: [1, 2, 5, 9, 5, 9, 5, 5, 5]
Output: 5

Input: [1, 2, 3]
Output: -1 (no majority element)
```

Hints: #522, #566, #604, #620, #650

---

## Understanding the Problem

A **majority element** appears **more than n/2 times** in an array of length n.

```
Examples:

[1, 1, 1, 2, 3]  → 1 appears 3 times > 5/2 = 2.5 ✓

[1, 2, 1, 2, 1]  → 1 appears 3 times > 5/2 = 2.5 ✓

[1, 2, 3, 4, 5]  → No element > 5/2 times ✗

[1, 1, 2, 2]     → Both appear 2 times = 4/2, not > ✗
```

### Key Insight

The **Boyer-Moore Voting Algorithm** works because:
- If an element appears more than n/2 times, it will "survive" all cancellations
- Pair each majority element with a different element - majority still has leftovers

---

## Solution Approaches

### Approach 1: Hash Map Counting

**Strategy:** Count frequencies and check if any > n/2

```javascript
function majorityElement(nums) {
  const counts = new Map();
  const majority = Math.floor(nums.length / 2);

  for (const num of nums) {
    counts.set(num, (counts.get(num) || 0) + 1);

    if (counts.get(num) > majority) {
      return num;
    }
  }

  return -1;
}
```

**Time:** O(n)
**Space:** O(n) - does not meet space requirement!

---

### Approach 2: Sorting

**Strategy:** If majority exists, it must be at position n/2 after sorting

```javascript
function majorityElement(nums) {
  nums.sort((a, b) => a - b);

  const candidate = nums[Math.floor(nums.length / 2)];

  // Verify it's actually majority
  let count = 0;
  for (const num of nums) {
    if (num === candidate) count++;
  }

  return count > Math.floor(nums.length / 2) ? candidate : -1;
}
```

**Time:** O(n log n) - does not meet time requirement!
**Space:** O(1) if in-place sort

---

### Approach 3: Boyer-Moore Voting Algorithm (Optimal)

**Strategy:** Find candidate, then verify

```javascript
function majorityElement(nums) {
  // Phase 1: Find candidate
  let candidate = null;
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      count++;
    } else {
      count--;
    }
  }

  // Phase 2: Verify candidate
  count = 0;
  for (const num of nums) {
    if (num === candidate) count++;
  }

  return count > Math.floor(nums.length / 2) ? candidate : -1;
}
```

**Time:** O(n) - two passes
**Space:** O(1) - only two variables

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### How Boyer-Moore Works

Think of it as a **voting/cancellation** process:

```
Array: [5, 5, 1, 5, 2, 5, 5]

Step-by-step:

i=0, num=5:
  count=0 → set candidate=5, count=1
  candidate=5, count=1

i=1, num=5:
  5 === candidate → count++
  candidate=5, count=2

i=2, num=1:
  1 !== candidate → count--
  candidate=5, count=1

i=3, num=5:
  5 === candidate → count++
  candidate=5, count=2

i=4, num=2:
  2 !== candidate → count--
  candidate=5, count=1

i=5, num=5:
  5 === candidate → count++
  candidate=5, count=2

i=6, num=5:
  5 === candidate → count++
  candidate=5, count=3

Candidate: 5

Verification:
  Count 5's: 5 appears 5 times
  5 > 7/2 = 3.5 ✓
  Return 5
```

### Why It Works

**Key Insight:** If a majority element exists, it will survive the cancellation.

```
Imagine pairing each majority with non-majority:

[M, M, M, M, M, X, Y]  (M appears 5 times)

Pair and cancel:
  M vs X → cancel
  M vs Y → cancel

Remaining: M, M, M

The majority always has leftovers!
```

### When There's No Majority

```
Array: [1, 2, 3, 4, 5]

After phase 1:
  candidate might be 5 (or any element)

Phase 2 verification:
  Count of 5 = 1
  1 > 5/2? No
  Return -1 ✓
```

---

## Complexity Analysis

| Approach | Time | Space | Meets Requirements? |
|----------|------|-------|-------------------|
| Hash Map | O(n) | O(n) | ❌ Space |
| Sorting | O(n log n) | O(1) | ❌ Time |
| Boyer-Moore | O(n) | O(1) | ✅ Both |

---

## Edge Cases

```javascript
// Empty array
majorityElement([]) → -1

// Single element (always majority)
majorityElement([5]) → 5

// Two elements same
majorityElement([1, 1]) → 1

// Two elements different (no majority)
majorityElement([1, 2]) → -1

// All same
majorityElement([7, 7, 7, 7]) → 7

// Exactly half (not majority)
majorityElement([1, 1, 2, 2]) → -1

// Just over half
majorityElement([1, 1, 1, 2, 2]) → 1
```

---

## Common Mistakes

### 1. Forgetting verification phase

```javascript
// ❌ WRONG - returns candidate without verifying
function majorityElement(nums) {
  let candidate = null, count = 0;

  for (const num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }

  return candidate;  // Might not be majority!
}

// ✅ CORRECT - verify after finding candidate
```

### 2. Wrong majority threshold

```javascript
// ❌ WRONG - using >= instead of >
return count >= Math.floor(nums.length / 2) ? candidate : -1;

// ✅ CORRECT - must be strictly greater than half
return count > Math.floor(nums.length / 2) ? candidate : -1;
```

### 3. Not handling empty array

```javascript
// ❌ WRONG - doesn't handle empty
if (count === 0) candidate = num;

// ✅ CORRECT - check array first
if (nums.length === 0) return -1;
```

---

## Visualization

### Example: [1, 2, 1, 2, 1, 2, 1]

```
i  num  count  candidate  Visualization
0  1    1      1          [1]
1  2    0      1          [1,2] cancelled
2  1    1      1          [1]
3  2    0      1          [1,2] cancelled
4  1    1      1          [1]
5  2    0      1          [1,2] cancelled
6  1    1      1          [1] ← survives!

Candidate: 1
Verify: 1 appears 4 times, 4 > 7/2 ✓
```

### Example: [1, 2, 3, 4, 5]

```
i  num  count  candidate
0  1    1      1
1  2    0      1
2  3    1      3
3  4    0      3
4  5    1      5

Candidate: 5
Verify: 5 appears 1 time, 1 > 5/2? ✗
Return -1
```

---

## Variations

### 1. Return count along with element

```javascript
function majorityElementWithCount(nums) {
  let candidate = null, count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      count++;
    } else {
      count--;
    }
  }

  count = 0;
  for (const num of nums) {
    if (num === candidate) count++;
  }

  return count > Math.floor(nums.length / 2)
    ? { element: candidate, count }
    : { element: -1, count: 0 };
}
```

### 2. Find elements appearing > n/3 times

**Moore's Voting Algorithm Extended:**

```javascript
function majorityElementII(nums) {
  // At most 2 elements can appear > n/3 times
  let candidate1 = null, candidate2 = null;
  let count1 = 0, count2 = 0;

  // Find candidates
  for (const num of nums) {
    if (num === candidate1) {
      count1++;
    } else if (num === candidate2) {
      count2++;
    } else if (count1 === 0) {
      candidate1 = num;
      count1 = 1;
    } else if (count2 === 0) {
      candidate2 = num;
      count2 = 1;
    } else {
      count1--;
      count2--;
    }
  }

  // Verify both candidates
  const result = [];
  count1 = count2 = 0;

  for (const num of nums) {
    if (num === candidate1) count1++;
    else if (num === candidate2) count2++;
  }

  const threshold = Math.floor(nums.length / 3);
  if (count1 > threshold) result.push(candidate1);
  if (count2 > threshold) result.push(candidate2);

  return result;
}
```

---

## Interview Tips

1. **Start with constraints:** "O(n) time and O(1) space rules out hash map and sorting"

2. **Explain the insight:** "The majority element will survive all cancellations"

3. **Walk through example:** Show how count increases/decreases

4. **Emphasize verification:** "We must verify the candidate actually appears > n/2 times"

5. **Draw the cancellation:**
   ```
   [M, M, M, M, X, Y]
    ↑     ↑   ↑  ↑
    └─────┘   └──┘  Cancel
    M, M ← Survive
   ```

6. **Mention variations:** n/3, n/k problems show depth

---

## Key Takeaways

1. **Boyer-Moore** is the classic O(n) time, O(1) space solution

2. **Two phases:** Find candidate, then verify

3. Think of it as **voting and cancellation**

4. Majority must be **strictly greater** than n/2

5. Verification is **required** - candidate might not be majority

6. Extends to finding elements appearing > n/k times

7. One of the most elegant algorithms for this specific constraint

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Hard (due to space constraint)
