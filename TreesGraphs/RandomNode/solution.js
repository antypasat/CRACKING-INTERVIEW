// 4.11 Random Node - Get random node from tree
// Losowy węzeł z drzewa

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.size = 1; // Track subtree size
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  /**
   * Insert node - O(log n) average, O(n) worst
   */
  insert(value) {
    if (!this.root) {
      this.root = new TreeNode(value);
    } else {
      this.insertNode(this.root, value);
    }
  }

  insertNode(node, value) {
    node.size++;

    if (value <= node.value) {
      if (!node.left) {
        node.left = new TreeNode(value);
      } else {
        this.insertNode(node.left, value);
      }
    } else {
      if (!node.right) {
        node.right = new TreeNode(value);
      } else {
        this.insertNode(node.right, value);
      }
    }
  }

  /**
   * Get random node - O(log n) average
   * Each node equally likely to be chosen
   */
  getRandomNode() {
    if (!this.root) return null;

    const random = Math.floor(Math.random() * this.root.size);
    return this.getIthNode(this.root, random);
  }

  getIthNode(node, i) {
    const leftSize = node.left ? node.left.size : 0;

    if (i < leftSize) {
      return this.getIthNode(node.left, i);
    } else if (i === leftSize) {
      return node;
    } else {
      return this.getIthNode(node.right, i - leftSize - 1);
    }
  }

  find(value) {
    return this.findNode(this.root, value);
  }

  findNode(node, value) {
    if (!node) return null;
    if (node.value === value) return node;
    if (value < node.value) return this.findNode(node.left, value);
    return this.findNode(node.right, value);
  }
}

// Tests
console.log('='.repeat(70));
console.log('4.11 RANDOM NODE');
console.log('='.repeat(70));

const tree = new BinaryTree();
const values = [5, 3, 7, 1, 4, 6, 9];

console.log('Inserting:', values.join(', '));
for (const val of values) {
  tree.insert(val);
}

console.log(`Total nodes: ${tree.root.size}`);
console.log();

// Test distribution
console.log('Testing random distribution (1000 samples):');
const counts = {};
for (let i = 0; i < 1000; i++) {
  const node = tree.getRandomNode();
  counts[node.value] = (counts[node.value] || 0) + 1;
}

for (const val of values) {
  const percent = ((counts[val] || 0) / 1000 * 100).toFixed(1);
  console.log(`  ${val}: ${counts[val] || 0} times (${percent}%, expected ~14.3%)`);
}

console.log('\nFind operation:');
console.log(`Find 4: ${tree.find(4) ? '✓' : '✗'}`);
console.log(`Find 10: ${tree.find(10) ? '✗' : '✓ (not found)'}`);

console.log('\nComplexity:');
console.log('  insert: O(log n) average');
console.log('  find: O(log n) average');
console.log('  getRandomNode: O(log n) - equally likely for all nodes');
console.log('='.repeat(70));
