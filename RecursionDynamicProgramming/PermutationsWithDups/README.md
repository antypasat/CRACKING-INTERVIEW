# Permutations with Duplicates / 有重复排列

## Problem Description / 问题描述

**English:**
Write a method to compute all permutations of a string whose characters are not necessarily unique. The list of permutations should not have duplicates.

**中文:**
编写一个方法来计算字符串的所有排列，其中字符不一定是唯一的。排列列表中不应有重复项。

## Challenge / 挑战

The key challenge is avoiding duplicate permutations when the input string has duplicate characters.

**Example:**
- Input: "aab"
- Without deduplication: ["aab", "aab", "aba", "aba", "baa", "baa"] (6 permutations)
- With deduplication: ["aab", "aba", "baa"] (3 permutations)

## Solutions / 解决方案

### Approach 1: Frequency Map / 方法1：频率映射 ⭐

**Algorithm:**
- Build a frequency map of all characters
- At each recursion level, try each unique character that still has count > 0
- Decrement count when using a character, increment when backtracking
- This naturally avoids duplicates

**Formula for expected permutations:**
```
n! / (c1! × c2! × ... × ck!)

where:
- n = total length
- c1, c2, ..., ck = frequencies of each unique character
```

**Example: "aab"**
- Total characters: 3
- Frequency: a=2, b=1
- Permutations: 3! / (2! × 1!) = 6 / 2 = 3

**Time Complexity:** O(n!)
**Space Complexity:** O(n) - frequency map + recursion stack

```javascript
function getPermutationsWithDups(str) {
  const freqMap = new Map();
  for (const char of str) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  const result = [];
  permuteWithMap(freqMap, '', str.length, result);
  return result;
}

function permuteWithMap(freqMap, prefix, remaining, result) {
  if (remaining === 0) {
    result.push(prefix);
    return;
  }

  for (const [char, count] of freqMap.entries()) {
    if (count > 0) {
      freqMap.set(char, count - 1);
      permuteWithMap(freqMap, prefix + char, remaining - 1, result);
      freqMap.set(char, count);  // Backtrack
    }
  }
}
```

### Approach 2: Sort and Skip Duplicates / 方法2：排序并跳过重复 ⭐

**Algorithm:**
- Sort the string first
- Use backtracking with a used array
- Skip duplicate characters at the same recursion level
- Key insight: if chars[i] == chars[i-1] and used[i-1] is false, skip

**Why this works:**
- Sorting groups duplicates together
- We only use duplicates in order (left to right)
- If previous duplicate isn't used, we skip current one
- This ensures we don't create duplicate permutations

**Time Complexity:** O(n! + n log n)
**Space Complexity:** O(n)

```javascript
function getPermutationsWithDups2(str) {
  const result = [];
  const chars = str.split('').sort();
  const used = new Array(chars.length).fill(false);

  function backtrack(current) {
    if (current.length === chars.length) {
      result.push(current);
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;

      // Skip duplicates: only use if previous same char is already used
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) {
        continue;
      }

      used[i] = true;
      backtrack(current + chars[i]);
      used[i] = false;
    }
  }

  backtrack('');
  return result;
}
```

### Approach 3: Generate and Filter with Set / 方法3：生成并使用Set过滤

**Algorithm:**
- Generate all permutations (including duplicates)
- Use a Set to filter out duplicates
- Less efficient but simpler to understand

**Time Complexity:** O(n! × n)
**Space Complexity:** O(n!)

```javascript
function getPermutationsWithDups3(str) {
  const result = new Set();
  const chars = str.split('');

  function backtrack(start) {
    if (start === chars.length) {
      result.add(chars.join(''));
      return;
    }

    for (let i = start; i < chars.length; i++) {
      [chars[start], chars[i]] = [chars[i], chars[start]];
      backtrack(start + 1);
      [chars[start], chars[i]] = [chars[i], chars[start]];
    }
  }

  backtrack(0);
  return Array.from(result);
}
```

## Key Insights / 关键见解

**English:**
1. **Frequency map approach:** Most efficient, avoids generating duplicates entirely
2. **Sorting helps:** Sorting groups duplicates, making them easier to skip
3. **Skip condition:** `chars[i] == chars[i-1] && !used[i-1]` is the key to avoiding duplicates
4. **Combinatorial formula:** Use n!/(c1!×c2!×...×ck!) to verify correctness
5. **Set approach:** Simple but inefficient - generates then filters duplicates

**中文:**
1. **频率映射方法：** 最高效，完全避免生成重复项
2. **排序有帮助：** 排序将重复项分组，使其更容易跳过
3. **跳过条件：** `chars[i] == chars[i-1] && !used[i-1]` 是避免重复的关键
4. **组合公式：** 使用 n!/(c1!×c2!×...×ck!) 验证正确性
5. **Set方法：** 简单但效率低 - 先生成再过滤重复项

## Detailed Example / 详细示例

**Input: "aab"**

Using Frequency Map approach:

```
freqMap = {a: 2, b: 1}

permute("", {a:2, b:1}, remaining=3)
├─ Use 'a': permute("a", {a:1, b:1}, remaining=2)
│  ├─ Use 'a': permute("aa", {a:0, b:1}, remaining=1)
│  │  └─ Use 'b': permute("aab", {a:0, b:0}, remaining=0) → "aab" ✓
│  └─ Use 'b': permute("ab", {a:1, b:0}, remaining=1)
│     └─ Use 'a': permute("aba", {a:0, b:0}, remaining=0) → "aba" ✓
└─ Use 'b': permute("b", {a:2, b:0}, remaining=2)
   └─ Use 'a': permute("ba", {a:1, b:0}, remaining=1)
      └─ Use 'a': permute("baa", {a:0, b:0}, remaining=0) → "baa" ✓

Result: ["aab", "aba", "baa"]
```

## Formula Examples / 公式示例

| String | Calculation | Result |
|--------|-------------|--------|
| "ab" | 2!/(1!×1!) | 2 |
| "aab" | 3!/(2!×1!) | 3 |
| "aabb" | 4!/(2!×2!) | 6 |
| "aabc" | 4!/(2!×1!×1!) | 12 |
| "aaaa" | 4!/4! | 1 |
| "aabbcc" | 6!/(2!×2!×2!) | 90 |
| "aaabbc" | 6!/(3!×2!×1!) | 60 |

## Skip Condition Visualization / 跳过条件可视化

For sorted "aab":

```
Position 0: Try 'a' (index 0) ✓
Position 0: Try 'a' (index 1) ✗ Skip! (chars[1]==chars[0] && !used[0])
Position 0: Try 'b' (index 2) ✓

This ensures we only start with the first 'a', not the second 'a'
If we didn't skip, we'd get duplicate permutations
```

## Comparison of Approaches / 方法比较

| Approach | Time | Space | Duplicates Generated? | Best For |
|----------|------|-------|----------------------|----------|
| Frequency Map | O(n!) | O(n) | No | Most efficient |
| Sort + Skip | O(n!+n log n) | O(n) | No | Clean logic |
| Set Filter | O(n!×n) | O(n!) | Yes, then filtered | Simple to code |

## Test Cases / 测试用例

```javascript
// Basic cases with duplicates
getPermutationsWithDups("aab")
// ["aab", "aba", "baa"] - 3 permutations

getPermutationsWithDups("aabb")
// ["aabb", "abab", "abba", "baab", "baba", "bbaa"] - 6 permutations

// All same characters
getPermutationsWithDups("aaaa")
// ["aaaa"] - 1 permutation

// No duplicates
getPermutationsWithDups("abc")
// ["abc", "acb", "bac", "bca", "cab", "cba"] - 6 permutations

// Complex case
getPermutationsWithDups("aabc")
// 12 permutations (4!/(2!×1!×1!))

// Edge cases
getPermutationsWithDups("")
// [""]

getPermutationsWithDups("a")
// ["a"]

getPermutationsWithDups("aa")
// ["aa"]
```

## Common Mistakes / 常见错误

1. **Not handling duplicates:** Simply using the no-duplicates algorithm will generate duplicate permutations
2. **Wrong skip condition:** Must check both `chars[i] == chars[i-1]` AND `!used[i-1]`
3. **Forgetting to sort:** Approach 2 requires sorted input
4. **Not counting correctly:** Verify using the formula n!/(c1!×c2!×...×ck!)
5. **Modifying frequency map incorrectly:** Must restore count after recursion (backtrack)

## Running the Solution / 运行解决方案

```bash
node solution.js
```

## Related Problems / 相关问题

- 8.7 Permutations without Duplicates
- Subsets II (with duplicates)
- Next Permutation
- Permutation Sequence
- Combination Sum II
