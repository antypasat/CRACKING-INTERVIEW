# 17.2 Shuffle

## Original Problem

**Shuffle:** Write a method to shuffle a deck of cards. It must be a perfect shuffle - in other words, each of the 52! permutations of the deck has to be equally likely. Assume that you are given a random number generator which is perfect.

Hints: #483, #579, #634

---

## Understanding the Problem

A **perfect shuffle** means every possible permutation has an **equal probability** of occurring. For a deck of 52 cards, there are **52!** (factorial) possible arrangements.

```
52! = 52 × 51 × 50 × ... × 2 × 1
    ≈ 8.0658 × 10^67 permutations
```

### What Makes a Shuffle "Perfect"?

❌ **WRONG APPROACHES:**
```javascript
// ❌ Sort by random - NOT uniform!
cards.sort(() => Math.random() - 0.5);

// ❌ Swap with random position - biased!
for (let i = 0; i < n; i++) {
  const j = Math.floor(Math.random() * n);
  swap(cards, i, j);
}
```

These approaches seem intuitive but produce **biased** results where some permutations are more likely than others.

✅ **CORRECT APPROACH:** **Fisher-Yates (Knuth) Shuffle**

---

## Solution: Fisher-Yates Shuffle

### Algorithm

```
For position i from 0 to n-1:
  1. Pick a random index j from i to n-1 (inclusive)
  2. Swap element at position i with element at position j
```

### Why This Works

**Key Insight:** Build the shuffle one element at a time:
- Position 0: Choose from all n elements (probability: 1/n)
- Position 1: Choose from remaining n-1 elements (probability: 1/(n-1))
- Position 2: Choose from remaining n-2 elements (probability: 1/(n-2))
- ...
- Position n-1: Only 1 element left (probability: 1/1)

**Total permutations:** n × (n-1) × (n-2) × ... × 1 = n!

Each permutation has probability: (1/n) × (1/(n-1)) × ... × (1/1) = **1/n!**

This is **exactly** what we need for a perfect shuffle!

### Visualization

```
Example with 5 cards: [A, B, C, D, E]

Step 0: i=0, pick random from [0-4]
  Say we pick j=3 (D)
  [D, B, C, A, E]
       ↑     ↑
     swapped

Step 1: i=1, pick random from [1-4]
  Say we pick j=4 (E)
  [D, E, C, A, B]
       ↑        ↑
     swapped

Step 2: i=2, pick random from [2-4]
  Say we pick j=2 (C)
  [D, E, C, A, B]
       No swap (same position)

Step 3: i=3, pick random from [3-4]
  Say we pick j=4 (B)
  [D, E, C, B, A]
             ↑  ↑
          swapped

Step 4: i=4, only one left
  [D, E, C, B, A] ← Final result
```

---

## Implementation

### Standard Implementation

```javascript
function shuffle(cards) {
  const deck = [...cards]; // Create copy to avoid mutating original
  const n = deck.length;

  for (let i = 0; i < n; i++) {
    // Pick random index from i to n-1
    const j = i + Math.floor(Math.random() * (n - i));

    // Swap elements at i and j
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
```

### Alternative: Backward Iteration

```javascript
function shuffleBackward(cards) {
  const deck = [...cards];

  // Iterate backward from last to first
  for (let i = deck.length - 1; i > 0; i--) {
    // Pick random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
```

Both are equivalent and produce perfect shuffles!

---

## Proof of Correctness

### Mathematical Proof

**Claim:** Every permutation has probability 1/n!

**Proof by induction:**

**Base case (n=1):**
- Only 1 permutation
- Probability = 1 = 1/1! ✓

**Inductive step:** Assume true for n-1, prove for n.

For any specific permutation:
- Element at position 0 must be chosen first: probability = 1/n
- Remaining n-1 elements must form specific permutation of positions 1 to n-1
- By inductive hypothesis: probability = 1/(n-1)!

**Total probability:** (1/n) × (1/(n-1)!) = 1/n! ✓

### Empirical Verification

We can verify by running the shuffle many times and checking if all permutations appear with roughly equal frequency.

```javascript
// For small array [1,2,3], there are 3! = 6 permutations
// Each should appear ~1/6 of the time
```

---

## Common Mistakes

### Mistake 1: Picking from Entire Array

```javascript
// ❌ WRONG - biased shuffle
function badShuffle(cards) {
  for (let i = 0; i < cards.length; i++) {
    const j = Math.floor(Math.random() * cards.length); // BUG!
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
```

**Why wrong?** This creates n^n possible outcomes, not n! permutations. Since n^n is not divisible by n!, some permutations must be more likely.

**Example with n=3:**
- Total outcomes: 3^3 = 27
- Total permutations: 3! = 6
- 27/6 = 4.5 (not evenly divisible!)
- Some permutations will appear 4 times, others 5 times → **BIASED**

### Mistake 2: Sort with Random Comparator

```javascript
// ❌ WRONG - very biased
cards.sort(() => Math.random() - 0.5);
```

**Why wrong?**
- Sort algorithms make different comparison patterns
- Not all permutations are reachable
- Completely unpredictable and biased
- **Never use this for shuffling!**

### Mistake 3: Using Visited Set

```javascript
// ❌ INEFFICIENT - O(n) per pick, O(n²) total
function badShuffle(cards) {
  const result = [];
  const used = new Set();

  while (result.length < cards.length) {
    const i = Math.floor(Math.random() * cards.length);
    if (!used.has(i)) {
      result.push(cards[i]);
      used.add(i);
    }
  }
  return result;
}
```

**Why wrong?**
- While technically correct (uniform distribution)
- O(n²) expected time due to collision checking
- Fisher-Yates is O(n) - much more efficient

---

## Complexity Analysis

**Time Complexity:** O(n)
- Single pass through array
- Each swap is O(1)

**Space Complexity:** O(1)
- Only a few variables (if modifying in-place)
- O(n) if creating a copy

**Random calls:** Exactly n random numbers needed

---

## Edge Cases

```javascript
shuffle([])              → []
shuffle([1])             → [1]
shuffle([1, 2])          → [1, 2] or [2, 1] (50% each)
shuffle([1, 2, 3])       → 6 permutations, each ~16.67%
shuffle(52-card deck)    → 52! permutations, perfectly uniform
```

---

## Applications Beyond Card Shuffling

1. **Randomized Algorithms**
   - QuickSort with random pivot
   - Monte Carlo simulations

2. **Sampling**
   - Select k random elements from n

3. **Games**
   - Shuffle tiles, dominoes
   - Random level generation

4. **Testing**
   - Randomize test case order
   - Generate random test data

5. **Security**
   - Generate random tokens
   - Shuffle encryption keys

---

## Extension: Partial Shuffle

Sometimes we only need k random elements from n:

```javascript
function sampleK(array, k) {
  const arr = [...array];
  k = Math.min(k, arr.length);

  // Only shuffle first k positions
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Return first k elements
  return arr.slice(0, k);
}
```

**Time:** O(k) instead of O(n) - more efficient!

---

## Interview Tips

1. **Start with the goal:** "Each permutation must have probability 1/n!"

2. **Explain why naive approaches fail:** Show understanding of probability

3. **Draw an example:** Visualize the algorithm with a small array

4. **Discuss in-place vs copy:** Ask interviewer's preference

5. **Mention common mistakes:** Shows you know the pitfalls

6. **Prove correctness:** Brief mathematical reasoning if time allows

7. **Mention optimization:** Partial shuffle for k elements

---

## Key Takeaways

1. **Fisher-Yates** is the correct algorithm for perfect shuffling
2. Each position picks from **remaining** elements only
3. Produces **uniform distribution** over all n! permutations
4. **O(n) time**, O(1) space (in-place)
5. **Avoid** `sort()` with random comparator - it's biased
6. Can be optimized for **partial shuffles** (k out of n)
7. Forward or backward iteration - both work equally well

---

**Time Complexity:** O(n)
**Space Complexity:** O(1) in-place, O(n) with copy
**Difficulty:** Medium-Hard
