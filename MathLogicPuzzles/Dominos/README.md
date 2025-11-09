# 6.3 Dominos / Domino

## Problem
There is an 8×8 chessboard in which two diagonally opposite corners have been cut off. You are given 31 dominos, and a single domino can cover exactly two squares. Can you use the 31 dominos to cover the entire board? Prove your answer.

Jest szachownica 8×8 z wyciętymi dwoma przeciwległymi narożnikami. Masz 31 kości domino, a każda może pokryć dokładnie 2 pola. Czy możesz użyć 31 kości domino aby pokryć całą planszę? Udowodnij odpowiedź.

## Solution / Rozwiązanie

**Answer: NO, it is IMPOSSIBLE.**

## Proof / Dowód

**Setup:**
- Standard chessboard: 32 white squares, 32 black squares
- Diagonally opposite corners are the SAME color
- After removing them: 30 squares of one color, 32 of the other

**Key Observation:**
- Each domino covers 2 adjacent squares
- Adjacent squares on a chessboard are DIFFERENT colors
- Therefore: Each domino covers exactly 1 white + 1 black square

**The Contradiction:**
- 31 dominos would cover: 31 white + 31 black squares
- We have: 30 of one color + 32 of the other
- 31 ≠ 30 and 31 ≠ 32
- **IMPOSSIBLE!** ✗

## Visual Example / Przykład Wizualny

```
  0 1 2 3 4 5 6 7
0 X B W B W B W B
1 B W B W B W B W
2 W B W B W B W B
3 B W B W B W B W
4 W B W B W B W B
5 B W B W B W B W
6 W B W B W B W B
7 B W B W B W B X
```

Removed corners (0,0) and (7,7): both WHITE
Remaining: **30 white**, **32 black**

## Key Insight / Kluczowa Obserwacja

This is an **invariant problem**:
- The color imbalance (difference between white and black squares) is an invariant
- No sequence of domino placements can change this imbalance
- Since imbalance ≠ 0, complete coverage is impossible

To jest problem **niezmiennika**:
- Nierównowaga kolorów jest niezmiennika
- Żadna sekwencja układania domino nie może zmienić tej nierówności
- Skoro nierównowaga ≠ 0, pełne pokrycie jest niemożliwe

## Complexity / Złożoność
- **Time:** O(1) - logical proof, no computation
- **Space:** O(1)
