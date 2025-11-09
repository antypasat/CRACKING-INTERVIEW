# 17.19 Missing Two

## Original Problem

**Missing Two:** You are given an array with all the numbers from 1 to N appearing exactly once, except for two numbers that are missing. How can you find the missing two numbers in O(n) time and O(1) space?

```
Example:
Input: [1, 3, 5, 6, 7, 8]  (N = 8)
Missing: 2, 4

Input: [1, 2, 3, 5]  (N = 5)
Missing: 4, 5

Wait, that's wrong. Let me reconsider:
If N = 5, array should have 5 elements but missing 2.
So array has 3 elements from [1..5]

Input: [1, 2, 5]  (N = 5, array has 3 elements)
Missing: 3, 4
```

Hints: #503, #590, #609, #626, #649, #672, #689, #696

---

## Understanding the Problem

Given an array of size (N-2) containing N-2 distinct numbers from 1 to N, find the two missing numbers.

```
Example 1:
N = 10
Array: [1, 2, 3, 4, 6, 7, 9, 10]  (size 8)
Missing: 5, 8

Example 2:
N = 5
Array: [1, 3, 5]  (size 3)
Missing: 2, 4
```

### Key Insight

**Multiple approaches:**
1. **Math:** Use sum and sum of squares
2. **XOR:** XOR to separate the two numbers
3. **Modified array:** Use indices to mark presence

---

## Solution Approaches

### Approach 1: Using Sum and Product (Quadratic Equation)

**Strategy:** Use sum and sum of squares to form equations

```javascript
function findMissingTwo(array) {
  const n = array.length + 2;  // Total numbers from 1 to N

  // Calculate expected sum and sum of squares
  const expectedSum = (n * (n + 1)) / 2;
  const expectedSumSq = (n * (n + 1) * (2 * n + 1)) / 6;

  // Calculate actual sum and sum of squares
  let actualSum = 0;
  let actualSumSq = 0;

  for (const num of array) {
    actualSum += num;
    actualSumSq += num * num;
  }

  // Missing numbers: a and b
  // a + b = sumDiff
  // a² + b² = sumSqDiff

  const sumDiff = expectedSum - actualSum;
  const sumSqDiff = expectedSumSq - actualSumSq;

  // a² + b² = sumSqDiff
  // (a + b)² - 2ab = sumSqDiff
  // ab = ((a + b)² - (a² + b²)) / 2

  const product = (sumDiff * sumDiff - sumSqDiff) / 2;

  // Solve quadratic equation: x² - (sumDiff)x + product = 0
  const discriminant = sumDiff * sumDiff - 4 * product;
  const a = (sumDiff + Math.sqrt(discriminant)) / 2;
  const b = sumDiff - a;

  return [Math.round(a), Math.round(b)];
}
```

**Time:** O(n)
**Space:** O(1)

**Issues:** Potential overflow with large numbers, floating point errors

---

### Approach 2: XOR Approach (Optimal)

**Strategy:** Use XOR properties to separate the two numbers

```javascript
function findMissingTwo(array) {
  const n = array.length + 2;

  // Step 1: XOR all numbers from 1 to n and all array elements
  let xorAll = 0;

  for (let i = 1; i <= n; i++) {
    xorAll ^= i;
  }

  for (const num of array) {
    xorAll ^= num;
  }

  // xorAll now contains a ^ b (where a, b are missing numbers)

  // Step 2: Find a bit that is set in xorAll
  // This bit is different in a and b
  const setBit = xorAll & -xorAll;  // Rightmost set bit

  // Step 3: Divide numbers into two groups based on this bit
  let group1 = 0;
  let group2 = 0;

  for (let i = 1; i <= n; i++) {
    if (i & setBit) {
      group1 ^= i;
    } else {
      group2 ^= i;
    }
  }

  for (const num of array) {
    if (num & setBit) {
      group1 ^= num;
    } else {
      group2 ^= num;
    }
  }

  // group1 and group2 now contain the two missing numbers
  return [group1, group2];
}
```

**Time:** O(n)
**Space:** O(1)

✅ **OPTIMAL SOLUTION - NO OVERFLOW**

---

### Approach 3: Mark in Array (Modifies Input)

**Strategy:** Use array indices to mark presence

```javascript
function findMissingTwo(array) {
  const n = array.length + 2;
  const missing = [];

  // Create array of size n+1 for indices 1 to n
  const present = new Array(n + 1).fill(false);

  for (const num of array) {
    present[num] = true;
  }

  for (let i = 1; i <= n; i++) {
    if (!present[i]) {
      missing.push(i);
      if (missing.length === 2) break;
    }
  }

  return missing;
}
```

**Time:** O(n)
**Space:** O(n) - NOT O(1)!

---

## Algorithm Explanation

### XOR Approach Detailed

```
Array: [1, 3, 5, 6]  (N = 6, missing: 2, 4)

Step 1: XOR all numbers and array elements
  xorAll = 1^2^3^4^5^6 ^ 1^3^5^6
         = 2^4
         = 6 (binary: 110)

Step 2: Find rightmost set bit
  6 & -6 = 110 & ...11010 = 010 (bit position 1)

Step 3: Partition based on bit
  Numbers with bit 1 set: 2, 3, 6
  Numbers with bit 1 not set: 1, 4, 5

  Array elements with bit 1 set: 3, 6
  Array elements with bit 1 not set: 1, 5

  group1 = 2^3^6 ^ 3^6 = 2
  group2 = 1^4^5 ^ 1^5 = 4

Result: [2, 4] ✓
```

### Why XOR Works

```
Key XOR properties:
  a ^ a = 0
  a ^ 0 = a
  a ^ b ^ b = a

When we XOR 1..n with array elements:
  All present numbers cancel out
  Only missing numbers remain

1^2^3^4^5^6 ^ 1^3^5^6 = 2^4

The set bit in (2^4) indicates a bit where 2 and 4 differ
We use this to separate them into two groups
```

---

## Complexity Analysis

| Approach | Time | Space | Issues |
|----------|------|-------|--------|
| Sum + Sum Sq | O(n) | O(1) | Overflow, floating point |
| XOR | O(n) | **O(1)** | **None!** ✅ |
| Mark Array | O(n) | O(n) | Not O(1) space |

---

## Edge Cases

```javascript
// N = 2 (smallest case)
findMissingTwo([])  → [1, 2]

// N = 3
findMissingTwo([1]) → [2, 3]
findMissingTwo([2]) → [1, 3]
findMissingTwo([3]) → [1, 2]

// Missing first and last
findMissingTwo([2, 3, ..., N-1]) → [1, N]

// Missing consecutive numbers
findMissingTwo([1, 4, 5, 6]) → [2, 3]

// Missing numbers far apart
findMissingTwo([2, 3, 4, 5, ..., N-1]) → [1, N]
```

---

## Common Mistakes

### 1. Overflow in sum approach

```javascript
// ❌ WRONG - overflow with large N
const sum = n * (n + 1) / 2;  // Can overflow

// ✅ CORRECT - use XOR approach for large N
```

### 2. Wrong bit isolation

```javascript
// ❌ WRONG - getting wrong bit
const setBit = xorAll & (xorAll - 1);  // This clears rightmost bit!

// ✅ CORRECT - isolate rightmost set bit
const setBit = xorAll & -xorAll;
```

### 3. Wrong grouping logic

```javascript
// ❌ WRONG - not XORing array elements
group1 ^= i;  // Only XORing 1..n

// ✅ CORRECT - XOR both expected and actual
for (let i = 1; i <= n; i++) {
  if (i & setBit) group1 ^= i;
}
for (const num of array) {
  if (num & setBit) group1 ^= num;
}
```

---

## Related Problems

1. **Single Number** - Find one missing/unique number with XOR
2. **Missing Number** - Find one missing number from 1..n
3. **Find Duplicate** - Find duplicate in array with XOR
4. **Two Missing Numbers** - This problem!

---

## Bit Manipulation Trick

```javascript
// Isolate rightmost set bit
const rightmost = xorAll & -xorAll;

Example:
  xorAll = 6 (binary: 0110)
  -xorAll = ...1010 (two's complement)
  xorAll & -xorAll = 0010 (isolates bit position 1)

Why this works:
  -x in two's complement is ~x + 1
  This flips all bits and adds 1
  ANDing with original isolates rightmost 1
```

---

## Interview Tips

1. **Start with constraints:** "O(n) time and O(1) space rules out hash set"

2. **Mention math approach:** "We could use sum and sum of squares"

3. **Explain issues:** "But that has overflow and floating point issues"

4. **Introduce XOR:** "XOR approach is cleaner and has no overflow"

5. **Draw bit representation:**
   ```
   2 = 010
   4 = 100
   2^4 = 110 ← differ in bit 1 (rightmost bit)
   ```

6. **Explain partitioning:**
   - "We partition all numbers based on the differing bit"
   - "Each partition will have exactly one missing number"

7. **Code incrementally:** First XOR, then partition, then group

---

## Key Takeaways

1. **XOR approach** avoids overflow and floating point issues

2. **Isolate rightmost set bit:** `x & -x`

3. **Partition** numbers based on bit difference

4. XOR properties make this elegant: `a ^ a = 0`, `a ^ 0 = a`

5. This extends: can find k missing numbers with clever techniques

6. Pattern appears in: bit manipulation, single number problems

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Hard
