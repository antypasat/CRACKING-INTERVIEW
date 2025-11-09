# Sorted Merge - Scalanie Posortowanych Tablic

## Treść Zadania / Problem Statement

**English:**
You are given two sorted arrays, A and B, where A has a large enough buffer at the end to hold B. Write a method to merge B into A in sorted order.

**Polski:**
Masz dane dwie posortowane tablice, A i B, gdzie A ma wystarczająco duży bufor na końcu, aby pomieścić B. Napisz metodę, która scali B do A w posortowanej kolejności.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Kluczową informacją w tym zadaniu jest to, że tablica A ma już zaalokowaną przestrzeń na końcu dla wszystkich elementów z B. Oznacza to, że możemy wykonać scalanie "in-place" (w miejscu) bez tworzenia nowej tablicy.

Problem polega na tym, że jeśli zaczniemy scalać od początku (jak w klasycznym merge sort), będziemy musieli przesuwać elementy w A, co jest kosztowne. Mądrzejszym podejściem jest **scalanie od końca do początku**.

**English:**
The key information in this problem is that array A already has allocated space at the end for all elements from B. This means we can perform "in-place" merging without creating a new array.

The problem is that if we start merging from the beginning (like in classic merge sort), we'll need to shift elements in A, which is expensive. A smarter approach is to **merge from end to beginning**.

## Rozwiązanie / Solution

### Podejście: Scalanie od Końca / Approach: Merge from End

**Kluczowa Intuicja / Key Intuition:**
- Zaczynamy od końca obu tablic
- Porównujemy elementy i umieszczamy większy element na końcu A
- Dzięki temu nie nadpisujemy jeszcze nieprzetworzonych elementów z A

**We start from the end of both arrays**
- Compare elements and place the larger element at the end of A
- This way we don't overwrite unprocessed elements from A

### Algorytm / Algorithm:

1. Ustaw trzy wskaźniki:
   - `indexA` - na ostatnim rzeczywistym elemencie A
   - `indexB` - na ostatnim elemencie B
   - `indexMerged` - na ostatniej pozycji bufora A

2. Dopóki są elementy do przetworzenia:
   - Porównaj `A[indexA]` z `B[indexB]`
   - Umieść większy element na pozycji `indexMerged`
   - Przesuń odpowiednie wskaźniki

3. Jeśli zostały elementy z B, skopiuj je do A

**Steps:**
1. Set three pointers:
   - `indexA` - at last real element of A
   - `indexB` - at last element of B
   - `indexMerged` - at last position of A's buffer

2. While there are elements to process:
   - Compare `A[indexA]` with `B[indexB]`
   - Place larger element at position `indexMerged`
   - Move appropriate pointers

3. If elements remain from B, copy them to A

### Wizualizacja / Visualization:

```
A = [1, 3, 5, _, _, _]  (3 elementy + 3 puste miejsca)
B = [2, 4, 6]

Krok 1: Porównaj 5 i 6 → 6 jest większe
A = [1, 3, 5, _, _, 6]

Krok 2: Porównaj 5 i 4 → 5 jest większe
A = [1, 3, 5, _, 5, 6]

Krok 3: Porównaj 3 i 4 → 4 jest większe
A = [1, 3, 5, 4, 5, 6]

Krok 4: Porównaj 3 i 2 → 3 jest większe
A = [1, 3, 3, 4, 5, 6]

Krok 5: Nie ma więcej elementów w A, kopiuj resztę B
A = [1, 2, 3, 4, 5, 6]
```

### Implementacja / Implementation:

```javascript
function sortedMerge(a, b, lastA, lastB) {
  // lastA - indeks ostatniego elementu w A (nie licząc bufora)
  // lastB - indeks ostatniego elementu w B
  // lastA - index of last element in A (not counting buffer)
  // lastB - index of last element in B

  let indexA = lastA;           // Ostatni element A / Last element of A
  let indexB = lastB;           // Ostatni element B / Last element of B
  let indexMerged = lastA + lastB + 1; // Ostatnia pozycja w buforze / Last position in buffer

  // Scalaj od końca / Merge from end
  while (indexB >= 0) {
    // Jeśli elementy A się skończyły, lub aktualny element B jest większy
    // If A elements are exhausted, or current B element is larger
    if (indexA >= 0 && a[indexA] > b[indexB]) {
      a[indexMerged] = a[indexA];
      indexA--;
    } else {
      a[indexMerged] = b[indexB];
      indexB--;
    }
    indexMerged--;
  }

  // Nie trzeba kopiować pozostałych elementów A - są już na miejscu!
  // No need to copy remaining A elements - they're already in place!
}
```

## Analiza Złożoności / Complexity Analysis

**Złożoność Czasowa / Time Complexity:** O(a + b)
- Gdzie a to liczba elementów w A, b to liczba elementów w B
- Każdy element jest przetwarzany dokładnie raz
- Where a is number of elements in A, b is number of elements in B
- Each element is processed exactly once

**Złożoność Pamięciowa / Space Complexity:** O(1)
- Scalamy "in-place" bez dodatkowej pamięci
- Tylko stałe zmienne pomocnicze (wskaźniki)
- We merge "in-place" without additional memory
- Only constant auxiliary variables (pointers)

## Przypadki Brzegowe / Edge Cases

1. **B jest pusta** - nic nie rób, A już jest posortowana
2. **A jest pusta (tylko bufor)** - skopiuj wszystkie elementy z B
3. **Wszystkie elementy B są mniejsze niż elementy A**
4. **Wszystkie elementy B są większe niż elementy A**
5. **Duplikaty w A i B**

1. **B is empty** - do nothing, A is already sorted
2. **A is empty (only buffer)** - copy all elements from B
3. **All B elements are smaller than A elements**
4. **All B elements are larger than A elements**
5. **Duplicates in A and B**

## Pytania do Rekrutera / Questions for Interviewer

1. Czy tablice mogą zawierać duplikaty? / Can arrays contain duplicates?
2. Czy możemy założyć, że bufor w A jest zawsze wystarczający? / Can we assume buffer in A is always sufficient?
3. Czy tablice są posortowane rosnąco czy malejąco? / Are arrays sorted ascending or descending?
4. Co zrobić, jeśli jedna z tablic jest pusta? / What if one of the arrays is empty?

## Kluczowe Wnioski / Key Takeaways

1. **Scalaj od końca** - unikasz przesuwania elementów
2. **Wykorzystaj dostępny bufor** - nie potrzebujesz dodatkowej pamięci
3. **Porównuj tylko do wyczerpania B** - elementy A są już na miejscu
4. **To klasyczne zadanie pokazujące jak odwrócenie kierunku przetwarzania może uprościć problem**

1. **Merge from end** - avoid shifting elements
2. **Use available buffer** - no need for additional memory
3. **Compare only until B is exhausted** - A elements are already in place
4. **Classic problem showing how reversing processing direction can simplify the problem**
