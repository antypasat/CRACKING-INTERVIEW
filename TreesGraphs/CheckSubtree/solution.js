// 4.10 Check Subtree - Is T2 a subtree of T1?
// Sprawdź poddrzewo

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Check if T2 is subtree of T1
 * O(n*m) time where n = nodes in T1, m = nodes in T2
 */
function isSubtree(t1, t2) {
  if (!t2) return true; // Empty tree is subtree
  if (!t1) return false; // Empty tree can't contain non-empty subtree

  if (identicalTrees(t1, t2)) return true;

  return isSubtree(t1.left, t2) || isSubtree(t1.right, t2);
}

function identicalTrees(t1, t2) {
  if (!t1 && !t2) return true;
  if (!t1 || !t2) return false;

  return t1.value === t2.value &&
         identicalTrees(t1.left, t2.left) &&
         identicalTrees(t1.right, t2.right);
}

/**
 * Alternative: Pre-order traversal comparison
 */
function isSubtreePreOrder(t1, t2) {
  const str1 = treeToString(t1);
  const str2 = treeToString(t2);
  return str1.includes(str2);
}

function treeToString(node) {
  if (!node) return 'X';
  return `#${node.value} ${treeToString(node.left)} ${treeToString(node.right)}`;
}

// Tests
console.log('='.repeat(70));
console.log('4.10 CHECK SUBTREE');
console.log('='.repeat(70));

// Build T1
const t1 = new TreeNode(10);
t1.left = new TreeNode(5);
t1.right = new TreeNode(15);
t1.left.left = new TreeNode(3);
t1.left.right = new TreeNode(7);
t1.right.right = new TreeNode(20);

// Build T2 (subtree)
const t2 = new TreeNode(5);
t2.left = new TreeNode(3);
t2.right = new TreeNode(7);

console.log('T1:      10');
console.log('        /  \\');
console.log('       5    15');
console.log('      / \\     \\');
console.log('     3   7    20');
console.log();
console.log('T2:  5');
console.log('    / \\');
console.log('   3   7');
console.log();

console.log(`Is T2 subtree of T1? ${isSubtree(t1, t2)} ✓`);
console.log(`Pre-order approach: ${isSubtreePreOrder(t1, t2)} ✓`);

// Build T3 (not subtree)
const t3 = new TreeNode(5);
t3.left = new TreeNode(3);
t3.right = new TreeNode(8); // Different!

console.log('\nT3:  5');
console.log('    / \\');
console.log('   3   8 (different)');
console.log();
console.log(`Is T3 subtree of T1? ${isSubtree(t1, t3)} (false) ✓`);

console.log('\nComplexity: O(n*m) time, O(h) space');
console.log('='.repeat(70));
