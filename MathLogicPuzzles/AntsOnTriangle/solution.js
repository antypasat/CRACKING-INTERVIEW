// 6.4 Ants on a Triangle - Probability of collision
// 6.4 Mrówki na Trójkącie - Prawdopodobieństwo kolizji

/**
 * Calculate probability of collision for n ants on n-vertex polygon
 * Oblicz prawdopodobieństwo kolizji dla n mrówek na n-kątnym wielokącie
 *
 * Key insight: Ants DON'T collide only if ALL go same direction
 * Kluczowa obserwacja: Mrówki NIE zderzają się tylko gdy WSZYSTKIE idą w tym samym kierunku
 *
 * P(no collision) = P(all clockwise) + P(all counterclockwise)
 *                 = (1/2)^n + (1/2)^n
 *                 = 2 × (1/2)^n
 *                 = (1/2)^(n-1)
 *
 * P(collision) = 1 - P(no collision)
 *              = 1 - (1/2)^(n-1)
 *
 * @param {number} n - Number of ants/vertices
 * @returns {number} - Probability of collision
 */
function probabilityOfCollision(n) {
  const probNoCollision = Math.pow(0.5, n - 1);
  return 1 - probNoCollision;
}

/**
 * Simulate ants walking on polygon
 * Symuluj mrówki chodzące po wielokącie
 *
 * @param {number} n - Number of ants
 * @param {number} trials - Number of simulations
 * @returns {number} - Empirical probability of collision
 */
function simulateAnts(n, trials = 100000) {
  let collisions = 0;

  for (let trial = 0; trial < trials; trial++) {
    // Generate random directions for each ant (0 = CW, 1 = CCW)
    const directions = [];
    for (let i = 0; i < n; i++) {
      directions.push(Math.random() < 0.5 ? 0 : 1);
    }

    // Check if all ants go same direction
    const allSame = directions.every(d => d === directions[0]);

    // Collision occurs if NOT all same direction
    if (!allSame) {
      collisions++;
    }
  }

  return collisions / trials;
}

/**
 * Detailed explanation for triangle (n=3)
 */
function explainTriangle() {
  console.log('\n' + '='.repeat(70));
  console.log('DETAILED EXPLANATION: Triangle (3 ants)');
  console.log('='.repeat(70));
  console.log();

  console.log('Possible scenarios (CW = clockwise, CCW = counterclockwise):');
  console.log();

  const scenarios = [
    { ant1: 'CW', ant2: 'CW', ant3: 'CW', collision: false },
    { ant1: 'CW', ant2: 'CW', ant3: 'CCW', collision: true },
    { ant1: 'CW', ant2: 'CCW', ant3: 'CW', collision: true },
    { ant1: 'CW', ant2: 'CCW', ant3: 'CCW', collision: true },
    { ant1: 'CCW', ant2: 'CW', ant3: 'CW', collision: true },
    { ant1: 'CCW', ant2: 'CW', ant3: 'CCW', collision: true },
    { ant1: 'CCW', ant2: 'CCW', ant3: 'CW', collision: true },
    { ant1: 'CCW', ant2: 'CCW', ant3: 'CCW', collision: false },
  ];

  let collisionCount = 0;
  scenarios.forEach((s, i) => {
    const mark = s.collision ? '✗ COLLISION' : '✓ No collision';
    console.log(
      `${i + 1}. Ant1=${s.ant1.padEnd(3)} Ant2=${s.ant2.padEnd(3)} Ant3=${s.ant3.padEnd(3)} ${mark}`
    );
    if (s.collision) collisionCount++;
  });

  console.log();
  console.log(`Total scenarios: ${scenarios.length}`);
  console.log(`Scenarios with collision: ${collisionCount}`);
  console.log(`Scenarios without collision: ${scenarios.length - collisionCount}`);
  console.log();
  console.log(`P(collision) = ${collisionCount}/${scenarios.length} = ${collisionCount / scenarios.length}`);
  console.log();

  console.log('Key insight:');
  console.log('- Only 2 out of 8 scenarios avoid collision');
  console.log('- Both scenarios have all ants going same direction');
  console.log('- If even ONE ant goes different direction → collision!');
  console.log();
}

/**
 * Visual representation
 */
function visualizeTriangle() {
  console.log('\nVisual representation:');
  console.log();
  console.log('       A');
  console.log('      /\\');
  console.log('     /  \\');
  console.log('    /    \\');
  console.log('   B------C');
  console.log();
  console.log('No collision scenarios:');
  console.log('1. All ants go clockwise:     A→C, B→A, C→B');
  console.log('2. All ants go counterclockwise: A→B, B→C, C→A');
  console.log();
  console.log('Collision scenario example:');
  console.log('- Ant at A goes clockwise (A→C)');
  console.log('- Ant at B goes counterclockwise (B→C)');
  console.log('- They meet at edge AC → COLLISION!');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.4 ANTS ON A TRIANGLE');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('Three ants on different vertices of a triangle.');
console.log('Each ant randomly picks a direction (CW or CCW) with equal probability.');
console.log('What is the probability of collision?');
console.log();

visualizeTriangle();
explainTriangle();

console.log('Mathematical solution:');
console.log('  P(no collision) = P(all CW) + P(all CCW)');
console.log('                  = (1/2)³ + (1/2)³');
console.log('                  = 1/8 + 1/8');
console.log('                  = 1/4');
console.log();
console.log('  P(collision) = 1 - P(no collision)');
console.log('               = 1 - 1/4');
console.log('               = 3/4 = 0.75');
console.log();

// Verify with calculation
const triangleProb = probabilityOfCollision(3);
console.log(`Calculated: P(collision) = ${triangleProb.toFixed(4)} ✓`);
console.log();

// Verify with simulation
console.log('Simulation verification (100,000 trials):');
const simProb = simulateAnts(3, 100000);
console.log(`Simulated: P(collision) ≈ ${simProb.toFixed(4)}`);
console.log(`Expected: ${triangleProb.toFixed(4)}`);
console.log(`Difference: ${Math.abs(simProb - triangleProb).toFixed(4)}`);
console.log();

console.log('='.repeat(70));
console.log('GENERALIZATION: n ants on n-vertex polygon');
console.log('='.repeat(70));
console.log();

console.log('Formula: P(collision) = 1 - (1/2)^(n-1)');
console.log();

console.log('Examples:');
console.log('-'.repeat(70));
console.log('n\tP(no collision)\t\tP(collision)');
console.log('-'.repeat(70));

for (let n = 3; n <= 10; n++) {
  const pCollision = probabilityOfCollision(n);
  const pNoCollision = 1 - pCollision;
  console.log(`${n}\t${pNoCollision.toFixed(6)}\t\t${pCollision.toFixed(6)}`);
}

console.log('-'.repeat(70));
console.log();

console.log('Observations:');
console.log('- As n increases, P(collision) approaches 1');
console.log('- With more ants, it becomes increasingly unlikely all go same way');
console.log('- For large n: P(collision) ≈ 1 - 2/2ⁿ ≈ 1');
console.log();

// Simulate for different polygon sizes
console.log('Simulation verification for different polygons:');
console.log('-'.repeat(70));
console.log('n\tTheoretical\tSimulated\tDifference');
console.log('-'.repeat(70));

for (let n of [3, 4, 5, 6]) {
  const theoretical = probabilityOfCollision(n);
  const simulated = simulateAnts(n, 50000);
  const diff = Math.abs(theoretical - simulated);
  console.log(`${n}\t${theoretical.toFixed(4)}\t\t${simulated.toFixed(4)}\t\t${diff.toFixed(4)}`);
}

console.log('-'.repeat(70));
console.log();

console.log('Key insight: "No collision" is the COMPLEMENT event');
console.log('It\'s easier to calculate when ants DON\'T collide (all same direction)');
console.log('than to enumerate all collision scenarios.');
console.log();

console.log('Complexity: O(1) for calculation, O(n×trials) for simulation');
console.log('='.repeat(70));
