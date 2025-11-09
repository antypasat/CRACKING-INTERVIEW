# 16.23 Rand7 From Rand5

## Opis Zadania / Problem Description

**Rand7 From Rand5**: Implement a method `rand7()` given `rand5()`. That is, given a method that generates a random number between 0 and 4 (inclusive), write a method that generates a random number between 0 and 6 (inclusive).

**Rand7 z Rand5**: Zaimplementuj metodę `rand7()` mając `rand5()`. Czyli, mając metodę generującą losową liczbę między 0 a 4 (włącznie), napisz metodę generującą losową liczbę między 0 a 6 (włącznie).

Hints: #505, #574, #637, #668, #697, #720

## Wyjaśnienie Problemu / Problem Explanation

Mamy generator losowy `rand5()`, który generuje liczby {0, 1, 2, 3, 4} z równym prawdopodobieństwem (każda ma szansę 1/5 = 20%).

Musimy stworzyć `rand7()`, który generuje liczby {0, 1, 2, 3, 4, 5, 6} również z równym prawdopodobieństwem (każda ma mieć szansę 1/7 ≈ 14.3%).

We have a random generator `rand5()` that generates numbers {0, 1, 2, 3, 4} with equal probability (each has 1/5 = 20% chance).

We must create `rand7()` that generates numbers {0, 1, 2, 3, 4, 5, 6} also with equal probability (each should have 1/7 ≈ 14.3% chance).

**Główne Wyzwanie / Main Challenge**:
- 5 i 7 nie mają wspólnych dzielników (są względnie pierwsze)
- Nie możemy po prostu dodać, pomnożyć lub podzielić wyników rand5()
- Musimy stworzyć "większą przestrzeń" losowości, a potem z niej wybrać

**Kluczowa Idea / Key Idea**:
1. Użyj `rand5()` dwa razy by stworzyć `rand25()` (25 możliwości)
2. Z 25 możliwości, użyj tylko 21 (3×7), które dzielą się równo przez 7
3. Odrzuć pozostałe 4 i spróbuj ponownie

## Rozwiązania / Solutions

### Podejście 1: Naiwne (Niepoprawne)

**Próby które NIE działają**:

```javascript
// ✗ ŹLE - Nierówne prawdopodobieństwa
function rand7Wrong1() {
  return rand5() % 7; // Niektóre liczby częstsze
}

// ✗ ŹLE - Zakres 0-9, nie 0-6
function rand7Wrong2() {
  return rand5() + rand5();
}

// ✗ ŹLE - Nierówne prawdopodobieństwa
function rand7Wrong3() {
  const r = rand5();
  return r === 0 ? rand5() % 7 : r % 7;
}
```

**Dlaczego to nie działa? / Why doesn't this work?**
- Modulo daje nierówne rozkłady
- Dodawanie daje rozkład trójkątny (środkowe liczby częstsze)

### Podejście 2: Rejection Sampling - O(1) średnio ✓ OPTYMALNE

**Idea**: Stwórz większą przestrzeń (rand25), użyj tylko równo podzielnej części.

**Idea**: Create larger space (rand25), use only evenly divisible part.

```javascript
function rand7() {
  while (true) {
    // Generuj rand25: liczby 0-24
    const num = rand5() * 5 + rand5();

    // Użyj tylko liczb 0-20 (21 wartości = 3 × 7)
    if (num < 21) {
      return num % 7; // 0, 1, 2, 3, 4, 5, 6
    }
    // Jeśli num ∈ {21, 22, 23, 24}, odrzuć i spróbuj ponownie
  }
}
```

**Jak to działa? / How does it work?**

```
rand5() * 5 + rand5() generuje:

  +   | 0   1   2   3   4
------|------------------
  0   | 0   1   2   3   4
  5   | 5   6   7   8   9
 10   |10  11  12  13  14
 15   |15  16  17  18  19
 20   |20  21  22  23  24

25 równo rozłożonych liczb 0-24

Z tych 25:
- Użyj 0-20 (21 liczb = 3×7) → każda grupa ma 3 liczby
- Odrzuć 21-24 (4 liczby)

0-20 % 7 daje:
  0: 0, 7, 14  (3 liczby)
  1: 1, 8, 15  (3 liczby)
  2: 2, 9, 16  (3 liczby)
  3: 3, 10, 17 (3 liczby)
  4: 4, 11, 18 (3 liczby)
  5: 5, 12, 19 (3 liczby)
  6: 6, 13, 20 (3 liczby)

Każda liczba 0-6 ma dokładnie 3/21 = 1/7 prawdopodobieństwa! ✓
```

**Złożoność / Complexity**:
- Czasowa / Time: O(1) średnio (oczekiwana liczba iteracji = 25/21 ≈ 1.19)
- Pamięciowa / Space: O(1)

**Prawdopodobieństwo odrzucenia / Rejection probability**:
- P(odrzucenie) = 4/25 = 16%
- P(akceptacja) = 21/25 = 84%
- Średnia liczba prób = 1/(21/25) ≈ 1.19

### Podejście 3: Optymalizacja - Wykorzystaj Odrzucone Wartości

**Idea**: Gdy odrzucimy 21-24, mamy 4 wartości (rand4). Możemy to wykorzystać!

**Idea**: When we reject 21-24, we have 4 values (rand4). We can use this!

```javascript
function rand7Optimized() {
  while (true) {
    // Generuj rand25
    let num = rand5() * 5 + rand5();

    if (num < 21) {
      return num % 7;
    }

    // num ∈ {21, 22, 23, 24} → 4 wartości (0-3)
    // rand4 * 5 + rand5 = rand20 (0-19)
    num = (num - 21) * 5 + rand5(); // rand20: 0-19

    if (num < 14) {
      return num % 7; // 14 = 2×7
    }

    // num ∈ {14, 15, 16, 17, 18, 19} → 6 wartości
    // Możemy kontynuować, ale zwykle tu się zatrzymujemy
    // i wracamy do początku
  }
}
```

**Zaleta / Advantage**: Mniej odrzuceń, lepsza wydajność

### Podejście 4: Alternatywne Podejście - Rand7 przez Rand2

**Idea**: Najpierw stwórz `rand2()` (rzut monetą), potem użyj do `rand7()`.

**Idea**: First create `rand2()` (coin flip), then use for `rand7()`.

```javascript
function rand2FromRand5() {
  let num;
  do {
    num = rand5();
  } while (num >= 4); // Odrzuć 4, użyj tylko 0-3

  return num % 2; // 0 lub 1 z prawdopodobieństwem 1/2
}

function rand7FromRand2() {
  // Generuj 3-bitową liczbę (0-7) używając rand2
  while (true) {
    let num = rand2FromRand5() * 4 +
              rand2FromRand5() * 2 +
              rand2FromRand5(); // 0-7

    if (num < 7) {
      return num; // 0-6
    }
    // Odrzuć 7
  }
}
```

**Złożoność / Complexity**: Więcej wywołań rand5(), mniej efektywne

## Szczególne Przypadki / Edge Cases

1. **Rozkład prawdopodobieństwa**: Każda liczba 0-6 musi mieć dokładnie 1/7
2. **Nieskończona pętla**: Teoretycznie możliwa, ale P → 0 bardzo szybko
3. **Deterministyczne testy**: Trudne do przetestowania - wymaga symulacji Monte Carlo

## Analiza Matematyczna / Mathematical Analysis

### Dlaczego Rejection Sampling działa?

**Prawdopodobieństwa w rand25**:
```
P(każda liczba 0-24) = 1/25 = 4%
```

**Po rejection sampling (0-20)**:
```
P(otrzymać k | accepted) = P(k i accepted) / P(accepted)
                          = (3/25) / (21/25)
                          = 3/21
                          = 1/7 ✓
```

### Oczekiwana liczba wywołań rand5()

```
E[wywołań] = 2 × (1 + P(odrzucenie) + P(odrzucenie)² + ...)
           = 2 × 1/(1 - 4/25)
           = 2 × 25/21
           ≈ 2.38
```

Każda próba wymaga 2 wywołań rand5(), więc średnio ~2.38 wywołań.

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład 1: Udana pierwsza próba

```
rand5() = 2
rand5() = 3
num = 2 × 5 + 3 = 13

13 < 21 ✓
return 13 % 7 = 6
```

### Przykład 2: Odrzucenie i ponowna próba

```
Próba 1:
  rand5() = 4
  rand5() = 3
  num = 4 × 5 + 3 = 23
  23 ≥ 21 → ODRZUĆ

Próba 2:
  rand5() = 1
  rand5() = 2
  num = 1 × 5 + 2 = 7
  7 < 21 ✓
  return 7 % 7 = 0
```

## Rozszerzenia / Extensions

### Uogólnienie: RandN z RandM

```javascript
function randN_from_randM(n, m, randM) {
  // Znajdź k takie, że m^k ≥ n
  let power = 1;
  let range = m;

  while (range < n) {
    power++;
    range *= m;
  }

  // Użyj tylko floor(range/n) * n wartości
  const usable = Math.floor(range / n) * n;

  while (true) {
    let num = 0;
    for (let i = 0; i < power; i++) {
      num = num * m + randM();
    }

    if (num < usable) {
      return num % n;
    }
  }
}

// Przykład: rand7 z rand5
function rand7Generic() {
  return randN_from_randM(7, 5, rand5);
}
```

## Porównanie Metod / Method Comparison

| Metoda | Średnie wywołania rand5() | Prawdopodobieństwo sukcesu | Złożoność |
|--------|---------------------------|---------------------------|-----------|
| Podstawowa | 2.38 | 84% | O(1) avg |
| Optymalizowana | ~2.2 | >84% | O(1) avg |
| Przez rand2 | ~4-5 | ~75% | O(1) avg |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Rejection Sampling (Podejście 2)**: Najlepsze! Proste i efektywne
- **Optymalizowane (Podejście 3)**: Gdy każde wywołanie rand5() jest kosztowne
- **Przez rand2 (Podejście 4)**: Edukacyjne, pokazuje alternatywne podejście

## Wnioski / Conclusions

To zadanie uczy:
1. **Rejection Sampling**: Kluczowa technika w statystyce i symulacjach
2. **Arytmetyka modulo**: Jak tworzyć większe zakresy z mniejszych
3. **Równomierne rozkłady**: Jak zachować równe prawdopodobieństwa
4. **Analiza probabilistyczna**: Obliczanie oczekiwanych wartości

This problem teaches:
1. **Rejection Sampling**: Key technique in statistics and simulations
2. **Modular arithmetic**: How to create larger ranges from smaller ones
3. **Uniform distributions**: How to maintain equal probabilities
4. **Probabilistic analysis**: Calculating expected values

## Zastosowania / Applications

1. **Symulacje Monte Carlo**: Generowanie rozkładów z innych rozkładów
2. **Kryptografia**: Generowanie równomiernie rozłożonych losowych liczb
3. **Gry**: Generowanie fair dice rolls z ograniczonych źródeł losowości
4. **Statystyka**: Sampling z rozkładów niestandardowych
