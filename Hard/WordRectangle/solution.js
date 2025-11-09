/**
 * PROBLEM 17.25 - WORD RECTANGLE
 *
 * Given a list of millions of words, design an algorithm to create the largest
 * possible rectangle of letters such that every row forms a word (reading left to
 * right) and every column forms a word (reading top to bottom).
 *
 * Example:
 * Input: ["BALL", "AREA", "LEAD", "LADY"]
 * Output:
 *   B A L L
 *   A R E A
 *   L E A D
 *   L A D Y
 *
 * This is an extremely complex combinatorial problem. We need to:
 * 1. Group words by length
 * 2. Use a Trie to quickly validate column words
 * 3. Try different rectangle dimensions
 * 4. Backtrack when columns don't form valid word prefixes
 */

// =============================================================================
// TRIE IMPLEMENTATION FOR WORD VALIDATION
// =============================================================================

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

  /**
   * Check if a prefix exists in the trie
   */
  hasPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return true;
  }

  /**
   * Check if a word exists in the trie
   */
  hasWord(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return node.isWord;
  }

  /**
   * Get all possible next characters for a prefix
   */
  getPossibleNextChars(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    return Array.from(node.children.keys());
  }
}

// =============================================================================
// WORD RECTANGLE SOLVER
// =============================================================================

class WordRectangle {
  constructor(words) {
    this.wordsByLength = this.groupWordsByLength(words);
    this.tries = this.buildTries(words);
  }

  /**
   * Group words by their length
   */
  groupWordsByLength(words) {
    const groups = new Map();
    for (const word of words) {
      const len = word.length;
      if (!groups.has(len)) {
        groups.set(len, []);
      }
      groups.get(len).push(word);
    }
    return groups;
  }

  /**
   * Build tries for each word length
   */
  buildTries(words) {
    const tries = new Map();
    for (const word of words) {
      const len = word.length;
      if (!tries.has(len)) {
        tries.set(len, new Trie());
      }
      tries.get(len).insert(word);
    }
    return tries;
  }

  /**
   * Find the largest word rectangle
   * Try different dimensions starting from largest area
   */
  findLargestRectangle(maxLength = 20) {
    // Generate dimensions sorted by area (largest first)
    const dimensions = this.getDimensionsByArea(maxLength);

    for (const { rows, cols } of dimensions) {
      const rectangle = this.findRectangle(rows, cols);
      if (rectangle) {
        return rectangle;
      }
    }

    return null;
  }

  /**
   * Generate dimensions sorted by area
   */
  getDimensionsByArea(maxLength) {
    const dimensions = [];

    for (let rows = 1; rows <= maxLength; rows++) {
      for (let cols = 1; cols <= maxLength; cols++) {
        if (this.wordsByLength.has(cols) && this.wordsByLength.has(rows)) {
          dimensions.push({ rows, cols, area: rows * cols });
        }
      }
    }

    // Sort by area descending
    dimensions.sort((a, b) => b.area - a.area);

    return dimensions;
  }

  /**
   * Find a rectangle with given dimensions
   */
  findRectangle(rows, cols) {
    const rowWords = this.wordsByLength.get(cols) || [];
    if (rowWords.length === 0) return null;

    const colTrie = this.tries.get(rows);
    if (!colTrie) return null;

    const rectangle = [];
    const result = this.buildRectangle(rectangle, rows, cols, rowWords, colTrie);

    return result ? result : null;
  }

  /**
   * Recursively build rectangle using backtracking
   */
  buildRectangle(rectangle, targetRows, targetCols, rowWords, colTrie) {
    // Base case: rectangle is complete
    if (rectangle.length === targetRows) {
      return rectangle;
    }

    // Try each possible word for the next row
    for (const word of rowWords) {
      // Check if this word can be added (columns must form valid prefixes)
      if (this.canAddWord(rectangle, word, colTrie, targetRows)) {
        rectangle.push(word);

        const result = this.buildRectangle(rectangle, targetRows, targetCols, rowWords, colTrie);
        if (result) {
          return result;
        }

        rectangle.pop(); // Backtrack
      }
    }

    return null;
  }

  /**
   * Check if a word can be added to the current rectangle
   * All columns must form valid word prefixes
   */
  canAddWord(rectangle, word, colTrie, targetRows) {
    const currentRow = rectangle.length;

    for (let col = 0; col < word.length; col++) {
      // Build column prefix
      let columnPrefix = '';
      for (let row = 0; row < currentRow; row++) {
        columnPrefix += rectangle[row][col];
      }
      columnPrefix += word[col];

      // If this is the last row, column must be a complete word
      if (currentRow === targetRows - 1) {
        if (!colTrie.hasWord(columnPrefix)) {
          return false;
        }
      } else {
        // Otherwise, column must be a valid prefix
        if (!colTrie.hasPrefix(columnPrefix)) {
          return false;
        }
      }
    }

    return true;
  }
}

// =============================================================================
// APPROACH 2: OPTIMIZED WITH COLUMN TRACKING
// Track columns as we build to avoid redundant string building
// =============================================================================

class WordRectangleOptimized {
  constructor(words) {
    this.wordsByLength = new Map();
    this.tries = new Map();

    for (const word of words) {
      const len = word.length;
      if (!this.wordsByLength.has(len)) {
        this.wordsByLength.set(len, []);
        this.tries.set(len, new Trie());
      }
      this.wordsByLength.get(len).push(word);
      this.tries.get(len).insert(word);
    }
  }

  findLargestRectangle(maxLength = 20) {
    const dimensions = [];

    for (let rows = 1; rows <= maxLength; rows++) {
      for (let cols = 1; cols <= maxLength; cols++) {
        if (this.wordsByLength.has(cols) && this.wordsByLength.has(rows)) {
          dimensions.push({ rows, cols, area: rows * cols });
        }
      }
    }

    dimensions.sort((a, b) => b.area - a.area);

    for (const { rows, cols } of dimensions) {
      const rectangle = this.findRectangle(rows, cols);
      if (rectangle) {
        return { rectangle, rows, cols };
      }
    }

    return null;
  }

  findRectangle(rows, cols) {
    const rowWords = this.wordsByLength.get(cols);
    const colTrie = this.tries.get(rows);

    if (!rowWords || !colTrie) return null;

    const rectangle = [];
    const columns = Array(cols).fill('');

    if (this.buildWithColumns(rectangle, columns, rows, cols, rowWords, colTrie)) {
      return rectangle;
    }

    return null;
  }

  buildWithColumns(rectangle, columns, targetRows, targetCols, rowWords, colTrie) {
    if (rectangle.length === targetRows) {
      return true;
    }

    const currentRow = rectangle.length;
    const isLastRow = currentRow === targetRows - 1;

    for (const word of rowWords) {
      // Check if this word is valid for current position
      let valid = true;

      // Check each column
      for (let col = 0; col < targetCols; col++) {
        const newColumn = columns[col] + word[col];

        if (isLastRow) {
          if (!colTrie.hasWord(newColumn)) {
            valid = false;
            break;
          }
        } else {
          if (!colTrie.hasPrefix(newColumn)) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        rectangle.push(word);

        // Update columns
        const oldColumns = [...columns];
        for (let col = 0; col < targetCols; col++) {
          columns[col] += word[col];
        }

        if (this.buildWithColumns(rectangle, columns, targetRows, targetCols, rowWords, colTrie)) {
          return true;
        }

        // Backtrack
        rectangle.pop();
        for (let col = 0; col < targetCols; col++) {
          columns[col] = oldColumns[col];
        }
      }
    }

    return false;
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Visualize rectangle
 */
function visualizeRectangle(rectangle) {
  if (!rectangle) return 'No rectangle found';

  let result = '';
  for (const word of rectangle) {
    result += word.split('').join(' ') + '\n';
  }

  return result;
}

/**
 * Verify rectangle is valid
 */
function verifyRectangle(rectangle, wordSet) {
  if (!rectangle || rectangle.length === 0) return false;

  const rows = rectangle.length;
  const cols = rectangle[0].length;

  // Check all rows are valid words
  for (const row of rectangle) {
    if (!wordSet.has(row)) {
      console.log('Invalid row:', row);
      return false;
    }
  }

  // Check all columns are valid words
  for (let col = 0; col < cols; col++) {
    let column = '';
    for (let row = 0; row < rows; row++) {
      column += rectangle[row][col];
    }
    if (!wordSet.has(column)) {
      console.log('Invalid column:', column);
      return false;
    }
  }

  return true;
}

/**
 * Extract all columns from rectangle
 */
function getColumns(rectangle) {
  if (!rectangle || rectangle.length === 0) return [];

  const cols = rectangle[0].length;
  const columns = [];

  for (let col = 0; col < cols; col++) {
    let column = '';
    for (const row of rectangle) {
      column += row[col];
    }
    columns.push(column);
  }

  return columns;
}

// =============================================================================
// TEST CASES
// =============================================================================

function runTests() {
  console.log('Testing Word Rectangle...\n');

  // Test 1: Simple 4x4 rectangle
  console.log('Test 1: Simple 4x4 rectangle');
  const words1 = ['BALL', 'AREA', 'LEAD', 'LADY'];
  const solver1 = new WordRectangle(words1);
  const result1 = solver1.findRectangle(4, 4);
  console.log('Words:', words1);
  console.log('Rectangle:');
  console.log(visualizeRectangle(result1));
  const wordSet1 = new Set(words1);
  console.log('Valid:', verifyRectangle(result1, wordSet1));
  if (result1) {
    console.log('Columns:', getColumns(result1));
  }
  console.log();

  // Test 2: 3x3 rectangle
  console.log('Test 2: 3x3 rectangle');
  const words2 = ['CAT', 'APE', 'TEA'];
  const solver2 = new WordRectangle(words2);
  const result2 = solver2.findRectangle(3, 3);
  console.log('Words:', words2);
  console.log('Rectangle:');
  console.log(visualizeRectangle(result2));
  console.log();

  // Test 3: Larger word list
  console.log('Test 3: Larger word list with various sizes');
  const words3 = [
    'BALL', 'AREA', 'LEAD', 'LADY',
    'CAT', 'APE', 'TEA',
    'BAT', 'ALE', 'TED',
    'HEART', 'EMBER', 'ABUSE', 'RESIN', 'TREND',
    'AT', 'BE',
    'GO', 'TO'
  ];
  const solver3 = new WordRectangleOptimized(words3);
  const result3 = solver3.findLargestRectangle(6);
  if (result3) {
    console.log(`Found ${result3.rows}x${result3.cols} rectangle:`);
    console.log(visualizeRectangle(result3.rectangle));
    console.log('Columns:', getColumns(result3.rectangle));
    const wordSet3 = new Set(words3);
    console.log('Valid:', verifyRectangle(result3.rectangle, wordSet3));
  } else {
    console.log('No rectangle found');
  }
  console.log();

  // Test 4: Non-square rectangles
  console.log('Test 4: Non-square rectangle (3x4)');
  const words4 = [
    'BALL', 'AREA', 'LEAD',  // 4 letters
    'BAL', 'ARE', 'LED'      // 3 letters
  ];
  const solver4 = new WordRectangle(words4);
  const result4 = solver4.findRectangle(3, 4);
  console.log('Words:', words4);
  console.log('Rectangle (3 rows, 4 cols):');
  console.log(visualizeRectangle(result4));
  console.log();

  // Test 5: Impossible rectangle
  console.log('Test 5: Impossible rectangle');
  const words5 = ['AAA', 'BBB', 'CCC'];
  const solver5 = new WordRectangle(words5);
  const result5 = solver5.findRectangle(3, 3);
  console.log('Words:', words5);
  console.log('Rectangle:', result5);
  console.log('Expected: null (impossible to form valid columns)');
  console.log();

  // Test 6: Comprehensive dictionary
  console.log('Test 6: Small comprehensive dictionary');
  const words6 = [
    // 4-letter words
    'BALL', 'AREA', 'LEAD', 'LADY',
    'BALE', 'AREA', 'LAKE', 'ELKS',
    'BARE', 'AREA', 'READ', 'EARL',
    // 3-letter words
    'BAT', 'ALE', 'TED',
    'BAR', 'ARE', 'REP',
    'CAT', 'ARE', 'TEN',
    // 5-letter words
    'HEART', 'EMBER', 'ABUSE', 'RESIN', 'TREND'
  ];

  const solver6 = new WordRectangleOptimized(words6);

  console.log('Trying different sizes...');
  for (const size of [5, 4, 3, 2]) {
    const rect = solver6.findRectangle(size, size);
    if (rect) {
      console.log(`\nFound ${size}x${size} rectangle:`);
      console.log(visualizeRectangle(rect));
      const wordSet6 = new Set(words6);
      console.log('Valid:', verifyRectangle(rect, wordSet6));
      break;
    }
  }
  console.log();

  // Performance note
  console.log('Performance Note:');
  console.log('- This is an NP-hard problem');
  console.log('- Runtime depends heavily on dictionary size and available valid rectangles');
  console.log('- Trie-based validation provides significant pruning');
  console.log('- For millions of words, additional optimizations needed:');
  console.log('  * Parallel search across dimensions');
  console.log('  * Smarter word ordering (by character frequency)');
  console.log('  * Caching of partial solutions');
}

// Run tests
runTests();

// Export
module.exports = {
  WordRectangle,
  WordRectangleOptimized,
  Trie,
  TrieNode,
  visualizeRectangle,
  verifyRectangle,
  getColumns
};
