// 6.3 Dominos - Can 31 dominos cover chessboard with opposite corners removed?
// 6.3 Domino - Czy 31 domino może pokryć szachownicę bez przeciwnych rogów?

/**
 * Check if dominos can cover board with opposite corners removed
 * Sprawdź czy domino mogą pokryć szachownicę bez przeciwnych rogów
 *
 * @returns {boolean} - false (impossible)
 */
function canCoverBoard() {
  return false; // IMPOSSIBLE
}

/**
 * Explain why it's impossible
 * Wyjaśnij dlaczego to niemożliwe
 */
function explainSolution() {
  console.log('\n' + '='.repeat(70));
  console.log('PROOF: It is IMPOSSIBLE to cover the board with 31 dominos');
  console.log('='.repeat(70));
  console.log();

  console.log('Standard 8×8 chessboard coloring:');
  console.log('- 32 white squares');
  console.log('- 32 black squares');
  console.log();

  console.log('After removing two diagonally opposite corners:');
  console.log('- Corner squares are the SAME color (both white or both black)');
  console.log('- Remaining squares: 30 of one color, 32 of the other');
  console.log('- Example: Remove (0,0) and (7,7) → both black → 30 black, 32 white');
  console.log();

  console.log('Key observation about dominos:');
  console.log('- Each domino covers EXACTLY 2 adjacent squares');
  console.log('- Adjacent squares on a chessboard are DIFFERENT colors');
  console.log('- Therefore: Each domino covers 1 white + 1 black square');
  console.log();

  console.log('The contradiction:');
  console.log('- 31 dominos would cover: 31 white squares + 31 black squares');
  console.log('- But we have: 30 squares of one color + 32 of the other');
  console.log('- 31 ≠ 30 and 31 ≠ 32');
  console.log('- IMPOSSIBLE! ✗');
  console.log();

  console.log('='.repeat(70));
}

/**
 * Visual representation
 */
function visualizeBoard() {
  console.log('\nVisual representation of 8×8 board:');
  console.log('(W = white square, B = black square, X = removed)');
  console.log();

  // Standard chessboard with opposite corners removed
  const board = [];
  for (let row = 0; row < 8; row++) {
    const line = [];
    for (let col = 0; col < 8; col++) {
      // Opposite corners: (0,0) and (7,7)
      if ((row === 0 && col === 0) || (row === 7 && col === 7)) {
        line.push('X');
      } else {
        // Chessboard coloring: (row + col) % 2
        const isWhite = (row + col) % 2 === 0;
        line.push(isWhite ? 'W' : 'B');
      }
    }
    board.push(line);
  }

  // Print board
  console.log('  ' + '0 1 2 3 4 5 6 7'.split(' ').join(' '));
  for (let row = 0; row < 8; row++) {
    console.log(row + ' ' + board[row].join(' '));
  }
  console.log();

  // Count squares
  let white = 0, black = 0, removed = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'W') white++;
      else if (board[row][col] === 'B') black++;
      else removed++;
    }
  }

  console.log(`White squares: ${white}`);
  console.log(`Black squares: ${black}`);
  console.log(`Removed: ${removed} (both ${(0 + 0) % 2 === 0 ? 'WHITE' : 'BLACK'})`);
  console.log();

  console.log('Note: Opposite corners (0,0) and (7,7) are both WHITE squares');
  console.log('      because (0+0)%2 = 0 and (7+7)%2 = 0');
  console.log();
}

/**
 * Count squares by color
 */
function countSquares() {
  let totalWhite = 0;
  let totalBlack = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // Skip opposite corners (0,0) and (7,7)
      if ((row === 0 && col === 0) || (row === 7 && col === 7)) {
        continue;
      }

      const isWhite = (row + col) % 2 === 0;
      if (isWhite) totalWhite++;
      else totalBlack++;
    }
  }

  return { white: totalWhite, black: totalBlack };
}

// Tests
console.log('='.repeat(70));
console.log('6.3 DOMINOS');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('- 8×8 chessboard with two diagonally opposite corners removed');
console.log('- 31 dominos, each covering exactly 2 squares');
console.log('- Can you cover the entire board?');
console.log();

visualizeBoard();

const counts = countSquares();
console.log('After removing opposite corners:');
console.log(`  White squares remaining: ${counts.white}`);
console.log(`  Black squares remaining: ${counts.black}`);
console.log(`  Total: ${counts.white + counts.black} squares`);
console.log();

console.log('Domino coverage:');
console.log('  31 dominos × 2 squares = 62 squares ✓ (matches)');
console.log('  But: Each domino must cover 1 white + 1 black');
console.log('  31 dominos would need: 31 white + 31 black');
console.log(`  We have: ${counts.white} white + ${counts.black} black`);
console.log(`  31 ≠ ${counts.white} → IMPOSSIBLE ✗`);
console.log();

explainSolution();

console.log('Alternative thinking:');
console.log('- Imagine trying to place dominos');
console.log('- Each domino reduces white count by 1 and black count by 1');
console.log('- Starting difference: |' + counts.white + ' - ' + counts.black + '| = ' +
  Math.abs(counts.white - counts.black));
console.log('- After placing any number of dominos, difference stays ' +
  Math.abs(counts.white - counts.black));
console.log('- To cover all squares, difference must become 0');
console.log('- ' + Math.abs(counts.white - counts.black) + ' ≠ 0 → IMPOSSIBLE');
console.log();

console.log('Answer: ' + (canCoverBoard() ? 'YES' : 'NO'));
console.log();

console.log('This is a classic invariant problem:');
console.log('The COLOR IMBALANCE is an invariant that cannot be changed');
console.log('by any sequence of domino placements.');
console.log();

console.log('Complexity: O(1) - logical proof, no computation needed');
console.log('='.repeat(70));
