# 17.4 Missing Number

## Original Problem

**Missing Number:** An array A contains all the integers from 0 to n, except for one number which is missing. In this problem, we cannot access an entire integer in A with a single operation. The elements of A are represented in binary, and the only operation we can use to access them is "fetch the jth bit of A[i]," which takes constant time. Write code to find the missing integer. Can you do it in O(n) time?

Hints: #610, #659, #683

---

## Understanding the Problem

This is a **bit manipulation** problem with constraints:
- Array has integers from 0 to n (one is missing)
- We can only access **individual bits**, not entire integers
- Operation: `fetchBit(A[i], j)` returns jth bit of A[i]
- Goal: Find missing number in O(n) time

### Example

```
Array: [0, 1, 2, 4, 5, 6, 7]  (missing 3)

Binary representation:
  0: 000
  1: 001
  2: 010
  4: 100
  5: 101
  6: 110
  7: 111

Missing: 3 (011 in binary)
```

---

## Key Insight

If we could access full integers, we'd use:
```
sum = 0 + 1 + 2 + ... + n = n(n+1)/2
missing = sum - actualSum
```

But we can only access **individual bits**!

The solution: **Work bit by bit from LSB to MSB**

---

## Solution Approach

### Strategy: Bit-by-Bit Elimination

For each bit position (starting from LSB):
1. Count how many numbers have that bit as 0 vs 1
2. Determine what the missing number's bit should be
3. Remove numbers that don't match, continue with next bit

### How to Determine Missing Bit

In a complete sequence 0 to n:
- If we have **even** count of numbers:
  - Bit should be **1** if fewer 1s than expected
  - Bit should be **0** if fewer 0s than expected

### Example Walkthrough

```
Array: [0, 1, 2, 4, 5, 6, 7]  (n=7, missing 3)

Numbers:  0    1    2    4    5    6    7
Binary:  000  001  010  100  101  110  111

Bit 0 (LSB):
  0s: [0, 2, 4, 6] = 4 numbers
  1s: [1, 5, 7]    = 3 numbers

  Expected for 0-7: 4 zeros, 4 ones
  We have: 4 zeros, 3 ones
  → Missing number has bit 0 = 1
  → missingNumber = 1 (so far: **1 in binary)

Bit 1:
  Among numbers with bit 0 = 1: [1, 5, 7]
  Check bit 1:
    0: [1]       = 1 number
    1: [5, 7]    = 2 numbers

  Expected: 2 of each
  We have: 1 zero, 2 ones
  → Missing number has bit 1 = 1
  → missingNumber = 11 (so far: **11 in binary)

Bit 2:
  Among numbers with bits [0:1] = 11: [7]
  Check bit 2:
    0: []        = 0 numbers
    1: [7]       = 1 number

  Expected: 1 of each
  We have: 0 zeros, 1 one
  → Missing number has bit 2 = 0
  → missingNumber = 011 (complete: 011 in binary)

Result: 011 binary = 3 decimal ✓
```

---

## Algorithm

```javascript
function findMissingNumber(array) {
  // Find how many bits we need
  const n = array.length; // array has n elements (0 to n with one missing)
  const numBits = Math.ceil(Math.log2(n + 1));

  let missingNumber = 0;
  let candidates = array.slice(); // Start with all numbers

  // Check each bit from LSB to MSB
  for (let bit = 0; bit < numBits; bit++) {
    // Count numbers with this bit as 0 vs 1
    const zeros = [];
    const ones = [];

    for (const num of candidates) {
      if (fetchBit(num, bit) === 0) {
        zeros.push(num);
      } else {
        ones.push(num);
      }
    }

    // Determine missing number's bit
    // If more 0s, missing number has this bit as 1
    // If more 1s (or equal), missing number has this bit as 0
    if (zeros.length <= ones.length) {
      missingNumber |= (0 << bit);
      candidates = zeros; // Continue with numbers having 0 in this bit
    } else {
      missingNumber |= (1 << bit);
      candidates = ones; // Continue with numbers having 1 in this bit
    }
  }

  return missingNumber;
}

function fetchBit(num, bit) {
  return (num >> bit) & 1;
}
```

---

## Complexity Analysis

**Time Complexity:** O(n × log n)
- For each of log(n) bits
- We scan through remaining candidates (at most n)
- Each iteration roughly halves the candidates

Wait, the problem asks for O(n). Can we do better?

### Optimized O(n) Solution

```javascript
function findMissingNumberOptimized(array) {
  const n = array.length;
  const numBits = Math.ceil(Math.log2(n + 1));
  let missingNumber = 0;

  for (let bit = 0; bit < numBits; bit++) {
    let countOnes = 0;
    let expectedOnes = 0;

    // Count 1s in this bit position
    for (let i = 0; i < array.length; i++) {
      if (fetchBit(array[i], bit) === 1) {
        countOnes++;
      }
    }

    // Calculate expected count of 1s for complete sequence 0 to n
    for (let i = 0; i <= n; i++) {
      if ((i >> bit) & 1) {
        expectedOnes++;
      }
    }

    // If we have fewer 1s than expected, missing number has 1 in this bit
    if (countOnes < expectedOnes) {
      missingNumber |= (1 << bit);
    }
  }

  return missingNumber;
}
```

**Time:** O(n × log n) - log n bits, each requires O(n) scan
**Space:** O(1)

---

## Alternative: XOR Solution

If we could access full integers, XOR would be elegant:

```javascript
function findMissingXOR(array) {
  const n = array.length;
  let xor = 0;

  // XOR all numbers in array
  for (const num of array) {
    xor ^= num;
  }

  // XOR with complete sequence 0 to n
  for (let i = 0; i <= n; i++) {
    xor ^= i;
  }

  return xor; // Remaining value is missing number
}
```

But this requires reading **full integers**, which violates the constraint!

---

## Edge Cases

```javascript
findMissingNumber([0])      → 1
findMissingNumber([1])      → 0
findMissingNumber([0, 2])   → 1
findMissingNumber([0, 1])   → 2
```

---

## Why This Problem is Hard

1. **Constraint**: Can only access individual bits
2. **Not obvious**: Bit-by-bit elimination strategy
3. **Probability**: Need to understand bit distributions
4. **Implementation**: Careful bit manipulation required

---

## Interview Tips

1. **Start with unconstrained solution:** XOR or sum approach
2. **Acknowledge the constraint:** "If I could only access bits..."
3. **Think bit by bit:** "I can determine each bit of the answer"
4. **Draw an example:** Show binary representations
5. **Explain the counting:** Why comparing 0s and 1s works
6. **Discuss complexity:** O(n log n) for practical solution

---

## Key Takeaways

1. **Work bit by bit** when you can't access full integers
2. **Count bit frequencies** to determine missing number's bits
3. **Use bit patterns** in sequences 0 to n
4. Requires understanding of **binary representation**
5. **O(n log n)** time achievable with bit-by-bit approach
6. Related to **XOR trick** for finding missing numbers

---

**Time Complexity:** O(n log n)
**Space Complexity:** O(1)
**Difficulty:** Hard
