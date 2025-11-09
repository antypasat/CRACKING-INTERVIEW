/**
 * PROBLEM 17.22 - WORD TRANSFORMER
 *
 * Given two words of equal length that are in a dictionary, write a method to
 * transform one word into another word by changing only one letter at a time.
 * The new word you get in each step must be in the dictionary.
 *
 * Example:
 * Input: DAMP, LIKE
 * Output: DAMP -> LAMP -> LIMP -> LIME -> LIKE
 *
 * This is a classic graph problem where words are nodes and edges exist between
 * words that differ by exactly one letter.
 */

// =============================================================================
// APPROACH 1: BFS (Breadth-First Search)
// Time: O(N * M^2) where N = number of words, M = word length
// Space: O(N * M)
//
// BFS guarantees shortest path, which is what we want
// This is the optimal approach from the book
// =============================================================================

function wordTransformer(start, end, dictionary) {
  if (!start || !end || start.length !== end.length) {
    return null;
  }

  if (start === end) {
    return [start];
  }

  // Add start and end to dictionary set for easier lookup
  const wordSet = new Set(dictionary);
  wordSet.add(start);
  wordSet.add(end);

  // BFS to find shortest path
  const queue = [[start]]; // Queue of paths
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentWord = path[path.length - 1];

    // Try all one-letter transformations
    const neighbors = getOneLetterDifferences(currentWord, wordSet);

    for (const neighbor of neighbors) {
      if (neighbor === end) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null; // No path found
}

/**
 * Get all words that differ by exactly one letter
 */
function getOneLetterDifferences(word, dictionary) {
  const neighbors = [];

  for (let i = 0; i < word.length; i++) {
    for (let c = 97; c <= 122; c++) { // 'a' to 'z'
      const newChar = String.fromCharCode(c);
      if (newChar !== word[i]) {
        const newWord = word.substring(0, i) + newChar + word.substring(i + 1);
        if (dictionary.has(newWord)) {
          neighbors.push(newWord);
        }
      }
    }
  }

  return neighbors;
}

// =============================================================================
// APPROACH 2: BIDIRECTIONAL BFS (OPTIMIZED)
// Time: O(N * M^2) but typically faster in practice
// Space: O(N * M)
//
// Search from both start and end simultaneously, meeting in the middle
// Reduces search space significantly
// =============================================================================

function wordTransformerBidirectional(start, end, dictionary) {
  if (!start || !end || start.length !== end.length) {
    return null;
  }

  if (start === end) {
    return [start];
  }

  const wordSet = new Set(dictionary);
  wordSet.add(start);
  wordSet.add(end);

  // Two queues for bidirectional search
  const forwardQueue = [[start]];
  const backwardQueue = [[end]];
  const forwardVisited = new Map([[start, [start]]]);
  const backwardVisited = new Map([[end, [end]]]);

  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Expand smaller frontier
    if (forwardQueue.length <= backwardQueue.length) {
      const result = expandQueue(forwardQueue, forwardVisited, backwardVisited, wordSet, false);
      if (result) return result;
    } else {
      const result = expandQueue(backwardQueue, backwardVisited, forwardVisited, wordSet, true);
      if (result) return result;
    }
  }

  return null;
}

function expandQueue(queue, visited, otherVisited, wordSet, reverse) {
  const path = queue.shift();
  const currentWord = path[path.length - 1];
  const neighbors = getOneLetterDifferences(currentWord, wordSet);

  for (const neighbor of neighbors) {
    if (otherVisited.has(neighbor)) {
      // Found connection!
      const otherPath = otherVisited.get(neighbor);
      if (reverse) {
        return [...otherPath.slice(0, -1).reverse(), ...path.reverse()];
      } else {
        return [...path, ...otherPath.slice(1).reverse()];
      }
    }

    if (!visited.has(neighbor)) {
      const newPath = [...path, neighbor];
      visited.set(neighbor, newPath);
      queue.push(newPath);
    }
  }

  return null;
}

// =============================================================================
// APPROACH 3: PRECOMPUTE GRAPH (Faster for multiple queries)
// Time: O(N^2 * M) preprocessing, O(N + M) per query
// Space: O(N^2)
//
// Build adjacency list of all word transformations upfront
// =============================================================================

class WordGraph {
  constructor(dictionary) {
    this.dictionary = dictionary;
    this.graph = this.buildGraph();
  }

  buildGraph() {
    const graph = new Map();

    // Initialize adjacency list
    for (const word of this.dictionary) {
      graph.set(word, []);
    }

    // Build edges
    const words = Array.from(this.dictionary);
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        if (this.differByOneLetter(words[i], words[j])) {
          graph.get(words[i]).push(words[j]);
          graph.get(words[j]).push(words[i]);
        }
      }
    }

    return graph;
  }

  differByOneLetter(word1, word2) {
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

  transform(start, end) {
    if (!this.graph.has(start)) {
      this.graph.set(start, this.getNeighbors(start));
    }
    if (!this.graph.has(end)) {
      this.graph.set(end, this.getNeighbors(end));
    }

    return this.bfsWithGraph(start, end);
  }

  getNeighbors(word) {
    const neighbors = [];
    for (const dictWord of this.dictionary) {
      if (this.differByOneLetter(word, dictWord)) {
        neighbors.push(dictWord);
      }
    }
    return neighbors;
  }

  bfsWithGraph(start, end) {
    if (start === end) return [start];

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      const neighbors = this.graph.get(current) || [];

      for (const neighbor of neighbors) {
        if (neighbor === end) {
          return [...path, neighbor];
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null;
  }
}

// =============================================================================
// APPROACH 4: USING WILDCARD PATTERNS (Efficient neighbor finding)
// Time: O(N * M^2 * 26) preprocessing, O(M * 26) per neighbor lookup
// Space: O(N * M)
//
// Create buckets for words with same pattern (e.g., "_AMP", "D_MP", etc.)
// =============================================================================

function wordTransformerWildcard(start, end, dictionary) {
  if (!start || !end || start.length !== end.length) {
    return null;
  }

  if (start === end) {
    return [start];
  }

  // Build wildcard pattern map
  const patternMap = new Map();
  const wordSet = new Set([...dictionary, start, end]);

  for (const word of wordSet) {
    const patterns = getWildcardPatterns(word);
    for (const pattern of patterns) {
      if (!patternMap.has(pattern)) {
        patternMap.set(pattern, []);
      }
      patternMap.get(pattern).push(word);
    }
  }

  // BFS
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    // Get neighbors using wildcard patterns
    const neighbors = getNeighborsFromPatterns(current, patternMap);

    for (const neighbor of neighbors) {
      if (neighbor === end) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}

function getWildcardPatterns(word) {
  const patterns = [];
  for (let i = 0; i < word.length; i++) {
    const pattern = word.substring(0, i) + '*' + word.substring(i + 1);
    patterns.push(pattern);
  }
  return patterns;
}

function getNeighborsFromPatterns(word, patternMap) {
  const neighbors = new Set();
  const patterns = getWildcardPatterns(word);

  for (const pattern of patterns) {
    const words = patternMap.get(pattern) || [];
    for (const w of words) {
      if (w !== word) {
        neighbors.add(w);
      }
    }
  }

  return Array.from(neighbors);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Visualize transformation path
 */
function visualizePath(path) {
  if (!path) return 'No path found';

  let result = '';
  for (let i = 0; i < path.length; i++) {
    result += path[i];
    if (i < path.length - 1) {
      result += ' -> ';
    }
  }
  return result;
}

/**
 * Highlight changed letter in transformation
 */
function visualizePathWithChanges(path) {
  if (!path || path.length === 0) return 'No path found';
  if (path.length === 1) return path[0];

  let result = path[0];

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    let highlighted = '';

    for (let j = 0; j < curr.length; j++) {
      if (curr[j] !== prev[j]) {
        highlighted += `[${curr[j]}]`;
      } else {
        highlighted += curr[j];
      }
    }

    result += ' -> ' + highlighted;
  }

  return result;
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Word Transformer...\n');

  // Sample dictionary
  const dictionary = [
    'DAMP', 'LAMP', 'LIMP', 'LIME', 'LIKE',
    'DAME', 'DARK', 'DARE', 'DARN', 'BARN',
    'BALL', 'TALL', 'TALE', 'TILE', 'TIME',
    'DIME', 'CAMP', 'CAME'
  ];

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const result1 = wordTransformer('DAMP', 'LIKE', dictionary);
  console.log('Start: DAMP, End: LIKE');
  console.log('Path:', visualizePath(result1));
  console.log('With changes:', visualizePathWithChanges(result1));
  console.log('Length:', result1 ? result1.length : 0);
  console.log();

  // Test 2: Same word
  console.log('Test 2: Same word');
  const result2 = wordTransformer('DAMP', 'DAMP', dictionary);
  console.log('Path:', visualizePath(result2));
  console.log();

  // Test 3: No path exists
  console.log('Test 3: No path exists');
  const result3 = wordTransformer('DAMP', 'ZZZZ', dictionary);
  console.log('Start: DAMP, End: ZZZZ');
  console.log('Path:', visualizePath(result3));
  console.log();

  // Test 4: Adjacent words
  console.log('Test 4: Adjacent words (one letter difference)');
  const result4 = wordTransformer('DAMP', 'LAMP', dictionary);
  console.log('Path:', visualizePath(result4));
  console.log('With changes:', visualizePathWithChanges(result4));
  console.log();

  // Test 5: Longer path
  console.log('Test 5: Longer path');
  const result5 = wordTransformer('DAMP', 'TIME', dictionary);
  console.log('Start: DAMP, End: TIME');
  console.log('Path:', visualizePath(result5));
  console.log('With changes:', visualizePathWithChanges(result5));
  console.log();

  // Test 6: Bidirectional BFS
  console.log('Test 6: Bidirectional BFS comparison');
  const result6a = wordTransformer('DAMP', 'LIKE', dictionary);
  const result6b = wordTransformerBidirectional('DAMP', 'LIKE', dictionary);
  console.log('Regular BFS:', visualizePath(result6a));
  console.log('Bidirectional:', visualizePath(result6b));
  console.log('Same length:', result6a.length === result6b.length);
  console.log();

  // Test 7: Using precomputed graph
  console.log('Test 7: Using precomputed graph');
  const graph = new WordGraph(dictionary);
  const result7 = graph.transform('DAMP', 'LIKE');
  console.log('Path:', visualizePath(result7));
  console.log();

  // Test 8: Using wildcard patterns
  console.log('Test 8: Using wildcard patterns');
  const result8 = wordTransformerWildcard('DAMP', 'LIKE', dictionary);
  console.log('Path:', visualizePath(result8));
  console.log();

  // Performance comparison
  console.log('Performance Comparison:');
  const largeDictionary = generateLargeDictionary(1000, 4);

  console.time('Regular BFS');
  wordTransformer('AAAA', 'ZZZZ', largeDictionary);
  console.timeEnd('Regular BFS');

  console.time('Bidirectional BFS');
  wordTransformerBidirectional('AAAA', 'ZZZZ', largeDictionary);
  console.timeEnd('Bidirectional BFS');

  console.time('Wildcard patterns');
  wordTransformerWildcard('AAAA', 'ZZZZ', largeDictionary);
  console.timeEnd('Wildcard patterns');

  console.log('\nNote: BFS guarantees shortest path');
}

/**
 * Generate random dictionary for testing
 */
function generateLargeDictionary(size, wordLength) {
  const dict = new Set();

  while (dict.size < size) {
    let word = '';
    for (let i = 0; i < wordLength; i++) {
      word += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    dict.add(word.toUpperCase());
  }

  return Array.from(dict);
}

// Run tests
runTests();

// Export functions
module.exports = {
  wordTransformer,
  wordTransformerBidirectional,
  wordTransformerWildcard,
  WordGraph,
  visualizePath,
  visualizePathWithChanges,
  getOneLetterDifferences
};
