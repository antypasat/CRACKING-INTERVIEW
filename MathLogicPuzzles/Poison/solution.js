// 6.10 Poison - Find poisoned bottle using binary encoding with test strips
// 6.10 Trucizna - Znajdź zatrutą butelkę używając kodowania binarnego

/**
 * Find poisoned bottle using binary encoding
 * Znajdź zatrutą butelkę używając kodowania binarnego
 *
 * Strategy: Use test strips as binary digits
 * Each bottle number (0-999) has a 10-bit binary representation
 * Put drop from bottle i on strip j if bit j of i is 1
 * After 7 days, read which strips are positive
 * The pattern of positive strips gives the binary number of poisoned bottle
 *
 * @param {number} poisonedBottle - The poisoned bottle (0-999)
 * @returns {object} - Testing strategy and result
 */
function findPoisonedBottle(poisonedBottle) {
  const numBottles = 1000;
  const numStrips = 10; // 2^10 = 1024 > 1000

  // Map each bottle to binary representation
  const bottleToBinary = (bottle) => {
    return bottle.toString(2).padStart(numStrips, '0');
  };

  // Create testing plan: which strips get drops from which bottles
  const testingPlan = {};
  for (let strip = 0; strip < numStrips; strip++) {
    testingPlan[strip] = [];
  }

  // For each bottle, add drop to appropriate strips
  for (let bottle = 0; bottle < numBottles; bottle++) {
    const binary = bottleToBinary(bottle);

    for (let strip = 0; strip < numStrips; strip++) {
      // If bit at position (numStrips - 1 - strip) is 1, add to this strip
      if (binary[strip] === '1') {
        testingPlan[strip].push(bottle);
      }
    }
  }

  // Simulate test: which strips turn positive?
  const positiveStrips = [];
  for (let strip = 0; strip < numStrips; strip++) {
    if (testingPlan[strip].includes(poisonedBottle)) {
      positiveStrips.push(strip);
    }
  }

  // Read result: convert positive strips back to bottle number
  let detectedBottle = 0;
  for (let strip of positiveStrips) {
    detectedBottle += Math.pow(2, numStrips - 1 - strip);
  }

  return {
    testingPlan,
    positiveStrips,
    detectedBottle,
    daysNeeded: 1, // Only one test run needed!
  };
}

/**
 * Explain the strategy
 */
function explainStrategy() {
  console.log('\n' + '='.repeat(70));
  console.log('STRATEGY: Binary Encoding');
  console.log('='.repeat(70));
  console.log();

  console.log('Key insight: Use test strips as BINARY DIGITS');
  console.log();

  console.log('Setup:');
  console.log('- 1000 bottles (numbered 0-999)');
  console.log('- 10 test strips (2^10 = 1024 > 1000)');
  console.log('- Each strip represents a bit position');
  console.log();

  console.log('Process:');
  console.log('1. Convert each bottle number to 10-bit binary');
  console.log('2. For bottle i, put drop on strip j if bit j of i is 1');
  console.log('3. Wait 7 days for results');
  console.log('4. Read which strips are positive');
  console.log('5. Positive strips form binary number = poisoned bottle');
  console.log();

  console.log('Example: Bottle #537');
  console.log('-'.repeat(70));
  const bottle = 537;
  const binary = bottle.toString(2).padStart(10, '0');
  console.log(`Bottle #${bottle} in binary: ${binary}`);
  console.log();
  console.log('Strip assignments:');
  for (let i = 0; i < 10; i++) {
    const bit = binary[i];
    const value = bit === '1' ? 'DROP' : '-';
    const stripNum = i;
    console.log(`  Strip ${stripNum}: ${value} (bit ${i} = ${bit})`);
  }
  console.log();
  console.log('If bottle 537 is poisoned, strips 0, 2, 4, 9 turn positive');
  console.log('Reading: 1000011001₂ = 537₁₀');
  console.log();
}

/**
 * Simulate with visual representation
 */
function simulateVisually(poisonedBottle) {
  console.log(`\nSimulating with poisoned bottle #${poisonedBottle}:`);
  console.log('='.repeat(70));

  const binary = poisonedBottle.toString(2).padStart(10, '0');
  console.log(`Binary representation: ${binary}`);
  console.log();

  console.log('Strip\tBit\tGets drop?\tResult');
  console.log('-'.repeat(70));

  const positiveStrips = [];
  for (let strip = 0; strip < 10; strip++) {
    const bit = binary[strip];
    const getDrop = bit === '1';
    const result = getDrop ? 'POSITIVE' : 'negative';

    console.log(`${strip}\t${bit}\t${getDrop ? 'YES' : 'NO'}\t\t${result}`);

    if (getDrop) {
      positiveStrips.push(strip);
    }
  }

  console.log('-'.repeat(70));
  console.log();

  console.log('Reading results:');
  console.log(`Positive strips: ${positiveStrips.join(', ')}`);
  console.log(`Binary pattern: ${binary}`);

  // Calculate detected bottle
  const detected = parseInt(binary, 2);
  console.log(`Detected bottle: ${detected}`);
  console.log(`Correct: ${detected === poisonedBottle ? '✓' : '✗'}`);
  console.log();
}

/**
 * Show how binary encoding works for small example
 */
function smallExample() {
  console.log('\nSmall example: 8 bottles, 3 strips');
  console.log('='.repeat(70));
  console.log();

  console.log('Bottle\tBinary\tStrip 0\tStrip 1\tStrip 2');
  console.log('-'.repeat(70));

  for (let bottle = 0; bottle < 8; bottle++) {
    const binary = bottle.toString(2).padStart(3, '0');
    const s0 = binary[0] === '1' ? '●' : '○';
    const s1 = binary[1] === '1' ? '●' : '○';
    const s2 = binary[2] === '1' ? '●' : '○';
    console.log(`${bottle}\t${binary}\t${s0}\t${s1}\t${s2}`);
  }

  console.log('-'.repeat(70));
  console.log('Legend: ● = drop on strip, ○ = no drop');
  console.log();

  console.log('If bottle 5 is poisoned:');
  console.log('  Binary: 101');
  console.log('  Strips 0 and 2 turn positive');
  console.log('  Reading: 101₂ = 5₁₀');
  console.log();
}

// Tests
console.log('='.repeat(70));
console.log('6.10 POISON');
console.log('='.repeat(70));

console.log('\nProblem:');
console.log('- 1000 bottles of soda, exactly one is poisoned');
console.log('- 10 test strips that detect poison');
console.log('- Single drop makes strip permanently positive');
console.log('- Can put multiple drops on one strip');
console.log('- Can reuse strips (if still negative)');
console.log('- Tests take 7 days to return result');
console.log('- Can only run tests once per day');
console.log();
console.log('Question: Find poisoned bottle in fewest days');
console.log();

explainStrategy();
smallExample();

console.log('Why 1 day is sufficient:');
console.log('━'.repeat(70));
console.log('With 10 test strips, we can distinguish 2^10 = 1024 possibilities');
console.log('We have 1000 bottles, so 10 strips is enough');
console.log('We can test all bottles SIMULTANEOUSLY in one batch');
console.log('After 7 days, we read the result → 7 days total (not 7×something)');
console.log('━'.repeat(70));
console.log();

console.log('ANSWER: 7 days (one test run)');
console.log();

// Test with specific examples
const testCases = [0, 1, 5, 100, 537, 999];

console.log('Testing specific bottles:');
console.log('='.repeat(70));

testCases.forEach(bottle => {
  simulateVisually(bottle);
});

// Verify the solution works
console.log('Comprehensive verification:');
console.log('='.repeat(70));
console.log();

let allCorrect = true;
for (let bottle = 0; bottle < 1000; bottle++) {
  const result = findPoisonedBottle(bottle);
  if (result.detectedBottle !== bottle) {
    console.log(`✗ Failed for bottle ${bottle}`);
    allCorrect = false;
  }
}

if (allCorrect) {
  console.log('✓ All 1000 bottles correctly identified!');
  console.log('✓ Each requires exactly 1 test run (7 days)');
}
console.log();

console.log('Extension: What if we had fewer strips?');
console.log('-'.repeat(70));
console.log('Strips\tMax bottles\tEnough for 1000?');
console.log('-'.repeat(70));

for (let strips = 1; strips <= 12; strips++) {
  const maxBottles = Math.pow(2, strips);
  const enough = maxBottles >= 1000 ? '✓' : '✗';
  console.log(`${strips}\t${maxBottles}\t\t${enough}`);
}

console.log('-'.repeat(70));
console.log('Minimum strips needed: 10 (since 2^9 = 512 < 1000 < 1024 = 2^10)');
console.log();

console.log('Follow-up: What if we could run tests multiple days?');
console.log('-'.repeat(70));
console.log('With k days and n strips, we can distinguish up to (k+1)^n bottles');
console.log('Because each strip has k+1 states: negative, positive on day 1, 2, ..., k');
console.log();
console.log('Examples:');
console.log('  1 day, 10 strips: 2^10 = 1024 bottles');
console.log('  2 days, 5 strips: 3^5 = 243 bottles');
console.log('  3 days, 4 strips: 4^4 = 256 bottles');
console.log();
console.log('For 1000 bottles with minimal days:');
console.log('  We need (k+1)^n ≥ 1000');
console.log('  With 10 strips: k=0 works (1 day, 2^10=1024)');
console.log('  With 7 strips: k=1 works (2 days, 3^7=2187)');
console.log('  With 5 strips: k=2 works (3 days, 4^5=1024)');
console.log();

console.log('Key insight: Binary encoding maps each bottle to unique strip pattern');
console.log();

console.log('Complexity: O(1) - always 7 days regardless of which bottle');
console.log('='.repeat(70));
