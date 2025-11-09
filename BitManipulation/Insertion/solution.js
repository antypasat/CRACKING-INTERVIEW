// 5.1 Insertion - Insert M into N at positions i to j

/**
 * Insert M into N from bit i to bit j
 * @param {number} n - Target number
 * @param {number} m - Number to insert
 * @param {number} i - Start bit position
 * @param {number} j - End bit position
 */
function insertBits(n, m, i, j) {
  // Create mask to clear bits i through j in n
  // 1. All 1s except j+1 through 31: ~0 << (j+1)
  // 2. All 1s from 0 to i-1: (1 << i) - 1
  const allOnes = ~0;
  const left = allOnes << (j + 1);
  const right = (1 << i) - 1;
  const mask = left | right;

  // Clear bits i through j in n, then insert m
  const nCleared = n & mask;
  const mShifted = m << i;

  return nCleared | mShifted;
}

// Helper: Convert to binary string
function toBinary(n, bits = 32) {
  return n.toString(2).padStart(bits, '0');
}

// Tests
console.log('='.repeat(70));
console.log('5.1 INSERTION');
console.log('='.repeat(70));

const n = 0b10000000000; // 1024 (binary: 10000000000)
const m = 0b10011;       // 19 (binary: 10011)
const i = 2;
const j = 6;

console.log(`N = ${n} (binary: ${toBinary(n, 11)})`);
console.log(`M = ${m} (binary: ${toBinary(m, 5)})`);
console.log(`Insert M into N from bit ${i} to bit ${j}\n`);

const result = insertBits(n, m, i, j);
console.log(`Result = ${result} (binary: ${toBinary(result, 11)})`);
console.log(`Expected: 10001001100\n`);

// More tests
console.log('Test 2:');
const n2 = 0b11111111111;
const m2 = 0b101;
const result2 = insertBits(n2, m2, 2, 4);
console.log(`Insert ${toBinary(m2, 3)} into ${toBinary(n2, 11)} at [2,4]`);
console.log(`Result: ${toBinary(result2, 11)} ✓\n`);

console.log('Complexity: O(1) time, O(1) space');
console.log('='.repeat(70));
