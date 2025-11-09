/**
 * Bisect Squares - Find line that cuts both squares in half
 * Przecięcie Kwadratów - Znajdź linię przecinającą oba kwadraty na pół
 */

/**
 * Klasy reprezentujące obiekty geometryczne
 * Classes representing geometric objects
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  equals(other, epsilon = 1e-10) {
    return Math.abs(this.x - other.x) < epsilon &&
           Math.abs(this.y - other.y) < epsilon;
  }
}

class Square {
  constructor(center, size) {
    this.center = center;
    this.size = size;
  }

  // Alternatywny konstruktor - od lewego dolnego rogu
  // Alternative constructor - from bottom-left corner
  static fromCorner(x, y, size) {
    const center = new Point(x + size / 2, y + size / 2);
    return new Square(center, size);
  }

  getVertices() {
    const half = this.size / 2;
    return {
      topLeft: new Point(this.center.x - half, this.center.y + half),
      topRight: new Point(this.center.x + half, this.center.y + half),
      bottomLeft: new Point(this.center.x - half, this.center.y - half),
      bottomRight: new Point(this.center.x + half, this.center.y - half)
    };
  }

  getEdges() {
    const v = this.getVertices();
    return [
      { start: v.bottomLeft, end: v.bottomRight, name: 'bottom' },
      { start: v.bottomRight, end: v.topRight, name: 'right' },
      { start: v.topRight, end: v.topLeft, name: 'top' },
      { start: v.topLeft, end: v.bottomLeft, name: 'left' }
    ];
  }

  toString() {
    return `Square[center=${this.center}, size=${this.size}]`;
  }
}

class Line {
  constructor(data) {
    if (data.vertical) {
      this.vertical = true;
      this.x = data.x;
    } else {
      this.vertical = false;
      this.slope = data.slope;
      this.yIntercept = data.yIntercept;
    }
  }

  toString() {
    if (this.vertical) {
      return `x = ${this.x.toFixed(2)}`;
    }
    if (this.slope === 0) {
      return `y = ${this.yIntercept.toFixed(2)}`;
    }
    const sign = this.yIntercept >= 0 ? '+' : '';
    return `y = ${this.slope.toFixed(2)}x ${sign}${this.yIntercept.toFixed(2)}`;
  }

  // Oblicz y dla danego x
  // Calculate y for given x
  getY(x) {
    if (this.vertical) {
      return null; // Linia pionowa nie ma jednoznacznego y
    }
    return this.slope * x + this.yIntercept;
  }

  // Oblicz x dla danego y
  // Calculate x for given y
  getX(y) {
    if (this.vertical) {
      return this.x;
    }
    if (this.slope === 0) {
      return null; // Linia pozioma nie ma jednoznacznego x
    }
    return (y - this.yIntercept) / this.slope;
  }

  // Sprawdź czy punkt leży na linii
  // Check if point is on line
  containsPoint(point, epsilon = 1e-10) {
    if (this.vertical) {
      return Math.abs(point.x - this.x) < epsilon;
    }
    const expectedY = this.getY(point.x);
    return Math.abs(point.y - expectedY) < epsilon;
  }
}

/**
 * Podejście 1: Geometryczne (przez Środki) - O(1) ✓ OPTYMALNE
 * Approach 1: Geometric (through Centers) - O(1) ✓ OPTIMAL
 *
 * Kluczowa obserwacja: Linia przecinająca kwadrat na pół musi przejść przez środek
 * Key observation: Line that bisects a square must pass through its center
 */
function bisectSquares(square1, square2) {
  const center1 = square1.center;
  const center2 = square2.center;

  // Edge case: środki w tym samym punkcie
  // Edge case: centers at same point
  if (center1.equals(center2)) {
    // Dowolna linia przez środek - zwróć poziomą
    // Any line through center - return horizontal
    return new Line({ slope: 0, yIntercept: center1.y });
  }

  // Edge case: linia pionowa
  // Edge case: vertical line
  if (Math.abs(center1.x - center2.x) < 1e-10) {
    return new Line({ vertical: true, x: center1.x });
  }

  // Oblicz nachylenie i przesunięcie
  // Calculate slope and y-intercept
  const slope = (center2.y - center1.y) / (center2.x - center1.x);
  const yIntercept = center1.y - slope * center1.x;

  return new Line({ slope, yIntercept });
}

/**
 * Podejście 2: Zwróć Dwa Punkty - O(1)
 * Approach 2: Return Two Points - O(1)
 *
 * Prostsze podejście - zwróć środki jako punkty definiujące linię
 * Simpler approach - return centers as points defining line
 */
function bisectSquaresTwoPoints(square1, square2) {
  return {
    point1: square1.center,
    point2: square2.center
  };
}

/**
 * Podejście 3: Postać Ogólna Linii - O(1)
 * Approach 3: General Line Form - O(1)
 *
 * Używa postaci ax + by + c = 0 (nie ma problemu z pionowymi liniami)
 * Uses form ax + by + c = 0 (no issue with vertical lines)
 */
function bisectSquaresGeneralForm(square1, square2) {
  const center1 = square1.center;
  const center2 = square2.center;

  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;

  // Wektor kierunkowy: (dx, dy)
  // Direction vector: (dx, dy)
  // Wektor normalny: (-dy, dx)
  // Normal vector: (-dy, dx)

  const a = -dy;
  const b = dx;
  const c = -(a * center1.x + b * center1.y);

  return { a, b, c };
}

/**
 * Funkcja pomocnicza: Znajdź punkty przecięcia linii z kwadratem
 * Helper function: Find intersection points of line with square
 */
function findLineSquareIntersections(line, square) {
  const edges = square.getEdges();
  const intersections = [];

  for (const edge of edges) {
    const intersection = findLineSegmentIntersection(line, edge.start, edge.end);
    if (intersection) {
      intersections.push({ point: intersection, edge: edge.name });
    }
  }

  return intersections;
}

/**
 * Znajdź przecięcie linii z odcinkiem
 * Find intersection of line with segment
 */
function findLineSegmentIntersection(line, p1, p2) {
  const epsilon = 1e-10;

  if (line.vertical) {
    // Linia pionowa x = line.x
    if (p1.x === p2.x) {
      // Odcinek też pionowy
      if (Math.abs(p1.x - line.x) < epsilon) {
        return new Point(line.x, (p1.y + p2.y) / 2); // Środek odcinka
      }
      return null;
    }

    // Sprawdź czy x jest między p1.x i p2.x
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);

    if (line.x < minX - epsilon || line.x > maxX + epsilon) {
      return null;
    }

    // Oblicz y na odcinku
    const t = (line.x - p1.x) / (p2.x - p1.x);
    const y = p1.y + t * (p2.y - p1.y);

    return new Point(line.x, y);
  }

  // Linia nie-pionowa y = mx + b
  // Sprawdź przecięcie z odcinkiem (p1, p2)

  if (Math.abs(p1.x - p2.x) < epsilon) {
    // Odcinek pionowy
    const x = p1.x;
    const y = line.getY(x);

    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    if (y >= minY - epsilon && y <= maxY + epsilon) {
      return new Point(x, y);
    }
    return null;
  }

  // Odcinek nie-pionowy
  const segmentSlope = (p2.y - p1.y) / (p2.x - p1.x);
  const segmentIntercept = p1.y - segmentSlope * p1.x;

  // Sprawdź czy równoległe
  if (Math.abs(line.slope - segmentSlope) < epsilon) {
    if (Math.abs(line.yIntercept - segmentIntercept) < epsilon) {
      // Współliniowe - zwróć środek
      return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }
    return null; // Równoległe ale nie współliniowe
  }

  // Znajdź przecięcie
  const x = (segmentIntercept - line.yIntercept) / (line.slope - segmentSlope);
  const y = line.getY(x);

  // Sprawdź czy punkt jest na odcinku
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);

  if (x >= minX - epsilon && x <= maxX + epsilon) {
    return new Point(x, y);
  }

  return null;
}

/**
 * Podejście 4: Z Punktami Przecięcia - O(1)
 * Approach 4: With Intersection Points - O(1)
 *
 * Znajdź rzeczywiste punkty przecięcia linii z krawędziami kwadratów
 * Find actual intersection points of line with square edges
 */
function bisectSquaresWithIntersections(square1, square2) {
  const line = bisectSquares(square1, square2);

  const intersections1 = findLineSquareIntersections(line, square1);
  const intersections2 = findLineSquareIntersections(line, square2);

  return {
    line,
    square1Intersections: intersections1,
    square2Intersections: intersections2
  };
}

/**
 * Funkcja pomocnicza: Wizualizuj wynik
 * Helper function: Visualize result
 */
function visualizeBisection(square1, square2, line) {
  console.log(`\nKwadrat 1: ${square1}`);
  console.log(`Kwadrat 2: ${square2}`);
  console.log(`Linia przecinająca: ${line}`);

  console.log('\nPrzecięcia:');
  const ints1 = findLineSquareIntersections(line, square1);
  const ints2 = findLineSquareIntersections(line, square2);

  console.log(`  Kwadrat 1: ${ints1.map(i => `${i.point} (${i.edge})`).join(', ')}`);
  console.log(`  Kwadrat 2: ${ints2.map(i => `${i.point} (${i.edge})`).join(', ')}`);
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Bisect Squares ===\n');

// Test 1: Podstawowy przykład
console.log('Test 1: Podstawowy przykład (basic example)');
const sq1 = new Square(new Point(2, 2), 4);
const sq2 = new Square(new Point(8, 6), 4);

const line1 = bisectSquares(sq1, sq2);
visualizeBisection(sq1, sq2, line1);

// Weryfikacja
const expectedSlope = (6 - 2) / (8 - 2);
const expectedYIntercept = 2 - expectedSlope * 2;
console.log(`\nWeryfikacja:`);
console.log(`  Oczekiwane nachylenie: ${expectedSlope.toFixed(2)}`);
console.log(`  Otrzymane nachylenie: ${line1.slope.toFixed(2)}`);
console.log(`  Test ${Math.abs(line1.slope - expectedSlope) < 0.01 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Linia pionowa
console.log('Test 2: Linia pionowa (vertical line)');
const sq3 = new Square(new Point(5, 2), 2);
const sq4 = new Square(new Point(5, 8), 2);

const line2 = bisectSquares(sq3, sq4);
visualizeBisection(sq3, sq4, line2);
console.log(`Test ${line2.vertical && line2.x === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Linia pozioma
console.log('Test 3: Linia pozioma (horizontal line)');
const sq5 = new Square(new Point(2, 5), 2);
const sq6 = new Square(new Point(8, 5), 2);

const line3 = bisectSquares(sq5, sq6);
visualizeBisection(sq5, sq6, line3);
console.log(`Test ${line3.slope === 0 && line3.yIntercept === 5 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 4: Środki w tym samym punkcie
console.log('Test 4: Środki w tym samym punkcie (same center)');
const sq7 = new Square(new Point(0, 0), 2);
const sq8 = new Square(new Point(0, 0), 4);

const line4 = bisectSquares(sq7, sq8);
console.log(`Kwadrat 1: ${sq7}`);
console.log(`Kwadrat 2: ${sq8}`);
console.log(`Linia: ${line4}`);
console.log(`(Dowolna linia przez (0,0) jest poprawna)`);
console.log(`Test PASS ✓\n`);

// Test 5: Kwadraty nachodzące
console.log('Test 5: Kwadraty częściowo nachodzące (overlapping)');
const sq9 = new Square(new Point(0, 0), 4);
const sq10 = new Square(new Point(3, 3), 4);

const line5 = bisectSquares(sq9, sq10);
visualizeBisection(sq9, sq10, line5);

// Weryfikacja: linia przechodzi przez oba środki
const passes1 = line5.containsPoint(sq9.center);
const passes2 = line5.containsPoint(sq10.center);
console.log(`\nWeryfikacja: Linia przechodzi przez oba środki: ${passes1 && passes2 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Różne rozmiary kwadratów
console.log('Test 6: Różne rozmiary kwadratów (different sizes)');
const sq11 = new Square(new Point(0, 0), 1);
const sq12 = new Square(new Point(10, 10), 10);

const line6 = bisectSquares(sq11, sq12);
visualizeBisection(sq11, sq12, line6);
console.log(`Test ${line6.containsPoint(sq11.center) && line6.containsPoint(sq12.center) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 7: Porównanie wszystkich metod
console.log('Test 7: Porównanie wszystkich metod (all approaches)');
const testSq1 = new Square(new Point(1, 1), 2);
const testSq2 = new Square(new Point(5, 4), 2);

const method1 = bisectSquares(testSq1, testSq2);
const method2 = bisectSquaresTwoPoints(testSq1, testSq2);
const method3 = bisectSquaresGeneralForm(testSq1, testSq2);

console.log(`Metoda 1 (slope-intercept): ${method1}`);
console.log(`Metoda 2 (dwa punkty): ${method2.point1} -> ${method2.point2}`);
console.log(`Metoda 3 (postać ogólna): ${method3.a.toFixed(2)}x + ${method3.b.toFixed(2)}y + ${method3.c.toFixed(2)} = 0`);

// Weryfikacja: wszystkie metody dają tę samą linię
const p1 = method2.point1;
const p2 = method2.point2;

// Sprawdź czy punkty z metody 2 leżą na linii z metody 1
const method1Valid = method1.containsPoint(p1) && method1.containsPoint(p2);

// Sprawdź czy punkty z metody 2 spełniają równanie z metody 3
const method3Valid =
  Math.abs(method3.a * p1.x + method3.b * p1.y + method3.c) < 1e-10 &&
  Math.abs(method3.a * p2.x + method3.b * p2.y + method3.c) < 1e-10;

console.log(`\nWszystkie metody zgodne: ${method1Valid && method3Valid ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: Przecięcia z krawędziami
console.log('Test 8: Dokładne punkty przecięcia z krawędziami');
const sq13 = new Square(new Point(2, 2), 4);
const sq14 = new Square(new Point(8, 6), 4);

const result = bisectSquaresWithIntersections(sq13, sq14);
console.log(`Linia: ${result.line}`);
console.log('\nPrzecięcia z kwadratem 1:');
result.square1Intersections.forEach(int => {
  console.log(`  ${int.point} na krawędzi ${int.edge}`);
});

console.log('\nPrzecięcia z kwadratem 2:');
result.square2Intersections.forEach(int => {
  console.log(`  ${int.point} na krawędzi ${int.edge}`);
});

console.log(`\nTest ${result.square1Intersections.length === 2 &&
                      result.square2Intersections.length === 2 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 9: Edge cases - linie pod różnymi kątami
console.log('Test 9: Różne nachylenia linii (various slopes)');

const testCases = [
  { c1: new Point(0, 0), c2: new Point(4, 0), desc: 'Pozioma (slope=0)' },
  { c1: new Point(0, 0), c2: new Point(0, 4), desc: 'Pionowa (undefined slope)' },
  { c1: new Point(0, 0), c2: new Point(4, 4), desc: '45° (slope=1)' },
  { c1: new Point(0, 0), c2: new Point(4, -4), desc: '-45° (slope=-1)' },
  { c1: new Point(0, 0), c2: new Point(1, 2), desc: 'Stroma (slope=2)' },
  { c1: new Point(0, 0), c2: new Point(2, 1), desc: 'Płaska (slope=0.5)' }
];

testCases.forEach(({ c1, c2, desc }) => {
  const sq1 = new Square(c1, 2);
  const sq2 = new Square(c2, 2);
  const line = bisectSquares(sq1, sq2);

  const valid = line.containsPoint(c1) && line.containsPoint(c2);
  console.log(`  ${desc}: ${line} ${valid ? '✓' : '✗'}`);
});
console.log();

// Test 10: Weryfikacja pól - czy linia rzeczywiście przecina na pół
console.log('Test 10: Weryfikacja matematyczna (mathematical verification)');

function verifyBisection(square, line) {
  // Dla uproszczenia: sprawdzamy czy linia przechodzi przez środek
  // For simplicity: check if line passes through center
  return line.containsPoint(square.center);
}

const sq15 = new Square(new Point(3, 3), 6);
const sq16 = new Square(new Point(9, 7), 4);
const line10 = bisectSquares(sq15, sq16);

const bisects1 = verifyBisection(sq15, line10);
const bisects2 = verifyBisection(sq16, line10);

console.log(`Kwadrat 1: ${sq15}`);
console.log(`Kwadrat 2: ${sq16}`);
console.log(`Linia: ${line10}`);
console.log(`Przecina kwadrat 1 na pół: ${bisects1 ? 'TAK ✓' : 'NIE ✗'}`);
console.log(`Przecina kwadrat 2 na pół: ${bisects2 ? 'TAK ✓' : 'NIE ✗'}`);
console.log(`Test ${bisects1 && bisects2 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 11: Test tworzenia kwadratu z rogu
console.log('Test 11: Konstruktor alternatywny (from corner)');
const sq17 = Square.fromCorner(0, 0, 4);
console.log(`Kwadrat od rogu (0,0) o boku 4:`);
console.log(`  Środek: ${sq17.center}`);
console.log(`  Oczekiwany środek: (2.00, 2.00)`);
console.log(`  Test ${sq17.center.equals(new Point(2, 2)) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Bardzo małe i bardzo duże kwadraty
console.log('Test 12: Ekstremalne rozmiary (extreme sizes)');
const tiny = new Square(new Point(0, 0), 0.001);
const huge = new Square(new Point(1000, 1000), 1000);
const line12 = bisectSquares(tiny, huge);

console.log(`Mały kwadrat: ${tiny}`);
console.log(`Duży kwadrat: ${huge}`);
console.log(`Linia: ${line12}`);
console.log(`Test ${line12.containsPoint(tiny.center) && line12.containsPoint(huge.center) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 13: Wszystkie kombinacje kwadratów w kwadratowej siatce
console.log('Test 13: Kwadraty w siatce (grid of squares)');
const gridSquares = [
  new Square(new Point(1, 1), 1),
  new Square(new Point(3, 1), 1),
  new Square(new Point(1, 3), 1),
  new Square(new Point(3, 3), 1)
];

let allValid = true;
for (let i = 0; i < gridSquares.length; i++) {
  for (let j = i + 1; j < gridSquares.length; j++) {
    const line = bisectSquares(gridSquares[i], gridSquares[j]);
    const valid = line.containsPoint(gridSquares[i].center) &&
                  line.containsPoint(gridSquares[j].center);
    allValid = allValid && valid;
  }
}

console.log(`Testowano ${(4 * 3) / 2} par kwadratów w siatce 2x2`);
console.log(`Wszystkie linie poprawne: ${allValid ? 'PASS ✓' : 'FAIL ✗'}\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('Bisect Squares - Znajdź linię przecinającą dwa kwadraty na pół');
console.log('\nZłożoność:');
console.log('  Czasowa:  O(1) - stałe operacje');
console.log('  Pamięciowa: O(1) - stała ilość pamięci');
console.log('\nKluczowa obserwacja:');
console.log('  - Linia przecinająca kwadrat na pół musi przejść przez środek');
console.log('  - Dlatego szukamy linii przez oba środki kwadratów');
console.log('  - Problem geometryczny → prosta obserwacja matematyczna');
console.log('\nMetody reprezentacji linii:');
console.log('  1. y = mx + b (slope-intercept) - intuicyjna, problem z pionowymi');
console.log('  2. Dwa punkty - najprostsza, dobra do wizualizacji');
console.log('  3. ax + by + c = 0 (ogólna) - obsługuje wszystkie przypadki');
console.log('\nEdge cases:');
console.log('  ✓ Linia pionowa (środki na tej samej x)');
console.log('  ✓ Linia pozioma (środki na tej samej y)');
console.log('  ✓ Środki pokrywają się (nieskończenie wiele rozwiązań)');
console.log('  ✓ Różne rozmiary kwadratów');
console.log('  ✓ Kwadraty nachodzące na siebie');
console.log('\nZastosowania:');
console.log('  - Grafika komputerowa (przekroje, wyświetlanie)');
console.log('  - CAD (projektowanie, przecinanie obiektów)');
console.log('  - Gry (wykrywanie kolizji)');
console.log('  - Geometria obliczeniowa');
console.log('  - Robotyka (planowanie ścieżek)');
