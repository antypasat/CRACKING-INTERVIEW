# 4.7 Build Order

Find valid build order for projects with dependencies (topological sort).

**Algorithm:** Kahn's algorithm (BFS-based topological sort)
1. Find nodes with no dependencies
2. Process and reduce children's dependencies
3. Detect cycles if order incomplete

**Complexity:** O(P + D) time, O(P) space
