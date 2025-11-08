# 3.2 Stack Min

## Original Problem

**Stack Min:** How would you design a stack which, in addition to push and pop, has a function `min` which returns the minimum element? Push, pop and min should all operate in O(1) time.

Hints: #27, #59, #78

---

## Key Insight / Kluczowa Obserwacja

**The trick:** Track minimum at each level of the stack!
**Sztuczka:** Śledź minimum na każdym poziomie stosu!

---

## Solutions

### Approach 1: Store Min with Each Node ⭐

```javascript
class StackWithMin {
  push(value) {
    const newMin = Math.min(value, this.min());
    this.stack.push({ value, min: newMin });
  }

  min() {
    return this.stack[this.stack.length - 1].min;
  }
}
```

### Approach 2: Separate Min Stack

```javascript
class StackWithMin2 {
  push(value) {
    this.stack.push(value);
    if (value <= this.min()) {
      this.minStack.push(value);
    }
  }

  pop() {
    const value = this.stack.pop();
    if (value === this.min()) {
      this.minStack.pop();
    }
    return value;
  }
}
```

---

## Complexity

Both approaches:
- **Push:** O(1) ⭐
- **Pop:** O(1) ⭐
- **Min:** O(1) ⭐
- **Space:** O(n)

**Difference:** Approach 2 can save space if many values > current min

---

**Difficulty:** Easy / Łatwy
