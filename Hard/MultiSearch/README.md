# 17.17 Multi Search

## Original Problem

**Multi Search:** Given a string `b` and an array of smaller strings `T`, design a method to search `b` for each small string in `T`. Return a map from each string in `T` to all positions in `b` where it appears.

```
Example:
b = "mississippi"
T = ["is", "ppi", "hi", "sis", "i", "ssippi"]

Output:
{
  "is": [1, 4],
  "ppi": [8],
  "hi": [],
  "sis": [3],
  "i": [1, 4, 7, 10],
  "ssippi": [5]
}
```

Hints: #480, #582, #617, #743

---

## Understanding the Problem

For each small string, find **all starting positions** in the big string where it appears.

```
Big string: "banana"
Small strings: ["an", "na", "ana"]

"an": appears at index 1, 3
"na": appears at index 2, 4
"ana": appears at index 1, 3

Result: { "an": [1,3], "na": [2,4], "ana": [1,3] }
```

### Key Insight

**Multiple approaches:**
1. For each small string, scan big string - O(b × t × s)
2. Build Trie of small strings, scan big string once - O(b² × k + t × s)
3. Use suffix tree/array for big string - O(b + t × s × log b)

For most practical cases, **Trie-based approach is optimal**.

---

## Solution Approaches

### Approach 1: Naive - Search Each String

**Strategy:** For each small string, find all occurrences in big string

```javascript
function multiSearch(big, smalls) {
  const result = {};

  for (const small of smalls) {
    result[small] = findOccurrences(big, small);
  }

  return result;
}

function findOccurrences(big, small) {
  const positions = [];

  for (let i = 0; i <= big.length - small.length; i++) {
    if (big.substring(i, i + small.length) === small) {
      positions.push(i);
    }
  }

  return positions;
}
```

**Time:** O(b × t × s) where b = big length, t = number of small strings, s = avg small string length
**Space:** O(1) excluding output

---

### Approach 2: Trie + Scan Big String (Optimal)

**Strategy:** Build Trie of small strings, then scan big string checking at each position

```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.words = [];  // Words ending here
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

    node.words.push(word);
  }

  searchFromPosition(text, start) {
    const found = [];
    let node = this.root;

    for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (!node.children.has(char)) {
        break;
      }

      node = node.children.get(char);

      // Found word(s) ending at this position
      if (node.words.length > 0) {
        found.push(...node.words);
      }
    }

    return found;
  }
}

function multiSearch(big, smalls) {
  const trie = new Trie();
  const result = {};

  // Initialize result map
  for (const small of smalls) {
    result[small] = [];
    trie.insert(small);
  }

  // Search from each position in big string
  for (let i = 0; i < big.length; i++) {
    const found = trie.searchFromPosition(big, i);

    for (const word of found) {
      result[word].push(i);
    }
  }

  return result;
}
```

**Time:** O(b² × k + t × s) where k = max small string length
- Build Trie: O(t × s)
- Scan big string: O(b² × k) worst case, O(b × k) typical

**Space:** O(t × s) for Trie

✅ **OPTIMAL FOR MOST CASES**

---

### Approach 3: Suffix Array/Tree (Big String)

**Strategy:** Build suffix structure for big string, search for each small string

```javascript
function multiSearch(big, smalls) {
  const result = {};

  // Build suffix array (simplified - full implementation is complex)
  const suffixes = [];
  for (let i = 0; i < big.length; i++) {
    suffixes.push({ index: i, suffix: big.substring(i) });
  }

  // Sort suffixes
  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

  // For each small string, binary search in suffix array
  for (const small of smalls) {
    result[small] = [];

    for (const suffix of suffixes) {
      if (suffix.suffix.startsWith(small)) {
        result[small].push(suffix.index);
      }
    }

    result[small].sort((a, b) => a - b);
  }

  return result;
}
```

**Time:** O(b log b + t × s × log b)
**Space:** O(b)

**Good when:** Big string is reused with many different queries

---

## Algorithm Explanation

### Trie-Based Approach Walkthrough

```
Big string: "mississippi"
Small strings: ["is", "sis", "i"]

Step 1: Build Trie
        root
       /    \
      i      s
       \      \
        s      i
               \
                s

Step 2: Search from each position

i=0, char='m':
  'm' not in Trie, skip

i=1, char='i':
  i → (no word)
  i → s → found "is"!
  Result: {"is": [1]}

i=2, char='s':
  s → (no word)
  s → i → (no word)
  s → i → s → found "sis"!
  Result: {"sis": [3]} (wait, let me recalculate)

Actually:
i=1: "is" starts here → found at position 1
i=2: "s"
i=3: "si" then "sis" → found at position 3
i=4: "is" starts here → found at position 4

And so on...
```

### Visual Example

```
Big: "mississippi"
     0123456789...

Search from position 1:
  m-i-s-s-i-s-s-i-p-p-i
    ↑
    Start matching "i" → found "i" at 1
    Continue "is" → found "is" at 1

Search from position 4:
  m-i-s-s-i-s-s-i-p-p-i
          ↑
          Start matching "i" → found "i" at 4
          Continue "is" → found "is" at 4
```

---

## Complexity Analysis

| Approach | Preprocessing | Query | Space | Best For |
|----------|--------------|-------|-------|----------|
| Naive | - | O(b×t×s) | O(1) | Small inputs |
| Trie (small) | O(t×s) | O(b²×k) | O(t×s) | **General use** |
| Suffix Tree (big) | O(b) | O(t×s×log b) | O(b) | Reused big string |

---

## Edge Cases

```javascript
// Empty big string
multiSearch("", ["test"]) → {"test": []}

// Empty small strings array
multiSearch("test", []) → {}

// Empty string in smalls
multiSearch("test", [""]) → {"": [0,1,2,3,4]}

// Small string longer than big
multiSearch("hi", ["hello"]) → {"hello": []}

// Overlapping matches
multiSearch("aaa", ["aa"]) → {"aa": [0, 1]}

// No matches
multiSearch("abc", ["xyz"]) → {"xyz": []}

// Big string is small string
multiSearch("test", ["test"]) → {"test": [0]}
```

---

## Common Mistakes

### 1. Not handling duplicates in small strings

```javascript
// If smalls = ["is", "is"], should we have two entries?
// Usually treat as one unique string

const uniqueSmalls = [...new Set(smalls)];
```

### 2. Wrong Trie traversal

```javascript
// ❌ WRONG - only checking if whole word exists
if (node.isWord) found.push(word);

// ✅ CORRECT - a node might have multiple words ending there
found.push(...node.words);
```

### 3. Not initializing all small strings in result

```javascript
// ❌ WRONG - missing strings with no matches
const result = {};
// only add when found

// ✅ CORRECT - initialize all
for (const small of smalls) {
  result[small] = [];
}
```

---

## Optimizations

### 1. Early termination in Trie search

```javascript
searchFromPosition(text, start) {
  const found = [];
  let node = this.root;
  let maxLength = 0;  // Track longest word in Trie

  for (let i = start; i < text.length && i - start < maxLength; i++) {
    // Stop if we've exceeded longest possible match
  }
}
```

### 2. Use Aho-Corasick algorithm

For the most efficient multi-pattern matching, use **Aho-Corasick** which finds all patterns in O(b + t×s + z) where z = number of matches.

```javascript
// Aho-Corasick is like Trie with failure links
// Allows scanning text once and finding all patterns simultaneously
```

---

## Interview Tips

1. **Clarify requirements:**
   - Are small strings unique?
   - Can small string be empty?
   - Do we care about overlapping matches?

2. **Start with naive:** "I could search for each string independently"

3. **Explain Trie optimization:**
   - "Build Trie of all small strings"
   - "Scan big string once, checking matches from each position"

4. **Draw the Trie:**
   ```
   Small: ["is", "in", "i"]

        root
         |
         i ← word "i"
        / \
       s   n
       ↑   ↑
    "is" "in"
   ```

5. **Discuss trade-offs:**
   - Few strings: naive is fine
   - Many strings: Trie is better
   - Many queries on same big string: suffix tree

6. **Mention Aho-Corasick:** Shows advanced knowledge

---

## Key Takeaways

1. **Trie of small strings** is usually the best approach

2. Scan big string from each position, matching against Trie

3. **Time complexity:** O(b² × k) worst case, much better in practice

4. **Alternative:** Suffix tree/array for big string if reused

5. **Aho-Corasick** is optimal: O(b + t×s + z) time

6. This pattern appears in:
   - Multi-pattern string matching
   - Virus scanning
   - Text search in editors
   - Keyword extraction

---

**Time Complexity:** O(b² × k + t × s) with Trie
**Space Complexity:** O(t × s)
**Difficulty:** Hard
