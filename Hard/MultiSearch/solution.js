/**
 * PROBLEM 17.17 - MULTI SEARCH
 *
 * Given a string b and an array of smaller strings T, design a method to search b for
 * each small string in T. Return the positions where each string is found.
 *
 * Example:
 * b = "mississippi"
 * T = ["is", "ppi", "hi", "sis", "i", "ssippi"]
 *
 * Output:
 * {
 *   "is": [1, 4],
 *   "ppi": [8],
 *   "hi": [],
 *   "sis": [3],
 *   "i": [1, 4, 7, 10],
 *   "ssippi": [5]
 * }
 */

// =============================================================================
// APPROACH 1: NAIVE - Search each string individually
// Time: O(k * b * t) where k = number of small strings, b = length of big string, t = avg length of small strings
// Space: O(1) excluding output
// =============================================================================

function multiSearchNaive(bigString, smallStrings) {
  const result = {};

  for (const small of smallStrings) {
    result[small] = [];

    // Search for this small string in the big string
    for (let i = 0; i <= bigString.length - small.length; i++) {
      if (bigString.substring(i, i + small.length) === small) {
        result[small].push(i);
      }
    }
  }

  return result;
}

// =============================================================================
// APPROACH 2: OPTIMIZED NAIVE - Use indexOf in a loop
// Time: O(k * b * t) but with better constants
// Space: O(1) excluding output
// =============================================================================

function multiSearchOptimized(bigString, smallStrings) {
  const result = {};

  for (const small of smallStrings) {
    result[small] = [];
    let index = bigString.indexOf(small);

    while (index !== -1) {
      result[small].push(index);
      index = bigString.indexOf(small, index + 1);
    }
  }

  return result;
}

// =============================================================================
// APPROACH 3: TRIE-BASED (Suffix Tree approach)
// Time: O(b^2 + kt) to build trie + O(b * t) to search
// Space: O(b^2) for trie in worst case
//
// This is the most efficient approach for multiple searches on the same text.
// We build a trie of all suffixes of the big string, then search for each small string.
// =============================================================================

class TrieNode {
  constructor() {
    this.children = new Map();
    this.indexes = []; // Stores positions where strings starting at this node are found
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a suffix of the big string starting at position 'index'
   */
  insertSuffix(str, index) {
    let node = this.root;

    for (let i = index; i < str.length; i++) {
      const char = str[i];

      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }

      node = node.children.get(char);
      node.indexes.push(index); // Mark that a suffix starting at 'index' passes through here
    }
  }

  /**
   * Search for a string and return all positions where it starts
   */
  search(str) {
    let node = this.root;

    for (const char of str) {
      if (!node.children.has(char)) {
        return []; // String not found
      }
      node = node.children.get(char);
    }

    return node.indexes;
  }
}

function multiSearchTrie(bigString, smallStrings) {
  const trie = new Trie();

  // Build trie with all suffixes of the big string
  for (let i = 0; i < bigString.length; i++) {
    trie.insertSuffix(bigString, i);
  }

  // Search for each small string
  const result = {};
  for (const small of smallStrings) {
    result[small] = trie.search(small);
  }

  return result;
}

// =============================================================================
// APPROACH 4: OPTIMIZED TRIE (Space-efficient)
// Instead of storing all suffixes, we can use a more memory-efficient approach
// by only storing necessary information
// =============================================================================

class CompactTrieNode {
  constructor() {
    this.children = new Map();
    this.indexes = new Set(); // Use Set to avoid duplicates
  }
}

class CompactTrie {
  constructor(bigString) {
    this.root = new CompactTrieNode();
    this.bigString = bigString;
    this.buildTrie();
  }

  buildTrie() {
    // Insert all substrings starting at each position
    for (let i = 0; i < this.bigString.length; i++) {
      this.insertFromPosition(i);
    }
  }

  insertFromPosition(startIndex) {
    let node = this.root;

    for (let i = startIndex; i < this.bigString.length; i++) {
      const char = this.bigString[i];

      if (!node.children.has(char)) {
        node.children.set(char, new CompactTrieNode());
      }

      node = node.children.get(char);
      node.indexes.add(startIndex);
    }
  }

  search(str) {
    let node = this.root;

    for (const char of str) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }

    return Array.from(node.indexes).sort((a, b) => a - b);
  }
}

function multiSearchCompactTrie(bigString, smallStrings) {
  const trie = new CompactTrie(bigString);

  const result = {};
  for (const small of smallStrings) {
    result[small] = trie.search(small);
  }

  return result;
}

// =============================================================================
// APPROACH 5: INVERTED INDEX (Best for many small strings)
// Time: O(b * t) where t is max length we care about
// Space: O(b * t)
//
// Create a map from each substring to its positions
// =============================================================================

function multiSearchInvertedIndex(bigString, smallStrings) {
  // Find max length we need to index
  const maxLen = Math.max(...smallStrings.map(s => s.length));

  // Build inverted index: substring -> positions
  const index = new Map();

  for (let i = 0; i < bigString.length; i++) {
    for (let len = 1; len <= maxLen && i + len <= bigString.length; len++) {
      const substring = bigString.substring(i, i + len);

      if (!index.has(substring)) {
        index.set(substring, []);
      }
      index.get(substring).push(i);
    }
  }

  // Look up each small string
  const result = {};
  for (const small of smallStrings) {
    result[small] = index.get(small) || [];
  }

  return result;
}

// =============================================================================
// MAIN FUNCTION - Uses Trie approach for best overall performance
// =============================================================================

function multiSearch(bigString, smallStrings) {
  // Handle edge cases
  if (!bigString || !smallStrings || smallStrings.length === 0) {
    const result = {};
    if (smallStrings) {
      smallStrings.forEach(s => result[s] = []);
    }
    return result;
  }

  // For small number of searches, optimized naive is faster
  if (smallStrings.length < 5) {
    return multiSearchOptimized(bigString, smallStrings);
  }

  // For many searches, trie-based approach is better
  return multiSearchCompactTrie(bigString, smallStrings);
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Multi Search...\n');

  // Test 1: Example from problem
  console.log('Test 1: Example from problem');
  const b1 = "mississippi";
  const T1 = ["is", "ppi", "hi", "sis", "i", "ssippi"];
  const result1 = multiSearch(b1, T1);
  console.log('Input:', b1);
  console.log('Search strings:', T1);
  console.log('Result:', result1);
  console.log('Expected: is:[1,4], ppi:[8], hi:[], sis:[3], i:[1,4,7,10], ssippi:[5]');
  console.log();

  // Test 2: Overlapping matches
  console.log('Test 2: Overlapping matches');
  const b2 = "aaaa";
  const T2 = ["a", "aa", "aaa"];
  const result2 = multiSearch(b2, T2);
  console.log('Input:', b2);
  console.log('Search strings:', T2);
  console.log('Result:', result2);
  console.log();

  // Test 3: No matches
  console.log('Test 3: No matches');
  const b3 = "hello world";
  const T3 = ["xyz", "abc", "123"];
  const result3 = multiSearch(b3, T3);
  console.log('Input:', b3);
  console.log('Search strings:', T3);
  console.log('Result:', result3);
  console.log();

  // Test 4: Empty string search
  console.log('Test 4: Edge case - empty strings');
  const b4 = "test";
  const T4 = [""];
  const result4 = multiSearch(b4, T4);
  console.log('Input:', b4);
  console.log('Search strings:', T4);
  console.log('Result:', result4);
  console.log();

  // Test 5: Full string match
  console.log('Test 5: Full string match');
  const b5 = "algorithm";
  const T5 = ["algorithm", "algo", "rithm", "go"];
  const result5 = multiSearch(b5, T5);
  console.log('Input:', b5);
  console.log('Search strings:', T5);
  console.log('Result:', result5);
  console.log();

  // Performance comparison
  console.log('Performance Comparison:');
  const bigText = "abcdefghijklmnopqrstuvwxyz".repeat(100);
  const searches = ["abc", "xyz", "mno", "def", "klm", "pqr", "stu", "vwx"];

  console.time('Naive');
  multiSearchNaive(bigText, searches);
  console.timeEnd('Naive');

  console.time('Optimized');
  multiSearchOptimized(bigText, searches);
  console.timeEnd('Optimized');

  console.time('Trie');
  multiSearchTrie(bigText, searches);
  console.timeEnd('Trie');

  console.time('Compact Trie');
  multiSearchCompactTrie(bigText, searches);
  console.timeEnd('Compact Trie');

  console.time('Inverted Index');
  multiSearchInvertedIndex(bigText, searches);
  console.timeEnd('Inverted Index');
}

// Run tests
runTests();

// Export functions
module.exports = {
  multiSearch,
  multiSearchNaive,
  multiSearchOptimized,
  multiSearchTrie,
  multiSearchCompactTrie,
  multiSearchInvertedIndex,
  Trie,
  CompactTrie
};
