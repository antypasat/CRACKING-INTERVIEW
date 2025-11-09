# 17.8 Circus Tower

## Original Problem

**Circus Tower:** A circus is designing a tower routine consisting of people standing atop one another's shoulders. For practical and aesthetic reasons, each person must be both shorter and lighter than the person below them. Given the heights and weights of each person in the circus, write a method to compute the largest possible number of people in such a tower.

```
Example:
Input: (ht, wt)
  (65, 100), (70, 150), (56, 90), (75, 190), (60, 95), (68, 110)

Output: 6 (all people can form a tower if ordered correctly)

Possible order (bottom to top):
  (75, 190), (70, 150), (68, 110), (65, 100), (60, 95), (56, 90)
```

Hints: #638, #657, #666, #682, #699

---

## Understanding the Problem

We need to find the **longest sequence** of people where:
- Each person is **both** shorter AND lighter than the previous
- This is a **2D Longest Increasing Subsequence** problem

```
Example:
People: (h, w)
  A: (56, 90)
  B: (60, 95)
  C: (65, 100)
  D: (68, 110)
  E: (70, 150)
  F: (75, 190)

Valid tower (bottom to top): F → E → D → C → B → A
  75>70>68>65>60>56 (heights decreasing ✓)
  190>150>110>100>95>90 (weights decreasing ✓)

Length: 6
```

### Key Insight

1. **Sort** people by one dimension (height)
2. Find **Longest Increasing Subsequence (LIS)** in the other dimension (weight)
3. Must satisfy **both** constraints

---

## Solution Approaches

### Approach 1: Recursion with Backtracking

**Strategy:** Try all possible sequences, check if valid

```javascript
function maxTowerHeight(people) {
  return helper(people, 0, null);
}

function helper(people, index, previous) {
  if (index >= people.length) return 0;

  // Option 1: Take current person (if valid)
  let includeCurrent = 0;
  if (canGoAbove(people[index], previous)) {
    includeCurrent = 1 + helper(people, index + 1, people[index]);
  }

  // Option 2: Skip current person
  const skipCurrent = helper(people, index + 1, previous);

  return Math.max(includeCurrent, skipCurrent);
}

function canGoAbove(top, bottom) {
  if (!bottom) return true;
  return top.height < bottom.height && top.weight < bottom.weight;
}
```

**Time:** O(2^n) - exponential
**Space:** O(n) - recursion stack

---

### Approach 2: Sort + Dynamic Programming

**Strategy:** Sort by height, then find LIS in weights

```javascript
function maxTowerHeight(people) {
  // Sort by height (ascending), then by weight (ascending) if heights equal
  people.sort((a, b) => {
    if (a.height !== b.height) return a.height - b.height;
    return a.weight - b.weight;
  });

  const n = people.length;
  const dp = new Array(n).fill(1);  // dp[i] = max tower ending at i
  let maxLength = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Can person i go above person j?
      if (people[i].height > people[j].height &&
          people[i].weight > people[j].weight) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}
```

**Time:** O(n²) - nested loops for DP
**Space:** O(n) - dp array

✅ **RECOMMENDED SOLUTION**

---

### Approach 3: Sort + DP with Path Reconstruction

**Strategy:** Not just length, but actual sequence of people

```javascript
function longestTower(people) {
  // Sort by height ascending
  people.sort((a, b) => {
    if (a.height !== b.height) return a.height - b.height;
    return a.weight - b.weight;
  });

  const n = people.length;
  const dp = new Array(n).fill(1);
  const parent = new Array(n).fill(-1);
  let maxLength = 1;
  let maxIndex = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (people[i].height > people[j].height &&
          people[i].weight > people[j].weight) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;  // Track previous person
        }
      }
    }

    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  // Reconstruct the sequence
  const tower = [];
  let current = maxIndex;

  while (current !== -1) {
    tower.push(people[current]);
    current = parent[current];
  }

  return tower.reverse();  // Bottom to top
}
```

**Time:** O(n²)
**Space:** O(n)

---

## Algorithm Explanation

### Why Sorting Works

```
Unsorted:
  (65, 100), (70, 150), (56, 90), (75, 190), (60, 95), (68, 110)

After sorting by height:
  (56, 90), (60, 95), (65, 100), (68, 110), (70, 150), (75, 190)

Now we only need to check weight constraints!

If we pick people in order (increasing height), we just need:
  weight[i] > weight[j] for all j < i in our selection

This is LIS on weights!
```

### Step-by-Step Example

```
Sorted people: (h, w)
  0: (56, 90)
  1: (60, 95)
  2: (65, 100)
  3: (68, 110)
  4: (70, 150)
  5: (75, 190)

Initialize: dp = [1, 1, 1, 1, 1, 1]

i=1, person=(60,95):
  j=0: (60,95) vs (56,90)
    60>56 ✓, 95>90 ✓
    dp[1] = max(1, dp[0]+1) = 2

  dp = [1, 2, 1, 1, 1, 1]

i=2, person=(65,100):
  j=0: (65,100) vs (56,90)
    65>56 ✓, 100>90 ✓
    dp[2] = max(1, dp[0]+1) = 2

  j=1: (65,100) vs (60,95)
    65>60 ✓, 100>95 ✓
    dp[2] = max(2, dp[1]+1) = 3

  dp = [1, 2, 3, 1, 1, 1]

i=3, person=(68,110):
  Best: dp[3] = 4 (from person 2)

i=4, person=(70,150):
  Best: dp[4] = 5 (from person 3)

i=5, person=(75,190):
  Best: dp[5] = 6 (from person 4)

Final: dp = [1, 2, 3, 4, 5, 6]
Max length: 6
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Backtracking | O(2^n) | O(n) | Too slow |
| Sort + DP | O(n²) | O(n) | **Optimal** |
| Sort + DP + Reconstruction | O(n²) | O(n) | Returns sequence |

Note: There's an O(n log n) solution using binary search + patience sorting, but O(n²) is usually acceptable.

---

## Edge Cases

```javascript
// Empty array
people = []
→ 0

// Single person
people = [(65, 100)]
→ 1

// All people incompatible (decreasing height, increasing weight)
people = [(70, 100), (65, 110), (60, 120)]
→ 1 (can only pick one)

// Perfect sequence
people = [(56, 90), (60, 95), (65, 100)]
→ 3

// Same height different weight (only one can be chosen)
people = [(65, 100), (65, 110)]
→ 1

// Same weight different height (only one can be chosen)
people = [(65, 100), (70, 100)]
→ 1
```

---

## Common Mistakes

### 1. Forgetting to sort

```javascript
// ❌ WRONG - DP without sorting gives wrong answer
const dp = new Array(n).fill(1);
for (let i = 0; i < n; i++) {
  // This doesn't work!
}

// ✅ CORRECT - sort first
people.sort((a, b) => a.height - b.height);
```

### 2. Wrong comparison

```javascript
// ❌ WRONG - using >= instead of >
if (people[i].height >= people[j].height)

// ✅ CORRECT - strictly greater
if (people[i].height > people[j].height &&
    people[i].weight > people[j].weight)
```

### 3. Not handling equal heights properly

```javascript
// ❌ WRONG - unstable sort can cause issues
people.sort((a, b) => a.height - b.height);

// ✅ BETTER - stable sort with secondary key
people.sort((a, b) => {
  if (a.height !== b.height) return a.height - b.height;
  return a.weight - b.weight;
});
```

---

## Variations

### 1. Return the actual tower

```javascript
// Already shown in Approach 3
// Use parent array to reconstruct path
```

### 2. K-dimensional constraints

```javascript
// Can be extended to k dimensions
// Sort by first k-1 dimensions
// Find LIS in k-th dimension
```

### 3. Maximize total weight (not count)

```javascript
// Change dp to track weight sum instead of count
const dp = new Array(n).fill(0);
for (let i = 0; i < n; i++) {
  dp[i] = people[i].weight;  // Start with own weight

  for (let j = 0; j < i; j++) {
    if (canGoAbove(people[i], people[j])) {
      dp[i] = Math.max(dp[i], dp[j] + people[i].weight);
    }
  }
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is a 2D LIS problem"

2. **Explain the sort:** "Sorting by one dimension reduces it to 1D LIS"

3. **Draw it out:**
   ```
   Height →
   Weight ↓

   Points that form increasing sequence
   ```

4. **Discuss optimization:** "We could use binary search for O(n log n)"

5. **Ask clarifications:**
   - Can two people have same height?
   - Same weight?
   - Strictly greater or equal?

6. **Test with examples:** Small cases help verify logic

---

## Key Takeaways

1. **2D constraints** can often be reduced to 1D by sorting

2. **Sort by one dimension**, then apply LIS to other

3. Classic **DP pattern**: `dp[i]` = best solution ending at i

4. **Path reconstruction** requires parent/previous tracking

5. This pattern appears in: scheduling, box stacking, envelope nesting

6. Time complexity: O(n²) is acceptable, O(n log n) is optimal

---

**Time Complexity:** O(n² + n log n) = O(n²)
**Space Complexity:** O(n)
**Difficulty:** Hard
