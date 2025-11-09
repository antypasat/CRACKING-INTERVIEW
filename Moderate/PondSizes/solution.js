/**
 * Pond Sizes - Compute sizes of all ponds (connected water regions)
 * Rozmiary Stawów - Oblicz rozmiary wszystkich stawów (połączonych regionów wody)
 *
 * Wartość 0 = woda, połączenia w 8 kierunkach (w tym przekątne)
 * Value 0 = water, connections in 8 directions (including diagonals)
 */

/**
 * Podejście 1: DFS (Depth-First Search) - O(m×n) ✓ OPTYMALNE
 * Approach 1: DFS (Depth-First Search) - O(m×n) ✓ OPTIMAL
 *
 * Rekurencyjne przeszukiwanie grafu w głąb
 * Recursive depth-first graph traversal
 */
function pondSizesDFS(land) {
  if (!land || land.length === 0 || land[0].length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const sizes = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0 && !visited[i][j]) {
        const size = dfs(land, visited, i, j);
        sizes.push(size);
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}

function dfs(land, visited, row, col) {
  // Warunki brzegowe
  if (row < 0 || row >= land.length ||
      col < 0 || col >= land[0].length ||
      visited[row][col] || land[row][col] !== 0) {
    return 0;
  }

  visited[row][col] = true;
  let size = 1;

  // 8 kierunków: N, S, E, W, NE, NW, SE, SW
  const directions = [
    [-1, 0],  // North
    [ 1, 0],  // South
    [ 0,-1],  // West
    [ 0, 1],  // East
    [-1,-1],  // Northwest
    [-1, 1],  // Northeast
    [ 1,-1],  // Southwest
    [ 1, 1]   // Southeast
  ];

  for (const [dr, dc] of directions) {
    size += dfs(land, visited, row + dr, col + dc);
  }

  return size;
}

/**
 * Podejście 2: BFS (Breadth-First Search) - O(m×n)
 * Approach 2: BFS (Breadth-First Search) - O(m×n)
 *
 * Iteracyjne przeszukiwanie grafu wszerz
 * Iterative breadth-first graph traversal
 */
function pondSizesBFS(land) {
  if (!land || land.length === 0 || land[0].length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const sizes = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0 && !visited[i][j]) {
        const size = bfs(land, visited, i, j);
        sizes.push(size);
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}

function bfs(land, visited, startRow, startCol) {
  const queue = [[startRow, startCol]];
  visited[startRow][startCol] = true;
  let size = 0;

  const directions = [
    [-1, 0], [ 1, 0], [ 0,-1], [ 0, 1],
    [-1,-1], [-1, 1], [ 1,-1], [ 1, 1]
  ];

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    size++;

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < land.length &&
          newCol >= 0 && newCol < land[0].length &&
          !visited[newRow][newCol] && land[newRow][newCol] === 0) {
        visited[newRow][newCol] = true;
        queue.push([newRow, newCol]);
      }
    }
  }

  return size;
}

/**
 * Podejście 3: In-Place DFS - O(m×n)
 * Approach 3: In-Place DFS - O(m×n)
 *
 * Modyfikuje oryginalną macierz (oszczędność pamięci)
 * Modifies original matrix (saves memory)
 */
function pondSizesInPlace(land) {
  if (!land || land.length === 0 || land[0].length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  // Kopiuj macierz, aby nie modyfikować oryginału
  const landCopy = land.map(row => [...row]);
  const sizes = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (landCopy[i][j] === 0) {
        const size = dfsInPlace(landCopy, i, j);
        sizes.push(size);
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}

function dfsInPlace(land, row, col) {
  if (row < 0 || row >= land.length ||
      col < 0 || col >= land[0].length ||
      land[row][col] !== 0) {
    return 0;
  }

  // Oznacz jako odwiedzone (zmień na -1)
  land[row][col] = -1;
  let size = 1;

  const directions = [
    [-1, 0], [ 1, 0], [ 0,-1], [ 0, 1],
    [-1,-1], [-1, 1], [ 1,-1], [ 1, 1]
  ];

  for (const [dr, dc] of directions) {
    size += dfsInPlace(land, row + dr, col + dc);
  }

  return size;
}

/**
 * Podejście 4: Iteracyjny DFS (bez rekurencji) - O(m×n)
 * Approach 4: Iterative DFS (no recursion) - O(m×n)
 *
 * Używa stosu zamiast rekurencji
 * Uses stack instead of recursion
 */
function pondSizesIterative(land) {
  if (!land || land.length === 0 || land[0].length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const sizes = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0 && !visited[i][j]) {
        const size = dfsIterative(land, visited, i, j);
        sizes.push(size);
      }
    }
  }

  return sizes.sort((a, b) => a - b);
}

function dfsIterative(land, visited, startRow, startCol) {
  const stack = [[startRow, startCol]];
  let size = 0;

  const directions = [
    [-1, 0], [ 1, 0], [ 0,-1], [ 0, 1],
    [-1,-1], [-1, 1], [ 1,-1], [ 1, 1]
  ];

  while (stack.length > 0) {
    const [row, col] = stack.pop();

    if (row < 0 || row >= land.length ||
        col < 0 || col >= land[0].length ||
        visited[row][col] || land[row][col] !== 0) {
      continue;
    }

    visited[row][col] = true;
    size++;

    for (const [dr, dc] of directions) {
      stack.push([row + dr, col + dc]);
    }
  }

  return size;
}

/**
 * Główna funkcja - używamy DFS jako rozwiązanie domyślne
 * Main function - use DFS as default solution
 */
function pondSizes(land) {
  return pondSizesDFS(land);
}

/**
 * Funkcje pomocnicze / Helper functions
 */

/**
 * Wyświetl macierz z oznaczeniem stawów
 * Display matrix with pond labels
 */
function visualizePonds(land) {
  if (!land || land.length === 0) return;

  const rows = land.length;
  const cols = land[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const labels = Array(rows).fill(null).map(() => Array(cols).fill('.'));
  let pondId = 65; // Start from 'A'

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0 && !visited[i][j]) {
        markPond(land, visited, labels, i, j, String.fromCharCode(pondId));
        pondId++;
      }
    }
  }

  console.log('\nOriginal:');
  land.forEach(row => console.log(row.join(' ')));

  console.log('\nPonds labeled:');
  labels.forEach(row => console.log(row.join(' ')));
}

function markPond(land, visited, labels, row, col, label) {
  if (row < 0 || row >= land.length ||
      col < 0 || col >= land[0].length ||
      visited[row][col] || land[row][col] !== 0) {
    return;
  }

  visited[row][col] = true;
  labels[row][col] = label;

  const directions = [
    [-1, 0], [ 1, 0], [ 0,-1], [ 0, 1],
    [-1,-1], [-1, 1], [ 1,-1], [ 1, 1]
  ];

  for (const [dr, dc] of directions) {
    markPond(land, visited, labels, row + dr, col + dc, label);
  }
}

/**
 * Policz całkowitą liczbę komórek z wodą
 * Count total number of water cells
 */
function countWaterCells(land) {
  let count = 0;
  for (let i = 0; i < land.length; i++) {
    for (let j = 0; j < land[0].length; j++) {
      if (land[i][j] === 0) count++;
    }
  }
  return count;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Pond Sizes ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania (from problem description)');
const land1 = [
  [0, 2, 1, 0],
  [0, 1, 0, 1],
  [1, 1, 0, 1],
  [0, 1, 0, 1]
];
const result1 = pondSizes(land1);
console.log('Input:');
land1.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result1.join(', ')}]`);
console.log(`Expected: [1, 2, 4] (in any order)`);
visualizePonds(land1);
console.log(`Test ${JSON.stringify(result1) === JSON.stringify([1, 2, 4]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Cała macierz to woda
console.log('Test 2: Cała macierz to woda (all water)');
const land2 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
const result2 = pondSizes(land2);
console.log('Input: 3x3 all zeros');
console.log(`Output: [${result2.join(', ')}]`);
console.log(`Expected: [9]`);
console.log(`Test ${JSON.stringify(result2) === JSON.stringify([9]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Brak wody
console.log('Test 3: Brak wody (no water)');
const land3 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const result3 = pondSizes(land3);
console.log('Input: 3x3 all non-zero');
console.log(`Output: [${result3.join(', ')}]`);
console.log(`Expected: []`);
console.log(`Test ${result3.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 4: Pojedyncza komórka
console.log('Test 4: Pojedyncza komórka (single cell)');
const land4a = [[0]];
const result4a = pondSizes(land4a);
console.log('Input: [[0]]');
console.log(`Output: [${result4a.join(', ')}]`);
console.log(`Test ${JSON.stringify(result4a) === JSON.stringify([1]) ? 'PASS ✓' : 'FAIL ✗'}`);

const land4b = [[5]];
const result4b = pondSizes(land4b);
console.log('Input: [[5]]');
console.log(`Output: [${result4b.join(', ')}]`);
console.log(`Test ${result4b.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Izolowane stawy
console.log('Test 5: Izolowane stawy (isolated ponds)');
const land5 = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0]
];
const result5 = pondSizes(land5);
console.log('Input:');
land5.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result5.join(', ')}]`);
console.log(`Expected: [1, 1, 1, 1] (4 isolated ponds)`);
console.log(`Test ${JSON.stringify(result5) === JSON.stringify([1, 1, 1, 1]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Połączenie diagonalne
console.log('Test 6: Połączenie diagonalne (diagonal connection)');
const land6 = [
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0]
];
const result6 = pondSizes(land6);
console.log('Input:');
land6.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result6.join(', ')}]`);
console.log(`Expected: [3] (connected diagonally)`);
visualizePonds(land6);
console.log(`Test ${JSON.stringify(result6) === JSON.stringify([3]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 7: Długi wąski staw (horizontal)
console.log('Test 7: Długi wąski staw poziomy (long horizontal pond)');
const land7 = [[0, 0, 0, 0, 0]];
const result7 = pondSizes(land7);
console.log('Input: [[0, 0, 0, 0, 0]]');
console.log(`Output: [${result7.join(', ')}]`);
console.log(`Test ${JSON.stringify(result7) === JSON.stringify([5]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: Długi wąski staw (vertical)
console.log('Test 8: Długi wąski staw pionowy (long vertical pond)');
const land8 = [[0], [0], [0], [0]];
const result8 = pondSizes(land8);
console.log('Input: [[0], [0], [0], [0]]');
console.log(`Output: [${result8.join(', ')}]`);
console.log(`Test ${JSON.stringify(result8) === JSON.stringify([4]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 9: Szachownica
console.log('Test 9: Szachownica (checkerboard)');
const land9 = [
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0]
];
const result9 = pondSizes(land9);
console.log('Input:');
land9.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result9.join(', ')}]`);
console.log(`Expected: [1, 1, 1, 1, 1, 1, 1, 1] (8 isolated cells)`);
console.log(`Test ${result9.length === 8 && result9.every(s => s === 1) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 10: L-kształt
console.log('Test 10: L-kształt (L-shape)');
const land10 = [
  [0, 0, 1],
  [0, 1, 1],
  [0, 1, 1]
];
const result10 = pondSizes(land10);
console.log('Input:');
land10.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result10.join(', ')}]`);
console.log(`Expected: [4] (connected L-shape)`);
visualizePonds(land10);
console.log(`Test ${JSON.stringify(result10) === JSON.stringify([4]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 11: Pusta macierz
console.log('Test 11: Pusta macierz (empty matrix)');
const land11 = [];
const result11 = pondSizes(land11);
console.log('Input: []');
console.log(`Output: [${result11.join(', ')}]`);
console.log(`Test ${result11.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Macierz z pustymi wierszami
console.log('Test 12: Macierz z pustymi wierszami (empty rows)');
const land12 = [[]];
const result12 = pondSizes(land12);
console.log('Input: [[]]');
console.log(`Output: [${result12.join(', ')}]`);
console.log(`Test ${result12.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 13: Większa macierz z wieloma stawami
console.log('Test 13: Większa macierz (larger matrix)');
const land13 = [
  [0, 2, 1, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1],
  [0, 0, 1, 1, 1]
];
const result13 = pondSizes(land13);
console.log('Input:');
land13.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result13.join(', ')}]`);
visualizePonds(land13);
console.log();

// Test 14: Porównanie wszystkich metod
console.log('Test 14: Porównanie wszystkich metod (compare all methods)');
const testMatrix = [
  [0, 2, 1, 0],
  [0, 1, 0, 1],
  [1, 1, 0, 1],
  [0, 1, 0, 1]
];

const resultDFS = pondSizesDFS(testMatrix);
const resultBFS = pondSizesBFS(testMatrix);
const resultInPlace = pondSizesInPlace(testMatrix);
const resultIterative = pondSizesIterative(testMatrix);

console.log(`DFS:       [${resultDFS.join(', ')}]`);
console.log(`BFS:       [${resultBFS.join(', ')}]`);
console.log(`In-Place:  [${resultInPlace.join(', ')}]`);
console.log(`Iterative: [${resultIterative.join(', ')}]`);

const allSame = JSON.stringify(resultDFS) === JSON.stringify(resultBFS) &&
                JSON.stringify(resultDFS) === JSON.stringify(resultInPlace) &&
                JSON.stringify(resultDFS) === JSON.stringify(resultIterative);

console.log(`Wszystkie zgodne: ${allSame ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 15: Performance test
console.log('Test 15: Test wydajności (performance test)');

// Duża macierz: 100x100 z losowymi wartościami
const size = 100;
const largeLand = Array(size).fill(null).map(() =>
  Array(size).fill(null).map(() => Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 5) + 1)
);

const waterCount = countWaterCells(largeLand);

console.log(`Matrix size: ${size}x${size} = ${size * size} cells`);
console.log(`Water cells: ${waterCount}`);

let start = Date.now();
const resultPerfDFS = pondSizesDFS(largeLand);
const timeDFS = Date.now() - start;

start = Date.now();
const resultPerfBFS = pondSizesBFS(largeLand);
const timeBFS = Date.now() - start;

start = Date.now();
const resultPerfIterative = pondSizesIterative(largeLand);
const timeIterative = Date.now() - start;

console.log(`DFS time:       ${timeDFS}ms → ${resultPerfDFS.length} ponds`);
console.log(`BFS time:       ${timeBFS}ms → ${resultPerfBFS.length} ponds`);
console.log(`Iterative time: ${timeIterative}ms → ${resultPerfIterative.length} ponds`);
console.log(`Largest pond: ${Math.max(...resultPerfDFS)} cells\n`);

// Test 16: Staw w kształcie spirali
console.log('Test 16: Staw w kształcie spirali (spiral pond)');
const land16 = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0]
];
const result16 = pondSizes(land16);
console.log('Input:');
land16.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result16.join(', ')}]`);
visualizePonds(land16);
console.log();

// Test 17: Tylko narożniki
console.log('Test 17: Tylko narożniki (corners only)');
const land17 = [
  [0, 1, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [0, 1, 1, 0]
];
const result17 = pondSizes(land17);
console.log('Input:');
land17.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result17.join(', ')}]`);
console.log(`Expected: [1, 1, 1, 1] (4 corner cells, not connected)`);
console.log(`Test ${JSON.stringify(result17) === JSON.stringify([1, 1, 1, 1]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 18: Kompletna ramka
console.log('Test 18: Kompletna ramka (complete frame)');
const land18 = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 2, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0]
];
const result18 = pondSizes(land18);
console.log('Input:');
land18.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result18.join(', ')}]`);
console.log(`Expected: [16] (one connected frame)`);
visualizePonds(land18);
console.log(`Test ${JSON.stringify(result18) === JSON.stringify([16]) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 19: Dwa równe stawy
console.log('Test 19: Dwa równe stawy (two equal ponds)');
const land19 = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0]
];
const result19 = pondSizes(land19);
console.log('Input:');
land19.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result19.join(', ')}]`);
visualizePonds(land19);
console.log();

// Test 20: Macierz z wieloma małymi stawami
console.log('Test 20: Wiele małych stawów (many small ponds)');
const land20 = [
  [0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0]
];
const result20 = pondSizes(land20);
console.log('Input:');
land20.forEach(row => console.log(row.join(' ')));
console.log(`Output: [${result20.join(', ')}]`);
console.log(`Count: ${result20.length} ponds`);
visualizePonds(land20);
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Pond Sizes - Znajdowanie połączonych regionów wody');
console.log('\nMetody:');
console.log('  DFS (rekurencyjny):   O(m×n) - prosty, elegancki ✓');
console.log('  BFS (iteracyjny):     O(m×n) - unika stack overflow');
console.log('  In-Place:             O(m×n) - oszczędność pamięci');
console.log('  Iterative DFS:        O(m×n) - kontrola stosu');
console.log('\nKluczowa idea:');
console.log('  - Graf w macierzy 2D');
console.log('  - 8-kierunkowa łączność (including diagonals)');
console.log('  - Connected components problem');
console.log('  - Visited array lub in-place marking');
console.log('\nZłożoność:');
console.log('  Czasowa:    O(m×n) - każda komórka odwiedzana raz');
console.log('  Pamięciowa: O(m×n) - visited array');
console.log('              O(1)   - in-place (+ recursion stack)');
console.log('\nZastosowania:');
console.log('  - Geologia (water bodies)');
console.log('  - Image segmentation');
console.log('  - Game map generation');
console.log('  - Network cluster analysis');
console.log('  - Ecological habitat analysis');
