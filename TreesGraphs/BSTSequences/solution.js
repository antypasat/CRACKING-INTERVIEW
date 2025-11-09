// 4.9 BST Sequences - All arrays that could create BST
// Sekwencje BST

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Generate all possible insertion sequences for BST
 * Exponential time complexity
 */
function allSequences(node) {
  if (!node) return [[]];

  const result = [];
  const prefix = [node.value];

  const leftSeq = allSequences(node.left);
  const rightSeq = allSequences(node.right);

  // Weave left and right sequences
  for (const left of leftSeq) {
    for (const right of rightSeq) {
      const weaved = [];
      weaveLists(left, right, weaved, prefix);
      result.push(...weaved);
    }
  }

  return result;
}

function weaveLists(first, second, results, prefix) {
  if (first.length === 0 || second.length === 0) {
    const result = [...prefix, ...first, ...second];
    results.push(result);
    return;
  }

  // Recurse with first element from first list
  const headFirst = first.shift();
  prefix.push(headFirst);
  weaveLists(first, second, results, prefix);
  prefix.pop();
  first.unshift(headFirst);

  // Recurse with first element from second list
  const headSecond = second.shift();
  prefix.push(headSecond);
  weaveLists(first, second, results, prefix);
  prefix.pop();
  second.unshift(headSecond);
}

// Tests
console.log('='.repeat(70));
console.log('4.9 BST SEQUENCES');
console.log('='.repeat(70));

// Simple tree: 2 with left=1, right=3
const root = new TreeNode(2);
root.left = new TreeNode(1);
root.right = new TreeNode(3);

console.log('Tree:');
console.log('  2');
console.log(' / \\');
console.log('1   3');
console.log();

const sequences = allSequences(root);
console.log(`Found ${sequences.length} sequences:`);
sequences.forEach((seq, i) => {
  console.log(`  ${i + 1}. [${seq.join(', ')}]`);
});
console.log('Expected: [2,1,3], [2,3,1]');

// Slightly larger tree
console.log('\nTree:');
console.log('    4');
console.log('   / \\');
console.log('  2   5');
console.log(' /');
console.log('1');

const root2 = new TreeNode(4);
root2.left = new TreeNode(2);
root2.left.left = new TreeNode(1);
root2.right = new TreeNode(5);

const sequences2 = allSequences(root2);
console.log(`\nFound ${sequences2.length} sequences for larger tree`);

console.log('\nComplexity: Exponential (many possible orderings)');
console.log('='.repeat(70));
