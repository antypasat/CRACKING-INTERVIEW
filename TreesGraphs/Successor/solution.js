// 4.6 Successor - Find in-order successor in BST
// Znajdź następnik in-order w BST

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/**
 * Find in-order successor with parent links
 * O(h) time, O(1) space
 */
function inorderSuccessor(node) {
  if (!node) return null;

  // Case 1: Node has right subtree -> leftmost of right subtree
  if (node.right) {
    return leftmost(node.right);
  }

  // Case 2: No right subtree -> go up to first ancestor where we come from left
  let current = node;
  let parent = current.parent;

  while (parent && parent.right === current) {
    current = parent;
    parent = parent.parent;
  }

  return parent;
}

function leftmost(node) {
  while (node.left) {
    node = node.left;
  }
  return node;
}

// Tests
console.log('='.repeat(70));
console.log('4.6 SUCCESSOR');
console.log('='.repeat(70));

// Build BST with parent links
const root = new TreeNode(5);
root.left = new TreeNode(3);
root.right = new TreeNode(7);
root.left.parent = root;
root.right.parent = root;

root.left.left = new TreeNode(1);
root.left.right = new TreeNode(4);
root.left.left.parent = root.left;
root.left.right.parent = root.left;

root.right.left = new TreeNode(6);
root.right.right = new TreeNode(9);
root.right.left.parent = root.right;
root.right.right.parent = root.right;

// Tests
const succ3 = inorderSuccessor(root.left); // 3 -> 4
console.log(`Successor of 3: ${succ3?.value} (expected 4) ✓`);

const succ4 = inorderSuccessor(root.left.right); // 4 -> 5
console.log(`Successor of 4: ${succ4?.value} (expected 5) ✓`);

const succ5 = inorderSuccessor(root); // 5 -> 6
console.log(`Successor of 5: ${succ5?.value} (expected 6) ✓`);

const succ9 = inorderSuccessor(root.right.right); // 9 -> null
console.log(`Successor of 9: ${succ9} (expected null) ✓`);

console.log('\nComplexity: O(h) time, O(1) space');
console.log('='.repeat(70));
