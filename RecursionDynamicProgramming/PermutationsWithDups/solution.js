/**
 * Permutations with Duplicates
 * Compute all permutations of a string where characters may repeat
 * Ensure no duplicate permutations in output
 */

/**
 * Approach 1: Build permutations with frequency map
 * Use character frequency map to avoid duplicates
 * Time: O(n!), Space: O(n)
 */
function getPermutationsWithDups(str) {
  if (str === null) return null;
  if (str.length === 0) return [''];

  // Build frequency map
  const freqMap = new Map();
  for (const char of str) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  const result = [];
  const remaining = str.length;
  permuteWithMap(freqMap, '', remaining, result);
  return result;
}

function permuteWithMap(freqMap, prefix, remaining, result) {
  // Base case: used all characters
  if (remaining === 0) {
    result.push(prefix);
    return;
  }

  // Try each available character
  for (const [char, count] of freqMap.entries()) {
    if (count > 0) {
      // Use this character
      freqMap.set(char, count - 1);
      permuteWithMap(freqMap, prefix + char, remaining - 1, result);
      // Backtrack
      freqMap.set(char, count);
    }
  }
}

/**
 * Approach 2: Sort and skip duplicates
 * Sort the string first, then skip duplicate characters at same level
 * Time: O(n! + n log n), Space: O(n)
 */
function getPermutationsWithDups2(str) {
  if (str === null) return null;
  if (str.length === 0) return [''];

  const result = [];
  const chars = str.split('').sort();
  const used = new Array(chars.length).fill(false);

  function backtrack(current) {
    if (current.length === chars.length) {
      result.push(current);
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      // Skip if already used
      if (used[i]) continue;

      // Skip duplicates: if current char equals previous char
      // and previous char hasn't been used yet
      // This ensures we only use duplicates in order
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) {
        continue;
      }

      used[i] = true;
      backtrack(current + chars[i]);
      used[i] = false;
    }
  }

  backtrack('');
  return result;
}

/**
 * Approach 3: Using Set to filter duplicates (less efficient)
 * Generate all permutations then filter duplicates using Set
 * Time: O(n! * n), Space: O(n!)
 */
function getPermutationsWithDups3(str) {
  if (str === null) return null;
  if (str.length === 0) return [''];

  const result = new Set();
  const chars = str.split('');

  function backtrack(start) {
    if (start === chars.length) {
      result.add(chars.join(''));
      return;
    }

    for (let i = start; i < chars.length; i++) {
      [chars[start], chars[i]] = [chars[i], chars[start]];
      backtrack(start + 1);
      [chars[start], chars[i]] = [chars[i], chars[start]];
    }
  }

  backtrack(0);
  return Array.from(result);
}

/**
 * Helper function to calculate expected number of permutations
 * Formula: n! / (c1! * c2! * ... * ck!)
 * where c1, c2, ..., ck are frequencies of each unique character
 */
function calculateExpectedPermutations(str) {
  const freqMap = new Map();
  for (const char of str) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  let numerator = 1;
  for (let i = 1; i <= str.length; i++) {
    numerator *= i;
  }

  let denominator = 1;
  for (const count of freqMap.values()) {
    for (let i = 1; i <= count; i++) {
      denominator *= i;
    }
  }

  return numerator / denominator;
}

/**
 * Helper function to verify permutations
 */
function verifyPermutations(str, permutations) {
  const expected = calculateExpectedPermutations(str);
  const uniquePerms = new Set(permutations);

  return {
    totalCount: permutations.length,
    uniqueCount: uniquePerms.size,
    expectedCount: expected,
    hasCorrectCount: permutations.length === expected,
    allUnique: permutations.length === uniquePerms.size,
    allCorrectLength: permutations.every(p => p.length === str.length),
    allContainSameChars: permutations.every(p => hasSameChars(p, str))
  };
}

function hasSameChars(str1, str2) {
  if (str1.length !== str2.length) return false;
  const sorted1 = str1.split('').sort().join('');
  const sorted2 = str2.split('').sort().join('');
  return sorted1 === sorted2;
}

// Test cases
console.log('=== Permutations with Duplicates Tests ===\n');

console.log('Test 1: "aab" (Approach 1 - Frequency Map)');
console.log('-------------------');
const result1 = getPermutationsWithDups('aab');
console.log('Permutations:', result1);
console.log('Count:', result1.length, '(expected: 3)');
console.log('Expected: ["aab", "aba", "baa"]');
const verify1 = verifyPermutations('aab', result1);
console.log('All unique:', verify1.allUnique ? 'PASS' : 'FAIL');
console.log('Correct count:', verify1.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 2: "aab" (Approach 2 - Sort and Skip)');
console.log('-------------------');
const result2 = getPermutationsWithDups2('aab');
console.log('Permutations:', result2);
console.log('Count:', result2.length, '(expected: 3)');
const verify2 = verifyPermutations('aab', result2);
console.log('All unique:', verify2.allUnique ? 'PASS' : 'FAIL');
console.log('Correct count:', verify2.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 3: "aab" (Approach 3 - Set filtering)');
console.log('-------------------');
const result3 = getPermutationsWithDups3('aab');
console.log('Permutations:', result3);
console.log('Count:', result3.length, '(expected: 3)');
const verify3 = verifyPermutations('aab', result3);
console.log('All unique:', verify3.allUnique ? 'PASS' : 'FAIL');
console.log('Correct count:', verify3.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== More Complex Examples ===\n');

console.log('Test 4: "aabc"');
const result4 = getPermutationsWithDups('aabc');
console.log('First 10 permutations:', result4.slice(0, 10));
console.log('Total count:', result4.length);
console.log('Expected count:', calculateExpectedPermutations('aabc'), '(4!/(2!*1!*1!) = 12)');
const verify4 = verifyPermutations('aabc', result4);
console.log('Verification:', verify4.allUnique && verify4.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 5: "aabb"');
const result5 = getPermutationsWithDups('aabb');
console.log('Permutations:', result5);
console.log('Total count:', result5.length);
console.log('Expected count:', calculateExpectedPermutations('aabb'), '(4!/(2!*2!) = 6)');
const verify5 = verifyPermutations('aabb', result5);
console.log('Verification:', verify5.allUnique && verify5.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 6: "aaaa" (all same)');
const result6 = getPermutationsWithDups('aaaa');
console.log('Permutations:', result6);
console.log('Total count:', result6.length);
console.log('Expected count:', calculateExpectedPermutations('aaaa'), '(4!/4! = 1)');
const verify6 = verifyPermutations('aaaa', result6);
console.log('Verification:', verify6.allUnique && verify6.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 7: "abc" (no duplicates)');
const result7 = getPermutationsWithDups('abc');
console.log('Permutations:', result7);
console.log('Total count:', result7.length);
console.log('Expected count:', calculateExpectedPermutations('abc'), '(3! = 6)');
const verify7 = verifyPermutations('abc', result7);
console.log('Verification:', verify7.allUnique && verify7.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== Edge Cases ===\n');

console.log('Test 8: Empty string');
const result8 = getPermutationsWithDups('');
console.log('Result:', result8);
console.log('Expected: [""]');
console.log('Status:', result8.length === 1 && result8[0] === '' ? 'PASS' : 'FAIL');

console.log('\nTest 9: Single character');
const result9 = getPermutationsWithDups('a');
console.log('Result:', result9);
console.log('Expected: ["a"]');
console.log('Status:', result9.length === 1 && result9[0] === 'a' ? 'PASS' : 'FAIL');

console.log('\nTest 10: "aa" (two same)');
const result10 = getPermutationsWithDups('aa');
console.log('Result:', result10);
console.log('Expected: ["aa"]');
console.log('Status:', result10.length === 1 && result10[0] === 'aa' ? 'PASS' : 'FAIL');

console.log('\n=== Formula Verification ===\n');

function testFormula(str) {
  const expected = calculateExpectedPermutations(str);
  const actual = getPermutationsWithDups(str).length;
  console.log(`"${str}": Expected ${expected}, Got ${actual} - ${expected === actual ? 'PASS' : 'FAIL'}`);
}

console.log('Testing formula n! / (c1! * c2! * ... * ck!):');
testFormula('ab');      // 2!/1!*1! = 2
testFormula('aab');     // 3!/2!*1! = 3
testFormula('aabc');    // 4!/2!*1!*1! = 12
testFormula('aabb');    // 4!/2!*2! = 6
testFormula('aaab');    // 4!/3!*1! = 4
testFormula('aaabbc');  // 6!/3!*2!*1! = 60

console.log('\n=== Performance Comparison ===\n');

function measurePerformance(str, approach) {
  const start = Date.now();
  let result;
  switch (approach) {
    case 1: result = getPermutationsWithDups(str); break;
    case 2: result = getPermutationsWithDups2(str); break;
    case 3: result = getPermutationsWithDups3(str); break;
  }
  const end = Date.now();
  return { count: result.length, time: end - start };
}

console.log('Performance for "aabbcc":');
for (let i = 1; i <= 3; i++) {
  const perf = measurePerformance('aabbcc', i);
  console.log(`  Approach ${i}: ${perf.count} permutations in ${perf.time}ms`);
}

console.log('\n=== Detailed Verification ===\n');

function detailedVerify(str) {
  const result = getPermutationsWithDups(str);
  const verify = verifyPermutations(str, result);

  console.log(`String: "${str}"`);
  console.log('Character frequencies:');
  const freqMap = new Map();
  for (const char of str) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  for (const [char, count] of freqMap.entries()) {
    console.log(`  '${char}': ${count}`);
  }
  console.log('Verification:');
  console.log(`  Total: ${verify.totalCount}`);
  console.log(`  Unique: ${verify.uniqueCount}`);
  console.log(`  Expected: ${verify.expectedCount}`);
  console.log(`  Status: ${
    verify.hasCorrectCount && verify.allUnique &&
    verify.allCorrectLength && verify.allContainSameChars ? 'PASS' : 'FAIL'
  }\n`);
}

['aab', 'aabb', 'aabc', 'aaabbc'].forEach(str => detailedVerify(str));

module.exports = {
  getPermutationsWithDups,
  getPermutationsWithDups2,
  getPermutationsWithDups3,
  calculateExpectedPermutations,
  verifyPermutations
};
