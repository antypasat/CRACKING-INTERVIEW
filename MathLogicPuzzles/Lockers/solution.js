// 6.9 100 Lockers - Which lockers are open after 100 passes?
// 6.9 100 Szafek - Które szafki są otwarte po 100 przejściach?

/**
 * Simulate the locker toggling process
 * Symuluj proces przełączania szafek
 *
 * @param {number} n - Number of lockers
 * @returns {Array} - Array of open locker numbers
 */
function findOpenLockers(n) {
  // Initialize all lockers as closed (false)
  const lockers = new Array(n + 1).fill(false); // 1-indexed

  // Perform n passes
  for (let pass = 1; pass <= n; pass++) {
    // Toggle every pass-th locker
    for (let locker = pass; locker <= n; locker += pass) {
      lockers[locker] = !lockers[locker];
    }
  }

  // Find which lockers are open
  const openLockers = [];
  for (let i = 1; i <= n; i++) {
    if (lockers[i]) {
      openLockers.push(i);
    }
  }

  return openLockers;
}

/**
 * Count divisors of a number
 * Policz dzielniki liczby
 *
 * @param {number} n - The number
 * @returns {number} - Number of divisors
 */
function countDivisors(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      count++;
    }
  }
  return count;
}

/**
 * Mathematical solution - identify pattern
 * Rozwiązanie matematyczne - zidentyfikuj wzorzec
 *
 * Key insight: A locker is toggled once for each divisor.
 * Locker #k is toggled on passes that divide k.
 * It ends OPEN if toggled an ODD number of times.
 * A number has an ODD number of divisors only if it's a PERFECT SQUARE.
 *
 * @param {number} n - Number of lockers
 * @returns {Array} - Array of open locker numbers (perfect squares)
 */
function mathematicalSolution(n) {
  const openLockers = [];
  let i = 1;

  while (i * i <= n) {
    openLockers.push(i * i);
    i++;
  }

  return openLockers;
}

/**
 * Explain why perfect squares are the answer
 */
function explainSolution() {
  console.log('\n' + '='.repeat(70));
  console.log('WHY PERFECT SQUARES?');
  console.log('='.repeat(70));
  console.log();

  console.log('Key observations:');
  console.log('-'.repeat(70));
  console.log('1. Locker #k is toggled on pass i if i divides k');
  console.log('2. Number of toggles = number of divisors of k');
  console.log('3. Locker is OPEN if toggled ODD number of times');
  console.log('4. Need: k has ODD number of divisors');
  console.log();

  console.log('When does a number have ODD divisors?');
  console.log('-'.repeat(70));
  console.log('Divisors usually come in PAIRS:');
  console.log('  If d divides n, then n/d also divides n');
  console.log('  Example: 12 has divisors: 1×12, 2×6, 3×4 (6 divisors, even)');
  console.log();
  console.log('EXCEPTION: When d = n/d, i.e., when n = d²');
  console.log('  This happens only for PERFECT SQUARES');
  console.log('  Example: 16 has divisors: 1×16, 2×8, 4×4, 4×4 is same pair!');
  console.log('  Actually: 1, 2, 4, 8, 16 (5 divisors, odd)');
  console.log();

  console.log('Perfect squares are the ONLY numbers with odd divisor count.');
  console.log();
}

/**
 * Show detailed analysis for specific lockers
 */
function analyzeSpecificLockers() {
  console.log('\nDetailed analysis of specific lockers:');
  console.log('='.repeat(70));

  const testLockers = [1, 4, 9, 12, 16, 20, 25];

  console.log('Locker\tDivisors\t\t\tCount\tFinal State');
  console.log('-'.repeat(70));

  testLockers.forEach(locker => {
    const divisors = [];
    for (let i = 1; i <= locker; i++) {
      if (locker % i === 0) {
        divisors.push(i);
      }
    }

    const count = divisors.length;
    const isOpen = count % 2 === 1;
    const isPerfectSquare = Math.sqrt(locker) === Math.floor(Math.sqrt(locker));

    console.log(
      `${locker}\t${divisors.join(', ').padEnd(32)}\t${count}\t` +
      `${isOpen ? 'OPEN' : 'CLOSED'} ${isPerfectSquare ? '(perfect square)' : ''}`
    );
  });

  console.log('-'.repeat(70));
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.9 100 LOCKERS');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('- 100 closed lockers in a hallway');
console.log('- Pass 1: Open all 100 lockers');
console.log('- Pass 2: Toggle every 2nd locker (close 2, 4, 6, ...)');
console.log('- Pass 3: Toggle every 3rd locker (close/open 3, 6, 9, ...)');
console.log('- ...');
console.log('- Pass 100: Toggle locker #100 only');
console.log();
console.log('Question: How many lockers are open after 100 passes?');
console.log();

explainSolution();
analyzeSpecificLockers();

console.log('Simulation:');
console.log('='.repeat(70));
const openLockers = findOpenLockers(100);
console.log(`Open lockers: ${openLockers.join(', ')}`);
console.log();
console.log(`Total open: ${openLockers.length}`);
console.log();

console.log('Verification with mathematical solution:');
const mathSolution = mathematicalSolution(100);
console.log(`Perfect squares up to 100: ${mathSolution.join(', ')}`);
console.log(`Total: ${mathSolution.length}`);
console.log();

console.log('Match:', JSON.stringify(openLockers) === JSON.stringify(mathSolution) ? '✓' : '✗');
console.log();

console.log('Visual representation of first 25 lockers:');
console.log('-'.repeat(70));
const lockers25 = findOpenLockers(25);
const lockerStates = [];
for (let i = 1; i <= 25; i++) {
  if (lockers25.includes(i)) {
    lockerStates.push(`[${i}]`);
  } else {
    lockerStates.push(` ${i} `);
  }
}

// Print in 5x5 grid
for (let row = 0; row < 5; row++) {
  let line = '';
  for (let col = 0; col < 5; col++) {
    const index = row * 5 + col;
    line += lockerStates[index].padStart(4);
  }
  console.log(line);
}

console.log();
console.log('Legend: [n] = open, n = closed');
console.log('Open lockers: 1, 4, 9, 16, 25 (all perfect squares)');
console.log();

console.log('Pattern recognition:');
console.log('-'.repeat(70));
console.log('Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100');
console.log('Count: 10 = √100');
console.log();
console.log('General formula for n lockers: ⌊√n⌋ open lockers');
console.log();

console.log('Why this makes intuitive sense:');
console.log('━'.repeat(70));
console.log('Locker #36 is toggled on passes: 1, 2, 3, 4, 6, 9, 12, 18, 36');
console.log('Divisors of 36: 1×36, 2×18, 3×12, 4×9, 6×6');
console.log('The pair 6×6 counts as ONE divisor, not TWO!');
console.log('Total: 9 divisors (odd) → OPEN');
console.log();
console.log('Locker #35 is toggled on passes: 1, 5, 7, 35');
console.log('Divisors of 35: 1×35, 5×7');
console.log('Total: 4 divisors (even) → CLOSED');
console.log('━'.repeat(70));
console.log();

console.log('ANSWER: 10 lockers are open');
console.log('They are: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100');
console.log('(All perfect squares from 1 to 100)');
console.log();

console.log('Complexity: O(n) for simulation, O(√n) for mathematical solution');
console.log('='.repeat(70));
