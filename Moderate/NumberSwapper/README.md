# 16.1 Number Swapper

## Opis Zadania / Problem Description

**Number Swapper**: Write a function to swap a number in place (that is, without temporary variables).

**Zamiana Liczb**: Napisz funkcję do zamiany dwóch liczb w miejscu (czyli bez użycia zmiennych tymczasowych).

Hints: #492, #716, #737

## Wyjaśnienie Problemu / Problem Explanation

W tradycyjnym podejściu do zamiany dwóch wartości używamy trzeciej zmiennej tymczasowej:
```javascript
let temp = a;
a = b;
b = temp;
```

To zadanie wymaga zamiany wartości **bez użycia dodatkowej zmiennej tymczasowej**. Musimy wykorzystać właściwości matematyczne lub operacje bitowe, aby osiągnąć ten cel.

In the traditional approach to swapping two values, we use a third temporary variable. This task requires swapping values **without using an additional temporary variable**. We must use mathematical properties or bitwise operations to achieve this goal.

## Rozwiązania / Solutions

### Podejście 1: Operacje Arytmetyczne (Dodawanie i Odejmowanie)
### Approach 1: Arithmetic Operations (Addition and Subtraction)

**Idea**: Wykorzystujemy fakt, że jeśli znamy sumę dwóch liczb, możemy odzyskać każdą z nich odejmując drugą od sumy.

**Idea**: We use the fact that if we know the sum of two numbers, we can recover each one by subtracting the other from the sum.

```javascript
function swapArithmetic(a, b) {
  a = a + b;  // a teraz zawiera sumę / a now contains the sum
  b = a - b;  // b = (a+b) - b = a (oryginalne a / original a)
  a = a - b;  // a = (a+b) - a = b (oryginalne b / original b)
  return [a, b];
}
```

**Zalety / Advantages**:
- Proste i intuicyjne / Simple and intuitive
- Działa dla wszystkich liczb / Works for all numbers

**Wady / Disadvantages**:
- Może wystąpić overflow przy dużych liczbach / May overflow with large numbers
- Działa tylko dla liczb / Only works for numbers

**Złożoność / Complexity**:
- Czasowa / Time: O(1)
- Pamięciowa / Space: O(1)

### Podejście 2: Operacje Bitowe (XOR)
### Approach 2: Bitwise Operations (XOR)

**Idea**: XOR ma ciekawą właściwość: `a ^ b ^ b = a`. Wykorzystujemy to do zamiany wartości.

**Idea**: XOR has an interesting property: `a ^ b ^ b = a`. We use this to swap values.

**Właściwości XOR / XOR Properties**:
- `a ^ a = 0` (liczba XOR sama ze sobą daje 0 / number XOR itself gives 0)
- `a ^ 0 = a` (liczba XOR 0 daje tę liczbę / number XOR 0 gives that number)
- `a ^ b ^ b = a` (XOR jest odwracalny / XOR is reversible)

```javascript
function swapXOR(a, b) {
  a = a ^ b;  // a = a XOR b
  b = a ^ b;  // b = (a XOR b) XOR b = a
  a = a ^ b;  // a = (a XOR b) XOR a = b
  return [a, b];
}
```

**Zalety / Advantages**:
- Nie ma problemu z overflow / No overflow issue
- Bardzo efektywne / Very efficient
- Eleganckie rozwiązanie / Elegant solution

**Wady / Disadvantages**:
- Działa tylko dla liczb całkowitych / Only works for integers
- Mniej intuicyjne / Less intuitive

**Złożoność / Complexity**:
- Czasowa / Time: O(1)
- Pamięciowa / Space: O(1)

### Podejście 3: Mnożenie i Dzielenie
### Approach 3: Multiplication and Division

**Idea**: Podobnie jak z dodawaniem, możemy użyć mnożenia i dzielenia.

**Idea**: Similar to addition, we can use multiplication and division.

```javascript
function swapMultiplication(a, b) {
  a = a * b;  // a teraz zawiera iloczyn / a now contains the product
  b = a / b;  // b = (a*b) / b = a
  a = a / b;  // a = (a*b) / a = b
  return [a, b];
}
```

**Wady / Disadvantages**:
- Nie działa gdy a lub b = 0 / Doesn't work when a or b = 0
- Problemy z precyzją dla liczb zmiennoprzecinkowych / Precision issues with floating point
- Może wystąpić overflow / May overflow

**Złożoność / Complexity**:
- Czasowa / Time: O(1)
- Pamięciowa / Space: O(1)

### Podejście 4: Destructuring (ES6+)
### Approach 4: Destructuring (ES6+)

**Uwaga**: To technicznie używa tymczasowej pamięci "pod spodem", ale składnia jest elegancka.

**Note**: This technically uses temporary memory "under the hood", but the syntax is elegant.

```javascript
function swapDestructuring(a, b) {
  [a, b] = [b, a];
  return [a, b];
}
```

## Szczególne Przypadki / Edge Cases

1. **Liczby równe / Equal numbers**: `swap(5, 5)` → `(5, 5)`
2. **Zero**: `swap(0, 5)` → `(5, 0)`
3. **Liczby ujemne / Negative numbers**: `swap(-3, 7)` → `(7, -3)`
4. **Duże liczby / Large numbers**: Uwaga na overflow / Watch for overflow
5. **Liczby zmiennoprzecinkowe / Floating point**: Uwaga na precyzję / Watch for precision

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **XOR (Podejście 2)**: Najlepsze dla liczb całkowitych, brak overflow / Best for integers, no overflow
- **Arytmetyczne (Podejście 1)**: Najprostsze do zrozumienia / Easiest to understand
- **Destructuring (Podejście 4)**: Najczytelniejsze w JavaScript / Most readable in JavaScript

## Analiza Matematyczna / Mathematical Analysis

### Dlaczego XOR działa? / Why does XOR work?

```
Krok 1: a' = a ^ b
Krok 2: b' = a' ^ b = (a ^ b) ^ b = a ^ (b ^ b) = a ^ 0 = a
Krok 3: a'' = a' ^ b' = (a ^ b) ^ a = (a ^ a) ^ b = 0 ^ b = b
```

Właściwość przemienności i łączności XOR sprawia, że możemy "odzyskać" oryginalne wartości.

The commutative and associative properties of XOR allow us to "recover" the original values.
