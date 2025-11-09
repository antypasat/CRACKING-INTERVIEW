# 16.17 Contiguous Sequence

## Opis Zadania / Problem Description

**Contiguous Sequence**: You are given an array of integers (both positive and negative). Find the contiguous sequence with the largest sum. Return the sum.

**Ciągły Podciąg**: Masz tablicę liczb całkowitych (dodatnich i ujemnych). Znajdź ciągły podciąg o największej sumie. Zwróć tę sumę.

EXAMPLE
Input: [2, -8, 3, -2, 4, -10]
Output: 5 (suma podciągu [3, -2, 4])

Hints: #537, #551, #567, #594, #614

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć podciąg (ciągłą sekwencję elementów) z tablicy, który ma największą możliwą sumę. Podciąg musi być ciągły - nie możemy pomijać elementów.

We need to find a subarray (contiguous sequence of elements) from the array that has the largest possible sum. The subarray must be contiguous - we cannot skip elements.

**Przykłady / Examples**:
```
[1, 2, 3, 4] → 10 (cała tablica)
[-2, -3, -1, -4] → -1 (najmniejsza ujemna liczba)
[2, -8, 3, -2, 4, -10] → 5 (podciąg [3, -2, 4])
```

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n³)

**Idea**: Sprawdź wszystkie możliwe podciągi i oblicz ich sumy.

**Idea**: Check all possible subarrays and calculate their sums.

```javascript
function maxSubArrayBruteForce(arr) {
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      let sum = 0;
      for (let k = i; k <= j; k++) {
        sum += arr[k];
      }
      maxSum = Math.max(maxSum, sum);
    }
  }

  return maxSum;
}
```

**Złożoność / Complexity**: O(n³) - za wolne dla dużych danych

### Podejście 2: Brute Force Ulepszone - O(n²)

**Idea**: Obliczaj sumę narastająco zamiast od nowa dla każdego podciągu.

**Idea**: Calculate sum incrementally instead of recalculating for each subarray.

```javascript
function maxSubArrayBetter(arr) {
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    let currentSum = 0;
    for (let j = i; j < arr.length; j++) {
      currentSum += arr[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

**Złożoność / Complexity**: O(n²) - lepsze, ale wciąż nieoptymalne

### Podejście 3: Algorytm Kadane'a - O(n) ✓

**Idea**: Śledź maksymalną sumę kończącą się w bieżącej pozycji. Jeśli suma staje się ujemna, zacznij nowy podciąg.

**Idea**: Track the maximum sum ending at current position. If sum becomes negative, start a new subarray.

**Kluczowa Obserwacja**:
W każdym punkcie mamy dwa wybory:
1. Dołącz bieżący element do istniejącego podciągu
2. Zacznij nowy podciąg od bieżącego elementu

Wybieramy to, co daje większą sumę!

At each point we have two choices:
1. Add current element to existing subarray
2. Start a new subarray from current element

We choose whichever gives larger sum!

```javascript
function maxSubArray(arr) {
  if (arr.length === 0) return 0;

  let maxEndingHere = arr[0];  // Maksymalna suma kończąca się tutaj
  let maxSoFar = arr[0];        // Globalne maximum

  for (let i = 1; i < arr.length; i++) {
    // Dołącz do obecnego podciągu lub zacznij nowy
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);

    // Aktualizuj globalne maximum
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

**Dlaczego to działa? / Why does this work?**

```
Dla każdego elementu arr[i]:
- maxEndingHere = max(arr[i], maxEndingHere + arr[i])

Jeśli maxEndingHere + arr[i] < arr[i], to:
  maxEndingHere < 0

Więc lepiej zacząć nowy podciąg od arr[i] niż kontynuować poprzedni!

If maxEndingHere + arr[i] < arr[i], then:
  maxEndingHere < 0

So it's better to start a new subarray from arr[i] than continue the previous one!
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - jedno przejście przez tablicę
- Pamięciowa / Space: O(1) - tylko dwie zmienne

### Podejście 4: Kadane z Śledzeniem Indeksów - O(n)

**Rozszerzenie**: Zwróć nie tylko sumę, ale też indeksy początku i końca podciągu.

**Extension**: Return not only the sum, but also the start and end indices of the subarray.

```javascript
function maxSubArrayWithIndices(arr) {
  if (arr.length === 0) return { sum: 0, start: -1, end: -1 };

  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];

  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    // Jeśli zaczynamy nowy podciąg
    if (arr[i] > maxEndingHere + arr[i]) {
      maxEndingHere = arr[i];
      tempStart = i;
    } else {
      maxEndingHere = maxEndingHere + arr[i];
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }
  }

  return { sum: maxSoFar, start, end };
}
```

### Podejście 5: Divide and Conquer - O(n log n)

**Idea**: Podziel tablicę na pół. Maksymalny podciąg jest:
- W lewej połowie, lub
- W prawej połowie, lub
- Przechodzi przez środek

**Idea**: Divide array in half. Maximum subarray is:
- In left half, or
- In right half, or
- Crosses the middle

```javascript
function maxSubArrayDivideConquer(arr, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];

  const mid = Math.floor((left + right) / 2);

  // Rekurencyjnie znajdź w lewej i prawej
  const leftMax = maxSubArrayDivideConquer(arr, left, mid);
  const rightMax = maxSubArrayDivideConquer(arr, mid + 1, right);

  // Znajdź maksimum przechodzące przez środek
  let leftSum = -Infinity;
  let sum = 0;
  for (let i = mid; i >= left; i--) {
    sum += arr[i];
    leftSum = Math.max(leftSum, sum);
  }

  let rightSum = -Infinity;
  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += arr[i];
    rightSum = Math.max(rightSum, sum);
  }

  const crossMax = leftSum + rightSum;

  return Math.max(leftMax, rightMax, crossMax);
}
```

**Złożoność / Complexity**: O(n log n)

## Szczególne Przypadki / Edge Cases

1. **Pusta tablica**: Zwróć 0 lub undefined
2. **Wszystkie liczby ujemne**: Zwróć największą (najmniej ujemną)
3. **Wszystkie liczby dodatnie**: Zwróć sumę całej tablicy
4. **Jeden element**: Zwróć ten element
5. **Tablica z zerami**: Uwzględnij w obliczeniach
6. **Bardzo duże liczby**: Uważaj na overflow (w JavaScript to rzadki problem)

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład 1: [2, -8, 3, -2, 4, -10]

```
i=0: arr[0]=2
  maxEndingHere = 2
  maxSoFar = 2

i=1: arr[1]=-8
  maxEndingHere = max(-8, 2 + (-8)) = max(-8, -6) = -6
  maxSoFar = 2

i=2: arr[2]=3
  maxEndingHere = max(3, -6 + 3) = max(3, -3) = 3  ← Nowy podciąg!
  maxSoFar = 3

i=3: arr[3]=-2
  maxEndingHere = max(-2, 3 + (-2)) = max(-2, 1) = 1
  maxSoFar = 3

i=4: arr[4]=4
  maxEndingHere = max(4, 1 + 4) = max(4, 5) = 5
  maxSoFar = 5  ← Nowe maksimum!

i=5: arr[5]=-10
  maxEndingHere = max(-10, 5 + (-10)) = max(-10, -5) = -5
  maxSoFar = 5

Odpowiedź: 5 (podciąg [3, -2, 4] od indeksu 2 do 4)
```

### Przykład 2: [-2, -3, -1, -4]

```
Wszystkie liczby ujemne → zwróć najmniej ujemną = -1
```

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Algorytm Kadane'a (Podejście 3)**: Najlepsze! O(n) czas, O(1) pamięć
- **Z Indeksami (Podejście 4)**: Gdy potrzebujemy znać położenie podciągu
- **Divide and Conquer (Podejście 5)**: Dla celów edukacyjnych, pokazuje inną technikę
- **Brute Force**: Tylko dla bardzo małych tablic lub do nauki

## Historia / History

Algorytm został opracowany przez Jaya Kadane'a w 1984 roku i jest klasycznym przykładem programowania dynamicznego.

The algorithm was developed by Jay Kadane in 1984 and is a classic example of dynamic programming.

## Zastosowania / Applications

1. **Analiza finansowa**: Najlepszy okres do trzymania akcji
2. **Przetwarzanie obrazu**: Znajdowanie najjaśniejszych regionów
3. **Genomika**: Znajdowanie sekwencji o wysokiej zawartości GC
4. **Analiza danych**: Identyfikacja trendów w danych szeregów czasowych
