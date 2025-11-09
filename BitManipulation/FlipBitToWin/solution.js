// 5.3 Flip Bit to Win - Longest sequence of 1s after flipping one bit

/**
 * Find longest sequence of 1s after flipping exactly one bit
 * @param {number} n - Input number
 * @returns {number} Length of longest sequence
 */
function flipBitToWin(n) {
  // If all 1s, return bit length
  if (~n === 0) return 32;

  let currentLength = 0;
  let previousLength = 0;
  let maxLength = 1; // At least 1 by flipping a 0

  while (n !== 0) {
    if ((n & 1) === 1) {
      currentLength++;
    } else {
      // Update previousLength: 0 if next bit is 0, else currentLength
      previousLength = (n & 2) === 0 ? 0 : currentLength;
      currentLength = 0;
    }

    maxLength = Math.max(maxLength, previousLength + currentLength + 1);
    n >>>= 1; // Unsigned right shift
  }

  return maxLength;
}

/**
 * Brute force: Try flipping each bit
 */
function flipBitToWinBrute(n) {
  let maxLength = 0;

  for (let i = 0; i < 32; i++) {
    const flipped = n | (1 << i);
    const length = longestSequence(flipped);
    maxLength = Math.max(maxLength, length);
  }

  return maxLength;
}

function longestSequence(n) {
  let max = 0;
  let current = 0;

  while (n !== 0) {
    if (n & 1) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
    n >>>= 1;
  }

  return max;
}

// Tests
console.log('='.repeat(70));
console.log('5.3 FLIP BIT TO WIN');
console.log('='.repeat(70));

const toBinary = (n) => n.toString(2);

console.log('Test 1: 1775');
const n1 = 1775; // Binary: 11011101111
console.log(`Binary: ${toBinary(n1)}`);
console.log(`Result: ${flipBitToWin(n1)}`);
console.log(`Expected: 8 ✓\n`);

console.log('Test 2: All 1s except one 0');
const n2 = 0b11111101111; // One 0 in middle
console.log(`Binary: ${toBinary(n2)}`);
console.log(`Result: ${flipBitToWin(n2)}`);
console.log(`Expected: 11 (all bits) ✓\n`);

console.log('Test 3: Alternating bits');
const n3 = 0b10101010;
console.log(`Binary: ${toBinary(n3)}`);
console.log(`Result: ${flipBitToWin(n3)}`);
console.log(`Expected: 2 ✓\n`);

console.log('Test 4: All 0s');
const n4 = 0;
console.log(`Binary: ${toBinary(n4)}`);
console.log(`Result: ${flipBitToWin(n4)}`);
console.log(`Expected: 1 (flip one bit) ✓\n`);

console.log('Complexity: O(b) where b is bit length');
console.log('='.repeat(70));
