# 6.4 Ants on a Triangle / Mrówki na Trójkącie

## Problem
There are three ants on different vertices of a triangle. What is the probability of collision (between any two or all of them) if they start walking on the sides of the triangle? Assume that each ant randomly picks a direction, with either direction being equally likely to be chosen, and that they walk at the same speed.

Similarly, find the probability of collision with n ants on an n-vertex polygon.

Trzy mrówki są na różnych wierzchołkach trójkąta. Jakie jest prawdopodobieństwo kolizji jeśli zaczną chodzić po bokach? Każda mrówka losowo wybiera kierunek z równym prawdopodobieństwem i poruszają się z tą samą prędkością.

## Solution / Rozwiązanie

### Triangle (n = 3)

**Key Insight:** Ants DON'T collide only if ALL go the same direction (all clockwise or all counterclockwise).

**Calculation:**
```
P(no collision) = P(all clockwise) + P(all counterclockwise)
                = (1/2)³ + (1/2)³
                = 1/8 + 1/8
                = 1/4

P(collision) = 1 - P(no collision)
             = 1 - 1/4
             = 3/4 = 0.75
```

**Answer: 3/4 or 75%**

### All Possible Scenarios

| Ant 1 | Ant 2 | Ant 3 | Collision? |
|-------|-------|-------|------------|
| CW | CW | CW | ✓ No |
| CW | CW | CCW | ✗ Yes |
| CW | CCW | CW | ✗ Yes |
| CW | CCW | CCW | ✗ Yes |
| CCW | CW | CW | ✗ Yes |
| CCW | CW | CCW | ✗ Yes |
| CCW | CCW | CW | ✗ Yes |
| CCW | CCW | CCW | ✓ No |

6 out of 8 scenarios result in collision.

### General Formula (n-vertex polygon)

For n ants on an n-vertex polygon:

```
P(collision) = 1 - (1/2)^(n-1)
```

**Derivation:**
- Each ant chooses 1 of 2 directions: 2ⁿ total outcomes
- No collision: all go same direction (CW or CCW): 2 outcomes
- P(no collision) = 2/2ⁿ = (1/2)^(n-1)
- P(collision) = 1 - (1/2)^(n-1)

### Examples / Przykłady

| n | P(no collision) | P(collision) |
|---|-----------------|--------------|
| 3 | 1/4 = 0.2500 | 3/4 = 0.7500 |
| 4 | 1/8 = 0.1250 | 7/8 = 0.8750 |
| 5 | 1/16 = 0.0625 | 15/16 = 0.9375 |
| 6 | 1/32 = 0.0313 | 31/32 = 0.9688 |

As n increases, P(collision) → 1.

## Key Insight / Kluczowa Obserwacja

Calculate the **complement event**: It's easier to count scenarios where ants DON'T collide (all go same direction) than to enumerate all collision scenarios.

Oblicz **zdarzenie przeciwne**: Łatwiej policzyć scenariusze gdzie mrówki NIE zderzają się (wszystkie idą w tym samym kierunku) niż wyliczyć wszystkie scenariusze kolizji.

## Complexity / Złożoność
- **Time:** O(1) - simple formula
- **Space:** O(1)
- **Simulation:** O(n × trials)
