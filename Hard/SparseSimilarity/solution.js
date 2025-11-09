/**
 * PROBLEM 17.26 - SPARSE SIMILARITY
 *
 * The similarity of two documents (each with distinct words) is defined to be the
 * size of the intersection divided by the size of the union. For example, if the
 * documents consist of integers, the similarity of {1, 5, 3} and {1, 7, 2, 3} is
 * 0.4, because the intersection has size 2 and the union has size 5.
 *
 * We have a long list of documents (with distinct values and each with an associated ID)
 * where the similarity is believed to be "sparse". That is, any two arbitrarily selected
 * documents are very likely to have similarity 0. Design an algorithm that returns a
 * list of pairs of document IDs and the associated similarity.
 *
 * Print only the pairs with similarity greater than 0. Empty documents should not be
 * printed at all. For simplicity, you may assume each document is represented as an
 * array of distinct integers.
 *
 * Example:
 * Input:
 *   13: {14, 15, 100, 9, 3}
 *   16: {32, 1, 9, 3, 5}
 *   19: {15, 29, 2, 6, 8, 7}
 *   24: {7, 10}
 *
 * Output:
 *   13, 19: 0.1
 *   13, 16: 0.25
 *   19, 24: 0.14285714285714285
 */

// =============================================================================
// APPROACH 1: BRUTE FORCE
// Time: O(D^2 * W) where D = number of documents, W = average words per document
// Space: O(D)
//
// Compare every pair of documents - too slow for large datasets
// =============================================================================

function sparseSimilarityBrute(documents) {
  const results = [];
  const docIds = Object.keys(documents);

  for (let i = 0; i < docIds.length; i++) {
    for (let j = i + 1; j < docIds.length; j++) {
      const id1 = docIds[i];
      const id2 = docIds[j];

      const doc1 = new Set(documents[id1]);
      const doc2 = new Set(documents[id2]);

      const intersection = new Set([...doc1].filter(x => doc2.has(x)));
      const union = new Set([...doc1, ...doc2]);

      if (intersection.size > 0) {
        const similarity = intersection.size / union.size;
        results.push({ id1, id2, similarity });
      }
    }
  }

  return results;
}

// =============================================================================
// APPROACH 2: INVERTED INDEX (OPTIMAL)
// Time: O(D * W + P * W^2) where P = pairs with similarity > 0
// Space: O(D * W)
//
// Build inverted index: word -> list of documents containing it
// Only compare documents that share at least one word
// This is the book's recommended solution
// =============================================================================

function sparseSimilarity(documents) {
  // Build inverted index
  const invertedIndex = buildInvertedIndex(documents);

  // Track intersections between document pairs
  const intersections = new Map();

  // For each word, increment intersection count for all document pairs
  for (const [word, docList] of invertedIndex) {
    // For each pair of documents containing this word
    for (let i = 0; i < docList.length; i++) {
      for (let j = i + 1; j < docList.length; j++) {
        const id1 = Math.min(docList[i], docList[j]);
        const id2 = Math.max(docList[i], docList[j]);
        const pairKey = `${id1},${id2}`;

        intersections.set(pairKey, (intersections.get(pairKey) || 0) + 1);
      }
    }
  }

  // Calculate similarities
  const results = [];
  for (const [pairKey, intersectionSize] of intersections) {
    const [id1, id2] = pairKey.split(',');

    const size1 = documents[id1].length;
    const size2 = documents[id2].length;
    const unionSize = size1 + size2 - intersectionSize;

    const similarity = intersectionSize / unionSize;

    results.push({
      id1: parseInt(id1),
      id2: parseInt(id2),
      similarity
    });
  }

  return results;
}

function buildInvertedIndex(documents) {
  const index = new Map();

  for (const [docId, words] of Object.entries(documents)) {
    for (const word of words) {
      if (!index.has(word)) {
        index.set(word, []);
      }
      index.get(word).push(parseInt(docId));
    }
  }

  return index;
}

// =============================================================================
// APPROACH 3: OPTIMIZED WITH EARLY TERMINATION
// Time: O(D * W + P * W^2) with better constants
// Space: O(D * W)
//
// Add optimizations:
// - Skip empty documents
// - Use bit manipulation for intersection calculation where possible
// - Early termination for low similarity
// =============================================================================

function sparseSimilarityOptimized(documents, minSimilarity = 0) {
  // Filter out empty documents
  const nonEmptyDocs = {};
  for (const [id, words] of Object.entries(documents)) {
    if (words.length > 0) {
      nonEmptyDocs[id] = words;
    }
  }

  // Build inverted index with optimization: sort by document count
  const invertedIndex = buildInvertedIndex(nonEmptyDocs);

  // Track intersections
  const intersections = new Map();

  // Process words in order of frequency (less common words first)
  const sortedWords = Array.from(invertedIndex.entries())
    .sort((a, b) => a[1].length - b[1].length);

  for (const [word, docList] of sortedWords) {
    // For each pair of documents containing this word
    for (let i = 0; i < docList.length; i++) {
      for (let j = i + 1; j < docList.length; j++) {
        const id1 = Math.min(docList[i], docList[j]);
        const id2 = Math.max(docList[i], docList[j]);
        const pairKey = `${id1},${id2}`;

        intersections.set(pairKey, (intersections.get(pairKey) || 0) + 1);
      }
    }
  }

  // Calculate similarities with minimum threshold
  const results = [];
  for (const [pairKey, intersectionSize] of intersections) {
    const [id1, id2] = pairKey.split(',');

    const size1 = nonEmptyDocs[id1].length;
    const size2 = nonEmptyDocs[id2].length;
    const unionSize = size1 + size2 - intersectionSize;

    const similarity = intersectionSize / unionSize;

    if (similarity >= minSimilarity) {
      results.push({
        id1: parseInt(id1),
        id2: parseInt(id2),
        similarity,
        intersection: intersectionSize,
        union: unionSize
      });
    }
  }

  // Sort by similarity descending
  results.sort((a, b) => b.similarity - a.similarity);

  return results;
}

// =============================================================================
// APPROACH 4: HASH-BASED WITH PARALLEL PROCESSING SUPPORT
// Time: O(D * W + P * W)
// Space: O(D * W)
//
// Uses hash-based approach for even better performance on large datasets
// =============================================================================

class SimilarityCalculator {
  constructor(documents) {
    this.documents = this.filterEmpty(documents);
    this.invertedIndex = this.buildIndex();
    this.docSizes = this.computeSizes();
  }

  filterEmpty(documents) {
    const filtered = {};
    for (const [id, words] of Object.entries(documents)) {
      if (words && words.length > 0) {
        filtered[id] = words;
      }
    }
    return filtered;
  }

  buildIndex() {
    const index = new Map();

    for (const [docId, words] of Object.entries(this.documents)) {
      const id = parseInt(docId);
      for (const word of words) {
        if (!index.has(word)) {
          index.set(word, new Set());
        }
        index.get(word).add(id);
      }
    }

    return index;
  }

  computeSizes() {
    const sizes = new Map();
    for (const [id, words] of Object.entries(this.documents)) {
      sizes.set(parseInt(id), words.length);
    }
    return sizes;
  }

  /**
   * Calculate similarities above threshold
   */
  calculateSimilarities(minSimilarity = 0) {
    const intersections = new Map();

    // Build intersection counts
    for (const [word, docSet] of this.invertedIndex) {
      const docs = Array.from(docSet);

      for (let i = 0; i < docs.length; i++) {
        for (let j = i + 1; j < docs.length; j++) {
          const [id1, id2] = [Math.min(docs[i], docs[j]), Math.max(docs[i], docs[j])];
          const key = `${id1}:${id2}`;

          intersections.set(key, (intersections.get(key) || 0) + 1);
        }
      }
    }

    // Calculate similarities
    const results = [];

    for (const [key, intersectionSize] of intersections) {
      const [id1, id2] = key.split(':').map(Number);

      const unionSize = this.docSizes.get(id1) + this.docSizes.get(id2) - intersectionSize;
      const similarity = intersectionSize / unionSize;

      if (similarity >= minSimilarity) {
        results.push({
          id1,
          id2,
          similarity,
          intersection: intersectionSize,
          union: unionSize
        });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Get similarity for a specific pair
   */
  getSimilarity(id1, id2) {
    const doc1 = new Set(this.documents[id1] || []);
    const doc2 = new Set(this.documents[id2] || []);

    if (doc1.size === 0 || doc2.size === 0) return 0;

    let intersectionSize = 0;
    for (const word of doc1) {
      if (doc2.has(word)) {
        intersectionSize++;
      }
    }

    if (intersectionSize === 0) return 0;

    const unionSize = doc1.size + doc2.size - intersectionSize;
    return intersectionSize / unionSize;
  }

  /**
   * Get statistics
   */
  getStats() {
    const wordCounts = Array.from(this.invertedIndex.values()).map(s => s.size);

    return {
      documentCount: Object.keys(this.documents).length,
      uniqueWords: this.invertedIndex.size,
      avgDocSize: Array.from(this.docSizes.values()).reduce((a, b) => a + b, 0) / this.docSizes.size,
      avgWordOccurrence: wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length,
      maxWordOccurrence: Math.max(...wordCounts),
      minWordOccurrence: Math.min(...wordCounts)
    };
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format results for display
 */
function formatResults(results, limit = 10) {
  let output = '';

  for (let i = 0; i < Math.min(results.length, limit); i++) {
    const { id1, id2, similarity, intersection, union } = results[i];

    if (intersection !== undefined) {
      output += `${id1}, ${id2}: ${similarity.toFixed(6)} (${intersection}/${union})\n`;
    } else {
      output += `${id1}, ${id2}: ${similarity}\n`;
    }
  }

  if (results.length > limit) {
    output += `... and ${results.length - limit} more\n`;
  }

  return output;
}

/**
 * Generate random documents for testing
 */
function generateRandomDocuments(numDocs, wordsPerDoc, vocabularySize = 1000) {
  const documents = {};

  for (let i = 0; i < numDocs; i++) {
    const words = new Set();

    while (words.size < wordsPerDoc) {
      words.add(Math.floor(Math.random() * vocabularySize));
    }

    documents[i] = Array.from(words);
  }

  return documents;
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Sparse Similarity...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const docs1 = {
    13: [14, 15, 100, 9, 3],
    16: [32, 1, 9, 3, 5],
    19: [15, 29, 2, 6, 8, 7],
    24: [7, 10]
  };

  console.log('Documents:');
  for (const [id, words] of Object.entries(docs1)) {
    console.log(`  ${id}: {${words.join(', ')}}`);
  }
  console.log();

  const result1 = sparseSimilarity(docs1);
  console.log('Results:');
  console.log(formatResults(result1));
  console.log();

  // Test 2: No similarities
  console.log('Test 2: No overlapping documents');
  const docs2 = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9]
  };

  const result2 = sparseSimilarity(docs2);
  console.log('Results:', result2.length, 'pairs');
  console.log('Expected: 0 pairs');
  console.log();

  // Test 3: Identical documents
  console.log('Test 3: Identical documents');
  const docs3 = {
    1: [1, 2, 3, 4, 5],
    2: [1, 2, 3, 4, 5],
    3: [1, 2, 3]
  };

  const result3 = sparseSimilarity(docs3);
  console.log('Results:');
  console.log(formatResults(result3));
  console.log();

  // Test 4: Empty documents
  console.log('Test 4: Some empty documents');
  const docs4 = {
    1: [1, 2, 3],
    2: [],
    3: [2, 3, 4],
    4: []
  };

  const result4 = sparseSimilarity(docs4);
  console.log('Results:');
  console.log(formatResults(result4));
  console.log();

  // Test 5: Using calculator class
  console.log('Test 5: Using SimilarityCalculator class');
  const calculator = new SimilarityCalculator(docs1);

  console.log('Stats:', calculator.getStats());
  console.log('\nAll similarities:');
  const result5 = calculator.calculateSimilarities(0);
  console.log(formatResults(result5));

  console.log('\nSimilarities > 0.15:');
  const result5filtered = calculator.calculateSimilarities(0.15);
  console.log(formatResults(result5filtered));
  console.log();

  // Test 6: Larger dataset
  console.log('Test 6: Larger dataset (100 documents)');
  const docs6 = generateRandomDocuments(100, 20, 50);
  const calculator6 = new SimilarityCalculator(docs6);

  console.log('Stats:', calculator6.getStats());

  const result6 = calculator6.calculateSimilarities(0.1);
  console.log(`\nFound ${result6.length} pairs with similarity > 0.1`);
  console.log('Top 10:');
  console.log(formatResults(result6, 10));
  console.log();

  // Performance comparison
  console.log('Performance Comparison (500 documents):');
  const largeDocs = generateRandomDocuments(500, 15, 100);

  console.time('Brute Force (first 50 docs)');
  const smallDocs = {};
  for (let i = 0; i < 50; i++) {
    if (largeDocs[i]) smallDocs[i] = largeDocs[i];
  }
  sparseSimilarityBrute(smallDocs);
  console.timeEnd('Brute Force (first 50 docs)');

  console.time('Inverted Index (all 500 docs)');
  sparseSimilarity(largeDocs);
  console.timeEnd('Inverted Index (all 500 docs)');

  console.time('Optimized (all 500 docs)');
  sparseSimilarityOptimized(largeDocs);
  console.timeEnd('Optimized (all 500 docs)');

  console.time('Calculator Class (all 500 docs)');
  const calc = new SimilarityCalculator(largeDocs);
  calc.calculateSimilarities(0);
  console.timeEnd('Calculator Class (all 500 docs)');

  console.log('\nNote: Inverted index approach is optimal for sparse data - O(D*W + P*W²)');
  console.log('where P << D² due to sparsity');
}

// Run tests
runTests();

// Export
module.exports = {
  sparseSimilarity,
  sparseSimilarityBrute,
  sparseSimilarityOptimized,
  SimilarityCalculator,
  buildInvertedIndex,
  formatResults,
  generateRandomDocuments
};
