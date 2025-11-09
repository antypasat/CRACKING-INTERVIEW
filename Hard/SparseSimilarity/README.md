# 17.26 Sparse Similarity

## Original Problem

**Sparse Similarity:** The similarity of two documents (each with distinct words) is defined to be the size of the intersection divided by the size of the union. For example, if the documents consist of integers, the similarity of {1, 5, 3} and {1, 7, 2, 3} is 0.4, because the intersection has size 2 and the union has size 5.

We have a long list of documents (with distinct values and each with an associated ID) where the similarity is believed to be "sparse." That is, any two arbitrarily selected documents are very likely to have similarity 0. Design an algorithm that returns a list of pairs of document IDs and the associated similarity.

Print only the pairs with similarity greater than 0. Empty documents should not be printed at all. For simplicity, you may assume each document is represented as an array of distinct integers.

```
Example:
Documents:
  13: {14, 15, 100, 9, 3}
  16: {32, 1, 9, 3, 5}
  19: {15, 29, 2, 6, 8, 7}
  24: {7, 10}

Output:
  13, 16: 0.25   (intersection: {9,3}, union: {14,15,100,9,3,32,1,5})
  19, 24: 0.14   (intersection: {7}, union: {15,29,2,6,8,7,10})
```

Hints: #484, #498, #510, #518, #534, #547, #555, #561, #569, #577, #584, #603, #611, #636

---

## Understanding the Problem

For each pair of documents, calculate:
```
similarity = |intersection| / |union|
           = |intersection| / (|doc1| + |doc2| - |intersection|)
```

**Sparse** means most document pairs have similarity = 0 (no overlap).

**Naive approach:** Compare all pairs → O(n² × m) where n = documents, m = doc size

**Optimization needed:** Skip pairs with no intersection

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Compare every pair of documents

```javascript
function computeSimilarities(documents) {
  const results = [];
  const docIds = Object.keys(documents);

  for (let i = 0; i < docIds.length; i++) {
    for (let j = i + 1; j < docIds.length; j++) {
      const id1 = docIds[i];
      const id2 = docIds[j];

      const similarity = computeSimilarity(
        documents[id1],
        documents[id2]
      );

      if (similarity > 0) {
        results.push({ id1, id2, similarity });
      }
    }
  }

  return results;
}

function computeSimilarity(doc1, doc2) {
  const set1 = new Set(doc1);
  const set2 = new Set(doc2);

  // Count intersection
  let intersection = 0;
  for (const elem of set1) {
    if (set2.has(elem)) {
      intersection++;
    }
  }

  if (intersection === 0) return 0;

  const union = set1.size + set2.size - intersection;
  return intersection / union;
}
```

**Time:** O(n² × m) where n = documents, m = avg document size
**Space:** O(n × m)

**Problem:** Too slow! Compares documents with no overlap.

---

### Approach 2: Inverted Index (Optimal)

**Strategy:** Build inverted index element → document IDs

```javascript
function computeSimilarities(documents) {
  // Build inverted index: element → list of document IDs
  const invertedIndex = new Map();

  for (const [docId, elements] of Object.entries(documents)) {
    for (const elem of elements) {
      if (!invertedIndex.has(elem)) {
        invertedIndex.set(elem, []);
      }
      invertedIndex.get(elem).push(parseInt(docId));
    }
  }

  // Count intersections
  const intersections = new Map();  // "id1,id2" → count

  for (const docIds of invertedIndex.values()) {
    // All pairs of documents containing this element
    for (let i = 0; i < docIds.length; i++) {
      for (let j = i + 1; j < docIds.length; j++) {
        const id1 = Math.min(docIds[i], docIds[j]);
        const id2 = Math.max(docIds[i], docIds[j]);
        const key = `${id1},${id2}`;

        intersections.set(key, (intersections.get(key) || 0) + 1);
      }
    }
  }

  // Calculate similarities
  const results = [];

  for (const [key, intersectionSize] of intersections) {
    const [id1, id2] = key.split(',').map(Number);

    const unionSize = documents[id1].length +
                     documents[id2].length -
                     intersectionSize;

    const similarity = intersectionSize / unionSize;

    results.push({
      id1,
      id2,
      similarity: similarity.toFixed(2)
    });
  }

  return results;
}
```

**Time:** O(n × m + p × q²) where:
- n = documents
- m = avg document size
- p = unique elements
- q = avg documents per element (usually small!)

**Space:** O(n × m) for inverted index

✅ **OPTIMAL FOR SPARSE DATA**

---

## Algorithm Explanation

### Inverted Index Example

```
Documents:
  13: {14, 15, 100, 9, 3}
  16: {32, 1, 9, 3, 5}
  19: {15, 29, 2, 6, 8, 7}
  24: {7, 10}

Inverted Index:
  14 → [13]
  15 → [13, 19]
  100 → [13]
  9 → [13, 16]
  3 → [13, 16]
  32 → [16]
  1 → [16]
  5 → [16]
  29 → [19]
  2 → [19]
  6 → [19]
  8 → [19]
  7 → [19, 24]
  10 → [24]

Count Intersections:
  Element 15: docs [13, 19] → pair (13,19) intersection +1
  Element 9: docs [13, 16] → pair (13,16) intersection +1
  Element 3: docs [13, 16] → pair (13,16) intersection +1
  Element 7: docs [19, 24] → pair (19,24) intersection +1

Intersections Map:
  "13,16": 2  (elements 9, 3)
  "13,19": 1  (element 15)
  "19,24": 1  (element 7)

Calculate Similarities:
  Pair (13,16):
    intersection = 2
    union = 5 + 5 - 2 = 8
    similarity = 2/8 = 0.25

  Pair (13,19):
    intersection = 1
    union = 5 + 7 - 1 = 11
    similarity = 1/11 ≈ 0.09

  Pair (19,24):
    intersection = 1
    union = 7 + 2 - 1 = 8
    similarity = 1/8 = 0.125
```

---

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Brute Force | O(n²×m) | O(nm) | Dense data |
| Inverted Index | O(nm + pq²) | O(nm) | **Sparse data** ✅ |

**Key insight:** If data is sparse (q is small), inverted index is much faster!

Example: 1M documents, 100 elements each, but only 5 docs share any element on average:
- Brute force: 10¹² operations
- Inverted index: 10⁸ + 10⁴ × 25 ≈ 10⁸ operations

**1000x faster!**

---

## Edge Cases

```javascript
// Empty document
documents = {1: [], 2: [1,2,3]}
→ Skip document 1

// Single document
documents = {1: [1,2,3]}
→ No pairs, return []

// No overlaps
documents = {1: [1,2], 2: [3,4]}
→ Return []

// Identical documents
documents = {1: [1,2,3], 2: [1,2,3]}
→ similarity = 1.0

// Complete overlap on one side
documents = {1: [1,2], 2: [1,2,3,4]}
→ similarity = 2/4 = 0.5

// Single element overlap
documents = {1: [1,2,3], 2: [4,5,1]}
→ similarity = 1/5 = 0.2
```

---

## Common Mistakes

### 1. Counting pairs twice

```javascript
// ❌ WRONG - might count (13,16) and (16,13)
for (let i = 0; i < docIds.length; i++) {
  for (let j = 0; j < docIds.length; j++) {
    // Counts each pair twice
  }
}

// ✅ CORRECT - ensure id1 < id2
const id1 = Math.min(docIds[i], docIds[j]);
const id2 = Math.max(docIds[i], docIds[j]);
```

### 2. Wrong union calculation

```javascript
// ❌ WRONG - doesn't subtract intersection
const union = doc1.length + doc2.length;

// ✅ CORRECT - |A ∪ B| = |A| + |B| - |A ∩ B|
const union = doc1.length + doc2.length - intersection;
```

### 3. Not handling empty documents

```javascript
// ❌ WRONG - processing empty docs
for (const elem of []) // Still loops once?

// ✅ CORRECT - skip empty
if (doc.length === 0) continue;
```

---

## Optimizations

### 1. Skip large inverted lists

```javascript
// If an element appears in too many documents,
// skip it (contributes to too many pairs)
if (docIds.length > threshold) continue;
```

### 2. Early termination

```javascript
// If we only want top-k similar pairs,
// use min-heap and prune
```

### 3. Parallel processing

```javascript
// Process inverted index lists in parallel
// Each list is independent
```

---

## Variations

### 1. Return only pairs above threshold

```javascript
if (similarity > threshold) {
  results.push({id1, id2, similarity});
}
```

### 2. Find top-k most similar pairs

```javascript
// Use min-heap of size k
// Keep only k highest similarities
```

### 3. Weighted elements

```javascript
// Each element has a weight
// similarity = sum of intersection weights / sum of union weights
```

---

## Interview Tips

1. **Clarify sparsity:**
   - "Most document pairs have zero similarity?"
   - "This suggests inverted index"

2. **Explain naive approach:**
   - "Compare all O(n²) pairs"
   - "Calculate intersection for each"

3. **Introduce optimization:**
   - "Build inverted index: element → docs"
   - "Only compare docs that share elements"

4. **Draw inverted index:**
   ```
   Element → Documents
   9 → [13, 16]
   3 → [13, 16]
   7 → [19, 24]
   ```

5. **Analyze complexity:**
   - "If q (docs per element) is small, huge speedup"
   - "Real-world: very sparse, q << n"

6. **Mention applications:**
   - Document similarity
   - Plagiarism detection
   - Recommendation systems
   - Duplicate detection

---

## Key Takeaways

1. **Inverted index** exploits sparsity for massive speedup

2. Only compare documents that **share at least one element**

3. **Jaccard similarity:** |A ∩ B| / |A ∪ B|

4. For sparse data: O(n² × m) → O(n × m + p × q²) where q << n

5. This pattern appears in:
   - MinHash/LSH for similarity search
   - Collaborative filtering
   - Search engines (inverted index)

6. Trade-off: O(n×m) space for dramatic time improvement

---

**Time Complexity:** O(n×m + p×q²) ≈ O(n×m) for sparse data
**Space Complexity:** O(n×m)
**Difficulty:** Hard
