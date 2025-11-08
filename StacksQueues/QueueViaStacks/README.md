# 3.4 Queue via Stacks

## Problem
Implement a queue using two stacks.

---

## Solution

```javascript
class MyQueue {
  constructor() {
    this.stackNewest = []; // Enqueue here
    this.stackOldest = [];  // Dequeue from here
  }

  enqueue(value) {
    this.stackNewest.push(value);
  }

  dequeue() {
    this.shiftStacks(); // Move if oldest is empty
    return this.stackOldest.pop();
  }

  shiftStacks() {
    if (this.stackOldest.length === 0) {
      while (this.stackNewest.length > 0) {
        this.stackOldest.push(this.stackNewest.pop());
      }
    }
  }
}
```

**Key:** Reversing a stack converts LIFO to FIFO!

**Complexity:** Enqueue O(1), Dequeue O(1) amortized
