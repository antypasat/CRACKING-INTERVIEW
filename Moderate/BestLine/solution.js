/**
 * Best Line - Find line passing through most points
 * Najlepsza Linia - Znajdź linię przechodzącą przez najwięcej punktów
 */

/**
 * Klasa reprezentująca punkt 2D
 * Class representing 2D point
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  equals(other, epsilon = 1e-10) {
    return Math.abs(this.x - other.x) < epsilon &&
           Math.abs(this.y - other.y) < epsilon;
  }
}

/**
 * Klasa reprezentująca linię
 * Class representing line
 */
class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;

    // Oblicz nachylenie i przesunięcie
    if (Math.abs(p2.x - p1.x) < 1e-10) {
      this.vertical = true;
      this.x = p1.x;
    } else {
      this.vertical = false;
      this.slope = (p2.y - p1.y) / (p2.x - p1.x);
      this.yIntercept = p1.y - this.slope * p1.x;
    }
  }

  toString() {
    if (this.vertical) {
      return `x = ${this.x.toFixed(2)}`;
    }
    if (Math.abs(this.slope) < 1e-10) {
      return `y = ${this.yIntercept.toFixed(2)}`;
    }
    const sign = this.yIntercept >= 0 ? '+' : '';
    return `y = ${this.slope.toFixed(2)}x ${sign}${this.yIntercept.toFixed(2)}`;
  }

  containsPoint(point, epsilon = 1e-10) {
    if (this.vertical) {
      return Math.abs(point.x - this.x) < epsilon;
    }
    const expectedY = this.slope * point.x + this.yIntercept;
    return Math.abs(point.y - expectedY) < epsilon;
  }
}

/**
 * Funkcja pomocnicza: GCD (Greatest Common Divisor)
 * Helper function: GCD (Greatest Common Divisor)
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  if (b === 0) return a;
  return gcd(b, a % b);
}

/**
 * Funkcja pomocnicza: Sprawdź współliniowość trzech punktów
 * Helper function: Check collinearity of three points
 */
function areCollinear(p1, p2, p3, epsilon = 1e-10) {
  // Iloczyn wektorowy (p2-p1) × (p3-p1)
  // Cross product (p2-p1) × (p3-p1)
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p3.x - p1.x;
  const dy2 = p3.y - p1.y;

  return Math.abs(dx1 * dy2 - dy1 * dx2) < epsilon;
}

/**
 * Podejście 1: Brute Force - O(n³)
 * Approach 1: Brute Force - O(n³)
 *
 * Dla każdej pary punktów, policz ile punktów leży na tej linii
 * For each pair of points, count how many points lie on that line
 */
function bestLineBruteForce(points) {
  if (points.length === 0) return { line: null, count: 0, points: [] };
  if (points.length === 1) return { line: null, count: 1, points: [points[0]] };
  if (points.length === 2) {
    return { line: new Line(points[0], points[1]), count: 2, points: points.slice() };
  }

  let maxCount = 0;
  let bestLine = null;
  let bestPoints = [];

  // Dla każdej pary punktów (i, j)
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const line = new Line(points[i], points[j]);
      const linePoints = [];

      // Policz ile punktów leży na tej linii
      for (let k = 0; k < points.length; k++) {
        if (line.containsPoint(points[k])) {
          linePoints.push(points[k]);
        }
      }

      if (linePoints.length > maxCount) {
        maxCount = linePoints.length;
        bestLine = line;
        bestPoints = linePoints;
      }
    }
  }

  return { line: bestLine, count: maxCount, points: bestPoints };
}

/**
 * Podejście 2: Hash Map - O(n²) ✓ OPTYMALNE
 * Approach 2: Hash Map - O(n²) ✓ OPTIMAL
 *
 * Dla każdego punktu, oblicz nachylenie do wszystkich innych.
 * Punkty o tym samym nachyleniu leżą na tej samej linii.
 */
function bestLineHashMap(points) {
  if (points.length === 0) return { line: null, count: 0, points: [] };
  if (points.length === 1) return { line: null, count: 1, points: [points[0]] };
  if (points.length === 2) {
    return { line: new Line(points[0], points[1]), count: 2, points: points.slice() };
  }

  let maxCount = 0;
  let bestLine = null;
  let bestPoints = [];

  for (let i = 0; i < points.length; i++) {
    const slopeMap = new Map();
    let duplicates = 0; // Punkty identyczne z points[i]

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      if (points[i].equals(points[j])) {
        duplicates++;
      } else {
        const slope = getSlope(points[i], points[j]);
        const key = slopeToKey(slope);

        if (!slopeMap.has(key)) {
          slopeMap.set(key, []);
        }
        slopeMap.get(key).push(j);
      }
    }

    // Znajdź najczęstsze nachylenie
    for (const [key, indices] of slopeMap.entries()) {
      const count = indices.length + duplicates + 1; // +1 dla punktu bazowego

      if (count > maxCount) {
        maxCount = count;

        // Rekonstruuj linię i punkty
        const otherPoint = points[indices[0]];
        bestLine = new Line(points[i], otherPoint);

        bestPoints = [points[i]];
        for (const idx of indices) {
          bestPoints.push(points[idx]);
        }
        // Dodaj duplikaty
        for (let j = 0; j < points.length; j++) {
          if (j !== i && !indices.includes(j) && points[i].equals(points[j])) {
            bestPoints.push(points[j]);
          }
        }
      }
    }

    // Edge case: wszystkie punkty są duplikatami punktu i
    if (duplicates > 0 && duplicates + 1 > maxCount) {
      maxCount = duplicates + 1;
      bestLine = null; // Wiele możliwych linii
      bestPoints = points.filter(p => p.equals(points[i]));
    }
  }

  return { line: bestLine, count: maxCount, points: bestPoints };
}

/**
 * Oblicz nachylenie jako ułamek nieskracalny
 * Calculate slope as reduced fraction
 */
function getSlope(p1, p2) {
  let dy = p2.y - p1.y;
  let dx = p2.x - p1.x;

  if (Math.abs(dx) < 1e-10) {
    return { vertical: true };
  }

  // Normalizuj znak - dx zawsze dodatni
  if (dx < 0) {
    dx = -dx;
    dy = -dy;
  }

  // Skróć ułamek używając GCD
  const divisor = gcd(dy, dx);
  return {
    dy: dy / divisor,
    dx: dx / divisor,
    vertical: false
  };
}

/**
 * Konwertuj nachylenie na klucz dla hash map
 * Convert slope to key for hash map
 */
function slopeToKey(slope) {
  if (slope.vertical) return 'VERTICAL';
  return `${slope.dy}/${slope.dx}`;
}

/**
 * Podejście 3: Geometryczne (Iloczyn Wektorowy) - O(n³)
 * Approach 3: Geometric (Cross Product) - O(n³)
 *
 * Używa iloczynu wektorowego do sprawdzania współliniowości
 * Uses cross product to check collinearity
 */
function bestLineGeometric(points) {
  if (points.length === 0) return { line: null, count: 0, points: [] };
  if (points.length === 1) return { line: null, count: 1, points: [points[0]] };
  if (points.length === 2) {
    return { line: new Line(points[0], points[1]), count: 2, points: points.slice() };
  }

  let maxCount = 0;
  let bestLine = null;
  let bestPoints = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const linePoints = [points[i], points[j]];

      for (let k = 0; k < points.length; k++) {
        if (k === i || k === j) continue;

        if (areCollinear(points[i], points[j], points[k])) {
          linePoints.push(points[k]);
        }
      }

      if (linePoints.length > maxCount) {
        maxCount = linePoints.length;
        bestLine = new Line(points[i], points[j]);
        bestPoints = linePoints;
      }
    }
  }

  return { line: bestLine, count: maxCount, points: bestPoints };
}

/**
 * Podejście 4: Sortowanie Kątowe - O(n² log n)
 * Approach 4: Angle Sort - O(n² log n)
 *
 * Dla każdego punktu, sortuj inne punkty według kąta
 * For each point, sort other points by angle
 */
function bestLineAngleSort(points) {
  if (points.length === 0) return { line: null, count: 0, points: [] };
  if (points.length === 1) return { line: null, count: 1, points: [points[0]] };
  if (points.length === 2) {
    return { line: new Line(points[0], points[1]), count: 2, points: points.slice() };
  }

  let maxCount = 0;
  let bestLine = null;

  for (let i = 0; i < points.length; i++) {
    const angles = [];

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      const angle = Math.atan2(
        points[j].y - points[i].y,
        points[j].x - points[i].x
      );
      angles.push({ angle, point: points[j], index: j });
    }

    // Sortuj po kącie
    angles.sort((a, b) => a.angle - b.angle);

    // Zlicz kolejne punkty o tym samym kącie
    let count = 1;
    let currentAngle = angles[0].angle;

    for (let k = 1; k < angles.length; k++) {
      if (Math.abs(angles[k].angle - currentAngle) < 1e-10) {
        count++;
      } else {
        if (count + 1 > maxCount) { // +1 dla punktu bazowego
          maxCount = count + 1;
          bestLine = new Line(points[i], angles[k - 1].point);
        }
        count = 1;
        currentAngle = angles[k].angle;
      }
    }

    // Sprawdź ostatnią grupę
    if (count + 1 > maxCount) {
      maxCount = count + 1;
      bestLine = new Line(points[i], angles[angles.length - 1].point);
    }
  }

  return { line: bestLine, count: maxCount, points: [] };
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Best Line ===\n');

// Test 1: Wszystkie punkty na jednej linii
console.log('Test 1: Wszystkie punkty współliniowe (all collinear)');
const points1 = [
  new Point(0, 0),
  new Point(1, 1),
  new Point(2, 2),
  new Point(3, 3),
  new Point(4, 4)
];

const result1 = bestLineHashMap(points1);
console.log(`Punkty: ${points1.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result1.line}`);
console.log(`Liczba punktów: ${result1.count}`);
console.log(`Test ${result1.count === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Dwie grupy punktów na różnych liniach
console.log('Test 2: Dwie grupy punktów');
const points2 = [
  new Point(0, 0),
  new Point(1, 1),
  new Point(2, 2), // Linia y = x (3 punkty)
  new Point(0, 2),
  new Point(1, 3),
  new Point(2, 4),
  new Point(3, 5)  // Linia y = x + 2 (4 punkty)
];

const result2 = bestLineHashMap(points2);
console.log(`Punkty: ${points2.length} punktów`);
console.log(`Najlepsza linia: ${result2.line}`);
console.log(`Liczba punktów: ${result2.count}`);
console.log(`Test ${result2.count === 4 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Linia pionowa
console.log('Test 3: Linia pionowa (vertical line)');
const points3 = [
  new Point(5, 1),
  new Point(5, 2),
  new Point(5, 3),
  new Point(5, 4),
  new Point(7, 1) // Poza linią
];

const result3 = bestLineHashMap(points3);
console.log(`Punkty: ${points3.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result3.line}`);
console.log(`Liczba punktów: ${result3.count}`);
console.log(`Test ${result3.count === 4 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 4: Linia pozioma
console.log('Test 4: Linia pozioma (horizontal line)');
const points4 = [
  new Point(1, 5),
  new Point(2, 5),
  new Point(3, 5),
  new Point(4, 5),
  new Point(5, 5)
];

const result4 = bestLineHashMap(points4);
console.log(`Punkty: ${points4.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result4.line}`);
console.log(`Liczba punktów: ${result4.count}`);
console.log(`Test ${result4.count === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Punkty powtarzające się (duplikaty)
console.log('Test 5: Punkty powtarzające się (duplicates)');
const points5 = [
  new Point(1, 1),
  new Point(1, 1),
  new Point(2, 2),
  new Point(3, 3),
  new Point(4, 5) // Poza linią
];

const result5 = bestLineHashMap(points5);
console.log(`Punkty: ${points5.map(p => p.toString()).join(', ')}`);
console.log(`Liczba punktów: ${result5.count}`);
console.log(`Test ${result5.count === 4 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Żadne trzy punkty nie są współliniowe
console.log('Test 6: Żadne trzy punkty współliniowe');
const points6 = [
  new Point(0, 0),
  new Point(1, 2),
  new Point(3, 1),
  new Point(2, 4)
];

const result6 = bestLineHashMap(points6);
console.log(`Punkty: ${points6.map(p => p.toString()).join(', ')}`);
console.log(`Liczba punktów: ${result6.count}`);
console.log(`Test ${result6.count === 2 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 7: Tylko 2 punkty
console.log('Test 7: Tylko 2 punkty (edge case)');
const points7 = [
  new Point(1, 1),
  new Point(2, 2)
];

const result7 = bestLineHashMap(points7);
console.log(`Punkty: ${points7.map(p => p.toString()).join(', ')}`);
console.log(`Liczba punktów: ${result7.count}`);
console.log(`Test ${result7.count === 2 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: Tylko 1 punkt
console.log('Test 8: Tylko 1 punkt (edge case)');
const points8 = [new Point(5, 5)];
const result8 = bestLineHashMap(points8);
console.log(`Punkty: ${points8.map(p => p.toString()).join(', ')}`);
console.log(`Liczba punktów: ${result8.count}`);
console.log(`Test ${result8.count === 1 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 9: Porównanie wszystkich metod
console.log('Test 9: Porównanie wszystkich metod');

const testPoints = [
  new Point(0, 0),
  new Point(1, 1),
  new Point(2, 2),
  new Point(3, 3),
  new Point(1, 2),
  new Point(2, 3),
  new Point(5, 5)
];

console.log(`Punkty testowe: ${testPoints.length} punktów`);

const r1 = bestLineBruteForce(testPoints);
const r2 = bestLineHashMap(testPoints);
const r3 = bestLineGeometric(testPoints);
const r4 = bestLineAngleSort(testPoints);

console.log(`\nBrute Force:   ${r1.count} punktów, linia: ${r1.line}`);
console.log(`Hash Map:      ${r2.count} punktów, linia: ${r2.line}`);
console.log(`Geometric:     ${r3.count} punktów, linia: ${r3.line}`);
console.log(`Angle Sort:    ${r4.count} punktów`);

const allEqual = r1.count === r2.count && r2.count === r3.count && r3.count === r4.count;
console.log(`\nWszystkie metody zgodne: ${allEqual ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 10: Weryfikacja nachylenia (slope precision)
console.log('Test 10: Test precyzji nachylenia');

const points10 = [
  new Point(0, 0),
  new Point(2, 3),
  new Point(4, 6),
  new Point(6, 9)
];

const result10 = bestLineHashMap(points10);
console.log(`Punkty: ${points10.map(p => p.toString()).join(', ')}`);
console.log(`Wszystkie punkty na linii y = (3/2)x`);
console.log(`Najlepsza linia: ${result10.line}`);
console.log(`Liczba punktów: ${result10.count}`);

// Weryfikacja: wszystkie punkty na linii
let allOnLine = true;
for (const p of points10) {
  if (!result10.line.containsPoint(p)) {
    allOnLine = false;
    break;
  }
}

console.log(`Wszystkie punkty na zwróconej linii: ${allOnLine ? 'TAK ✓' : 'NIE ✗'}`);
console.log(`Test ${result10.count === 4 && allOnLine ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 11: Liczby ujemne
console.log('Test 11: Współrzędne ujemne (negative coordinates)');
const points11 = [
  new Point(-3, -3),
  new Point(-2, -2),
  new Point(-1, -1),
  new Point(0, 0),
  new Point(1, 1)
];

const result11 = bestLineHashMap(points11);
console.log(`Punkty: ${points11.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result11.line}`);
console.log(`Liczba punktów: ${result11.count}`);
console.log(`Test ${result11.count === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Nachylenie ujemne
console.log('Test 12: Nachylenie ujemne (negative slope)');
const points12 = [
  new Point(0, 4),
  new Point(1, 3),
  new Point(2, 2),
  new Point(3, 1),
  new Point(4, 0)
];

const result12 = bestLineHashMap(points12);
console.log(`Punkty: ${points12.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result12.line}`);
console.log(`Liczba punktów: ${result12.count}`);
console.log(`Test ${result12.count === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 13: Duży zbiór punktów - performance test
console.log('Test 13: Test wydajności (performance test)');

function generateRandomPoints(n, range = 100) {
  const points = [];
  for (let i = 0; i < n; i++) {
    points.push(new Point(
      Math.floor(Math.random() * range),
      Math.floor(Math.random() * range)
    ));
  }
  return points;
}

const largePoints = generateRandomPoints(100);

let start = Date.now();
const resultBrute = bestLineBruteForce(largePoints);
const timeBrute = Date.now() - start;

start = Date.now();
const resultHash = bestLineHashMap(largePoints);
const timeHash = Date.now() - start;

start = Date.now();
const resultGeom = bestLineGeometric(largePoints);
const timeGeom = Date.now() - start;

console.log(`100 losowych punktów:`);
console.log(`  Brute Force (O(n³)):  ${timeBrute}ms, ${resultBrute.count} punktów`);
console.log(`  Hash Map (O(n²)):     ${timeHash}ms, ${resultHash.count} punktów`);
console.log(`  Geometric (O(n³)):    ${timeGeom}ms, ${resultGeom.count} punktów`);
console.log(`\nHash Map szybsze o ${(timeBrute / timeHash).toFixed(1)}x\n`);

// Test 14: Wzorzec grid (siatka punktów)
console.log('Test 14: Siatka punktów (grid pattern)');

const gridPoints = [];
for (let x = 0; x <= 5; x++) {
  for (let y = 0; y <= 5; y++) {
    gridPoints.push(new Point(x, y));
  }
}

const result14 = bestLineHashMap(gridPoints);
console.log(`Siatka 6x6: ${gridPoints.length} punktów`);
console.log(`Najlepsza linia: ${result14.line}`);
console.log(`Liczba punktów: ${result14.count}`);
console.log(`(Oczekiwane: 6 punktów na jednej z przekątnych lub krawędzi)\n`);

// Test 15: Test funkcji pomocniczej GCD
console.log('Test 15: Test funkcji GCD');

const gcdTests = [
  { a: 12, b: 8, expected: 4 },
  { a: 15, b: 25, expected: 5 },
  { a: 7, b: 13, expected: 1 },
  { a: 100, b: 50, expected: 50 },
  { a: 0, b: 5, expected: 5 }
];

let allGcdCorrect = true;
gcdTests.forEach(({ a, b, expected }) => {
  const result = gcd(a, b);
  const correct = result === expected;
  allGcdCorrect = allGcdCorrect && correct;
  console.log(`  gcd(${a}, ${b}) = ${result} ${correct ? '✓' : '✗ (expected: ' + expected + ')'}`);
});

console.log(`Test ${allGcdCorrect ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 16: Test funkcji areCollinear
console.log('Test 16: Test funkcji areCollinear');

const p1 = new Point(0, 0);
const p2 = new Point(2, 2);
const p3a = new Point(4, 4); // Współliniowy
const p3b = new Point(4, 5); // Nie współliniowy

console.log(`Punkty: ${p1}, ${p2}, ${p3a}`);
console.log(`Współliniowe: ${areCollinear(p1, p2, p3a) ? 'TAK ✓' : 'NIE ✗'}`);

console.log(`Punkty: ${p1}, ${p2}, ${p3b}`);
console.log(`Współliniowe: ${areCollinear(p1, p2, p3b) ? 'TAK ✗' : 'NIE ✓'}\n`);

// Test 17: Test funkcji getSlope
console.log('Test 17: Test funkcji getSlope');

const slope1 = getSlope(new Point(0, 0), new Point(2, 3));
const slope2 = getSlope(new Point(0, 0), new Point(4, 6));
const slope3 = getSlope(new Point(0, 0), new Point(0, 5));

console.log(`Slope (0,0) → (2,3): ${slopeToKey(slope1)}`);
console.log(`Slope (0,0) → (4,6): ${slopeToKey(slope2)}`);
console.log(`Oba powinny być 3/2: ${slopeToKey(slope1) === slopeToKey(slope2) ? 'TAK ✓' : 'NIE ✗'}`);
console.log(`Slope (0,0) → (0,5): ${slopeToKey(slope3)} (pionowa)\n`);

// Test 18: Wszystkie punkty w tym samym miejscu
console.log('Test 18: Wszystkie punkty identyczne');
const points18 = [
  new Point(5, 5),
  new Point(5, 5),
  new Point(5, 5),
  new Point(5, 5)
];

const result18 = bestLineHashMap(points18);
console.log(`Punkty: 4 × (5, 5)`);
console.log(`Liczba punktów: ${result18.count}`);
console.log(`Test ${result18.count === 4 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 19: Punkty z ułamkowymi współrzędnymi
console.log('Test 19: Współrzędne zmiennoprzecinkowe (floating point)');
const points19 = [
  new Point(0.5, 0.5),
  new Point(1.5, 1.5),
  new Point(2.5, 2.5),
  new Point(3.5, 3.5)
];

const result19 = bestLineHashMap(points19);
console.log(`Punkty: ${points19.map(p => p.toString()).join(', ')}`);
console.log(`Najlepsza linia: ${result19.line}`);
console.log(`Liczba punktów: ${result19.count}`);
console.log(`Test ${result19.count === 4 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 20: Complex case - wiele linii z tą samą liczbą punktów
console.log('Test 20: Wiele linii z tą samą liczbą punktów');
const points20 = [
  // Linia 1: y = x
  new Point(0, 0),
  new Point(1, 1),
  new Point(2, 2),
  // Linia 2: y = -x + 4
  new Point(0, 4),
  new Point(2, 2), // Punkt wspólny!
  new Point(4, 0)
];

const result20 = bestLineHashMap(points20);
console.log(`Punkty: ${points20.length} punktów`);
console.log(`Najlepsza linia: ${result20.line}`);
console.log(`Liczba punktów: ${result20.count}`);
console.log(`(Punkt (2,2) leży na obu liniach)\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('Best Line - Znajdź linię przez najwięcej punktów');
console.log('\nZłożoności:');
console.log('  1. Brute Force:  O(n³) czas, O(1) pamięć');
console.log('  2. Hash Map:     O(n²) czas, O(n) pamięć ✓ OPTYMALNE');
console.log('  3. Geometric:    O(n³) czas, O(1) pamięć');
console.log('  4. Angle Sort:   O(n²log n) czas, O(n) pamięć');
console.log('\nKluczowa idea (Hash Map):');
console.log('  - Dla każdego punktu P, oblicz nachylenie do wszystkich innych');
console.log('  - Punkty o tym samym nachyleniu leżą na tej samej linii');
console.log('  - Użyj ułamka nieskracalnego (GCD) zamiast float');
console.log('  - Obsłuż edge cases: duplikaty, linie pionowe');
console.log('\nProblemy z precyzją:');
console.log('  ✗ Float comparison: 1.5 vs 1.5000001');
console.log('  ✓ Ułamek nieskracalny: 3/2 (używa GCD)');
console.log('\nEdge cases:');
console.log('  ✓ Linia pionowa (nieskończone nachylenie)');
console.log('  ✓ Linia pozioma (nachylenie = 0)');
console.log('  ✓ Punkty powtarzające się');
console.log('  ✓ < 3 punkty');
console.log('  ✓ Wszystkie punkty identyczne');
console.log('\nZastosowania:');
console.log('  - RANSAC (Random Sample Consensus)');
console.log('  - Hough Transform (wykrywanie linii)');
console.log('  - Regresja liniowa');
console.log('  - Pattern recognition');
console.log('  - Computer vision');
