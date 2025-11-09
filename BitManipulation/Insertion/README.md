# 5.1 Insertion

Insert M into N from bit i to bit j.

**Algorithm:**
1. Create mask to clear bits [i,j] in N
2. Shift M left by i positions
3. OR them together

**Complexity:** O(1)
