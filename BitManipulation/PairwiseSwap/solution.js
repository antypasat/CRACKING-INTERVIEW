// 5.7 Pairwise Swap - Swap odd and even bits

/**
 * Swap odd and even bits in integer
 * Bit 0 <-> Bit 1, Bit 2 <-> Bit 3, etc.
 *
 * Strategy:
 * 1. Extract odd bits and shift right
 * 2. Extract even bits and shift left
 * 3. Merge them
 */
function swapOddEvenBits(n) {
  // 0xaaaaaaaa = 10101010... (odd bits)
  // 0x55555555 = 01010101... (even bits)

  const oddMask = 0xaaaaaaaa;
  const evenMask = 0x55555555;

  // Get odd bits and shift right
  const oddBits = (n & oddMask) >>> 1;

  // Get even bits and shift left
  const evenBits = (n & evenMask) << 1;

  // Merge
  return oddBits | evenBits;
}

// Tests
console.log('='.repeat(70));
console.log('5.7 PAIRWISE SWAP');
console.log('='.repeat(70));

const toBinary = (n) => n.toString(2).padStart(16, '0');

console.log('Test 1: Simple example');
const n1 = 0b10110; // 22
console.log(`Input:  ${toBinary(n1)}`);
const result1 = swapOddEvenBits(n1);
console.log(`Output: ${toBinary(result1)}`);
console.log(`Decimal: ${n1} -> ${result1}\n`);

console.log('Test 2: Alternating bits');
const n2 = 0b10101010; // 170
console.log(`Input:  ${toBinary(n2)}`);
const result2 = swapOddEvenBits(n2);
console.log(`Output: ${toBinary(result2)}`);
console.log(`Should swap to: 01010101 ✓\n`);

console.log('Test 3: All 1s');
const n3 = 0b11111111;
console.log(`Input:  ${toBinary(n3)}`);
const result3 = swapOddEvenBits(n3);
console.log(`Output: ${toBinary(result3)}`);
console.log(`All 1s remain all 1s ✓\n`);

console.log('Test 4: Mixed pattern');
const n4 = 0b11001100;
console.log(`Input:  ${toBinary(n4)}`);
const result4 = swapOddEvenBits(n4);
console.log(`Output: ${toBinary(result4)}`);
console.log();

console.log('How it works:');
console.log('0xaaaaaaaa = 10101010101010101010101010101010 (odd bits)');
console.log('0x55555555 = 01010101010101010101010101010101 (even bits)');
console.log();
console.log('1. AND with odd mask, shift right');
console.log('2. AND with even mask, shift left');
console.log('3. OR results together');
console.log();

console.log('Complexity: O(1) - just bit operations');
console.log('='.repeat(70));
