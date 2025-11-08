# 4.11 Random Node

Binary tree with `getRandomNode()` returning random node (all equally likely).

**Key:** Track subtree size at each node
- Pick random index i ∈ [0, size)
- Navigate to ith node using subtree sizes

**Complexity:** O(log n) for all operations
