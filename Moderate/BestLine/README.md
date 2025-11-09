# 16.14 Best Line

## Opis Zadania / Problem Description

**Best Line**: Given a two-dimensional graph with points on it, find a line which passes the most number of points.

**Najlepsza Linia**: Mając dwuwymiarowy wykres z punktami na nim, znajdź linię, która przechodzi przez największą liczbę punktów.

Hints: #491, #520, #529

## Wyjaśnienie Problemu / Problem Explanation

Mamy zbiór punktów na płaszczyźnie 2D. Musimy znaleźć linię prostą, która przechodzi przez jak największą liczbę tych punktów.

We have a set of points on 2D plane. We must find a straight line that passes through as many of these points as possible.

**Przykład / Example**:
```
Punkty: (0,0), (1,1), (2,2), (3,1), (3,3)

  3 |     *     *
  2 |   *
  1 |  *      *
  0 | *
    +------------
      0  1  2  3

Linia y = x przechodzi przez: (0,0), (1,1), (2,2), (3,3) → 4 punkty
Line y = x passes through: (0,0), (1,1), (2,2), (3,3) → 4 points
```

**Kluczowe Obserwacje / Key Observations**:
1. Dwa punkty **zawsze** definiują dokładnie jedną linię
2. Jeśli mamy n punktów, możliwych linii jest O(n²)
3. Musimy zliczać punkty na każdej możliwej linii

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n³)

**Idea**: Sprawdź wszystkie pary punktów, dla każdej linii policz ile punktów leży na niej.

**Idea**: Check all pairs of points, for each line count how many points lie on it.

```javascript
function bestLineBruteForce(points) {
  if (points.length <= 2) return points;

  let maxPoints = 0;
  let bestLine = null;

  // Dla każdej pary punktów (i, j)
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const line = getLine(points[i], points[j]);
      let count = 0;

      // Policz ile punktów leży na tej linii
      for (let k = 0; k < points.length; k++) {
        if (isOnLine(points[k], line)) {
          count++;
        }
      }

      if (count > maxPoints) {
        maxPoints = count;
        bestLine = line;
      }
    }
  }

  return { line: bestLine, count: maxPoints };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n³) - n² par × n punktów do sprawdzenia
- Pamięciowa / Space: O(1)

### Podejście 2: Hash Map - O(n²) ✓ OPTYMALNE

**Idea**: Dla każdego punktu P, oblicz nachylenie do wszystkich innych punktów. Punkty o tym samym nachyleniu leżą na tej samej linii.

**Idea**: For each point P, calculate slope to all other points. Points with same slope lie on same line.

**Problem**: Jak reprezentować nachylenie?
- **Problem**: How to represent slope?
- Nie możemy użyć `double` (problemy z precyzją)
- Cannot use `double` (precision issues)
- Używamy `(dy/dx)` jako ułamka w postaci nieskracalnej
- Use `(dy/dx)` as fraction in reduced form

```javascript
function bestLineHashMap(points) {
  if (points.length <= 2) return points;

  let maxPoints = 0;
  let bestLine = null;

  for (let i = 0; i < points.length; i++) {
    const slopeMap = new Map();
    let samePoint = 0;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      if (points[i].equals(points[j])) {
        samePoint++;
      } else {
        const slope = getSlope(points[i], points[j]);
        const key = slopeToKey(slope);

        slopeMap.set(key, (slopeMap.get(key) || 0) + 1);
      }
    }

    // Znajdź najczęstsze nachylenie
    for (const [key, count] of slopeMap.entries()) {
      const total = count + samePoint + 1; // +1 dla punktu bazowego
      if (total > maxPoints) {
        maxPoints = total;
        bestLine = reconstructLine(points[i], keyToSlope(key));
      }
    }
  }

  return { line: bestLine, count: maxPoints };
}

// Oblicz nachylenie jako ułamek nieskracalny
function getSlope(p1, p2) {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;

  if (dx === 0) return { vertical: true };

  const gcd = greatestCommonDivisor(Math.abs(dy), Math.abs(dx));
  return {
    dy: dy / gcd,
    dx: dx / gcd,
    vertical: false
  };
}

function slopeToKey(slope) {
  if (slope.vertical) return 'VERTICAL';
  return `${slope.dy}/${slope.dx}`;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n²) - dla każdego punktu sprawdzamy wszystkie inne
- Pamięciowa / Space: O(n) - hash mapa dla każdego punktu

### Podejście 3: Sortowanie Kątowe - O(n² log n)

**Idea**: Dla każdego punktu, posortuj inne punkty według kąta. Punkty na tej samej linii będą obok siebie.

**Idea**: For each point, sort other points by angle. Points on same line will be adjacent.

```javascript
function bestLineAngleSort(points) {
  if (points.length <= 2) return points;

  let maxPoints = 0;
  let bestLine = null;

  for (let i = 0; i < points.length; i++) {
    const angles = [];

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      const angle = Math.atan2(
        points[j].y - points[i].y,
        points[j].x - points[i].x
      );
      angles.push({ angle, point: points[j] });
    }

    // Sortuj po kącie
    angles.sort((a, b) => a.angle - b.angle);

    // Zlicz kolejne punkty o tym samym kącie
    let count = 1;
    for (let k = 1; k < angles.length; k++) {
      if (Math.abs(angles[k].angle - angles[k-1].angle) < 1e-10) {
        count++;
      } else {
        count = 1;
      }

      if (count + 1 > maxPoints) { // +1 dla punktu bazowego
        maxPoints = count + 1;
      }
    }
  }

  return maxPoints;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n² log n)
- Pamięciowa / Space: O(n)

### Podejście 4: Geometryczne (Porównanie Wektorów) - O(n²)

**Idea**: Używaj iloczynu wektorowego do sprawdzania współliniowości.

**Idea**: Use cross product to check collinearity.

```javascript
function areCollinear(p1, p2, p3) {
  // Iloczyn wektorowy (p2-p1) × (p3-p1)
  // Cross product (p2-p1) × (p3-p1)
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p3.x - p1.x;
  const dy2 = p3.y - p1.y;

  return Math.abs(dx1 * dy2 - dy1 * dx2) < 1e-10;
}

function bestLineGeometric(points) {
  if (points.length <= 2) return points;

  let maxPoints = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let count = 2; // p[i] i p[j]

      for (let k = 0; k < points.length; k++) {
        if (k === i || k === j) continue;

        if (areCollinear(points[i], points[j], points[k])) {
          count++;
        }
      }

      maxPoints = Math.max(maxPoints, count);
    }
  }

  return maxPoints;
}
```

## Szczególne Przypadki / Edge Cases

### 1. Wszystkie Punkty Współliniowe
```javascript
points = [(0,0), (1,1), (2,2), (3,3)]
// Wszystkie na linii y = x
// All on line y = x
result = 4 punkty
```

### 2. Żadne Trzy Punkty Współliniowe
```javascript
points = [(0,0), (1,2), (3,1), (2,4)]
// Maksymalnie 2 punkty (każda para)
// Maximum 2 points (any pair)
result = 2 punkty
```

### 3. Punkty Powtarzające Się
```javascript
points = [(1,1), (1,1), (2,2), (3,3)]
// Duplikaty powinny być zliczane
// Duplicates should be counted
result = 4 punkty (wszystkie na y = x)
```

### 4. Linia Pionowa
```javascript
points = [(5,1), (5,2), (5,3), (5,4)]
// x = 5 (nieskończone nachylenie)
// x = 5 (infinite slope)
result = 4 punkty
```

### 5. Linia Pozioma
```javascript
points = [(1,5), (2,5), (3,5), (4,5)]
// y = 5 (nachylenie = 0)
// y = 5 (slope = 0)
result = 4 punkty
```

### 6. Mniej niż 3 Punkty
```javascript
points = [(0,0), (1,1)]
// Tylko jedna linia możliwa
// Only one line possible
result = 2 punkty
```

## Problemy z Precyzją / Precision Issues

### Problem z Float Comparison

```javascript
// ZŁE! / BAD!
const slope1 = (3 - 0) / (2 - 0);  // 1.5
const slope2 = (6 - 0) / (4 - 0);  // 1.5
// Mogą się różnić z powodu precyzji zmiennoprzecinkowej
// May differ due to floating point precision
```

### Rozwiązanie 1: Epsilon Comparison
```javascript
function equalSlopes(s1, s2, epsilon = 1e-10) {
  return Math.abs(s1 - s2) < epsilon;
}
```

### Rozwiązanie 2: Ułamki (GCD) ✓ NAJLEPSZE
```javascript
function getSlope(p1, p2) {
  let dy = p2.y - p1.y;
  let dx = p2.x - p1.x;

  if (dx === 0) return { vertical: true };

  // Normalizuj znak
  if (dx < 0) {
    dx = -dx;
    dy = -dy;
  }

  const gcd = greatestCommonDivisor(Math.abs(dy), Math.abs(dx));
  return { dy: dy / gcd, dx: dx / gcd };
}

function greatestCommonDivisor(a, b) {
  if (b === 0) return a;
  return greatestCommonDivisor(b, a % b);
}
```

**Przykład / Example**:
```
(0,0) → (2,3): dy=3, dx=2, gcd=1 → slope = 3/2
(0,0) → (4,6): dy=6, dx=4, gcd=2 → slope = 3/2
Oba mają identyczny klucz: "3/2"
Both have identical key: "3/2"
```

## Analiza Matematyczna / Mathematical Analysis

### Liczba Możliwych Linii

**Dla n punktów**:
- Maksymalna liczba linii przez 2 punkty: C(n, 2) = n(n-1)/2
- Maximum number of lines through 2 points: C(n, 2) = n(n-1)/2

**Przykłady / Examples**:
```
n=3:  C(3,2) = 3 linie
n=4:  C(4,2) = 6 linii
n=5:  C(5,2) = 10 linii
n=10: C(10,2) = 45 linii
n=100: C(100,2) = 4,950 linii
```

### Twierdzenie Sylvestera-Gallai

**Twierdzenie / Theorem**:
Dla skończonego zbioru n punktów (n ≥ 3) w płaszczyźnie, które nie są wszystkie współliniowe, istnieje linia przechodząca przez dokładnie 2 punkty.

For a finite set of n points (n ≥ 3) in the plane, not all collinear, there exists a line passing through exactly 2 points.

## Optymalizacje / Optimizations

### 1. Early Termination
```javascript
// Jeśli znaleźliśmy linię przez n/2 punktów, możemy zatrzymać się
// If we found line through n/2 points, we can stop
if (maxPoints > points.length / 2) {
  break; // Nie możemy znaleźć lepszej linii
}
```

### 2. Skip Processed Lines
```javascript
// Użyj Set do śledzenia sprawdzonych linii
// Use Set to track checked lines
const processedLines = new Set();
const lineKey = `${p1.x},${p1.y}-${p2.x},${p2.y}`;

if (!processedLines.has(lineKey)) {
  processedLines.add(lineKey);
  // Sprawdź linię
}
```

### 3. Parallel Processing
```javascript
// Dla dużych zbiorów danych, przetwarzaj punkty równolegle
// For large datasets, process points in parallel
```

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Dokładność | Prostota |
|-----------|------|--------|------------|----------|
| Brute Force | O(n³) | O(1) | Wysoka | Wysoka |
| Hash Map | O(n²) | O(n) | Wysoka | Średnia |
| Angle Sort | O(n²log n) | O(n) | Średnia | Niska |
| Geometric | O(n³) | O(1) | Wysoka | Średnia |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Hash Map (Podejście 2)**: Najlepsze dla większości przypadków - O(n²), dokładne
- **Brute Force (Podejście 1)**: Gdy n < 100 i prostota jest ważna
- **Geometric (Podejście 4)**: Gdy nie można użyć hash map
- **Angle Sort (Podejście 3)**: Raczej nie - wolniejsze niż hash map

## Zastosowania / Applications

1. **Machine Learning**: RANSAC (Random Sample Consensus)
2. **Computer Vision**: Wykrywanie linii (Hough Transform)
3. **Statystyka**: Regresja liniowa, wykrywanie outlierów
4. **Geometria obliczeniowa**: Podstawowy building block
5. **Pattern Recognition**: Wykrywanie wzorców liniowych

## Rozszerzenia / Extensions

### 1. Best Plane w 3D
```javascript
// Znajdź płaszczyznę przez najwięcej punktów w 3D
// Find plane through most points in 3D
// O(n³) lub O(n² log n) z hash map
```

### 2. Best k-Lines
```javascript
// Znajdź k linii pokrywających najwięcej punktów
// Find k lines covering most points
// Problem NP-trudny dla k > 1
```

### 3. Approximate Best Line
```javascript
// RANSAC - losuj pary, znajdź najlepszą linię probabilistycznie
// RANSAC - sample pairs, find best line probabilistically
// O(k × n) gdzie k = liczba iteracji
```

## Wnioski / Conclusions

Best Line to klasyczny problem geometrii obliczeniowej pokazujący:
1. **Trade-off czas vs pamięć**: O(n³) z O(1) pamięcią vs O(n²) z O(n) pamięcią
2. **Problemy z precyzją**: Unikaj float comparison, użyj ułamków
3. **Hash map jako optymalizacja**: Redukcja z O(n³) do O(n²)
4. **Edge cases**: Linie pionowe, duplikaty, mało punktów

Best Line is a classic computational geometry problem showing:
1. **Time vs space trade-off**: O(n³) with O(1) space vs O(n²) with O(n) space
2. **Precision issues**: Avoid float comparison, use fractions
3. **Hash map as optimization**: Reduction from O(n³) to O(n²)
4. **Edge cases**: Vertical lines, duplicates, few points
