# 17.16 The Masseuse

## Original Problem

**The Masseuse:** A popular masseuse receives a sequence of back-to-back appointment requests and is debating which ones to accept. She needs a 15-minute break between appointments and therefore she cannot accept any two adjacent requests. Given a sequence of back-to-back appointments, find the optimal (highest total booked minutes) set the masseuse can honor. Return the number of minutes.

```
Example:
Input: [30, 15, 60, 75, 45, 15, 15, 45]
Output: 180

Explanation:
  Take appointments at indices 0, 2, 3, 7
  30 + 60 + 75 + 45 = 210

Actually: Take 2, 3, 5, 7
  60 + 75 + 15 + 45 = 195

Actually best: Take 0, 2, 4, 7
  30 + 60 + 45 + 45 = 180
```

Hints: #495, #506, #516, #532, #554, #562, #568, #578, #587

---

## Understanding the Problem

This is the classic **"House Robber"** problem - maximize sum without taking adjacent elements.

```
Input: [10, 1, 20, 3]

Options:
  Take index 0, 2: 10 + 20 = 30 ✓ (optimal)
  Take index 1, 3: 1 + 3 = 4
  Take index 0, 3: 10 + 3 = 13
  Take index 2: 20

Maximum: 30
```

### Key Insight

At each appointment, we have two choices:
1. **Take it** - add its value + best before previous
2. **Skip it** - keep best up to previous

```
dp[i] = max(
  appointments[i] + dp[i-2],  // Take current
  dp[i-1]                      // Skip current
)
```

---

## Solution Approaches

### Approach 1: Recursive (Naive)

**Strategy:** Try both options at each position

```javascript
function maxMinutes(appointments) {
  return helper(appointments, 0);
}

function helper(appointments, index) {
  if (index >= appointments.length) return 0;

  // Option 1: Take current, skip next
  const takeCurrent = appointments[index] +
                     helper(appointments, index + 2);

  // Option 2: Skip current
  const skipCurrent = helper(appointments, index + 1);

  return Math.max(takeCurrent, skipCurrent);
}
```

**Time:** O(2^n) - exponential
**Space:** O(n) - recursion stack

---

### Approach 2: Memoization (Top-Down DP)

**Strategy:** Cache results to avoid recomputation

```javascript
function maxMinutes(appointments) {
  const memo = new Map();
  return helper(appointments, 0, memo);
}

function helper(appointments, index, memo) {
  if (index >= appointments.length) return 0;

  if (memo.has(index)) return memo.get(index);

  const takeCurrent = appointments[index] +
                     helper(appointments, index + 2, memo);

  const skipCurrent = helper(appointments, index + 1, memo);

  const result = Math.max(takeCurrent, skipCurrent);
  memo.set(index, result);

  return result;
}
```

**Time:** O(n) - each state computed once
**Space:** O(n) - memo + recursion

---

### Approach 3: Tabulation (Bottom-Up DP)

**Strategy:** Build solution iteratively

```javascript
function maxMinutes(appointments) {
  if (appointments.length === 0) return 0;
  if (appointments.length === 1) return appointments[0];

  const n = appointments.length;
  const dp = new Array(n);

  dp[0] = appointments[0];
  dp[1] = Math.max(appointments[0], appointments[1]);

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(
      appointments[i] + dp[i - 2],  // Take current
      dp[i - 1]                      // Skip current
    );
  }

  return dp[n - 1];
}
```

**Time:** O(n) - single pass
**Space:** O(n) - dp array

---

### Approach 4: Space-Optimized DP (Optimal)

**Strategy:** Only keep last two values

```javascript
function maxMinutes(appointments) {
  if (appointments.length === 0) return 0;
  if (appointments.length === 1) return appointments[0];

  let twoBack = appointments[0];
  let oneBack = Math.max(appointments[0], appointments[1]);

  for (let i = 2; i < appointments.length; i++) {
    const current = Math.max(
      appointments[i] + twoBack,  // Take current
      oneBack                      // Skip current
    );

    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}
```

**Time:** O(n) - single pass
**Space:** O(1) - only two variables

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Step-by-Step Example

```
Appointments: [30, 15, 60, 75, 45, 15, 15, 45]

Initialize:
  twoBack = 30 (index 0)
  oneBack = max(30, 15) = 30 (index 1)

i=2, appt=60:
  current = max(60 + 30, 30) = 90
  twoBack = 30
  oneBack = 90

i=3, appt=75:
  current = max(75 + 30, 90) = 105
  twoBack = 90
  oneBack = 105

i=4, appt=45:
  current = max(45 + 90, 105) = 135
  twoBack = 105
  oneBack = 135

i=5, appt=15:
  current = max(15 + 105, 135) = 135
  twoBack = 135
  oneBack = 135

i=6, appt=15:
  current = max(15 + 135, 135) = 150
  twoBack = 135
  oneBack = 150

i=7, appt=45:
  current = max(45 + 135, 150) = 180
  twoBack = 150
  oneBack = 180

Result: 180
```

### DP Table Visualization

```
Index:   0   1   2   3   4   5   6   7
Appt:   30  15  60  75  45  15  15  45
dp:     30  30  90 105 135 135 150 180

dp[2] = max(60+30, 30) = 90
dp[3] = max(75+30, 90) = 105
dp[4] = max(45+90, 105) = 135
...
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive | O(2^n) | O(n) | Too slow |
| Memoization | O(n) | O(n) | Top-down |
| Tabulation | O(n) | O(n) | Bottom-up |
| Space-Optimized | O(n) | **O(1)** | **Optimal** |

---

## Edge Cases

```javascript
// Empty array
maxMinutes([]) → 0

// Single appointment
maxMinutes([100]) → 100

// Two appointments
maxMinutes([100, 200]) → 200
maxMinutes([200, 100]) → 200

// All same values
maxMinutes([10, 10, 10, 10]) → 20

// Decreasing values
maxMinutes([100, 50, 25, 10]) → 110

// Two large, rest small
maxMinutes([100, 1, 1, 100]) → 200
```

---

## Common Mistakes

### 1. Wrong recurrence relation

```javascript
// ❌ WRONG - adding i-1 instead of i-2
dp[i] = max(appointments[i] + dp[i - 1], dp[i - 1]);

// ✅ CORRECT - must skip adjacent
dp[i] = max(appointments[i] + dp[i - 2], dp[i - 1]);
```

### 2. Wrong base cases

```javascript
// ❌ WRONG
dp[0] = 0;
dp[1] = appointments[1];

// ✅ CORRECT
dp[0] = appointments[0];
dp[1] = max(appointments[0], appointments[1]);
```

### 3. Not handling array length < 2

```javascript
// ❌ WRONG - crashes on empty or single element
const dp = new Array(n);
dp[0] = appointments[0];
dp[1] = max(appointments[0], appointments[1]);

// ✅ CORRECT - check length first
if (n === 0) return 0;
if (n === 1) return appointments[0];
```

---

## Variations

### 1. Return actual appointments taken

```javascript
function maxMinutesWithPath(appointments) {
  if (appointments.length === 0) return { max: 0, indices: [] };
  if (appointments.length === 1) return { max: appointments[0], indices: [0] };

  const n = appointments.length;
  const dp = new Array(n);
  const choice = new Array(n);  // Track if we took this appointment

  dp[0] = appointments[0];
  choice[0] = true;

  dp[1] = Math.max(appointments[0], appointments[1]);
  choice[1] = appointments[1] > appointments[0];

  for (let i = 2; i < n; i++) {
    const take = appointments[i] + dp[i - 2];
    const skip = dp[i - 1];

    if (take > skip) {
      dp[i] = take;
      choice[i] = true;
    } else {
      dp[i] = skip;
      choice[i] = false;
    }
  }

  // Reconstruct path
  const indices = [];
  let i = n - 1;
  while (i >= 0) {
    if (choice[i]) {
      indices.push(i);
      i -= 2;  // Skip next
    } else {
      i -= 1;
    }
  }

  return { max: dp[n - 1], indices: indices.reverse() };
}
```

### 2. Circular array (House Robber II)

```javascript
// Houses in circle - can't take both first and last
function maxMinutesCircular(appointments) {
  if (appointments.length === 1) return appointments[0];

  // Case 1: Don't take first
  const case1 = maxMinutesHelper(appointments.slice(1));

  // Case 2: Don't take last
  const case2 = maxMinutesHelper(appointments.slice(0, -1));

  return Math.max(case1, case2);
}
```

### 3. With k-gap constraint

```javascript
// Must skip at least k appointments between selections
function maxMinutesWithGap(appointments, k) {
  const n = appointments.length;
  const dp = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    dp[i] = appointments[i];

    for (let j = 0; j < i - k; j++) {
      dp[i] = Math.max(dp[i], appointments[i] + dp[j]);
    }

    if (i > 0) {
      dp[i] = Math.max(dp[i], dp[i - 1]);
    }
  }

  return dp[n - 1];
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is the classic non-adjacent selection problem"

2. **State the recurrence:**
   ```
   dp[i] = max(take current, skip current)
         = max(arr[i] + dp[i-2], dp[i-1])
   ```

3. **Draw it out:**
   ```
   [30, 15, 60, 75]
     ↑       ↑   ↑
    Take   Skip Take → 30 + 75 = 105
   ```

4. **Start simple:** "I'll use DP array first, then optimize space"

5. **Explain optimization:** "We only need last 2 values, not entire array"

6. **Mention variations:** House Robber I, II, III

---

## Key Takeaways

1. **Classic DP problem** - maximize non-adjacent selections

2. **Recurrence:** dp[i] = max(arr[i] + dp[i-2], dp[i-1])

3. **Base cases:** dp[0] = arr[0], dp[1] = max(arr[0], arr[1])

4. **Space optimization:** Only need O(1) space with two variables

5. This pattern appears in:
   - House Robber
   - Delete and Earn
   - Maximum Alternating Subsequence Sum

6. Can be extended to circular arrays, tree structures, k-gap constraints

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Medium (foundational DP problem)
