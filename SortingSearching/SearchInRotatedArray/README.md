# Search in Rotated Array - Wyszukiwanie w Obróconej Tablicy

## Treść Zadania / Problem Statement

**English:**
Given a sorted array of n integers that has been rotated an unknown number of times, write code to find an element in the array. You may assume that the array was originally sorted in increasing order.

**Example:**
Input: find 5 in {15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14}
Output: 8 (the index of 5 in the array)

**Polski:**
Mając posortowaną tablicę n liczb całkowitych, która została obrócona nieznaną liczbę razy, napisz kod, który znajdzie element w tablicy. Możesz założyć, że tablica była pierwotnie posortowana rosnąco.

**Przykład:**
Wejście: znajdź 5 w {15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14}
Wyjście: 8 (indeks 5 w tablicy)

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
"Rotacja" tablicy oznacza, że pewna część tablicy z końca została przeniesiona na początek. Na przykład:
- Oryginalna: [1, 3, 4, 5, 7, 10, 14, 15, 16, 19, 20, 25]
- Po 7 rotacjach: [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14]

Tablica jest nadal "częściowo posortowana" - składa się z dwóch posortowanych podtablic:
- Część 1: [15, 16, 19, 20, 25]
- Część 2: [1, 3, 4, 5, 7, 10, 14]

Nie możemy użyć standardowego binary search, ale możemy go **zmodyfikować**.

**English:**
"Rotation" of an array means that some part from the end was moved to the beginning. For example:
- Original: [1, 3, 4, 5, 7, 10, 14, 15, 16, 19, 20, 25]
- After 7 rotations: [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14]

The array is still "partially sorted" - it consists of two sorted subarrays:
- Part 1: [15, 16, 19, 20, 25]
- Part 2: [1, 3, 4, 5, 7, 10, 14]

We can't use standard binary search, but we can **modify it**.

## Rozwiązanie / Solution

### Podejście: Zmodyfikowany Binary Search

**Kluczowa Obserwacja / Key Observation:**
W każdym momencie binary search, **co najmniej jedna połowa tablicy jest prawidłowo posortowana**.

At any point in binary search, **at least one half of the array is properly sorted**.

### Algorytm / Algorithm:

1. Oblicz `mid = (left + right) / 2`
2. Sprawdź czy `arr[mid] == target` → zwróć mid
3. Określ, która połowa jest posortowana:
   - Jeśli `arr[left] <= arr[mid]` → lewa połowa jest posortowana
   - W przeciwnym razie → prawa połowa jest posortowana
4. Sprawdź, czy target znajduje się w posortowanej połowie:
   - Jeśli tak → szukaj w tej połowie
   - Jeśli nie → szukaj w drugiej połowie
5. Powtarzaj aż znajdziesz lub left > right

**Steps:**
1. Calculate `mid = (left + right) / 2`
2. Check if `arr[mid] == target` → return mid
3. Determine which half is sorted:
   - If `arr[left] <= arr[mid]` → left half is sorted
   - Otherwise → right half is sorted
4. Check if target is in the sorted half:
   - If yes → search in that half
   - If no → search in the other half
5. Repeat until found or left > right

### Wizualizacja / Visualization:

```
Szukamy 5 w: [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14]
             0   1   2   3   4  5  6  7  8  9  10  11

Krok 1: left=0, right=11, mid=5
  arr[mid]=1, arr[left]=15
  15 > 1 → prawa połowa jest posortowana [1..14]
  5 jest między 1 a 14 → szukaj w prawej

Krok 2: left=6, right=11, mid=8
  arr[mid]=5 → ZNALEZIONO! Zwróć 8
```

### Implementacja / Implementation:

```javascript
function searchRotated(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Znaleziono / Found
    if (arr[mid] === target) {
      return mid;
    }

    // Lewa połowa jest posortowana / Left half is sorted
    if (arr[left] <= arr[mid]) {
      // Sprawdź czy target jest w lewej połowie
      // Check if target is in left half
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1; // Szukaj w lewej / Search left
      } else {
        left = mid + 1;  // Szukaj w prawej / Search right
      }
    }
    // Prawa połowa jest posortowana / Right half is sorted
    else {
      // Sprawdź czy target jest w prawej połowie
      // Check if target is in right half
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;  // Szukaj w prawej / Search right
      } else {
        right = mid - 1; // Szukaj w lewej / Search left
      }
    }
  }

  return -1; // Nie znaleziono / Not found
}
```

## Analiza Złożoności / Complexity Analysis

**Złożoność Czasowa / Time Complexity:** O(log n)
- Standardowy binary search
- W każdej iteracji dzielimy przestrzeń poszukiwań na pół
- Standard binary search
- In each iteration we divide search space in half

**Złożoność Pamięciowa / Space Complexity:** O(1)
- Tylko stałe zmienne pomocnicze
- Only constant auxiliary variables

**Uwaga / Note:** W przypadku duplikatów, najgorszy przypadek to O(n).
In case of duplicates, worst case is O(n).

## Przypadki Brzegowe / Edge Cases

1. **Tablica nierotowana** - [1, 2, 3, 4, 5] - działa jak zwykły binary search
2. **Pełna rotacja** - tablica wraca do oryginalnej formy
3. **Rotacja o 1** - [5, 1, 2, 3, 4]
4. **Element na początku/końcu** - arr[0] lub arr[n-1]
5. **Element nie istnieje** - zwróć -1
6. **Tablica z jednym elementem** - [5]
7. **Duplikaty** - [2, 2, 2, 3, 4, 2] - wymaga specjalnej obsługi

1. **Non-rotated array** - [1, 2, 3, 4, 5] - works like regular binary search
2. **Full rotation** - array returns to original form
3. **Rotation by 1** - [5, 1, 2, 3, 4]
4. **Element at start/end** - arr[0] or arr[n-1]
5. **Element doesn't exist** - return -1
6. **Single element array** - [5]
7. **Duplicates** - [2, 2, 2, 3, 4, 2] - requires special handling

## Wariant: Znajdź Punkt Rotacji / Variant: Find Rotation Point

```javascript
function findRotationPoint(arr) {
  let left = 0;
  let right = arr.length - 1;

  // Jeśli tablica nie jest rotowana / If array is not rotated
  if (arr[left] <= arr[right]) {
    return 0;
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Punkt rotacji znaleziony / Rotation point found
    if (mid < arr.length - 1 && arr[mid] > arr[mid + 1]) {
      return mid + 1;
    }

    if (arr[left] <= arr[mid]) {
      left = mid + 1;  // Punkt rotacji jest w prawej połowie
    } else {
      right = mid - 1; // Punkt rotacji jest w lewej połowie
    }
  }

  return 0;
}
```

## Pytania do Rekrutera / Questions for Interviewer

1. Czy w tablicy mogą być duplikaty? / Can the array have duplicates?
2. Czy możemy założyć, że tablica jest niepusta? / Can we assume the array is non-empty?
3. Co zwrócić gdy element nie istnieje? (-1, null, exception?) / What to return when element doesn't exist?
4. Czy tablica była zawsze posortowana rosnąco? / Was the array always sorted in ascending order?

## Kluczowe Wnioski / Key Takeaways

1. **Wykorzystaj własności częściowego sortowania** - jedna połowa jest zawsze posortowana
2. **Modyfikacja binary search** - nie odrzucamy połowy ślepo, ale najpierw sprawdzamy
3. **O(log n) możliwe nawet dla rotowanej tablicy** - nie musimy wracać do O(n)
4. **Duplikaty komplikują problem** - mogą wymagać liniowego czasu w najgorszym przypadku

1. **Use partial sorting properties** - one half is always sorted
2. **Binary search modification** - we don't blindly discard half, but check first
3. **O(log n) possible even for rotated array** - we don't need to fall back to O(n)
4. **Duplicates complicate the problem** - may require linear time in worst case
