# 6.9 100 Lockers / 100 Szafek

## Problem
There are 100 closed lockers in a hallway. A man begins by opening all 100 lockers. Next, he closes every second locker. Then, on his third pass, he toggles every third locker (closes it if it is open or opens it if it is closed). This process continues for 100 passes, such that on each pass i, the man toggles every ith locker. After his 100th pass in the hallway, in which he toggles only locker #100, how many lockers are open?

Jest 100 zamkniętych szafek w korytarzu. Człowiek zaczyna od otwarcia wszystkich 100 szafek. Następnie zamyka co drugą szafkę. Potem, przy trzecim przejściu, przełącza co trzecią szafkę (zamyka jeśli otwarta, otwiera jeśli zamknięta). Ten proces trwa przez 100 przejść. Po 100 przejściach, ile szafek jest otwartych?

## Solution / Rozwiązanie

**Answer: 10 lockers are open**

**They are: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100**

(All perfect squares from 1 to 100)

## Explanation / Wyjaśnienie

### Key Observations / Kluczowe Obserwacje

1. **Locker #k is toggled on pass i if i divides k**
   - Locker #12 is toggled on passes: 1, 2, 3, 4, 6, 12
   - Number of toggles = number of divisors

2. **Locker is OPEN if toggled an ODD number of times**
   - Starts closed, first toggle opens it
   - Even toggles → closed, odd toggles → open

3. **When does a number have an odd number of divisors?**
   - Divisors come in pairs: if d divides n, so does n/d
   - Example: 12 has divisors 1×12, 2×6, 3×4 (6 divisors, even)
   - EXCEPTION: When d = n/d, i.e., d² = n
   - This happens only for **perfect squares**!

### Perfect Squares Have Odd Divisors / Kwadraty Doskonałe Mają Nieparzyste Dzielniki

**Example: 16**
- Divisors: 1, 2, 4, 8, 16
- Pairs: 1×16, 2×8, 4×4
- The pair 4×4 is the SAME number twice!
- Count: 5 (odd) → locker #16 stays OPEN

**Example: 12**
- Divisors: 1, 2, 3, 4, 6, 12
- Pairs: 1×12, 2×6, 3×4
- All pairs are distinct
- Count: 6 (even) → locker #12 ends CLOSED

### Detailed Example / Szczegółowy Przykład

**Locker #36:**
- Divisors: 1, 2, 3, 4, 6, 9, 12, 18, 36
- Pairs: 1×36, 2×18, 3×12, 4×9, 6×6
- 6×6 counts once (√36 = 6)
- Total: 9 divisors (odd)
- **Result: OPEN** ✓

**Locker #35:**
- Divisors: 1, 5, 7, 35
- Pairs: 1×35, 5×7
- All pairs distinct
- Total: 4 divisors (even)
- **Result: CLOSED** ✗

## Visual Pattern / Wzorzec Wizualny

First 25 lockers (OPEN shown in brackets):
```
[1]   2    3   [4]   5
 6    7    8   [9]  10
11   12   13   14   15
[16] 17   18   19   20
21   22   23   24  [25]
```

Pattern: 1, 4, 9, 16, 25 = 1², 2², 3², 4², 5²

## General Formula / Ogólny Wzór

For n lockers:
```
Number of open lockers = ⌊√n⌋
```

For 100 lockers: ⌊√100⌋ = 10

Perfect squares: 1², 2², 3², ..., 10² = 1, 4, 9, 16, 25, 36, 49, 64, 81, 100

## Mathematical Proof / Dowód Matematyczny

**Theorem:** A positive integer n has an odd number of divisors if and only if n is a perfect square.

**Proof:**
- Divisors of n come in pairs (d, n/d) where d × (n/d) = n
- If d ≠ n/d, we count both d and n/d (contributing 2 to count)
- If d = n/d, then d² = n, so we count d only once (contributing 1)
- The divisor d = n/d exists ⟺ n is a perfect square
- Therefore, divisor count is odd ⟺ n is a perfect square ∎

## Complexity / Złożoność
- **Simulation:** O(n²) - n passes, each touching O(n) lockers
- **Mathematical solution:** O(√n) - count perfect squares up to n
- **Optimal:** O(1) - just calculate ⌊√n⌋
