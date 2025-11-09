// ============================================================================
// 8.2 ROBOT IN A GRID
// ============================================================================

/**
 * Robot in a Grid Problem
 * Problem Robota w Siatce
 *
 * Imagine a robot sitting on the upper left corner of grid with r rows and c
 * columns. The robot can only move in two directions, right and down, but
 * certain cells are "off limits" such that the robot cannot step on them.
 * Design an algorithm to find a path for the robot from the top left to the
 * bottom right.
 *
 * Wyobraź sobie robota siedzącego w lewym górnym rogu siatki z r wierszami i c
 * kolumnami. Robot może poruszać się tylko w dwóch kierunkach, w prawo i w dół,
 * ale niektóre komórki są "niedostępne" i robot nie może na nie wejść.
 * Zaprojektuj algorytm znajdowania ścieżki dla robota z lewego górnego rogu
 * do prawego dolnego.
 */

// ============================================================================
// POINT CLASS / KLASA PUNKTU
// ============================================================================

class Point {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `(${this.row},${this.col})`;
  }

  equals(other) {
    return this.row === other.row && this.col === other.col;
  }

  hashCode() {
    return `${this.row},${this.col}`;
  }
}

// ============================================================================
// APPROACH 1: NAIVE BACKTRACKING
// PODEJŚCIE 1: NAIWNE COFANIE (BACKTRACKING)
// ============================================================================

/**
 * Find path - Naive Backtracking
 * Znajdź ścieżkę - Naiwne Cofanie
 *
 * Try all possible paths using recursion
 * Wypróbuj wszystkie możliwe ścieżki używając rekurencji
 *
 * Time: O(2^(r+c)) - exponential / wykładnicza
 * Space: O(r+c) - recursion stack / stos rekurencji
 *
 * @param {boolean[][]} grid - Grid where true = obstacle / Siatka gdzie true = przeszkoda
 * @returns {Point[]|null} - Path or null / Ścieżka lub null
 */
function findPathNaive(grid) {
  if (!grid || grid.length === 0) return null;

  const path = [];
  const rows = grid.length;
  const cols = grid[0].length;

  if (findPathNaiveHelper(grid, rows - 1, cols - 1, path)) {
    return path;
  }

  return null;
}

/**
 * Helper for naive backtracking
 * Pomocnik dla naiwnego cofania
 */
function findPathNaiveHelper(grid, row, col, path) {
  // Out of bounds or obstacle / Poza granicami lub przeszkoda
  if (row < 0 || col < 0 || grid[row][col]) {
    return false;
  }

  const isAtOrigin = (row === 0 && col === 0);

  // Try to find path from start to (row, col)
  // Spróbuj znaleźć ścieżkę od startu do (row, col)
  if (isAtOrigin ||
      findPathNaiveHelper(grid, row - 1, col, path) ||  // Try from above / Spróbuj z góry
      findPathNaiveHelper(grid, row, col - 1, path)) {  // Try from left / Spróbuj z lewej
    path.push(new Point(row, col));
    return true;
  }

  return false;
}

// ============================================================================
// APPROACH 2: BACKTRACKING WITH MEMOIZATION
// PODEJŚCIE 2: COFANIE Z MEMOIZACJĄ
// ============================================================================

/**
 * Find path - Memoization
 * Znajdź ścieżkę - Memoizacja
 *
 * Cache failed points to avoid recomputation
 * Buforuj nieudane punkty aby uniknąć ponownych obliczeń
 *
 * Time: O(r*c) - each cell visited once / każda komórka raz
 * Space: O(r*c) - memoization cache / pamięć podręczna
 *
 * @param {boolean[][]} grid - Grid where true = obstacle / Siatka gdzie true = przeszkoda
 * @returns {Point[]|null} - Path or null / Ścieżka lub null
 */
function findPathMemo(grid) {
  if (!grid || grid.length === 0) return null;

  const path = [];
  const failedPoints = new Set(); // Cache of points that don't lead to solution
  const rows = grid.length;
  const cols = grid[0].length;

  if (findPathMemoHelper(grid, rows - 1, cols - 1, path, failedPoints)) {
    return path;
  }

  return null;
}

/**
 * Helper for memoized backtracking
 * Pomocnik dla memoizowanego cofania
 */
function findPathMemoHelper(grid, row, col, path, failedPoints) {
  // Out of bounds or obstacle / Poza granicami lub przeszkoda
  if (row < 0 || col < 0 || grid[row][col]) {
    return false;
  }

  const point = new Point(row, col);

  // If we've already visited this point, return / Jeśli już odwiedziliśmy ten punkt
  if (failedPoints.has(point.hashCode())) {
    return false;
  }

  const isAtOrigin = (row === 0 && col === 0);

  // Try to find path from start to current point
  // Spróbuj znaleźć ścieżkę od startu do obecnego punktu
  if (isAtOrigin ||
      findPathMemoHelper(grid, row - 1, col, path, failedPoints) ||
      findPathMemoHelper(grid, row, col - 1, path, failedPoints)) {
    path.push(point);
    return true;
  }

  // Cache that this point doesn't work / Buforuj że ten punkt nie działa
  failedPoints.add(point.hashCode());
  return false;
}

// ============================================================================
// APPROACH 3: DYNAMIC PROGRAMMING (BOTTOM-UP)
// PODEJŚCIE 3: PROGRAMOWANIE DYNAMICZNE (OD DOŁU)
// ============================================================================

/**
 * Find path - Dynamic Programming
 * Znajdź ścieżkę - Programowanie Dynamiczne
 *
 * Build path from start to end iteratively
 * Buduj ścieżkę od startu do końca iteracyjnie
 *
 * Time: O(r*c) - fill entire grid / wypełnij całą siatkę
 * Space: O(r*c) - dp table / tablica dp
 *
 * @param {boolean[][]} grid - Grid where true = obstacle / Siatka gdzie true = przeszkoda
 * @returns {Point[]|null} - Path or null / Ścieżka lub null
 */
function findPathDP(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return null;
  if (grid[0][0] || grid[grid.length - 1][grid[0].length - 1]) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  // DP table: dp[i][j] = can we reach (i,j)?
  // Tablica DP: dp[i][j] = czy możemy dotrzeć do (i,j)?
  const dp = Array(rows).fill(null).map(() => Array(cols).fill(false));

  // Base case / Przypadek bazowy
  dp[0][0] = true;

  // Fill first column / Wypełnij pierwszą kolumnę
  for (let i = 1; i < rows; i++) {
    if (!grid[i][0] && dp[i - 1][0]) {
      dp[i][0] = true;
    }
  }

  // Fill first row / Wypełnij pierwszy wiersz
  for (let j = 1; j < cols; j++) {
    if (!grid[0][j] && dp[0][j - 1]) {
      dp[0][j] = true;
    }
  }

  // Fill rest of table / Wypełnij resztę tabeli
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (!grid[i][j]) {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      }
    }
  }

  // If destination not reachable / Jeśli cel nieosiągalny
  if (!dp[rows - 1][cols - 1]) {
    return null;
  }

  // Reconstruct path / Odtwórz ścieżkę
  return reconstructPath(dp, grid);
}

/**
 * Reconstruct path from DP table
 * Odtwórz ścieżkę z tabeli DP
 */
function reconstructPath(dp, grid) {
  const path = [];
  let row = dp.length - 1;
  let col = dp[0].length - 1;

  path.push(new Point(row, col));

  // Trace back from end to start / Śledź wstecz od końca do startu
  while (row > 0 || col > 0) {
    if (row === 0) {
      // Can only go left / Można tylko iść w lewo
      col--;
    } else if (col === 0) {
      // Can only go up / Można tylko iść w górę
      row--;
    } else if (dp[row - 1][col]) {
      // Prefer going up / Preferuj iść w górę
      row--;
    } else {
      // Go left / Idź w lewo
      col--;
    }
    path.push(new Point(row, col));
  }

  return path.reverse();
}

// ============================================================================
// HELPER FUNCTIONS / FUNKCJE POMOCNICZE
// ============================================================================

/**
 * Create grid from string representation
 * Utwórz siatkę z reprezentacji tekstowej
 *
 * '.' = free cell, 'X' = obstacle
 */
function createGrid(gridStr) {
  const lines = gridStr.trim().split('\n');
  return lines.map(line =>
    line.trim().split('').map(ch => ch === 'X')
  );
}

/**
 * Print grid with path
 * Wypisz siatkę ze ścieżką
 */
function printGrid(grid, path = null) {
  if (!grid || grid.length === 0) {
    console.log('(empty grid)');
    return;
  }

  const rows = grid.length;
  const cols = grid[0].length;

  // Create path set for quick lookup / Utwórz zbiór ścieżki dla szybkiego wyszukiwania
  const pathSet = new Set();
  if (path) {
    path.forEach(p => pathSet.add(p.hashCode()));
  }

  console.log('  ' + Array.from({ length: cols }, (_, i) => i).join(' '));
  console.log('  ' + '-'.repeat(cols * 2 - 1));

  for (let i = 0; i < rows; i++) {
    let row = i + '|';
    for (let j = 0; j < cols; j++) {
      if (grid[i][j]) {
        row += 'X ';  // Obstacle / Przeszkoda
      } else if (pathSet.has(`${i},${j}`)) {
        row += '* ';  // Path / Ścieżka
      } else {
        row += '. ';  // Free / Wolne
      }
    }
    console.log(row);
  }
  console.log();
}

/**
 * Print path as coordinates
 * Wypisz ścieżkę jako współrzędne
 */
function printPath(path) {
  if (!path) {
    console.log('No path found / Nie znaleziono ścieżki');
    return;
  }

  console.log('Path / Ścieżka:');
  const pathStr = path.map(p => p.toString()).join(' → ');
  console.log(pathStr);
  console.log(`Length: ${path.length} steps / kroków`);
}

/**
 * Compare two paths
 * Porównaj dwie ścieżki
 */
function pathsEqual(path1, path2) {
  if (!path1 && !path2) return true;
  if (!path1 || !path2) return false;
  if (path1.length !== path2.length) return false;

  for (let i = 0; i < path1.length; i++) {
    if (!path1[i].equals(path2[i])) return false;
  }

  return true;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('ROBOT IN A GRID - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Simple 3x3 grid with no obstacles / Prosta siatka 3x3 bez przeszkód
console.log('TEST 1: Simple 3x3 grid - no obstacles');
console.log('       Prosta siatka 3x3 - bez przeszkód');
console.log('-'.repeat(70));
const grid1 = createGrid(`
...
...
...
`);
console.log('Grid:');
printGrid(grid1);

const path1Naive = findPathNaive(grid1);
const path1Memo = findPathMemo(grid1);
const path1DP = findPathDP(grid1);

console.log('Naive Backtracking:');
printPath(path1Naive);
console.log('\nMemoization:');
printPath(path1Memo);
console.log('\nDynamic Programming:');
printPath(path1DP);

console.log('\nGrid with path visualization:');
printGrid(grid1, path1DP);

const allMatch1 = pathsEqual(path1Naive, path1Memo) && pathsEqual(path1Memo, path1DP);
console.log(`All approaches match: ${allMatch1 ? '✓' : '✗'}`);
console.log();

// Test 2: 4x4 grid with obstacles / Siatka 4x4 z przeszkodami
console.log('TEST 2: 4x4 grid with obstacles');
console.log('       Siatka 4x4 z przeszkodami');
console.log('-'.repeat(70));
const grid2 = createGrid(`
....
.X..
..X.
...X
`);
console.log('Grid:');
printGrid(grid2);

const path2Memo = findPathMemo(grid2);
console.log('Path found:');
printPath(path2Memo);
console.log('\nGrid with path:');
printGrid(grid2, path2Memo);
console.log();

// Test 3: Maze with complex path / Labirynt z złożoną ścieżką
console.log('TEST 3: Complex maze');
console.log('       Złożony labirynt');
console.log('-'.repeat(70));
const grid3 = createGrid(`
.....
.XXX.
.X...
.X.X.
...X.
`);
console.log('Grid:');
printGrid(grid3);

const path3Memo = findPathMemo(grid3);
console.log('Path found:');
printPath(path3Memo);
console.log('\nGrid with path:');
printGrid(grid3, path3Memo);
console.log();

// Test 4: No path possible / Brak możliwej ścieżki
console.log('TEST 4: No path possible - blocked');
console.log('       Brak możliwej ścieżki - zablokowana');
console.log('-'.repeat(70));
const grid4 = createGrid(`
...
.X.
...
`);
// Block the path / Zablokuj ścieżkę
grid4[1][1] = true;
grid4[0][1] = true;
grid4[1][0] = true;

console.log('Grid:');
printGrid(grid4);

const path4 = findPathMemo(grid4);
printPath(path4);
console.log();

// Test 5: Single row / Pojedynczy wiersz
console.log('TEST 5: Single row (1x5)');
console.log('       Pojedynczy wiersz (1x5)');
console.log('-'.repeat(70));
const grid5 = createGrid(`
.....
`);
console.log('Grid:');
printGrid(grid5);

const path5 = findPathMemo(grid5);
printPath(path5);
console.log('\nGrid with path:');
printGrid(grid5, path5);
console.log();

// Test 6: Single column / Pojedyncza kolumna
console.log('TEST 6: Single column (5x1)');
console.log('       Pojedyncza kolumna (5x1)');
console.log('-'.repeat(70));
const grid6 = createGrid(`
.
.
.
.
.
`);
console.log('Grid:');
printGrid(grid6);

const path6 = findPathMemo(grid6);
printPath(path6);
console.log();

// Test 7: Start or end blocked / Start lub koniec zablokowany
console.log('TEST 7: Start blocked');
console.log('       Start zablokowany');
console.log('-'.repeat(70));
const grid7 = createGrid(`
X..
...
...
`);
console.log('Grid:');
printGrid(grid7);

const path7 = findPathMemo(grid7);
printPath(path7);
console.log();

// Test 8: Large grid / Duża siatka
console.log('TEST 8: Larger grid (6x6) with obstacles');
console.log('       Większa siatka (6x6) z przeszkodami');
console.log('-'.repeat(70));
const grid8 = createGrid(`
......
.XXXX.
.X....
.X.XX.
.X.X..
....X.
`);
console.log('Grid:');
printGrid(grid8);

const path8 = findPathMemo(grid8);
console.log('Path found:');
printPath(path8);
console.log('\nGrid with path:');
printGrid(grid8, path8);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: 1x1 grid / Siatka 1x1
console.log('EDGE CASE 1: 1x1 grid (already at destination)');
console.log('            Siatka 1x1 (już na miejscu docelowym)');
console.log('-'.repeat(70));
const gridEdge1 = [[false]];
const pathEdge1 = findPathMemo(gridEdge1);
printPath(pathEdge1);
console.log();

// Edge Case 2: Empty grid / Pusta siatka
console.log('EDGE CASE 2: Empty grid');
console.log('            Pusta siatka');
console.log('-'.repeat(70));
const pathEdge2 = findPathMemo([]);
printPath(pathEdge2);
console.log();

// Edge Case 3: End blocked / Koniec zablokowany
console.log('EDGE CASE 3: End blocked');
console.log('            Koniec zablokowany');
console.log('-'.repeat(70));
const gridEdge3 = createGrid(`
...
...
..X
`);
const pathEdge3 = findPathMemo(gridEdge3);
printPath(pathEdge3);
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Naive Backtracking / Naiwne Cofanie');
console.log('  Time:  O(2^(r+c)) - Try all paths / Wypróbuj wszystkie ścieżki');
console.log('  Space: O(r+c)     - Recursion stack / Stos rekurencji');
console.log('  Note:  Very slow for large grids / Bardzo wolne dla dużych siatek');
console.log();
console.log('APPROACH 2: Backtracking with Memoization / Cofanie z Memoizacją');
console.log('  Time:  O(r*c)     - Visit each cell at most once / Odwiedź każdą komórkę max raz');
console.log('  Space: O(r*c)     - Memoization cache / Pamięć podręczna');
console.log('  Note:  RECOMMENDED - Good balance / ZALECANE - Dobra równowaga');
console.log();
console.log('APPROACH 3: Dynamic Programming / Programowanie Dynamiczne');
console.log('  Time:  O(r*c)     - Fill entire grid / Wypełnij całą siatkę');
console.log('  Space: O(r*c)     - DP table / Tablica DP');
console.log('  Note:  Builds entire table even if early exit possible');
console.log('         Buduje całą tabelę nawet jeśli wcześniejsze wyjście możliwe');
console.log('='.repeat(70));
