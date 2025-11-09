// 7.10 Minesweeper - Classic mine-sweeping game
// 7.10 Saper - Klasyczna gra w sapera

// Cell states / Stany komórki
const CellState = {
  HIDDEN: 'HIDDEN',
  REVEALED: 'REVEALED',
  FLAGGED: 'FLAGGED'
};

// Cell represents one position on the board / Cell reprezentuje jedną pozycję na planszy
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isBomb = false;
    this.state = CellState.HIDDEN;
    this.adjacentBombs = 0;
  }

  reveal() {
    if (this.state === CellState.HIDDEN) {
      this.state = CellState.REVEALED;
    }
  }

  flag() {
    if (this.state === CellState.HIDDEN) {
      this.state = CellState.FLAGGED;
    }
  }

  unflag() {
    if (this.state === CellState.FLAGGED) {
      this.state = CellState.HIDDEN;
    }
  }

  isRevealed() {
    return this.state === CellState.REVEALED;
  }

  isFlagged() {
    return this.state === CellState.FLAGGED;
  }

  isHidden() {
    return this.state === CellState.HIDDEN;
  }

  // Display representation / Reprezentacja wyświetlania
  toString(showAll = false) {
    if (showAll) {
      if (this.isBomb) return '*';
      if (this.adjacentBombs > 0) return this.adjacentBombs.toString();
      return '.';
    }

    if (this.state === CellState.FLAGGED) return 'F';
    if (this.state === CellState.HIDDEN) return '#';

    // REVEALED
    if (this.isBomb) return '*';
    if (this.adjacentBombs > 0) return this.adjacentBombs.toString();
    return '.';
  }
}

// Board manages the game grid / Board zarządza siatką gry
class Board {
  constructor(rows, cols, numBombs) {
    this.rows = rows;
    this.cols = cols;
    this.numBombs = numBombs;
    this.grid = [];
    this.revealedCount = 0;

    this.directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
  }

  initialize() {
    // Create empty grid
    this.grid = [];
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = new Cell(row, col);
      }
    }

    this.placeBombs();
    this.calculateAdjacentBombs();
    this.revealedCount = 0;
  }

  // Place bombs randomly on the board / Umieść miny losowo na planszy
  placeBombs() {
    // Create list of all positions
    const positions = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        positions.push({ row, col });
      }
    }

    // Shuffle using Fisher-Yates
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Place bombs at first numBombs positions
    for (let i = 0; i < this.numBombs; i++) {
      const { row, col } = positions[i];
      this.grid[row][col].isBomb = true;
    }
  }

  // Calculate number of adjacent bombs for each cell
  // Oblicz liczbę sąsiednich min dla każdej komórki
  calculateAdjacentBombs() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        if (cell.isBomb) continue;

        let count = 0;
        const neighbors = this.getNeighbors(row, col);
        for (let neighbor of neighbors) {
          if (neighbor.isBomb) {
            count++;
          }
        }
        cell.adjacentBombs = count;
      }
    }
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  getCell(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  // Get all neighboring cells / Pobierz wszystkie sąsiednie komórki
  getNeighbors(row, col) {
    const neighbors = [];
    for (let [dr, dc] of this.directions) {
      const r = row + dr;
      const c = col + dc;
      if (this.isValidPosition(r, c)) {
        neighbors.push(this.grid[r][c]);
      }
    }
    return neighbors;
  }

  // Reveal a cell (with flood fill for empty cells)
  // Odkryj komórkę (z wypełnieniem zalewowym dla pustych komórek)
  revealCell(row, col) {
    const cell = this.getCell(row, col);
    if (!cell) return false;

    // Can't reveal flagged or already revealed cells
    if (cell.isFlagged() || cell.isRevealed()) {
      return false;
    }

    // If it's a bomb, reveal it and return true (game over)
    if (cell.isBomb) {
      cell.reveal();
      return true; // Hit a bomb
    }

    // Reveal this cell
    cell.reveal();
    this.revealedCount++;

    // If no adjacent bombs, recursively reveal neighbors (flood fill)
    if (cell.adjacentBombs === 0) {
      const neighbors = this.getNeighbors(row, col);
      for (let neighbor of neighbors) {
        if (!neighbor.isRevealed() && !neighbor.isFlagged()) {
          this.revealCell(neighbor.row, neighbor.col);
        }
      }
    }

    return false; // Safe cell
  }

  flagCell(row, col) {
    const cell = this.getCell(row, col);
    if (cell && !cell.isRevealed()) {
      cell.flag();
    }
  }

  unflagCell(row, col) {
    const cell = this.getCell(row, col);
    if (cell) {
      cell.unflag();
    }
  }

  toggleFlag(row, col) {
    const cell = this.getCell(row, col);
    if (!cell || cell.isRevealed()) return;

    if (cell.isFlagged()) {
      cell.unflag();
    } else {
      cell.flag();
    }
  }

  // Check if player has won / Sprawdź czy gracz wygrał
  isWon() {
    const totalCells = this.rows * this.cols;
    return this.revealedCount === (totalCells - this.numBombs);
  }

  countRevealed() {
    return this.revealedCount;
  }

  // Display board / Wyświetl planszę
  toString(showAll = false) {
    let result = '  ';
    for (let col = 0; col < this.cols; col++) {
      result += col + ' ';
    }
    result += '\n';

    for (let row = 0; row < this.rows; row++) {
      result += row + ' ';
      for (let col = 0; col < this.cols; col++) {
        result += this.grid[row][col].toString(showAll) + ' ';
      }
      result += '\n';
    }
    return result;
  }
}

// Game orchestrates Minesweeper gameplay / Game organizuje rozgrywkę w Sapera
class Game {
  constructor() {
    this.board = null;
    this.gameOver = false;
    this.won = false;
    this.startTime = null;
  }

  initialize(rows = 8, cols = 8, numBombs = 10) {
    if (numBombs >= rows * cols) {
      throw new Error('Too many bombs for board size');
    }

    this.board = new Board(rows, cols, numBombs);
    this.board.initialize();
    this.gameOver = false;
    this.won = false;
    this.startTime = new Date();
  }

  // Play a move (reveal a cell) / Zagraj ruch (odkryj komórkę)
  play(row, col) {
    if (this.gameOver) {
      return 'GAME_OVER';
    }

    const hitBomb = this.board.revealCell(row, col);

    if (hitBomb) {
      this.gameOver = true;
      this.won = false;
      return 'BOMB';
    }

    if (this.board.isWon()) {
      this.gameOver = true;
      this.won = true;
      return 'WIN';
    }

    return 'SAFE';
  }

  flag(row, col) {
    if (!this.gameOver) {
      this.board.toggleFlag(row, col);
    }
  }

  isGameOver() {
    return this.gameOver;
  }

  isWon() {
    return this.won;
  }

  getElapsedTime() {
    if (!this.startTime) return 0;
    return Math.floor((new Date() - this.startTime) / 1000);
  }

  toString(showAll = false) {
    let result = this.board.toString(showAll);
    result += `\nRevealed: ${this.board.countRevealed()} / ${this.board.rows * this.board.cols - this.board.numBombs}\n`;
    if (this.gameOver) {
      result += this.won ? 'YOU WON!\n' : 'GAME OVER!\n';
    }
    return result;
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.10 MINESWEEPER');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Small Board Setup');
console.log('-'.repeat(70));
const game1 = new Game();
game1.initialize(5, 5, 5);
console.log('Initial board (5x5 with 5 bombs):');
console.log('(# = hidden, F = flagged, . = empty, 1-8 = adjacent bombs, * = bomb)');
console.log(game1.toString());

console.log('Board with all cells revealed (cheat view):');
console.log(game1.board.toString(true));

console.log('Test 2: Flag Operations');
console.log('-'.repeat(70));
const game2 = new Game();
game2.initialize(5, 5, 3);
console.log('Initial board:');
console.log(game2.toString());

console.log('Flagging cells (1,1), (2,2), (3,3):');
game2.flag(1, 1);
game2.flag(2, 2);
game2.flag(3, 3);
console.log(game2.toString());

console.log('Unflagging (2,2):');
game2.flag(2, 2); // Toggle off
console.log(game2.toString());

console.log('Test 3: Revealing Cells');
console.log('-'.repeat(70));
const game3 = new Game();
game3.initialize(6, 6, 5);
console.log('Initial board (6x6 with 5 bombs):');
console.log(game3.board.toString(true));

console.log('Playing move at (0,0):');
let result = game3.play(0, 0);
console.log(`Result: ${result}`);
console.log(game3.toString());

console.log('Test 4: Flood Fill (Auto-reveal)');
console.log('-'.repeat(70));
// Create a board with specific bomb placement for testing
const game4 = new Game();
game4.initialize(8, 8, 8);
console.log('Board with all cells shown:');
console.log(game4.board.toString(true));

console.log('\nRevealing a safe cell...');
let safeCellFound = false;
for (let row = 0; row < 8 && !safeCellFound; row++) {
  for (let col = 0; col < 8 && !safeCellFound; col++) {
    const cell = game4.board.getCell(row, col);
    if (!cell.isBomb) {
      console.log(`Revealing cell (${row}, ${col})...`);
      result = game4.play(row, col);
      console.log(`Result: ${result}`);
      safeCellFound = true;
    }
  }
}
console.log('\nBoard after reveal (note flood fill if cell had 0 adjacent bombs):');
console.log(game4.toString());

console.log('Test 5: Hitting a Bomb');
console.log('-'.repeat(70));
const game5 = new Game();
game5.initialize(5, 5, 3);
console.log('Board (cheat view):');
console.log(game5.board.toString(true));

// Find a bomb and click it
console.log('\nFinding and clicking a bomb...');
for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 5; col++) {
    const cell = game5.board.getCell(row, col);
    if (cell.isBomb) {
      console.log(`Clicking bomb at (${row}, ${col})...`);
      result = game5.play(row, col);
      console.log(`Result: ${result}`);
      console.log(`Game Over: ${game5.isGameOver()}`);
      console.log(`Won: ${game5.isWon()}`);
      console.log();
      console.log('Final board:');
      console.log(game5.toString());
      row = 5; // Break outer loop
      break;
    }
  }
}

console.log('Test 6: Winning the Game');
console.log('-'.repeat(70));
const game6 = new Game();
game6.initialize(4, 4, 2);
console.log('Small 4x4 board with 2 bombs (cheat view):');
console.log(game6.board.toString(true));

console.log('\nRevealing all non-bomb cells...');
let moveCount = 0;
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 4; col++) {
    const cell = game6.board.getCell(row, col);
    if (!cell.isBomb && !cell.isRevealed()) {
      result = game6.play(row, col);
      moveCount++;
      console.log(`Move ${moveCount}: (${row},${col}) → ${result}`);

      if (result === 'WIN') {
        console.log('\n*** YOU WON! ***');
        console.log(game6.toString());
        row = 4; // Break outer loop
        break;
      }
    }
  }
}

console.log('Test 7: Adjacent Bomb Counting');
console.log('-'.repeat(70));
const game7 = new Game();
game7.initialize(5, 5, 5);
console.log('Board showing all cells:');
console.log(game7.board.toString(true));

console.log('\nChecking a few cells for adjacent bomb counts:');
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const cell = game7.board.getCell(row, col);
    if (!cell.isBomb) {
      console.log(`Cell (${row},${col}): ${cell.adjacentBombs} adjacent bombs`);
    }
  }
}
console.log();

console.log('Test 8: Larger Board');
console.log('-'.repeat(70));
const game8 = new Game();
game8.initialize(10, 10, 15);
console.log('10x10 board with 15 bombs:');
console.log('Total cells: 100, Bombs: 15, Safe cells: 85');
console.log('\nInitial view:');
console.log(game8.toString());

console.log('Making a safe move...');
let foundSafe = false;
for (let row = 0; row < 10 && !foundSafe; row++) {
  for (let col = 0; col < 10 && !foundSafe; col++) {
    const cell = game8.board.getCell(row, col);
    if (!cell.isBomb) {
      result = game8.play(row, col);
      console.log(`Played (${row},${col}) → ${result}`);
      foundSafe = true;
    }
  }
}
console.log(`\nRevealed: ${game8.board.countRevealed()} cells`);
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Cell manages its own state (hidden/revealed/flagged)');
console.log('- Single Responsibility: Cell, Board, Game each have distinct roles');
console.log('- Information Hiding: Bomb locations hidden until revealed');
console.log('- Flood Fill Algorithm: Recursive reveal for empty cells');
console.log('- Separation of Concerns: Game logic vs display logic');
console.log('='.repeat(70));
