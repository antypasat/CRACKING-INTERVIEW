# 16.24 Pairs with Sum

## Opis Zadania / Problem Description

**Pairs with Sum**: Design an algorithm to find all pairs of integers within an array which sum to a specified value.

**Pary o Danej Sumie**: Zaprojektuj algorytm znajdujący wszystkie pary liczb całkowitych w tablicy, które sumują się do określonej wartości.

EXAMPLE
Input: array = [1, 2, 3, 9, 11, 13, 14], sum = 25
Output: [(11, 14), (13, 12)] - depends on implementation
Note: (11, 14) and (14, 11) are the same pair

Hints: #548, #597, #644, #673

## Wyjaśnienie Problemu / Problem Explanation

Mamy:
- Tablicę liczb całkowitych (mogą się powtarzać)
- Wartość docelową `targetSum`

Musimy znaleźć wszystkie pary (a, b) gdzie:
- `a + b = targetSum`
- `a` i `b` są różnymi elementami tablicy (różne indeksy)
- Nie chcemy duplikatów: (a, b) i (b, a) to ta sama para

We have:
- An array of integers (may contain duplicates)
- A target sum value

We must find all pairs (a, b) where:
- `a + b = targetSum`
- `a` and `b` are different elements of the array (different indices)
- We don't want duplicates: (a, b) and (b, a) are the same pair

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n²)

**Idea**: Sprawdź każdą parę elementów.

**Idea**: Check every pair of elements.

```javascript
function pairsWithSumBruteForce(arr, targetSum) {
  const pairs = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === targetSum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n²)
- Pamięciowa / Space: O(1) (nie licząc wyniku)

### Podejście 2: Hash Set - O(n) ✓

**Idea**: Dla każdego elementu `x`, sprawdź czy `targetSum - x` już wystąpiło. Użyj Set do śledzenia widzianych elementów.

**Idea**: For each element `x`, check if `targetSum - x` was already seen. Use Set to track seen elements.

```javascript
function pairsWithSum(arr, targetSum) {
  const seen = new Set();
  const pairs = [];

  for (let num of arr) {
    const complement = targetSum - num;

    if (seen.has(complement)) {
      pairs.push([complement, num]);
    }

    seen.add(num);
  }

  return pairs;
}
```

**Uwaga / Note**: To podejście może generować duplikaty jeśli liczby się powtarzają!

**Złożoność / Complexity**:
- Czasowa / Time: O(n)
- Pamięciowa / Space: O(n) - Set przechowuje elementy

### Podejście 3: Hash Map z Licznikiem - O(n)

**Idea**: Użyj Map do śledzenia ile razy każda liczba wystąpiła. Obsługuje duplikaty poprawnie.

**Idea**: Use Map to track how many times each number appeared. Handles duplicates correctly.

```javascript
function pairsWithSumMap(arr, targetSum) {
  const countMap = new Map();
  const pairs = [];

  // Zlicz wystąpienia
  for (let num of arr) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Znajdź pary
  for (let num of countMap.keys()) {
    const complement = targetSum - num;

    if (countMap.has(complement)) {
      const count = countMap.get(num);
      const complementCount = countMap.get(complement);

      if (num === complement) {
        // Para tego samego elementu: num + num = targetSum
        // Liczba par = C(count, 2) = count * (count - 1) / 2
        const numPairs = count * (count - 1) / 2;
        for (let i = 0; i < numPairs; i++) {
          pairs.push([num, num]);
        }
      } else if (num < complement) {
        // Unikaj duplikatów: dodaj tylko gdy num < complement
        const numPairs = count * complementCount;
        for (let i = 0; i < numPairs; i++) {
          pairs.push([num, complement]);
        }
      }
    }
  }

  return pairs;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n)
- Pamięciowa / Space: O(n)

### Podejście 4: Sortowanie + Dwa Wskaźniki - O(n log n)

**Idea**: Posortuj tablicę, następnie użyj dwóch wskaźników (lewy i prawy). Jeśli suma jest za mała, przesuń lewy. Jeśli za duża, przesuń prawy.

**Idea**: Sort the array, then use two pointers (left and right). If sum is too small, move left. If too large, move right.

```javascript
function pairsWithSumTwoPointers(arr, targetSum) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pairs = [];

  let left = 0;
  let right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left] + sorted[right];

    if (sum === targetSum) {
      pairs.push([sorted[left], sorted[right]]);
      left++;
      right--;
    } else if (sum < targetSum) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}
```

**Uwaga / Note**: To podejście nie obsługuje duplikatów w oryginalnej tablicy w pełni poprawnie.

**Złożoność / Complexity**:
- Czasowa / Time: O(n log n) - sortowanie
- Pamięciowa / Space: O(n) - kopia tablicy

## Obsługa Duplikatów / Handling Duplicates

### Przypadek 1: Duplikaty w Tablicy
```
arr = [1, 2, 2, 3], targetSum = 4

Możliwe pary:
- (1, 3) - 1 para
- (2, 2) - 1 para (jeśli są różne indeksy)

Jeśli mamy dwa elementy o wartości 2 na indeksach i i j:
możemy utworzyć parę (arr[i], arr[j])
```

### Przypadek 2: Para z Tego Samego Elementu
```
arr = [5, 5, 5], targetSum = 10

Liczba par = C(3, 2) = 3
Pary: (arr[0], arr[1]), (arr[0], arr[2]), (arr[1], arr[2])
```

## Szczególne Przypadki / Edge Cases

1. **Pusta tablica**: Zwróć pustą tablicę par
2. **Jeden element**: Brak par możliwych
3. **Brak pasujących par**: Zwróć pustą tablicę
4. **Duplikaty**: Obsłuż poprawnie (zależy od wymagań)
5. **Para z samym sobą**: `x + x = targetSum` (gdy mamy co najmniej 2 wystąpienia x)
6. **Liczby ujemne**: Algorytm działa tak samo
7. **Zero**: `0 + x = x`, więc targetSum może być dowolny

## Przykłady / Examples

### Przykład 1:
```
arr = [1, 2, 3, 9, 11, 13, 14]
targetSum = 25

Pary:
- 11 + 14 = 25 ✓
```

### Przykład 2:
```
arr = [1, 2, 3, 4, 5]
targetSum = 6

Pary:
- 1 + 5 = 6 ✓
- 2 + 4 = 6 ✓
```

### Przykład 3 (duplikaty):
```
arr = [2, 2, 3, 3]
targetSum = 5

Pary:
- 2 + 3 = 5 (4 pary: każdy 2 może być sparowany z każdym 3)
  (arr[0], arr[2])
  (arr[0], arr[3])
  (arr[1], arr[2])
  (arr[1], arr[3])
```

### Przykład 4 (para identyczna):
```
arr = [3, 3, 3]
targetSum = 6

Pary:
- 3 + 3 = 6
- Liczba par = C(3, 2) = 3
  (arr[0], arr[1])
  (arr[0], arr[2])
  (arr[1], arr[2])
```

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

### Jeśli NIE ma duplikatów:
- **Hash Set (Podejście 2)**: Najprostsze i najszybsze O(n)

### Jeśli SĄ duplikaty:
- **Hash Map z Licznikiem (Podejście 3)**: Poprawnie obsługuje wszystkie przypadki O(n)

### Jeśli tablica jest już posortowana:
- **Dwa Wskaźniki (Podejście 4)**: O(n) bez dodatkowej pamięci

### Dla nauki:
- **Brute Force (Podejście 1)**: Proste do zrozumienia

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Obsługuje Duplikaty | Prostota |
|-----------|------|--------|---------------------|----------|
| Brute Force | O(n²) | O(1) | Tak | ★★★★★ |
| Hash Set | O(n) | O(n) | Częściowo | ★★★★ |
| Hash Map | O(n) | O(n) | Tak | ★★★ |
| Two Pointers | O(n log n) | O(n) | Częściowo | ★★★ |

## Warianty Problemu / Problem Variants

1. **Zwróć tylko liczbę par**: Nie generuj par, tylko zlicz je
2. **Znajdź k par**: Zwróć pierwsze k par
3. **Unikalne wartości**: Każda wartość może być użyta tylko raz
4. **Trzy liczby**: Znajdź trójki o danej sumie (trudniejsze, O(n²))
5. **Różnica zamiast sumy**: Znajdź pary o danej różnicy

## Zastosowania / Applications

1. **Kryptografia**: Znajdowanie kolizji
2. **Analiza danych**: Korelacja między punktami danych
3. **Gry**: Znajdowanie kombinacji przedmiotów
4. **Finanse**: Pary transakcji balansujących się
