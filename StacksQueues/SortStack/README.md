# 3.5 Sort Stack

## Problem
Sort a stack (smallest on top) using only one additional temporary stack.

---

## Solution

```javascript
function sortStack(stack) {
  const tempStack = [];

  while (stack.length > 0) {
    const tmp = stack.pop();

    // Move larger elements back to original
    while (tempStack.length > 0 && tempStack[top] > tmp) {
      stack.push(tempStack.pop());
    }

    tempStack.push(tmp);
  }

  // Transfer back
  while (tempStack.length > 0) {
    stack.push(tempStack.pop());
  }
}
```

**Strategy:** Like insertion sort - find correct position for each element.

**Complexity:** O(n²) time, O(n) space
