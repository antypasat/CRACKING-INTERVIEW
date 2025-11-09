// 4.8 First Common Ancestor - Lowest Common Ancestor (LCA)
// Pierwszy wspólny przodek

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Find LCA without parent links
 * O(n) time, O(h) space
 */
function findLCA(root, p, q) {
  if (!root || root === p || root === q) return root;

  const left = findLCA(root.left, p, q);
  const right = findLCA(root.right, p, q);

  // If both sides return non-null, current node is LCA
  if (left && right) return root;

  // Return non-null side
  return left || right;
}

/**
 * Alternative: With verification that both nodes exist
 */
function findLCAVerified(root, p, q) {
  const result = findLCAHelper(root, p, q);

  if (result.ancestor && result.count === 2) {
    return result.ancestor;
  }
  return null;
}

function findLCAHelper(root, p, q) {
  if (!root) return { ancestor: null, count: 0 };

  const left = findLCAHelper(root.left, p, q);
  if (left.count === 2) return left;

  const right = findLCAHelper(root.right, p, q);
  if (right.count === 2) return right;

  const count = left.count + right.count + (root === p ? 1 : 0) + (root === q ? 1 : 0);

  return {
    ancestor: count === 2 ? root : null,
    count: count
  };
}

// Tests
console.log('='.repeat(70));
console.log('4.8 FIRST COMMON ANCESTOR (LCA)');
console.log('='.repeat(70));

// Build tree
const root = new TreeNode(5);
root.left = new TreeNode(3);
root.right = new TreeNode(8);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(4);
root.right.left = new TreeNode(7);
root.right.right = new TreeNode(9);

// Tests
const lca1 = findLCA(root, root.left.left, root.left.right); // 1, 4 -> 3
console.log(`LCA(1, 4): ${lca1.value} (expected 3) ✓`);

const lca2 = findLCA(root, root.left, root.right.left); // 3, 7 -> 5
console.log(`LCA(3, 7): ${lca2.value} (expected 5) ✓`);

const lca3 = findLCA(root, root.right.left, root.right.right); // 7, 9 -> 8
console.log(`LCA(7, 9): ${lca3.value} (expected 8) ✓`);

const lca4 = findLCA(root, root, root.left); // 5, 3 -> 5
console.log(`LCA(5, 3): ${lca4.value} (expected 5) ✓`);

console.log('\nComplexity: O(n) time, O(h) space');
console.log('='.repeat(70));
