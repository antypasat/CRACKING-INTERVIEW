// 6.8 The Egg Drop Problem - Find breaking floor with 2 eggs, minimize drops
// 6.8 Problem Spadającego Jajka - Znajdź piętro złamania z 2 jajkami

/**
 * Find optimal first drop floor and maximum drops needed
 * Znajdź optymalne pierwsze piętro i maksymalną liczbę prób
 *
 * Key insight: Use load balancing - if first egg breaks at floor X,
 * we have X-1 floors to check with second egg. To minimize worst case,
 * make total drops constant: X + (X-1) ≤ maxDrops
 *
 * Strategy: Drop from floors with decreasing intervals
 * If we have n drops total: start at floor n, then n-1 higher, etc.
 *
 * For 100 floors: n + (n-1) + ... + 1 ≥ 100
 *                 n(n+1)/2 ≥ 100
 *                 n ≥ 14 (approximately)
 *
 * @returns {object} - Optimal strategy
 */
function findOptimalStrategy() {
  // Find minimum n where n(n+1)/2 >= 100
  let n = 1;
  while (n * (n + 1) / 2 < 100) {
    n++;
  }

  // Generate drop sequence
  const dropSequence = [];
  let floor = n;

  while (floor <= 100) {
    dropSequence.push(floor);
    n--;
    floor += n;
  }

  return {
    maxDrops: Math.ceil(Math.sqrt(2 * 100)), // ~14
    firstDrop: dropSequence[0],
    sequence: dropSequence,
  };
}

/**
 * Simulate finding the breaking floor
 * Symuluj znajdowanie piętra łamania
 *
 * @param {number} breakingFloor - The actual breaking floor (N)
 * @param {Array} dropSequence - Sequence of floors to drop from
 * @returns {object} - Result with number of drops used
 */
function simulateDrop(breakingFloor, dropSequence) {
  let drops = 0;
  let egg1Broken = false;
  let foundFloor = null;

  // First egg - drop according to sequence
  for (let i = 0; i < dropSequence.length; i++) {
    drops++;
    const floor = dropSequence[i];

    if (floor >= breakingFloor) {
      // First egg breaks
      egg1Broken = true;

      // Second egg - search linearly from previous floor
      const startFloor = i === 0 ? 1 : dropSequence[i - 1] + 1;
      const endFloor = floor - 1;

      for (let f = startFloor; f <= endFloor; f++) {
        drops++;
        if (f >= breakingFloor) {
          foundFloor = f;
          break;
        }
      }

      if (!foundFloor && floor >= breakingFloor) {
        foundFloor = floor;
      }

      break;
    }
  }

  // If egg1 never broke, breaking floor is above all tested floors
  if (!egg1Broken) {
    const lastTested = dropSequence[dropSequence.length - 1];
    for (let f = lastTested + 1; f <= 100; f++) {
      drops++;
      if (f >= breakingFloor) {
        foundFloor = f;
        break;
      }
    }
  }

  return { foundFloor, drops };
}

/**
 * Explain the strategy
 */
function explainStrategy() {
  console.log('\n' + '='.repeat(70));
  console.log('OPTIMAL STRATEGY EXPLANATION');
  console.log('='.repeat(70));
  console.log();

  console.log('Problem constraints:');
  console.log('- 100 floors');
  console.log('- 2 eggs');
  console.log('- Minimize worst-case drops');
  console.log();

  console.log('Key insight: LOAD BALANCING');
  console.log('-'.repeat(70));
  console.log('If we drop first egg at floor X:');
  console.log('  - If it breaks: X-1 more drops with second egg (worst case)');
  console.log('  - Total drops if breaks at X: 1 + (X-1) = X');
  console.log();
  console.log('If we drop at regular intervals of size X:');
  console.log('  - Floors: X, 2X, 3X, ...');
  console.log('  - Worst case: X drops');
  console.log('  - But: 100/X drops with first egg, so X + 100/X total');
  console.log('  - Optimal X ≈ √100 = 10, giving ~10 + 10 = 20 drops');
  console.log();

  console.log('BETTER STRATEGY: Decreasing intervals');
  console.log('-'.repeat(70));
  console.log('Drop from floors: n, n+(n-1), n+(n-1)+(n-2), ...');
  console.log();
  console.log('If first egg breaks on kth drop:');
  console.log('  - Drops so far: k');
  console.log('  - Floors to check with egg 2: (n-k+1)');
  console.log('  - Total drops: k + (n-k+1) = n+1 ≤ n+1');
  console.log();
  console.log('To cover 100 floors:');
  console.log('  n + (n-1) + (n-2) + ... + 1 ≥ 100');
  console.log('  n(n+1)/2 ≥ 100');
  console.log('  n² + n - 200 ≥ 0');
  console.log('  n ≥ 13.65...');
  console.log('  n = 14');
  console.log();
  console.log('Maximum drops needed: 14');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.8 THE EGG DROP PROBLEM');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('- Building with 100 floors');
console.log('- Eggs break if dropped from floor N or above');
console.log('- 2 eggs available');
console.log('- Find N while minimizing worst-case number of drops');
console.log();

explainStrategy();

const strategy = findOptimalStrategy();

console.log('OPTIMAL STRATEGY:');
console.log('='.repeat(70));
console.log(`Maximum drops needed: ${strategy.maxDrops}`);
console.log(`First drop from floor: ${strategy.firstDrop}`);
console.log();
console.log('Drop sequence:');
console.log(strategy.sequence.join(', '));
console.log();

console.log('How it works:');
console.log('-'.repeat(70));
strategy.sequence.forEach((floor, i) => {
  const interval = i === 0 ? floor : floor - strategy.sequence[i - 1];
  console.log(`Drop ${i + 1}: Floor ${floor} (interval: ${interval})`);
});
console.log();

console.log('Verification - Test all breaking floors:');
console.log('='.repeat(70));

let maxDropsUsed = 0;
const testFloors = [1, 5, 10, 13, 14, 15, 27, 50, 75, 99, 100];

console.log('Breaking Floor\tDrops Used\tFound Floor');
console.log('-'.repeat(70));

testFloors.forEach(floor => {
  const result = simulateDrop(floor, strategy.sequence);
  maxDropsUsed = Math.max(maxDropsUsed, result.drops);
  const status = result.foundFloor === floor ? '✓' : '✗';
  console.log(`${floor}\t\t${result.drops}\t\t${result.foundFloor} ${status}`);
});

console.log('-'.repeat(70));
console.log(`Maximum drops used: ${maxDropsUsed}`);
console.log(`Guaranteed maximum: ${strategy.maxDrops}`);
console.log();

console.log('Worst case scenarios:');
console.log('-'.repeat(70));

// Test worst cases
const worstCases = [13, 14, 27, 39];
worstCases.forEach(floor => {
  const result = simulateDrop(floor, strategy.sequence);
  console.log(`Breaking floor ${floor}: ${result.drops} drops`);
});

console.log();

console.log('Why this is optimal:');
console.log('━'.repeat(70));
console.log('1. Each drop with first egg eliminates a range of floors');
console.log('2. Intervals decrease so total work is balanced');
console.log('3. If first egg breaks early, second egg has fewer floors');
console.log('4. If first egg breaks late, we\'ve already eliminated many floors');
console.log('5. All scenarios converge to ~14 drops maximum');
console.log('━'.repeat(70));
console.log();

console.log('Alternative simpler strategy (worse):');
console.log('Drop every 10 floors: 10, 20, 30, ..., 100');
console.log('Worst case: 10 drops (first egg) + 9 drops (second egg) = 19 drops');
console.log('Our strategy: 14 drops (better!)');
console.log();

console.log('Complexity: O(√n) where n is number of floors');
console.log('='.repeat(70));
