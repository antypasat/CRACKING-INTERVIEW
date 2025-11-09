# Rank from Stream - Ranga ze Strumienia

## Treść Zadania / Problem Statement

**English:**
Imagine you are reading in a stream of integers. Periodically, you wish to be able to look up the rank of a number x (the number of values less than or equal to x). Implement the data structures and algorithms to support these operations:
- `track(int x)` - called when each number is generated
- `getRankOfNumber(int x)` - returns the number of values less than or equal to x (not including x itself)

**Polski:**
Wyobraź sobie, że czytasz strumień liczb całkowitych. Okresowo chcesz móc sprawdzić rangę liczby x (liczbę wartości mniejszych lub równych x). Zaimplementuj struktury danych i algorytmy wspierające te operacje.

## Rozwiązanie: Binary Search Tree (BST)

### Podejście: Zmodyfikowane BST z licznikiem

**Struktura węzła:**
```javascript
class Node {
  value;        // Wartość węzła
  leftSize;     // Liczba węzłów w lewym poddrzewie
  left, right;  // Lewe i prawe poddrzewo
}
```

**Kluczowa idea:** `leftSize` śledzi liczbę węzłów mniejszych niż bieżący.

### Algorytm / Algorithm

**track(x):**
- Wstaw x do BST
- Aktualizuj leftSize podczas wstawiania

**getRankOfNumber(x):**
- Przeszukuj BST dla x
- Sumuj rangi podczas schodzenia

### Złożoność / Complexity
- **track:** O(log n) średnio, O(n) najgorszy
- **getRank:** O(log n) średnio, O(n) najgorszy
