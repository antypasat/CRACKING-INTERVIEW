# 6.7 The Apocalypse / Apokalipsa

## Problem
In the new post-apocalyptic world, the world queen is desperately concerned about the birth rate. Therefore, she decrees that all families should ensure that they have one girl or else they face massive fines. If all families abide by this policy—that is, they have continue to have children until they have one girl, at which point they immediately stop—what will the gender ratio of the new generation be? (Assume that the odds of someone having a boy or a girl on any given pregnancy is equal.) Solve this out logically and then write a computer simulation of it.

## Solution / Rozwiązanie

**Answer: The gender ratio will be approximately 1:1 (equal boys and girls)**

## Logical Explanation / Wyjaśnienie Logiczne

**Key Insight:** The policy doesn't affect the probability of each individual birth.

Each birth still has:
- 50% chance of boy
- 50% chance of girl

The policy only affects **when families stop**, not the gender probabilities.

### Mathematical Proof / Dowód Matematyczny

For n families:
- **Total girls:** G = n (each family has exactly 1 girl)
- **Total boys:** B = n × E[boys per family]

**Expected boys per family:**
```
E[boys] = 0×P(G) + 1×P(BG) + 2×P(BBG) + 3×P(BBBG) + ...
        = 0×(1/2) + 1×(1/4) + 2×(1/8) + 3×(1/16) + ...
        = Σ k×(1/2)^(k+1) for k=0 to ∞
        = 1
```

Therefore: **B/G = n×1 / n = 1**

## Intuitive Explanation / Intuicyjne Wyjaśnienie

Think of all births in the population as a sequence:
```
B B G | B G | G | B B B G | ...
```

The policy just determines where to put the "|" (family boundaries), but:
- Still ~50% of all births are boys
- Still ~50% of all births are girls

The stopping rule doesn't change these fundamental probabilities!

## Computer Simulation Results / Wyniki Symulacji

| Families | Boys | Girls | Ratio (B:G) |
|----------|------|-------|-------------|
| 1,000 | ~1,000 | 1,000 | ~1.00 |
| 10,000 | ~10,000 | 10,000 | ~1.00 |
| 100,000 | ~100,000 | 100,000 | ~1.00 |
| 1,000,000 | ~1,000,000 | 1,000,000 | ~1.00 |

As population size increases, ratio converges to 1:1.

## Family Distribution / Rozkład Rodzin

| Pattern | Probability | Boys | Girls |
|---------|-------------|------|-------|
| G | 1/2 = 50% | 0 | 1 |
| BG | 1/4 = 25% | 1 | 1 |
| BBG | 1/8 = 12.5% | 2 | 1 |
| BBBG | 1/16 = 6.25% | 3 | 1 |
| BBBBG | 1/32 = 3.125% | 4 | 1 |
| ... | ... | ... | ... |

Even though individual families vary, population-wide the average is 1 boy per 1 girl.

## Key Takeaway / KluczowyWniosek

The gender ratio remains **1:1** because:

1. Each birth is independent with 50/50 probability
2. The stopping rule affects timing, not probability
3. Law of large numbers ensures convergence to expected ratio
4. Population-level statistics matter, not individual family patterns

Stosunek płci pozostaje **1:1** ponieważ:

1. Każde urodzenie jest niezależne z prawdopodobieństwem 50/50
2. Reguła zatrzymania wpływa na czas, nie na prawdopodobieństwo
3. Prawo wielkich liczb zapewnia zbieżność do oczekiwanego stosunku
4. Liczą się statystyki populacyjne, nie wzorce pojedynczych rodzin

## Complexity / Złożoność
- **Logical proof:** O(1)
- **Simulation:** O(n) where n = number of families
- **Expected children per family:** O(1) = 2 (1 girl + 1 boy on average)
