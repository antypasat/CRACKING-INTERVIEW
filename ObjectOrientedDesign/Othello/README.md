# 7.8 Othello / Reversi

## Problem
Design and implement Othello (Reversi). Othello is played as follows: Each Othello piece is white on one side and black on the other. When a piece is surrounded by its opponents on both the left and right sides, or both the top and bottom, it is flipped over to the other color. The object of the game is to own more pieces than your opponent when the game is over. The person with more pieces wins.

Zaprojektuj i zaimplementuj Othello (Reversi). W Othello każdy pionek jest biały z jednej strony i czarny z drugiej. Gdy pionek jest otoczony przez przeciwnika z lewej i prawej strony, lub z góry i dołu, jest odwracany na drugi kolor. Celem gry jest posiadanie większej liczby pionków niż przeciwnik po zakończeniu gry. Wygrywa osoba z większą liczbą pionków.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Piece (enum)
├── BLACK
├── WHITE
└── EMPTY

Cell
├── row: int
├── col: int
└── equals(cell)

Board
├── grid: Piece[][]
├── size: int
├── initialize()
├── getPiece(row, col)
├── setPiece(row, col, piece)
├── isValidPosition(row, col)
├── getFlips(row, col, piece) → Cell[]
├── makeMove(row, col, piece) → boolean
├── hasValidMove(piece) → boolean
├── getValidMoves(piece) → Cell[]
├── countPieces(piece) → int
└── toString()

Game
├── board: Board
├── currentPlayer: Piece
├── blackPasses: boolean
├── whitePasses: boolean
├── initialize()
├── getCurrentPlayer() → Piece
├── switchPlayer()
├── playMove(row, col) → boolean
├── isGameOver() → boolean
├── getWinner() → Piece | null
├── getScore() → {black, white}
└── toString()
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Enum for Pieces
- **Piece** enum represents BLACK, WHITE, and EMPTY states
- Simple and type-safe representation
- Easy to switch and compare

### 2. Board Encapsulation
- **Board** manages all grid operations
- Complex flip logic contained within Board class
- Valid move checking isolated from game flow

### 3. Direction-Based Search
Algorithm for finding flips:
```javascript
// For each of 8 directions
directions = [
  [-1, -1], [-1, 0], [-1, 1],  // NW, N, NE
  [0, -1],           [0, 1],   // W,     E
  [1, -1],  [1, 0],  [1, 1]    // SW, S, SE
]

// In each direction, look for:
// 1. One or more opponent pieces
// 2. Followed by our piece
// All opponent pieces in between get flipped
```

### 4. Game State Management
- Tracks current player
- Handles passing when no valid moves
- Determines game over when both players pass
- Calculates winner based on piece count

## Othello Rules Implemented / Zaimplementowane Zasady

1. **Board Setup:**
   - 8x8 board
   - Initial 4 pieces in center (2 black, 2 white)
   - Black plays first

2. **Valid Moves:**
   - Must place piece adjacent to opponent's piece
   - Must flip at least one opponent piece
   - Flips occur in straight lines (8 directions)

3. **Gameplay:**
   - Players alternate turns
   - If no valid move, player must pass
   - Game ends when both players pass consecutively

4. **Winning:**
   - Player with more pieces wins
   - If equal, it's a tie

## Example Usage / Przykład Użycia

```javascript
const game = new Game();
game.initialize();

// Play some moves
game.playMove(2, 3); // Black
game.playMove(2, 2); // White
game.playMove(2, 4); // Black

// Check game state
console.log(game.toString());
const score = game.getScore();
console.log(`Black: ${score.black}, White: ${score.white}`);

// Check if game over
if (game.isGameOver()) {
  const winner = game.getWinner();
  console.log(`Winner: ${winner}`);
}
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:** Board manages its own state and validation
2. **Single Responsibility:**
   - Cell: represents position
   - Board: manages grid and moves
   - Game: orchestrates gameplay
3. **Information Hiding:** Flip logic hidden in Board methods
4. **Separation of Concerns:** Game logic separate from board logic

## Extensions / Rozszerzenia

Easy to extend for:
- AI opponent (minimax with alpha-beta pruning)
- Move suggestions/hints
- Undo/Redo functionality
- Different board sizes
- Move history tracking
- Time limits per move
- Tournament mode with multiple games

## Complexity / Złożoność

- **makeMove:** O(1) - checks 8 directions, max 7 cells each = O(56) = O(1)
- **getValidMoves:** O(n²) where n is board size (8x8 = 64 cells)
- **isGameOver:** O(n²) - checks valid moves for both players
- **Space:** O(n²) for the board grid
