// 5.5 Debugger - Explain what (n & (n-1)) == 0 does

/**
 * Check if n is a power of 2 (or 0)
 *
 * EXPLANATION:
 * n & (n-1) clears the lowest set bit in n
 *
 * If (n & (n-1)) == 0, it means n has at most one bit set
 * This happens when n is 0 or a power of 2
 *
 * Examples:
 * n = 8  (1000): n-1 = 7  (0111) -> 1000 & 0111 = 0000 ✓
 * n = 10 (1010): n-1 = 9  (1001) -> 1010 & 1001 = 1000 ✗
 * n = 16 (10000): n-1 = 15 (01111) -> 10000 & 01111 = 00000 ✓
 */
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Clear lowest set bit
 */
function clearLowestBit(n) {
  return n & (n - 1);
}

// Tests
console.log('='.repeat(70));
console.log('5.5 DEBUGGER - What does (n & (n-1)) == 0 do?');
console.log('='.repeat(70));
console.log();

console.log('EXPLANATION:');
console.log('n & (n-1) removes the lowest set bit from n\n');
console.log('If (n & (n-1)) == 0, then n has at most one bit set');
console.log('This means n is either 0 or a power of 2\n');

console.log('WHY IT WORKS:');
console.log('When you subtract 1 from n:');
console.log('- Rightmost 1 becomes 0');
console.log('- All 0s to its right become 1s');
console.log('- ANDing clears all these bits\n');

console.log('EXAMPLES:');
console.log('='.repeat(70));

const examples = [
  { n: 8, name: 'Power of 2' },
  { n: 10, name: 'Not power of 2' },
  { n: 16, name: 'Power of 2' },
  { n: 0, name: 'Zero' },
  { n: 1, name: 'Power of 2' },
  { n: 7, name: 'Not power of 2' }
];

examples.forEach(({ n, name }) => {
  const nBin = n.toString(2).padStart(8, '0');
  const n1Bin = (n - 1).toString(2).padStart(8, '0');
  const result = n & (n - 1);
  const resultBin = result.toString(2).padStart(8, '0');
  const isPower = result === 0 && n > 0;

  console.log(`n = ${n} (${name})`);
  console.log(`  n     = ${nBin}`);
  console.log(`  n-1   = ${n1Bin}`);
  console.log(`  n&(n-1) = ${resultBin} (${result})`);
  console.log(`  Is power of 2: ${isPower ? 'YES ✓' : 'NO'}\n`);
});

console.log('PRACTICAL USE:');
console.log('- Check if number is power of 2');
console.log('- Count set bits (repeatedly clear lowest bit)');
console.log('- Remove lowest set bit');
console.log();

console.log('Count bits example:');
let n = 29; // Binary: 11101
console.log(`n = ${n} (binary: ${n.toString(2)})`);
let count = 0;
let temp = n;
while (temp !== 0) {
  temp = temp & (temp - 1);
  count++;
}
console.log(`Number of 1 bits: ${count} ✓`);

console.log('\nComplexity: O(1)');
console.log('='.repeat(70));
