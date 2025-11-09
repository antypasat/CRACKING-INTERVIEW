# 17.24 Max Submatrix

## Original Problem

**Max Submatrix:** Given an NxM matrix of positive and negative integers, write code to find the submatrix with the largest possible sum.

```
Example:
Matrix:
   5  -4  -3   8
  -2   5   0  -7
   3  -1   6   1
   0   2  -3   4

Output: Submatrix with sum = 18
   5   0
  -1   6
   2  -3  (Wait, let me recalculate...)

Actually:
   5
   5
   6
Sum = 16 (column from (0,1) to (2,2))
```

Hints: #469, #523, #550, #565, #587, #614, #631

---

## Understanding the Problem

Find a rectangular submatrix (contiguous rows and columns) with the **maximum sum**.

```
Matrix:
  1  2 -1
 -3 -1  4
  5  3  2

Max submatrix:
  5  3  2  (sum = 10)

Or possibly:
  2 -1
 -1  4
  3  2  (sum = 9)

Actually:
  1  2
     (across all rows)
  1+2-3-1+5+3 would need to check...
```

### Key Insight

**2D Kadane's Algorithm:**
1. Fix top and bottom rows
2. Compress to 1D array (sum of columns)
3. Apply 1D Kadane's algorithm
4. Try all pairs of top and bottom rows

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Try every possible submatrix

```javascript
function maxSubmatrix(matrix) {
  if (matrix.length === 0) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;

  let maxSum = -Infinity;
  let result = null;

  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = c1; c2 < cols; c2++) {
          // Calculate sum of submatrix [r1,c1] to [r2,c2]
          const sum = calculateSum(matrix, r1, c1, r2, c2);

          if (sum > maxSum) {
            maxSum = sum;
            result = { r1, c1, r2, c2, sum };
          }
        }
      }
    }
  }

  return result;
}

function calculateSum(matrix, r1, c1, r2, c2) {
  let sum = 0;
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      sum += matrix[r][c];
    }
  }
  return sum;
}
```

**Time:** O(n³ × m³) - catastrophically slow
**Space:** O(1)

---

### Approach 2: 2D Kadane's Algorithm (Optimal)

**Strategy:** Fix top and bottom rows, apply 1D Kadane

```javascript
function maxSubmatrix(matrix) {
  if (matrix.length === 0) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;

  let maxSum = -Infinity;
  let result = null;

  // Try all pairs of top and bottom rows
  for (let top = 0; top < rows; top++) {
    // Array to store sum of columns between top and bottom
    const colSums = new Array(cols).fill(0);

    for (let bottom = top; bottom < rows; bottom++) {
      // Add current row to column sums
      for (let c = 0; c < cols; c++) {
        colSums[c] += matrix[bottom][c];
      }

      // Apply 1D Kadane's algorithm
      const kadaneResult = kadaneWithIndices(colSums);

      if (kadaneResult.sum > maxSum) {
        maxSum = kadaneResult.sum;
        result = {
          r1: top,
          c1: kadaneResult.left,
          r2: bottom,
          c2: kadaneResult.right,
          sum: maxSum
        };
      }
    }
  }

  return result;
}

function kadaneWithIndices(arr) {
  let maxSum = -Infinity;
  let currentSum = 0;
  let maxLeft = 0;
  let maxRight = 0;
  let currentLeft = 0;

  for (let i = 0; i < arr.length; i++) {
    currentSum += arr[i];

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxLeft = currentLeft;
      maxRight = i;
    }

    if (currentSum < 0) {
      currentSum = 0;
      currentLeft = i + 1;
    }
  }

  return { sum: maxSum, left: maxLeft, right: maxRight };
}
```

**Time:** O(n² × m) where n = rows, m = cols
**Space:** O(m) for column sums

✅ **OPTIMAL SOLUTION**

---

### Approach 3: With Prefix Sums

**Strategy:** Use 2D prefix sums for faster submatrix sum calculation

```javascript
function maxSubmatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Build prefix sum matrix
  const prefix = Array(rows + 1).fill(null)
    .map(() => Array(cols + 1).fill(0));

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      prefix[r][c] = matrix[r - 1][c - 1]
                   + prefix[r - 1][c]
                   + prefix[r][c - 1]
                   - prefix[r - 1][c - 1];
    }
  }

  let maxSum = -Infinity;
  let result = null;

  // Try all submatrices
  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = c1; c2 < cols; c2++) {
          const sum = prefix[r2 + 1][c2 + 1]
                    - prefix[r1][c2 + 1]
                    - prefix[r2 + 1][c1]
                    + prefix[r1][c1];

          if (sum > maxSum) {
            maxSum = sum;
            result = { r1, c1, r2, c2, sum };
          }
        }
      }
    }
  }

  return result;
}
```

**Time:** O(n² × m²)
**Space:** O(n × m)

**Not optimal, but useful for multiple queries**

---

## Algorithm Explanation

### 2D Kadane's Walkthrough

```
Matrix:
  2  1 -3 -4
  4  3 -2  5
 -1  2  1  3

Step 1: Fix top=0, bottom=0 (single row)
  colSums = [2, 1, -3, -4]
  Kadane: max = 3 (indices 0-1)
  Sum of [2, 1] = 3

Step 2: Fix top=0, bottom=1 (two rows)
  colSums = [2+4, 1+3, -3-2, -4+5]
          = [6, 4, -5, 1]
  Kadane: max = 10 (indices 0-1)
  Sum of:
    2  1
    4  3
  = 10

Step 3: Fix top=0, bottom=2 (all three rows)
  colSums = [6-1, 4+2, -5+1, 1+3]
          = [5, 6, -4, 4]
  Kadane: max = 11 (indices 0-1)
  Sum of:
    2  1
    4  3
   -1  2
  = 11

Step 4: Fix top=1, bottom=1 (single row)
  colSums = [4, 3, -2, 5]
  Kadane: max = 10 (indices 0-3)

Step 5: Fix top=1, bottom=2 (two rows)
  colSums = [4-1, 3+2, -2+1, 5+3]
          = [3, 5, -1, 8]
  Kadane: max = 15 (indices 0-3)
  Sum of:
    4  3 -2  5
   -1  2  1  3
  = 15 ← MAXIMUM!

Final answer: rows 1-2, cols 0-3, sum = 15
```

### 1D Kadane's Algorithm

```
Array: [4, -2, 5, -1, 3]

currentSum = 0, maxSum = -∞

i=0: currentSum = 0+4 = 4, maxSum = 4
i=1: currentSum = 4-2 = 2
i=2: currentSum = 2+5 = 7, maxSum = 7
i=3: currentSum = 7-1 = 6
i=4: currentSum = 6+3 = 9, maxSum = 9

Result: 9 (entire array)
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n³m³) | O(1) | Extremely slow |
| Prefix Sums | O(n²m²) | O(nm) | Better but not optimal |
| 2D Kadane | O(n²m) | **O(m)** | **Optimal** ✅ |

---

## Edge Cases

```javascript
// Empty matrix
maxSubmatrix([]) → null

// Single element
maxSubmatrix([[5]]) → {r1:0, c1:0, r2:0, c2:0, sum:5}

// All negative
maxSubmatrix([[-1,-2],[-3,-4]]) → {r1:0, c1:0, r2:0, c2:0, sum:-1}

// All positive
maxSubmatrix([[1,2],[3,4]]) → entire matrix, sum=10

// Single row
maxSubmatrix([[1,-2,3,4]]) → [3,4], sum=7

// Single column
maxSubmatrix([[1],[-2],[3],[4]]) → [1,3,4], sum=8

// Checkerboard positive/negative
maxSubmatrix([[1,-1],[- 1,1]]) → {r1:0, c1:0, r2:0, c2:0, sum:1}
```

---

## Common Mistakes

### 1. Wrong Kadane's implementation

```javascript
// ❌ WRONG - not handling all negatives
if (currentSum < 0) currentSum = 0;
// What if all numbers are negative?

// ✅ CORRECT - track maxSum separately
maxSum = Math.max(maxSum, currentSum);
if (currentSum < 0) currentSum = 0;
```

### 2. Off-by-one in prefix sums

```javascript
// ❌ WRONG - wrong indices
sum = prefix[r2][c2] - prefix[r1][c2]...

// ✅ CORRECT - account for 1-indexed prefix
sum = prefix[r2+1][c2+1] - prefix[r1][c2+1]...
```

### 3. Not resetting column sums

```javascript
// ❌ WRONG - reusing colSums across different tops
for (let top = 0; top < rows; top++) {
  for (let bottom = top; bottom < rows; bottom++) {
    // colSums accumulates incorrectly
  }
}

// ✅ CORRECT - reset for each new top
for (let top = 0; top < rows; top++) {
  const colSums = new Array(cols).fill(0);
  for (let bottom = top; bottom < rows; bottom++) {
    // Fresh start for each top
  }
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is 2D maximum subarray"

2. **Explain 1D first:**
   - "In 1D, Kadane's algorithm finds max subarray"
   - "Time O(n), space O(1)"

3. **Extend to 2D:**
   - "Fix top and bottom rows"
   - "Compress to 1D by summing columns"
   - "Apply Kadane's"

4. **Draw it:**
   ```
   Matrix → Fix rows → Column sums → Kadane

   [2, 1]   Fix 0-1    [6, 4]       max = 10
   [4, 3]
   ```

5. **Discuss complexity:**
   - "n² choices for row pairs"
   - "O(m) Kadane's for each"
   - "Total: O(n² × m)"

6. **Mention optimization:** "If n > m, transpose and swap"

---

## Key Takeaways

1. **2D Kadane's** extends 1D max subarray to 2D

2. Fix **row boundaries**, compress to **1D problem**

3. **O(n² × m)** is optimal for this problem

4. Pattern appears in:
   - Maximum sum rectangle
   - Largest submatrix with all 1s
   - Maximum average subarray 2D

5. Can optimize: if n >> m, transpose matrix first

6. Must handle **all negative** values correctly in Kadane's

---

**Time Complexity:** O(n² × m)
**Space Complexity:** O(m)
**Difficulty:** Hard
