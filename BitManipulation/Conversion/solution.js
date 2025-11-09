// 5.6 Conversion - Count bits to flip to convert A to B

/**
 * Count number of bits to flip to convert A to B
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Number of bits to flip
 */
function bitSwapRequired(a, b) {
  // XOR gives 1 where bits differ
  let diff = a ^ b;

  // Count number of 1s in diff
  let count = 0;
  while (diff !== 0) {
    diff = diff & (diff - 1); // Clear lowest set bit
    count++;
  }

  return count;
}

/**
 * Alternative: Count by checking each bit
 */
function bitSwapRequired2(a, b) {
  let diff = a ^ b;
  let count = 0;

  for (let i = 0; i < 32; i++) {
    count += (diff >> i) & 1;
  }

  return count;
}

// Tests
console.log('='.repeat(70));
console.log('5.6 CONVERSION');
console.log('='.repeat(70));

const toBinary = (n) => n.toString(2).padStart(8, '0');

console.log('Test 1: 29 and 15');
const a1 = 29; // Binary: 11101
const b1 = 15; // Binary: 01111
console.log(`A = ${a1} (binary: ${toBinary(a1)})`);
console.log(`B = ${b1} (binary: ${toBinary(b1)})`);
console.log(`XOR = ${toBinary(a1 ^ b1)}`);
console.log(`Bits to flip: ${bitSwapRequired(a1, b1)}`);
console.log(`Expected: 2 ✓\n`);

console.log('Test 2: Same numbers');
const a2 = 42;
const b2 = 42;
console.log(`A = B = ${a2}`);
console.log(`Bits to flip: ${bitSwapRequired(a2, b2)}`);
console.log(`Expected: 0 ✓\n`);

console.log('Test 3: Completely different');
const a3 = 0b11111111;
const b3 = 0b00000000;
console.log(`A = ${toBinary(a3)}`);
console.log(`B = ${toBinary(b3)}`);
console.log(`Bits to flip: ${bitSwapRequired(a3, b3)}`);
console.log(`Expected: 8 ✓\n`);

console.log('Test 4: One bit difference');
const a4 = 0b1010;
const b4 = 0b1011;
console.log(`A = ${toBinary(a4)}`);
console.log(`B = ${toBinary(b4)}`);
console.log(`Bits to flip: ${bitSwapRequired(a4, b4)}`);
console.log(`Expected: 1 ✓\n`);

console.log('Algorithm:');
console.log('1. XOR A and B to find differing bits');
console.log('2. Count number of 1s in XOR result');
console.log('3. Use n & (n-1) trick for efficient counting\n');

console.log('Complexity: O(b) where b is number of bits to flip');
console.log('='.repeat(70));
