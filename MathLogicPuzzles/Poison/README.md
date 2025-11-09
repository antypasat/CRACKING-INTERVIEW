# 6.10 Poison / Trucizna

## Problem
You have 1000 bottles of soda, and exactly one is poisoned. You have 10 test strips which can be used to detect poison. A single drop of poison will turn the test strip positive permanently. You can put any number of drops on a test strip at once and you can reuse a test strip as many times as you'd like (as long as the results are negative). However, you can only run tests once per day and it takes seven days to return a result. How would you figure out the poisoned bottle in as few days as possible?

FOLLOW UP: Write code to simulate your approach.

## Solution / Rozwiązanie

**Answer: 7 days (one test run using binary encoding)**

## Strategy / Strategia

### Binary Encoding Method

**Key Insight:** Use test strips as binary digits!

1. **Number bottles 0-999**
2. **Convert each bottle number to 10-bit binary**
   - Example: Bottle 537 = 1000011001₂
3. **For each bottle i, put drop on strip j if bit j of i is 1**
4. **Wait 7 days for test results**
5. **Read which strips are positive**
6. **The pattern of positive strips forms the binary number of the poisoned bottle**

### Why 10 Strips Are Enough / Dlaczego 10 Pasków Wystarczy

```
2^10 = 1024 > 1000 bottles
```

With 10 binary digits, we can represent 1024 unique numbers, which is more than enough for 1000 bottles.

## Example / Przykład

**Bottle #537 is poisoned:**

Binary: `1000011001₂`

| Strip | Bit | Gets Drop? | Result |
|-------|-----|------------|--------|
| 0 | 1 | YES | POSITIVE |
| 1 | 0 | NO | negative |
| 2 | 1 | YES | POSITIVE |
| 3 | 0 | NO | negative |
| 4 | 0 | NO | negative |
| 5 | 1 | YES | POSITIVE |
| 6 | 1 | YES | POSITIVE |
| 7 | 0 | NO | negative |
| 8 | 0 | NO | negative |
| 9 | 1 | YES | POSITIVE |

**Reading results:**
- Positive strips: 0, 2, 5, 6, 9
- Binary pattern: `1000011001₂`
- Detected bottle: `537₁₀` ✓

## Small Example: 8 Bottles, 3 Strips

| Bottle | Binary | Strip 0 | Strip 1 | Strip 2 |
|--------|--------|---------|---------|---------|
| 0 | 000 | ○ | ○ | ○ |
| 1 | 001 | ○ | ○ | ● |
| 2 | 010 | ○ | ● | ○ |
| 3 | 011 | ○ | ● | ● |
| 4 | 100 | ● | ○ | ○ |
| 5 | 101 | ● | ○ | ● |
| 6 | 110 | ● | ● | ○ |
| 7 | 111 | ● | ● | ● |

● = drop on strip, ○ = no drop

If bottle 5 is poisoned → strips 0 and 2 positive → binary `101` → bottle 5

## Why This Is Optimal / Dlaczego To Jest Optymalne

1. **Information theory limit:**
   - Need to distinguish 1000 possibilities
   - log₂(1000) ≈ 9.97 bits of information needed
   - 10 strips provide 10 bits → sufficient!

2. **Parallel testing:**
   - We test ALL bottles simultaneously in one batch
   - No need for multiple rounds
   - 7 days for one test = 7 days total

3. **Minimal strips:**
   - 9 strips: 2⁹ = 512 < 1000 → NOT enough
   - 10 strips: 2¹⁰ = 1024 ≥ 1000 → sufficient
   - Therefore, 10 is the minimum

## Extension: Multiple Days / Rozszerzenie: Wiele Dni

If we could run tests over k days with n strips:
```
Maximum distinguishable bottles = (k+1)^n
```

Each strip has k+1 states: negative, or positive on day 1, 2, ..., k

**Examples:**
- 1 day, 10 strips: 2¹⁰ = 1024 bottles
- 2 days, 7 strips: 3⁷ = 2187 bottles
- 3 days, 5 strips: 4⁵ = 1024 bottles

For 1000 bottles:
- **10 strips, 1 day** ← optimal for this problem
- 7 strips, 2 days (3⁷ = 2187)
- 5 strips, 3 days (4⁵ = 1024)

## Implementation Details / Szczegóły Implementacji

```javascript
function findPoisonedBottle(poisonedBottle) {
  // 1. Create testing plan
  for (bottle = 0; bottle < 1000; bottle++) {
    binary = toBinary(bottle, 10);
    for (strip = 0; strip < 10; strip++) {
      if (binary[strip] == '1') {
        addDropToStrip(bottle, strip);
      }
    }
  }

  // 2. Run test (wait 7 days)

  // 3. Read positive strips
  positiveStrips = getPositiveStrips();

  // 4. Convert binary pattern to bottle number
  result = binaryToDecimal(positiveStrips);

  return result;
}
```

## Key Takeaway / Kluczowy Wniosek

**Binary encoding allows us to map each bottle to a unique pattern of test strips, enabling us to identify the poisoned bottle in just one test run (7 days).**

**Kodowanie binarne pozwala nam zmapować każdą butelkę na unikalny wzór pasków testowych, umożliwiając identyfikację zatrutej butelki w tylko jednym teście (7 dni).**

## Complexity / Złożoność
- **Time:** O(1) - always 7 days regardless of which bottle
- **Space:** O(n) - need to track which bottles go on which strips
- **Setup:** O(n × log n) - assign drops for n bottles using log n strips
