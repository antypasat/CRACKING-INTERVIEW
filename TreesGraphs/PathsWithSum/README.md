# 4.12 Paths with Sum

Count paths that sum to target (can start/end anywhere, must go down).

**Solutions:**
1. **Optimized:** Hash map with running sums - O(n) time
2. **Brute force:** Check from each node - O(n log n) average

**Key insight:** Use prefix sums like subarray sum problem

**Complexity:** O(n) time, O(n) space (optimal)
