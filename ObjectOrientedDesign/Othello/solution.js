// 7.8 Othello - Board game with piece flipping mechanics
// 7.8 Othello - Gra planszowa z mechaniką odwracania pionków

// Piece types / Typy pionków
const Piece = {
  BLACK: 'B',
  WHITE: 'W',
  EMPTY: '.'
};

// Cell represents a position on the board / Cell reprezentuje pozycję na planszy
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  equals(other) {
    return this.row === other.row && this.col === other.col;
  }

  toString() {
    return `(${this.row},${this.col})`;
  }
}

// Board manages the game grid and move validation
// Board zarządza siatką gry i walidacją ruchów
class Board {
  constructor(size = 8) {
    this.size = size;
    this.grid = [];
    this.directions = [
      [-1, -1], [-1, 0], [-1, 1],  // NW, N, NE
      [0, -1],           [0, 1],   // W,     E
      [1, -1],  [1, 0],  [1, 1]    // SW, S, SE
    ];
  }

  initialize() {
    // Create empty board
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = Piece.EMPTY;
      }
    }

    // Place initial 4 pieces in center
    const mid = this.size / 2;
    this.grid[mid - 1][mid - 1] = Piece.WHITE;
    this.grid[mid - 1][mid] = Piece.BLACK;
    this.grid[mid][mid - 1] = Piece.BLACK;
    this.grid[mid][mid] = Piece.WHITE;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getPiece(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  setPiece(row, col, piece) {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = piece;
    }
  }

  // Get opponent's piece / Pobierz pionek przeciwnika
  getOpponent(piece) {
    if (piece === Piece.BLACK) return Piece.WHITE;
    if (piece === Piece.WHITE) return Piece.BLACK;
    return Piece.EMPTY;
  }

  // Get all cells that would be flipped by placing a piece at (row, col)
  // Pobierz wszystkie komórki, które zostałyby odwrócone przez umieszczenie pionka w (row, col)
  getFlips(row, col, piece) {
    if (!this.isValidPosition(row, col) || this.grid[row][col] !== Piece.EMPTY) {
      return [];
    }

    const opponent = this.getOpponent(piece);
    const allFlips = [];

    // Check all 8 directions
    for (let [dr, dc] of this.directions) {
      const flipsInDirection = [];
      let r = row + dr;
      let c = col + dc;

      // First, we need at least one opponent piece
      while (this.isValidPosition(r, c) && this.getPiece(r, c) === opponent) {
        flipsInDirection.push(new Cell(r, c));
        r += dr;
        c += dc;
      }

      // Then we need our piece to complete the sandwich
      if (flipsInDirection.length > 0 &&
          this.isValidPosition(r, c) &&
          this.getPiece(r, c) === piece) {
        allFlips.push(...flipsInDirection);
      }
    }

    return allFlips;
  }

  // Make a move and flip pieces / Wykonaj ruch i odwróć pionki
  makeMove(row, col, piece) {
    const flips = this.getFlips(row, col, piece);

    if (flips.length === 0) {
      return false; // Invalid move
    }

    // Place the new piece
    this.setPiece(row, col, piece);

    // Flip all captured pieces
    for (let cell of flips) {
      this.setPiece(cell.row, cell.col, piece);
    }

    return true;
  }

  // Check if a player has any valid move / Sprawdź czy gracz ma jakikolwiek prawidłowy ruch
  hasValidMove(piece) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.getFlips(row, col, piece).length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  // Get all valid moves for a player / Pobierz wszystkie prawidłowe ruchy dla gracza
  getValidMoves(piece) {
    const moves = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.getFlips(row, col, piece).length > 0) {
          moves.push(new Cell(row, col));
        }
      }
    }
    return moves;
  }

  // Count pieces of a given color / Policz pionki danego koloru
  countPieces(piece) {
    let count = 0;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] === piece) {
          count++;
        }
      }
    }
    return count;
  }

  toString() {
    let result = '  ';
    for (let i = 0; i < this.size; i++) {
      result += i + ' ';
    }
    result += '\n';

    for (let row = 0; row < this.size; row++) {
      result += row + ' ';
      for (let col = 0; col < this.size; col++) {
        result += this.grid[row][col] + ' ';
      }
      result += '\n';
    }
    return result;
  }
}

// Game orchestrates the Othello gameplay / Game organizuje rozgrywkę Othello
class Game {
  constructor(boardSize = 8) {
    this.board = new Board(boardSize);
    this.currentPlayer = Piece.BLACK;
    this.blackPasses = false;
    this.whitePasses = false;
  }

  initialize() {
    this.board.initialize();
    this.currentPlayer = Piece.BLACK;
    this.blackPasses = false;
    this.whitePasses = false;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === Piece.BLACK ? Piece.WHITE : Piece.BLACK;
  }

  // Play a move at the specified position / Zagraj ruch na określonej pozycji
  playMove(row, col) {
    const success = this.board.makeMove(row, col, this.currentPlayer);

    if (success) {
      // Reset pass flags when a move is made
      this.blackPasses = false;
      this.whitePasses = false;
      this.switchPlayer();

      // If next player has no valid moves, they must pass
      if (!this.board.hasValidMove(this.currentPlayer)) {
        if (this.currentPlayer === Piece.BLACK) {
          this.blackPasses = true;
        } else {
          this.whitePasses = true;
        }
        this.switchPlayer();
      }
    }

    return success;
  }

  // Game is over when both players pass consecutively
  // Gra kończy się gdy obaj gracze spasują kolejno
  isGameOver() {
    return this.blackPasses && this.whitePasses;
  }

  // Get the winner based on piece count / Pobierz zwycięzcę na podstawie liczby pionków
  getWinner() {
    if (!this.isGameOver()) {
      return null;
    }

    const blackCount = this.board.countPieces(Piece.BLACK);
    const whiteCount = this.board.countPieces(Piece.WHITE);

    if (blackCount > whiteCount) return Piece.BLACK;
    if (whiteCount > blackCount) return Piece.WHITE;
    return 'TIE';
  }

  getScore() {
    return {
      black: this.board.countPieces(Piece.BLACK),
      white: this.board.countPieces(Piece.WHITE)
    };
  }

  toString() {
    const score = this.getScore();
    let result = this.board.toString();
    result += `\nCurrent Player: ${this.currentPlayer}\n`;
    result += `Score - Black: ${score.black}, White: ${score.white}\n`;
    return result;
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.8 OTHELLO (REVERSI)');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Initial Board Setup');
console.log('-'.repeat(70));
const game = new Game();
game.initialize();
console.log(game.toString());

console.log('Test 2: Valid Moves for Black');
console.log('-'.repeat(70));
const validMoves = game.board.getValidMoves(Piece.BLACK);
console.log(`Valid moves for BLACK: ${validMoves.length} moves`);
validMoves.forEach(move => console.log(`  ${move}`));
console.log();

console.log('Test 3: Playing Moves');
console.log('-'.repeat(70));
console.log('Black plays (2,3):');
game.playMove(2, 3);
console.log(game.toString());

console.log('White plays (2,2):');
game.playMove(2, 2);
console.log(game.toString());

console.log('Black plays (2,4):');
game.playMove(2, 4);
console.log(game.toString());

console.log('Test 4: Check Flips');
console.log('-'.repeat(70));
const game2 = new Game();
game2.initialize();
const flips = game2.board.getFlips(2, 3, Piece.BLACK);
console.log(`Placing BLACK at (2,3) would flip ${flips.length} pieces:`);
flips.forEach(cell => console.log(`  ${cell}`));
console.log();

console.log('Test 5: Full Game Simulation');
console.log('-'.repeat(70));
const game3 = new Game();
game3.initialize();

const moves = [
  [2, 3], [2, 2], [2, 4], [4, 2], [5, 3], [5, 2],
  [3, 2], [5, 4], [4, 5], [3, 5], [2, 5], [5, 5]
];

for (let i = 0; i < moves.length; i++) {
  const [row, col] = moves[i];
  const player = game3.getCurrentPlayer();

  if (game3.isGameOver()) {
    console.log('Game Over!');
    break;
  }

  console.log(`Move ${i + 1}: ${player} plays (${row},${col})`);
  const success = game3.playMove(row, col);

  if (!success) {
    console.log('  Invalid move!');
  } else {
    const score = game3.getScore();
    console.log(`  Score - Black: ${score.black}, White: ${score.white}`);
  }
}

console.log('\nFinal Board:');
console.log(game3.toString());

if (game3.isGameOver()) {
  const winner = game3.getWinner();
  console.log(`Winner: ${winner}`);
}
console.log();

console.log('Test 6: Edge Cases');
console.log('-'.repeat(70));
const game4 = new Game();
game4.initialize();

// Try invalid move
console.log('Attempting invalid move at (0,0):');
const invalid = game4.playMove(0, 0);
console.log(`Result: ${invalid ? 'Success' : 'Failed (as expected)'}`);

// Try move on occupied cell
console.log('\nAttempting move on occupied cell (3,3):');
const occupied = game4.playMove(3, 3);
console.log(`Result: ${occupied ? 'Success' : 'Failed (as expected)'}`);

// Check valid moves
console.log('\nCurrent valid moves for BLACK:');
const validBlack = game4.board.getValidMoves(Piece.BLACK);
console.log(`Count: ${validBlack.length}`);
validBlack.forEach(move => console.log(`  ${move}`));
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Board manages grid state and flip logic');
console.log('- Single Responsibility: Cell, Board, Game each have clear purpose');
console.log('- Information Hiding: Complex flip algorithm hidden in Board.getFlips()');
console.log('- Separation of Concerns: Game orchestration separate from board logic');
console.log('='.repeat(70));
