# 6.1 The Heavy Pill / Ciężka Pigułka

## Problem
You have 20 bottles of pills. 19 bottles have 1.0 gram pills, but one has pills of weight 1.1 grams. Given a scale that provides an exact measurement, how would you find the heavy bottle? You can only use the scale once.

Masz 20 butelek z pigułkami. 19 butelek ma pigułki o wadze 1.0 grama, ale jedna ma pigułki o wadze 1.1 grama. Mając wagę dającą dokładny pomiar, jak znaleźć ciężką butelkę? Możesz użyć wagi tylko raz.

## Solution / Rozwiązanie

**Algorithm:**
1. Number the bottles 1 through 20
2. Take i pills from bottle i (1 pill from bottle 1, 2 pills from bottle 2, etc.)
3. Weigh all pills together
4. The excess weight in 0.1g units tells you which bottle is heavy

**Algorytm:**
1. Ponumeruj butelki od 1 do 20
2. Weź i pigułek z butelki i (1 pigułkę z butelki 1, 2 pigułki z butelki 2, itd.)
3. Zważ wszystkie pigułki razem
4. Nadwaga w jednostkach 0.1g wskazuje która butelka jest ciężka

**Why it works:**
- Total pills: 1+2+...+20 = 210 pills
- If all pills were 1.0g: total weight = 210.0g
- If bottle #n has heavy pills: total weight = 210.0g + n×0.1g
- Therefore: (actual weight - 210.0g) / 0.1g = n

**Example:**
If bottle #7 has heavy pills:
- Weight = 210.0g + 7×0.1g = 210.7g
- Excess = 210.7g - 210.0g = 0.7g
- Bottle number = 0.7g / 0.1g = 7

## Key Insight / Kluczowa Obserwacja

We encode information in the **quantity** of pills we take from each bottle, allowing us to identify the heavy bottle with a single measurement.

Kodujemy informację w **ilości** pigułek które bierzemy z każdej butelki, co pozwala zidentyfikować ciężką butelkę jednym pomiarem.

## Complexity / Złożoność
- **Time:** O(1) - single weighing
- **Space:** O(1)
