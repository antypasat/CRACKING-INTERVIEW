# 8.2 Robot in a Grid

## Original Problem / Oryginalne Zadanie

**Robot in a Grid:** Imagine a robot sitting on the upper left corner of grid with r rows and c columns. The robot can only move in two directions, right and down, but certain cells are "off limits" such that the robot cannot step on them. Design an algorithm to find a path for the robot from the top left to the bottom right.

**Robot w Siatce:** Wyobraź sobie robota siedzącego w lewym górnym rogu siatki z r wierszami i c kolumnami. Robot może poruszać się tylko w dwóch kierunkach: w prawo i w dół, ale niektóre komórki są "niedostępne" i robot nie może na nie wejść. Zaprojektuj algorytm znajdowania ścieżki dla robota z lewego górnego do prawego dolnego rogu.

Hints: #331, #360, #388

---

## Understanding the Problem / Zrozumienie Problemu

This is a **pathfinding problem** with constraints:
To jest **problem znajdowania ścieżki** z ograniczeniami:

- **Start:** Top-left (0, 0) / Lewy górny róg (0, 0)
- **End:** Bottom-right (r-1, c-1) / Prawy dolny róg (r-1, c-1)
- **Allowed moves:** RIGHT or DOWN only / Tylko W PRAWO lub W DÓŁ
- **Obstacles:** Some cells cannot be visited / Niektóre komórki nie mogą być odwiedzone

```
Example / Przykład:

Grid (. = free, X = obstacle):
  0 1 2 3
0 . . . .
1 . X . .
2 . . X .
3 . . . X

Possible path:
(0,0) → (0,1) → (0,2) → (0,3) → (1,3) → (2,3) → (3,3)

Visual with path (*):
* * * *
. X . *
. . X *
. . . *
```

### Key Constraints / Kluczowe Ograniczenia

1. **Can only move right or down** - reduces search space
   **Tylko ruch w prawo lub w dół** - redukuje przestrzeń przeszukiwania

2. **Some cells blocked** - path may not exist
   **Niektóre komórki zablokowane** - ścieżka może nie istnieć

3. **Must reach bottom-right** - specific destination
   **Musi dotrzeć do prawego dolnego rogu** - konkretny cel

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Naive Backtracking / Naiwne Cofanie

**Strategy:** Try all possible paths recursively
**Strategia:** Wypróbuj wszystkie możliwe ścieżki rekurencyjnie

```javascript
function findPathNaive(grid) {
  const path = [];
  const rows = grid.length;
  const cols = grid[0].length;

  if (helper(grid, rows - 1, cols - 1, path)) {
    return path;
  }
  return null;
}

function helper(grid, row, col, path) {
  // Out of bounds or obstacle
  if (row < 0 || col < 0 || grid[row][col]) {
    return false;
  }

  const isAtOrigin = (row === 0 && col === 0);

  // Try to reach (row, col) from origin
  if (isAtOrigin ||
      helper(grid, row - 1, col, path) ||  // Try from above
      helper(grid, row, col - 1, path)) {  // Try from left
    path.push(new Point(row, col));
    return true;
  }

  return false;
}
```

**Recursion Tree Example (3x3 grid):**
```
                    (2,2)
                /           \
            (1,2)           (2,1)
           /    \          /     \
       (0,2)  (1,1)    (1,1)   (2,0)
        /       / \      / \       \
    (0,1)  (0,1)(1,0)(0,1)(1,0)  (1,0)
      ...
```

**Problems / Problemy:**
- Overlapping subproblems - visits same cells multiple times
- Exponential time complexity
- Many wasted computations

**Time:** O(2^(r+c)) - exponential
**Space:** O(r+c) - recursion depth

---

### Approach 2: Backtracking with Memoization (RECOMMENDED) / Cofanie z Memoizacją (ZALECANE)

**Strategy:** Cache cells that don't lead to solution
**Strategia:** Buforuj komórki które nie prowadzą do rozwiązania

```javascript
function findPathMemo(grid) {
  const path = [];
  const failedPoints = new Set();  // Cache failed cells
  const rows = grid.length;
  const cols = grid[0].length;

  if (helper(grid, rows - 1, cols - 1, path, failedPoints)) {
    return path;
  }
  return null;
}

function helper(grid, row, col, path, failedPoints) {
  if (row < 0 || col < 0 || grid[row][col]) {
    return false;
  }

  const point = new Point(row, col);

  // Already tried this cell - it doesn't work
  if (failedPoints.has(point.hashCode())) {
    return false;
  }

  const isAtOrigin = (row === 0 && col === 0);

  if (isAtOrigin ||
      helper(grid, row - 1, col, path, failedPoints) ||
      helper(grid, row, col - 1, path, failedPoints)) {
    path.push(point);
    return true;
  }

  // Mark this cell as failed
  failedPoints.add(point.hashCode());
  return false;
}
```

**How Memoization Helps / Jak Memoizacja Pomaga:**
```
Without memoization:
Cell (1,1) might be visited many times from different paths

With memoization:
Cell (1,1) visited once. If it fails, it's cached.
All future paths skip it immediately.

Example with obstacles:
. . .
. X .    (1,1) is obstacle
. . .

When trying to reach (2,2):
- Try (1,2) → fails (obstacle above)
- Cache (1,2) as failed
- Try (2,1) → succeeds!
- Never try (1,2) again
```

**Time:** O(r × c) - each cell visited at most once
**Space:** O(r × c) - memoization cache

✅ **RECOMMENDED - Best balance of clarity and efficiency**

---

### Approach 3: Dynamic Programming (Bottom-Up) / Programowanie Dynamiczne (Od Dołu)

**Strategy:** Build reachability table, then reconstruct path
**Strategia:** Zbuduj tabelę osiągalności, potem odtwórz ścieżkę

```javascript
function findPathDP(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // dp[i][j] = can we reach cell (i,j)?
  const dp = Array(rows).fill(null).map(() => Array(cols).fill(false));

  // Base case
  dp[0][0] = true;

  // Fill first column (can only come from above)
  for (let i = 1; i < rows; i++) {
    if (!grid[i][0] && dp[i - 1][0]) {
      dp[i][0] = true;
    }
  }

  // Fill first row (can only come from left)
  for (let j = 1; j < cols; j++) {
    if (!grid[0][j] && dp[0][j - 1]) {
      dp[0][j] = true;
    }
  }

  // Fill rest of table
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (!grid[i][j]) {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      }
    }
  }

  if (!dp[rows - 1][cols - 1]) return null;

  // Reconstruct path by tracing back
  return reconstructPath(dp, grid);
}
```

**DP Table Example (4x4 grid with obstacles):**
```
Grid:           DP Table:
. . . .         T T T T
. X . .         T F T T
. . X .         T T F T
. . . X         T T T F

T = reachable, F = not reachable

Path reconstruction:
Start at (3,3) with T
- Check (2,3): T → move up
- Check (1,3): T → move up
- Check (0,3): T → move up
- Check (0,2): T → move left
- ...continue to (0,0)
```

**Time:** O(r × c) - fill entire table
**Space:** O(r × c) - DP table

---

## Comparison / Porównanie

| Approach / Podejście | Time | Space | Pros / Zalety | Cons / Wady |
|---|---|---|---|---|
| Naive Backtracking | O(2^(r+c)) | O(r+c) | Simple / Proste | Too slow / Zbyt wolne |
| **Memoization** | **O(r×c)** | **O(r×c)** | **Efficient, clear** | Uses recursion |
| Dynamic Programming | O(r×c) | O(r×c) | Iterative | Must build entire table |

**Recommendation / Rekomendacja:**
Use **Memoization** - it's efficient and stops early if path found.
Użyj **Memoizacji** - jest wydajna i zatrzymuje się wcześnie jeśli ścieżka znaleziona.

---

## Step-by-Step Example / Przykład Krok po Kroku

**Problem:** Find path in this 4×4 grid:
```
Start
  ↓
  . . . .
  . X . .
  . . X .
  . . . X ← End
```

**Memoization approach:**

```
1. Start at (3,3) - need path to here

2. Try from (2,3):
   - Not obstacle ✓
   - Try from (1,3):
     - Not obstacle ✓
     - Try from (0,3):
       - Not obstacle ✓
       - Try from (0,2):
         - Continue...

3. Build path: (0,0) → (0,1) → (0,2) → (0,3) → (1,3) → (2,3) → (3,3)

4. Obstacles at (1,1), (2,2), (3,3) never visited

5. Failed cells cached to avoid revisiting
```

**Visual with path:**
```
* * * *
. X . *
. . X *
. . . *
```

---

## Key Insights / Kluczowe Spostrzeżenia

### 1. Top-Down vs Bottom-Up / Od Góry vs Od Dołu

**Top-Down (Memoization):**
- Start from destination, work back to origin
- Natural for "find path to (r,c)" thinking
- Can stop early if path found

**Bottom-Up (DP):**
- Start from origin, work forward to destination
- Must process entire grid
- Better for "count all paths" problems

### 2. Why Memoization Works / Dlaczego Memoizacja Działa

```
Without memo:
(2,2) might be reached via:
  - (1,2) → (2,2)
  - (2,1) → (2,2)
  - (0,2) → (1,2) → (2,2)
  - ... many more paths

Each time, we recompute if (2,2) leads to destination.

With memo:
First time we reach (2,2), we check if it leads to destination.
Result is cached. All future attempts use cached result.

Reduction: O(2^(r+c)) → O(r×c)
```

### 3. Failed Points Cache / Pamięć Nieudanych Punktów

The key insight: **cache negative results**.
Kluczowy wgląd: **buforuj wyniki negatywne**.

```javascript
// If a cell doesn't lead to destination, remember that
failedPoints.add(point.hashCode());

// Don't try it again
if (failedPoints.has(point.hashCode())) {
  return false;
}
```

---

## Edge Cases / Przypadki Brzegowe

```javascript
1. 1×1 grid: Already at destination → [(0,0)]

2. Empty grid: No cells → null

3. Start blocked:
   X .
   . .
   → null (can't start)

4. End blocked:
   . .
   . X
   → null (can't reach end)

5. No path (wall):
   . X
   X .
   → null (blocked)

6. Single row: . . . → [(0,0), (0,1), (0,2)]

7. Single column:
   .
   .
   .
   → [(0,0), (1,0), (2,0)]
```

---

## Common Mistakes / Częste Błędy

### 1. Wrong Base Case / Zły Przypadek Bazowy

```javascript
// ❌ WRONG - doesn't check obstacles at destination
if (row === rows - 1 && col === cols - 1) {
  return true;
}

// ✅ CORRECT - check obstacle first
if (row < 0 || col < 0 || grid[row][col]) {
  return false;
}
```

### 2. Not Caching Failed Points / Nie Buforowanie Nieudanych Punktów

```javascript
// ❌ WRONG - no memoization (too slow)
function helper(grid, row, col, path) {
  // ... no cache ...
}

// ✅ CORRECT - cache failed attempts
function helper(grid, row, col, path, failedPoints) {
  if (failedPoints.has(point.hashCode())) return false;
  // ... rest ...
  failedPoints.add(point.hashCode());
}
```

### 3. Modifying Grid During Search / Modyfikacja Siatki Podczas Przeszukiwania

```javascript
// ❌ WRONG - modifies grid (side effects)
grid[row][col] = true;  // Mark as visited
// ... search ...
grid[row][col] = false; // Unmark

// ✅ CORRECT - use separate visited set
const visited = new Set();
visited.add(point.hashCode());
```

### 4. Building Path in Wrong Order / Budowanie Ścieżki w Złej Kolejności

```javascript
// Path is built backwards (from end to start)
// Need to reverse at the end if building bottom-up

// Top-down naturally builds correct order
path.push(point);  // Add to end as we recurse back
```

---

## Extensions / Rozszerzenia

### 1. Count All Paths / Policz Wszystkie Ścieżki

```javascript
function countPaths(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dp = Array(rows).fill(null).map(() => Array(cols).fill(0));

  dp[0][0] = 1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j]) continue;  // Skip obstacles

      if (i > 0) dp[i][j] += dp[i - 1][j];  // From above
      if (j > 0) dp[i][j] += dp[i][j - 1];  // From left
    }
  }

  return dp[rows - 1][cols - 1];
}
```

### 2. Find Shortest Path / Znajdź Najkrótszą Ścieżkę

```javascript
// All paths with only right/down moves have same length: r + c - 2
// Any valid path is a shortest path!
// Use BFS if diagonal moves allowed.
```

### 3. Allow Up/Left Moves / Pozwól na Ruchy W Górę/W Lewo

```javascript
// Use BFS (Breadth-First Search) instead
// Need visited set to avoid cycles
function findPathBFS(grid) {
  const queue = [[0, 0, [(0, 0)]]];  // [row, col, path]
  const visited = new Set(['0,0']);

  while (queue.length > 0) {
    const [row, col, path] = queue.shift();

    if (row === rows - 1 && col === cols - 1) {
      return path;
    }

    // Try all 4 directions
    for (const [dr, dc] of [[0,1], [1,0], [0,-1], [-1,0]]) {
      // ... explore neighbors ...
    }
  }
}
```

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Simple grids without obstacles
- ✅ Grids with various obstacle patterns
- ✅ Complex mazes
- ✅ No path possible (blocked)
- ✅ Single row/column
- ✅ Start/end blocked
- ✅ Large grids
- ✅ Edge cases (1×1, empty)
- ✅ Visual path display

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify constraints:**
   - "Can the robot move diagonally?" (No)
   - "Is there always a path?" (No - handle no solution)
   - "What should I return if no path?" (null or empty array)

2. **Start with approach:**
   - "I'll use backtracking with memoization"
   - "We work backwards from destination to origin"

3. **Explain memoization:**
   - "If a cell doesn't lead to the destination, I'll cache that fact"
   - "This avoids recomputing the same cell multiple times"

4. **Handle edge cases:**
   - "I'll check if start or end is blocked"
   - "Empty grid returns null"

5. **Complexity analysis:**
   - "Without memoization: O(2^(r+c)) - exponential"
   - "With memoization: O(r×c) - each cell visited once"

6. **Draw it out:**
   - Visual grid helps explain the approach
   - Show example of overlapping subproblems

---

## Key Takeaways / Kluczowe Wnioski

1. **Backtracking with memoization** is the recommended approach
   **Cofanie z memoizacją** jest zalecanym podejściem

2. **Cache failed cells** to avoid recomputation - key optimization
   **Buforuj nieudane komórki** aby uniknąć ponownych obliczeń

3. **Top-down** (start from end) is more intuitive than bottom-up
   **Od góry** (start od końca) jest bardziej intuicyjne niż od dołu

4. **Overlapping subproblems** make this a DP problem
   **Nakładające się podproblemy** czynią to problemem DP

5. **Optimization:** O(2^(r+c)) → O(r×c) with memoization
   **Optymalizacja:** O(2^(r+c)) → O(r×c) z memoizacją

6. Always check for **obstacles** before processing cell
   Zawsze sprawdzaj **przeszkody** przed przetworzeniem komórki

---

**Time Complexity:** O(r × c) with memoization
**Space Complexity:** O(r × c) for cache + O(r+c) for recursion
**Difficulty:** Medium / Średni
