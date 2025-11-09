# 17.23 Max Black Square

## Original Problem

**Max Black Square:** Imagine you have a square matrix, where each cell (pixel) is either black or white. Design an algorithm to find the maximum subsquare such that all four borders are filled with black pixels.

```
Example:
Matrix:
  B W B B B B
  W B W B W B
  B W B B B B
  B W B B W B
  B B B B B B
  B W B B B B

Output: 4×4 square starting at (2, 2)
```

Hints: #684, #695, #705, #714, #721, #736

---

## Understanding the Problem

Find the **largest square** where all four borders contain only black pixels (interior can be any color).

```
Matrix:
  B B B
  B W B
  B B B

This is a valid 3×3 black-bordered square
(Interior W is ok)

Matrix:
  B B W
  B B B
  B B B

This is NOT valid (top border has W)
```

### Key Insight

For a square at position (row, col) with size k to be valid:
- Top border: all black
- Bottom border: all black
- Left border: all black
- Right border: all black

**Optimization:** Preprocess to count consecutive blacks in each direction.

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** Check every possible square

```javascript
function findMaxBlackSquare(matrix) {
  let maxSize = 0;
  let maxSquare = null;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      // Try all possible square sizes from this position
      const maxPossible = Math.min(
        matrix.length - row,
        matrix[0].length - col
      );

      for (let size = maxSize + 1; size <= maxPossible; size++) {
        if (isValidSquare(matrix, row, col, size)) {
          if (size > maxSize) {
            maxSize = size;
            maxSquare = { row, col, size };
          }
        }
      }
    }
  }

  return maxSquare;
}

function isValidSquare(matrix, row, col, size) {
  // Check top border
  for (let c = col; c < col + size; c++) {
    if (matrix[row][c] !== 'B') return false;
  }

  // Check bottom border
  for (let c = col; c < col + size; c++) {
    if (matrix[row + size - 1][c] !== 'B') return false;
  }

  // Check left border
  for (let r = row; r < row + size; r++) {
    if (matrix[r][col] !== 'B') return false;
  }

  // Check right border
  for (let r = row; r < row + size; r++) {
    if (matrix[r][col + size - 1] !== 'B') return false;
  }

  return true;
}
```

**Time:** O(n⁴) - n² positions × n sizes × n border check
**Space:** O(1)

---

### Approach 2: Preprocessing (Optimal)

**Strategy:** Precompute consecutive black counts

```javascript
function findMaxBlackSquare(matrix) {
  if (matrix.length === 0) return null;

  const n = matrix.length;
  const m = matrix[0].length;

  // Preprocess: count consecutive blacks to the right and down
  const right = Array(n).fill(null).map(() => Array(m).fill(0));
  const down = Array(n).fill(null).map(() => Array(m).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (matrix[i][j] === 'B') {
        right[i][j] = (j < m - 1 ? right[i][j + 1] : 0) + 1;
        down[i][j] = (i < n - 1 ? down[i + 1][j] : 0) + 1;
      }
    }
  }

  let maxSize = 0;
  let maxSquare = null;

  // Try all positions, largest sizes first
  for (let size = Math.min(n, m); size >= 1; size--) {
    if (size <= maxSize) break;

    for (let row = 0; row <= n - size; row++) {
      for (let col = 0; col <= m - size; col++) {
        if (isValidSquarePreprocessed(right, down, row, col, size)) {
          return { row, col, size };  // Found largest
        }
      }
    }
  }

  return maxSquare;
}

function isValidSquarePreprocessed(right, down, row, col, size) {
  // Check top-left corner has enough blacks to right and down
  if (right[row][col] < size) return false;
  if (down[row][col] < size) return false;

  // Check top-right corner has enough blacks down
  if (down[row][col + size - 1] < size) return false;

  // Check bottom-left corner has enough blacks to right
  if (right[row + size - 1][col] < size) return false;

  return true;
}
```

**Time:** O(n³) - n sizes × n² positions
**Space:** O(n²) - preprocessing arrays

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Preprocessing Example

```
Matrix:
  B B W B
  B B B B
  W B B B
  B B B B

Right counts (consecutive blacks to the right):
  2 1 0 1
  4 3 2 1
  0 3 2 1
  4 3 2 1

Down counts (consecutive blacks down):
  2 4 0 4
  1 3 3 3
  0 2 2 2
  1 1 1 1

For a 3×3 square at (0, 1):
  Top-left (0,1): right[0][1]=1 < 3 ✗
  Invalid!

For a 2×2 square at (0, 0):
  Top-left (0,0): right[0][0]=2 ≥ 2 ✓
                  down[0][0]=2 ≥ 2 ✓
  Top-right (0,1): down[0][1]=4 ≥ 2 ✓
  Bottom-left (1,0): right[1][0]=4 ≥ 2 ✓
  Valid!
```

### Why Preprocessing Works

```
For a square to be valid:

Top border:
  (row, col) must have ≥ size consecutive blacks to right

Left border:
  (row, col) must have ≥ size consecutive blacks down

Right border:
  (row, col+size-1) must have ≥ size consecutive blacks down

Bottom border:
  (row+size-1, col) must have ≥ size consecutive blacks to right
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n⁴) | O(1) | Too slow |
| Preprocessing | O(n³) | O(n²) | **Optimal** ✅ |

Further optimization possible: O(n² log n) with binary search on size

---

## Edge Cases

```javascript
// Empty matrix
findMaxBlackSquare([]) → null

// All white
findMaxBlackSquare([['W','W'],['W','W']]) → null

// All black
findMaxBlackSquare([['B','B'],['B','B']]) → {row:0, col:0, size:2}

// Single cell
findMaxBlackSquare([['B']]) → {row:0, col:0, size:1}

// Only 1×1 squares valid
findMaxBlackSquare([['B','W'],['W','B']]) → {row:0, col:0, size:1}

// Non-square matrix
findMaxBlackSquare([
  ['B','B','B'],
  ['B','B','B']
]) → {row:0, col:0, size:2}
```

---

## Common Mistakes

### 1. Checking entire square instead of just borders

```javascript
// ❌ WRONG - checking all cells
for (let i = row; i < row + size; i++) {
  for (let j = col; j < col + size; j++) {
    if (matrix[i][j] !== 'B') return false;
  }
}

// ✅ CORRECT - only check borders
// Interior can be any color!
```

### 2. Wrong preprocessing direction

```javascript
// ❌ WRONG - going forward
right[i][j] = right[i][j - 1] + 1;

// ✅ CORRECT - going backward to count ahead
right[i][j] = (j < m - 1 ? right[i][j + 1] : 0) + 1;
```

### 3. Not trying largest sizes first

```javascript
// ❌ WRONG - finding first valid square
for (let size = 1; size <= n; size++) {
  // Returns smaller square first
}

// ✅ CORRECT - try largest first for early termination
for (let size = n; size >= 1; size--) {
  if (found) return;  // Can stop immediately
}
```

---

## Optimizations

### 1. Binary search on size

```javascript
// Instead of trying all sizes
// Binary search for largest valid size
// O(n² log n) instead of O(n³)
```

### 2. Early termination

```javascript
// If we found size k, don't check positions
// that can't fit size > k
```

### 3. Cache validation results

```javascript
// If square at (r, c) size k is invalid,
// larger squares at same position also invalid
```

---

## Interview Tips

1. **Clarify requirements:**
   - "Only borders need to be black?"
   - "Find one largest or all?"
   - "Return size or coordinates?"

2. **Start with brute force:** "Check every position and size"

3. **Explain optimization:**
   - "Preprocessing consecutive black counts"
   - "O(1) validation instead of O(n)"

4. **Draw example:**
   ```
   B B B W
   B W B B
   B B B B
   W B B B

   2×2 at (0,0):
   B B
   B W   ← Valid! (borders all B)
   ```

5. **Discuss trade-offs:**
   - "O(n²) space for O(n) speedup per validation"

6. **Mention further optimization:** Binary search on size

---

## Key Takeaways

1. **Preprocessing** dramatically speeds up validation

2. Count consecutive blacks in **both directions**

3. Only check **borders**, not entire square

4. Try **largest sizes first** for early termination

5. This pattern appears in:
   - Maximal square/rectangle problems
   - 2D prefix sums
   - Matrix optimization problems

6. Time: O(n³) → O(n² log n) with binary search

---

**Time Complexity:** O(n³) or O(n² log n) optimized
**Space Complexity:** O(n²)
**Difficulty:** Hard
