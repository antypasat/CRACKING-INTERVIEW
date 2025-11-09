// 6.2 Basketball - Choose optimal game based on probability
// 6.2 Koszykówka - Wybierz optymalną grę na podstawie prawdopodobieństwa

/**
 * Calculate probability of winning Game 1
 * Oblicz prawdopodobieństwo wygrania Gry 1
 *
 * Game 1: Make 1 shot
 * @param {number} p - Probability of making a shot
 * @returns {number} - P(win)
 */
function probGame1(p) {
  return p;
}

/**
 * Calculate probability of winning Game 2
 * Oblicz prawdopodobieństwo wygrania Gry 2
 *
 * Game 2: Make at least 2 out of 3 shots
 * P(win) = P(exactly 2) + P(all 3)
 *        = C(3,2) × p² × (1-p) + p³
 *        = 3p²(1-p) + p³
 *        = 3p² - 3p³ + p³
 *        = 3p² - 2p³
 *
 * @param {number} p - Probability of making a shot
 * @returns {number} - P(win)
 */
function probGame2(p) {
  // P(exactly 2 successes) + P(3 successes)
  const exactlyTwo = 3 * p * p * (1 - p); // C(3,2) = 3
  const allThree = p * p * p;
  return exactlyTwo + allThree;
}

/**
 * Determine which game to play
 * Określ którą grę wybrać
 *
 * @param {number} p - Probability of making a shot
 * @returns {string} - "Game 1" or "Game 2"
 */
function chooseGame(p) {
  const p1 = probGame1(p);
  const p2 = probGame2(p);

  if (p1 > p2) return 'Game 1';
  if (p2 > p1) return 'Game 2';
  return 'Either (equal probability)';
}

/**
 * Find the threshold where games are equal
 * Game 1: p
 * Game 2: 3p² - 2p³
 *
 * Set equal: p = 3p² - 2p³
 * p = 3p² - 2p³
 * 2p³ - 3p² + p = 0
 * p(2p² - 3p + 1) = 0
 * p(2p - 1)(p - 1) = 0
 * Solutions: p = 0, p = 0.5, p = 1
 *
 * Critical point: p = 0.5
 */
function findThreshold() {
  // Solve: p = 3p² - 2p³
  // 2p³ - 3p² + p = 0
  // p(2p² - 3p + 1) = 0
  // p(2p - 1)(p - 1) = 0

  // Non-trivial solutions
  return [0.5, 1.0];
}

/**
 * Detailed analysis
 */
function analyzeGames() {
  console.log('\nDetailed Analysis:');
  console.log('Game 1: P(win) = p');
  console.log('Game 2: P(win) = 3p² - 2p³');
  console.log();

  console.log('Setting them equal:');
  console.log('p = 3p² - 2p³');
  console.log('2p³ - 3p² + p = 0');
  console.log('p(2p² - 3p + 1) = 0');
  console.log('p(2p - 1)(p - 1) = 0');
  console.log();

  console.log('Solutions: p = 0, p = 0.5, p = 1.0');
  console.log();

  console.log('Testing derivative to find maximum:');
  console.log('Game 2 derivative: d/dp(3p² - 2p³) = 6p - 6p²');
  console.log('At p = 0.5: 6(0.5) - 6(0.25) = 3 - 1.5 = 1.5 > 0');
  console.log('At p = 1.0: 6(1) - 6(1) = 0');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.2 BASKETBALL');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('Game 1: Make 1 shot');
console.log('Game 2: Make at least 2 out of 3 shots');
console.log('For which values of p should you pick each game?');
console.log();

// Test probabilities
const testValues = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0];

console.log('Probability Comparison:');
console.log('-'.repeat(70));
console.log('p\t\tGame 1\t\tGame 2\t\tBest Choice');
console.log('-'.repeat(70));

for (let p of testValues) {
  const p1 = probGame1(p);
  const p2 = probGame2(p);
  const choice = chooseGame(p);

  console.log(
    `${p.toFixed(1)}\t\t${p1.toFixed(4)}\t\t${p2.toFixed(4)}\t\t${choice}`
  );
}

console.log('-'.repeat(70));

analyzeGames();

console.log('CONCLUSION:');
console.log('━'.repeat(70));
console.log('• If p < 0.5: Choose Game 1 (one shot)');
console.log('• If p = 0.5: Either game (equal probability)');
console.log('• If p > 0.5: Choose Game 2 (best 2 of 3)');
console.log('━'.repeat(70));
console.log();

console.log('Intuition:');
console.log('- If you\'re a poor shooter (p < 0.5), more chances means more');
console.log('  opportunities to fail. Better to take one shot.');
console.log('- If you\'re a good shooter (p > 0.5), more chances means you can');
console.log('  afford one miss and still win. Take three shots.');
console.log();

// Verification with specific examples
console.log('Example 1: p = 0.4 (40% shooter)');
console.log(`  Game 1: ${probGame1(0.4).toFixed(4)} (40%)`);
console.log(`  Game 2: ${probGame2(0.4).toFixed(4)} (35.2%)`);
console.log(`  Choose: ${chooseGame(0.4)} ✓`);
console.log();

console.log('Example 2: p = 0.6 (60% shooter)');
console.log(`  Game 1: ${probGame1(0.6).toFixed(4)} (60%)`);
console.log(`  Game 2: ${probGame2(0.6).toFixed(4)} (64.8%)`);
console.log(`  Choose: ${chooseGame(0.6)} ✓`);
console.log();

console.log('Example 3: p = 0.8 (80% shooter)');
console.log(`  Game 1: ${probGame1(0.8).toFixed(4)} (80%)`);
console.log(`  Game 2: ${probGame2(0.8).toFixed(4)} (89.6%)`);
console.log(`  Choose: ${chooseGame(0.8)} ✓`);
console.log();

console.log('Mathematical approach: Compare p vs 3p² - 2p³');
console.log('='.repeat(70));
