# 6.8 The Egg Drop Problem / Problem Spadającego Jajka

## Problem
There is a building of 100 floors. If an egg drops from the Nth floor or above, it will break. If it's dropped from any floor below, it will not break. You're given two eggs. Find N, while minimizing the number of drops for the worst case.

Jest budynek ze 100 piętrami. Jeśli jajko spadnie z N-tego piętra lub wyżej, się zbije. Jeśli spadnie z piętra niżej, nie zbije się. Masz 2 jajka. Znajdź N, minimalizując liczbę prób w najgorszym przypadku.

## Solution / Rozwiązanie

**Answer: 14 drops maximum using decreasing intervals**

### Strategy / Strategia

**Drop sequence:** 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100

**How it works:**
1. Drop first egg from floor 14
2. If it breaks: use second egg to test floors 1-13 linearly (max 13 more drops)
3. If it doesn't break: drop from floor 27 (interval of 13)
4. Continue with decreasing intervals: 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 1

### Why This Is Optimal / Dlaczego To Jest Optymalne

**Load Balancing Principle:**
- If first egg breaks on drop k, we have (n-k+1) floors to check with second egg
- Total drops: k + (n-k+1) = n+1
- By using decreasing intervals, we balance the work across all scenarios

**Mathematical derivation:**
```
To cover 100 floors with n drops:
n + (n-1) + (n-2) + ... + 1 ≥ 100
n(n+1)/2 ≥ 100
n² + n - 200 ≥ 0
n ≥ 13.65...
n = 14
```

### Example Execution / Przykład Wykonania

**Breaking floor = 27:**
1. Drop from 14 → doesn't break
2. Drop from 27 → breaks!
3. Linear search: 15, 16, ..., 26 with second egg
4. Total: 2 + 12 = 14 drops

**Breaking floor = 13:**
1. Drop from 14 → breaks!
2. Linear search: 1, 2, ..., 13 with second egg
3. Total: 1 + 13 = 14 drops

### Comparison with Simpler Strategies

| Strategy | Worst Case Drops |
|----------|------------------|
| Linear (1,2,3,...) | 100 |
| Binary search (impossible - would break both eggs) | N/A |
| Every 10 floors | 19 (10 + 9) |
| **Decreasing intervals** | **14** ✓ |

### Key Insights / Kluczowe Spostrzeżenia

1. **Can't use binary search** - would waste both eggs
2. **Fixed intervals suboptimal** - doesn't balance early vs late breaks
3. **Decreasing intervals optimal** - ensures constant worst-case across all floors
4. **Load balancing** - make total work same regardless of where egg breaks

## Drop Sequence Breakdown / Szczegóły Sekwencji

| Drop # | Floor | Interval | Remaining Capacity |
|--------|-------|----------|-------------------|
| 1 | 14 | 14 | Can check 13 more |
| 2 | 27 | 13 | Can check 12 more |
| 3 | 39 | 12 | Can check 11 more |
| 4 | 50 | 11 | Can check 10 more |
| 5 | 60 | 10 | Can check 9 more |
| 6 | 69 | 9 | Can check 8 more |
| 7 | 77 | 8 | Can check 7 more |
| 8 | 84 | 7 | Can check 6 more |
| 9 | 90 | 6 | Can check 5 more |
| 10 | 95 | 5 | Can check 4 more |
| 11 | 99 | 4 | Can check 3 more |
| 12 | 100 | 1 | Done |

## Generalization / Uogólnienie

For n floors with 2 eggs:
```
Maximum drops = ⌈√(2n)⌉
```

For 100 floors: ⌈√200⌉ = ⌈14.14⌉ = 14

## Complexity / Złożoność
- **Time:** O(√n) drops needed
- **Space:** O(1)
- **Calculation:** O(√n) to generate sequence
