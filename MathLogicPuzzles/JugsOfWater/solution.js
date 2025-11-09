// 6.5 Jugs of Water - Get exactly 4 quarts using 5qt and 3qt jugs
// 6.5 Dzbany z Wodą - Uzyskaj dokładnie 4 kwarty używając dzbanów 5qt i 3qt

/**
 * Solution to get exactly 4 quarts
 * Rozwiązanie aby uzyskać dokładnie 4 kwarty
 *
 * Steps:
 * 1. Fill 5qt jug: [5, 0]
 * 2. Pour into 3qt: [2, 3]
 * 3. Empty 3qt: [2, 0]
 * 4. Pour 2qt from 5qt to 3qt: [0, 2]
 * 5. Fill 5qt: [5, 2]
 * 6. Pour from 5qt to 3qt until full: [4, 3]
 * Result: 4 quarts in 5qt jug!
 */
function getExactly4Quarts() {
  const steps = [];
  let jug5 = 0, jug3 = 0;

  // Step 1: Fill 5qt jug
  jug5 = 5;
  steps.push({ action: 'Fill 5qt jug', jug5, jug3 });

  // Step 2: Pour from 5qt to 3qt (fills 3qt, leaves 2qt in 5qt)
  const pour1 = Math.min(jug5, 3 - jug3);
  jug5 -= pour1;
  jug3 += pour1;
  steps.push({ action: 'Pour 5qt → 3qt (fill 3qt)', jug5, jug3 });

  // Step 3: Empty 3qt jug
  jug3 = 0;
  steps.push({ action: 'Empty 3qt jug', jug5, jug3 });

  // Step 4: Pour remaining 2qt from 5qt to 3qt
  const pour2 = jug5;
  jug3 = pour2;
  jug5 = 0;
  steps.push({ action: 'Pour 5qt → 3qt (move 2qt)', jug5, jug3 });

  // Step 5: Fill 5qt jug again
  jug5 = 5;
  steps.push({ action: 'Fill 5qt jug', jug5, jug3 });

  // Step 6: Pour from 5qt to 3qt until 3qt is full
  // 3qt has 2qt, so can take 1 more qt, leaving 4qt in 5qt
  const pour3 = Math.min(jug5, 3 - jug3);
  jug5 -= pour3;
  jug3 += pour3;
  steps.push({ action: 'Pour 5qt → 3qt (add 1qt)', jug5, jug3 });

  return steps;
}

/**
 * Alternative solution
 */
function alternativeSolution() {
  const steps = [];
  let jug5 = 0, jug3 = 0;

  // Fill 3qt twice, empty 5qt once
  jug3 = 3;
  steps.push({ action: 'Fill 3qt jug', jug5, jug3 });

  jug5 = jug3;
  jug3 = 0;
  steps.push({ action: 'Pour 3qt → 5qt', jug5, jug3 });

  jug3 = 3;
  steps.push({ action: 'Fill 3qt jug', jug5, jug3 });

  // Pour from 3qt to 5qt (5qt has 3, can take 2 more, leaves 1 in 3qt)
  const pour = Math.min(jug3, 5 - jug5);
  jug3 -= pour;
  jug5 += pour;
  steps.push({ action: 'Pour 3qt → 5qt (fill 5qt)', jug5, jug3 });

  // Empty 5qt
  jug5 = 0;
  steps.push({ action: 'Empty 5qt jug', jug5, jug3 });

  // Pour 1qt from 3qt to 5qt
  jug5 = jug3;
  jug3 = 0;
  steps.push({ action: 'Pour 3qt → 5qt (move 1qt)', jug5, jug3 });

  // Fill 3qt
  jug3 = 3;
  steps.push({ action: 'Fill 3qt jug', jug5, jug3 });

  // Pour all from 3qt to 5qt (1+3=4)
  jug5 += jug3;
  jug3 = 0;
  steps.push({ action: 'Pour 3qt → 5qt (1+3=4)', jug5, jug3 });

  return steps;
}

/**
 * Display solution steps
 */
function displaySolution(steps, title) {
  console.log('\n' + title);
  console.log('='.repeat(70));
  console.log();
  console.log('Step\tAction\t\t\t\t5qt\t3qt');
  console.log('-'.repeat(70));
  console.log('0\tInitial state\t\t\t0\t0');

  steps.forEach((step, i) => {
    const action = step.action.padEnd(32);
    console.log(`${i + 1}\t${action}\t${step.jug5}\t${step.jug3}`);
  });

  console.log('-'.repeat(70));
  const final5 = steps[steps.length - 1].jug5;
  const final3 = steps[steps.length - 1].jug3;

  if (final5 === 4) {
    console.log(`✓ SUCCESS! 5qt jug has exactly 4 quarts`);
  } else if (final3 === 4) {
    console.log(`✓ SUCCESS! 3qt jug has exactly 4 quarts`);
  } else if (final5 + final3 === 4) {
    console.log(`✓ SUCCESS! Total of 4 quarts (${final5} + ${final3})`);
  }
  console.log();
}

/**
 * Visual representation
 */
function visualize(jug5, jug3) {
  const h5 = 10; // height
  const w5 = 5;  // width
  const h3 = 10;
  const w3 = 3;

  console.log('  5qt Jug    3qt Jug');

  for (let row = 0; row < h5; row++) {
    const level5 = h5 - Math.ceil((jug5 / 5) * h5);
    const level3 = h3 - Math.ceil((jug3 / 3) * h3);

    let line = '  ';

    // 5qt jug
    if (row < level5) {
      line += '|' + ' '.repeat(w5) + '|';
    } else {
      line += '|' + '█'.repeat(w5) + '|';
    }

    line += '    ';

    // 3qt jug
    if (row < level3) {
      line += '|' + ' '.repeat(w3) + '|';
    } else {
      line += '|' + '█'.repeat(w3) + '|';
    }

    console.log(line);
  }

  console.log('  +' + '-'.repeat(w5) + '+    +' + '-'.repeat(w3) + '+');
  console.log(`    ${jug5}qt         ${jug3}qt`);
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.5 JUGS OF WATER');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('You have:');
console.log('- A 5-quart jug');
console.log('- A 3-quart jug');
console.log('- Unlimited water supply');
console.log();
console.log('Goal: Measure exactly 4 quarts');
console.log('Note: Jugs are oddly shaped, cannot measure "half full"');
console.log();

// Solution 1
const solution1 = getExactly4Quarts();
displaySolution(solution1, 'SOLUTION 1 (Most efficient - 6 steps)');

console.log('Key moves:');
console.log('1. Fill 5qt, pour into 3qt → leaves 2qt in 5qt jug');
console.log('2. Empty 3qt, pour 2qt from 5qt into 3qt');
console.log('3. Fill 5qt again (now: 5qt jug = 5, 3qt jug = 2)');
console.log('4. Pour from 5qt to 3qt until full (adds 1qt) → leaves 4qt!');
console.log();

// Solution 2
const solution2 = alternativeSolution();
displaySolution(solution2, 'SOLUTION 2 (Alternative - 8 steps)');

console.log('Why these solutions work:');
console.log('- We can only fill completely, empty completely, or pour between jugs');
console.log('- The key is creating intermediate amounts (2qt, 1qt)');
console.log('- 5 - 3 = 2, then 5 - 1 = 4');
console.log('- Or: 3 + 3 - 5 = 1, then 1 + 3 = 4');
console.log();

console.log('Mathematical insight:');
console.log('- gcd(3, 5) = 1');
console.log('- We can measure any multiple of gcd(3,5) = any integer amount');
console.log('- Using Bézout\'s identity: 3a + 5b = 1 has integer solutions');
console.log('- For 4: 3(3) + 5(-1) = 9 - 5 = 4');
console.log('  (Fill 3qt three times, remove 5qt once)');
console.log();

// Visual demonstration of key step
console.log('Visual representation of final step:');
console.log('-'.repeat(70));
visualize(5, 2);
console.log('After pouring 1qt from 5qt to 3qt:');
visualize(4, 3);
console.log('✓ 4 quarts in 5qt jug!');
console.log();

console.log('General rule:');
console.log('With jugs of size A and B where gcd(A,B) = 1,');
console.log('you can measure any integer amount up to max(A,B)');
console.log();

console.log('Complexity: O(1) - fixed number of steps');
console.log('='.repeat(70));
