# 17.25 Word Rectangle

## Original Problem

**Word Rectangle:** Given a list of millions of words, design an algorithm to create the largest possible rectangle of letters such that every row forms a word (reading left to right) and every column forms a word (reading top to bottom). The words need not be chosen consecutively from the list but all rows must be the same length and all columns must be the same length.

```
Example:
Words: ["cat", "dog", "hat", "cow", "two", "hat", "oat", "wag"]

Rectangle:
  d o g
  o a t
  w a g

Rows: dog, oat, wag (all valid words)
Columns: dow, oaa, gtg (wait, these aren't words)

Better:
  c o w
  a t e  (if "ate" and "coe", "owe", "wet" exist)
  t e n
```

Hints: #477, #499, #542, #551, #576, #601, #619, #655

---

## Understanding the Problem

Create the **largest rectangle** where:
- Each **row** is a valid word
- Each **column** is a valid word
- All rows have same length
- All columns have same length

```
Valid 3×4 rectangle:
  d o g s
  a b l e
  m o p e

Rows: dogs, able, mope
Columns: dam, boa, glp, see

Wait, "glp" is not a word. Let me revise...

Valid 2×3 rectangle:
  c a t
  o w l

Rows: cat, owl
Columns: co, aw, tl

Hmm, "tl" is not a word either.

This is a hard problem!
```

### Key Insight

1. **Group words by length**
2. Try dimensions (rows × cols)
3. Use **Trie** to quickly validate partial columns
4. **Backtracking** to build rectangle row by row

---

## Solution Approaches

### Approach 1: Brute Force Backtracking

**Strategy:** Try all combinations of words

```javascript
function maxRectangle(words) {
  // Group words by length
  const wordsByLength = new Map();

  for (const word of words) {
    const len = word.length;
    if (!wordsByLength.has(len)) {
      wordsByLength.set(len, []);
    }
    wordsByLength.get(len).push(word);
  }

  let maxArea = 0;
  let maxRect = null;

  // Try different dimensions
  const lengths = Array.from(wordsByLength.keys()).sort((a, b) => b - a);

  for (const rowLen of lengths) {
    for (const colLen of lengths) {
      const rect = findRectangle(
        wordsByLength.get(rowLen),
        wordsByLength.get(colLen),
        rowLen,
        colLen
      );

      if (rect && rowLen * colLen > maxArea) {
        maxArea = rowLen * colLen;
        maxRect = rect;
      }

      if (maxArea > rowLen * lengths[0]) break;  // Can't do better
    }
  }

  return maxRect;
}

function findRectangle(rowWords, colWords, rowLen, colLen) {
  if (!rowWords || !colWords) return null;

  const wordSet = new Set(colWords);
  const rectangle = [];

  function backtrack(row) {
    if (row === colLen) {
      // Check if all columns are valid words
      for (let c = 0; c < rowLen; c++) {
        const column = rectangle.map(r => r[c]).join('');
        if (!wordSet.has(column)) return false;
      }
      return true;
    }

    for (const word of rowWords) {
      // Check if this word is compatible with current columns
      let valid = true;

      for (let c = 0; c < rowLen; c++) {
        const partialColumn = rectangle.map(r => r[c]).join('') + word[c];

        // Check if any word in colWords starts with this partial
        let hasPrefix = false;
        for (const colWord of colWords) {
          if (colWord.startsWith(partialColumn)) {
            hasPrefix = true;
            break;
          }
        }

        if (!hasPrefix) {
          valid = false;
          break;
        }
      }

      if (valid) {
        rectangle.push(word);
        if (backtrack(row + 1)) return true;
        rectangle.pop();
      }
    }

    return false;
  }

  if (backtrack(0)) {
    return rectangle;
  }

  return null;
}
```

**Time:** O(W^n) where W = words per length, n = rectangle height
**Space:** O(n) recursion depth

---

### Approach 2: Trie + Backtracking (Optimal)

**Strategy:** Use Trie for efficient prefix checking

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

  hasPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char);
    }
    return true;
  }

  isWord(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char);
    }
    return node.isWord;
  }
}

function maxRectangle(words) {
  const wordsByLength = new Map();
  const triesByLength = new Map();

  // Group and build tries
  for (const word of words) {
    const len = word.length;

    if (!wordsByLength.has(len)) {
      wordsByLength.set(len, []);
      triesByLength.set(len, new Trie());
    }

    wordsByLength.get(len).push(word);
    triesByLength.get(len).insert(word);
  }

  let maxArea = 0;
  let maxRect = null;

  const lengths = Array.from(wordsByLength.keys()).sort((a, b) => b - a);

  for (const rowLen of lengths) {
    for (const colLen of lengths) {
      if (rowLen * colLen <= maxArea) continue;

      const rect = buildRectangle(
        wordsByLength.get(rowLen),
        triesByLength.get(colLen),
        rowLen,
        colLen
      );

      if (rect) {
        maxArea = rowLen * colLen;
        maxRect = rect;
      }
    }
  }

  return maxRect;
}

function buildRectangle(words, columnTrie, rowLen, colLen) {
  const rectangle = [];

  function backtrack(row) {
    if (row === colLen) {
      return true;  // All rows added, columns validated during construction
    }

    for (const word of words) {
      // Check if word is compatible with current partial columns
      let isValid = true;

      for (let c = 0; c < rowLen; c++) {
        const partialColumn = rectangle.map(r => r[c]).join('') + word[c];

        // If this is the last row, check if column is a complete word
        if (row === colLen - 1) {
          if (!columnTrie.isWord(partialColumn)) {
            isValid = false;
            break;
          }
        } else {
          // Otherwise, check if partial column is a valid prefix
          if (!columnTrie.hasPrefix(partialColumn)) {
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        rectangle.push(word);
        if (backtrack(row + 1)) return true;
        rectangle.pop();
      }
    }

    return false;
  }

  if (backtrack(0)) {
    return rectangle;
  }

  return null;
}
```

**Time:** O(W^n) but with massive pruning via Trie
**Space:** O(total words × avg length) for Tries

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Trie-Based Backtracking

```
Words of length 3: [cat, car, dog, dot, god, got]

Build Trie for length 3:
      root
     / | \
    c  d  g
   /   |\  |\
  a    o o o o
  |    |\ |\ |
  t r  g t d t

Try building 3×3 rectangle:

Row 0: Try "cat"
  Partial columns: ["c", "a", "t"]
  All have prefixes in Trie ✓

Row 1: Try "dog"
  Partial columns: ["cd", "ao", "tg"]
  Check Trie: "cd" has no prefix ✗
  Backtrack

Row 1: Try "car"
  Partial columns: ["cc", "aa", "tr"]
  Check Trie: "cc" has no prefix ✗
  Backtrack

...and so on

If we find valid rectangle:
  c a t
  a r e  (if "are" exists)
  r e a  (if "rea" exists)

Columns: car, are, tea
All valid! ✓
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(W^n) | O(n) | Extremely slow |
| Trie + Backtracking | O(W^n) | O(W×L) | **Massive pruning** ✅ |

W = words per length, n = rectangle dimension, L = word length

---

## Edge Cases

```javascript
// Empty word list
maxRectangle([]) → null

// Single word
maxRectangle(["cat"]) → ["c","a","t"] (1×3 or 3×1)

// No valid rectangles
maxRectangle(["aaa", "bbb", "ccc"]) → null
  // Columns would be "abc", "abc", "abc" - not in list

// All same length
maxRectangle(["cat", "dog", "hat"])
→ Try to find 3×3 if columns are valid

// Different lengths
maxRectangle(["a", "ab", "abc"])
→ Try different dimensions
```

---

## Common Mistakes

### 1. Not using Trie for prefix checking

```javascript
// ❌ WRONG - checking all words for prefix
let hasPrefix = false;
for (const word of words) {
  if (word.startsWith(partial)) hasPrefix = true;
}

// ✅ CORRECT - O(m) Trie lookup
if (!trie.hasPrefix(partial)) return false;
```

### 2. Forgetting to validate final columns

```javascript
// ❌ WRONG - not checking last row creates valid words
if (row === colLen) return true;

// ✅ CORRECT - validate complete columns
if (row === colLen - 1) {
  if (!columnTrie.isWord(partialColumn)) {
    isValid = false;
  }
}
```

### 3. Not trying largest dimensions first

```javascript
// ❌ WRONG - trying small dimensions first
for (const len of lengths)

// ✅ CORRECT - largest first for max area
lengths.sort((a, b) => b - a);
```

---

## Optimizations

### 1. Early termination

```javascript
// If current area can't beat max, skip
if (rowLen * colLen <= maxArea) continue;
```

### 2. Word frequency optimization

```javascript
// Use more common words first
// Sort by frequency or alphabetically for better pruning
```

### 3. Dimension ordering

```javascript
// Try square dimensions first (n×n)
// Then try dimensions close to square
// Skip dimensions unlikely to succeed
```

---

## Interview Tips

1. **Understand the problem:**
   - "Every row AND column must be valid words"
   - "Find largest area rectangle"

2. **Start with structure:**
   - "Group words by length"
   - "Try different dimensions"

3. **Explain Trie benefit:**
   - "Quick prefix checking"
   - "Prune invalid partial columns early"

4. **Draw example:**
   ```
   c a t
   a r e
   r e a

   Rows: cat, are, rea
   Cols: car, are, tea
   ```

5. **Discuss complexity:**
   - "Without Trie: check all words for prefix"
   - "With Trie: O(m) per check"

6. **Mention challenges:**
   - "This is very hard in practice"
   - "Even with optimization, can be slow"

---

## Key Takeaways

1. **Trie is essential** for efficient prefix validation

2. **Backtracking** with aggressive pruning

3. Try **largest dimensions first** for maximum area

4. Group words by length for easier dimension selection

5. This is a **hard constraint satisfaction** problem

6. Real-world applications:
   - Crossword generation
   - Word puzzles
   - Cryptic crosswords

---

**Time Complexity:** O(W^n) with Trie pruning
**Space Complexity:** O(W × L) for Tries
**Difficulty:** Hard (very challenging!)
