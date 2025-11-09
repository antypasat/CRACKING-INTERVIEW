# 17.13 Re-Space

## Original Problem

**Re-Space:** Oh, no! You have accidentally removed all spaces, punctuation, and capitalization in a lengthy document. A sentence like "I reset the computer. It still didn't boot!" became "iresetthecomputeritstilldidntboot". You'll deal with the punctuation and capitalization later; right now you need to re-insert the spaces. Most of the words are in a dictionary but a few are not. Given a dictionary (a list of strings) and the document (a string), design an algorithm to unconcatenate the document in a way that minimizes the number of unrecognized characters.

```
Example:
Dictionary: ["looked", "just", "like", "her", "brother"]
Document: "jesslookedjustliketimherbrother"

Output: "jess looked just like tim her brother"
Unrecognized: "jess", "tim" (8 characters)

Alternative: "jesslookedjustliketimherbrother" (all unrecognized, worse)
```

Hints: #496, #623, #656, #677, #739, #749

---

## Understanding the Problem

We need to **segment** the string into dictionary words and unrecognized characters, **minimizing** unrecognized count.

```
Input: "thisisatest"
Dictionary: ["this", "is", "a", "test"]

Best: "this is a test" → 0 unrecognized ✓

Input: "thisisnot"
Dictionary: ["this", "is", "not"]

Best: "this is not" → 0 unrecognized ✓

Input: "abcdefg"
Dictionary: ["abc", "def"]

Best: "abc def g" → 1 unrecognized (g)
```

### Key Insight

This is a **Dynamic Programming** problem similar to word break, but we're **minimizing** unrecognized characters instead of just checking if possible.

---

## Solution Approaches

### Approach 1: Recursive Backtracking

**Strategy:** Try all possible segmentations, return best

```javascript
function respace(dictionary, document) {
  const dict = new Set(dictionary);

  function helper(index) {
    if (index >= document.length) {
      return { unrecognized: 0, segmentation: "" };
    }

    let best = {
      unrecognized: document.length,
      segmentation: ""
    };

    // Try all possible next words
    for (let end = index + 1; end <= document.length; end++) {
      const word = document.substring(index, end);
      const isValid = dict.has(word);

      const rest = helper(end);

      const current = {
        unrecognized: rest.unrecognized + (isValid ? 0 : word.length),
        segmentation: word + (rest.segmentation ? " " + rest.segmentation : "")
      };

      if (current.unrecognized < best.unrecognized) {
        best = current;
      }
    }

    return best;
  }

  return helper(0);
}
```

**Time:** O(2^n) - exponential
**Space:** O(n) - recursion stack

---

### Approach 2: Dynamic Programming (Optimal)

**Strategy:** dp[i] = minimum unrecognized characters for document[0...i)

```javascript
function respace(dictionary, document) {
  const dict = new Set(dictionary);
  const n = document.length;

  // dp[i] = min unrecognized characters for document[0...i)
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;  // Empty string

  for (let i = 1; i <= n; i++) {
    // Option 1: Treat char at i-1 as unrecognized
    dp[i] = dp[i - 1] + 1;

    // Option 2: Try all words ending at i
    for (let j = 0; j < i; j++) {
      const word = document.substring(j, i);
      if (dict.has(word)) {
        dp[i] = Math.min(dp[i], dp[j]);
      }
    }
  }

  return dp[n];
}
```

**Time:** O(n² + m) where n = document length, m = dictionary size
**Space:** O(n + m)

✅ **OPTIMAL FOR COUNT**

---

### Approach 3: DP with Path Reconstruction

**Strategy:** Track both count and actual segmentation

```javascript
function respace(dictionary, document) {
  const dict = new Set(dictionary);
  const n = document.length;

  // dp[i] = {count: min unrecognized, segmentation: actual split}
  const dp = new Array(n + 1);
  dp[0] = { count: 0, segmentation: [] };

  for (let i = 1; i <= n; i++) {
    // Default: treat as unrecognized
    dp[i] = {
      count: dp[i - 1].count + 1,
      segmentation: [...dp[i - 1].segmentation, document[i - 1]]
    };

    // Try all words ending at i
    for (let j = 0; j < i; j++) {
      const word = document.substring(j, i);

      if (dict.has(word)) {
        if (dp[j].count < dp[i].count) {
          dp[i] = {
            count: dp[j].count,
            segmentation: [...dp[j].segmentation, word]
          };
        }
      }
    }
  }

  return {
    unrecognized: dp[n].count,
    result: dp[n].segmentation.join(" ")
  };
}
```

**Time:** O(n²)
**Space:** O(n²) - storing segmentations

---

### Approach 4: Trie + DP (Most Efficient)

**Strategy:** Use Trie for faster dictionary lookups

```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isWord = true;
  }
}

function respace(dictionary, document) {
  const trie = new Trie();
  for (const word of dictionary) {
    trie.insert(word);
  }

  const n = document.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    // Option 1: Unrecognized character
    dp[i] = dp[i - 1] + 1;

    // Option 2: Check words ending at i using Trie
    let node = trie.root;
    for (let j = i - 1; j >= 0; j--) {
      const char = document[j];
      if (!node.children.has(char)) break;

      node = node.children.get(char);
      if (node.isWord) {
        dp[i] = Math.min(dp[i], dp[j]);
      }
    }
  }

  return dp[n];
}
```

**Time:** O(n² + m × k) where k = average word length
**Space:** O(m × k) for Trie

✅ **OPTIMAL WITH LARGE DICTIONARY**

---

## Algorithm Explanation

### DP State Transition

```
Document: "jesslookedjust"
Dictionary: {"jess", "looked", "just", "like"}

dp[i] = minimum unrecognized for document[0...i)

i=0: dp[0] = 0 (empty)

i=1: char='j'
  Unrecognized: dp[0] + 1 = 1
  No words end here
  dp[1] = 1

i=2: char='e'
  Unrecognized: dp[1] + 1 = 2
  No words end here
  dp[2] = 2

i=3: char='s'
  Unrecognized: dp[2] + 1 = 3
  No words end here
  dp[3] = 3

i=4: char='s'
  Unrecognized: dp[3] + 1 = 4
  Check "jess" (0 to 4): in dict!
    dp[4] = min(4, dp[0]) = 0
  dp[4] = 0 ✓

i=5: char='l'
  Unrecognized: dp[4] + 1 = 1
  No words end here
  dp[5] = 1

...and so on
```

### Example Walkthrough

```
Document: "abcdef"
Dictionary: {"abc", "def", "abcdef"}

dp[0] = 0

i=1 'a': dp[1] = 1 (no word)
i=2 'b': dp[2] = 2 (no word)
i=3 'c': dp[3] = min(3, dp[0]) = 0 ("abc" found)
i=4 'd': dp[4] = min(1, dp[0]) = 0 (wait, no "abcd")
         dp[4] = 1
i=5 'e': dp[5] = 2
i=6 'f': dp[6] = min(3, dp[3], dp[0]) = 0
         ("def" from 3-6, "abcdef" from 0-6)

Result: 0 unrecognized
Segmentation: "abcdef" or "abc def"
```

---

## Complexity Analysis

| Approach | Time | Space | Returns Segmentation? |
|----------|------|----------|---------------------|
| Recursive | O(2^n) | O(n) | Yes |
| DP | O(n²) | O(n) | No |
| DP + Reconstruction | O(n²) | O(n²) | Yes |
| Trie + DP | O(n² + m×k) | O(m×k) | No (can add) |

---

## Edge Cases

```javascript
// Empty document
respace(["a"], "") → 0

// Empty dictionary
respace([], "abc") → 3 (all unrecognized)

// All words in dictionary
respace(["hello", "world"], "helloworld") → 0

// No words in dictionary
respace(["foo", "bar"], "testing") → 7

// Overlapping words
respace(["cat", "cats", "and", "dog"], "catsanddog")
→ 0 ("cats and dog" or "cat sand dog")

// Single character words
respace(["a", "b", "c"], "abc") → 0
```

---

## Common Mistakes

### 1. Wrong DP initialization

```javascript
// ❌ WRONG - all zeros
const dp = new Array(n + 1).fill(0);

// ✅ CORRECT - infinity except dp[0]
const dp = new Array(n + 1).fill(Infinity);
dp[0] = 0;
```

### 2. Not considering unrecognized option

```javascript
// ❌ WRONG - only checking dictionary words
for (let j = 0; j < i; j++) {
  if (dict.has(word)) dp[i] = min(dp[i], dp[j]);
}

// ✅ CORRECT - always consider unrecognized
dp[i] = dp[i - 1] + 1;  // Start with this
for (let j = 0; j < i; j++) {
  // Then check dictionary
}
```

### 3. Wrong substring indices

```javascript
// ❌ WRONG
const word = document.substring(j, i - 1);

// ✅ CORRECT
const word = document.substring(j, i);
```

---

## Interview Tips

1. **Recognize the pattern:** "This is word break with minimization"

2. **Start with DP state:** "dp[i] = minimum unrecognized for first i characters"

3. **Explain two options:**
   - Treat current character as unrecognized
   - Find a dictionary word ending here

4. **Draw the DP table:**
   ```
   "abc" with dict={"ab", "c"}
   i:   0  1  2  3
   dp: [0, 1, 0, 0]
            ↑  ↑  ↑
          'a' 'ab' 'abc'='ab'+'c'
   ```

5. **Discuss optimization:** "Trie makes dictionary lookup faster"

6. **Mention path reconstruction:** "We can track actual segmentation"

---

## Key Takeaways

1. **DP minimization** problem, not just feasibility

2. **State:** dp[i] = min unrecognized for document[0...i)

3. **Transition:** Try all possible words ending at position i

4. **Trie optimization** helpful for large dictionaries

5. Tracking **segmentation** requires storing paths

6. Similar to: Word Break, Word Break II, but with optimization goal

---

**Time Complexity:** O(n²) or O(n² + m×k) with Trie
**Space Complexity:** O(n) or O(m×k) with Trie
**Difficulty:** Hard
