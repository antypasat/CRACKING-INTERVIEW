# 17.1 Add Without Plus

## Original Problem

**Add Without Plus:** Write a function that adds two numbers. You should not use + or any arithmetic operators.

Hints: #467, #544, #601, #628, #642, #664, #692, #712, #724

---

## Understanding the Problem

This problem asks us to implement addition using only **bitwise operations**. We cannot use `+`, `-`, `*`, `/`, or any other arithmetic operators.

The key insight is understanding how binary addition works at the bit level:
- When adding two bits, we get a **sum** and a **carry**
- The sum without carry is like XOR
- The carry is like AND, shifted left by 1

### Example

```
Adding 5 + 3 in binary:
  101  (5)
+ 011  (3)
-----
 1000  (8)

Step by step:
  101
^ 011
-----
  110  (XOR gives sum without carry)

  101
& 011
-----
  001  (AND gives positions where carry occurs)
 010   (Shift left by 1 to get actual carry)

Now add 110 + 010:
  110
^ 010
-----
  100

  110
& 010
-----
  010
 100  (carry)

Now add 100 + 100:
  100
^ 100
-----
  000

  100
& 100
-----
  100
 1000 (carry)

Now add 000 + 1000:
  000
^ 1000
------
  1000 (Result: 8)

carry = 0 (done!)
```

---

## Solution Approach

### Strategy: Iterative Bit Manipulation

**Algorithm:**
1. Calculate `sum = a XOR b` (addition without carrying)
2. Calculate `carry = (a AND b) << 1` (carry bits, shifted left)
3. If carry is 0, return sum
4. Otherwise, repeat with `a = sum` and `b = carry`

### Why This Works

- **XOR (^)** adds bits without carrying
  - `0 ^ 0 = 0`, `0 ^ 1 = 1`, `1 ^ 0 = 1`, `1 ^ 1 = 0`
  - This is exactly addition without carry!

- **AND (&)** finds where both bits are 1
  - These positions will generate a carry
  - `1 & 1 = 1` (carry needed), all others = 0

- **Left Shift (<<)** moves the carry to the next position
  - Carries always go to the position to the left

### Visualization

```
Step-by-step for 759 + 674:

Binary:
759 = 1011110111
674 = 1010100010

Iteration 1:
a =     1011110111  (759)
b =     1010100010  (674)
sum =   0001010101  (XOR)
carry = 10100010100 (AND << 1)

Iteration 2:
a =     0001010101  (85)
b =    10100010100  (1348)
sum =  10101000001  (XOR)
carry =  0000010100 (AND << 1)

Iteration 3:
a =    10101000001  (1345)
b =     0000010100  (20)
sum =  10101010101  (XOR)
carry =  0000010000 (AND << 1)

Iteration 4:
a =    10101010101  (1365)
b =     0000010000  (16)
sum =  10101000101  (XOR)
carry =  0000010000 (AND << 1)

... continues until carry = 0
Result: 10110011001 (1433) ✓
```

---

## Handling Negative Numbers

In JavaScript, bitwise operations work on **32-bit signed integers**. Negative numbers are represented in **two's complement** form.

The same algorithm works for negative numbers because:
- Two's complement naturally handles negative values
- XOR and AND operations work the same way
- The algorithm terminates when carry becomes 0

### Example with Negative Number

```
5 + (-3) = 2

In 32-bit two's complement:
5  = 00000000000000000000000000000101
-3 = 11111111111111111111111111111101

The algorithm will handle the carries through all 32 bits
and produce the correct result: 2
```

---

## Implementation Details

```javascript
function addWithoutPlus(a, b) {
  // Handle edge case
  if (b === 0) return a;

  // Iterative approach to avoid recursion stack overflow
  while (b !== 0) {
    // Calculate sum without carry (XOR)
    const sum = a ^ b;

    // Calculate carry (AND and shift left)
    const carry = (a & b) << 1;

    // Update for next iteration
    a = sum;
    b = carry;
  }

  return a;
}
```

### Alternative: Recursive Approach

```javascript
function addWithoutPlusRecursive(a, b) {
  // Base case: no carry
  if (b === 0) return a;

  // Calculate sum and carry
  const sum = a ^ b;
  const carry = (a & b) << 1;

  // Recursively add sum and carry
  return addWithoutPlusRecursive(sum, carry);
}
```

---

## Complexity Analysis

**Time Complexity:** O(log n) where n is the larger number
- In the worst case, we need iterations equal to the number of bits
- For 32-bit integers, this is O(1) - constant 32 iterations max

**Space Complexity:**
- Iterative: O(1) - only a few variables
- Recursive: O(log n) - recursion stack depth

---

## Edge Cases

```javascript
addWithoutPlus(0, 0)      → 0
addWithoutPlus(0, 5)      → 5
addWithoutPlus(5, 0)      → 5
addWithoutPlus(1, 1)      → 2
addWithoutPlus(-1, 1)     → 0
addWithoutPlus(-5, -3)    → -8
addWithoutPlus(5, -3)     → 2
addWithoutPlus(MAX, 1)    → overflow (wraps around in 32-bit)
```

---

## Common Mistakes

### 1. Forgetting the Loop

```javascript
// ❌ WRONG - only does one iteration
function add(a, b) {
  const sum = a ^ b;
  const carry = (a & b) << 1;
  return sum + carry; // Still using +!
}

// ✅ CORRECT - iterate until no carry
function add(a, b) {
  while (b !== 0) {
    const sum = a ^ b;
    const carry = (a & b) << 1;
    a = sum;
    b = carry;
  }
  return a;
}
```

### 2. Not Handling Negative Numbers

The algorithm naturally handles negative numbers due to two's complement representation, but it's important to understand how it works.

### 3. Recursion Without Base Case

```javascript
// ❌ WRONG - infinite recursion
function add(a, b) {
  const sum = a ^ b;
  const carry = (a & b) << 1;
  return add(sum, carry); // No base case!
}

// ✅ CORRECT
function add(a, b) {
  if (b === 0) return a; // Base case
  const sum = a ^ b;
  const carry = (a & b) << 1;
  return add(sum, carry);
}
```

---

## Bitwise Operations Reference

| Operation | Symbol | Description | Example |
|-----------|--------|-------------|---------|
| AND | `&` | 1 if both bits are 1 | `5 & 3 = 1` (101 & 011 = 001) |
| OR | `\|` | 1 if either bit is 1 | `5 \| 3 = 7` (101 \| 011 = 111) |
| XOR | `^` | 1 if bits are different | `5 ^ 3 = 6` (101 ^ 011 = 110) |
| NOT | `~` | Inverts all bits | `~5 = -6` |
| Left Shift | `<<` | Shifts bits left, fills with 0 | `5 << 1 = 10` (101 → 1010) |
| Right Shift | `>>` | Shifts bits right (signed) | `5 >> 1 = 2` (101 → 010) |

---

## Related Problems

1. **Subtract Without Minus:** Use the same technique with negation
2. **Multiply Without Times:** Repeated addition using bit shifts
3. **Divide Without Division:** Repeated subtraction using bit shifts
4. **Count Bits:** Count number of 1s in binary representation

---

## Interview Tips

1. **Start with an example:** Show how binary addition works manually
2. **Explain XOR and AND:** Make sure interviewer understands these operations
3. **Draw the bits:** Visual representation helps clarify the logic
4. **Mention negative numbers:** Show you understand two's complement
5. **Discuss both approaches:** Iterative (better) and recursive
6. **Analyze termination:** Explain why the loop will always end

---

## Key Takeaways

1. **XOR** gives the sum without carry
2. **AND + Left Shift** gives the carry
3. **Repeat** until there's no carry
4. Works for negative numbers due to **two's complement**
5. **Iterative** approach is preferred over recursive
6. Understanding **bitwise operations** is crucial

---

**Time Complexity:** O(log n) or O(1) for fixed-size integers
**Space Complexity:** O(1) iterative, O(log n) recursive
**Difficulty:** Hard
