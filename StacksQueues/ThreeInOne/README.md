# 3.1 Three in One

## Original Problem / Oryginalne Zadanie

**Three in One:** Describe how you could use a single array to implement three stacks.

Hints: #2, #72, #38, #58

---

## Understanding the Problem / Zrozumienie Problemu

Implement **three separate stacks** using a **single array**.
Zaimplementuj **trzy osobne stosy** używając **jednej tablicy**.

Each stack should support:
Każdy stos powinien obsługiwać:
- `push(stackNum, value)` - add element / dodaj element
- `pop(stackNum)` - remove and return top / usuń i zwróć szczyt
- `peek(stackNum)` - view top / zobacz szczyt
- `isEmpty(stackNum)` - check if empty / sprawdź czy pusty

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Fixed Division (Simple) ⭐

**Strategy:** Divide array into 3 equal parts
**Strategia:** Podziel tablicę na 3 równe części

```
Array of size 9:
[0][1][2] | [3][4][5] | [6][7][8]
 Stack 0  |  Stack 1  |  Stack 2
```

```javascript
class FixedMultiStack {
  constructor(stackSize) {
    this.stackSize = stackSize;
    this.values = new Array(stackSize * 3);
    this.sizes = [0, 0, 0];
  }

  push(stackNum, value) {
    if (this.isFull(stackNum)) throw new Error('Stack full');
    this.sizes[stackNum]++;
    this.values[this.indexOfTop(stackNum)] = value;
  }

  indexOfTop(stackNum) {
    const offset = stackNum * this.stackSize;
    return offset + this.sizes[stackNum] - 1;
  }
}
```

**Pros:** Simple, O(1) operations
**Cons:** Fixed size, may waste space

---

### Approach 2: Flexible Division (Optimal)

**Strategy:** Allow stacks to grow dynamically
**Strategia:** Pozwól stosom rosnąć dynamicznie

Each stack can expand into available space. When a stack needs more room, shift other stacks.

```javascript
class FlexibleMultiStack {
  constructor(totalSize) {
    this.values = new Array(totalSize);
    this.info = []; // Track start, size, capacity for each

    // Initialize with equal division
    for (let i = 0; i < 3; i++) {
      this.info[i] = {
        start: i * Math.floor(totalSize / 3),
        size: 0,
        capacity: Math.floor(totalSize / 3)
      };
    }
  }
}
```

**Pros:** Flexible, better space usage
**Cons:** Complex, shifting can be O(n)

---

## Comparison / Porównanie

| Feature | Fixed | Flexible |
|---|---|---|
| **Simplicity** | ⭐⭐⭐ Simple | ⭐ Complex |
| **Space Efficiency** | ⭐ Can waste | ⭐⭐⭐ Optimal |
| **Push Time** | O(1) | O(n) worst, O(1) amortized |
| **Pop Time** | O(1) | O(1) |
| **Best For** | Equal usage | Uneven usage |

---

## Key Insights / Kluczowe Spostrzeżenia

### Fixed Division Strategy

1. **Calculate offset:** `offset = stackNum × stackSize`
2. **Track size:** Each stack has independent size counter
3. **Index formula:** `index = offset + size - 1`

### Flexible Division Strategy

1. **Dynamic capacity:** Stacks can grow beyond initial allocation
2. **Shifting:** When one stack needs space, shift others
3. **Circular buffer:** Can wrap around array boundaries

---

## Edge Cases / Przypadki Brzegowe

1. **Stack overflow:** One stack full
2. **All stacks full:** No more space
3. **Empty stack pop:** Throw error
4. **Uneven distribution:** One stack large, others small

---

## Interview Tips / Wskazówki do Rozmowy

1. **Start simple:** "I'll first explain the fixed division approach"
2. **Discuss tradeoffs:** "Fixed is simple but wastes space if stacks grow unevenly"
3. **Mention flexible:** "For better space efficiency, we could allow dynamic sizing"
4. **Ask about usage:** "Will the stacks be used evenly? That affects the design"

---

## Key Takeaways / Kluczowe Wnioski

1. **Fixed division** is preferred for simplicity
2. **Flexible division** is better for unknown usage patterns
3. **Offset calculation** is key to accessing correct stack
4. **Track state** separately for each stack

---

**Recommended:** Fixed Division for interviews (simpler)
**Time:** O(1) for all operations (fixed), O(n) worst push (flexible)
**Space:** O(n) where n is total capacity
**Difficulty:** Medium / Średni
