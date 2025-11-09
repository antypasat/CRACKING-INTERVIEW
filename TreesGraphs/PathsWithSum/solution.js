// 4.12 Paths with Sum - Count paths summing to target
// Ścieżki o danej sumie

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * Count paths that sum to target value
 * O(n) time with hash map, O(n) space
 */
function countPathsWithSum(root, targetSum) {
  const pathCount = new Map();
  pathCount.set(0, 1); // Base case: empty path
  return countPaths(root, targetSum, 0, pathCount);
}

function countPaths(node, targetSum, runningSum, pathCount) {
  if (!node) return 0;

  runningSum += node.value;
  const sum = runningSum - targetSum;
  let totalPaths = pathCount.get(sum) || 0;

  // Add current running sum
  pathCount.set(runningSum, (pathCount.get(runningSum) || 0) + 1);

  // Recurse
  totalPaths += countPaths(node.left, targetSum, runningSum, pathCount);
  totalPaths += countPaths(node.right, targetSum, runningSum, pathCount);

  // Remove current sum (backtrack)
  pathCount.set(runningSum, pathCount.get(runningSum) - 1);

  return totalPaths;
}

/**
 * Brute force: O(n log n) average, O(n²) worst
 */
function countPathsBrute(root, targetSum) {
  if (!root) return 0;

  // Paths starting from current node
  const pathsFromRoot = countFromNode(root, targetSum, 0);

  // Paths in left and right subtrees
  const pathsLeft = countPathsBrute(root.left, targetSum);
  const pathsRight = countPathsBrute(root.right, targetSum);

  return pathsFromRoot + pathsLeft + pathsRight;
}

function countFromNode(node, targetSum, currentSum) {
  if (!node) return 0;

  currentSum += node.value;
  let totalPaths = currentSum === targetSum ? 1 : 0;

  totalPaths += countFromNode(node.left, targetSum, currentSum);
  totalPaths += countFromNode(node.right, targetSum, currentSum);

  return totalPaths;
}

// Tests
console.log('='.repeat(70));
console.log('4.12 PATHS WITH SUM');
console.log('='.repeat(70));

// Build tree
const root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(-3);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(2);
root.right.right = new TreeNode(11);
root.left.left.left = new TreeNode(3);
root.left.left.right = new TreeNode(-2);
root.left.right.right = new TreeNode(1);

console.log('Tree:');
console.log('        10');
console.log('       /  \\');
console.log('      5   -3');
console.log('     / \\    \\');
console.log('    3   2   11');
console.log('   / \\   \\');
console.log('  3  -2   1');
console.log();

const target = 8;
console.log(`Target sum: ${target}`);
console.log();

const count1 = countPathsWithSum(root, target);
console.log(`Optimized approach: ${count1} paths`);
console.log('Paths: 5->3, 5->2->1, 10->-3->11 (or others)');

const count2 = countPathsBrute(root, target);
console.log(`Brute force approach: ${count2} paths ✓`);

// Test with different target
console.log(`\nTarget sum: 7`);
const count3 = countPathsWithSum(root, 7);
const count4 = countPathsBrute(root, 7);
console.log(`Optimized: ${count3}, Brute: ${count4} ✓`);

console.log('\nComplexity:');
console.log('  Optimized: O(n) time, O(n) space (hash map)');
console.log('  Brute force: O(n log n) average, O(n²) worst');
console.log('='.repeat(70));
