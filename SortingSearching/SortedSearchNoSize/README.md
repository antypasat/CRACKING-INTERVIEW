# Sorted Search, No Size - Wyszukiwanie bez Rozmiaru

## Treść Zadania / Problem Statement

**English:**
You are given an array-like data structure Listy which lacks a size method. It does, however, have an elementAt(i) method that returns the element at index i in O(1) time. If i is beyond the bounds of the data structure, it returns -1. (For this reason, the data structure only supports positive integers.) Given a Listy which contains sorted, positive integers, find the index at which an element x occurs. If x occurs multiple times, you may return any index.

**Polski:**
Masz strukturę danych podobną do tablicy Listy, która nie ma metody size. Ma jednak metodę elementAt(i), która zwraca element na indeksie i w czasie O(1). Jeśli i jest poza granicami struktury, zwraca -1. (Z tego powodu struktura przechowuje tylko liczby dodatnie.) Mając Listy zawierającą posortowane, dodatnie liczby całkowite, znajdź indeks, na którym występuje element x. Jeśli x występuje wielokrotnie, możesz zwrócić dowolny indeks.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Problem polega na tym, że nie wiemy, ile elementów jest w liście. Nie możemy więc zastosować klasycznego binary search, który wymaga znania rozmiaru.

Strategia:
1. **Najpierw znajdź zakres** - dowiedz się, gdzie "kończy się" lista
2. **Potem użyj binary search** - w znalezionym zakresie

Kluczowa obserwacja: możemy "wykładniczo" zwiększać indeks (1, 2, 4, 8, 16...), aby szybko znaleźć zakres zawierający nasz element.

**English:**
The problem is that we don't know how many elements are in the list. So we can't apply classic binary search, which requires knowing the size.

Strategy:
1. **First find the range** - figure out where the list "ends"
2. **Then use binary search** - in the found range

Key observation: we can "exponentially" increase the index (1, 2, 4, 8, 16...) to quickly find a range containing our element.

## Rozwiązanie / Solution

### Podejście: Wykładnicze Wyszukiwanie + Binary Search

**Algorytm / Algorithm:**

**Faza 1: Znajdź zakres**
1. Zacznij od indeksu 1
2. Podwajaj indeks (1, 2, 4, 8, 16, 32...), aż:
   - `elementAt(index)` == -1 (koniec listy), lub
   - `elementAt(index)` >= target (znaleźliśmy górną granicę)

**Phase 1: Find range**
1. Start at index 1
2. Double the index (1, 2, 4, 8, 16, 32...) until:
   - `elementAt(index)` == -1 (end of list), or
   - `elementAt(index)` >= target (found upper bound)

**Faza 2: Binary Search**
3. Wykonaj binary search między `previousIndex` a `currentIndex`

**Phase 2: Binary Search**
3. Perform binary search between `previousIndex` and `currentIndex`

### Wizualizacja / Visualization:

```
Listy: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
Szukamy: 17

Faza 1: Znajdź zakres
  index=1:  elementAt(1)=3  < 17, kontynuuj
  index=2:  elementAt(2)=5  < 17, kontynuuj
  index=4:  elementAt(4)=9  < 17, kontynuuj
  index=8:  elementAt(8)=17 >= 17, STOP!
  Zakres: [4, 8]

Faza 2: Binary Search w [4, 8]
  mid=6: elementAt(6)=13 < 17, szukaj w [7, 8]
  mid=7: elementAt(7)=15 < 17, szukaj w [8, 8]
  mid=8: elementAt(8)=17, ZNALEZIONO!
```

### Implementacja / Implementation:

```javascript
function searchListy(listy, target) {
  // Faza 1: Znajdź zakres wykładniczo / Find range exponentially
  let index = 1;
  while (listy.elementAt(index) !== -1 && listy.elementAt(index) < target) {
    index *= 2; // Podwajaj / Double
  }

  // Faza 2: Binary search między index/2 a index
  // Binary search between index/2 and index
  return binarySearch(listy, target, index / 2, index);
}

function binarySearch(listy, target, left, right) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const element = listy.elementAt(mid);

    if (element === target) {
      return mid; // Znaleziono / Found
    }

    if (element === -1 || element > target) {
      right = mid - 1; // Za daleko lub koniec / Too far or end
    } else {
      left = mid + 1;  // Za blisko / Too close
    }
  }

  return -1; // Nie znaleziono / Not found
}
```

## Analiza Złożoności / Complexity Analysis

**Złożoność Czasowa / Time Complexity:** O(log n)
- Faza 1: O(log n) - podwajanie do n wymaga log n kroków
- Faza 2: O(log n) - standardowy binary search
- Łącznie: O(log n)
- Phase 1: O(log n) - doubling to n requires log n steps
- Phase 2: O(log n) - standard binary search
- Total: O(log n)

**Złożoność Pamięciowa / Space Complexity:** O(1)
- Tylko stałe zmienne pomocnicze
- Only constant auxiliary variables

## Dlaczego Wykładnicze Zwiększanie? / Why Exponential Increase?

**Polski:**
Gdybyśmy zwiększali indeks liniowo (1, 2, 3, 4...), to:
- Faza 1 zajęłaby O(n) czasu
- Cała operacja byłaby O(n), nie O(log n)

Podwajanie (1, 2, 4, 8, 16...) to:
- Tylko O(log n) kroków do osiągnięcia n
- Zachowuje logarytmiczną złożoność

**English:**
If we increased index linearly (1, 2, 3, 4...), then:
- Phase 1 would take O(n) time
- Entire operation would be O(n), not O(log n)

Doubling (1, 2, 4, 8, 16...) means:
- Only O(log n) steps to reach n
- Preserves logarithmic complexity

## Przypadki Brzegowe / Edge Cases

1. **Element na początku** - index 0 lub 1
2. **Element na końcu** - ostatni element przed -1
3. **Element nie istnieje** - zwróć -1
4. **Pusta lista** - elementAt(0) == -1
5. **Jeden element** - tylko elementAt(0) != -1
6. **Target większy niż wszystkie** - nie znaleziono
7. **Duplikaty** - zwróć dowolny indeks

1. **Element at start** - index 0 or 1
2. **Element at end** - last element before -1
3. **Element doesn't exist** - return -1
4. **Empty list** - elementAt(0) == -1
5. **Single element** - only elementAt(0) != -1
6. **Target larger than all** - not found
7. **Duplicates** - return any index

## Pytania do Rekrutera / Questions for Interviewer

1. Czy lista jest zawsze posortowana rosnąco? / Is the list always sorted in ascending order?
2. Czy mogą być duplikaty? / Can there be duplicates?
3. Co zwrócić gdy element nie istnieje? / What to return when element doesn't exist?
4. Czy elementAt(0) jest poprawne? / Is elementAt(0) valid?
5. Czy możemy cache'ować wyniki elementAt()? / Can we cache elementAt() results?

## Kluczowe Wnioski / Key Takeaways

1. **Wykładnicze wyszukiwanie zakresu** - szybki sposób na znalezienie granic
2. **Podwajanie zachowuje O(log n)** - 1→2→4→8... to tylko log n kroków
3. **Dwufazowe podejście** - najpierw zakres, potem binary search
4. **Brak rozmiaru nie jest problemem** - możemy go "odkryć" wydajnie

1. **Exponential range finding** - fast way to find boundaries
2. **Doubling preserves O(log n)** - 1→2→4→8... is only log n steps
3. **Two-phase approach** - first range, then binary search
4. **Missing size is not a problem** - we can "discover" it efficiently
