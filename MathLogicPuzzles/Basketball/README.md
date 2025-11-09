# 6.2 Basketball / Koszykówka

## Problem
You have a basketball hoop and someone says that you can play one of two games:
- **Game 1:** You get one shot to make the hoop.
- **Game 2:** You get three shots and you have to make two of three shots.

If p is the probability of making a particular shot, for which values of p should you pick one game or the other?

## Solution / Rozwiązanie

**Game 1 probability:** P₁(p) = p

**Game 2 probability:** P₂(p) = P(exactly 2) + P(all 3)
- P(exactly 2) = C(3,2) × p² × (1-p) = 3p²(1-p)
- P(all 3) = p³
- P₂(p) = 3p²(1-p) + p³ = 3p² - 2p³

**Find threshold:** Set P₁ = P₂
```
p = 3p² - 2p³
2p³ - 3p² + p = 0
p(2p² - 3p + 1) = 0
p(2p - 1)(p - 1) = 0
```

Solutions: p = 0, p = 0.5, p = 1.0

**Critical point:** p = 0.5

## Decision Rule / Zasada Decyzji

- **If p < 0.5:** Choose **Game 1** (single shot)
- **If p = 0.5:** Either game (equal probability = 0.5)
- **If p > 0.5:** Choose **Game 2** (best 2 of 3)

## Intuition / Intuicja

**Poor shooter (p < 0.5):**
- More shots = more opportunities to fail
- Better to take just one shot

**Good shooter (p > 0.5):**
- More shots = insurance against one miss
- Can afford to miss once and still win
- Take three shots

## Examples / Przykłady

| p | Game 1 | Game 2 | Better Choice |
|---|--------|--------|---------------|
| 0.3 | 0.300 | 0.216 | Game 1 |
| 0.5 | 0.500 | 0.500 | Either |
| 0.7 | 0.700 | 0.784 | Game 2 |
| 0.8 | 0.800 | 0.896 | Game 2 |

## Complexity / Złożoność
- **Time:** O(1) - simple calculation
- **Space:** O(1)
