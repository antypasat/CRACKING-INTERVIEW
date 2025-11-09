# 5.6 Conversion

Count bits to flip to convert A to B.

**Algorithm:**
1. XOR A and B (1 where bits differ)
2. Count 1s in XOR result
3. Use `n & (n-1)` to count efficiently

**Complexity:** O(k) where k = # of differing bits
