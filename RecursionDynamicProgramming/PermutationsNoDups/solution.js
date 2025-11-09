/**
 * Permutations without Duplicates
 * Compute all permutations of a string of unique characters
 */

/**
 * Approach 1: Building from permutations of first n-1 characters
 * For each permutation of first n-1 chars, insert nth char at every position
 * Time: O(n! * n), Space: O(n!)
 */
function getPermutations(str) {
  if (str === null) return null;
  if (str.length === 0) return [''];

  const permutations = [];
  const first = str[0];
  const remainder = str.slice(1);
  const words = getPermutations(remainder);

  for (const word of words) {
    for (let i = 0; i <= word.length; i++) {
      const perm = word.slice(0, i) + first + word.slice(i);
      permutations.push(perm);
    }
  }

  return permutations;
}

/**
 * Approach 2: Building from remaining characters
 * Choose each character as first, then permute the rest
 * Time: O(n!), Space: O(n!)
 */
function getPermutations2(str) {
  const result = [];

  function permute(prefix, remaining) {
    if (remaining.length === 0) {
      result.push(prefix);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const before = remaining.slice(0, i);
      const after = remaining.slice(i + 1);
      const char = remaining[i];
      permute(prefix + char, before + after);
    }
  }

  permute('', str);
  return result;
}

/**
 * Approach 3: Using swap-based backtracking
 * Swap each character to the front, permute the rest, then swap back
 * Time: O(n!), Space: O(n) for recursion
 */
function getPermutations3(str) {
  const result = [];
  const chars = str.split('');

  function backtrack(start) {
    if (start === chars.length) {
      result.push(chars.join(''));
      return;
    }

    for (let i = start; i < chars.length; i++) {
      // Swap
      [chars[start], chars[i]] = [chars[i], chars[start]];
      // Recurse
      backtrack(start + 1);
      // Swap back (backtrack)
      [chars[start], chars[i]] = [chars[i], chars[start]];
    }
  }

  backtrack(0);
  return result;
}

/**
 * Approach 4: Using array of booleans to track used characters
 * Build permutation character by character
 * Time: O(n!), Space: O(n)
 */
function getPermutations4(str) {
  const result = [];
  const chars = str.split('');
  const used = new Array(chars.length).fill(false);

  function backtrack(current) {
    if (current.length === chars.length) {
      result.push(current);
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      backtrack(current + chars[i]);
      used[i] = false;
    }
  }

  backtrack('');
  return result;
}

/**
 * Helper function to verify all permutations are unique and complete
 */
function verifyPermutations(str, permutations) {
  const n = str.length;
  const expectedCount = factorial(n);
  const uniquePerms = new Set(permutations);

  const results = {
    totalCount: permutations.length,
    uniqueCount: uniquePerms.size,
    expectedCount: expectedCount,
    hasCorrectCount: permutations.length === expectedCount,
    allUnique: permutations.length === uniquePerms.size,
    allCorrectLength: permutations.every(p => p.length === n),
    allContainSameChars: permutations.every(p => hasSameChars(p, str))
  };

  return results;
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function hasSameChars(str1, str2) {
  if (str1.length !== str2.length) return false;
  const sorted1 = str1.split('').sort().join('');
  const sorted2 = str2.split('').sort().join('');
  return sorted1 === sorted2;
}

// Test cases
console.log('=== Permutations without Duplicates Tests ===\n');

console.log('Test 1: "abc" (Approach 1 - Insert character)');
console.log('-------------------');
const result1 = getPermutations('abc');
console.log('Permutations:', result1);
console.log('Count:', result1.length, '(expected: 6)');
const verify1 = verifyPermutations('abc', result1);
console.log('Verification:', verify1.allUnique && verify1.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 2: "abc" (Approach 2 - Prefix building)');
console.log('-------------------');
const result2 = getPermutations2('abc');
console.log('Permutations:', result2);
console.log('Count:', result2.length, '(expected: 6)');
const verify2 = verifyPermutations('abc', result2);
console.log('Verification:', verify2.allUnique && verify2.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 3: "abc" (Approach 3 - Swap backtracking)');
console.log('-------------------');
const result3 = getPermutations3('abc');
console.log('Permutations:', result3);
console.log('Count:', result3.length, '(expected: 6)');
const verify3 = verifyPermutations('abc', result3);
console.log('Verification:', verify3.allUnique && verify3.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 4: "abc" (Approach 4 - Boolean tracking)');
console.log('-------------------');
const result4 = getPermutations4('abc');
console.log('Permutations:', result4);
console.log('Count:', result4.length, '(expected: 6)');
const verify4 = verifyPermutations('abc', result4);
console.log('Verification:', verify4.allUnique && verify4.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== Edge Cases ===\n');

console.log('Test 5: Empty string');
const result5 = getPermutations('');
console.log('Result:', result5);
console.log('Expected: [""]');
console.log('Status:', result5.length === 1 && result5[0] === '' ? 'PASS' : 'FAIL');

console.log('\nTest 6: Single character');
const result6 = getPermutations('a');
console.log('Result:', result6);
console.log('Expected: ["a"]');
console.log('Status:', result6.length === 1 && result6[0] === 'a' ? 'PASS' : 'FAIL');

console.log('\nTest 7: Two characters');
const result7 = getPermutations('ab');
console.log('Result:', result7);
console.log('Expected count: 2');
console.log('Status:', result7.length === 2 ? 'PASS' : 'FAIL');

console.log('\n=== Larger Examples ===\n');

console.log('Test 8: "abcd" (4 characters)');
const result8 = getPermutations('abcd');
console.log('First 10 permutations:', result8.slice(0, 10));
console.log('Total count:', result8.length, '(expected: 24)');
const verify8 = verifyPermutations('abcd', result8);
console.log('All unique:', verify8.allUnique ? 'PASS' : 'FAIL');
console.log('Correct count:', verify8.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\nTest 9: "12345" (5 characters)');
const result9 = getPermutations('12345');
console.log('First 10 permutations:', result9.slice(0, 10));
console.log('Total count:', result9.length, '(expected: 120)');
const verify9 = verifyPermutations('12345', result9);
console.log('All unique:', verify9.allUnique ? 'PASS' : 'FAIL');
console.log('Correct count:', verify9.hasCorrectCount ? 'PASS' : 'FAIL');

console.log('\n=== Performance Comparison ===\n');

function measurePerformance(str, approach) {
  const start = Date.now();
  let result;
  switch (approach) {
    case 1: result = getPermutations(str); break;
    case 2: result = getPermutations2(str); break;
    case 3: result = getPermutations3(str); break;
    case 4: result = getPermutations4(str); break;
  }
  const end = Date.now();
  return { count: result.length, time: end - start };
}

console.log('Performance for "abcdef" (6 chars, 720 permutations):');
for (let i = 1; i <= 4; i++) {
  const perf = measurePerformance('abcdef', i);
  console.log(`  Approach ${i}: ${perf.count} permutations in ${perf.time}ms`);
}

console.log('\n=== Detailed Verification ===\n');

function detailedVerify(str) {
  const result = getPermutations(str);
  const verify = verifyPermutations(str, result);

  console.log(`String: "${str}"`);
  console.log('Verification Details:');
  console.log(`  Total count: ${verify.totalCount}`);
  console.log(`  Unique count: ${verify.uniqueCount}`);
  console.log(`  Expected count: ${verify.expectedCount}`);
  console.log(`  Has correct count: ${verify.hasCorrectCount ? 'PASS' : 'FAIL'}`);
  console.log(`  All unique: ${verify.allUnique ? 'PASS' : 'FAIL'}`);
  console.log(`  All correct length: ${verify.allCorrectLength ? 'PASS' : 'FAIL'}`);
  console.log(`  All contain same chars: ${verify.allContainSameChars ? 'PASS' : 'FAIL'}`);
  console.log(`  Overall: ${
    verify.hasCorrectCount && verify.allUnique &&
    verify.allCorrectLength && verify.allContainSameChars ? 'PASS' : 'FAIL'
  }\n`);
}

['ab', 'abc', 'abcd'].forEach(str => detailedVerify(str));

module.exports = {
  getPermutations,
  getPermutations2,
  getPermutations3,
  getPermutations4,
  verifyPermutations
};
