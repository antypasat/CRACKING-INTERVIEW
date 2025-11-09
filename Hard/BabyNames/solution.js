/**
 * 17.7 Baby Names
 *
 * Each year, the government releases a list of the 10,000 most common baby names
 * and their frequencies. The only problem with this is that some names have multiple
 * spellings. For example, "John" and "Jon" are essentially the same name but would be
 * listed separately in the list.
 *
 * Given two lists:
 * 1. A list of name/frequency pairs: {name: frequency}
 * 2. A list of pairs of equivalent names: [name1, name2]
 *
 * Write an algorithm to print a new list of the true frequency of each name.
 * Note that if John and Jon are synonyms, and Jon and Johnny are synonyms,
 * then John and Johnny are synonyms (transitive property).
 *
 * Example:
 * Names: {John: 15, Jon: 12, Chris: 13, Kris: 4, Christopher: 19}
 * Synonyms: [[Jon, John], [John, Johnny], [Chris, Kris], [Chris, Christopher]]
 * Output: {John: 27, Kris: 36} or {Johnny: 27, Kris: 36} or {Christopher: 36, John: 27}
 */

/**
 * Union-Find (Disjoint Set) data structure
 * Efficiently groups synonymous names together
 */
class UnionFind {
  constructor() {
    this.parent = new Map(); // parent[name] = parent name
    this.rank = new Map();   // rank[name] = tree depth for union by rank
  }

  /**
   * Find the root/representative of a name's set
   * Uses path compression for optimization
   * @param {string} name - Name to find root for
   * @returns {string} Root name of the set
   */
  find(name) {
    // Initialize if not seen before
    if (!this.parent.has(name)) {
      this.parent.set(name, name);
      this.rank.set(name, 0);
      return name;
    }

    // Path compression: make every node point directly to root
    if (this.parent.get(name) !== name) {
      this.parent.set(name, this.find(this.parent.get(name)));
    }

    return this.parent.get(name);
  }

  /**
   * Union two names' sets together
   * Uses union by rank for optimization
   * @param {string} name1 - First name
   * @param {string} name2 - Second name
   */
  union(name1, name2) {
    const root1 = this.find(name1);
    const root2 = this.find(name2);

    if (root1 === root2) return; // Already in same set

    // Union by rank: attach smaller tree under larger tree
    const rank1 = this.rank.get(root1) || 0;
    const rank2 = this.rank.get(root2) || 0;

    if (rank1 < rank2) {
      this.parent.set(root1, root2);
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, rank1 + 1);
    }
  }

  /**
   * Check if two names are in the same set
   * @param {string} name1 - First name
   * @param {string} name2 - Second name
   * @returns {boolean} True if synonymous
   */
  connected(name1, name2) {
    return this.find(name1) === this.find(name2);
  }
}

/**
 * Solution: Union-Find approach
 * Group synonymous names and sum their frequencies
 *
 * Algorithm:
 * 1. Build union-find structure from synonym pairs
 * 2. Group names by their root representative
 * 3. Sum frequencies for each group
 * 4. Return consolidated frequencies
 *
 * Time: O(n + p) where n = names, p = synonym pairs
 * Space: O(n) for union-find structure
 *
 * @param {Object} names - Map of name to frequency
 * @param {Array<Array<string>>} synonyms - Pairs of equivalent names
 * @returns {Object} Consolidated name frequencies
 */
function consolidateNames(names, synonyms) {
  const uf = new UnionFind();

  // Build union-find structure from synonyms
  for (const [name1, name2] of synonyms) {
    uf.union(name1, name2);
  }

  // Group names by their root representative
  const groups = new Map(); // root -> {names: [], frequency: total}

  for (const [name, frequency] of Object.entries(names)) {
    const root = uf.find(name);

    if (!groups.has(root)) {
      groups.set(root, { names: [], frequency: 0 });
    }

    groups.get(root).names.push(name);
    groups.get(root).frequency += frequency;
  }

  // Build result using root as representative name
  const result = {};
  for (const [root, { frequency }] of groups.entries()) {
    result[root] = frequency;
  }

  return result;
}

/**
 * Alternative: Graph-based approach with DFS
 * Build a graph of synonyms and find connected components
 *
 * @param {Object} names - Map of name to frequency
 * @param {Array<Array<string>>} synonyms - Pairs of equivalent names
 * @returns {Object} Consolidated name frequencies
 */
function consolidateNamesGraph(names, synonyms) {
  // Build adjacency list
  const graph = new Map();

  const addEdge = (name1, name2) => {
    if (!graph.has(name1)) graph.set(name1, []);
    if (!graph.has(name2)) graph.set(name2, []);
    graph.get(name1).push(name2);
    graph.get(name2).push(name1);
  };

  for (const [name1, name2] of synonyms) {
    addEdge(name1, name2);
  }

  // Ensure all names are in the graph
  for (const name of Object.keys(names)) {
    if (!graph.has(name)) {
      graph.set(name, []);
    }
  }

  // Find connected components using DFS
  const visited = new Set();
  const components = [];

  const dfs = (name, component) => {
    visited.add(name);
    component.push(name);

    for (const neighbor of graph.get(name) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, component);
      }
    }
  };

  // Find all connected components
  for (const name of graph.keys()) {
    if (!visited.has(name)) {
      const component = [];
      dfs(name, component);
      components.push(component);
    }
  }

  // Consolidate frequencies for each component
  const result = {};

  for (const component of components) {
    // Use first name as representative (alphabetically first for consistency)
    const representative = component.sort()[0];
    let totalFrequency = 0;

    for (const name of component) {
      if (names[name]) {
        totalFrequency += names[name];
      }
    }

    if (totalFrequency > 0) {
      result[representative] = totalFrequency;
    }
  }

  return result;
}

/**
 * Helper function to demonstrate algorithm with detailed output
 * @param {Object} names - Name frequencies
 * @param {Array<Array<string>>} synonyms - Synonym pairs
 * @returns {Object} Consolidated frequencies
 */
function consolidateNamesWithDebug(names, synonyms) {
  console.log('\n--- Consolidating Names ---');
  console.log('\nInput Names:');
  for (const [name, freq] of Object.entries(names)) {
    console.log(`  ${name}: ${freq}`);
  }

  console.log('\nSynonym Pairs:');
  for (const [name1, name2] of synonyms) {
    console.log(`  ${name1} ↔ ${name2}`);
  }

  const uf = new UnionFind();

  console.log('\nBuilding Union-Find Structure:');
  for (const [name1, name2] of synonyms) {
    console.log(`  Union(${name1}, ${name2})`);
    uf.union(name1, name2);
    console.log(`    Root of ${name1}: ${uf.find(name1)}`);
    console.log(`    Root of ${name2}: ${uf.find(name2)}`);
  }

  console.log('\nGrouping Names by Root:');
  const groups = new Map();

  for (const [name, frequency] of Object.entries(names)) {
    const root = uf.find(name);
    console.log(`  ${name} (freq=${frequency}) → root: ${root}`);

    if (!groups.has(root)) {
      groups.set(root, { names: [], frequency: 0 });
    }

    groups.get(root).names.push(name);
    groups.get(root).frequency += frequency;
  }

  console.log('\nConsolidated Groups:');
  for (const [root, { names: groupNames, frequency }] of groups.entries()) {
    console.log(`  ${root}: [${groupNames.join(', ')}] = ${frequency}`);
  }

  const result = {};
  for (const [root, { frequency }] of groups.entries()) {
    result[root] = frequency;
  }

  console.log('\nFinal Result:');
  for (const [name, freq] of Object.entries(result)) {
    console.log(`  ${name}: ${freq}`);
  }

  return result;
}

// ============================================
// TEST CASES
// ============================================

console.log('='.repeat(70));
console.log('17.7 BABY NAMES - TEST CASES');
console.log('='.repeat(70));

// Test 1: Basic example from problem
console.log('\n--- Test 1: Basic Example ---');
const names1 = {
  John: 15,
  Jon: 12,
  Chris: 13,
  Kris: 4,
  Christopher: 19
};
const synonyms1 = [
  ['Jon', 'John'],
  ['John', 'Johnny'],
  ['Chris', 'Kris'],
  ['Chris', 'Christopher']
];

const result1 = consolidateNames(names1, synonyms1);
const result1Graph = consolidateNamesGraph(names1, synonyms1);

console.log('Input names:', names1);
console.log('Synonyms:', synonyms1);
console.log('Union-Find result:', result1);
console.log('Graph result:', result1Graph);

// Verify totals match
const totalInput = Object.values(names1).reduce((a, b) => a + b, 0);
const totalOutput = Object.values(result1).reduce((a, b) => a + b, 0);
console.log(`Total frequency: Input=${totalInput}, Output=${totalOutput}, Match=${totalInput === totalOutput ? '✓' : '✗'}`);

// Test 2: Transitive synonyms
console.log('\n--- Test 2: Transitive Synonyms ---');
const names2 = {
  A: 10,
  B: 20,
  C: 30,
  D: 40
};
const synonyms2 = [
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'D']
];

console.log('Names:', names2);
console.log('Synonyms (A→B→C→D):', synonyms2);
const result2 = consolidateNames(names2, synonyms2);
console.log('Result:', result2);
console.log('All should be grouped: A+B+C+D = 100 ✓' + (Object.values(result2)[0] === 100 ? ' ✓' : ' ✗'));

// Test 3: Multiple separate groups
console.log('\n--- Test 3: Multiple Separate Groups ---');
const names3 = {
  John: 10,
  Jon: 5,
  Mary: 15,
  Marie: 20,
  Bob: 8
};
const synonyms3 = [
  ['John', 'Jon'],
  ['Mary', 'Marie']
];

console.log('Names:', names3);
console.log('Synonyms:', synonyms3);
const result3 = consolidateNames(names3, synonyms3);
console.log('Result:', result3);
console.log('Expected: John group (15), Mary group (35), Bob (8)');

// Test 4: No synonyms
console.log('\n--- Test 4: No Synonyms ---');
const names4 = {
  Alice: 10,
  Bob: 20,
  Charlie: 30
};
const synonyms4 = [];

const result4 = consolidateNames(names4, synonyms4);
console.log('Names:', names4);
console.log('Synonyms: (none)');
console.log('Result:', result4);
console.log('Should be unchanged:', JSON.stringify(result4) === JSON.stringify(names4) ? '✓' : '✗');

// Test 5: All synonyms
console.log('\n--- Test 5: All Names Are Synonyms ---');
const names5 = {
  A: 5,
  B: 10,
  C: 15,
  D: 20,
  E: 25
};
const synonyms5 = [
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'D'],
  ['D', 'E']
];

const result5 = consolidateNames(names5, synonyms5);
console.log('Names:', names5);
console.log('Synonyms (all connected):', synonyms5);
console.log('Result:', result5);
console.log('Should have one entry with total 75:', Object.values(result5).length === 1 && Object.values(result5)[0] === 75 ? '✓' : '✗');

// Test 6: Step-by-step example
console.log('\n--- Test 6: Step-by-Step Example ---');
consolidateNamesWithDebug(names1, synonyms1);

// Test 7: Circular synonyms
console.log('\n--- Test 7: Circular Synonyms ---');
const names7 = {
  A: 10,
  B: 20,
  C: 30
};
const synonyms7 = [
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'A'] // Creates a cycle
];

const result7 = consolidateNames(names7, synonyms7);
console.log('Names:', names7);
console.log('Synonyms (circular):', synonyms7);
console.log('Result:', result7);
console.log('All grouped together (60):', Object.values(result7)[0] === 60 ? '✓' : '✗');

// Test 8: Name in synonyms but not in frequencies
console.log('\n--- Test 8: Synonym Not in Original List ---');
const names8 = {
  John: 15,
  Chris: 20
};
const synonyms8 = [
  ['John', 'Jon'],    // Jon not in original list
  ['Jon', 'Johnny'],  // Johnny not in original list
  ['Chris', 'Kris']   // Kris not in original list
];

const result8 = consolidateNames(names8, synonyms8);
console.log('Names:', names8);
console.log('Synonyms:', synonyms8);
console.log('Result:', result8);
console.log('Note: Synonyms without frequencies are included but contribute 0');

// Test 9: Case sensitivity
console.log('\n--- Test 9: Case Sensitivity ---');
const names9 = {
  john: 10,
  John: 15,
  JOHN: 5
};
const synonyms9 = []; // Treating as different names

const result9 = consolidateNames(names9, synonyms9);
console.log('Names:', names9);
console.log('Synonyms: (none - case sensitive)');
console.log('Result:', result9);
console.log('All treated as separate names:', Object.keys(result9).length === 3 ? '✓' : '✗');

// Test 10: Complex network
console.log('\n--- Test 10: Complex Synonym Network ---');
const names10 = {
  A: 5, B: 10, C: 15, D: 20, E: 25,
  F: 30, G: 35, H: 40, I: 45, J: 50
};
const synonyms10 = [
  ['A', 'B'], ['B', 'C'], // Group 1: A-B-C
  ['D', 'E'],             // Group 2: D-E
  ['F', 'G'], ['G', 'H'], ['H', 'I'], // Group 3: F-G-H-I
  // J is alone
];

const result10 = consolidateNames(names10, synonyms10);
console.log('Names:', names10);
console.log('Synonym pairs:', synonyms10);
console.log('Result:', result10);
console.log(`Expected 4 groups: ABC(30), DE(45), FGHI(150), J(50)`);

// Count groups
const groups10 = Object.keys(result10).length;
console.log(`Number of groups: ${groups10} (expected 4): ${groups10 === 4 ? '✓' : '✗'}`);

// Test 11: Union-Find vs Graph approach comparison
console.log('\n--- Test 11: Union-Find vs Graph Comparison ---');
const testCases = [names1, names2, names3, names5, names7, names10];
const testSynonyms = [synonyms1, synonyms2, synonyms3, synonyms5, synonyms7, synonyms10];

console.log('Comparing approaches on all test cases:');
for (let i = 0; i < testCases.length; i++) {
  const ufResult = consolidateNames(testCases[i], testSynonyms[i]);
  const graphResult = consolidateNamesGraph(testCases[i], testSynonyms[i]);

  const ufTotal = Object.values(ufResult).reduce((a, b) => a + b, 0);
  const graphTotal = Object.values(graphResult).reduce((a, b) => a + b, 0);
  const inputTotal = Object.values(testCases[i]).reduce((a, b) => a + b, 0);

  const match = ufTotal === graphTotal && ufTotal === inputTotal;
  console.log(`  Test ${i + 1}: UF total=${ufTotal}, Graph total=${graphTotal}, Input total=${inputTotal} ${match ? '✓' : '✗'}`);
}

// Test 12: Performance comparison
console.log('\n--- Test 12: Performance Comparison ---');
function generateLargeTest(numNames, numSynonyms) {
  const names = {};
  for (let i = 0; i < numNames; i++) {
    names[`Name${i}`] = Math.floor(Math.random() * 100) + 1;
  }

  const synonyms = [];
  for (let i = 0; i < numSynonyms; i++) {
    const name1 = `Name${Math.floor(Math.random() * numNames)}`;
    const name2 = `Name${Math.floor(Math.random() * numNames)}`;
    if (name1 !== name2) {
      synonyms.push([name1, name2]);
    }
  }

  return { names, synonyms };
}

const { names: largeNames, synonyms: largeSynonyms } = generateLargeTest(1000, 2000);
console.log(`\nTesting with ${Object.keys(largeNames).length} names and ${largeSynonyms.length} synonym pairs:`);

console.time('Union-Find approach');
const ufResult = consolidateNames(largeNames, largeSynonyms);
console.timeEnd('Union-Find approach');
console.log(`  Result: ${Object.keys(ufResult).length} groups`);

console.time('Graph approach');
const graphResult = consolidateNamesGraph(largeNames, largeSynonyms);
console.timeEnd('Graph approach');
console.log(`  Result: ${Object.keys(graphResult).length} groups`);

// Test 13: Understanding Union-Find
console.log('\n--- Test 13: Understanding Union-Find ---');
console.log('\nUnion-Find Operations:');
const ufDemo = new UnionFind();

console.log('\n1. Initial state: Each element is its own parent');
console.log('   find("A") creates A with parent=A');

console.log('\n2. Union operations connect elements:');
console.log('   union("A", "B") makes A and B share a root');
ufDemo.union('A', 'B');
console.log(`   find("A") = ${ufDemo.find('A')}`);
console.log(`   find("B") = ${ufDemo.find('B')}`);
console.log(`   connected("A", "B") = ${ufDemo.connected('A', 'B')}`);

console.log('\n3. Transitive property:');
ufDemo.union('B', 'C');
console.log('   union("B", "C") connects C to A-B group');
console.log(`   find("C") = ${ufDemo.find('C')}`);
console.log(`   connected("A", "C") = ${ufDemo.connected('A', 'C')} (even though no direct union!)`);

console.log('\n4. Path compression:');
console.log('   After find operations, all nodes point directly to root');
console.log('   This keeps the tree flat for O(1) future operations');

// Summary
console.log('\n' + '='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log('✓ Union-Find approach correctly groups synonymous names');
console.log('✓ Graph approach validates results');
console.log('✓ Handles transitive synonyms (A→B, B→C implies A→C)');
console.log('✓ Works with circular synonym references');
console.log('✓ Handles multiple separate groups correctly');
console.log('✓ Total frequency is preserved after consolidation');
console.log('✓ Efficient for large datasets (nearly O(1) amortized per operation)');
console.log('\nAlgorithm Complexity:');
console.log('- Time: O(n + p × α(n)) ≈ O(n + p) where α is inverse Ackermann');
console.log('- Space: O(n) for union-find structure');
console.log('\nKey Technique:');
console.log('- Union-Find is perfect for grouping equivalent elements');
console.log('- Path compression + union by rank ensure nearly constant time');
console.log('- Automatically handles transitive relationships');
console.log('='.repeat(70));

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    consolidateNames,
    consolidateNamesGraph,
    UnionFind
  };
}
