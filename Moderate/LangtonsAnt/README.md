# 16.22 Langton's Ant

## Opis Zadania / Problem Description

**Langton's Ant**: An ant is sitting on an infinite grid of white and black squares. It initially faces right. At each step, it does the following:
1. At a white square, flip the color of the square, turn 90 degrees right (clockwise), and move forward one unit.
2. At a black square, flip the color of the square, turn 90 degrees left (counter-clockwise), and move forward one unit.

Write a program to simulate the first K moves that the ant makes and print the final board as a grid. Note that you are not provided with the data structure to represent the grid. This is something you must design yourself. The only input to your method is K. You should print the final grid and return nothing (or return the grid).

**Mrówka Langtona**: Mrówka siedzi na nieskończonej siatce białych i czarnych kwadratów. Początkowo jest zwrócona w prawo. W każdym kroku wykonuje następujące czynności:
1. Na białym polu: odwróć kolor pola, obróć się o 90 stopni w prawo (zgodnie z ruchem wskazówek zegara) i idź do przodu o jedną jednostkę.
2. Na czarnym polu: odwróć kolor pola, obróć się o 90 stopni w lewo (przeciwnie do ruchu wskazówek zegara) i idź do przodu o jedną jednostkę.

Napisz program symulujący pierwsze K ruchów mrówki i wyświetl finalną planszę jako siatkę. Zauważ, że nie dostarczamy struktury danych do reprezentacji siatki. To musisz zaprojektować sam. Jedynym wejściem do metody jest K. Powinieneś wydrukować finalną siatkę i nic nie zwracać (lub zwrócić siatkę).

EXAMPLE
```
Input: K = 5

Initial state: ant at (0,0) facing RIGHT, all white

Steps:
1. At (0,0) white → turn right, flip to black, move to (0,-1)
2. At (0,-1) white → turn right, flip to black, move to (-1,-1)
3. At (-1,-1) white → turn right, flip to black, move to (-1,0)
4. At (-1,0) white → turn right, flip to black, move to (-1,1)
5. At (-1,1) white → turn right, flip to black, move to (0,1)

Final grid:
  X X
  _ X X
```

Hints: #470, #484, #494, #506, #529

## Wyjaśnienie Problemu / Problem Explanation

Mrówka Langtona to prosty automat komórkowy z zaskakująco złożonym zachowaniem. Mimo prostych reguł, mrówka tworzy chaotyczne wzory.

Langton's Ant is a simple cellular automaton with surprisingly complex behavior. Despite simple rules, the ant creates chaotic patterns.

**Zasady / Rules**:
- Biały kwadrat (0): Obróć w prawo (CW), zmień na czarny, idź
- Czarny kwadrat (1): Obróć w lewo (CCW), zmień na biały, idź

**Kierunki / Directions**:
```
     N (0)
      ↑
W (3) ← → E (1)
      ↓
     S (2)

Obrót w prawo (CW):  N → E → S → W → N
Obrót w lewo (CCW):  N → W → S → E → N
```

**Kluczowe Wyzwania / Key Challenges**:
1. **Nieskończona siatka**: Nie znamy rozmiaru z góry
2. **Sparse representation**: Większość pól jest białych
3. **Tracking bounds**: Musimy znać rozmiar do wyświetlenia
4. **Direction handling**: 4 kierunki, rotacja

## Rozwiązania / Solutions

### Podejście 1: HashMap (Sparse Grid) - O(K) ✓ OPTYMALNE

**Idea**: Użyj HashMap do przechowywania tylko czarnych pól. Domyślnie wszystko jest białe.

**Idea**: Use HashMap to store only black squares. Default is white.

```javascript
class LangtonsAnt {
  constructor() {
    this.position = [0, 0];
    this.direction = 1; // 0=N, 1=E, 2=S, 3=W
    this.grid = new Map(); // key: "x,y", value: 1 (black)
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
  }

  move(K) {
    for (let i = 0; i < K; i++) {
      this.step();
    }
  }

  step() {
    const [x, y] = this.position;
    const key = `${x},${y}`;
    const isBlack = this.grid.has(key);

    // Flip color
    if (isBlack) {
      this.grid.delete(key); // Black → White
      this.turnLeft();
    } else {
      this.grid.set(key, 1); // White → Black
      this.turnRight();
    }

    // Move forward
    this.moveForward();

    // Update bounds
    this.updateBounds();
  }

  turnRight() {
    this.direction = (this.direction + 1) % 4;
  }

  turnLeft() {
    this.direction = (this.direction + 3) % 4;
  }

  moveForward() {
    const [x, y] = this.position;
    const moves = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
    const [dx, dy] = moves[this.direction];
    this.position = [x + dx, y + dy];
  }

  updateBounds() {
    const [x, y] = this.position;
    this.minX = Math.min(this.minX, x);
    this.maxX = Math.max(this.maxX, x);
    this.minY = Math.min(this.minY, y);
    this.maxY = Math.max(this.maxY, y);
  }

  printGrid() {
    for (let y = this.minY; y <= this.maxY; y++) {
      let row = '';
      for (let x = this.minX; x <= this.maxX; x++) {
        const key = `${x},${y}`;
        if (x === this.position[0] && y === this.position[1]) {
          row += 'A'; // Ant position
        } else if (this.grid.has(key)) {
          row += 'X'; // Black
        } else {
          row += '_'; // White
        }
      }
      console.log(row);
    }
  }
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(K) - K kroków
- Pamięciowa / Space: O(K) - maksymalnie K czarnych pól

### Podejście 2: 2D Array (Fixed Size) - O(N²)

**Idea**: Użyj tablicy 2D o stałym rozmiarze. Mniej efektywne, ale prostsze.

**Idea**: Use 2D array of fixed size. Less efficient, but simpler.

```javascript
class LangtonsAntArray {
  constructor(size = 100) {
    this.size = size;
    this.center = Math.floor(size / 2);
    this.grid = Array(size).fill(null).map(() => Array(size).fill(0));
    this.x = this.center;
    this.y = this.center;
    this.direction = 1; // E
  }

  move(K) {
    for (let i = 0; i < K; i++) {
      const currentColor = this.grid[this.y][this.x];

      // Flip color
      this.grid[this.y][this.x] = 1 - currentColor;

      // Turn
      if (currentColor === 0) { // White
        this.direction = (this.direction + 1) % 4; // Right
      } else { // Black
        this.direction = (this.direction + 3) % 4; // Left
      }

      // Move
      const moves = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      const [dx, dy] = moves[this.direction];
      this.x += dx;
      this.y += dy;

      // Bounds check
      if (this.x < 0 || this.x >= this.size ||
          this.y < 0 || this.y >= this.size) {
        throw new Error('Out of bounds');
      }
    }
  }

  printGrid() {
    for (let y = 0; y < this.size; y++) {
      let row = '';
      for (let x = 0; x < this.size; x++) {
        if (x === this.x && y === this.y) {
          row += 'A';
        } else if (this.grid[y][x] === 1) {
          row += 'X';
        } else {
          row += '_';
        }
      }
      console.log(row);
    }
  }
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(K) dla ruchów + O(N²) dla wyświetlenia
- Pamięciowa / Space: O(N²) - cała siatka

### Podejście 3: Compressed Grid - O(K)

**Idea**: HashMap + kompresja bounds do minimalnego prostokąta.

**Idea**: HashMap + compress bounds to minimal rectangle.

```javascript
class LangtonsAntCompressed {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dir = 1;
    this.black = new Set(); // Set of "x,y" strings
  }

  simulate(K) {
    for (let i = 0; i < K; i++) {
      const key = `${this.x},${this.y}`;
      const isBlack = this.black.has(key);

      // Flip and turn
      if (isBlack) {
        this.black.delete(key);
        this.dir = (this.dir + 3) % 4; // Left
      } else {
        this.black.add(key);
        this.dir = (this.dir + 1) % 4; // Right
      }

      // Move
      const moves = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      const [dx, dy] = moves[this.dir];
      this.x += dx;
      this.y += dy;
    }

    return this.getGrid();
  }

  getGrid() {
    if (this.black.size === 0) return [['_']];

    // Znajdź bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const key of this.black) {
      const [x, y] = key.split(',').map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // Include ant position
    minX = Math.min(minX, this.x);
    maxX = Math.max(maxX, this.x);
    minY = Math.min(minY, this.y);
    maxY = Math.max(maxY, this.y);

    // Zbuduj grid
    const grid = [];
    for (let y = minY; y <= maxY; y++) {
      const row = [];
      for (let x = minX; x <= maxX; x++) {
        if (x === this.x && y === this.y) {
          row.push('A');
        } else if (this.black.has(`${x},${y}`)) {
          row.push('X');
        } else {
          row.push('_');
        }
      }
      grid.push(row);
    }

    return grid;
  }
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(K) dla symulacji + O(B) dla wyświetlenia (B = black cells)
- Pamięciowa / Space: O(B) gdzie B ≤ K

## Szczególne Przypadki / Edge Cases

### 1. K = 0 (Brak Ruchów)
```javascript
K = 0
Grid: A (tylko mrówka na białym polu)
```

### 2. K = 1 (Jeden Ruch)
```javascript
K = 1
Start: (0,0) facing E
After: (0,-1) facing S, (0,0) is black
Grid:
  X
  A
```

### 3. Małe K (2-10)
```javascript
K = 5
Prosty wzór, łatwy do zweryfikowania
```

### 4. Duże K (>10000)
```javascript
K = 10000
"Highway" pattern - mrówka zaczyna budować autostradę
```

### 5. Bardzo Duże K
```javascript
K = 1000000
Potrzeba efektywnej struktury danych (HashMap)
```

## Wzory i Własności / Patterns and Properties

### Fazy Zachowania Mrówki / Ant's Behavior Phases

**Faza 1: Chaos (0-500 kroków)**
- Pozornie losowe ruchy
- Brak widocznego wzoru

**Faza 2: Prostokąty (500-10000)**
- Budowanie prostokątnych struktur
- Wciąż chaotyczne

**Faza 3: Highway (~10000+)**
- Mrówka zaczyna budować "autostradę"
- Powtarzający się wzór 104 kroków
- Porusza się po przekątnej w nieskończoność

### Matematyczne Własności / Mathematical Properties

1. **Uniwersalność**: Niezależnie od początkowej konfiguracji, mrówka zawsze znajdzie autostradę
2. **Okres autostrady**: 104 kroki = jeden cykl
3. **Symetria**: Niektóre wzory mają symetrię obrotową
4. **Nieodwracalność**: Nie można łatwo przewidzieć historii z obecnego stanu

## Implementacja Kierunków / Direction Implementation

### Reprezentacja Kierunków / Direction Representation

```javascript
// Opcja 1: Liczby 0-3
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

// Opcja 2: Stringi
const directions = ['N', 'E', 'S', 'W'];

// Opcja 3: Obiekty
const dirs = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 }
};
```

### Rotacja / Rotation

```javascript
// Obrót w prawo (CW): (dir + 1) % 4
// Obrót w lewo (CCW): (dir + 3) % 4 lub (dir - 1 + 4) % 4

function turnRight(dir) {
  return (dir + 1) % 4;
}

function turnLeft(dir) {
  return (dir + 3) % 4;
}
```

### Moves Array

```javascript
const moves = [
  [0, -1],  // North: y decreases
  [1, 0],   // East: x increases
  [0, 1],   // South: y increases
  [-1, 0]   // West: x decreases
];
```

## Porównanie Podejść / Approach Comparison

| Podejście | Pamięć | Czas Setup | Wyświetl | Best For |
|-----------|--------|------------|----------|----------|
| HashMap | O(K) | O(1) | O(B) | Duże K ✓ |
| 2D Array | O(N²) | O(N²) | O(N²) | Małe K |
| Compressed | O(B) | O(1) | O(B) | Memory-optimal |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **HashMap (Podejście 1)**: Najlepsze dla dużych K ✓ POLECANE
- **2D Array (Podejście 2)**: Prostsze, ale ograniczone rozmiarem
- **Compressed (Podejście 3)**: Optymalnie dla pamięci

## Wizualizacja / Visualization

### ASCII Art Representation

```javascript
// Symbole / Symbols:
'_' = White square (biały)
'X' = Black square (czarny)
'A' = Ant position (pozycja mrówki)

// Kierunki mrówki / Ant directions:
'>' = East
'<' = West
'^' = North
'v' = South
```

### Color Representation

```javascript
// Z kolorami terminala
const WHITE = '\x1b[47m  \x1b[0m';
const BLACK = '\x1b[40m  \x1b[0m';
const ANT = '\x1b[41m A \x1b[0m';
```

## Optymalizacje / Optimizations

### 1. Set vs Map for Black Cells
```javascript
// Set jest szybsze gdy tylko sprawdzamy istnienie
const black = new Set();

// Map gdy potrzebujemy dodatkowych danych
const black = new Map();
```

### 2. String Keys vs Object Keys
```javascript
// Szybsze: string keys
const key = `${x},${y}`;

// Wolniejsze: object keys
const key = { x, y };
```

### 3. Bounds Tracking
```javascript
// Track bounds during simulation, nie obliczaj potem
this.minX = Math.min(this.minX, x);
this.maxX = Math.max(this.maxX, x);
```

### 4. Inline Operations
```javascript
// Inline flip + turn
this.black.has(key) ? (this.black.delete(key), this.turnLeft())
                    : (this.black.add(key), this.turnRight());
```

## Zastosowania / Applications

1. **Cellular Automata**: Badanie automatów komórkowych
2. **Emergence**: Studiowanie emergentnych wzorów
3. **Complexity Theory**: Prosty system → złożone zachowanie
4. **Algorithm Design**: Symulacje krok po kroku
5. **Data Structures**: Sparse grid representation

## Rozszerzenia / Extensions

### 1. Multiple Ants
```javascript
// Wiele mrówek na jednej siatce
// Multiple ants on same grid
```

### 2. Different Rules
```javascript
// LLRR, LRRL, etc. (różne reguły)
// Different rule sets
```

### 3. Hexagonal Grid
```javascript
// Siatka sześciokątna zamiast kwadratowej
// Hexagonal grid instead of square
```

### 4. 3D Version
```javascript
// Mrówka w przestrzeni 3D
// Ant in 3D space
```

### 5. Animated Visualization
```javascript
// Animacja krok po kroku
// Step-by-step animation
```

## Wnioski / Conclusions

Langton's Ant to fascynujący problem pokazujący:
1. **Emergent Complexity**: Proste reguły → złożone zachowanie
2. **Data Structure Design**: Wybór struktury wpływa na wydajność
3. **Sparse Representation**: HashMap dla nieskończonej siatki
4. **Simulation**: Implementacja automatów komórkowych

Langton's Ant is a fascinating problem showing:
1. **Emergent Complexity**: Simple rules → complex behavior
2. **Data Structure Design**: Structure choice affects performance
3. **Sparse Representation**: HashMap for infinite grid
4. **Simulation**: Implementing cellular automata

**Kluczowe Decyzje / Key Decisions**:
- Struktura danych: HashMap dla sparse grid ✓
- Reprezentacja kolorów: 0/1 lub presence/absence
- Tracking bounds: Na bieżąco vs. post-processing
- Wizualizacja: ASCII vs. grafika
