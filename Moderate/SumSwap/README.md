# 16.21 Sum Swap

## Opis Zadania / Problem Description

**Sum Swap**: Given two arrays of integers, find a pair of values (one value from each array) that you can swap to give the two arrays the same sum.

**Zamiana Sum**: Mając dwie tablice liczb całkowitych, znajdź parę wartości (jedna z każdej tablicy), które możesz zamienić tak, aby obie tablice miały tę samą sumę.

EXAMPLE
```
Input:
array1 = [4, 1, 2, 1, 1, 2]
array2 = [3, 6, 3, 3]

Output: (1, 3)

Explanation:
Sum1 = 11, Sum2 = 15
After swap (1, 3):
array1 = [4, 3, 2, 1, 1, 2] → Sum = 13
array2 = [1, 6, 3, 3] → Sum = 13
```

Hints: #545, #557, #564, #571, #583, #592, #606

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć dwie liczby: `a` z array1 i `b` z array2, takie że po zamianie obie tablice będą miały tę samą sumę.

We need to find two numbers: `a` from array1 and `b` from array2, such that after swapping both arrays will have the same sum.

**Matematyka / Mathematics**:

```
Przed zamianą:
sum1 = suma(array1)
sum2 = suma(array2)

Po zamianie:
newSum1 = sum1 - a + b
newSum2 = sum2 - b + a

Dla równych sum:
newSum1 = newSum2
sum1 - a + b = sum2 - b + a
sum1 - sum2 = 2a - 2b
sum1 - sum2 = 2(a - b)

Stąd:
a - b = (sum1 - sum2) / 2

lub

target = (sum1 - sum2) / 2
Szukamy: a - b = target
czyli: b = a - target
```

**Przykłady / Examples**:
```
1. array1 = [4, 1, 2, 1, 1, 2], array2 = [3, 6, 3, 3]
   sum1 = 11, sum2 = 15
   target = (11 - 15) / 2 = -2
   Dla a=1: b = 1 - (-2) = 3 ✓

2. array1 = [1, 2, 3], array2 = [4, 5, 6]
   sum1 = 6, sum2 = 15
   target = (6 - 15) / 2 = -4.5 (nie całkowite - niemożliwe)

3. array1 = [1], array2 = [2]
   sum1 = 1, sum2 = 2
   target = (1 - 2) / 2 = -0.5 (niemożliwe)

4. array1 = [10, 20], array2 = [15, 25]
   sum1 = 30, sum2 = 40
   target = (30 - 40) / 2 = -5
   Dla a=10: b = 10 - (-5) = 15 ✓
   Dla a=20: b = 20 - (-5) = 25 ✓
```

**Kluczowe Obserwacje / Key Observations**:
1. Różnica sum musi być parzysta (otherwise no solution)
2. Szukamy pary (a, b) gdzie b = a - target
3. Możemy użyć HashSet dla O(1) lookup
4. Jedno rozwiązanie wystarczy (choć może być wiele)

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n × m)

**Idea**: Wypróbuj wszystkie pary (a, b) i sprawdź czy dają równe sumy.

**Idea**: Try all pairs (a, b) and check if they give equal sums.

```javascript
function sumSwapBruteForce(array1, array2) {
  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  for (const a of array1) {
    for (const b of array2) {
      const newSum1 = sum1 - a + b;
      const newSum2 = sum2 - b + a;

      if (newSum1 === newSum2) {
        return [a, b];
      }
    }
  }

  return null;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n × m) - sprawdź wszystkie pary
- Pamięciowa / Space: O(1)

### Podejście 2: Mathematical with HashSet - O(n + m) ✓ OPTYMALNE

**Idea**: Użyj matematyki: b = a - target. Dla każdego a z array1, sprawdź czy (a - target) jest w array2.

**Idea**: Use mathematics: b = a - target. For each a from array1, check if (a - target) is in array2.

```javascript
function sumSwap(array1, array2) {
  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  // Sprawdź czy różnica jest parzysta
  if ((sum1 - sum2) % 2 !== 0) {
    return null; // Niemożliwe
  }

  const target = (sum1 - sum2) / 2;

  // Stwórz set z array2 dla O(1) lookup
  const set2 = new Set(array2);

  // Dla każdego a z array1, sprawdź czy (a - target) jest w array2
  for (const a of array1) {
    const b = a - target;

    if (set2.has(b)) {
      return [a, b];
    }
  }

  return null;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n + m) - przejdź przez obie tablice
- Pamięciowa / Space: O(m) - HashSet dla array2

### Podejście 3: Two Pointers (posortowane) - O(n log n + m log m)

**Idea**: Posortuj obie tablice, użyj two pointers do znalezienia pary.

**Idea**: Sort both arrays, use two pointers to find the pair.

```javascript
function sumSwapTwoPointers(array1, array2) {
  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  if ((sum1 - sum2) % 2 !== 0) {
    return null;
  }

  const target = (sum1 - sum2) / 2;

  // Posortuj obie tablice
  const sorted1 = [...array1].sort((a, b) => a - b);
  const sorted2 = [...array2].sort((a, b) => a - b);

  let i = 0;
  let j = 0;

  while (i < sorted1.length && j < sorted2.length) {
    const a = sorted1[i];
    const b = sorted2[j];
    const diff = a - b;

    if (diff === target) {
      return [a, b];
    } else if (diff < target) {
      i++;
    } else {
      j++;
    }
  }

  return null;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n log n + m log m) - sortowanie
- Pamięciowa / Space: O(n + m) - kopie tablic

### Podejście 4: Wszystkie Rozwiązania - O(n + m)

**Idea**: Znajdź wszystkie możliwe pary (może być wiele rozwiązań).

**Idea**: Find all possible pairs (there may be multiple solutions).

```javascript
function sumSwapAll(array1, array2) {
  const sum1 = array1.reduce((a, b) => a + b, 0);
  const sum2 = array2.reduce((a, b) => a + b, 0);

  if ((sum1 - sum2) % 2 !== 0) {
    return [];
  }

  const target = (sum1 - sum2) / 2;

  // Zlicz wystąpienia w array2
  const count2 = new Map();
  for (const b of array2) {
    count2.set(b, (count2.get(b) || 0) + 1);
  }

  const results = [];

  for (const a of array1) {
    const b = a - target;

    if (count2.has(b)) {
      // Dodaj tyle razy ile występuje b
      for (let k = 0; k < count2.get(b); k++) {
        results.push([a, b]);
      }
    }
  }

  return results;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n + m + k) gdzie k to liczba rozwiązań
- Pamięciowa / Space: O(m + k)

## Szczególne Przypadki / Edge Cases

### 1. Niemożliwa Zamiana (nieparzysta różnica)
```javascript
array1 = [1, 2, 3]  // sum = 6
array2 = [4, 5, 6]  // sum = 15
// diff = 9 (nieparzyste) → niemożliwe
```

### 2. Równe Sumy (już zrównoważone)
```javascript
array1 = [1, 2, 3]  // sum = 6
array2 = [2, 2, 2]  // sum = 6
// target = 0, szukamy a = b
```

### 3. Puste Tablice
```javascript
array1 = []
array2 = [1, 2, 3]
// Brak elementów do zamiany
```

### 4. Pojedyncze Elementy
```javascript
array1 = [5]
array2 = [3]
// sum1 = 5, sum2 = 3
// target = 1, szukamy a=5, b=4 (nie ma w array2)
```

### 5. Duplikaty
```javascript
array1 = [1, 1, 1, 1]
array2 = [2, 2, 2, 2]
// Wiele możliwych par (wszystkie (1, 2))
```

### 6. Wiele Rozwiązań
```javascript
array1 = [10, 20, 30]
array2 = [15, 25, 35]
// Każda para (a, b) gdzie b = a + 5 działa
```

### 7. Brak Rozwiązania (nawet przy parzystej różnicy)
```javascript
array1 = [1]
array2 = [10]
// target = -4.5... nie, target = (1-10)/2 = -4.5
// Ups, to nieparz... wait: (1-10) = -9 (nieparz)
// Lepszy przykład:
array1 = [1, 2]  // sum = 3
array2 = [10, 11] // sum = 21
// diff = -18 (parzyste), target = -9
// a=1: b = 1-(-9) = 10 ✓
```

## Analiza Matematyczna / Mathematical Analysis

### Wyprowadzenie Wzoru / Formula Derivation

**Stan początkowy / Initial state**:
```
sum1 = Σ array1
sum2 = Σ array2
```

**Po zamianie a ↔ b / After swap a ↔ b**:
```
newSum1 = sum1 - a + b
newSum2 = sum2 - b + a
```

**Warunek równości / Equality condition**:
```
newSum1 = newSum2
sum1 - a + b = sum2 - b + a
sum1 - sum2 = a - b + a - b
sum1 - sum2 = 2(a - b)

a - b = (sum1 - sum2) / 2
```

**Warunki istnienia rozwiązania / Existence conditions**:
1. `(sum1 - sum2)` musi być parzyste
2. Istnieje `a ∈ array1` i `b ∈ array2` takie że `a - b = target`

### Przykład Obliczeniowy / Calculation Example

```
array1 = [4, 1, 2, 1, 1, 2]
array2 = [3, 6, 3, 3]

sum1 = 4 + 1 + 2 + 1 + 1 + 2 = 11
sum2 = 3 + 6 + 3 + 3 = 15

target = (11 - 15) / 2 = -4 / 2 = -2

Dla a = 1: b = 1 - (-2) = 3
Sprawdzenie: 3 ∈ array2? Tak! ✓

Weryfikacja:
newSum1 = 11 - 1 + 3 = 13
newSum2 = 15 - 3 + 1 = 13
✓ Równe!
```

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Sortowanie | Wynik |
|-----------|------|--------|------------|-------|
| Brute Force | O(n×m) | O(1) | Nie | Pierwsze |
| HashSet | O(n+m) | O(m) | Nie | Pierwsze ✓ |
| Two Pointers | O(n log n) | O(n+m) | Tak | Pierwsze |
| All Solutions | O(n+m) | O(m) | Nie | Wszystkie |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **HashSet (Podejście 2)**: Najlepsze dla większości przypadków ✓
- **Brute Force (Podejście 1)**: Gdy n i m są bardzo małe
- **Two Pointers (Podejście 3)**: Gdy tablice są już posortowane
- **All Solutions (Podejście 4)**: Gdy potrzebujemy wszystkich par

## Optymalizacje / Optimizations

### 1. Early Exit
```javascript
if (array1.length === 0 || array2.length === 0) {
  return null;
}
```

### 2. Swap Arrays
```javascript
// Zawsze używaj mniejszej tablicy dla HashSet
if (array1.length > array2.length) {
  [array1, array2] = [array2, array1];
  // Pamiętaj o odwróceniu wyniku!
}
```

### 3. Check Parity First
```javascript
// Sprawdź parzystość przed tworzeniem HashSet
if ((sum1 - sum2) % 2 !== 0) {
  return null; // Early exit
}
```

### 4. Use Frequency Map for Duplicates
```javascript
// Jeśli są duplikaty, zlicz wystąpienia
const freq2 = new Map();
for (const val of array2) {
  freq2.set(val, (freq2.get(val) || 0) + 1);
}
```

## Zastosowania / Applications

1. **Load Balancing**: Równoważenie obciążenia między serwerami
2. **Resource Allocation**: Alokacja zasobów między projekty
3. **Finance**: Bilansowanie budżetów
4. **Logistics**: Dystrybucja towarów między magazyny
5. **Game Theory**: Równoważenie zespołów

## Rozszerzenia / Extensions

### 1. Minimalna Zamiana
```javascript
// Znajdź parę z najmniejszą różnicą |a - b|
// Find pair with smallest |a - b|
```

### 2. Maksymalna Zamiana
```javascript
// Znajdź parę z największą różnicą
// Find pair with largest difference
```

### 3. K Zamian
```javascript
// Wykonaj k zamian aby zrównoważyć tablice
// Perform k swaps to balance arrays
```

### 4. Wielokrotne Tablice
```javascript
// Zrównoważ więcej niż 2 tablice
// Balance more than 2 arrays
```

### 5. Z Wagami
```javascript
// Elementy mają wagi, zrównoważ sumy ważone
// Elements have weights, balance weighted sums
```

## Podobne Problemy / Related Problems

1. **Two Sum**: Znajdź parę sumującą się do target
2. **Partition Equal Subset Sum**: Podziel tablicę na dwa równe podzbiory
3. **Target Sum**: Przypisz znaki +/- aby osiągnąć target
4. **Array Partition**: Minimalizuj różnicę między sumami

## Wnioski / Conclusions

Sum Swap to elegancki problem pokazujący:
1. **Matematyczne podejście**: Wyprowadzenie wzoru redukuje O(n×m) → O(n+m)
2. **HashSet optimization**: O(1) lookup zamiast O(m) search
3. **Parity check**: Warunek konieczny (even difference)
4. **Multiple solutions**: Może być wiele poprawnych par

Sum Swap is an elegant problem showing:
1. **Mathematical approach**: Formula derivation reduces O(n×m) → O(n+m)
2. **HashSet optimization**: O(1) lookup instead of O(m) search
3. **Parity check**: Necessary condition (even difference)
4. **Multiple solutions**: There may be many valid pairs

**Kluczowy Wzór / Key Formula**:
```
a - b = (sum1 - sum2) / 2
```
