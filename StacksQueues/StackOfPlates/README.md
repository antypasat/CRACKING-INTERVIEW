# 3.3 Stack of Plates

## Problem
Implement `SetOfStacks` that creates new stack when previous exceeds capacity.
`push()` and `pop()` should behave like a single stack.

**FOLLOW UP:** Implement `popAt(index)` to pop from specific sub-stack.

---

## Solution

```javascript
class SetOfStacks {
  constructor(capacity) {
    this.capacity = capacity;
    this.stacks = [];
  }

  push(value) {
    if (!lastStack || lastStack.length >= capacity) {
      this.stacks.push([value]);
    } else {
      lastStack.push(value);
    }
  }

  popAt(index) {
    // Remove from stack[index] and shift from subsequent stacks
    return this.leftShift(index, true);
  }
}
```

**Key:** `popAt()` requires rolling elements from next stacks to fill gaps.

**Complexity:** push/pop O(1), popAt O(n)
