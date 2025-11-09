# 16.5 Factorial Zeros

## Opis Zadania / Problem Description

**Factorial Zeros**: Write an algorithm which computes the number of trailing zeros in n factorial.

**Zera na Końcu Silni**: Napisz algorytm, który oblicza liczbę zer na końcu n silni.

Hints: #585, #711, #729, #733, #745

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć liczbę zer na końcu n! (n factorial). Na przykład:
- 5! = 120 → 1 zero na końcu
- 10! = 3,628,800 → 2 zera na końcu
- 20! = 2,432,902,008,176,640,000 → 4 zera na końcu

Zera na końcu powstają z mnożenia przez 10, a 10 = 2 × 5.
Trailing zeros come from multiplying by 10, and 10 = 2 × 5.

## Kluczowa Obserwacja / Key Observation

Zero na końcu powstaje z pary (2, 5). W silni jest zawsze więcej dwójek niż piątek, więc liczba zer = liczba piątek w rozkładzie na czynniki pierwsze.

A trailing zero comes from a pair of (2, 5). In factorial, there are always more 2s than 5s, so number of zeros = number of 5s in prime factorization.

## Rozwiązanie / Solution

Zlicz ile piątek jest w n!:
- Liczby podzielne przez 5: n/5
- Liczby podzielne przez 25 (5²): n/25 (dodatkowa piątka)
- Liczby podzielne przez 125 (5³): n/125 (jeszcze jedna piątka)
- itd.

Count how many 5s are in n!:
- Numbers divisible by 5: n/5
- Numbers divisible by 25 (5²): n/25 (extra five)
- Numbers divisible by 125 (5³): n/125 (another five)
- etc.

```javascript
function countTrailingZeros(n) {
  let count = 0;
  let powerOf5 = 5;

  while (powerOf5 <= n) {
    count += Math.floor(n / powerOf5);
    powerOf5 *= 5;
  }

  return count;
}
```

**Złożoność / Complexity**: O(log₅ n)
