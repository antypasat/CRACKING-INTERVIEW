# 16.6 Smallest Difference

## Opis Zadania / Problem Description

**Smallest Difference**: Given two arrays of integers, compute the pair of values (one value in each array) with the smallest (non-negative) difference. Return the difference.

**Najmniejsza Różnica**: Mając dwie tablice liczb całkowitych, oblicz parę wartości (jedna wartość z każdej tablicy) o najmniejszej (nieujemnej) różnicy. Zwróć różnicę.

EXAMPLE
Input: {1, 3, 15, 11, 2}, {23, 127, 235, 19, 8}
Output: 3 (para (11, 8))

Hints: #632, #670, #679

## Rozwiązanie / Solution

### Podejście 1: Brute Force - O(n*m)
Sprawdź każdą parę.

### Podejście 2: Sortowanie i Dwa Wskaźniki - O(n log n + m log m)
1. Posortuj obie tablice
2. Użyj dwóch wskaźników, poruszaj się po obu tablicach
3. Jeśli a[i] < b[j], zwiększ i (szukaj większego a)
4. W przeciwnym razie zwiększ j (szukaj większego b)

```javascript
function smallestDifference(arr1, arr2) {
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);

  let i = 0, j = 0;
  let minDiff = Infinity;
  let pair = null;

  while (i < arr1.length && j < arr2.length) {
    const diff = Math.abs(arr1[i] - arr2[j]);

    if (diff < minDiff) {
      minDiff = diff;
      pair = [arr1[i], arr2[j]];
    }

    if (arr1[i] < arr2[j]) i++;
    else j++;
  }

  return { difference: minDiff, pair };
}
```
