# 5.3 Flip Bit to Win

Find longest sequence of 1s after flipping exactly one bit.

**Algorithm:** Track current and previous sequences
- When hit 0, can merge prev + current + 1
- Keep track of max

**Complexity:** O(b) where b = bit length
