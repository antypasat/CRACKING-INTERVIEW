// 4.4 Check Balanced - Check if binary tree is balanced
// Sprawdź czy drzewo binarne jest zrównoważone

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Check if tree is balanced (heights differ by at most 1)
 * O(n) time, O(h) space for recursion
 */
function isBalanced(root) {
  return checkHeight(root) !== -1;
}

function checkHeight(node) {
  if (!node) return 0;

  const leftHeight = checkHeight(node.left);
  if (leftHeight === -1) return -1; // Left subtree unbalanced

  const rightHeight = checkHeight(node.right);
  if (rightHeight === -1) return -1; // Right subtree unbalanced

  const heightDiff = Math.abs(leftHeight - rightHeight);
  if (heightDiff > 1) return -1; // Current node unbalanced

  return Math.max(leftHeight, rightHeight) + 1;
}

// Tests
console.log('='.repeat(70));
console.log('4.4 CHECK BALANCED');
console.log('='.repeat(70));

// Balanced tree
const balanced = new TreeNode(1);
balanced.left = new TreeNode(2);
balanced.right = new TreeNode(3);
balanced.left.left = new TreeNode(4);
balanced.left.right = new TreeNode(5);
console.log(`Balanced tree: ${isBalanced(balanced)} ✓`);

// Unbalanced tree
const unbalanced = new TreeNode(1);
unbalanced.left = new TreeNode(2);
unbalanced.left.left = new TreeNode(3);
unbalanced.left.left.left = new TreeNode(4);
console.log(`Unbalanced tree: ${isBalanced(unbalanced)} (false) ✓`);

// Single node
const single = new TreeNode(1);
console.log(`Single node: ${isBalanced(single)} ✓`);

// Empty tree
console.log(`Empty tree: ${isBalanced(null)} ✓`);

console.log('\nComplexity: O(n) time, O(h) space');
console.log('='.repeat(70));
