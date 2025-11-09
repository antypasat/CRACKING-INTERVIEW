# 4.8 First Common Ancestor

Find lowest common ancestor (LCA) of two nodes in binary tree.

**Algorithm:** Recursive search
- If both nodes in different subtrees → current is LCA
- If both in same subtree → recurse deeper

**Complexity:** O(n) time, O(h) space
