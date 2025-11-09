# Sorted Matrix Search - Wyszukiwanie w Posortowanej Macierzy

## Treść Zadania / Problem Statement

**English:**
Given an M x N matrix in which each row and each column is sorted in ascending order, write a method to find an element.

**Polski:**
Mając macierz M x N, w której każdy wiersz i każda kolumna jest posortowana rosnąco, napisz metodę do znalezienia elementu.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Macierz jest posortowana **zarówno w wierszach jak i kolumnach**:
```
 1   4   7  11  15
 2   5   8  12  19
 3   6   9  16  22
10  13  14  17  24
18  21  23  26  30
```

Kluczowa obserwacja: możemy **wykluczać całe wiersze/kolumny** podczas wyszukiwania.

**English:**
Matrix is sorted **both in rows and columns**:
Key observation: we can **exclude entire rows/columns** during search.

## Rozwiązanie: Wyszukiwanie od Rogu

### Podejście: Zacznij od prawego górnego rogu

**Algorytm / Algorithm:**

1. Zacznij od prawego górnego rogu (row=0, col=N-1)
2. Porównaj element z targetem:
   - Jeśli równe → znaleziono!
   - Jeśli element > target → idź w lewo (col--)
   - Jeśli element < target → idź w dół (row++)
3. Powtarzaj aż znajdziesz lub wyjdziesz poza macierz

**Dlaczego prawy górny róg?**
- W lewo: liczby są mniejsze
- W dół: liczby są większe
- Możemy eliminować całe wiersze/kolumny!

**Why top-right corner?**
- Left: numbers are smaller
- Down: numbers are larger
- We can eliminate entire rows/columns!

### Złożoność / Complexity
- **Czas / Time:** O(M + N)
- **Pamięć / Space:** O(1)
