/**
 * Towers of Hanoi
 * Classic puzzle: Move N disks from first tower to last tower
 * Rules:
 * 1. Only one disk can be moved at a time
 * 2. Each move takes the upper disk from one stack to another
 * 3. No disk may be placed on top of a smaller disk
 */

class Tower {
  constructor(index) {
    this.index = index;
    this.disks = [];
  }

  getIndex() {
    return this.index;
  }

  add(disk) {
    if (this.disks.length > 0 && this.disks[this.disks.length - 1] <= disk) {
      throw new Error(`Error placing disk ${disk} on tower ${this.index}`);
    }
    this.disks.push(disk);
  }

  moveTopTo(destination) {
    if (this.disks.length === 0) {
      throw new Error(`Tower ${this.index} is empty`);
    }
    const top = this.disks.pop();
    destination.add(top);
  }

  moveDisks(n, destination, buffer) {
    if (n <= 0) return;

    // Move top n-1 disks from origin to buffer, using destination as buffer
    this.moveDisks(n - 1, buffer, destination);

    // Move the bottom disk from origin to destination
    this.moveTopTo(destination);

    // Move n-1 disks from buffer to destination, using origin as buffer
    buffer.moveDisks(n - 1, destination, this);
  }

  toString() {
    return `Tower ${this.index}: [${this.disks.join(', ')}]`;
  }

  size() {
    return this.disks.length;
  }

  getDisks() {
    return [...this.disks];
  }
}

/**
 * Solve Towers of Hanoi puzzle
 */
function towersOfHanoi(n) {
  const towers = [new Tower(0), new Tower(1), new Tower(2)];

  // Initialize first tower with n disks (largest to smallest)
  for (let i = n; i >= 1; i--) {
    towers[0].add(i);
  }

  console.log('Initial state:');
  towers.forEach(tower => console.log(`  ${tower.toString()}`));

  // Move all disks from tower 0 to tower 2
  towers[0].moveDisks(n, towers[2], towers[1]);

  console.log('\nFinal state:');
  towers.forEach(tower => console.log(`  ${tower.toString()}`));

  return towers;
}

/**
 * Alternative implementation with move tracking
 */
class TowerWithTracking extends Tower {
  constructor(index, moveTracker) {
    super(index);
    this.moveTracker = moveTracker;
  }

  moveTopTo(destination) {
    if (this.disks.length === 0) {
      throw new Error(`Tower ${this.index} is empty`);
    }
    const top = this.disks[this.disks.length - 1];
    super.moveTopTo(destination);

    // Track the move
    if (this.moveTracker) {
      this.moveTracker.push({
        disk: top,
        from: this.index,
        to: destination.index
      });
    }
  }
}

function towersOfHanoiWithTracking(n) {
  const moves = [];
  const towers = [
    new TowerWithTracking(0, moves),
    new TowerWithTracking(1, moves),
    new TowerWithTracking(2, moves)
  ];

  // Initialize first tower
  for (let i = n; i >= 1; i--) {
    towers[0].add(i);
  }

  towers[0].moveDisks(n, towers[2], towers[1]);

  return { towers, moves };
}

/**
 * Iterative solution (for comparison)
 */
function towersOfHanoiIterative(n) {
  const towers = [new Tower(0), new Tower(1), new Tower(2)];

  // Initialize
  for (let i = n; i >= 1; i--) {
    towers[0].add(i);
  }

  // Calculate number of moves needed: 2^n - 1
  const totalMoves = Math.pow(2, n) - 1;

  // Determine the direction based on whether n is odd or even
  // For odd n: move in clockwise direction (0->2->1->0)
  // For even n: move in counter-clockwise direction (0->1->2->0)
  const direction = n % 2 === 0 ? [0, 1, 2] : [0, 2, 1];

  for (let move = 1; move <= totalMoves; move++) {
    // Determine which towers to move between
    const fromIdx = (move - 1) % 3;
    const toIdx = (move) % 3;

    const from = towers[direction[fromIdx]];
    const to = towers[direction[toIdx]];

    // Determine which direction to move (from->to or to->from)
    if (from.size() === 0) {
      to.moveTopTo(from);
    } else if (to.size() === 0) {
      from.moveTopTo(to);
    } else if (from.getDisks()[from.size() - 1] < to.getDisks()[to.size() - 1]) {
      from.moveTopTo(to);
    } else {
      to.moveTopTo(from);
    }
  }

  return towers;
}

// Test cases
console.log('=== Towers of Hanoi Tests ===\n');

console.log('Test 1: N=3 (Basic case)');
console.log('-------------------');
towersOfHanoi(3);

console.log('\n\nTest 2: N=4 with move tracking');
console.log('-------------------');
const result4 = towersOfHanoiWithTracking(4);
console.log('Initial: Tower 0 has disks [4, 3, 2, 1]');
console.log(`Total moves: ${result4.moves.length}`);
console.log(`Expected moves: ${Math.pow(2, 4) - 1} = 15`);
console.log('\nMove sequence:');
result4.moves.forEach((move, i) => {
  console.log(`  Move ${i + 1}: Disk ${move.disk} from Tower ${move.from} to Tower ${move.to}`);
});
console.log('\nFinal state:');
result4.towers.forEach(tower => console.log(`  ${tower.toString()}`));

console.log('\n\nTest 3: N=1 (Minimal case)');
console.log('-------------------');
towersOfHanoi(1);

console.log('\n\nTest 4: N=2 (Small case)');
console.log('-------------------');
towersOfHanoi(2);

console.log('\n\nTest 5: N=5 (Larger case)');
console.log('-------------------');
const result5 = towersOfHanoiWithTracking(5);
console.log('Initial: Tower 0 has disks [5, 4, 3, 2, 1]');
console.log(`Total moves: ${result5.moves.length}`);
console.log(`Expected moves: ${Math.pow(2, 5) - 1} = 31`);
console.log('Final state:');
result5.towers.forEach(tower => console.log(`  ${tower.toString()}`));

console.log('\n\n=== Performance Analysis ===\n');

function analyzeComplexity() {
  console.log('Number of moves for different N:');
  for (let n = 1; n <= 10; n++) {
    const moves = Math.pow(2, n) - 1;
    console.log(`  N=${n}: ${moves} moves`);
  }
  console.log('\nTime Complexity: O(2^n)');
  console.log('Space Complexity: O(n) for recursion stack');
}

analyzeComplexity();

console.log('\n=== Validation Tests ===\n');

function validateSolution(n) {
  const result = towersOfHanoiWithTracking(n);
  const expectedMoves = Math.pow(2, n) - 1;
  const actualMoves = result.moves.length;
  const tower2Size = result.towers[2].size();
  const allDisksPresent = tower2Size === n;

  console.log(`N=${n}:`);
  console.log(`  Expected moves: ${expectedMoves}`);
  console.log(`  Actual moves: ${actualMoves}`);
  console.log(`  Correct move count: ${expectedMoves === actualMoves ? 'PASS' : 'FAIL'}`);
  console.log(`  All disks on Tower 2: ${allDisksPresent ? 'PASS' : 'FAIL'}`);

  // Verify disks are in correct order (largest to smallest)
  const disks = result.towers[2].getDisks();
  let correctOrder = true;
  for (let i = 0; i < disks.length - 1; i++) {
    if (disks[i] < disks[i + 1]) {
      correctOrder = false;
      break;
    }
  }
  console.log(`  Disks in correct order: ${correctOrder ? 'PASS' : 'FAIL'}`);

  return expectedMoves === actualMoves && allDisksPresent && correctOrder;
}

[1, 2, 3, 4, 5, 6].forEach(n => validateSolution(n));

module.exports = {
  Tower,
  towersOfHanoi,
  towersOfHanoiWithTracking,
  towersOfHanoiIterative
};
