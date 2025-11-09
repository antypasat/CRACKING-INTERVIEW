// 6.6 Blue-Eyed Island - Logic puzzle about common knowledge
// 6.6 Wyspa Niebieskich Oczu - Zagadka logiczna o wspólnej wiedzy

/**
 * Calculate days for blue-eyed people to leave
 * Oblicz dni zanim niebieskoocy ludzie opuszczą wyspę
 *
 * Answer: If there are n blue-eyed people, they leave on day n
 * Odpowiedź: Jeśli jest n niebieskich osób, opuszczają wyspę dnia n
 *
 * @param {number} n - Number of blue-eyed people
 * @returns {number} - Day they leave
 */
function daysUntilLeave(n) {
  return n;
}

/**
 * Explain the solution step by step
 */
function explainSolution() {
  console.log('\n' + '='.repeat(70));
  console.log('SOLUTION: n blue-eyed people leave on day n');
  console.log('='.repeat(70));
  console.log();

  console.log('This is a problem about COMMON KNOWLEDGE and INDUCTION.');
  console.log();

  console.log('Key facts:');
  console.log('- Everyone can see everyone else\'s eye color');
  console.log('- No one knows their own eye color');
  console.log('- Visitor announces: "At least one person has blue eyes"');
  console.log('- Blue-eyed people must leave ASAP');
  console.log('- Flight leaves at 8pm each evening');
  console.log();

  console.log('Base case: n = 1 (one blue-eyed person)');
  console.log('-'.repeat(70));
  console.log('- Person A sees no other blue eyes');
  console.log('- Visitor says "at least one has blue eyes"');
  console.log('- Person A realizes: "I must be the one!"');
  console.log('- Person A leaves on DAY 1');
  console.log();

  console.log('Case n = 2 (two blue-eyed people: A and B)');
  console.log('-'.repeat(70));
  console.log('Day 1:');
  console.log('- A sees B with blue eyes, thinks: "Maybe only B has blue eyes"');
  console.log('- B sees A with blue eyes, thinks: "Maybe only A has blue eyes"');
  console.log('- Both wait to see if the other leaves');
  console.log('- Neither leaves on day 1');
  console.log();
  console.log('Day 2:');
  console.log('- A thinks: "If only B had blue eyes, B would have left yesterday"');
  console.log('- A realizes: "Since B didn\'t leave, B must see another blue-eyed');
  console.log('  person. That must be ME!"');
  console.log('- B makes the same reasoning');
  console.log('- Both A and B leave on DAY 2');
  console.log();

  console.log('Case n = 3 (three blue-eyed people: A, B, C)');
  console.log('-'.repeat(70));
  console.log('Day 1: Each sees 2 blue-eyed people, waits');
  console.log('Day 2: Each thinks "If there were only 2, they would leave today"');
  console.log('       No one leaves');
  console.log('Day 3: Each realizes "Since no one left on day 2, there must be 3"');
  console.log('       All three leave on DAY 3');
  console.log();

  console.log('Pattern: n blue-eyed people leave on day n');
  console.log();
}

/**
 * Simulate the island scenario
 */
function simulateIsland(n) {
  console.log(`\nSimulating: ${n} blue-eyed people on the island`);
  console.log('='.repeat(70));
  console.log();

  for (let day = 1; day <= n; day++) {
    console.log(`Day ${day}:`);

    if (day < n) {
      console.log(`  Each person sees ${n - 1} blue-eyed people`);
      console.log(`  They think: "Maybe there are only ${n - 1} blue-eyed people"`);
      console.log(`  They wait to see if those ${n - 1} leave...`);
      console.log(`  → No one leaves`);
    } else {
      console.log(`  Each person sees ${n - 1} blue-eyed people`);
      console.log(`  They expected those ${n - 1} to leave on day ${n - 1}`);
      console.log(`  Since no one left, there must be ${n} blue-eyed people`);
      console.log(`  Each realizes: "I must be the ${n}th person!"`);
      console.log(`  → ALL ${n} blue-eyed people leave on DAY ${n}`);
    }
    console.log();
  }
}

/**
 * Explain why the visitor's announcement matters
 */
function whyAnnouncementMatters() {
  console.log('\n' + '='.repeat(70));
  console.log('WHY DOES THE VISITOR\'S ANNOUNCEMENT MATTER?');
  console.log('='.repeat(70));
  console.log();

  console.log('Before announcement:');
  console.log('- Everyone already KNEW at least one person has blue eyes');
  console.log('- (They can see blue-eyed people)');
  console.log();

  console.log('After announcement:');
  console.log('- Everyone knows that EVERYONE knows at least one has blue eyes');
  console.log('- This is COMMON KNOWLEDGE');
  console.log();

  console.log('Example with 2 people (A and B):');
  console.log('Before:');
  console.log('  A knows: "B has blue eyes"');
  console.log('  A doesn\'t know: "Does B know someone has blue eyes?"');
  console.log('  (If A has brown eyes, B sees no blue eyes)');
  console.log();
  console.log('After:');
  console.log('  A knows: "B KNOWS someone has blue eyes"');
  console.log('  This allows the inductive reasoning to start!');
  console.log();

  console.log('The announcement transforms private knowledge into common knowledge.');
  console.log('This is the KEY to solving the puzzle!');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.6 BLUE-EYED ISLAND');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('A bunch of people are living on an island.');
console.log('Visitor\'s order: "All blue-eyed people must leave ASAP"');
console.log();
console.log('Rules:');
console.log('- Flight leaves at 8pm every evening');
console.log('- Each person can see everyone else\'s eye color');
console.log('- No one knows their own eye color');
console.log('- No one can tell anyone their eye color');
console.log('- Everyone knows: at least one person has blue eyes');
console.log();
console.log('Question: How many days until blue-eyed people leave?');
console.log();

explainSolution();

// Simulate different cases
simulateIsland(1);
simulateIsland(2);
simulateIsland(3);

console.log('General answer: n blue-eyed people → leave on day n');
console.log();

// Test formula
console.log('Testing formula:');
for (let n of [1, 2, 3, 5, 10, 100]) {
  const days = daysUntilLeave(n);
  console.log(`  ${n} blue-eyed people → leave on day ${days}`);
}
console.log();

whyAnnouncementMatters();

console.log('Mathematical structure:');
console.log('- This is proof by INDUCTION');
console.log('- Base case: n=1 works');
console.log('- Inductive step: If works for k, then works for k+1');
console.log('- Each person performs this reasoning simultaneously');
console.log();

console.log('Key insight: Common knowledge vs. individual knowledge');
console.log('The visitor\'s announcement creates a "clock" that synchronizes');
console.log('everyone\'s reasoning process.');
console.log();

console.log('Complexity: O(1) - simple formula regardless of n');
console.log('='.repeat(70));
