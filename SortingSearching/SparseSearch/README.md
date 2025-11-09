# Sparse Search - Rzadkie Wyszukiwanie

## Treść Zadania / Problem Statement

**English:**
Given a sorted array of strings that is interspersed with empty strings, write a method to find the location of a given string.

**Example:**
Input: ball, {"at", "", "", "", "ball", "", "", "car", "", "", "dad", "", ""}
Output: 4

**Polski:**
Mając posortowaną tablicę stringów przeplatanych pustymi stringami, napisz metodę, która znajdzie lokalizację danego stringa.

**Przykład:**
Wejście: ball, {"at", "", "", "", "ball", "", "", "car", "", "", "dad", "", ""}
Wyjście: 4

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Mamy posortowaną alfabetycznie tablicę stringów, ale niektóre pozycje są pustymi stringami (""). Te puste stringi "zakłócają" normalny binary search - gdy trafimy na pusty string, nie wiemy, czy iść w lewo czy w prawo.

Rozwiązanie: **Zmodyfikowany Binary Search**
- Gdy `mid` wskazuje na pusty string, znajdź najbliższy niepusty
- Kontynuuj normalny binary search

**English:**
We have an alphabetically sorted array of strings, but some positions are empty strings (""). These empty strings "disrupt" normal binary search - when we hit an empty string, we don't know whether to go left or right.

Solution: **Modified Binary Search**
- When `mid` points to empty string, find nearest non-empty
- Continue with normal binary search

## Rozwiązanie / Solution

### Podejście: Zmodyfikowany Binary Search

**Algorytm / Algorithm:**

1. Oblicz `mid = (left + right) / 2`
2. Jeśli `arr[mid]` jest puste:
   - Szukaj najbliższego niepustego stringa (lewo i prawo)
   - Jeśli nie znajdziesz, zakończ
   - Jeśli znajdziesz, użyj tego indeksu jako `mid`
3. Porównaj `arr[mid]` z `target`:
   - Jeśli równe → zwróć `mid`
   - Jeśli `arr[mid] < target` → szukaj w prawo
   - Jeśli `arr[mid] > target` → szukaj w lewo
4. Powtarzaj

**Steps:**
1. Calculate `mid = (left + right) / 2`
2. If `arr[mid]` is empty:
   - Search for nearest non-empty string (left and right)
   - If not found, terminate
   - If found, use that index as `mid`
3. Compare `arr[mid]` with `target`:
   - If equal → return `mid`
   - If `arr[mid] < target` → search right
   - If `arr[mid] > target` → search left
4. Repeat

### Wizualizacja / Visualization:

```
Szukamy "ball" w:
["at", "", "", "", "ball", "", "", "car", "", "", "dad", "", ""]
  0    1   2   3    4     5   6    7     8   9    10    11  12

Krok 1: left=0, right=12, mid=6
  arr[6]="" (puste!)
  Szukamy niepustego: lewo (5=""), dalej lewo (4="ball") ✓
  Używamy mid=4

Krok 2: arr[4]="ball" === "ball" → ZNALEZIONO na indeksie 4!
```

### Implementacja / Implementation:

```javascript
function sparseSearch(arr, target) {
  return sparseSearchHelper(arr, target, 0, arr.length - 1);
}

function sparseSearchHelper(arr, target, left, right) {
  if (left > right) {
    return -1; // Nie znaleziono / Not found
  }

  let mid = Math.floor((left + right) / 2);

  // Jeśli mid jest pusty, znajdź najbliższy niepusty
  // If mid is empty, find nearest non-empty
  if (arr[mid] === "") {
    let leftIdx = mid - 1;
    let rightIdx = mid + 1;

    while (true) {
      // Sprawdź czy wyszliśmy poza zakres
      // Check if we went out of bounds
      if (leftIdx < left && rightIdx > right) {
        return -1; // Wszystkie puste / All empty
      }

      // Sprawdź po prawej / Check right
      if (rightIdx <= right && arr[rightIdx] !== "") {
        mid = rightIdx;
        break;
      }

      // Sprawdź po lewej / Check left
      if (leftIdx >= left && arr[leftIdx] !== "") {
        mid = leftIdx;
        break;
      }

      leftIdx--;
      rightIdx++;
    }
  }

  // Normalny binary search / Normal binary search
  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return sparseSearchHelper(arr, target, mid + 1, right);
  } else {
    return sparseSearchHelper(arr, target, left, mid - 1);
  }
}
```

## Analiza Złożoności / Complexity Analysis

**Złożoność Czasowa / Time Complexity:**
- **Najlepszy przypadek:** O(log n) - gdy brak pustych stringów
- **Najgorszy przypadek:** O(n) - gdy prawie wszystkie są puste
- **Średni przypadek:** O(log n) - zakładając rozsądną liczbę niepustych

**Time Complexity:**
- **Best case:** O(log n) - when no empty strings
- **Worst case:** O(n) - when almost all are empty
- **Average case:** O(log n) - assuming reasonable number of non-empty

**Złożoność Pamięciowa / Space Complexity:** O(log n)
- Rekurencja binary search
- Recursion of binary search

## Optymalizacja / Optimization

Możemy zoptymalizować, **wybierając kierunek** szukania niepustego stringa:
- Jeśli `target` alfabetycznie wcześniejszy → szukaj najpierw po lewej
- Jeśli `target` alfabetycznie późniejszy → szukaj najpierw po prawej

We can optimize by **choosing direction** for finding non-empty string:
- If `target` alphabetically earlier → search left first
- If `target` alphabetically later → search right first

## Przypadki Brzegowe / Edge Cases

1. **Wszystkie stringi puste** - zwróć -1
2. **Brak pustych stringów** - działa jak zwykły binary search
3. **Target jest pusty** - czy to poprawne? Zapytaj rekrutera
4. **Pojedynczy niepusty string** - otoczony pustymi
5. **Duplikaty** - zwróć którykolwiek
6. **Target nie istnieje** - zwróć -1

1. **All strings empty** - return -1
2. **No empty strings** - works like regular binary search
3. **Target is empty** - is this valid? Ask interviewer
4. **Single non-empty string** - surrounded by empty
5. **Duplicates** - return any
6. **Target doesn't exist** - return -1

## Pytania do Rekrutera / Questions for Interviewer

1. Czy możemy założyć, że target nie jest pusty? / Can we assume target is not empty?
2. Czy w przypadku duplikatów zwracamy pierwszy, ostatni, czy dowolny? / For duplicates, return first, last, or any?
3. Czy wielkość liter ma znaczenie? / Is case sensitivity important?
4. Jakie jest typowe "zagęszczenie" niepustych stringów? / What's typical "density" of non-empty strings?

## Kluczowe Wnioski / Key Takeaways

1. **Modyfikacja klasycznego algorytmu** - adaptuj binary search do nietypowych warunków
2. **Puste wartości wymagają specjalnej obsługi** - szukaj najbliższego użytecznego elementu
3. **Złożoność zależy od danych** - rzadkie niepuste stringi = gorsze performance
4. **Trade-off: kierunek wyszukiwania** - możemy optymalizować wybór kierunku

1. **Modification of classic algorithm** - adapt binary search to unusual conditions
2. **Empty values need special handling** - find nearest useful element
3. **Complexity depends on data** - sparse non-empty strings = worse performance
4. **Trade-off: search direction** - we can optimize direction choice
