# 16.19 Pond Sizes

## Opis Zadania / Problem Description

**Pond Sizes**: You have an integer matrix representing a plot of land, where the value at that location represents the height above sea level. A value of zero indicates water. A pond is a region of water connected vertically, horizontally, or diagonally. The size of the pond is the total number of connected water cells. Write a method to compute the sizes of all ponds in the matrix.

**Rozmiary Stawów**: Masz macierz liczb całkowitych reprezentującą działkę ziemi, gdzie wartość w danej lokalizacji reprezentuje wysokość nad poziomem morza. Wartość zero oznacza wodę. Staw to region wody połączony pionowo, poziomo lub po przekątnej. Rozmiar stawu to całkowita liczba połączonych komórek z wodą. Napisz metodę obliczającą rozmiary wszystkich stawów w macierzy.

EXAMPLE
```
Input:
0 2 1 0
0 1 0 1
1 1 0 1
0 1 0 1

Output: [2, 4, 1] (in any order)

Explanation:
0 . . 0    A . . B
0 . 0 .    A . C .
. . 0 .    . . C .
0 . 0 .    D . C .

Pond A = 2 cells
Pond B = 1 cell
Pond C = 4 cells
Pond D = 1 cell
```

Hints: #674, #687, #706, #723

## Wyjaśnienie Problemu / Problem Explanation

Problem jest podobny do znajdowania "wysp" w grafie. Każda komórka z wartością 0 to woda, a grupy sąsiadujących komórek z wodą tworzą stawy.

The problem is similar to finding "islands" in a graph. Each cell with value 0 is water, and groups of adjacent water cells form ponds.

**Przykłady / Examples**:
```
1. Matrix 2x2:
   0 1
   1 0
   Output: [1, 1] (dwa niezależne stawy)

2. Matrix 3x3:
   0 0 0
   0 1 0
   0 0 0
   Output: [8] (jeden duży staw, 8 komórek połączonych przez przekątne)

3. Matrix 3x3:
   1 1 1
   1 1 1
   1 1 1
   Output: [] (brak stawów)

4. Matrix 4x4:
   0 2 1 0
   0 1 0 1
   1 1 0 1
   0 1 0 1
   Output: [2, 4, 1]
```

**Kluczowe Obserwacje / Key Observations**:
1. To problem przeszukiwania grafu (graph traversal)
2. Każda komórka z 0 może być częścią stawu
3. Połączenia są w 8 kierunkach (N, S, E, W, NE, NW, SE, SW)
4. Używamy DFS lub BFS do znalezienia wszystkich połączonych komórek
5. Oznaczamy odwiedzone komórki, aby uniknąć ponownego liczenia

## Rozwiązania / Solutions

### Podejście 1: DFS (Depth-First Search) - O(m×n) ✓ OPTYMALNE

**Idea**: Przejdź przez macierz. Dla każdej nieodwiedzonej komórki z wodą, uruchom DFS aby znaleźć wszystkie połączone komórki.

**Idea**: Iterate through matrix. For each unvisited water cell, run DFS to find all connected cells.

```javascript
function pondSizes(land) {
  if (!land || land.length === 0) return [];

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
  if (row < 0 || row >= land.length ||
      col < 0 || col >= land[0].length ||
      visited[row][col] || land[row][col] !== 0) {
    return 0;
  }

  visited[row][col] = true;
  let size = 1;

  // 8 kierunków
  const dirs = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1]];

  for (const [dr, dc] of dirs) {
    size += dfs(land, visited, row + dr, col + dc);
  }

  return size;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m×n) - każda komórka odwiedzona raz
- Pamięciowa / Space: O(m×n) - tablica visited + stos rekurencji

### Podejście 2: BFS (Breadth-First Search) - O(m×n)

**Idea**: Zamiast DFS, użyj BFS z kolejką do przeszukiwania poziomego.

**Idea**: Instead of DFS, use BFS with queue for level-order traversal.

```javascript
function pondSizesBFS(land) {
  if (!land || land.length === 0) return [];

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

  const dirs = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1]];

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    size++;

    for (const [dr, dc] of dirs) {
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
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m×n) - każda komórka odwiedzona raz
- Pamięciowa / Space: O(min(m,n)) - kolejka BFS

### Podejście 3: In-Place Modification - O(m×n)

**Idea**: Modyfikuj oryginalną macierz zamiast używać visited array (oszczędność pamięci).

**Idea**: Modify original matrix instead of using visited array (save memory).

```javascript
function pondSizesInPlace(land) {
  if (!land || land.length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  const sizes = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0) {
        const size = dfsInPlace(land, i, j);
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

  // Oznacz jako odwiedzone (zmień na -1 lub inną wartość)
  land[row][col] = -1;
  let size = 1;

  const dirs = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1]];

  for (const [dr, dc] of dirs) {
    size += dfsInPlace(land, row + dr, col + dc);
  }

  return size;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m×n)
- Pamięciowa / Space: O(1) + stos rekurencji

### Podejście 4: Union-Find (Disjoint Set) - O(m×n×α(m×n))

**Idea**: Użyj struktury Union-Find do grupowania połączonych komórek.

**Idea**: Use Union-Find data structure to group connected cells.

```javascript
class UnionFind {
  constructor(size) {
    this.parent = Array(size).fill(0).map((_, i) => i);
    this.rank = Array(size).fill(0);
    this.size = Array(size).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }
  }

  getSize(x) {
    return this.size[this.find(x)];
  }
}

function pondSizesUnionFind(land) {
  if (!land || land.length === 0) return [];

  const rows = land.length;
  const cols = land[0].length;
  const uf = new UnionFind(rows * cols);

  const getIndex = (r, c) => r * cols + c;

  // Połącz wszystkie sąsiadujące komórki z wodą
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0) {
        const dirs = [[0,1], [1,0], [1,1], [1,-1]]; // Tylko 4 kierunki (reszta pokryje się)

        for (const [dr, dc] of dirs) {
          const ni = i + dr;
          const nj = j + dc;

          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && land[ni][nj] === 0) {
            uf.union(getIndex(i, j), getIndex(ni, nj));
          }
        }
      }
    }
  }

  // Zbierz rozmiary stawów
  const pondSizes = new Map();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (land[i][j] === 0) {
        const root = uf.find(getIndex(i, j));
        pondSizes.set(root, uf.getSize(getIndex(i, j)));
      }
    }
  }

  return Array.from(pondSizes.values()).sort((a, b) => a - b);
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m×n×α(m×n)) gdzie α to inverse Ackermann (prawie O(m×n))
- Pamięciowa / Space: O(m×n)

## Szczególne Przypadki / Edge Cases

### 1. Pusta Macierz
```javascript
land = []
Output: []

land = [[]]
Output: []
```

### 2. Brak Wody
```javascript
land = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
Output: []
```

### 3. Cała Macierz to Woda
```javascript
land = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]
Output: [9] (jeden duży staw)
```

### 4. Pojedyncza Komórka
```javascript
land = [[0]]
Output: [1]

land = [[5]]
Output: []
```

### 5. Izolowane Stawy
```javascript
land = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0]
]
Output: [1, 1, 1, 1] (cztery niezależne stawy po 1 komórce)
```

### 6. Połączenie Diagonalne
```javascript
land = [
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0]
]
Output: [3] (połączone diagonalnie)
```

### 7. Długi Wąski Staw
```javascript
land = [[0, 0, 0, 0, 0]]
Output: [5]

land = [
  [0],
  [0],
  [0],
  [0]
]
Output: [4]
```

## Analiza Kierunków / Direction Analysis

### 8 Kierunków Połączeń / 8-Directional Connectivity

```
Komórka (i, j) może być połączona z:

[-1,-1] [-1,0] [-1,1]    NW   N   NE
[ 0,-1] [ i,j] [ 0,1]     W  curr  E
[ 1,-1] [ 1,0] [ 1,1]    SW   S   SE
```

**Reprezentacja w kodzie / Code Representation**:
```javascript
// Metoda 1: Array of arrays
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

// Metoda 2: Loop
for (let di = -1; di <= 1; di++) {
  for (let dj = -1; dj <= 1; dj++) {
    if (di === 0 && dj === 0) continue;
    // Process (i + di, j + dj)
  }
}
```

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Stack Depth | Modyfikuje Input |
|-----------|------|--------|-------------|------------------|
| DFS | O(m×n) | O(m×n) | O(m×n) | Nie |
| BFS | O(m×n) | O(min(m,n)) | - | Nie |
| In-Place | O(m×n) | O(1)* | O(m×n) | Tak |
| Union-Find | O(m×n×α) | O(m×n) | - | Nie |

*Plus stos rekurencji

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **DFS (Podejście 1)**: Najprostsze, łatwe do zrozumienia ✓
- **BFS (Podejście 2)**: Lepsze dla bardzo głębokich stawów (unikaj stack overflow)
- **In-Place (Podejście 3)**: Gdy nie możemy modyfikować pamięci dodatkowo
- **Union-Find (Podejście 4)**: Gdy potrzebujemy dynamicznych zapytań o połączenia

## Optymalizacje / Optimizations

### 1. Early Termination
```javascript
// Jeśli znaleźliśmy już wszystkie możliwe stawy
if (foundCells === totalWaterCells) {
  break;
}
```

### 2. Iteracyjny DFS (bez rekurencji)
```javascript
function dfsIterative(land, visited, startRow, startCol) {
  const stack = [[startRow, startCol]];
  let size = 0;

  while (stack.length > 0) {
    const [row, col] = stack.pop();

    if (row < 0 || row >= land.length ||
        col < 0 || col >= land[0].length ||
        visited[row][col] || land[row][col] !== 0) {
      continue;
    }

    visited[row][col] = true;
    size++;

    const dirs = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1]];
    for (const [dr, dc] of dirs) {
      stack.push([row + dr, col + dc]);
    }
  }

  return size;
}
```

### 3. Zliczanie Wody Najpierw
```javascript
// Najpierw policz całkowitą liczbę komórek z wodą
let totalWater = 0;
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (land[i][j] === 0) totalWater++;
  }
}

// Jeśli brak wody, zwróć od razu
if (totalWater === 0) return [];
```

## Zastosowania / Applications

1. **Geologia**: Analiza terenu, znajdowanie zbiorników wodnych
2. **Image Processing**: Segmentacja obrazu, znajdowanie regionów
3. **Game Development**: Generowanie map, znajdowanie obszarów
4. **Network Analysis**: Znajdowanie klastrów połączonych węzłów
5. **Ekologia**: Analiza siedlisk, fragmentacja środowiska

## Rozszerzenia / Extensions

### 1. Różne Poziomy Wody
```javascript
// Stawy o różnych głębokościach (0, -1, -2, itp.)
// Water at different depths (0, -1, -2, etc.)
```

### 2. Tylko 4-kierunkowe Połączenia
```javascript
// Tylko N, S, E, W (bez przekątnych)
// Only N, S, E, W (no diagonals)
const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
```

### 3. Największy Staw
```javascript
// Zwróć tylko rozmiar największego stawu
// Return only size of largest pond
return Math.max(...sizes);
```

### 4. Współrzędne Stawów
```javascript
// Zwróć pozycje komórek dla każdego stawu
// Return cell positions for each pond
return pondCoordinates;
```

## Wnioski / Conclusions

Pond Sizes to klasyczny problem pokazujący:
1. **Graph Traversal**: DFS i BFS w macierzy 2D
2. **Connected Components**: Znajdowanie grup połączonych elementów
3. **8-directional connectivity**: Połączenia w 8 kierunkach
4. **Space-time tradeoffs**: In-place vs. visited array
5. **Multiple solutions**: DFS, BFS, Union-Find

Pond Sizes is a classic problem showing:
1. **Graph Traversal**: DFS and BFS in 2D matrix
2. **Connected Components**: Finding groups of connected elements
3. **8-directional connectivity**: Connections in 8 directions
4. **Space-time tradeoffs**: In-place vs. visited array
5. **Multiple solutions**: DFS, BFS, Union-Find
