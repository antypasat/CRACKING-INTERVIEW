# 16.7 Number Max

## Opis Zadania / Problem Description

**Number Max**: Write a method that finds the maximum of two numbers. You should not use if-else or any other comparison operator.

**Maksimum Liczb**: Napisz metodę która znajduje maksimum z dwóch liczb. Nie możesz używać if-else ani żadnego operatora porównania.

Hints: #473, #513, #707, #728

## Rozwiązanie / Solution

Używamy bitów i algebry do znalezienia maksimum bez if-else:

```javascript
function max(a, b) {
  // Oblicz znak różnicy (1 jeśli a > b, 0 jeśli b > a)
  const diff = a - b;
  const sign = (diff >> 31) & 1; // 1 jeśli ujemne, 0 jeśli dodatnie

  return a * (1 - sign) + b * sign;
}
```

**Złożoność**: O(1)
