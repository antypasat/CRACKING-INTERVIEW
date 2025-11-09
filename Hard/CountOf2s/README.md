# 17.6 Count of 2s

## Original Problem

**Count of 2s:** Write a method to count the number of 2s that appear in all the numbers between 0 and n (inclusive).

```
Example:
n = 25
Output: 9

Explanation: 2, 12, 20, 21, 22 (appears three times), 23, 24, 25
Count: 1 + 1 + 1 + 1 + 3 + 1 + 1 + 1 = 9
```

Hints: #573, #612, #641

---

## Understanding the Problem

We need to count **every occurrence** of the digit 2 in all numbers from 0 to n.

```
Examples:

n = 1:
  Numbers: 0, 1
  Count: 0

n = 12:
  Numbers: 0-12
  Has 2: 2, 12
  Count: 2

n = 22:
  Numbers: 0-22
  Has 2: 2, 12, 20, 21, 22 (two 2s)
  Count: 1 + 1 + 1 + 1 + 2 = 6

n = 100:
  Ones place: 10 times (2, 12, 22, ..., 92)
  Tens place: 10 times (20-29)
  Total: 20
```

### Key Insight

Count 2s **by digit position**: ones, tens, hundreds, etc. For each position, calculate how many 2s appear based on:
- Digits to the **left** (complete cycles)
- Current digit (partial cycle)
- Digits to the **right** (within cycle)

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Iterate through each number and count 2s in each

```javascript
function countTwosNaive(n) {
  let count = 0;

  for (let i = 0; i <= n; i++) {
    count += countTwosInNumber(i);
  }

  return count;
}

function countTwosInNumber(num) {
  let count = 0;

  while (num > 0) {
    if (num % 10 === 2) {
      count++;
    }
    num = Math.floor(num / 10);
  }

  return count;
}
```

**Example:**
```
n = 25:
  0: 0 twos
  1: 0 twos
  2: 1 two
  ...
  12: 1 two
  ...
  20: 1 two
  21: 1 two
  22: 2 twos
  23: 1 two
  24: 1 two
  25: 1 two
Total: 9
```

**Time:** O(n × log n) - iterate n numbers, each has log₁₀(n) digits
**Space:** O(1)

---

### Approach 2: Digit-by-Digit Counting (Optimal)

**Strategy:** For each digit position, calculate how many 2s appear

```javascript
function countTwos(n) {
  let count = 0;
  let digit = 1;  // Current position (1, 10, 100, ...)

  while (digit <= n) {
    // Split number around current digit
    const higherDigits = Math.floor(n / (digit * 10));
    const currentDigit = Math.floor((n / digit) % 10);
    const lowerDigits = n % digit;

    // Count 2s at this position
    if (currentDigit < 2) {
      // Current digit is 0 or 1
      count += higherDigits * digit;
    } else if (currentDigit === 2) {
      // Current digit is exactly 2
      count += higherDigits * digit + lowerDigits + 1;
    } else {
      // Current digit is > 2
      count += (higherDigits + 1) * digit;
    }

    digit *= 10;
  }

  return count;
}
```

**Time:** O(log n) - iterate through digit positions
**Space:** O(1)

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Understanding the Math

For a digit position, count depends on three parts:

```
Number: 3 1 4 2 5
Position:      ↑ (tens place, digit = 10)

higherDigits = 314 (everything left of tens)
currentDigit = 2 (the tens digit)
lowerDigits = 5 (everything right of tens)
```

**Three cases:**

**Case 1: Current digit < 2**
```
Example: n = 31425, analyzing tens place (digit=10)
If we change it to: 31_2_5

How many numbers from 0 to 31425 have 2 in tens place?
  00020-00029: 10 numbers (higherDigits = 0)
  00120-00129: 10 numbers (higherDigits = 1)
  ...
  31320-31329: 10 numbers (higherDigits = 313)

Total: 314 complete sets of 10 = higherDigits × digit
```

**Case 2: Current digit = 2**
```
Example: n = 31425, but let's say n = 31225, analyzing tens place

We get all complete sets from higher digits: 312 × 10
PLUS partial set: 31220, 31221, 31222, 31223, 31224, 31225
  That's lowerDigits + 1 = 5 + 1 = 6

Total: higherDigits × digit + lowerDigits + 1
```

**Case 3: Current digit > 2**
```
Example: n = 31425, analyzing tens place (digit is 4)

We get all complete sets PLUS one more partial:
  00020-00029
  00120-00129
  ...
  31220-31229 ← one extra complete set

Total: (higherDigits + 1) × digit
```

### Step-by-Step Example

```
n = 25

Digit = 1 (ones place):
  higherDigits = 25 / 10 = 2
  currentDigit = 25 / 1 % 10 = 5
  lowerDigits = 25 % 1 = 0

  currentDigit (5) > 2:
    count += (2 + 1) × 1 = 3

  Numbers with 2 in ones: 2, 12, 22
  ✓ Correct: 3

Digit = 10 (tens place):
  higherDigits = 25 / 100 = 0
  currentDigit = 25 / 10 % 10 = 2
  lowerDigits = 25 % 10 = 5

  currentDigit = 2:
    count += 0 × 10 + 5 + 1 = 6

  Numbers with 2 in tens: 20, 21, 22, 23, 24, 25
  ✓ Correct: 6

Digit = 100 (hundreds place):
  100 > 25, stop

Total: 3 + 6 = 9 ✓
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n × log n) | O(1) | Count in each number |
| Digit-by-Digit | O(log n) | O(1) | **Optimal** |

The digit-by-digit approach is **dramatically faster** for large n:
- n = 1,000,000: Brute force ~6M operations, Optimal ~7 operations

---

## Edge Cases

```javascript
countTwos(0) → 0   // No numbers with 2

countTwos(1) → 0   // 0, 1 - no 2s

countTwos(2) → 1   // Only 2

countTwos(12) → 2  // 2, 12

countTwos(20) → 3  // 2, 12, 20

countTwos(22) → 6  // 2, 12, 20, 21, 22 (two 2s)

countTwos(100) → 20  // 10 in ones + 10 in tens

countTwos(222) → 87  // Many 2s
```

---

## Common Mistakes

### 1. Counting numbers instead of digits

```javascript
// ❌ WRONG - counts how many numbers contain 2
if (hasTwo(i)) count++;

// ✅ CORRECT - counts every occurrence of digit 2
count += countTwosInNumber(i);
```

### 2. Off-by-one in digit counting

```javascript
// ❌ WRONG - missing +1 for current digit = 2
count += higherDigits * digit + lowerDigits;

// ✅ CORRECT
count += higherDigits * digit + lowerDigits + 1;
```

### 3. Integer division errors

```javascript
// ❌ WRONG - floating point issues
const currentDigit = (n / digit) % 10;

// ✅ CORRECT - use Math.floor
const currentDigit = Math.floor((n / digit) % 10);
```

---

## Pattern Variations

This digit counting pattern can be adapted for:

### 1. Count any digit (not just 2)

```javascript
function countDigit(n, targetDigit) {
  let count = 0;
  let digit = 1;

  while (digit <= n) {
    const higher = Math.floor(n / (digit * 10));
    const current = Math.floor((n / digit) % 10);
    const lower = n % digit;

    if (current < targetDigit) {
      count += higher * digit;
    } else if (current === targetDigit) {
      count += higher * digit + lower + 1;
    } else {
      count += (higher + 1) * digit;
    }

    digit *= 10;
  }

  return count;
}
```

### 2. Count 0s (special case)

```javascript
// For 0s, don't count leading zeros
function countZeros(n) {
  let count = 0;
  let digit = 1;

  while (digit <= n) {
    const higher = Math.floor(n / (digit * 10));
    const current = Math.floor((n / digit) % 10);
    const lower = n % digit;

    // Special: don't count leading zeros
    if (current === 0) {
      count += (higher - 1) * digit + lower + 1;
    } else {
      count += higher * digit;
    }

    digit *= 10;
  }

  return count;
}
```

---

## Interview Tips

1. **Start with brute force:** Show you understand the problem

2. **Explain the optimization:** "Instead of checking every number, I can count by position"

3. **Use small examples:** n=25 is perfect for explanation

4. **Draw it out:**
   ```
   Position: Hundreds Tens Ones
   Range:    0-25

   Ones:  2, 12, 22 → 3 times
   Tens:  20-25 → 6 times
   ```

5. **Discuss the three cases:** Make it clear why current digit matters

6. **Handle edge cases:** What about n=2? n=22? n=222?

---

## Key Takeaways

1. **Digit-by-digit analysis** is powerful for number-based problems

2. **Three-part split** (higher, current, lower) is the key technique

3. **Three cases** based on current digit determine the count

4. Optimization: O(n × log n) → O(log n)

5. This pattern extends to counting any digit in a range

6. Mathematical insight beats brute force dramatically

---

**Time Complexity:** O(log n)
**Space Complexity:** O(1)
**Difficulty:** Hard
