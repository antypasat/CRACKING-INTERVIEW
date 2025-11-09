/**
 * Langton's Ant - Cellular automaton simulation
 * Mrówka Langtona - Symulacja automatu komórkowego
 *
 * Zasady / Rules:
 * - Biały (0): Obróć w prawo, zmień na czarny, idź
 * - Czarny (1): Obróć w lewo, zmień na biały, idź
 */

/**
 * Kierunki / Directions
 */
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const DIRECTION_NAMES = ['N', 'E', 'S', 'W'];
const DIRECTION_SYMBOLS = ['^', '>', 'v', '<'];

/**
 * Moves: [dx, dy] dla każdego kierunku
 * Moves: [dx, dy] for each direction
 */
const MOVES = [
  [0, -1],  // North: y decreases (up)
  [1, 0],   // East: x increases (right)
  [0, 1],   // South: y increases (down)
  [-1, 0]   // West: x decreases (left)
];

/**
 * Podejście 1: HashMap (Sparse Grid) - O(K) ✓ OPTYMALNE
 * Approach 1: HashMap (Sparse Grid) - O(K) ✓ OPTIMAL
 *
 * Przechowuj tylko czarne pola w HashMap
 * Store only black squares in HashMap
 */
class LangtonsAnt {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = EAST; // Start facing right
    this.grid = new Map(); // key: "x,y", value: true (black)

    // Track bounds dla efektywnego wyświetlania
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;

    // Statistics
    this.steps = 0;
    this.blackCells = 0;
  }

  /**
   * Wykonaj K kroków
   * Execute K steps
   */
  move(K) {
    for (let i = 0; i < K; i++) {
      this.step();
    }
  }

  /**
   * Wykonaj jeden krok
   * Execute one step
   */
  step() {
    const key = `${this.x},${this.y}`;
    const isBlack = this.grid.has(key);

    // Flip color
    if (isBlack) {
      this.grid.delete(key); // Black → White
      this.blackCells--;
      this.turnLeft();
    } else {
      this.grid.set(key, true); // White → Black
      this.blackCells++;
      this.turnRight();
    }

    // Move forward
    this.moveForward();

    // Update bounds
    this.updateBounds();

    this.steps++;
  }

  /**
   * Obróć w prawo (zgodnie z ruchem wskazówek zegara)
   * Turn right (clockwise)
   */
  turnRight() {
    this.direction = (this.direction + 1) % 4;
  }

  /**
   * Obróć w lewo (przeciwnie do ruchu wskazówek zegara)
   * Turn left (counter-clockwise)
   */
  turnLeft() {
    this.direction = (this.direction + 3) % 4;
    // Alternatywnie: (this.direction - 1 + 4) % 4
  }

  /**
   * Idź do przodu w aktualnym kierunku
   * Move forward in current direction
   */
  moveForward() {
    const [dx, dy] = MOVES[this.direction];
    this.x += dx;
    this.y += dy;
  }

  /**
   * Aktualizuj granice siatki
   * Update grid bounds
   */
  updateBounds() {
    this.minX = Math.min(this.minX, this.x);
    this.maxX = Math.max(this.maxX, this.x);
    this.minY = Math.min(this.minY, this.y);
    this.maxY = Math.max(this.maxY, this.y);
  }

  /**
   * Wyświetl siatkę jako ASCII art
   * Display grid as ASCII art
   */
  printGrid() {
    const width = this.maxX - this.minX + 1;
    const height = this.maxY - this.minY + 1;

    console.log(`Grid: ${width}x${height}, Black cells: ${this.blackCells}`);
    console.log(`Ant at (${this.x}, ${this.y}) facing ${DIRECTION_NAMES[this.direction]}`);
    console.log();

    for (let y = this.minY; y <= this.maxY; y++) {
      let row = '';
      for (let x = this.minX; x <= this.maxX; x++) {
        const key = `${x},${y}`;

        if (x === this.x && y === this.y) {
          row += DIRECTION_SYMBOLS[this.direction]; // Ant with direction
        } else if (this.grid.has(key)) {
          row += 'X'; // Black square
        } else {
          row += '_'; // White square
        }
        row += ' '; // Spacing
      }
      console.log(row);
    }
    console.log();
  }

  /**
   * Zwróć siatkę jako tablicę 2D
   * Return grid as 2D array
   */
  getGrid() {
    const grid = [];

    for (let y = this.minY; y <= this.maxY; y++) {
      const row = [];
      for (let x = this.minX; x <= this.maxX; x++) {
        const key = `${x},${y}`;

        if (x === this.x && y === this.y) {
          row.push('A');
        } else if (this.grid.has(key)) {
          row.push('X');
        } else {
          row.push('_');
        }
      }
      grid.push(row);
    }

    return grid;
  }

  /**
   * Statystyki symulacji
   * Simulation statistics
   */
  getStats() {
    return {
      steps: this.steps,
      position: [this.x, this.y],
      direction: DIRECTION_NAMES[this.direction],
      blackCells: this.blackCells,
      gridSize: {
        width: this.maxX - this.minX + 1,
        height: this.maxY - this.minY + 1
      },
      bounds: {
        minX: this.minX,
        maxX: this.maxX,
        minY: this.minY,
        maxY: this.maxY
      }
    };
  }
}

/**
 * Podejście 2: 2D Array (Fixed Size) - O(N²)
 * Approach 2: 2D Array (Fixed Size) - O(N²)
 *
 * Prosta implementacja z tablicą o stałym rozmiarze
 * Simple implementation with fixed-size array
 */
class LangtonsAntArray {
  constructor(size = 100) {
    this.size = size;
    this.center = Math.floor(size / 2);
    this.grid = Array(size).fill(null).map(() => Array(size).fill(0));
    this.x = this.center;
    this.y = this.center;
    this.direction = EAST;
    this.steps = 0;
  }

  move(K) {
    for (let i = 0; i < K; i++) {
      this.step();
    }
  }

  step() {
    // Check bounds
    if (this.x < 0 || this.x >= this.size ||
        this.y < 0 || this.y >= this.size) {
      throw new Error(`Out of bounds at (${this.x}, ${this.y})`);
    }

    const currentColor = this.grid[this.y][this.x];

    // Flip color
    this.grid[this.y][this.x] = 1 - currentColor;

    // Turn
    if (currentColor === 0) { // White
      this.direction = (this.direction + 1) % 4; // Right
    } else { // Black
      this.direction = (this.direction + 3) % 4; // Left
    }

    // Move
    const [dx, dy] = MOVES[this.direction];
    this.x += dx;
    this.y += dy;

    this.steps++;
  }

  printGrid() {
    // Znajdź używany obszar
    let minX = this.size, maxX = 0;
    let minY = this.size, maxY = 0;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.grid[y][x] === 1 || (x === this.x && y === this.y)) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    // Add padding
    minX = Math.max(0, minX - 1);
    maxX = Math.min(this.size - 1, maxX + 1);
    minY = Math.max(0, minY - 1);
    maxY = Math.min(this.size - 1, maxY + 1);

    console.log(`Array Grid (showing ${maxX-minX+1}x${maxY-minY+1} of ${this.size}x${this.size})`);
    console.log();

    for (let y = minY; y <= maxY; y++) {
      let row = '';
      for (let x = minX; x <= maxX; x++) {
        if (x === this.x && y === this.y) {
          row += DIRECTION_SYMBOLS[this.direction];
        } else if (this.grid[y][x] === 1) {
          row += 'X';
        } else {
          row += '_';
        }
        row += ' ';
      }
      console.log(row);
    }
    console.log();
  }
}

/**
 * Podejście 3: Compressed with Set - O(K)
 * Approach 3: Compressed with Set - O(K)
 *
 * Używa Set zamiast Map (lżejsze)
 * Uses Set instead of Map (lighter)
 */
class LangtonsAntCompressed {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dir = EAST;
    this.black = new Set(); // Set of "x,y" strings
    this.steps = 0;
  }

  simulate(K) {
    for (let i = 0; i < K; i++) {
      const key = `${this.x},${this.y}`;
      const isBlack = this.black.has(key);

      // Flip and turn
      if (isBlack) {
        this.black.delete(key);
        this.dir = (this.dir + 3) % 4; // Left
      } else {
        this.black.add(key);
        this.dir = (this.dir + 1) % 4; // Right
      }

      // Move
      const [dx, dy] = MOVES[this.dir];
      this.x += dx;
      this.y += dy;

      this.steps++;
    }
  }

  getGrid() {
    if (this.black.size === 0 && this.steps === 0) {
      return [['A']]; // Just ant on white
    }

    // Znajdź bounds
    let minX = this.x, maxX = this.x;
    let minY = this.y, maxY = this.y;

    for (const key of this.black) {
      const [x, y] = key.split(',').map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // Zbuduj grid
    const grid = [];
    for (let y = minY; y <= maxY; y++) {
      const row = [];
      for (let x = minX; x <= maxX; x++) {
        if (x === this.x && y === this.y) {
          row.push(DIRECTION_SYMBOLS[this.dir]);
        } else if (this.black.has(`${x},${y}`)) {
          row.push('X');
        } else {
          row.push('_');
        }
      }
      grid.push(row);
    }

    return grid;
  }

  printGrid() {
    const grid = this.getGrid();
    console.log(`Compressed Grid: ${grid[0].length}x${grid.length}, Black: ${this.black.size}`);
    console.log();

    for (const row of grid) {
      console.log(row.join(' '));
    }
    console.log();
  }
}

/**
 * Funkcje pomocnicze / Helper functions
 */

/**
 * Animacja krok po kroku
 * Step-by-step animation
 */
function animateLangtonsAnt(K, delay = 100) {
  const ant = new LangtonsAnt();

  let step = 0;
  const interval = setInterval(() => {
    if (step >= K) {
      clearInterval(interval);
      console.log('\nFinal state:');
      ant.printGrid();
      return;
    }

    console.clear();
    console.log(`Step ${step + 1}/${K}`);
    ant.step();
    ant.printGrid();

    step++;
  }, delay);
}

/**
 * Porównaj różne implementacje
 * Compare different implementations
 */
function compareImplementations(K) {
  console.log(`Comparing implementations for K=${K}\n`);

  // HashMap
  const start1 = Date.now();
  const ant1 = new LangtonsAnt();
  ant1.move(K);
  const time1 = Date.now() - start1;
  const stats1 = ant1.getStats();

  // Set
  const start2 = Date.now();
  const ant2 = new LangtonsAntCompressed();
  ant2.simulate(K);
  const time2 = Date.now() - start2;

  // Array (jeśli K jest małe)
  let time3 = 'N/A';
  if (K < 1000) {
    const start3 = Date.now();
    const ant3 = new LangtonsAntArray(200);
    try {
      ant3.move(K);
      time3 = Date.now() - start3;
    } catch (e) {
      time3 = 'Out of bounds';
    }
  }

  console.log(`HashMap:     ${time1}ms - ${stats1.blackCells} black cells`);
  console.log(`Set:         ${time2}ms - ${ant2.black.size} black cells`);
  console.log(`Array:       ${time3}${typeof time3 === 'number' ? 'ms' : ''}`);
  console.log();

  return { ant1, ant2 };
}

/**
 * Znajdź "highway" pattern
 * Find "highway" pattern
 */
function findHighway(maxSteps = 15000) {
  console.log('Searching for highway pattern...\n');

  const ant = new LangtonsAnt();
  let prevX = 0, prevY = 0;
  let prevBlack = 0;

  for (let i = 1; i <= maxSteps; i++) {
    ant.step();

    if (i % 1000 === 0) {
      const dx = ant.x - prevX;
      const dy = ant.y - prevY;
      const dBlack = ant.blackCells - prevBlack;

      console.log(`Step ${i}:`);
      console.log(`  Position: (${ant.x}, ${ant.y})`);
      console.log(`  Movement: dx=${dx}, dy=${dy}`);
      console.log(`  Black cells: ${ant.blackCells} (Δ=${dBlack})`);

      // Highway indicator: steady diagonal movement
      if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
        console.log(`  → Highway detected! Moving diagonally`);
      }

      console.log();

      prevX = ant.x;
      prevY = ant.y;
      prevBlack = ant.blackCells;
    }
  }

  return ant;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Langton\'s Ant ===\n');

// Test 1: K = 0 (brak ruchów)
console.log('Test 1: K = 0 (no moves)');
const ant1 = new LangtonsAnt();
ant1.move(0);
ant1.printGrid();
console.log(`Test ${ant1.steps === 0 && ant1.blackCells === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: K = 1 (jeden krok)
console.log('Test 2: K = 1 (one step)');
const ant2 = new LangtonsAnt();
ant2.move(1);
ant2.printGrid();

const stats2 = ant2.getStats();
console.log('Stats:', stats2);
console.log(`Test ${ant2.blackCells === 1 && ant2.y === -1 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: K = 5 (przykład z zadania)
console.log('Test 3: K = 5 (example from problem)');
const ant3 = new LangtonsAnt();
ant3.move(5);
ant3.printGrid();

const stats3 = ant3.getStats();
console.log('Stats:', stats3);
console.log();

// Test 4: K = 10
console.log('Test 4: K = 10');
const ant4 = new LangtonsAnt();
ant4.move(10);
ant4.printGrid();
console.log();

// Test 5: K = 50
console.log('Test 5: K = 50 (emerging pattern)');
const ant5 = new LangtonsAnt();
ant5.move(50);
ant5.printGrid();

const stats5 = ant5.getStats();
console.log('Stats:', stats5);
console.log();

// Test 6: K = 100
console.log('Test 6: K = 100');
const ant6 = new LangtonsAnt();
ant6.move(100);
ant6.printGrid();

const stats6 = ant6.getStats();
console.log('Grid size:', stats6.gridSize);
console.log('Black cells:', stats6.blackCells);
console.log();

// Test 7: K = 500 (chaos phase)
console.log('Test 7: K = 500 (chaos phase)');
const ant7 = new LangtonsAnt();
ant7.move(500);

const stats7 = ant7.getStats();
console.log('Stats:', stats7);
console.log('(Grid too large to print, showing stats only)');
console.log();

// Test 8: Porównanie implementacji
console.log('Test 8: Porównanie implementacji (K=100)');
const { ant1: hashAnt, ant2: setAnt } = compareImplementations(100);

console.log('HashMap grid:');
hashAnt.printGrid();

console.log('Set grid:');
setAnt.printGrid();

// Test 9: Array implementation
console.log('Test 9: Array implementation (K=20)');
const arrayAnt = new LangtonsAntArray(50);
arrayAnt.move(20);
arrayAnt.printGrid();
console.log();

// Test 10: Kierunki rotacji
console.log('Test 10: Test rotacji (rotation test)');
const rotAnt = new LangtonsAnt();

console.log('Początek: facing EAST');
console.log('Obrót w prawo: EAST → SOUTH');
rotAnt.turnRight();
console.log(`Direction: ${DIRECTION_NAMES[rotAnt.direction]} ${rotAnt.direction === SOUTH ? '✓' : '✗'}`);

console.log('Obrót w lewo: SOUTH → EAST');
rotAnt.turnLeft();
console.log(`Direction: ${DIRECTION_NAMES[rotAnt.direction]} ${rotAnt.direction === EAST ? '✓' : '✗'}`);

console.log('Obrót w lewo: EAST → NORTH');
rotAnt.turnLeft();
console.log(`Direction: ${DIRECTION_NAMES[rotAnt.direction]} ${rotAnt.direction === NORTH ? '✓' : '✗'}`);
console.log();

// Test 11: Moves array
console.log('Test 11: Test moves array');
console.log('Starting at (0, 0)');

const testMoves = new LangtonsAnt();
const positions = [[0, 0]];

for (let dir = 0; dir < 4; dir++) {
  testMoves.direction = dir;
  testMoves.moveForward();
  positions.push([testMoves.x, testMoves.y]);
  console.log(`  ${DIRECTION_NAMES[dir]}: (${testMoves.x}, ${testMoves.y})`);
}
console.log();

// Test 12: Performance test
console.log('Test 12: Performance test (różne wartości K)');

const kValues = [100, 500, 1000, 5000];

for (const k of kValues) {
  const start = Date.now();
  const perfAnt = new LangtonsAnt();
  perfAnt.move(k);
  const time = Date.now() - start;

  const stats = perfAnt.getStats();
  console.log(`K=${k}: ${time}ms - Grid: ${stats.gridSize.width}x${stats.gridSize.height}, Black: ${stats.blackCells}`);
}
console.log();

// Test 13: Symmetry check (pierwsze kilka kroków)
console.log('Test 13: Ścieżka mrówki (pierwsze 10 kroków)');
const pathAnt = new LangtonsAnt();

console.log('Step | Position     | Direction | Color Before | Action');
console.log('-----|--------------|-----------|--------------|------------------');

for (let i = 0; i < 10; i++) {
  const [x, y] = [pathAnt.x, pathAnt.y];
  const key = `${x},${y}`;
  const colorBefore = pathAnt.grid.has(key) ? 'Black' : 'White';
  const dirBefore = DIRECTION_NAMES[pathAnt.direction];

  pathAnt.step();

  const action = colorBefore === 'White' ? 'Turn R, Black' : 'Turn L, White';

  console.log(`${String(i + 1).padStart(4)} | (${String(x).padStart(3)}, ${String(y).padStart(3)}) | ${dirBefore.padEnd(9)} | ${colorBefore.padEnd(12)} | ${action}`);
}
console.log();

pathAnt.printGrid();

// Test 14: Grid bounds tracking
console.log('Test 14: Tracking bounds (K=200)');
const boundsAnt = new LangtonsAnt();
boundsAnt.move(200);

const boundsStats = boundsAnt.getStats();
console.log('Bounds:', boundsStats.bounds);
console.log('Grid size:', boundsStats.gridSize);
console.log('Position:', boundsStats.position);
console.log();

// Test 15: Compressed implementation
console.log('Test 15: Compressed implementation (K=50)');
const compAnt = new LangtonsAntCompressed();
compAnt.simulate(50);
compAnt.printGrid();

console.log(`Black cells: ${compAnt.black.size}`);
console.log(`Memory: ~${compAnt.black.size * 10} bytes (estimated)`);
console.log();

// Test 16: Edge cases
console.log('Test 16: Edge cases');

// Bardzo małe K
const edge1 = new LangtonsAnt();
edge1.move(1);
console.log('K=1:', edge1.getStats());

// K = 2
const edge2 = new LangtonsAnt();
edge2.move(2);
console.log('K=2:', edge2.getStats());

// K = 4 (pełny obrót?)
const edge4 = new LangtonsAnt();
edge4.move(4);
console.log('K=4:', edge4.getStats());
console.log();

// Test 17: Weryfikacja zgodności implementacji
console.log('Test 17: Weryfikacja zgodności (HashMap vs Set)');
const verify1 = new LangtonsAnt();
const verify2 = new LangtonsAntCompressed();

const testK = 100;
verify1.move(testK);
verify2.simulate(testK);

const grid1 = verify1.getGrid();
const grid2 = verify2.getGrid();

const match = JSON.stringify(grid1) === JSON.stringify(grid2);
console.log(`K=${testK}: ${match ? 'PASS ✓' : 'FAIL ✗'}`);

if (!match) {
  console.log('HashMap grid:', grid1.length, 'x', grid1[0].length);
  console.log('Set grid:', grid2.length, 'x', grid2[0].length);
}
console.log();

// Test 18: Large K
console.log('Test 18: Large K = 10000 (highway search)');
const largeAnt = new LangtonsAnt();
const startTime = Date.now();
largeAnt.move(10000);
const elapsedTime = Date.now() - startTime;

const largeStats = largeAnt.getStats();
console.log(`Time: ${elapsedTime}ms`);
console.log('Stats:', largeStats);
console.log('(Grid too large to display)');
console.log();

// Test 19: Direction symbols
console.log('Test 19: Direction symbols visualization');
const symAnt = new LangtonsAnt();
symAnt.move(3);
symAnt.printGrid();

console.log('Legend:');
console.log('  ^ = North');
console.log('  > = East');
console.log('  v = South');
console.log('  < = West');
console.log('  X = Black square');
console.log('  _ = White square');
console.log();

// Test 20: Statystyki dla różnych K
console.log('Test 20: Statystyki dla różnych K');
console.log('K    | Black Cells | Grid Size   | Position');
console.log('-----|-------------|-------------|------------------');

for (const k of [10, 50, 100, 500, 1000]) {
  const statsAnt = new LangtonsAnt();
  statsAnt.move(k);
  const s = statsAnt.getStats();

  console.log(
    `${String(k).padStart(4)} | ` +
    `${String(s.blackCells).padStart(11)} | ` +
    `${String(s.gridSize.width).padStart(3)}x${String(s.gridSize.height).padStart(3)}     | ` +
    `(${s.position[0]}, ${s.position[1]})`
  );
}
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Langton\'s Ant - Cellular automaton simulation');
console.log('\nImplementacje:');
console.log('  HashMap:     O(K) czas, O(K) pamięć - najlepsza ✓');
console.log('  Set:         O(K) czas, O(K) pamięć - lżejsza');
console.log('  Array:       O(K) czas, O(N²) pamięć - prosta ale ograniczona');
console.log('\nZasady:');
console.log('  White (0): Turn RIGHT, flip to black, move');
console.log('  Black (1): Turn LEFT, flip to white, move');
console.log('\nKierunki:');
console.log('  0=North, 1=East, 2=South, 3=West');
console.log('  Right: (dir+1)%4, Left: (dir+3)%4');
console.log('\nWłasności:');
console.log('  - Chaotyczne zachowanie dla małych K');
console.log('  - "Highway" pattern pojawia się ~K=10000');
console.log('  - Nieodwracalność (nie można przewidzieć historii)');
console.log('  - Uniwersalność (zawsze znajduje autostradę)');
console.log('\nOptymalizacje:');
console.log('  - Sparse grid (HashMap/Set) dla nieskończonej siatki');
console.log('  - Tracking bounds na bieżąco');
console.log('  - String keys dla wydajności');
console.log('\nZastosowania:');
console.log('  - Cellular automata research');
console.log('  - Emergence studies');
console.log('  - Complexity theory');
console.log('  - Algorithm visualization');
