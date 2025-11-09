// 7.6 Jigsaw Puzzle - NxN puzzle with edge matching and solving
// 7.6 Puzzle - Układanka NxN z dopasowywaniem krawędzi i rozwiązywaniem

// Edge types / Typy krawędzi
const EdgeType = {
  FLAT: 'FLAT',    // Border edge
  INNIE: 'INNIE',   // Indented edge
  OUTIE: 'OUTIE'    // Protruding edge
};

// Edge orientation / Orientacja krawędzi
const Orientation = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
};

// Edge class representing one side of a puzzle piece
// Klasa Edge reprezentująca jedną stronę elementu puzzla
class Edge {
  constructor(type, code = null) {
    this.type = type;
    // Unique code for matching edges (same code = fits together)
    // Unikalny kod dla dopasowywania krawędzi (ten sam kod = pasują)
    this.code = code;
  }

  fitsWith(otherEdge) {
    if (this.type === EdgeType.FLAT || otherEdge.type === EdgeType.FLAT) {
      // Flat edges only fit on borders
      return false;
    }
    // INNIE fits with OUTIE and vice versa, with matching codes
    if (this.type === EdgeType.INNIE && otherEdge.type === EdgeType.OUTIE) {
      return this.code === otherEdge.code;
    }
    if (this.type === EdgeType.OUTIE && otherEdge.type === EdgeType.INNIE) {
      return this.code === otherEdge.code;
    }
    return false;
  }

  toString() {
    return `${this.type}${this.code ? ':' + this.code : ''}`;
  }
}

// Puzzle piece / Element puzzla
class Piece {
  constructor(id) {
    this.id = id;
    this.edges = new Array(4); // [TOP, RIGHT, BOTTOM, LEFT]
    this.correctRow = -1;
    this.correctCol = -1;
  }

  setEdge(orientation, edge) {
    this.edges[orientation] = edge;
  }

  getEdge(orientation) {
    return this.edges[orientation];
  }

  setCorrectPosition(row, col) {
    this.correctRow = row;
    this.correctCol = col;
  }

  // Check if this piece fits with another piece at given orientation
  // Sprawdź czy ten element pasuje do innego w danej orientacji
  fitsWith(otherPiece, orientation) {
    const myEdge = this.getEdge(orientation);
    const oppositeOrientation = (orientation + 2) % 4;
    const otherEdge = otherPiece.getEdge(oppositeOrientation);
    return myEdge.fitsWith(otherEdge);
  }

  isCorner() {
    let flatCount = 0;
    for (let edge of this.edges) {
      if (edge.type === EdgeType.FLAT) flatCount++;
    }
    return flatCount === 2;
  }

  isBorder() {
    let flatCount = 0;
    for (let edge of this.edges) {
      if (edge.type === EdgeType.FLAT) flatCount++;
    }
    return flatCount === 1;
  }

  toString() {
    return `Piece ${this.id} [T:${this.edges[0]}, R:${this.edges[1]}, B:${this.edges[2]}, L:${this.edges[3]}]`;
  }
}

// Jigsaw Puzzle / Układanka
class Jigsaw {
  constructor(size) {
    this.size = size;
    this.pieces = [];
    this.solution = Array(size).fill(null).map(() => Array(size).fill(null));
    this.remainingPieces = [];
  }

  // Generate a complete puzzle with matching edges
  // Generuj kompletną układankę z pasującymi krawędziami
  generatePuzzle() {
    this.pieces = [];
    let pieceId = 0;
    let edgeCode = 1;

    // Create edge code grid for horizontal and vertical connections
    // Grid to store which edges connect
    const horizontalEdges = Array(this.size).fill(null).map(() => Array(this.size - 1).fill(0));
    const verticalEdges = Array(this.size - 1).fill(null).map(() => Array(this.size).fill(0));

    // Assign edge codes
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        horizontalEdges[row][col] = edgeCode++;
      }
    }
    for (let row = 0; row < this.size - 1; row++) {
      for (let col = 0; col < this.size; col++) {
        verticalEdges[row][col] = edgeCode++;
      }
    }

    // Create pieces
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = new Piece(pieceId++);
        piece.setCorrectPosition(row, col);

        // Top edge
        if (row === 0) {
          piece.setEdge(Orientation.TOP, new Edge(EdgeType.FLAT));
        } else {
          const code = verticalEdges[row - 1][col];
          piece.setEdge(Orientation.TOP, new Edge(EdgeType.INNIE, code));
        }

        // Right edge
        if (col === this.size - 1) {
          piece.setEdge(Orientation.RIGHT, new Edge(EdgeType.FLAT));
        } else {
          const code = horizontalEdges[row][col];
          piece.setEdge(Orientation.RIGHT, new Edge(EdgeType.OUTIE, code));
        }

        // Bottom edge
        if (row === this.size - 1) {
          piece.setEdge(Orientation.BOTTOM, new Edge(EdgeType.FLAT));
        } else {
          const code = verticalEdges[row][col];
          piece.setEdge(Orientation.BOTTOM, new Edge(EdgeType.OUTIE, code));
        }

        // Left edge
        if (col === 0) {
          piece.setEdge(Orientation.LEFT, new Edge(EdgeType.FLAT));
        } else {
          const code = horizontalEdges[row][col - 1];
          piece.setEdge(Orientation.LEFT, new Edge(EdgeType.INNIE, code));
        }

        this.pieces.push(piece);
      }
    }

    return this.pieces;
  }

  // Shuffle pieces / Przemieszaj elementy
  shuffle() {
    this.remainingPieces = [...this.pieces];
    for (let i = this.remainingPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remainingPieces[i], this.remainingPieces[j]] =
        [this.remainingPieces[j], this.remainingPieces[i]];
    }
    // Clear solution
    this.solution = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
  }

  // Check if a piece can be placed at a position
  // Sprawdź czy element można umieścić na pozycji
  canPlacePiece(piece, row, col) {
    // Check top neighbor
    if (row > 0) {
      const topPiece = this.solution[row - 1][col];
      if (topPiece && !piece.fitsWith(topPiece, Orientation.TOP)) {
        return false;
      }
    } else {
      // Top border must be flat
      if (piece.getEdge(Orientation.TOP).type !== EdgeType.FLAT) {
        return false;
      }
    }

    // Check right neighbor
    if (col < this.size - 1) {
      const rightPiece = this.solution[row][col + 1];
      if (rightPiece && !piece.fitsWith(rightPiece, Orientation.RIGHT)) {
        return false;
      }
    } else {
      // Right border must be flat
      if (piece.getEdge(Orientation.RIGHT).type !== EdgeType.FLAT) {
        return false;
      }
    }

    // Check bottom neighbor
    if (row < this.size - 1) {
      const bottomPiece = this.solution[row + 1][col];
      if (bottomPiece && !piece.fitsWith(bottomPiece, Orientation.BOTTOM)) {
        return false;
      }
    } else {
      // Bottom border must be flat
      if (piece.getEdge(Orientation.BOTTOM).type !== EdgeType.FLAT) {
        return false;
      }
    }

    // Check left neighbor
    if (col > 0) {
      const leftPiece = this.solution[row][col - 1];
      if (leftPiece && !piece.fitsWith(leftPiece, Orientation.LEFT)) {
        return false;
      }
    } else {
      // Left border must be flat
      if (piece.getEdge(Orientation.LEFT).type !== EdgeType.FLAT) {
        return false;
      }
    }

    return true;
  }

  // Solve puzzle using backtracking / Rozwiąż układankę używając nawrotów
  solve() {
    this.shuffle();
    const startTime = Date.now();
    const result = this.solveBacktrack(0, 0);
    const endTime = Date.now();

    return {
      solved: result,
      timeMs: endTime - startTime,
      solution: this.solution
    };
  }

  solveBacktrack(row, col) {
    // Base case: all positions filled
    if (row === this.size) {
      return true;
    }

    // Calculate next position
    const nextRow = col === this.size - 1 ? row + 1 : row;
    const nextCol = col === this.size - 1 ? 0 : col + 1;

    // Try each remaining piece
    for (let i = 0; i < this.remainingPieces.length; i++) {
      const piece = this.remainingPieces[i];

      if (this.canPlacePiece(piece, row, col)) {
        // Place piece
        this.solution[row][col] = piece;
        this.remainingPieces.splice(i, 1);

        // Recurse
        if (this.solveBacktrack(nextRow, nextCol)) {
          return true;
        }

        // Backtrack
        this.solution[row][col] = null;
        this.remainingPieces.splice(i, 0, piece);
      }
    }

    return false;
  }

  // Display solution / Wyświetl rozwiązanie
  displaySolution() {
    const lines = [];
    for (let row = 0; row < this.size; row++) {
      const pieceIds = [];
      for (let col = 0; col < this.size; col++) {
        const piece = this.solution[row][col];
        pieceIds.push(piece ? String(piece.id).padStart(2) : '??');
      }
      lines.push(pieceIds.join(' '));
    }
    return lines.join('\n');
  }

  // Verify solution is correct / Sprawdź czy rozwiązanie jest poprawne
  verifySolution() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.solution[row][col];
        if (!piece) return false;
        if (piece.correctRow !== row || piece.correctCol !== col) {
          return false;
        }
      }
    }
    return true;
  }
}

// Tests / Testy
console.log('='.repeat(70));
console.log('7.6 JIGSAW PUZZLE');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Create and Generate 3x3 Puzzle');
console.log('-'.repeat(70));
const puzzle = new Jigsaw(3);
puzzle.generatePuzzle();

console.log(`Generated ${puzzle.pieces.length} pieces for ${puzzle.size}x${puzzle.size} puzzle`);
console.log();

console.log('Sample pieces:');
for (let i = 0; i < Math.min(4, puzzle.pieces.length); i++) {
  const piece = puzzle.pieces[i];
  console.log(`  ${piece}`);
  console.log(`    Position: (${piece.correctRow}, ${piece.correctCol})`);
  console.log(`    Type: ${piece.isCorner() ? 'Corner' : piece.isBorder() ? 'Border' : 'Internal'}`);
}
console.log();

console.log('Test 2: Edge Matching (fitsWith)');
console.log('-'.repeat(70));
const piece0 = puzzle.pieces[0]; // Top-left corner
const piece1 = puzzle.pieces[1]; // Top-middle
const piece3 = puzzle.pieces[3]; // Middle-left

console.log(`Piece 0 (top-left): ${piece0}`);
console.log(`Piece 1 (top-middle): ${piece1}`);
console.log(`Piece 3 (middle-left): ${piece3}`);
console.log();

console.log(`Does piece 0 fit with piece 1 on the RIGHT? ${piece0.fitsWith(piece1, Orientation.RIGHT)}`);
console.log(`Does piece 0 fit with piece 3 on the BOTTOM? ${piece0.fitsWith(piece3, Orientation.BOTTOM)}`);
console.log(`Does piece 0 fit with piece 1 on the LEFT? ${piece0.fitsWith(piece1, Orientation.LEFT)}`);
console.log();

console.log('Test 3: Solve Small Puzzle (3x3)');
console.log('-'.repeat(70));
console.log('Original (correct) arrangement:');
console.log(puzzle.displaySolution());
console.log();

// Set up the correct solution first to display
for (let row = 0; row < puzzle.size; row++) {
  for (let col = 0; col < puzzle.size; col++) {
    puzzle.solution[row][col] = puzzle.pieces[row * puzzle.size + col];
  }
}
console.log('Correct arrangement:');
console.log(puzzle.displaySolution());
console.log();

// Now solve from shuffled state
console.log('Shuffling and solving...');
const result = puzzle.solve();
console.log(`Solved: ${result.solved}`);
console.log(`Time: ${result.timeMs}ms`);
console.log();

console.log('Solution:');
console.log(puzzle.displaySolution());
console.log();

console.log(`Verification: ${puzzle.verifySolution() ? 'CORRECT ✓' : 'INCORRECT ✗'}`);
console.log();

console.log('Test 4: Solve Larger Puzzle (4x4)');
console.log('-'.repeat(70));
const puzzle4x4 = new Jigsaw(4);
puzzle4x4.generatePuzzle();
console.log(`Generated ${puzzle4x4.pieces.length} pieces for 4x4 puzzle`);
console.log();

console.log('Corner pieces:');
const corners = puzzle4x4.pieces.filter(p => p.isCorner());
console.log(`Found ${corners.length} corner pieces (expected 4)`);
corners.forEach(p => console.log(`  Piece ${p.id} at position (${p.correctRow}, ${p.correctCol})`));
console.log();

console.log('Border pieces (non-corner):');
const borders = puzzle4x4.pieces.filter(p => p.isBorder());
console.log(`Found ${borders.length} border pieces (expected 8)`);
console.log();

console.log('Solving 4x4 puzzle...');
const result4x4 = puzzle4x4.solve();
console.log(`Solved: ${result4x4.solved}`);
console.log(`Time: ${result4x4.timeMs}ms`);
console.log();

console.log('Solution:');
console.log(puzzle4x4.displaySolution());
console.log();

console.log(`Verification: ${puzzle4x4.verifySolution() ? 'CORRECT ✓' : 'INCORRECT ✗'}`);
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Edge matching logic, piece placement rules');
console.log('- Single Responsibility: Edge (matching), Piece (structure), Jigsaw (solving)');
console.log('- Algorithm: Backtracking with constraint checking');
console.log('- Data structures: 2D grid for solution, list for remaining pieces');
console.log('- Validation: Border detection, edge compatibility checking');
console.log('='.repeat(70));
