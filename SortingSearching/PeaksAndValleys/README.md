# Peaks and Valleys - Szczyty i Doliny

## Treść Zadania / Problem Statement

**English:**
In an array of integers, a "peak" is an element which is greater than or equal to the adjacent integers and a "valley" is an element which is less than or equal to the adjacent integers. Given an array of integers, sort the array into an alternating sequence of peaks and valleys.

**Example:**
Input: [5, 3, 1, 2, 3]
Output: [5, 1, 3, 2, 3]

**Polski:**
W tablicy liczb całkowitych "szczyt" to element większy lub równy sąsiednim elementom, a "dolina" to element mniejszy lub równy sąsiednim. Posortuj tablicę w przemienną sekwencję szczytów i dolin.

## Rozwiązanie: Naprawianie w Miejscu

### Podejście: Iteruj i zamieniaj

**Algorytm / Algorithm:**

1. Iteruj przez tablicę co drugi element (0, 2, 4...)
2. Dla każdego indeksu, upewnij się że jest szczytem:
   - Porównaj z lewym sąsiadem: jeśli mniejszy, zamień
   - Porównaj z prawym sąsiadem: jeśli mniejszy, zamień

**Dlaczego to działa?**
Każda zamiana naprawia lokalny problem bez psucia wcześniejszych napraw.

### Złożoność / Complexity
- **Czas / Time:** O(n)
- **Pamięć / Space:** O(1)
