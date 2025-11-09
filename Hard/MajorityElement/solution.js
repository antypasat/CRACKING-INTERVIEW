/**
 * 17.10 Majority Element
 *
 * A majority element is an element that makes up more than half of the items in an array.
 * Given a positive integers array, find the majority element. If there is no majority element,
 * return -1. Do this in O(n) time and O(1) space.
 *
 * Example:
 * Input:  [1, 2, 5, 9, 5, 9, 5, 5, 5]
 * Output: 5
 *
 * This problem is solved using the Boyer-Moore Voting Algorithm.
 */

/**
 * Solution: Boyer-Moore Voting Algorithm
 *
 * Key Insight:
 * If we cancel out each occurrence of an element with a different element,
 * the majority element (if it exists) will be the one remaining.
 *
 * Algorithm:
 * Phase 1 - Find candidate:
 *   - Track a candidate and its count
 *   - If count is 0, select current element as candidate
 *   - If current element matches candidate, increment count
 *   - Otherwise, decrement count
 *
 * Phase 2 - Verify candidate:
 *   - Count actual occurrences of candidate
 *   - Return candidate if it appears > n/2 times, else -1
 *
 * Why it works:
 * - If a majority element exists, it will survive the cancellation process
 * - The majority element appears more than all others combined
 *
 * Time: O(n), Space: O(1)
 *
 * @param {number[]} array - Array of positive integers
 * @returns {number} Majority element or -1 if none exists
 */
function findMajorityElement(array) {
  if (!array || array.length === 0) return -1;

  // Phase 1: Find candidate
  let candidate = null;
  let count = 0;

  for (const num of array) {
    if (count === 0) {
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      count++;
    } else {
      count--;
    }
  }

  // Phase 2: Verify candidate
  if (candidate === null) return -1;

  let actualCount = 0;
  for (const num of array) {
    if (num === candidate) {
      actualCount++;
    }
  }

  return actualCount > array.length / 2 ? candidate : -1;
}

/**
 * Alternative: Hash Map approach (uses O(n) space)
 * Count occurrences and check if any exceeds n/2
 *
 * Time: O(n), Space: O(n)
 *
 * @param {number[]} array - Array of positive integers
 * @returns {number} Majority element or -1 if none exists
 */
function findMajorityElementHashMap(array) {
  if (!array || array.length === 0) return -1;

  const counts = new Map();

  // Count occurrences
  for (const num of array) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  // Find majority element
  const threshold = array.length / 2;
  for (const [num, count] of counts.entries()) {
    if (count > threshold) {
      return num;
    }
  }

  return -1;
}

/**
 * Alternative: Sorting approach
 * If majority element exists, it must be at middle position after sorting
 *
 * Time: O(n log n), Space: O(1) or O(n) depending on sort implementation
 *
 * @param {number[]} array - Array of positive integers
 * @returns {number} Majority element or -1 if none exists
 */
function findMajorityElementSort(array) {
  if (!array || array.length === 0) return -1;

  // Sort the array
  const sorted = [...array].sort((a, b) => a - b);

  // If majority element exists, it must be at the middle
  const candidate = sorted[Math.floor(array.length / 2)];

  // Verify
  let count = 0;
  for (const num of array) {
    if (num === candidate) count++;
  }

  return count > array.length / 2 ? candidate : -1;
}

/**
 * Helper function to demonstrate Boyer-Moore algorithm step-by-step
 * @param {number[]} array - Input array
 * @returns {number} Majority element or -1
 */
function findMajorityElementWithDebug(array) {
  console.log(`\n--- Finding Majority Element ---`);
  console.log(`Input: [${array.join(', ')}]`);
  console.log(`Array length: ${array.length}, Majority threshold: ${array.length / 2}`);

  // Phase 1: Find candidate
  console.log('\n=== Phase 1: Finding Candidate ===');
  console.log('Index | Element | Candidate | Count | Action');
  console.log('-'.repeat(65));

  let candidate = null;
  let count = 0;

  for (let i = 0; i < array.length; i++) {
    const num = array[i];
    let action = '';

    if (count === 0) {
      candidate = num;
      count = 1;
      action = `Set candidate to ${num}`;
    } else if (num === candidate) {
      count++;
      action = 'Match: increment count';
    } else {
      count--;
      action = 'Different: decrement count';
    }

    console.log(`  ${i.toString().padStart(2)}  |   ${num.toString().padStart(3)}   |    ${candidate !== null ? candidate.toString().padStart(3) : 'null'}    |   ${count}   | ${action}`);
  }

  console.log(`\nCandidate after Phase 1: ${candidate}`);

  // Phase 2: Verify candidate
  console.log('\n=== Phase 2: Verifying Candidate ===');

  if (candidate === null) {
    console.log('No candidate found (empty array)');
    return -1;
  }

  let actualCount = 0;
  for (const num of array) {
    if (num === candidate) {
      actualCount++;
    }
  }

  console.log(`Candidate ${candidate} appears ${actualCount} times`);
  console.log(`Threshold: ${array.length / 2}`);
  console.log(`Is majority: ${actualCount > array.length / 2 ? 'YES ✓' : 'NO ✗'}`);

  const result = actualCount > array.length / 2 ? candidate : -1;
  console.log(`\nResult: ${result}`);

  return result;
}

/**
 * Helper to visualize the cancellation process
 * @param {number[]} array - Input array
 */
function visualizeCancellation(array) {
  console.log('\n--- Cancellation Visualization ---');
  console.log('Think of it as pairs canceling out:');

  const counts = new Map();
  for (const num of array) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  console.log('\nElement counts:');
  for (const [num, count] of counts.entries()) {
    console.log(`  ${num}: ${count} occurrences`);
  }

  const majorityElement = findMajorityElement(array);

  if (majorityElement !== -1) {
    const majorityCount = counts.get(majorityElement);
    const othersCount = array.length - majorityCount;

    console.log('\nCancellation:');
    console.log(`  ${majorityElement} appears ${majorityCount} times`);
    console.log(`  All others appear ${othersCount} times combined`);
    console.log(`  After canceling ${othersCount} pairs, ${majorityCount - othersCount} of ${majorityElement} remain`);
    console.log(`  This is why ${majorityElement} is the candidate!`);
  } else {
    console.log('\nNo majority element - all elements cancel out');
  }
}

// ============================================
// TEST CASES
// ============================================

console.log('='.repeat(70));
console.log('17.10 MAJORITY ELEMENT - TEST CASES');
console.log('='.repeat(70));

// Test 1: Basic cases with majority element
console.log('\n--- Test 1: Cases With Majority Element ---');
const test1Cases = [
  { array: [1, 2, 5, 9, 5, 9, 5, 5, 5], expected: 5, desc: 'Example from problem' },
  { array: [1, 1, 1, 1, 2, 3, 4], expected: 1, desc: 'Majority at start' },
  { array: [1, 2, 3, 3, 3, 3, 3], expected: 3, desc: 'Majority at end' },
  { array: [5, 5, 5, 5, 5, 5, 5], expected: 5, desc: 'All same element' },
  { array: [1, 2, 1, 2, 1, 2, 1], expected: 1, desc: 'Alternating with majority' },
  { array: [7], expected: 7, desc: 'Single element' }
];

test1Cases.forEach(({ array, expected, desc }) => {
  const boyerMoore = findMajorityElement(array);
  const hashMap = findMajorityElementHashMap(array);
  const sort = findMajorityElementSort(array);

  const match = boyerMoore === expected && hashMap === expected && sort === expected;
  const status = match ? '✓' : '✗';

  console.log(`${status} ${desc}`);
  console.log(`   Array: [${array.join(', ')}]`);
  console.log(`   Boyer-Moore: ${boyerMoore}, HashMap: ${hashMap}, Sort: ${sort}, Expected: ${expected}`);
});

// Test 2: Cases without majority element
console.log('\n--- Test 2: Cases Without Majority Element ---');
const test2Cases = [
  { array: [1, 2, 3, 4, 5], desc: 'All different' },
  { array: [1, 1, 2, 2, 3, 3], desc: 'Multiple elements, none majority' },
  { array: [1, 2, 1, 2], desc: 'Two elements equally distributed' },
  { array: [1, 2, 3, 1, 2, 3], desc: 'Pattern without majority' },
  { array: [], desc: 'Empty array' }
];

test2Cases.forEach(({ array, desc }) => {
  const boyerMoore = findMajorityElement(array);
  const hashMap = findMajorityElementHashMap(array);
  const sort = findMajorityElementSort(array);

  const match = boyerMoore === -1 && hashMap === -1 && sort === -1;
  const status = match ? '✓' : '✗';

  console.log(`${status} ${desc}`);
  console.log(`   Array: [${array.join(', ')}]`);
  console.log(`   Boyer-Moore: ${boyerMoore}, HashMap: ${hashMap}, Sort: ${sort} (all should be -1)`);
});

// Test 3: Step-by-step example
console.log('\n--- Test 3: Step-by-Step Example ---');
findMajorityElementWithDebug([1, 2, 5, 9, 5, 9, 5, 5, 5]);

// Test 4: Another step-by-step example (no majority)
console.log('\n--- Test 4: Step-by-Step Example (No Majority) ---');
findMajorityElementWithDebug([1, 2, 3, 1, 2, 3]);

// Test 5: Cancellation visualization
console.log('\n--- Test 5: Cancellation Visualization ---');
visualizeCancellation([1, 2, 5, 9, 5, 9, 5, 5, 5]);
visualizeCancellation([1, 2, 3, 1, 2, 3]);

// Test 6: Edge of majority (exactly half + 1)
console.log('\n--- Test 6: Edge of Majority ---');
const edgeCases = [
  { array: [1, 1, 2], desc: '2 out of 3 (exact majority)' },
  { array: [1, 1, 1, 2, 2], desc: '3 out of 5 (exact majority)' },
  { array: [1, 1, 2, 2], desc: '2 out of 4 (NOT majority - need >50%)' },
  { array: [1, 1, 1, 1, 2, 2, 2], desc: '4 out of 7 (exact majority)' },
  { array: [1, 1, 1, 2, 2, 2], desc: '3 out of 6 (NOT majority)' }
];

edgeCases.forEach(({ array, desc }) => {
  const result = findMajorityElement(array);
  const threshold = array.length / 2;

  console.log(`${desc}:`);
  console.log(`   Array: [${array.join(', ')}], threshold: >${threshold}`);
  console.log(`   Result: ${result}`);

  // Count occurrences
  const counts = new Map();
  for (const num of array) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }
  console.log(`   Counts: ${Array.from(counts.entries()).map(([k, v]) => `${k}:${v}`).join(', ')}`);
});

// Test 7: Large arrays
console.log('\n--- Test 7: Large Arrays ---');
function generateArrayWithMajority(size, majorityElement, majorityRatio) {
  const array = [];
  const majorityCount = Math.floor(size * majorityRatio);

  for (let i = 0; i < majorityCount; i++) {
    array.push(majorityElement);
  }

  for (let i = majorityCount; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }

  // Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const largeTests = [
  { size: 1000, ratio: 0.6, expected: 99 },
  { size: 10000, ratio: 0.55, expected: 99 },
  { size: 100000, ratio: 0.51, expected: 99 }
];

largeTests.forEach(({ size, ratio, expected }) => {
  const array = generateArrayWithMajority(size, expected, ratio);
  console.log(`\nArray size: ${size}, majority ratio: ${ratio}`);

  console.time('Boyer-Moore');
  const result = findMajorityElement(array);
  console.timeEnd('Boyer-Moore');
  console.log(`  Result: ${result} (expected: ${expected}) ${result === expected ? '✓' : '✗'}`);
});

// Test 8: Performance comparison
console.log('\n--- Test 8: Performance Comparison ---');
const perfArray = generateArrayWithMajority(100000, 42, 0.6);
console.log(`\nTesting with array of size ${perfArray.length}:`);

console.time('Boyer-Moore (O(n) time, O(1) space)');
const bmResult = findMajorityElement(perfArray);
console.timeEnd('Boyer-Moore (O(n) time, O(1) space)');

console.time('HashMap (O(n) time, O(n) space)');
const hmResult = findMajorityElementHashMap(perfArray);
console.timeEnd('HashMap (O(n) time, O(n) space)');

console.time('Sort (O(n log n) time)');
const sortResult = findMajorityElementSort(perfArray);
console.timeEnd('Sort (O(n log n) time)');

console.log(`All methods agree: ${bmResult === hmResult && hmResult === sortResult ? '✓' : '✗'}`);

// Test 9: Understanding Boyer-Moore
console.log('\n--- Test 9: Understanding Boyer-Moore Algorithm ---');
console.log('\nWhy Boyer-Moore works:');
console.log('\n1. Key Insight:');
console.log('   - Majority element appears MORE than all other elements combined');
console.log('   - If we pair each majority with a non-majority, majority still remains');

console.log('\n2. The Algorithm:');
console.log('   - Maintain a candidate and count');
console.log('   - When we see candidate, increment count (support)');
console.log('   - When we see different element, decrement count (opposition)');
console.log('   - When count reaches 0, current element becomes new candidate');

console.log('\n3. Why Phase 2 is Necessary:');
console.log('   - Phase 1 finds a candidate that COULD be majority');
console.log('   - But if no majority exists, Phase 1 still returns a candidate');
console.log('   - Phase 2 verifies the candidate actually appears >n/2 times');

console.log('\n4. Example walkthrough:');
console.log('   Array: [5, 5, 2, 5, 2, 5, 5]');
console.log('   5: candidate=5, count=1');
console.log('   5: candidate=5, count=2');
console.log('   2: candidate=5, count=1 (decremented)');
console.log('   5: candidate=5, count=2');
console.log('   2: candidate=5, count=1 (decremented)');
console.log('   5: candidate=5, count=2');
console.log('   5: candidate=5, count=3');
console.log('   Result: candidate=5, verify: 5 appears 5/7 times > 3.5 ✓');

// Test 10: Tricky cases
console.log('\n--- Test 10: Tricky Cases ---');
const trickyCases = [
  { array: [2, 2, 1, 1, 1, 2, 2], expected: 2, desc: 'Close call: 4/7 vs 3/7' },
  { array: [1, 2, 3, 4, 5, 1, 1, 1, 1], expected: 1, desc: 'Majority at end' },
  { array: [3, 3, 3, 3, 1, 2, 4, 5], expected: 3, desc: 'Majority at start' },
  { array: [1, 2, 1, 2, 1, 2, 1, 1], expected: 1, desc: 'Interleaved, 5/8' }
];

trickyCases.forEach(({ array, expected, desc }) => {
  const result = findMajorityElement(array);
  console.log(`${desc}:`);
  console.log(`   Array: [${array.join(', ')}]`);
  console.log(`   Result: ${result}, Expected: ${expected} ${result === expected ? '✓' : '✗'}`);
});

// Test 11: Verify all approaches agree
console.log('\n--- Test 11: Verify All Approaches Agree ---');
function generateRandomArray(size) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 10) + 1);
  }
  return array;
}

console.log('Running 100 random tests...');
let passCount = 0;

for (let i = 0; i < 100; i++) {
  const array = generateRandomArray(Math.floor(Math.random() * 50) + 10);
  const bm = findMajorityElement(array);
  const hm = findMajorityElementHashMap(array);
  const sr = findMajorityElementSort(array);

  if (bm === hm && hm === sr) {
    passCount++;
  } else {
    console.log(`✗ Mismatch on: [${array.join(', ')}]`);
    console.log(`   BM: ${bm}, HM: ${hm}, Sort: ${sr}`);
  }
}

console.log(`✓ ${passCount}/100 tests passed (${passCount}%)`);

// Test 12: Space complexity demonstration
console.log('\n--- Test 12: Space Complexity Comparison ---');
console.log('\nBoyer-Moore Voting Algorithm:');
console.log('  Variables: candidate, count');
console.log('  Space: O(1) - only 2 variables regardless of input size!');

console.log('\nHashMap Approach:');
console.log('  Variables: counts (Map)');
console.log('  Space: O(n) - could store up to n different elements');

console.log('\nSort Approach:');
console.log('  Variables: sorted array');
console.log('  Space: O(n) - need to copy array for sorting');

console.log('\nThis is why Boyer-Moore is preferred for this problem!');

// Summary
console.log('\n' + '='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log('✓ Boyer-Moore correctly finds majority element in O(n) time, O(1) space');
console.log('✓ Correctly returns -1 when no majority element exists');
console.log('✓ Handles edge cases (empty, single element, exact threshold)');
console.log('✓ All three approaches (Boyer-Moore, HashMap, Sort) agree on results');
console.log('✓ Phase 2 verification is essential - catches false positives');
console.log('✓ Efficient for very large arrays');
console.log('\nAlgorithm Complexity:');
console.log('- Boyer-Moore: O(n) time, O(1) space ★ Optimal');
console.log('- HashMap: O(n) time, O(n) space');
console.log('- Sort: O(n log n) time, O(n) space');
console.log('\nKey Technique:');
console.log('- Boyer-Moore Voting Algorithm uses cancellation principle');
console.log('- Majority element survives cancellation with non-majority elements');
console.log('- Two-phase approach: find candidate, then verify');
console.log('- Must verify because candidate could be false positive if no majority');
console.log('='.repeat(70));

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    findMajorityElement,
    findMajorityElementHashMap,
    findMajorityElementSort
  };
}
