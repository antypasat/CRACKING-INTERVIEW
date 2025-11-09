// 4.5 Validate BST - Check if binary tree is a BST
// Sprawdź czy drzewo binarne jest BST

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Validate BST using min/max range
 * O(n) time, O(h) space
 */
function isValidBST(root) {
  return validate(root, -Infinity, Infinity);
}

function validate(node, min, max) {
  if (!node) return true;

  // Current node must be within range
  if (node.value <= min || node.value >= max) return false;

  // Left subtree: values < node.value
  // Right subtree: values > node.value
  return validate(node.left, min, node.value) &&
         validate(node.right, node.value, max);
}

/**
 * Alternative: In-order traversal (should be sorted)
 */
function isValidBSTInOrder(root) {
  const values = [];
  inOrder(root, values);

  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i-1]) return false;
  }
  return true;
}

function inOrder(node, values) {
  if (!node) return;
  inOrder(node.left, values);
  values.push(node.value);
  inOrder(node.right, values);
}

// Tests
console.log('='.repeat(70));
console.log('4.5 VALIDATE BST');
console.log('='.repeat(70));

// Valid BST
const validBST = new TreeNode(5);
validBST.left = new TreeNode(3);
validBST.right = new TreeNode(7);
validBST.left.left = new TreeNode(1);
validBST.left.right = new TreeNode(4);
console.log(`Valid BST: ${isValidBST(validBST)} ✓`);

// Invalid BST
const invalidBST = new TreeNode(5);
invalidBST.left = new TreeNode(3);
invalidBST.right = new TreeNode(7);
invalidBST.left.left = new TreeNode(1);
invalidBST.left.right = new TreeNode(6); // Invalid: 6 > 5
console.log(`Invalid BST: ${isValidBST(invalidBST)} (false) ✓`);

// In-order approach
console.log(`\nIn-order validation: ${isValidBSTInOrder(validBST)} ✓`);
console.log(`In-order validation: ${isValidBSTInOrder(invalidBST)} (false) ✓`);

console.log('\nComplexity: O(n) time, O(h) space');
console.log('='.repeat(70));
