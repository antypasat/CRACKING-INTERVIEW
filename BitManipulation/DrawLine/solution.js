// 5.8 Draw Line - Draw horizontal line on monochrome screen

/**
 * Draw horizontal line from (x1, y) to (x2, y) on byte array screen
 * @param {Uint8Array} screen - Screen buffer (8 pixels per byte)
 * @param {number} width - Screen width in pixels (divisible by 8)
 * @param {number} x1 - Start x coordinate
 * @param {number} x2 - End x coordinate
 * @param {number} y - Y coordinate
 */
function drawLine(screen, width, x1, x2, y) {
  const startOffset = Math.floor(x1 / 8);
  const firstFullByte = Math.ceil(x1 / 8);
  const endOffset = Math.floor(x2 / 8);
  const lastFullByte = Math.floor(x2 / 8) - 1;

  const yOffset = (width / 8) * y;

  // Draw start byte (partial)
  const endBit = (startOffset === endOffset) ? (x2 % 8) : 7;
  for (let i = x1 % 8; i <= endBit; i++) {
    screen[yOffset + startOffset] |= (1 << (7 - i));
  }

  // Draw full bytes
  for (let i = firstFullByte; i <= lastFullByte; i++) {
    screen[yOffset + i] = 0xFF;
  }

  // Draw end byte (partial) if different from start
  if (startOffset !== endOffset) {
    for (let i = 0; i <= x2 % 8; i++) {
      screen[yOffset + endOffset] |= (1 << (7 - i));
    }
  }
}

/**
 * Alternative optimized version
 */
function drawLineOptimized(screen, width, x1, x2, y) {
  const startByte = Math.floor(x1 / 8);
  const endByte = Math.floor(x2 / 8);
  const yOffset = (width / 8) * y;

  // Set full bytes
  for (let b = startByte; b <= endByte; b++) {
    let mask = 0xFF;

    // Adjust first byte
    if (b === startByte) {
      mask = (0xFF >> (x1 % 8));
    }

    // Adjust last byte
    if (b === endByte) {
      mask &= ~(0xFF >> ((x2 % 8) + 1));
    }

    screen[yOffset + b] |= mask;
  }
}

/**
 * Helper: Display screen
 */
function displayScreen(screen, width) {
  const height = screen.length / (width / 8);
  let output = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width / 8; x++) {
      const byte = screen[y * (width / 8) + x];
      const binary = byte.toString(2).padStart(8, '0');
      output += binary.replace(/0/g, '.').replace(/1/g, '#');
    }
    output += '\n';
  }

  return output;
}

// Tests
console.log('='.repeat(70));
console.log('5.8 DRAW LINE');
console.log('='.repeat(70));

console.log('Test 1: Draw line on 32x4 screen');
const width = 32;
const height = 4;
const screen = new Uint8Array((width / 8) * height);

drawLine(screen, width, 5, 20, 1);

console.log(`Screen (${width}x${height}):`);
console.log(displayScreen(screen, width));

console.log('Test 2: Full row');
const screen2 = new Uint8Array(4); // 32 pixels wide, 1 row
drawLineOptimized(screen2, 32, 0, 31, 0);
console.log('Full row:');
console.log(displayScreen(screen2, 32));

console.log('Test 3: Partial line within one byte');
const screen3 = new Uint8Array(4);
drawLineOptimized(screen3, 32, 2, 5, 0);
console.log('Partial line (x=2 to x=5):');
console.log(displayScreen(screen3, 32));

console.log('Test 4: Complex pattern');
const screen4 = new Uint8Array(12); // 24x4
drawLineOptimized(screen4, 24, 3, 18, 0);
drawLineOptimized(screen4, 24, 0, 23, 1);
drawLineOptimized(screen4, 24, 6, 15, 2);
console.log('Multiple lines (24x4):');
console.log(displayScreen(screen4, 24));

console.log('Algorithm:');
console.log('1. Calculate start and end byte positions');
console.log('2. Create masks for partial bytes at edges');
console.log('3. Set full bytes in middle to 0xFF');
console.log('4. Apply masks to edge bytes');
console.log();

console.log('Complexity: O(w) where w is line width in bytes');
console.log('='.repeat(70));
