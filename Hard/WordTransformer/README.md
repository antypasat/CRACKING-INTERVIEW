# 17.22 Word Transformer

## Original Problem

**Word Transformer:** Given two words of equal length that are in a dictionary, write a method to transform one word into another word by changing only one letter at a time. The new word you get in each step must be in the dictionary.

```
Example:
Start: "DAMP"
End: "LIKE"
Dictionary: [DAMP, LAMP, LIMP, LIME, LIKE, ...]

Output: DAMP → LAMP → LIMP → LIME → LIKE
```

Hints: #506, #535, #556, #580, #598, #618, #738

---

## Understanding the Problem

This is the **"Word Ladder"** problem. Find the shortest transformation sequence where:
1. Each word differs by exactly one letter
2. Every intermediate word must be in dictionary
3. All words have the same length

```
Example:
From: "hit"
To: "cog"
Dictionary: [hot, dot, dog, lot, log, cog]

Path: hit → hot → dot → dog → cog
Length: 5
```

### Key Insight

This is a **graph problem** - use BFS to find shortest path:
- Each word is a node
- Edge exists if words differ by one letter
- BFS finds shortest transformation

---

## Solution Approaches

### Approach 1: BFS (Optimal)

**Strategy:** Breadth-first search for shortest path

```javascript
function transformWord(start, end, dictionary) {
  if (start === end) return [start];
  if (!dictionary.has(end)) return null;

  const wordSet = new Set(dictionary);
  const queue = [[start, [start]]];  // [word, path]
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    // Try all one-letter transformations
    for (const nextWord of getNextWords(current, wordSet)) {
      if (nextWord === end) {
        return [...path, nextWord];
      }

      if (!visited.has(nextWord)) {
        visited.add(nextWord);
        queue.push([nextWord, [...path, nextWord]]);
      }
    }
  }

  return null;  // No transformation found
}

function getNextWords(word, dictionary) {
  const nextWords = [];

  for (let i = 0; i < word.length; i++) {
    for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
      const char = String.fromCharCode(c);

      if (char !== word[i]) {
        const newWord = word.substring(0, i) + char + word.substring(i + 1);

        if (dictionary.has(newWord)) {
          nextWords.push(newWord);
        }
      }
    }
  }

  return nextWords;
}
```

**Time:** O(M² × N) where M = word length, N = dictionary size
**Space:** O(N) for queue and visited set

✅ **OPTIMAL FOR SHORTEST PATH**

---

### Approach 2: Bidirectional BFS (Faster)

**Strategy:** Search from both ends simultaneously

```javascript
function transformWord(start, end, dictionary) {
  if (start === end) return [start];
  if (!dictionary.has(end)) return null;

  const wordSet = new Set(dictionary);

  let beginSet = new Set([start]);
  let endSet = new Set([end]);

  const beginParent = new Map([[start, null]]);
  const endParent = new Map([[end, null]]);

  while (beginSet.size > 0 && endSet.size > 0) {
    // Always expand smaller set
    if (beginSet.size > endSet.size) {
      [beginSet, endSet] = [endSet, beginSet];
      [beginParent, endParent] = [endParent, beginParent];
    }

    const nextSet = new Set();

    for (const word of beginSet) {
      for (const nextWord of getNextWords(word, wordSet)) {
        // Found connection!
        if (endSet.has(nextWord)) {
          return constructPath(nextWord, beginParent, endParent);
        }

        if (!beginParent.has(nextWord)) {
          beginParent.set(nextWord, word);
          nextSet.add(nextWord);
        }
      }
    }

    beginSet = nextSet;
  }

  return null;
}

function constructPath(meetPoint, beginParent, endParent) {
  const path = [];

  // Build path from start to meeting point
  let word = meetPoint;
  while (word !== null) {
    path.unshift(word);
    word = beginParent.get(word);
  }

  // Build path from meeting point to end
  word = endParent.get(meetPoint);
  while (word !== null) {
    path.push(word);
    word = endParent.get(word);
  }

  return path;
}

function getNextWords(word, dictionary) {
  const nextWords = [];

  for (let i = 0; i < word.length; i++) {
    for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
      const char = String.fromCharCode(c);

      if (char !== word[i]) {
        const newWord = word.substring(0, i) + char + word.substring(i + 1);

        if (dictionary.has(newWord)) {
          nextWords.push(newWord);
        }
      }
    }
  }

  return nextWords;
}
```

**Time:** O(M² × N) but typically much faster
**Space:** O(N)

✅ **OPTIMAL IN PRACTICE**

---

### Approach 3: Pre-build Graph

**Strategy:** Build adjacency list of all connected words

```javascript
function transformWord(start, end, dictionary) {
  const graph = buildGraph(dictionary);

  if (!graph.has(start) || !graph.has(end)) {
    return null;
  }

  // BFS on pre-built graph
  const queue = [[start, [start]]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    if (current === end) {
      return path;
    }

    for (const neighbor of graph.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null;
}

function buildGraph(dictionary) {
  const graph = new Map();
  const words = Array.from(dictionary);

  for (let i = 0; i < words.length; i++) {
    graph.set(words[i], []);

    for (let j = i + 1; j < words.length; j++) {
      if (isOneLetterDifferent(words[i], words[j])) {
        graph.get(words[i]).push(words[j]);

        if (!graph.has(words[j])) {
          graph.set(words[j], []);
        }
        graph.get(words[j]).push(words[i]);
      }
    }
  }

  return graph;
}

function isOneLetterDifferent(word1, word2) {
  if (word1.length !== word2.length) return false;

  let diffCount = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) {
      diffCount++;
      if (diffCount > 1) return false;
    }
  }

  return diffCount === 1;
}
```

**Preprocessing Time:** O(N² × M)
**Query Time:** O(N)
**Good when:** Many queries on same dictionary

---

## Algorithm Explanation

### BFS Walkthrough

```
Start: "hit"
End: "cog"
Dictionary: {hot, dot, dog, lot, log, cog}

Level 0: [hit]

Level 1: Find neighbors of "hit"
  hit → hot ✓ (in dictionary)
  Queue: [hot]

Level 2: Find neighbors of "hot"
  hot → dot ✓
  hot → lot ✓
  Queue: [dot, lot]

Level 3: Find neighbors of "dot" and "lot"
  dot → dog ✓
  lot → log ✓
  Queue: [dog, log]

Level 4: Find neighbors of "dog" and "log"
  dog → cog ✓ FOUND!
  log → cog ✓ FOUND!

Shortest path: hit → hot → dot → dog → cog
```

### Bidirectional BFS Visualization

```
Forward from "hit":     Backward from "cog":
  hit                     cog
   |                       |
  hot                     dog
   |                       |
  dot                     log
   |                       |
  Meeting point: "dot" or "dog"

Much faster convergence!
```

---

## Complexity Analysis

| Approach | Preprocess | Query | Space | Best For |
|----------|------------|-------|-------|----------|
| BFS | - | O(M²×N) | O(N) | Single query |
| Bidirectional BFS | - | O(M²×N/2) | O(N) | **Fastest** |
| Pre-built Graph | O(N²×M) | O(N) | O(N²) | Many queries |

---

## Edge Cases

```javascript
// Same start and end
transformWord("hit", "hit", dict) → ["hit"]

// End not in dictionary
transformWord("hit", "xyz", dict) → null

// No path exists
transformWord("hit", "abc", {hit, hot, abc}) → null

// Direct neighbors
transformWord("hit", "hot", {hit, hot}) → ["hit", "hot"]

// Empty dictionary
transformWord("hit", "hot", {}) → null

// Single letter words
transformWord("a", "b", {a, b}) → ["a", "b"]
```

---

## Common Mistakes

### 1. Not handling visited words

```javascript
// ❌ WRONG - revisiting words causes infinite loop
queue.push([nextWord, [...path, nextWord]]);

// ✅ CORRECT - track visited
if (!visited.has(nextWord)) {
  visited.add(nextWord);
  queue.push([nextWord, [...path, nextWord]]);
}
```

### 2. Modifying dictionary during search

```javascript
// ❌ WRONG - removing from dictionary
dictionary.delete(current);

// ✅ CORRECT - use separate visited set
visited.add(current);
```

### 3. Wrong difference check

```javascript
// ❌ WRONG - checking substring
if (word1.includes(word2[0]))

// ✅ CORRECT - count different letters
let diff = 0;
for (let i = 0; i < word1.length; i++) {
  if (word1[i] !== word2[i]) diff++;
}
return diff === 1;
```

---

## Optimizations

### 1. Pattern matching for faster neighbor finding

```javascript
// Instead of trying all 26 letters
// Group words by pattern: h_t, _ot, etc.

function buildPatterns(dictionary) {
  const patterns = new Map();

  for (const word of dictionary) {
    for (let i = 0; i < word.length; i++) {
      const pattern = word.substring(0, i) + '*' + word.substring(i + 1);

      if (!patterns.has(pattern)) {
        patterns.set(pattern, []);
      }
      patterns.get(pattern).push(word);
    }
  }

  return patterns;
}
```

### 2. Early termination

```javascript
// If current path length >= best known path, skip
```

---

## Interview Tips

1. **Recognize graph problem:** "This is finding shortest path in word graph"

2. **Explain BFS choice:** "BFS finds shortest path in unweighted graph"

3. **Draw the graph:**
   ```
   hit --- hot --- dot
            |       |
           lot --- log
                    |
                   cog
   ```

4. **Discuss bidirectional:** "Searching from both ends is faster"

5. **Handle edge cases:**
   - Start equals end
   - No path exists
   - End not in dictionary

6. **Mention optimization:** Pattern grouping reduces neighbor search time

---

## Key Takeaways

1. **BFS** finds shortest transformation sequence

2. **Bidirectional BFS** is faster in practice

3. Each word is a **graph node**, edges connect words differing by one letter

4. **Pattern matching** optimization speeds up neighbor finding

5. This pattern appears in:
   - Word Ladder
   - Gene mutation
   - Minimum genetic mutation

6. Time complexity: O(M² × N) where M = word length, N = dictionary size

---

**Time Complexity:** O(M² × N)
**Space Complexity:** O(N)
**Difficulty:** Hard
