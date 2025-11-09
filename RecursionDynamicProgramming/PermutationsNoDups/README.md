# Permutations without Duplicates / 无重复排列

## Problem Description / 问题描述

**English:**
Write a method to compute all permutations of a string of unique characters.

**中文:**
编写一个方法来计算唯一字符字符串的所有排列。

## Solutions / 解决方案

### Approach 1: Insert Character at All Positions / 方法1：在所有位置插入字符

**Algorithm:**
- Base case: Empty string has one permutation: ""
- Recursive case: For a string of length n:
  1. Get all permutations of first n-1 characters
  2. For each permutation, insert the nth character at every possible position

**Example: "abc"**
```
"" → [""]
"a" → ["a"]
"ab" → ["ab", "ba"]  (insert 'b' into "a" at positions 0 and 1)
"abc" → ["abc", "bac", "bca", "acb", "cab", "cba"]
        (insert 'c' into each permutation of "ab" at all positions)
```

**Time Complexity:** O(n! * n)
- Generate n! permutations, each requiring O(n) string operations

**Space Complexity:** O(n!)
- Store all n! permutations

```javascript
function getPermutations(str) {
  if (str.length === 0) return [''];

  const permutations = [];
  const first = str[0];
  const remainder = str.slice(1);
  const words = getPermutations(remainder);

  for (const word of words) {
    for (let i = 0; i <= word.length; i++) {
      const perm = word.slice(0, i) + first + word.slice(i);
      permutations.push(perm);
    }
  }

  return permutations;
}
```

### Approach 2: Prefix Building / 方法2：前缀构建 ⭐

**Algorithm:**
- Choose each character to be the first character
- Recursively permute the remaining characters
- Build permutations by concatenating prefix + remaining permutations

**Example: "abc"**
```
permute("", "abc")
  → permute("a", "bc")
      → permute("ab", "c") → "abc"
      → permute("ac", "b") → "acb"
  → permute("b", "ac")
      → permute("ba", "c") → "bac"
      → permute("bc", "a") → "bca"
  → permute("c", "ab")
      → permute("ca", "b") → "cab"
      → permute("cb", "a") → "cba"
```

**Time Complexity:** O(n!)
**Space Complexity:** O(n!) + O(n) recursion stack

```javascript
function getPermutations2(str) {
  const result = [];

  function permute(prefix, remaining) {
    if (remaining.length === 0) {
      result.push(prefix);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const before = remaining.slice(0, i);
      const after = remaining.slice(i + 1);
      const char = remaining[i];
      permute(prefix + char, before + after);
    }
  }

  permute('', str);
  return result;
}
```

### Approach 3: Swap-based Backtracking / 方法3：交换回溯

**Algorithm:**
- Fix first position, permute remaining positions
- For each position, swap it with first position, recurse, then swap back
- This generates permutations in-place

**Time Complexity:** O(n!)
**Space Complexity:** O(n) - only recursion stack, generates in-place

```javascript
function getPermutations3(str) {
  const result = [];
  const chars = str.split('');

  function backtrack(start) {
    if (start === chars.length) {
      result.push(chars.join(''));
      return;
    }

    for (let i = start; i < chars.length; i++) {
      [chars[start], chars[i]] = [chars[i], chars[start]];
      backtrack(start + 1);
      [chars[start], chars[i]] = [chars[i], chars[start]];
    }
  }

  backtrack(0);
  return result;
}
```

### Approach 4: Boolean Tracking / 方法4：布尔跟踪

**Algorithm:**
- Use boolean array to track which characters are used
- Build permutation character by character
- At each step, try all unused characters

**Time Complexity:** O(n!)
**Space Complexity:** O(n)

```javascript
function getPermutations4(str) {
  const result = [];
  const chars = str.split('');
  const used = new Array(chars.length).fill(false);

  function backtrack(current) {
    if (current.length === chars.length) {
      result.push(current);
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      backtrack(current + chars[i]);
      used[i] = false;
    }
  }

  backtrack('');
  return result;
}
```

## Key Insights / 关键见解

**English:**
1. **Factorial growth:** n characters produce n! permutations
   - 3 chars → 6 permutations
   - 4 chars → 24 permutations
   - 5 chars → 120 permutations
   - 10 chars → 3,628,800 permutations

2. **Recursive structure:** All approaches use recursion to build permutations incrementally

3. **Base case:** Empty string or single character forms the base case

4. **Choice at each step:** At each recursion level, we make n choices (which character to use next)

5. **Trade-offs:**
   - Approach 1: Intuitive but involves string operations
   - Approach 2: Clean recursive structure
   - Approach 3: Most space-efficient (in-place swaps)
   - Approach 4: Clear logic with explicit state tracking

**中文:**
1. **阶乘增长：** n个字符产生n!个排列
   - 3个字符 → 6个排列
   - 4个字符 → 24个排列
   - 5个字符 → 120个排列
   - 10个字符 → 3,628,800个排列

2. **递归结构：** 所有方法都使用递归来逐步构建排列

3. **基本情况：** 空字符串或单个字符构成基本情况

4. **每步的选择：** 在每个递归级别，我们做出n个选择（接下来使用哪个字符）

5. **权衡：**
   - 方法1：直观但涉及字符串操作
   - 方法2：清晰的递归结构
   - 方法3：最节省空间（原地交换）
   - 方法4：明确的逻辑和显式状态跟踪

## Recursion Tree Example / 递归树示例

For "abc" using Approach 2:

```
                    permute("", "abc")
                   /         |         \
                  /          |          \
        permute("a","bc") permute("b","ac") permute("c","ab")
           /        \           /        \           /        \
          /          \         /          \         /          \
   p("ab","c") p("ac","b") p("ba","c") p("bc","a") p("ca","b") p("cb","a")
       |           |           |           |           |           |
     "abc"       "acb"       "bac"       "bca"       "cab"       "cba"
```

## Complexity Analysis / 复杂度分析

| String Length | Permutations | Time Complexity | Practical Limit |
|---------------|--------------|-----------------|-----------------|
| 1 | 1 | O(1) | Instant |
| 3 | 6 | O(6) | Instant |
| 5 | 120 | O(120) | Instant |
| 7 | 5,040 | O(5,040) | Fast |
| 10 | 3,628,800 | O(3.6M) | Few seconds |
| 12 | 479,001,600 | O(479M) | Very slow |
| 15+ | > 1 trillion | Impractical | Too slow |

## Test Cases / 测试用例

```javascript
// Basic cases
getPermutations("abc")
// ["abc", "bac", "bca", "acb", "cab", "cba"]

getPermutations("ab")
// ["ab", "ba"]

// Edge cases
getPermutations("")
// [""]

getPermutations("a")
// ["a"]

// Larger example
getPermutations("abcd")
// Returns all 24 permutations

// Verification
const perms = getPermutations("abc");
perms.length === 6  // true
new Set(perms).size === 6  // all unique
```

## Visual Example / 可视化示例

**Building "abc" permutations (Approach 1):**

```
Step 1: permutations("") = [""]

Step 2: permutations("a")
  Insert 'a' into "":
  - Position 0: "a"
  Result: ["a"]

Step 3: permutations("ab")
  Insert 'b' into "a":
  - Position 0: "ba"
  - Position 1: "ab"
  Result: ["ba", "ab"]

Step 4: permutations("abc")
  Insert 'c' into "ba":
  - Position 0: "cba"
  - Position 1: "bca"
  - Position 2: "bac"
  Insert 'c' into "ab":
  - Position 0: "cab"
  - Position 1: "acb"
  - Position 2: "abc"
  Result: ["cba", "bca", "bac", "cab", "acb", "abc"]
```

## Common Mistakes / 常见错误

1. **Not handling empty string:** Must return [""] not []
2. **Forgetting to backtrack:** In swap approach, must swap back
3. **Creating duplicates:** Only applies when string has duplicate characters (see next problem)
4. **String immutability:** In JavaScript, strings are immutable, so be careful with operations

## Running the Solution / 运行解决方案

```bash
node solution.js
```

## Related Problems / 相关问题

- 8.8 Permutations with Duplicates
- Next Permutation
- Permutation Sequence (k-th permutation)
- Letter Combinations of a Phone Number
- Subsets
