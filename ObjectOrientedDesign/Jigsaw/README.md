# 7.6 Jigsaw Puzzle / Układanka

## Problem
Implement an NxN jigsaw puzzle. Design the data structures and explain an algorithm to solve the puzzle. You can assume that you have a `fitsWith` method which, when passed two puzzle pieces, returns true if the two pieces belong together.

Zaimplementuj układankę NxN. Zaprojektuj struktury danych i wyjaśnij algorytm rozwiązywania układanki.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
EdgeType (Enum)
├── FLAT    (border edge)
├── INNIE   (indented edge)
└── OUTIE   (protruding edge)

Orientation (Enum)
├── TOP: 0
├── RIGHT: 1
├── BOTTOM: 2
└── LEFT: 3

Edge
├── type: EdgeType
├── code: number (unique identifier for matching)
├── fitsWith(otherEdge) → boolean
└── toString()

Piece
├── id: number
├── edges: Edge[4]  [TOP, RIGHT, BOTTOM, LEFT]
├── correctRow: number
├── correctCol: number
├── setEdge(orientation, edge)
├── getEdge(orientation)
├── setCorrectPosition(row, col)
├── fitsWith(otherPiece, orientation) → boolean
├── isCorner() → boolean
├── isBorder() → boolean
└── toString()

Jigsaw
├── size: number
├── pieces: Piece[]
├── solution: Piece[][] (2D grid)
├── remainingPieces: Piece[]
├── generatePuzzle()
├── shuffle()
├── canPlacePiece(piece, row, col) → boolean
├── solve() → {solved, timeMs, solution}
├── solveBacktrack(row, col) → boolean
├── displaySolution()
└── verifySolution() → boolean
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Edge Matching System

Each edge has:
- **Type:** FLAT (border), INNIE (indented), or OUTIE (protruding)
- **Code:** Unique identifier for matching pairs

```javascript
fitsWith(otherEdge) {
  // FLAT edges don't fit with anything (borders)
  if (this.type === EdgeType.FLAT || otherEdge.type === EdgeType.FLAT) {
    return false;
  }
  // INNIE fits with OUTIE if they have matching codes
  if (this.type === EdgeType.INNIE && otherEdge.type === EdgeType.OUTIE) {
    return this.code === otherEdge.code;
  }
  if (this.type === EdgeType.OUTIE && otherEdge.type === EdgeType.INNIE) {
    return this.code === otherEdge.code;
  }
  return false;
}
```

### 2. Piece Representation

```
   [TOP]
    ___
   |   |
[L]|   |[R]  Each side has an Edge object
   |___|
  [BOTTOM]
```

- 4 edges (array indexed by Orientation)
- Knows its correct position (for verification)
- Can check if it's a corner or border piece

### 3. Puzzle Generation

Creates a valid puzzle by:
1. Assigning unique codes to all internal connections
2. Creating pieces with matching edge codes
3. Setting FLAT edges for all borders

```javascript
// For a 3x3 puzzle:
// Horizontal connections: 3 rows × 2 connections = 6 codes
// Vertical connections: 2 rows × 3 connections = 6 codes
// Total unique edge codes: 12

// Piece at (1,1) has:
// - TOP: INNIE with code from verticalEdges[0][1]
// - RIGHT: OUTIE with code from horizontalEdges[1][1]
// - BOTTOM: OUTIE with code from verticalEdges[1][1]
// - LEFT: INNIE with code from horizontalEdges[1][0]
```

### 4. Solving Algorithm: Backtracking

```javascript
solveBacktrack(row, col) {
  // Base case: filled all positions
  if (row === size) return true;

  // Calculate next position
  nextRow = (col === size-1) ? row+1 : row;
  nextCol = (col === size-1) ? 0 : col+1;

  // Try each remaining piece
  for each piece in remainingPieces {
    if (canPlacePiece(piece, row, col)) {
      // Place piece
      solution[row][col] = piece;
      remainingPieces.remove(piece);

      // Recurse
      if (solveBacktrack(nextRow, nextCol)) return true;

      // Backtrack
      solution[row][col] = null;
      remainingPieces.add(piece);
    }
  }

  return false;
}
```

### 5. Constraint Checking

`canPlacePiece(piece, row, col)` validates:
1. **Border constraints:** Border positions must have FLAT edges
2. **Neighbor constraints:** Must fit with already-placed adjacent pieces

```javascript
// Check top neighbor
if (row > 0 && solution[row-1][col]) {
  if (!piece.fitsWith(solution[row-1][col], Orientation.TOP)) {
    return false;
  }
}

// Similar for right, bottom, left
```

## Solving Strategy / Strategia Rozwiązywania

### Standard Backtracking (Current Implementation)
- Fill position by position, left-to-right, top-to-bottom
- Try each remaining piece at current position
- Backtrack if no piece fits

### Optimizations (Could Add)

1. **Corner-First Strategy:**
   ```javascript
   // Place 4 corners first (only 4 pieces qualify)
   // Then place borders (limited candidates)
   // Finally fill interior
   ```

2. **Most-Constrained-First:**
   ```javascript
   // Place pieces with most neighbors first
   // Reduces branching factor
   ```

3. **Edge Grouping:**
   ```javascript
   // Pre-group pieces by edge codes
   // When looking for piece to fit right of current:
   //   Only check pieces with matching left edge code
   ```

4. **Look-Ahead:**
   ```javascript
   // Before placing, check if remaining pieces
   // can still satisfy remaining constraints
   ```

## Example Usage / Przykład Użycia

```javascript
// Create 4x4 puzzle
const puzzle = new Jigsaw(4);

// Generate valid puzzle with matching edges
puzzle.generatePuzzle();

// Shuffle pieces
puzzle.shuffle();

// Solve using backtracking
const result = puzzle.solve();
console.log(`Solved: ${result.solved}`);
console.log(`Time: ${result.timeMs}ms`);

// Display solution
console.log(puzzle.displaySolution());

// Verify correctness
console.log(`Correct: ${puzzle.verifySolution()}`);
```

## Piece Classification / Klasyfikacja Elementów

```javascript
isCorner() {
  // Has exactly 2 FLAT edges
  return countFlat(edges) === 2;
}

isBorder() {
  // Has exactly 1 FLAT edge (but not a corner)
  return countFlat(edges) === 1;
}

// For NxN puzzle:
// - 4 corner pieces
// - 4(N-2) border pieces
// - (N-2)² interior pieces
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:**
   - Edge matching logic hidden in Edge class
   - Piece knows how to check compatibility
   - Solver manages backtracking state

2. **Single Responsibility:**
   - Edge: represents and matches edges
   - Piece: structure and local fitting
   - Jigsaw: generation and solving

3. **Composition:**
   - Piece composed of 4 Edge objects
   - Jigsaw composed of Piece objects

4. **Abstraction:**
   - fitsWith() provides clean interface
   - Client doesn't need to know about edge codes

5. **Algorithm Design:**
   - Backtracking with constraint propagation
   - Early termination on constraint violation

## Complexity / Złożoność

### Time Complexity
- **Generate puzzle:** O(N²) - create N² pieces
- **Worst case solving:** O(P! / (P-P)!) ≈ O(P!) where P = N²
  - In practice much better due to constraints
- **With optimizations:**
  - Corner-first: O(4! × 4(N-2)! × (N-2)²!)
  - Edge grouping: O(N² × average_candidates)

### Space Complexity
- **Pieces storage:** O(N²)
- **Solution grid:** O(N²)
- **Recursion depth:** O(N²)

### Actual Performance
```
3×3 puzzle (9 pieces):   ~10ms
4×4 puzzle (16 pieces):  ~50-200ms
5×5 puzzle (25 pieces):  ~1-10 seconds
```

## Advanced Features / Zaawansowane Funkcje

1. **Rotations:**
   ```javascript
   class Piece {
     rotate() {
       // Rotate edges clockwise
       edges = [edges[3], edges[0], edges[1], edges[2]];
     }
   }
   ```

2. **Image-Based Matching:**
   ```javascript
   class ImageEdge extends Edge {
     constructor(imageData) { }

     fitsWith(other) {
       // Compare image pixels along edges
       return pixelSimilarity > threshold;
     }
   }
   ```

3. **Partial Solutions:**
   ```javascript
   solvePartial() {
     // Find and place all pieces with high confidence
     // Leave ambiguous positions for later
   }
   ```

4. **Hints:**
   ```javascript
   getHint() {
     // Suggest next piece to place
     // Based on highest constraint satisfaction
   }
   ```

## Real-World Applications / Aplikacje w Rzeczywistości

1. **Digital Jigsaw Games:**
   - Auto-solve feature
   - Hint system
   - Progress tracking

2. **Document Reconstruction:**
   - Reassemble shredded documents
   - Match torn paper edges

3. **Image Stitching:**
   - Panorama creation
   - Archaeological fragment reconstruction

4. **Constraint Satisfaction:**
   - General CSP framework
   - Resource allocation
   - Scheduling problems
