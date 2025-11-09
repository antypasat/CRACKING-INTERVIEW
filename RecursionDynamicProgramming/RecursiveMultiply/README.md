# Recursive Multiply / 递归乘法

## Problem Description / 问题描述

**English:**
Write a recursive function to multiply two positive integers without using the * operator. You can use addition, subtraction, and bit shifting, but you should minimize the number of those operations.

**中文:**
编写一个递归函数来乘以两个正整数，不使用 * 运算符。你可以使用加法、减法和位移，但应该最小化这些操作的数量。

## Solutions / 解决方案

### Approach 1: Simple Recursive Addition / 方法1：简单递归加法

**Algorithm:**
- Multiply a * b by adding b to itself a times
- Use recursion: a * b = b + (a-1) * b
- Optimize by using the smaller number as the multiplier

**Time Complexity:** O(min(a, b))
**Space Complexity:** O(min(a, b)) - recursion stack

```javascript
function recursiveMultiplySimple(a, b) {
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  return multiplyHelper(smaller, bigger);
}

function multiplyHelper(smaller, bigger) {
  if (smaller === 0) return 0;
  if (smaller === 1) return bigger;
  return bigger + multiplyHelper(smaller - 1, bigger);
}
```

### Approach 2: Optimized with Halving / 方法2：优化的二分法 ⭐

**Algorithm:**
- Key insight: a * b = (a * (b/2)) * 2
- If b is odd: a * b = a * (b/2) * 2 + a
- Use bit shifting for division/multiplication by 2
- Recursively compute half products

**Time Complexity:** O(log min(a, b))
**Space Complexity:** O(log min(a, b))

**Example: 31 * 35**
```
31 * 35 = (15 * 35) * 2 + 35     [31 is odd]
        = ((7 * 35) * 2) * 2 + 35
        = (((3 * 35) * 2) * 2) * 2 + 35
        = ((((1 * 35) * 2 + 35) * 2) * 2) * 2 + 35
```

```javascript
function recursiveMultiply(a, b) {
  const smaller = a < b ? a : b;
  const bigger = a < b ? b : a;
  return multiplyOptimized(smaller, bigger);
}

function multiplyOptimized(smaller, bigger) {
  if (smaller === 0) return 0;
  if (smaller === 1) return bigger;

  const halfSmaller = smaller >> 1;  // Divide by 2
  const halfProduct = multiplyOptimized(halfSmaller, bigger);

  if (smaller % 2 === 0) {
    return halfProduct << 1;  // Multiply by 2
  } else {
    return (halfProduct << 1) + bigger;
  }
}
```

### Approach 3: Memoized Version / 方法3：记忆化版本

**Algorithm:**
- Same as optimized approach but cache intermediate results
- Useful if same multiplications are computed multiple times

**Time Complexity:** O(log min(a, b))
**Space Complexity:** O(log min(a, b)) + O(n) for memoization

### Approach 4: Iterative (Russian Peasant) / 方法4：迭代法（俄罗斯农民算法）

**Algorithm:**
- Based on binary representation of numbers
- While multiplier > 0:
  - If multiplier is odd, add multiplicand to result
  - Halve multiplier, double multiplicand

**Time Complexity:** O(log a)
**Space Complexity:** O(1)

```javascript
function recursiveMultiplyIterative(a, b) {
  let result = 0;
  let multiplier = a;
  let multiplicand = b;

  while (multiplier > 0) {
    if (multiplier & 1) {  // If odd
      result += multiplicand;
    }
    multiplier >>= 1;   // Halve
    multiplicand <<= 1; // Double
  }
  return result;
}
```

## Key Insights / 关键见解

**English:**
1. **Use smaller number:** Always use the smaller number as the multiplier to minimize operations
2. **Halving strategy:** By dividing the problem in half each time, we reduce from O(n) to O(log n)
3. **Bit operations:** Right shift (>>) divides by 2, left shift (<<) multiplies by 2
4. **Odd handling:** When the multiplier is odd, we need to add one extra bigger number
5. **Russian Peasant method:** An ancient algorithm that works by repeatedly halving and doubling

**中文:**
1. **使用较小数：** 始终使用较小的数作为乘数以最小化操作
2. **二分策略：** 通过每次将问题减半，我们从 O(n) 降低到 O(log n)
3. **位操作：** 右移 (>>) 除以2，左移 (<<) 乘以2
4. **奇数处理：** 当乘数为奇数时，需要额外加一个较大数
5. **俄罗斯农民算法：** 一种古老的算法，通过反复减半和加倍工作

## Complexity Comparison / 复杂度比较

| Approach | Time | Space | Operations for 31*35 |
|----------|------|-------|---------------------|
| Simple Recursive | O(n) | O(n) | 31 additions |
| Optimized Halving | O(log n) | O(log n) | ~5 levels |
| Memoized | O(log n) | O(log n + m) | ~5 levels |
| Iterative | O(log n) | O(1) | ~5 iterations |

## Test Cases / 测试用例

```javascript
// Basic cases
recursiveMultiply(5, 3)      // 15
recursiveMultiply(8, 7)      // 56
recursiveMultiply(12, 13)    // 156

// Edge cases
recursiveMultiply(1, 100)    // 100 (one is 1)
recursiveMultiply(0, 50)     // 0 (zero)
recursiveMultiply(16, 16)    // 256 (same numbers)

// Larger numbers
recursiveMultiply(31, 35)    // 1085
recursiveMultiply(23, 41)    // 943
```

## Running the Solution / 运行解决方案

```bash
node solution.js
```

## Related Problems / 相关问题

- Divide two integers without division operator
- Power function without * operator
- Karatsuba multiplication algorithm
- Strassen's matrix multiplication
