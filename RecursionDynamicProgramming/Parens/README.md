# Parens (Valid Parentheses) / 括号组合

## Problem Description / 问题描述

**English:**
Implement an algorithm to print all valid (i.e., properly opened and closed) combinations of n pairs of parentheses.

**Example:**
- Input: n = 3
- Output: `((()))`, `(()())`, `(())()`, `()(())`, `()()()`

**中文:**
实现一个算法来打印n对括号的所有有效（即正确打开和关闭）组合。

**示例:**
- 输入: n = 3
- 输出: `((()))`, `(()())`, `(())()`, `()(())`, `()()()`

## Rules / 规则

1. Each combination must have exactly n opening parentheses `(`
2. Each combination must have exactly n closing parentheses `)`
3. At any point while reading left to right, the number of closing parentheses cannot exceed opening parentheses
4. All combinations must be unique

## Solutions / 解决方案

### Approach 1: Backtracking with Count Tracking / 方法1：带计数的回溯 ⭐

**Algorithm:**
- Track the number of left and right parentheses used
- At each step:
  - Add `(` if we haven't used all n left parentheses
  - Add `)` if it won't exceed the number of left parentheses used
- When we've used all 2n parentheses, we have a valid combination

**Key Insight:** We can only add `)` when `rightCount < leftCount`

**Time Complexity:** O(4^n / √n) = O(Catalan number)
**Space Complexity:** O(n) - recursion depth

```javascript
function generateParens(n) {
  const result = [];

  function backtrack(current, leftCount, rightCount) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    // Add left paren if available
    if (leftCount < n) {
      backtrack(current + '(', leftCount + 1, rightCount);
    }

    // Add right paren if valid
    if (rightCount < leftCount) {
      backtrack(current + ')', leftCount, rightCount + 1);
    }
  }

  backtrack('', 0, 0);
  return result;
}
```

### Approach 2: Remaining Counts / 方法2：剩余计数

**Algorithm:**
- Instead of counting used parentheses, track remaining ones
- Add `(` if leftRemaining > 0
- Add `)` if rightRemaining > 0 AND rightRemaining < leftRemaining
- When both reach 0, we have a valid combination

**Time Complexity:** O(4^n / √n)
**Space Complexity:** O(n)

```javascript
function generateParens2(n) {
  const result = [];

  function build(str, leftRemaining, rightRemaining) {
    if (leftRemaining === 0 && rightRemaining === 0) {
      result.push(str);
      return;
    }

    if (leftRemaining > 0) {
      build(str + '(', leftRemaining - 1, rightRemaining);
    }

    if (rightRemaining > leftRemaining) {
      build(str + ')', leftRemaining, rightRemaining - 1);
    }
  }

  build('', n, n);
  return result;
}
```

### Approach 3: Iterative BFS / 方法3：迭代广度优先

**Algorithm:**
- Use a queue to build combinations level by level
- Each state stores: current string, left count, right count
- Process each state and generate new valid states

**Time Complexity:** O(4^n / √n)
**Space Complexity:** O(4^n / √n) - queue size

```javascript
function generateParens3(n) {
  const result = [];
  const queue = [{ str: '', left: 0, right: 0 }];

  while (queue.length > 0) {
    const { str, left, right } = queue.shift();

    if (str.length === 2 * n) {
      result.push(str);
      continue;
    }

    if (left < n) {
      queue.push({ str: str + '(', left: left + 1, right: right });
    }

    if (right < left) {
      queue.push({ str: str + ')', left: left, right: right + 1 });
    }
  }

  return result;
}
```

### Approach 4: Catalan Structure / 方法4：卡特兰结构

**Algorithm:**
- Use the recursive structure of Catalan numbers
- For n pairs: `(` + i pairs inside + `)` + (n-1-i) pairs after
- Generate all combinations recursively

**Formula:** C(n) = Σ(C(i) × C(n-1-i)) for i from 0 to n-1

**Time Complexity:** O(4^n / √n)
**Space Complexity:** O(4^n / √n)

```javascript
function generateParens4(n) {
  if (n === 0) return [''];

  const result = [];
  for (let i = 0; i < n; i++) {
    const leftCombos = generateParens4(i);
    const rightCombos = generateParens4(n - 1 - i);

    for (const left of leftCombos) {
      for (const right of rightCombos) {
        result.push('(' + left + ')' + right);
      }
    }
  }
  return result;
}
```

## Catalan Numbers / 卡特兰数

The number of valid combinations for n pairs is the nth Catalan number.

**Formula:**
```
Catalan(n) = (2n)! / ((n+1)! × n!)
           = C(2n, n) / (n+1)
```

**Values:**

| n | Catalan(n) | Examples |
|---|------------|----------|
| 0 | 1 | "" |
| 1 | 1 | "()" |
| 2 | 2 | "(())", "()()" |
| 3 | 5 | "((()))", "(()())", "(())()", "()(())", "()()()" |
| 4 | 14 | ... |
| 5 | 42 | ... |
| 10 | 16,796 | ... |

## Key Insights / 关键见解

**English:**
1. **Constraint checking:** At each step, check if we can add `(` or `)`
2. **Balance invariant:** rightCount ≤ leftCount at all times
3. **Catalan number:** The count of valid combinations is always the nth Catalan number
4. **No backtracking needed:** We only generate valid combinations, never invalid ones
5. **Optimal path:** Each valid combination is built exactly once

**中文:**
1. **约束检查：** 在每一步，检查是否可以添加 `(` 或 `)`
2. **平衡不变量：** 任何时候 rightCount ≤ leftCount
3. **卡特兰数：** 有效组合的数量总是第n个卡特兰数
4. **无需回溯：** 我们只生成有效组合，从不生成无效组合
5. **最优路径：** 每个有效组合恰好构建一次

## Recursion Tree / 递归树

**For n=3:**

```
                         ""
                         |
                        "("
                       /   \
                    "(("   "()"
                   /   \    |
               "((("  "(()" "()("
                 |    /  \   |
             "((())" "(()()" "(())" "()(()" "()()("
                              |       |       |
                         "((()))" "(()())" "(())()" "()(())" "()()()"

Valid combinations: 5 (Catalan(3) = 5)
```

## Detailed Example / 详细示例

**Building n=3:**

```
Step-by-step for one path:

Current=""    left=0 right=0  → Add '(' (left < 3)
Current="("   left=1 right=0  → Add '(' (left < 3)
Current="(("  left=2 right=0  → Add '(' (left < 3)
Current="(((" left=3 right=0  → Add ')' (right < left, can't add '(' anymore)
Current="((()" left=3 right=1 → Add ')' (right < left)
Current="((())" left=3 right=2 → Add ')' (right < left)
Current="((()))" left=3 right=3 → Complete! ✓
```

## Why This Works / 为什么有效

**English:**
The algorithm ensures validity by construction:
- We never add more than n opening parentheses
- We never add a closing parenthesis unless there's a matching opening one
- Therefore, every generated string is automatically valid

This is more efficient than generating all 2^(2n) strings and filtering!

**中文:**
该算法通过构造确保有效性：
- 我们永远不会添加超过n个开括号
- 除非有匹配的开括号，否则我们不会添加闭括号
- 因此，每个生成的字符串都自动有效

这比生成所有 2^(2n) 个字符串然后过滤更高效！

## Complexity Analysis / 复杂度分析

**Time Complexity:**
- The exact complexity is the nth Catalan number: O(4^n / (n√n))
- This is because we generate exactly C(n) combinations
- Each combination takes O(n) time to build

**Space Complexity:**
- Recursion depth: O(n)
- Output storage: O(4^n / √n) combinations × O(n) length each

**Growth:**

| n | Combinations | Approximate Time |
|---|--------------|------------------|
| 5 | 42 | Instant |
| 10 | 16,796 | Fast |
| 15 | 9,694,845 | Seconds |
| 20 | 6,564,120,420 | Minutes |
| 25 | ~5 billion | Too slow |

## Test Cases / 测试用例

```javascript
// Basic cases
generateParens(1)  // ["()"]
generateParens(2)  // ["(())", "()()"]
generateParens(3)  // ["((()))", "(()())", "(())()", "()(())", "()()()"]

// Edge case
generateParens(0)  // []

// Larger case
generateParens(4)  // 14 combinations

// Verification
const result = generateParens(3);
result.length === 5  // true (Catalan(3))
result.every(s => s.length === 6)  // true (2*n)
result.every(s => isValid(s))  // true
```

## Common Mistakes / 常见错误

1. **Not checking balance:** Forgetting `rightCount < leftCount` generates invalid strings
2. **Wrong base case:** Should be when length equals 2*n, not when counts reach n
3. **Generating duplicates:** Each path should generate unique combinations
4. **Overflow with large n:** Catalan numbers grow exponentially

## Applications / 应用

**English:**
- Expression validation
- Tree structure enumeration
- Bracket matching problems
- Compiler design (parsing)
- Combinatorial mathematics

**中文:**
- 表达式验证
- 树结构枚举
- 括号匹配问题
- 编译器设计（解析）
- 组合数学

## Running the Solution / 运行解决方案

```bash
node solution.js
```

## Related Problems / 相关问题

- Valid Parentheses (checking if string is valid)
- Remove Invalid Parentheses
- Longest Valid Parentheses
- Different Ways to Add Parentheses
- Generate All Binary Trees
