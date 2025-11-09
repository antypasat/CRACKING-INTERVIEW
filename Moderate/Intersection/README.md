# 16.3 Intersection

## Opis Zadania / Problem Description

**Intersection**: Given two straight line segments (represented as a start point and an end point), compute the point of intersection, if any.

**Przecięcie**: Mając dwa odcinki linii prostej (reprezentowane jako punkt początkowy i końcowy), oblicz punkt przecięcia, jeśli istnieje.

Hints: #465, #472, #497, #517, #527

## Wyjaśnienie Problemu / Problem Explanation

Problem polega na znalezieniu punktu przecięcia dwóch odcinków na płaszczyźnie 2D. Odcinek jest zdefiniowany przez dwa punkty (x1, y1) i (x2, y2).

The problem is to find the intersection point of two line segments in 2D plane. A segment is defined by two points (x1, y1) and (x2, y2).

### Kluczowe Przypadki / Key Cases:

1. **Odcinki się przecinają** - zwróć punkt przecięcia / Segments intersect - return intersection point
2. **Odcinki są równoległe** - brak przecięcia / Segments are parallel - no intersection
3. **Odcinki są współliniowe i nakładają się** - nieskończenie wiele punktów / Segments are collinear and overlap - infinite points
4. **Odcinki nie przecinają się** - brak przecięcia / Segments don't intersect - no intersection

## Podejście / Approach

### Matematyka / Mathematics

Dla dwóch odcinków:
- Odcinek 1: od punktu p1 do p2
- Odcinek 2: od punktu p3 do p4

Możemy przedstawić każdy odcinek w postaci parametrycznej:
- Punkt na odcinku 1: P = p1 + t * (p2 - p1), gdzie 0 ≤ t ≤ 1
- Punkt na odcinku 2: Q = p3 + u * (p4 - p3), gdzie 0 ≤ u ≤ 1

Szukamy P = Q, czyli:
p1 + t * (p2 - p1) = p3 + u * (p4 - p3)

Rozwiązując dla t i u, sprawdzamy czy 0 ≤ t ≤ 1 oraz 0 ≤ u ≤ 1.

## Rozwiązanie / Solution

### Kroki Algorytmu / Algorithm Steps:

1. Oblicz kierunek każdego odcinka / Calculate direction of each segment
2. Sprawdź czy odcinki są równoległe / Check if segments are parallel
3. Jeśli nie są równoległe, oblicz parametry t i u / If not parallel, calculate parameters t and u
4. Sprawdź czy t i u są w przedziale [0, 1] / Check if t and u are in range [0, 1]
5. Jeśli tak, oblicz i zwróć punkt przecięcia / If yes, calculate and return intersection point

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function findIntersection(p1, p2, p3, p4) {
  // Wektory kierunkowe / Direction vectors
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;

  // Wyznacznik (sprawdza równoległość) / Determinant (checks parallelism)
  const det = dx1 * dy2 - dy1 * dx2;

  // Jeśli det = 0, odcinki są równoległe
  // If det = 0, segments are parallel
  if (Math.abs(det) < 1e-10) {
    return checkCollinearIntersection(p1, p2, p3, p4);
  }

  // Oblicz parametry t i u
  // Calculate parameters t and u
  const dx3 = p3.x - p1.x;
  const dy3 = p3.y - p1.y;

  const t = (dx3 * dy2 - dy3 * dx2) / det;
  const u = (dx3 * dy1 - dy3 * dx1) / det;

  // Sprawdź czy przecięcie jest w obu odcinkach
  // Check if intersection is within both segments
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return new Point(
      p1.x + t * dx1,
      p1.y + t * dy1
    );
  }

  return null; // Brak przecięcia / No intersection
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(1)
- Pamięciowa / Space: O(1)
