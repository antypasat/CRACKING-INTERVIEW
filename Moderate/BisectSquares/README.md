# 16.13 Bisect Squares

## Opis Zadania / Problem Description

**Bisect Squares**: Given two squares on a two-dimensional plane, find a line that would cut these two squares in half. Assume that the top and the bottom sides of the square run parallel to the x-axis.

**Przecięcie Kwadratów**: Mając dwa kwadraty na płaszczyźnie dwuwymiarowej, znajdź linię, która przecięłaby oba kwadraty na pół. Załóż, że górne i dolne boki kwadratu są równoległe do osi x.

Hints: #468, #479, #528, #560

## Wyjaśnienie Problemu / Problem Explanation

Aby przeciąć kwadrat na pół (na dwie równe części), linia musi przechodzić przez **środek kwadratu**. Dlatego:

To cut a square in half (into two equal parts), the line must pass through the **center of the square**. Therefore:

**Kluczowa obserwacja / Key observation**:
- Linia przecinająca oba kwadraty na pół musi przechodzić przez **oba środki**
- The line that bisects both squares must pass through **both centers**
- Wystarczy znaleźć linię przechodzącą przez dwa środki kwadratów
- We just need to find the line passing through the two square centers

**Reprezentacja kwadratu / Square representation**:
```
Kwadrat: środek (cx, cy) i bok o długości s
Square: center (cx, cy) and side length s

Wierzchołki / Vertices:
  (cx - s/2, cy + s/2)  ----  (cx + s/2, cy + s/2)
         |                            |
         |         (cx, cy)           |
         |                            |
  (cx - s/2, cy - s/2)  ----  (cx + s/2, cy - s/2)
```

**Reprezentacja linii / Line representation**:
- **Postać kierunkowa / Slope-intercept form**: `y = mx + b` gdzie m = slope, b = y-intercept
- **Postać ogólna / General form**: `ax + by + c = 0`
- **Postać parametryczna / Parametric form**: `(x, y) = (x1, y1) + t(dx, dy)`

## Rozwiązania / Solutions

### Podejście 1: Geometryczne (przez Środki) - O(1) ✓ OPTYMALNE

**Idea**:
1. Oblicz środki obu kwadratów
2. Znajdź linię przechodzącą przez te dwa punkty
3. Handle edge case gdy środki się pokrywają

**Idea**:
1. Calculate centers of both squares
2. Find line passing through these two points
3. Handle edge case when centers coincide

```javascript
function bisectSquares(square1, square2) {
  const center1 = getCenter(square1);
  const center2 = getCenter(square2);

  // Edge case: środki w tym samym punkcie
  // Edge case: centers at same point
  if (center1.x === center2.x && center1.y === center2.y) {
    // Dowolna linia przez środek
    // Any line through center
    return { slope: 0, yIntercept: center1.y };
  }

  // Edge case: linia pionowa
  // Edge case: vertical line
  if (center1.x === center2.x) {
    return { vertical: true, x: center1.x };
  }

  // Oblicz nachylenie i przesunięcie
  // Calculate slope and y-intercept
  const slope = (center2.y - center1.y) / (center2.x - center1.x);
  const yIntercept = center1.y - slope * center1.x;

  return { slope, yIntercept };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(1)
- Pamięciowa / Space: O(1)

### Podejście 2: Zwróć Dwa Punkty - O(1)

**Idea**: Zamiast równania linii, zwróć dwa punkty przez które przechodzi linia.

**Idea**: Instead of line equation, return two points the line passes through.

```javascript
function bisectSquaresTwoPoints(square1, square2) {
  const center1 = getCenter(square1);
  const center2 = getCenter(square2);

  // Zwróć środki jako dwa punkty definiujące linię
  // Return centers as two points defining the line
  return { point1: center1, point2: center2 };
}
```

**Zalety / Advantages**:
- Prostsze / Simpler
- Unika problemów z linią pionową / Avoids vertical line issues
- Unika problemów z precyzją / Avoids precision issues

### Podejście 3: Postać Ogólna Linii - O(1)

**Idea**: Użyj postaci ogólnej `ax + by + c = 0` która nie ma problemu z liniami pionowymi.

**Idea**: Use general form `ax + by + c = 0` which has no issue with vertical lines.

```javascript
function bisectSquaresGeneralForm(square1, square2) {
  const center1 = getCenter(square1);
  const center2 = getCenter(square2);

  // Postać ogólna: ax + by + c = 0
  // General form: ax + by + c = 0
  // gdzie wektor (a, b) jest prostopadły do linii
  // where vector (a, b) is perpendicular to line

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
```

### Podejście 4: Z Punktami Przecięcia - O(1)

**Idea**: Znajdź rzeczywiste punkty gdzie linia przecina krawędzie kwadratów.

**Idea**: Find actual points where line intersects square edges.

```javascript
function bisectSquaresWithIntersections(square1, square2) {
  const line = bisectSquares(square1, square2);

  // Znajdź przecięcia z kwadratem 1
  const intersections1 = findLineSquareIntersections(line, square1);

  // Znajdź przecięcia z kwadratem 2
  const intersections2 = findLineSquareIntersections(line, square2);

  return {
    line,
    square1Intersections: intersections1,
    square2Intersections: intersections2
  };
}
```

## Szczególne Przypadki / Edge Cases

### 1. Środki Pokrywają Się
```javascript
// Kwadraty o tym samym środku
// Squares with same center
square1 = { center: (0, 0), size: 2 }
square2 = { center: (0, 0), size: 4 }
// Rozwiązanie: nieskończenie wiele linii przez (0, 0)
// Solution: infinitely many lines through (0, 0)
```

### 2. Linia Pionowa
```javascript
// Środki na tej samej współrzędnej x
// Centers at same x-coordinate
center1 = (5, 2)
center2 = (5, 8)
// Rozwiązanie: x = 5 (nie można użyć y = mx + b)
// Solution: x = 5 (cannot use y = mx + b)
```

### 3. Linia Pozioma
```javascript
// Środki na tej samej współrzędnej y
// Centers at same y-coordinate
center1 = (2, 5)
center2 = (8, 5)
// Rozwiązanie: y = 5 (slope = 0)
// Solution: y = 5 (slope = 0)
```

### 4. Kwadraty Nachodzą na Siebie
```javascript
// Kwadraty częściowo nakładają się
// Squares partially overlap
// Linia nadal przechodzi przez oba środki
// Line still passes through both centers
```

### 5. Bardzo Małe/Duże Kwadraty
```javascript
// Jeden mały, jeden duży
// One small, one large
square1 = { center: (0, 0), size: 0.01 }
square2 = { center: (100, 100), size: 1000 }
// Linia nadal przez oba środki
// Line still through both centers
```

## Analiza Matematyczna / Mathematical Analysis

### Dlaczego Linia przez Środki?

**Twierdzenie / Theorem**:
Linia przecina kwadrat na dwie równe części wtedy i tylko wtedy, gdy przechodzi przez środek kwadratu.

A line cuts a square into two equal parts if and only if it passes through the square's center.

**Dowód / Proof**:
1. Kwadrat ma symetrię względem środka
   Square has symmetry about its center
2. Każda linia przez środek dzieli kwadrat na dwie symetryczne części
   Any line through center divides square into two symmetric parts
3. Symetryczne części mają równe pola
   Symmetric parts have equal areas

### Obliczenia Linii / Line Calculations

**Mając dwa punkty** `P1(x1, y1)` i `P2(x2, y2)`:

**Given two points** `P1(x1, y1)` and `P2(x2, y2)`:

1. **Nachylenie / Slope**:
```
m = (y2 - y1) / (x2 - x1)
```

2. **Y-intercept** (punkt przecięcia z osią y):
```
b = y1 - m * x1
```

3. **Równanie linii / Line equation**:
```
y = mx + b
```

4. **Postać ogólna / General form**:
```
(y2 - y1)x - (x2 - x1)y + (x2 - x1)y1 - (y2 - y1)x1 = 0
```

### Punkt na Linii / Point on Line

Sprawdź czy punkt `(x, y)` leży na linii `y = mx + b`:
```javascript
function isPointOnLine(point, line, epsilon = 1e-10) {
  if (line.vertical) {
    return Math.abs(point.x - line.x) < epsilon;
  }
  return Math.abs(point.y - (line.slope * point.x + line.yIntercept)) < epsilon;
}
```

### Odległość Punktu od Linii / Distance from Point to Line

Dla linii `ax + by + c = 0` i punktu `(x0, y0)`:
```
distance = |ax0 + by0 + c| / √(a² + b²)
```

## Rozszerzenia / Extensions

### 1. Dla Prostokątów
```javascript
// Linia nadal przez środki
// Line still through centers
function bisectRectangles(rect1, rect2) {
  // Identyczny algorytm
  // Identical algorithm
}
```

### 2. Dla Okręgów
```javascript
// Linia przez środki okręgów
// Line through circle centers
function bisectCircles(circle1, circle2) {
  // Identyczny algorytm
  // Identical algorithm
}
```

### 3. Dla Trójkątów
```javascript
// Trudniejsze - nie każda linia przez środek ciężkości dzieli na pół
// Harder - not every line through centroid bisects
// Potrzebujemy bardziej skomplikowanego algorytmu
// Need more complex algorithm
```

### 4. Dla 3D (Sześciany)
```javascript
// Płaszczyzna przez środki dwóch sześcianów
// Plane through centers of two cubes
function bisectCubes(cube1, cube2) {
  // Nieskończenie wiele płaszczyzn przez linię łączącą środki
  // Infinitely many planes through line connecting centers
}
```

## Wizualizacja / Visualization

```
Przykład / Example:

Square 1:                    Square 2:
  (0,4)---(4,4)               (6,8)---(10,8)
    |       |                   |       |
    | (2,2) |                   | (8,6) |
    |       |                   |       |
  (0,0)---(4,0)               (6,4)---(10,4)

Środki / Centers: (2,2) i (8,6)
Nachylenie / Slope: m = (6-2)/(8-2) = 4/6 = 2/3
Y-intercept: b = 2 - (2/3)*2 = 2/3
Równanie / Equation: y = (2/3)x + 2/3

Linia przecina / Line cuts:
  - Kwadrat 1 w punktach: ~(0, 0.67), (4, 3.33)
  - Kwadrat 2 w punktach: ~(6, 4.67), (10, 7.33)
```

## Porównanie Reprezentacji Linii / Line Representation Comparison

| Reprezentacja | Zalety | Wady | Przypadki użycia |
|---------------|--------|------|------------------|
| y = mx + b | Intuicyjna | Nie obsługuje linii pionowych | Większość przypadków |
| ax + by + c = 0 | Obsługuje wszystkie linie | Mniej intuicyjna | Przypadki ogólne |
| Dwa punkty | Najprostrza | Wymaga dwóch punktów | Implementacja, wizualizacja |
| Parametryczna | Dobra do obliczeń | Bardziej złożona | Ray tracing, animacje |

## Zastosowania / Applications

1. **Grafika komputerowa**: Wyświetlanie przekrojów
2. **CAD**: Projektowanie i przecinanie obiektów
3. **Gry**: Wykrywanie kolizji i przecięć
4. **Geometria obliczeniowa**: Podstawowy building block
5. **Robotyka**: Planowanie ścieżek

## Wnioski / Conclusions

Bisect Squares to doskonały przykład:
1. **Simplification przez geometrię**: Skomplikowany problem → prosta obserwacja
2. **Symetria**: Wykorzystanie symetrii kwadratu
3. **Edge cases**: Obsługa linii pionowych i pokrywających się punktów
4. **Reprezentacja danych**: Różne sposoby reprezentacji linii

Bisect Squares is an excellent example of:
1. **Simplification through geometry**: Complex problem → simple observation
2. **Symmetry**: Using square's symmetry
3. **Edge cases**: Handling vertical lines and coinciding points
4. **Data representation**: Different ways to represent lines
