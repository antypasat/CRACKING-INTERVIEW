# 6.5 Jugs of Water / Dzbany z Wodą

## Problem
You have a five-quart jug, a three-quart jug, and an unlimited supply of water (but no measuring cups). How would you come up with exactly four quarts of water? Note that the jugs are oddly shaped, such that filling up exactly "half" of the jug would be impossible.

Masz dzban 5-kwartowy, dzban 3-kwartowy i nieograniczone źródło wody. Jak uzyskać dokładnie 4 kwarty wody? Dzbany mają dziwne kształty, więc nie można odmierzyć "pół" dzbana.

## Solution 1 (Most Efficient - 6 steps)

| Step | Action | 5qt Jug | 3qt Jug |
|------|--------|---------|---------|
| 0 | Initial | 0 | 0 |
| 1 | Fill 5qt jug | **5** | 0 |
| 2 | Pour 5qt → 3qt (fill it) | **2** | 3 |
| 3 | Empty 3qt jug | 2 | **0** |
| 4 | Pour 5qt → 3qt (move 2qt) | 0 | **2** |
| 5 | Fill 5qt jug | **5** | 2 |
| 6 | Pour 5qt → 3qt (add 1qt) | **4** ✓ | 3 |

**Result:** 4 quarts in the 5qt jug!

## Solution 2 (Alternative - 8 steps)

| Step | Action | 5qt Jug | 3qt Jug |
|------|--------|---------|---------|
| 0 | Initial | 0 | 0 |
| 1 | Fill 3qt jug | 0 | **3** |
| 2 | Pour 3qt → 5qt | **3** | 0 |
| 3 | Fill 3qt jug | 3 | **3** |
| 4 | Pour 3qt → 5qt (fill it) | **5** | 1 |
| 5 | Empty 5qt jug | **0** | 1 |
| 6 | Pour 3qt → 5qt | **1** | 0 |
| 7 | Fill 3qt jug | 1 | **3** |
| 8 | Pour 3qt → 5qt | **4** ✓ | 0 |

**Result:** 4 quarts in the 5qt jug!

## Key Insight / Kluczowa Obserwacja

**Solution 1:**
1. Create 2qt by filling 5qt and pouring into 3qt (5 - 3 = 2)
2. Save the 2qt in the 3qt jug
3. Fill 5qt again and top off the 3qt jug (takes 1qt)
4. Result: 5 - 1 = 4qt in the 5qt jug

**Solution 2:**
1. Fill 3qt three times
2. Remove 5qt once
3. 3 + 3 + 3 - 5 = 4qt

## Mathematical Background / Podstawy Matematyczne

**Bézout's Identity:** For integers a and b, there exist integers x and y such that:
```
ax + by = gcd(a, b)
```

For our jugs: gcd(3, 5) = 1

This means we can measure any integer amount up to max(3, 5) = 5 quarts.

For 4 quarts: 3(3) + 5(-1) = 9 - 5 = 4
- Fill 3qt jug three times
- Remove 5qt once
- Net result: 4qt

## General Rule / Ogólna Zasada

With jugs of sizes A and B where gcd(A, B) = 1, you can measure any integer amount from 1 to max(A, B).

Z dzbanami rozmiarów A i B gdzie gcd(A, B) = 1, można odmierzyć dowolną całkowitą ilość od 1 do max(A, B).

## Complexity / Złożoność
- **Time:** O(1) - fixed number of steps
- **Space:** O(1)
