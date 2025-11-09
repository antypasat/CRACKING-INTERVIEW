# 17.15 Longest Word

## Original Problem

**Longest Word:** Given a list of words, write a program to find the longest word made of other words in the list.

```
Example:
Input: ["cat", "banana", "dog", "nana", "walk", "walker", "dogwalker"]

Output: "dogwalker" (made of "dog" + "walker")

Alternative valid: "walker" (made of "walk" + "er")
But "dogwalker" is longer
```

Hints: #475, #499, #543, #589

---

## Understanding the Problem

Find the **longest compound word** - a word that can be formed by concatenating other words from the list.

```
Words: ["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses"]

"catsdogcats" = "cats" + "dog" + "cats" ✓
"dogcatsdog" = "dog" + "cats" + "dog" ✓
"hippopotamuses" - cannot be formed ✗

Longest: "catsdogcats" or "dogcatsdog" (both length 11)
```

### Key Insight

For each word, check if it can be built from other words using:
1. **Recursion** with memoization
2. **Dynamic Programming**
3. **Trie** for efficient prefix checking

---

## Solution Approaches

### Approach 1: Recursive with Memoization

**Strategy:** For each word, recursively check if it can be split into other words

```javascript
function findLongestWord(words) {
  const wordSet = new Set(words);
  const memo = new Map();

  // Sort by length descending to find longest first
  words.sort((a, b) => b.length - a.length);

  for (const word of words) {
    if (canBuildWord(word, true, wordSet, memo)) {
      return word;
    }
  }

  return "";
}

function canBuildWord(word, isOriginal, wordSet, memo) {
  if (memo.has(word)) return memo.get(word);

  // Check all possible splits
  for (let i = 1; i < word.length; i++) {
    const left = word.substring(0, i);
    const right = word.substring(i);

    if (wordSet.has(left)) {
      // If right part is in dictionary, we're done
      if (wordSet.has(right) && !isOriginal) {
        memo.set(word, true);
        return true;
      }

      // Or if right can be built from other words
      if (canBuildWord(right, false, wordSet, memo)) {
        memo.set(word, true);
        return true;
      }
    }
  }

  memo.set(word, false);
  return false;
}
```

**Time:** O(n × m² + n log n) where n = number of words, m = max word length
**Space:** O(n × m) for memoization

✅ **GOOD BALANCE**

---

### Approach 2: Dynamic Programming

**Strategy:** For each word, use DP to check if it can be formed

```javascript
function findLongestWord(words) {
  const wordSet = new Set(words);

  // Sort by length descending
  words.sort((a, b) => b.length - a.length);

  for (const word of words) {
    if (canFormWord(word, wordSet)) {
      return word;
    }
  }

  return "";
}

function canFormWord(word, wordSet) {
  if (word.length === 0) return false;

  const n = word.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;  // Empty string can be formed

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j]) {
        const substring = word.substring(j, i);

        // Don't count the word itself (must use OTHER words)
        if (substring !== word && wordSet.has(substring)) {
          dp[i] = true;
          break;
        }
      }
    }
  }

  return dp[n];
}
```

**Time:** O(n × m² + n log n)
**Space:** O(m) for DP array per word

---

### Approach 3: Trie-Based Approach

**Strategy:** Use Trie for efficient prefix matching

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

  search(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char);
    }
    return node.isWord;
  }
}

function findLongestWord(words) {
  const trie = new Trie();
  for (const word of words) {
    trie.insert(word);
  }

  words.sort((a, b) => b.length - a.length);

  for (const word of words) {
    if (canBuildWithTrie(word, 0, 0, trie, new Map())) {
      return word;
    }
  }

  return "";
}

function canBuildWithTrie(word, index, splits, trie, memo) {
  const key = `${index},${splits}`;
  if (memo.has(key)) return memo.get(key);

  if (index === word.length) {
    return splits >= 2;  // Must have at least 2 parts
  }

  let node = trie.root;

  for (let i = index; i < word.length; i++) {
    const char = word[i];
    if (!node.children.has(char)) {
      memo.set(key, false);
      return false;
    }

    node = node.children.get(char);

    if (node.isWord) {
      if (canBuildWithTrie(word, i + 1, splits + 1, trie, memo)) {
        memo.set(key, true);
        return true;
      }
    }
  }

  memo.set(key, false);
  return false;
}
```

**Time:** O(n × m × k + n log n) where k = average splits
**Space:** O(n × m) for Trie

---

## Algorithm Explanation

### Recursive Approach Walkthrough

```
Words: ["dog", "cat", "walker", "dogwalker"]
Check: "dogwalker"

canBuildWord("dogwalker"):
  i=1: left="d", not in set
  i=2: left="do", not in set
  i=3: left="dog", IN SET ✓
       right="walker"

       Is "walker" in set? YES ✓
       Return true!

Result: "dogwalker" can be built
```

### Dynamic Programming Walkthrough

```
Word: "dogwalker"
Dict: {"dog", "walk", "walker", "er"}

dp[i] = can form word[0...i) from other words

i=0: dp[0] = true (base case)

i=1: "d"
  j=0: dp[0]=true, substring="d", not in dict
  dp[1] = false

i=2: "do"
  dp[2] = false

i=3: "dog"
  j=0: dp[0]=true, substring="dog", in dict ✓
  dp[3] = true

i=4: "dogw"
  dp[4] = false

...

i=6: "dogwal"
  dp[6] = false

i=9: "dogwalker"
  j=3: dp[3]=true, substring="walker", in dict ✓
  dp[9] = true

Result: "dogwalker" can be formed!
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive + Memo | O(n × m²) | O(n × m) | Clean code |
| DP | O(n × m²) | O(m) | Space efficient |
| Trie | O(n × m × k) | O(n × m) | Good for many words |

All need O(n log n) for sorting.

---

## Edge Cases

```javascript
// Empty list
findLongestWord([]) → ""

// Single word
findLongestWord(["hello"]) → ""

// No compound words
findLongestWord(["cat", "dog", "bird"]) → ""

// Multiple valid answers (return longest)
findLongestWord(["a", "aa", "aaa", "aaaa"])
→ "aaaa" (if all can be formed from "a")

// Word can't use itself
findLongestWord(["test"]) → ""
// "test" can't be made from "test"

// Tied lengths (return any)
findLongestWord(["cat", "cats", "dog", "dogs"])
→ "cats" or "dogs" (both length 4)
```

---

## Common Mistakes

### 1. Allowing word to use itself

```javascript
// ❌ WRONG - word can equal substring
if (wordSet.has(substring)) {
  dp[i] = true;
}

// ✅ CORRECT - exclude the word itself
if (substring !== word && wordSet.has(substring)) {
  dp[i] = true;
}
```

### 2. Not sorting by length

```javascript
// ❌ WRONG - might return shorter word first
for (const word of words) {
  if (canBuild(word)) return word;
}

// ✅ CORRECT - sort descending first
words.sort((a, b) => b.length - a.length);
```

### 3. Wrong base case in DP

```javascript
// ❌ WRONG - requiring at least one split
if (dp[j] && j > 0) {
  // This prevents valid formations
}

// ✅ CORRECT - allow dp[0]
if (dp[j]) {
  // But ensure we don't count word itself
}
```

---

## Optimizations

### 1. Early termination

```javascript
// If we found a word of length L, skip words of length < L
let maxFound = 0;
for (const word of sortedWords) {
  if (word.length < maxFound) break;
  if (canBuild(word)) {
    return word;
  }
}
```

### 2. Build from shorter words

```javascript
// Process words in length order
// Mark which words can be formed
// Use that info for longer words
```

---

## Interview Tips

1. **Clarify requirements:**
   - Can word use itself? No
   - Return any longest or all? Any
   - What if tie? Any is fine
   - Must use at least 2 words? Yes

2. **Start with approach:**
   - "Sort by length descending"
   - "Check each word if it can be built"

3. **Explain word break:**
   - "This is similar to word break problem"
   - "But we exclude the word itself"

4. **Draw example:**
   ```
   "dogwalker" = "dog" + "walker"
                  ↑        ↑
               In dict  In dict
   ```

5. **Discuss optimizations:**
   - Memoization for overlapping subproblems
   - Trie for prefix matching
   - Early termination

6. **Consider variations:**
   - Find all compound words
   - Find longest using exactly k words
   - Maximum number of ways to form a word

---

## Key Takeaways

1. **Sort by length** descending to find longest first

2. **Word break** pattern with exclusion of the word itself

3. **Memoization** crucial to avoid recomputation

4. Must use **at least 2 words** to form compound

5. **DP approach:** dp[i] = can form word[0...i) from dictionary

6. **Trie optimization** helpful with large dictionaries

7. This pattern appears in: word break, word ladder, concatenated words

---

**Time Complexity:** O(n × m² + n log n)
**Space Complexity:** O(n × m)
**Difficulty:** Hard
