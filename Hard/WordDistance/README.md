# 17.11 Word Distance

## Original Problem

**Word Distance:** You have a large text file containing words. Given any two words, find the shortest distance (in terms of number of words) between them in the file. If the operation will be repeated many times for the same file (but different pairs of words), can you optimize it?

```
Example:
Text: ["the", "quick", "brown", "fox", "quick", "the", "dog"]

findDistance("quick", "fox") → 1
  "quick" at index 1, "fox" at index 3
  Distance: 3 - 1 = 2 (but we count words between, so 1)

findDistance("the", "dog") → 1
  "the" at index 5, "dog" at index 6
  Distance: 6 - 5 = 1
```

Hints: #486, #501, #538, #558, #633

---

## Understanding the Problem

Given positions of two words in an array, find the minimum distance between any occurrence of word1 and any occurrence of word2.

```
Text: ["a", "b", "c", "a", "d", "b", "c"]
       0    1    2    3    4    5    6

findDistance("a", "b"):
  "a" at positions: [0, 3]
  "b" at positions: [1, 5]

  Possible distances:
    |1 - 0| = 1 ✓ (minimum)
    |5 - 0| = 5
    |1 - 3| = 2
    |5 - 3| = 2

  Return: 1
```

### Key Insight

**One-time query:** Single pass tracking last positions
**Repeated queries:** Preprocess positions into hash map

---

## Solution Approaches

### Approach 1: Brute Force (One-Time Query)

**Strategy:** Find all positions, check all pairs

```javascript
function findDistance(words, word1, word2) {
  const positions1 = [];
  const positions2 = [];

  // Find all positions
  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) positions1.push(i);
    if (words[i] === word2) positions2.push(i);
  }

  if (positions1.length === 0 || positions2.length === 0) {
    return -1;  // Word not found
  }

  // Find minimum distance
  let minDist = Infinity;
  for (const pos1 of positions1) {
    for (const pos2 of positions2) {
      minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
  }

  return minDist;
}
```

**Time:** O(n × m × k) where n = array length, m = occurrences of word1, k = occurrences of word2
**Space:** O(m + k)

---

### Approach 2: Single Pass (One-Time Query - Optimal)

**Strategy:** Track last position of each word, update minimum

```javascript
function findDistance(words, word1, word2) {
  let pos1 = -1;
  let pos2 = -1;
  let minDist = Infinity;

  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) {
      pos1 = i;
      if (pos2 !== -1) {
        minDist = Math.min(minDist, pos1 - pos2);
      }
    } else if (words[i] === word2) {
      pos2 = i;
      if (pos1 !== -1) {
        minDist = Math.min(minDist, pos2 - pos1);
      }
    }
  }

  return minDist === Infinity ? -1 : minDist;
}
```

**Time:** O(n) - single pass
**Space:** O(1)

✅ **OPTIMAL FOR ONE-TIME QUERY**

---

### Approach 3: Preprocessing (Repeated Queries)

**Strategy:** Build hash map of word → positions, then use two pointers

```javascript
class WordDistanceFinder {
  constructor(words) {
    this.positions = new Map();

    // Preprocess: build position map
    for (let i = 0; i < words.length; i++) {
      if (!this.positions.has(words[i])) {
        this.positions.set(words[i], []);
      }
      this.positions.get(words[i]).push(i);
    }
  }

  findDistance(word1, word2) {
    const pos1 = this.positions.get(word1);
    const pos2 = this.positions.get(word2);

    if (!pos1 || !pos2) return -1;

    // Two pointers on sorted position arrays
    let i = 0, j = 0;
    let minDist = Infinity;

    while (i < pos1.length && j < pos2.length) {
      minDist = Math.min(minDist, Math.abs(pos1[i] - pos2[j]));

      // Move pointer of smaller position
      if (pos1[i] < pos2[j]) {
        i++;
      } else {
        j++;
      }
    }

    return minDist;
  }
}

// Usage:
const finder = new WordDistanceFinder(words);
finder.findDistance("word1", "word2");  // O(m + k)
finder.findDistance("word3", "word4");  // O(m + k)
```

**Preprocessing Time:** O(n)
**Query Time:** O(m + k) where m, k are occurrence counts
**Space:** O(n)

✅ **OPTIMAL FOR REPEATED QUERIES**

---

## Algorithm Explanation

### Single Pass Algorithm

```
Text: ["a", "b", "c", "a", "b", "d"]
       0    1    2    3    4    5

Find distance("a", "b"):

i=0, word="a":
  pos1 = 0
  pos2 = -1 (not seen yet)
  No update

i=1, word="b":
  pos2 = 1
  pos1 = 0 (seen)
  minDist = min(∞, 1-0) = 1

i=2, word="c":
  Skip

i=3, word="a":
  pos1 = 3
  pos2 = 1 (last b)
  minDist = min(1, 3-1) = 1

i=4, word="b":
  pos2 = 4
  pos1 = 3 (last a)
  minDist = min(1, 4-3) = 1

i=5, word="d":
  Skip

Result: 1
```

### Two Pointers on Preprocessed Data

```
word1="a" positions: [0, 3, 7, 10]
word2="b" positions: [2, 5, 11]

i=0, j=0: |0-2| = 2, minDist=2, i++ (0 < 2)
i=1, j=0: |3-2| = 1, minDist=1, j++ (3 > 2)
i=1, j=1: |3-5| = 2, minDist=1, i++ (3 < 5)
i=2, j=1: |7-5| = 2, minDist=1, i++ (7 > 5)
i=3, j=1: |10-5| = 5, minDist=1, j++ (10 > 5)
i=3, j=2: |10-11| = 1, minDist=1, j++ (10 < 11)
j >= length, stop

Result: 1
```

---

## Complexity Analysis

| Approach | Preprocessing | Query | Space | Best For |
|----------|---------------|-------|-------|----------|
| Brute Force | - | O(n × m × k) | O(m + k) | Never |
| Single Pass | - | O(n) | O(1) | One query |
| With Preprocessing | O(n) | O(m + k) | O(n) | Many queries |

---

## Edge Cases

```javascript
// Words not in text
findDistance(["a", "b"], "c", "d") → -1

// One word not found
findDistance(["a", "b"], "a", "c") → -1

// Same word (invalid)
findDistance(["a", "b"], "a", "a") → ?
  // Typically return minimum distance between occurrences
  // Or treat as error

// Adjacent words
findDistance(["a", "b", "c"], "a", "b") → 1

// Same positions (one occurrence each)
findDistance(["a", "b"], "a", "b") → 1

// Multiple occurrences
findDistance(["a", "b", "a"], "a", "b") → 1
```

---

## Common Mistakes

### 1. Calculating distance incorrectly

```javascript
// ❌ WRONG - counting indices difference wrong
const dist = pos2 - pos1 - 1;  // Don't subtract 1

// ✅ CORRECT - absolute difference
const dist = Math.abs(pos2 - pos1);
```

### 2. Not resetting on repeated queries

```javascript
// ❌ WRONG - reusing positions across queries
let pos1 = -1, pos2 = -1;  // Global

// ✅ CORRECT - reset for each query
function findDistance(word1, word2) {
  let pos1 = -1, pos2 = -1;  // Local
  ...
}
```

### 3. Inefficient two-pointer movement

```javascript
// ❌ WRONG - always incrementing same pointer
i++;
j++;

// ✅ CORRECT - move pointer with smaller value
if (pos1[i] < pos2[j]) i++;
else j++;
```

---

## Variations

### 1. Find closest three words

```javascript
function findDistanceThree(words, word1, word2, word3) {
  let pos1 = -1, pos2 = -1, pos3 = -1;
  let minDist = Infinity;

  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) pos1 = i;
    else if (words[i] === word2) pos2 = i;
    else if (words[i] === word3) pos3 = i;

    if (pos1 !== -1 && pos2 !== -1 && pos3 !== -1) {
      const min = Math.min(pos1, pos2, pos3);
      const max = Math.max(pos1, pos2, pos3);
      minDist = Math.min(minDist, max - min);
    }
  }

  return minDist === Infinity ? -1 : minDist;
}
```

### 2. Case-insensitive search

```javascript
function findDistanceCaseInsensitive(words, word1, word2) {
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();

  let pos1 = -1, pos2 = -1;
  let minDist = Infinity;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();

    if (word === word1) {
      pos1 = i;
      if (pos2 !== -1) {
        minDist = Math.min(minDist, pos1 - pos2);
      }
    } else if (word === word2) {
      pos2 = i;
      if (pos1 !== -1) {
        minDist = Math.min(minDist, pos2 - pos1);
      }
    }
  }

  return minDist === Infinity ? -1 : minDist;
}
```

---

## Interview Tips

1. **Clarify requirements:**
   - One-time query or repeated queries?
   - Are words case-sensitive?
   - What if word not found?
   - What if same word given twice?

2. **Start simple:** Explain brute force first

3. **Optimize step by step:**
   - "We don't need to store all positions"
   - "Just track the last position of each word"

4. **Discuss preprocessing:**
   - "If we have many queries, preprocessing is worth it"
   - "Trade space for time"

5. **Explain two pointers:**
   - "Since positions are sorted, we can use two pointers"
   - "Always move pointer with smaller value"

6. **Draw it out:**
   ```
   ["a", "b", "c", "a", "b"]
     ↑              ↑    ↑
    First a    Last a  Last b
   ```

---

## Key Takeaways

1. **One-time query:** Single pass with position tracking - O(n) time, O(1) space

2. **Repeated queries:** Preprocess positions - O(m + k) per query

3. **Two pointers** on sorted position arrays is optimal for preprocessed case

4. Track **last seen position** instead of all positions for one-time queries

5. This pattern appears in: closest pair, range queries, sliding window problems

6. **Preprocessing trade-off:** O(n) space for faster queries

---

**Time Complexity:**
- One-time: O(n)
- Repeated: O(n) preprocessing + O(m+k) per query

**Space Complexity:**
- One-time: O(1)
- Repeated: O(n)

**Difficulty:** Medium-Hard
