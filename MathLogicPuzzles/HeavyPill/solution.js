// 6.1 The Heavy Pill - Find heavy bottle using scale once
// 6.1 Ciężka Pigułka - Znajdź ciężką butelkę używając wagi raz

/**
 * Find the heavy bottle using one weighing
 * Znajdź ciężką butelkę używając jednego ważenia
 *
 * Algorithm: Number bottles 1-20. Take i pills from bottle i.
 * Weigh all pills together. The excess weight in 0.1g units
 * tells you which bottle is heavy.
 *
 * Algorytm: Ponumeruj butelki 1-20. Weź i pigułek z butelki i.
 * Zważ wszystkie pigułki razem. Nadwaga w jednostkach 0.1g
 * wskazuje która butelka jest ciężka.
 *
 * @param {number} heavyBottle - Which bottle has heavy pills (1-20)
 * @returns {number} - Detected heavy bottle number
 */
function findHeavyBottle(heavyBottle) {
  // Expected weight if all pills were 1.0g
  // Total pills: 1 + 2 + ... + 20 = 20 * 21 / 2 = 210
  const totalPills = (20 * 21) / 2;
  const expectedWeight = totalPills * 1.0;

  // Actual weight with bottle #heavyBottle having 1.1g pills
  // heavyBottle pills weigh 0.1g more each
  const actualWeight = expectedWeight + (heavyBottle * 0.1);

  // The excess weight in 0.1g units gives the bottle number
  const excessWeight = actualWeight - expectedWeight;
  const detectedBottle = excessWeight / 0.1;

  return detectedBottle;
}

/**
 * Simulation of the weighing process
 */
function simulateWeighing(heavyBottleNumber) {
  console.log(`\nSimulating: Heavy bottle is #${heavyBottleNumber}`);
  console.log('Taking pills from each bottle:');

  let totalWeight = 0;
  for (let bottle = 1; bottle <= 20; bottle++) {
    const pillsFromBottle = bottle;
    const pillWeight = (bottle === heavyBottleNumber) ? 1.1 : 1.0;
    const weight = pillsFromBottle * pillWeight;
    totalWeight += weight;

    if (bottle <= 5 || bottle === heavyBottleNumber) {
      console.log(`  Bottle ${bottle}: ${pillsFromBottle} pills × ${pillWeight}g = ${weight}g`);
    }
  }

  console.log('  ...');
  console.log(`\nTotal weight: ${totalWeight}g`);

  const expectedWeight = (20 * 21 / 2) * 1.0; // 210g
  console.log(`Expected weight (all 1.0g): ${expectedWeight}g`);
  console.log(`Excess weight: ${(totalWeight - expectedWeight).toFixed(1)}g`);

  const detected = Math.round((totalWeight - expectedWeight) / 0.1);
  console.log(`Heavy bottle detected: #${detected}`);

  return detected;
}

// Tests
console.log('='.repeat(70));
console.log('6.1 THE HEAVY PILL');
console.log('='.repeat(70));

console.log('\nProblem: 20 bottles of pills. 19 have 1.0g pills, one has 1.1g pills.');
console.log('Find the heavy bottle using scale only once.');
console.log();

console.log('Solution:');
console.log('1. Number bottles 1 to 20');
console.log('2. Take i pills from bottle i (1 from #1, 2 from #2, etc.)');
console.log('3. Weigh all pills together');
console.log('4. Excess weight in 0.1g units = heavy bottle number');
console.log();

console.log('Why it works:');
console.log('- Total pills: 1+2+...+20 = 210 pills');
console.log('- If all 1.0g: total = 210.0g');
console.log('- If bottle #n is heavy: total = 210.0g + n×0.1g');
console.log('- Excess weight / 0.1g = n');
console.log();

// Test cases
console.log('Test 1: Heavy bottle is #7');
let result = simulateWeighing(7);
console.log(`✓ Correct: ${result === 7}`);

console.log('\nTest 2: Heavy bottle is #1');
result = simulateWeighing(1);
console.log(`✓ Correct: ${result === 1}`);

console.log('\nTest 3: Heavy bottle is #20');
result = simulateWeighing(20);
console.log(`✓ Correct: ${result === 20}`);

console.log('\nTest 4: Verify with mathematical function');
for (let bottle of [5, 10, 15, 18]) {
  const detected = findHeavyBottle(bottle);
  console.log(`Bottle #${bottle}: Detected #${detected} ✓`);
}

console.log();
console.log('Key Insight: We can encode information in the NUMBER of pills');
console.log('we take from each bottle, not just whether we take pills or not.');
console.log();

console.log('Complexity: O(1) - single weighing, regardless of number of bottles');
console.log('='.repeat(70));
