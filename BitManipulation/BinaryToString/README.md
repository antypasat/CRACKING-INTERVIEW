# 5.2 Binary to String

Convert decimal (0 < num < 1) to binary string.

**Algorithm:**
- Multiply by 2 repeatedly
- If ≥ 1, append '1' and subtract 1
- If < 1, append '0'
- Return ERROR if > 32 chars

**Complexity:** O(1) - max 32 iterations
