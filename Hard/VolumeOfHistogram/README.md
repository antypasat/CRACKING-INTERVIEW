# 17.21 Volume of Histogram

## Original Problem

**Volume of Histogram:** Imagine a histogram (bar graph). Design an algorithm to compute the volume of water it could hold if someone poured water across the top. You can assume that each histogram bar has width 1.

```
Example:
Input: [0, 0, 4, 0, 0, 6, 0, 0, 3, 0, 5, 0, 1, 0, 0, 0]

Visualization:
        6
    4   █   5
    █   █   █
    █   █   █
    █   █   █ 3
    █   █   █ █ 1
0 0 █ 0 0 █ 0 0 █ 0 █ 0 █ 0 0 0

Water trapped:
    4   █~~~█ 5
    █~~~█~~~█
    █~~~█~~~█
    █~~~█~~~█ 3
    █~~~█~~~█ █ 1
0 0 █ 0 0 █ 0 0 █ 0 █ 0 █ 0 0 0

Volume: 26 units
```

Hints: #629, #640, #651, #658, #662, #676, #693, #734, #742

---

## Understanding the Problem

This is the classic **"Trapping Rain Water"** problem. Water fills up to the minimum of:
- Maximum height to the left
- Maximum height to the right

```
Height: [3, 0, 2, 0, 4]

At index 1 (height 0):
  Max left = 3
  Max right = 4
  Water level = min(3, 4) = 3
  Water trapped = 3 - 0 = 3

At index 3 (height 0):
  Max left = 3
  Max right = 4
  Water level = min(3, 4) = 3
  Water trapped = 3 - 0 = 3

Total = 3 + 3 = 6
```

### Key Insight

Water at position i = `min(maxLeft[i], maxRight[i]) - height[i]`

---

## Solution Approaches

### Approach 1: Brute Force

**Strategy:** For each position, find max left and max right

```javascript
function trap(heights) {
  let total = 0;

  for (let i = 0; i < heights.length; i++) {
    // Find max to the left
    let maxLeft = 0;
    for (let j = 0; j <= i; j++) {
      maxLeft = Math.max(maxLeft, heights[j]);
    }

    // Find max to the right
    let maxRight = 0;
    for (let j = i; j < heights.length; j++) {
      maxRight = Math.max(maxRight, heights[j]);
    }

    // Water trapped at this position
    const waterLevel = Math.min(maxLeft, maxRight);
    total += waterLevel - heights[i];
  }

  return total;
}
```

**Time:** O(n²) - for each position, scan left and right
**Space:** O(1)

---

### Approach 2: Dynamic Programming

**Strategy:** Precompute max left and max right for each position

```javascript
function trap(heights) {
  if (heights.length === 0) return 0;

  const n = heights.length;
  const maxLeft = new Array(n);
  const maxRight = new Array(n);

  // Compute max heights to the left
  maxLeft[0] = heights[0];
  for (let i = 1; i < n; i++) {
    maxLeft[i] = Math.max(maxLeft[i - 1], heights[i]);
  }

  // Compute max heights to the right
  maxRight[n - 1] = heights[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    maxRight[i] = Math.max(maxRight[i + 1], heights[i]);
  }

  // Calculate trapped water
  let total = 0;
  for (let i = 0; i < n; i++) {
    const waterLevel = Math.min(maxLeft[i], maxRight[i]);
    total += waterLevel - heights[i];
  }

  return total;
}
```

**Time:** O(n) - three passes
**Space:** O(n) - two arrays

---

### Approach 3: Two Pointers (Optimal)

**Strategy:** Use two pointers from both ends

```javascript
function trap(heights) {
  if (heights.length === 0) return 0;

  let left = 0;
  let right = heights.length - 1;
  let maxLeft = 0;
  let maxRight = 0;
  let total = 0;

  while (left < right) {
    if (heights[left] < heights[right]) {
      // Process left side
      if (heights[left] >= maxLeft) {
        maxLeft = heights[left];
      } else {
        total += maxLeft - heights[left];
      }
      left++;
    } else {
      // Process right side
      if (heights[right] >= maxRight) {
        maxRight = heights[right];
      } else {
        total += maxRight - heights[right];
      }
      right--;
    }
  }

  return total;
}
```

**Time:** O(n) - single pass
**Space:** O(1) - only pointers

✅ **OPTIMAL SOLUTION**

---

### Approach 4: Stack-Based

**Strategy:** Use stack to track potential water boundaries

```javascript
function trap(heights) {
  const stack = [];
  let total = 0;

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const top = stack.pop();

      if (stack.length === 0) break;

      const distance = i - stack[stack.length - 1] - 1;
      const boundedHeight = Math.min(
        heights[i],
        heights[stack[stack.length - 1]]
      ) - heights[top];

      total += distance * boundedHeight;
    }

    stack.push(i);
  }

  return total;
}
```

**Time:** O(n) - each element pushed/popped once
**Space:** O(n) - stack

---

## Algorithm Explanation

### Two Pointers Walkthrough

```
Heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

Initial:
  left=0, right=11
  maxLeft=0, maxRight=0
  total=0

Step 1: heights[0]=0 < heights[11]=1
  maxLeft = 0
  left++
  left=1

Step 2: heights[1]=1 < heights[11]=1
  maxLeft = 1
  left++
  left=2

Step 3: heights[2]=0 < heights[11]=1
  heights[2] < maxLeft
  total += 1 - 0 = 1
  left++
  left=3

Step 4: heights[3]=2 > heights[11]=1
  maxRight = 1
  right--
  right=10

Step 5: heights[3]=2 > heights[10]=2
  maxRight = 2
  right--
  right=9

...and so on

Final total: 6
```

### Visual Step-by-Step

```
[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

    3
  2 █ 2
1 █ █ █ █
█ █ █ █ █

Water fills:
    3
  2 █~2
1~█~█~█~█
█ █ █ █ █

At position 2 (height 0):
  maxLeft = 1, maxRight = 3
  water = min(1, 3) - 0 = 1

At position 4 (height 1):
  maxLeft = 2, maxRight = 3
  water = min(2, 3) - 1 = 1

At position 5 (height 0):
  maxLeft = 2, maxRight = 3
  water = min(2, 3) - 0 = 2

Total: 1 + 1 + 2 + 2 = 6
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n²) | O(1) | Too slow |
| Dynamic Programming | O(n) | O(n) | Clear logic |
| Two Pointers | O(n) | **O(1)** | **Optimal** ✅ |
| Stack | O(n) | O(n) | Interesting approach |

---

## Edge Cases

```javascript
// Empty array
trap([]) → 0

// Single element
trap([5]) → 0

// Two elements
trap([3, 5]) → 0

// No water trapped
trap([5, 4, 3, 2, 1]) → 0  // Descending
trap([1, 2, 3, 4, 5]) → 0  // Ascending

// Valley in middle
trap([3, 0, 2]) → 2

// Multiple valleys
trap([3, 0, 2, 0, 4]) → 7

// All zeros
trap([0, 0, 0]) → 0

// Flat top
trap([2, 2, 2]) → 0
```

---

## Common Mistakes

### 1. Wrong water level calculation

```javascript
// ❌ WRONG - using max instead of min
const waterLevel = Math.max(maxLeft, maxRight);

// ✅ CORRECT - water fills to minimum
const waterLevel = Math.min(maxLeft, maxRight);
```

### 2. Not handling negative values

```javascript
// ❌ WRONG - can be negative
total += waterLevel - heights[i];

// ✅ CORRECT - use max to avoid negative
total += Math.max(0, waterLevel - heights[i]);
```

### 3. Wrong two-pointer logic

```javascript
// ❌ WRONG - always processing left
if (heights[left] < heights[right]) {
  total += maxLeft - heights[left];  // Forgot to update maxLeft
}

// ✅ CORRECT - update max before calculating
if (heights[left] >= maxLeft) {
  maxLeft = heights[left];
} else {
  total += maxLeft - heights[left];
}
```

---

## Why Two Pointers Work

```
Key insight:
  Water at position i = min(maxLeft[i], maxRight[i]) - height[i]

When heights[left] < heights[right]:
  - We know maxRight >= heights[right]
  - So maxRight >= heights[left]
  - Therefore min(maxLeft, maxRight) = maxLeft
  - We can safely calculate water at left position

Same logic applies when processing from right
```

---

## Interview Tips

1. **Draw it out:**
   ```
   Heights: [3, 0, 2, 0, 4]

       4
   3   █
   █   █
   █ 2 █
   █ █ █
   ```

2. **Explain water level:** "Water fills to min of max heights on both sides"

3. **Start with DP:** "I can precompute max left and right"

4. **Optimize to two pointers:**
   - "I don't need arrays"
   - "Can track max as I go from both ends"

5. **Walk through example:** Show pointer movements and water calculation

6. **Mention variations:**
   - 2D version (container with most water)
   - Finding the actual water positions

---

## Key Takeaways

1. **Water level** = min(maxLeft, maxRight) at each position

2. **Two pointers** optimize from O(n) space to O(1)

3. Process from **both ends** simultaneously

4. Update max heights as we scan

5. This pattern appears in:
   - Container with most water
   - Rain water trapping II (3D)
   - Largest rectangle in histogram

6. Alternative: **Stack-based** approach is also O(n) time

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Hard
