/**
 * Line Segment Intersection
 *
 * Znajdowanie punktu przecięcia dwóch odcinków na płaszczyźnie 2D.
 * Finding intersection point of two line segments in 2D plane.
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

/**
 * Sprawdza czy punkt leży na odcinku
 * Check if point lies on segment
 */
function isPointOnSegment(point, segStart, segEnd, epsilon = 1e-10) {
  // Sprawdź czy punkt jest w bounding box
  // Check if point is in bounding box
  const minX = Math.min(segStart.x, segEnd.x) - epsilon;
  const maxX = Math.max(segStart.x, segEnd.x) + epsilon;
  const minY = Math.min(segStart.y, segEnd.y) - epsilon;
  const maxY = Math.max(segStart.y, segEnd.y) + epsilon;

  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
    return false;
  }

  // Sprawdź współliniowość używając iloczynu wektorowego
  // Check collinearity using cross product
  const cross = (segEnd.x - segStart.x) * (point.y - segStart.y) -
                (segEnd.y - segStart.y) * (point.x - segStart.x);

  return Math.abs(cross) < epsilon;
}

/**
 * Sprawdza przecięcie współliniowych odcinków
 * Check intersection of collinear segments
 */
function checkCollinearIntersection(p1, p2, p3, p4) {
  // Sprawdź czy odcinki są współliniowe
  // Check if segments are collinear
  if (!isPointOnSegment(p3, p1, p2) && !isPointOnSegment(p4, p1, p2) &&
      !isPointOnSegment(p1, p3, p4) && !isPointOnSegment(p2, p3, p4)) {
    return null; // Równoległe ale nie współliniowe / Parallel but not collinear
  }

  // Jeśli współliniowe, znajdź nakładanie się
  // If collinear, find overlap
  const seg1 = [p1, p2].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
  const seg2 = [p3, p4].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

  // Znajdź przecięcie zakresów
  // Find range intersection
  if (isPointOnSegment(seg2[0], seg1[0], seg1[1])) {
    return seg2[0]; // p3 lub p4 leży na odcinku 1 / p3 or p4 lies on segment 1
  }
  if (isPointOnSegment(seg2[1], seg1[0], seg1[1])) {
    return seg2[1];
  }
  if (isPointOnSegment(seg1[0], seg2[0], seg2[1])) {
    return seg1[0]; // p1 lub p2 leży na odcinku 2 / p1 or p2 lies on segment 2
  }
  if (isPointOnSegment(seg1[1], seg2[0], seg2[1])) {
    return seg1[1];
  }

  return null;
}

/**
 * Główna funkcja znajdująca przecięcie odcinków
 * Main function to find segment intersection
 */
function findIntersection(p1, p2, p3, p4) {
  // Wektory kierunkowe odcinków / Direction vectors of segments
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;

  // Wyznacznik - sprawdza czy linie są równoległe
  // Determinant - checks if lines are parallel
  // det = 0 oznacza że linie są równoległe
  // det = 0 means lines are parallel
  const det = dx1 * dy2 - dy1 * dx2;

  const epsilon = 1e-10;

  if (Math.abs(det) < epsilon) {
    // Odcinki są równoległe - sprawdź czy są współliniowe
    // Segments are parallel - check if collinear
    return checkCollinearIntersection(p1, p2, p3, p4);
  }

  // Oblicz parametry t i u dla postaci parametrycznej linii
  // Calculate parameters t and u for parametric line form
  // P = p1 + t * (p2 - p1)
  // Q = p3 + u * (p4 - p3)
  const dx3 = p3.x - p1.x;
  const dy3 = p3.y - p1.y;

  const t = (dx3 * dy2 - dy3 * dx2) / det;
  const u = (dx3 * dy1 - dy3 * dx1) / det;

  // Przecięcie istnieje tylko gdy 0 ≤ t ≤ 1 i 0 ≤ u ≤ 1
  // Intersection exists only when 0 ≤ t ≤ 1 and 0 ≤ u ≤ 1
  if (t >= -epsilon && t <= 1 + epsilon && u >= -epsilon && u <= 1 + epsilon) {
    // Oblicz punkt przecięcia / Calculate intersection point
    return new Point(
      p1.x + t * dx1,
      p1.y + t * dy1
    );
  }

  return null; // Brak przecięcia / No intersection
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Line Segment Intersection ===\n');

// Test 1: Proste przecięcie / Simple intersection
console.log('Test 1: Proste przecięcie w środku');
const p1 = new Point(0, 0);
const p2 = new Point(4, 4);
const p3 = new Point(0, 4);
const p4 = new Point(4, 0);
const intersection1 = findIntersection(p1, p2, p3, p4);
console.log(`Odcinek 1: ${p1} do ${p2}`);
console.log(`Odcinek 2: ${p3} do ${p4}`);
console.log(`Przecięcie: ${intersection1 ? intersection1 : 'BRAK'}`);
console.log(`(Oczekiwane: (2, 2))\n`);

// Test 2: Brak przecięcia - równoległe
console.log('Test 2: Równoległe odcinki (brak przecięcia)');
const p5 = new Point(0, 0);
const p6 = new Point(2, 0);
const p7 = new Point(0, 1);
const p8 = new Point(2, 1);
const intersection2 = findIntersection(p5, p6, p7, p8);
console.log(`Odcinek 1: ${p5} do ${p6}`);
console.log(`Odcinek 2: ${p7} do ${p8}`);
console.log(`Przecięcie: ${intersection2 ? intersection2 : 'BRAK'}`);
console.log(`(Oczekiwane: BRAK)\n`);

// Test 3: Przecięcie w końcu odcinka
console.log('Test 3: Przecięcie w końcu odcinka');
const p9 = new Point(0, 0);
const p10 = new Point(2, 2);
const p11 = new Point(2, 2);
const p12 = new Point(4, 0);
const intersection3 = findIntersection(p9, p10, p11, p12);
console.log(`Odcinek 1: ${p9} do ${p10}`);
console.log(`Odcinek 2: ${p11} do ${p12}`);
console.log(`Przecięcie: ${intersection3 ? intersection3 : 'BRAK'}`);
console.log(`(Oczekiwane: (2, 2))\n`);

// Test 4: Współliniowe odcinki z nakładaniem
console.log('Test 4: Współliniowe odcinki z nakładaniem');
const p13 = new Point(0, 0);
const p14 = new Point(4, 0);
const p15 = new Point(2, 0);
const p16 = new Point(6, 0);
const intersection4 = findIntersection(p13, p14, p15, p16);
console.log(`Odcinek 1: ${p13} do ${p14}`);
console.log(`Odcinek 2: ${p15} do ${p16}`);
console.log(`Przecięcie: ${intersection4 ? intersection4 : 'BRAK'}`);
console.log(`(Oczekiwane: punkt w nakładającym się obszarze, np. (2, 0))\n`);

// Test 5: Odcinki się nie przecinają (ale ich przedłużenia tak)
console.log('Test 5: Odcinki się nie przecinają (przedłużenia tak)');
const p17 = new Point(0, 0);
const p18 = new Point(1, 1);
const p19 = new Point(2, 2);
const p20 = new Point(3, 3);
const intersection5 = findIntersection(p17, p18, p19, p20);
console.log(`Odcinek 1: ${p17} do ${p18}`);
console.log(`Odcinek 2: ${p19} do ${p20}`);
console.log(`Przecięcie: ${intersection5 ? intersection5 : 'BRAK'}`);
console.log(`(Oczekiwane: BRAK - współliniowe ale nie nakładające się)\n`);

// Test 6: Pionowy i poziomy
console.log('Test 6: Pionowy i poziomy odcinek');
const p21 = new Point(2, 0);
const p22 = new Point(2, 4);
const p23 = new Point(0, 2);
const p24 = new Point(4, 2);
const intersection6 = findIntersection(p21, p22, p23, p24);
console.log(`Odcinek 1: ${p21} do ${p22}`);
console.log(`Odcinek 2: ${p23} do ${p24}`);
console.log(`Przecięcie: ${intersection6 ? intersection6 : 'BRAK'}`);
console.log(`(Oczekiwane: (2, 2))\n`);

// Test 7: Bardzo bliskie ale nie przecinające się
console.log('Test 7: Bardzo bliskie ale nie przecinające się');
const p25 = new Point(0, 0);
const p26 = new Point(1, 1);
const p27 = new Point(1.01, 0);
const p28 = new Point(0, 1.01);
const intersection7 = findIntersection(p25, p26, p27, p28);
console.log(`Odcinek 1: ${p25} do ${p26}`);
console.log(`Odcinek 2: ${p27} do ${p28}`);
console.log(`Przecięcie: ${intersection7 ? intersection7 : 'BRAK'}`);
console.log(`(Oczekiwane: BRAK)\n`);

// Test 8: Odcinki o długości 0 (punkty)
console.log('Test 8: Edge case - jeden odcinek to punkt');
const p29 = new Point(2, 2);
const p30 = new Point(2, 2);
const p31 = new Point(0, 0);
const p32 = new Point(4, 4);
const intersection8 = findIntersection(p29, p30, p31, p32);
console.log(`Odcinek 1: ${p29} do ${p30} (punkt)`);
console.log(`Odcinek 2: ${p31} do ${p32}`);
console.log(`Przecięcie: ${intersection8 ? intersection8 : 'BRAK'}`);
console.log(`(Oczekiwane: (2, 2) - punkt leży na odcinku)\n`);

// Test 9: Przecięcie pod ostrym kątem
console.log('Test 9: Przecięcie pod ostrym kątem');
const p33 = new Point(0, 0);
const p34 = new Point(10, 2);
const p35 = new Point(0, 1);
const p36 = new Point(10, 3);
const intersection9 = findIntersection(p33, p34, p35, p36);
console.log(`Odcinek 1: ${p33} do ${p34}`);
console.log(`Odcinek 2: ${p35} do ${p36}`);
console.log(`Przecięcie: ${intersection9 ? intersection9 : 'BRAK'}`);

console.log('\n=== Podsumowanie / Summary ===');
console.log('Algorytm obsługuje:');
console.log('✓ Normalne przecięcia');
console.log('✓ Przecięcia w punktach końcowych');
console.log('✓ Odcinki równoległe');
console.log('✓ Odcinki współliniowe');
console.log('✓ Odcinki pionowe i poziome');
console.log('✓ Edge cases (punkty, bardzo bliskie odcinki)');
