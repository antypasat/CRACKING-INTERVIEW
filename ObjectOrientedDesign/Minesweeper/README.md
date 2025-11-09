# 7.10 Minesweeper / Saper

## Problem
Design and implement a text-based Minesweeper game. Minesweeper is a single-player puzzle game where the player tries to clear a board containing hidden mines without detonating any of them. The board is divided into cells, with mines randomly distributed. When a cell is revealed, it displays either a mine (game over) or a number indicating how many adjacent cells contain mines. If a cell with no adjacent mines is revealed, all adjacent cells are automatically revealed.

Zaprojektuj i zaimplementuj tekstową wersję gry Saper. Saper to gra logiczna dla jednego gracza, w której gracz próbuje oczyścić planszę zawierającą ukryte miny bez zdetonowania żadnej z nich. Plansza jest podzielona na komórki z losowo rozmieszczonymi minami. Gdy komórka zostanie odkryta, pokazuje minę (koniec gry) lub liczbę wskazującą ile sąsiednich komórek zawiera miny. Jeśli odkryta zostanie komórka bez sąsiednich min, wszystkie sąsiednie komórki są automatycznie odkrywane.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
CellState (enum)
├── HIDDEN
├── REVEALED
└── FLAGGED

Cell
├── row: int
├── col: int
├── isBomb: boolean
├── state: CellState
├── adjacentBombs: int
├── reveal()
├── flag()
├── unflag()
├── isRevealed() → boolean
└── toString()

Board
├── grid: Cell[][]
├── rows: int
├── cols: int
├── numBombs: int
├── revealedCount: int
├── initialize()
├── placeBombs()
├── calculateAdjacentBombs()
├── getCell(row, col) → Cell
├── getNeighbors(row, col) → Cell[]
├── revealCell(row, col) → boolean
├── flagCell(row, col)
├── unflagCell(row, col)
├── isWon() → boolean
├── countRevealed() → int
└── toString(showAll)

Game
├── board: Board
├── gameOver: boolean
├── won: boolean
├── startTime: Date
├── initialize(rows, cols, numBombs)
├── play(row, col) → GameResult
├── flag(row, col)
├── isGameOver() → boolean
├── isWon() → boolean
├── getElapsedTime() → int
└── toString()
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Cell States
- **HIDDEN:** Initial state, not yet revealed
- **REVEALED:** Cell has been opened
- **FLAGGED:** Player marked as potential bomb
- Encapsulates cell behavior and state

### 2. Flood Fill Algorithm
When revealing a cell with 0 adjacent bombs:
```javascript
function revealCell(row, col) {
  if (cell is revealed or flagged) return;

  reveal(cell);

  if (cell.adjacentBombs === 0) {
    // Recursively reveal all neighbors
    for (neighbor of getNeighbors(row, col)) {
      revealCell(neighbor.row, neighbor.col);
    }
  }
}
```

### 3. Neighbor Calculation
8-directional neighbor search:
```javascript
directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
]
```

### 4. Win Condition
Player wins when:
- All non-bomb cells are revealed
- OR: `revealedCount === (totalCells - numBombs)`
- Bomb cells don't need to be flagged to win

## Minesweeper Rules Implemented / Zaimplementowane Zasady

1. **Board Setup:**
   - N×N grid (configurable size)
   - Random bomb placement
   - Each cell knows adjacent bomb count

2. **Gameplay:**
   - Reveal cells to check for bombs
   - Flag suspected bombs (optional)
   - Auto-reveal when clicking on 0-bomb cell

3. **Game Over:**
   - Revealing a bomb → LOSE
   - Revealing all non-bomb cells → WIN

4. **Display:**
   - Hidden cells: `#`
   - Flagged cells: `F`
   - Revealed empty: `.` or number (1-8)
   - Revealed bomb: `*`

## Example Usage / Przykład Użycia

```javascript
const game = new Game();
game.initialize(8, 8, 10); // 8x8 board with 10 bombs

// Reveal a cell
const result = game.play(0, 0);
if (result === 'BOMB') {
  console.log('Game Over!');
}

// Flag a suspected bomb
game.flag(2, 3);

// Check win condition
if (game.isWon()) {
  console.log('You won!');
}

// Display board
console.log(game.toString());
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:** Cell manages its own state (hidden/revealed/flagged)
2. **Single Responsibility:**
   - Cell: represents one board position
   - Board: manages grid and game rules
   - Game: orchestrates gameplay and tracks game state
3. **Information Hiding:** Bomb locations hidden until revealed
4. **Separation of Concerns:** Display logic separate from game logic

## Design Patterns / Wzorce Projektowe

1. **Flood Fill Pattern:**
   - Recursive revealing of connected empty cells
   - DFS-based exploration

2. **State Pattern:**
   - Cells have distinct states (hidden/revealed/flagged)
   - State determines valid operations

## Extensions / Rozszerzenia

Easy to extend for:
- Difficulty levels (beginner/intermediate/expert)
- Custom board sizes and bomb counts
- First-click guarantee (never bomb on first move)
- Chord clicking (reveal all neighbors if flags match)
- Undo/Redo functionality
- Timer and scoring
- Leaderboards
- Hints system
- Save/Load game state

## Complexity / Złożoność

- **initialize:** O(n²) to create grid + O(b) to place bombs
- **revealCell:** O(n²) worst case (flood fill entire board)
- **flagCell:** O(1)
- **isWon:** O(1) - just check revealed count
- **calculateAdjacentBombs:** O(n²) - check each cell's 8 neighbors
- **Space:** O(n²) for the grid

Where:
- n = board dimension (rows or cols)
- b = number of bombs

## Algorithm Details / Szczegóły Algorytmu

### Bomb Placement
```javascript
1. Generate list of all positions
2. Shuffle randomly (Fisher-Yates)
3. Take first numBombs positions
4. Mark those cells as bombs
```

### Adjacent Bombs Calculation
```javascript
For each cell:
  If cell is bomb: skip
  Count = 0
  For each of 8 neighbors:
    If neighbor is bomb: count++
  cell.adjacentBombs = count
```

### Flood Fill Reveal
```javascript
function reveal(row, col):
  If out of bounds: return
  If already revealed or flagged: return
  If is bomb: return (handled separately)

  Mark as revealed
  revealedCount++

  If adjacentBombs == 0:
    For each neighbor:
      reveal(neighbor)  // Recursive
```
