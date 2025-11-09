// 6.7 The Apocalypse - Gender ratio with "one girl" policy
// 6.7 Apokalipsa - Stosunek płci przy polityce "jedna dziewczynka"

/**
 * Simulate one family following the policy
 * Symuluj jedną rodzinę przestrzegającą polityki
 *
 * Policy: Have children until one girl, then stop
 * Polityka: Miej dzieci dopóki nie urodzi się dziewczynka, potem przestań
 *
 * @returns {object} - {boys, girls}
 */
function simulateFamily() {
  let boys = 0;
  let girls = 0;

  // Keep having children until we get a girl
  while (girls === 0) {
    if (Math.random() < 0.5) {
      girls++;
    } else {
      boys++;
    }
  }

  return { boys, girls };
}

/**
 * Simulate entire population
 * Symuluj całą populację
 *
 * @param {number} numFamilies - Number of families
 * @returns {object} - {totalBoys, totalGirls, ratio}
 */
function simulatePopulation(numFamilies) {
  let totalBoys = 0;
  let totalGirls = 0;

  for (let i = 0; i < numFamilies; i++) {
    const family = simulateFamily();
    totalBoys += family.boys;
    totalGirls += family.girls;
  }

  const ratio = totalBoys / totalGirls;
  return { totalBoys, totalGirls, ratio };
}

/**
 * Logical explanation
 */
function explainLogically() {
  console.log('\n' + '='.repeat(70));
  console.log('LOGICAL EXPLANATION');
  console.log('='.repeat(70));
  console.log();

  console.log('Key insight: The POLICY doesn\'t affect the probability of each birth.');
  console.log();

  console.log('Each birth:');
  console.log('- 50% chance of boy');
  console.log('- 50% chance of girl');
  console.log();

  console.log('The policy only affects WHEN families stop, not the');
  console.log('probability of each individual birth.');
  console.log();

  console.log('Think about it this way:');
  console.log('- In the entire population, there will be many births');
  console.log('- Each birth has 50% chance of being a boy');
  console.log('- Each birth has 50% chance of being a girl');
  console.log('- The stopping rule doesn\'t change these probabilities');
  console.log();

  console.log('Therefore: Gender ratio = 1:1 (approximately)');
  console.log();

  console.log('More formal proof:');
  console.log('-'.repeat(70));
  console.log('Let G = total girls, B = total boys');
  console.log();
  console.log('Each family has exactly 1 girl (by policy).');
  console.log('So if there are n families: G = n');
  console.log();
  console.log('Expected boys per family:');
  console.log('  E[boys] = 0×P(G on 1st) + 1×P(BG) + 2×P(BBG) + 3×P(BBBG) + ...');
  console.log('  E[boys] = 0×(1/2) + 1×(1/4) + 2×(1/8) + 3×(1/16) + ...');
  console.log('  E[boys] = Σ k×(1/2)^(k+1) for k=0 to ∞');
  console.log('  E[boys] = 1  (this is a known series)');
  console.log();
  console.log('Expected total boys: B = n × 1 = n');
  console.log('Expected total girls: G = n × 1 = n');
  console.log();
  console.log('Ratio: B/G = n/n = 1');
  console.log();
}

/**
 * Show expected boys calculation
 */
function showExpectedBoysCalculation() {
  console.log('\nDetailed calculation of E[boys per family]:');
  console.log('-'.repeat(70));
  console.log('Scenario\t\tProbability\tBoys\tContribution');
  console.log('-'.repeat(70));

  const scenarios = [
    { pattern: 'G', prob: 1 / 2, boys: 0 },
    { pattern: 'BG', prob: 1 / 4, boys: 1 },
    { pattern: 'BBG', prob: 1 / 8, boys: 2 },
    { pattern: 'BBBG', prob: 1 / 16, boys: 3 },
    { pattern: 'BBBBG', prob: 1 / 32, boys: 4 },
    { pattern: 'BBBBBG', prob: 1 / 64, boys: 5 },
  ];

  let expectedBoys = 0;
  scenarios.forEach(s => {
    const contribution = s.prob * s.boys;
    expectedBoys += contribution;
    console.log(
      `${s.pattern.padEnd(16)}\t${s.prob.toFixed(6)}\t${s.boys}\t${contribution.toFixed(6)}`
    );
  });

  console.log('...');
  console.log('-'.repeat(70));

  // Calculate exact sum using formula: Σ k×r^k = r/(1-r)² for |r|<1
  // Here: Σ k×(1/2)^(k+1) = (1/2)×Σ k×(1/2)^k = (1/2) × (1/2)/(1-1/2)² = (1/2) × 2 = 1
  const exactExpected = 1.0;

  console.log(`Sum of first 6 terms: ${expectedBoys.toFixed(6)}`);
  console.log(`Exact expected value: ${exactExpected.toFixed(6)}`);
  console.log();
  console.log('Mathematical formula: Σ k×(1/2)^(k+1) = 1');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.7 THE APOCALYPSE - Gender Ratio');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('The world queen decrees: All families must have one girl!');
console.log();
console.log('Policy:');
console.log('- Families have children until they have one girl');
console.log('- Then they immediately stop');
console.log('- Probability of boy or girl on each birth: 50%');
console.log();
console.log('Question: What will the gender ratio be?');
console.log();

explainLogically();
showExpectedBoysCalculation();

console.log('='.repeat(70));
console.log('COMPUTER SIMULATION');
console.log('='.repeat(70));
console.log();

// Run simulations with increasing family counts
const simulations = [1000, 10000, 100000, 1000000];

console.log('Running simulations with different population sizes:');
console.log('-'.repeat(70));
console.log('Families\t\tBoys\t\tGirls\t\tRatio (B:G)');
console.log('-'.repeat(70));

simulations.forEach(numFamilies => {
  const result = simulatePopulation(numFamilies);
  console.log(
    `${numFamilies.toLocaleString().padEnd(16)}\t` +
    `${result.totalBoys.toLocaleString().padEnd(16)}\t` +
    `${result.totalGirls.toLocaleString().padEnd(16)}\t` +
    `${result.ratio.toFixed(4)}`
  );
});

console.log('-'.repeat(70));
console.log();

console.log('Observation: As population increases, ratio approaches 1:1');
console.log();

// Detailed simulation with family distribution
console.log('Distribution analysis (10,000 families):');
console.log('-'.repeat(70));

const familyDistribution = {};
for (let i = 0; i < 10000; i++) {
  const family = simulateFamily();
  const key = family.boys;
  familyDistribution[key] = (familyDistribution[key] || 0) + 1;
}

console.log('Boys\tFamilies\tPercentage\tTheoretical');
console.log('-'.repeat(70));

let totalBoys = 0;
let totalGirls = 10000; // Every family has 1 girl

for (let boys = 0; boys <= 10; boys++) {
  const count = familyDistribution[boys] || 0;
  const percentage = (count / 10000 * 100).toFixed(2);
  const theoretical = (Math.pow(0.5, boys + 1) * 100).toFixed(2);

  totalBoys += boys * count;

  if (boys <= 5 || count > 0) {
    console.log(`${boys}\t${count}\t\t${percentage}%\t\t${theoretical}%`);
  }
}

console.log('-'.repeat(70));
console.log(`Total boys: ${totalBoys}`);
console.log(`Total girls: ${totalGirls}`);
console.log(`Ratio: ${(totalBoys / totalGirls).toFixed(4)}`);
console.log();

console.log('Key takeaway:');
console.log('━'.repeat(70));
console.log('The gender ratio remains 1:1 (approximately)');
console.log();
console.log('The policy determines WHEN families stop, but does NOT bias');
console.log('the gender of any individual birth. Over a large population,');
console.log('the law of large numbers ensures roughly equal boys and girls.');
console.log('━'.repeat(70));
console.log();

console.log('Complexity: O(families) for simulation');
console.log('='.repeat(70));
