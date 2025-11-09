# 7.9 Circular Array / Tablica Kołowa

## Problem
Implement a CircularArray class that supports an array-like data structure which can be efficiently rotated. The class should use a generic type (if possible) and should support iteration via the standard for (Obj o : circularArray) notation.

Zaimplementuj klasę CircularArray, która obsługuje strukturę danych podobną do tablicy, która może być efektywnie obracana. Klasa powinna używać typu generycznego (jeśli to możliwe) i powinna obsługiwać iterację przez standardową notację for (Obj o : circularArray).

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
CircularArray<T>
├── items: T[]
├── head: int (rotation offset)
├── constructor(items[])
├── get(index) → T
├── set(index, item)
├── rotate(shiftRight)
├── size() → int
├── [Symbol.iterator]() → Iterator
└── toString()
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Efficient Rotation
- Instead of physically moving elements, we maintain a **head** pointer
- Rotation is O(1) - just update the head pointer
- Actual indices calculated as `(head + index) % length`

```javascript
// Physical array: [A, B, C, D, E]
// head = 0 → logical: [A, B, C, D, E]

// After rotate(2):
// Physical array: [A, B, C, D, E] (unchanged!)
// head = 2 → logical: [C, D, E, A, B]
```

### 2. Generic Type Support
- Uses JavaScript's type flexibility
- Can store any type of elements
- Type safety through careful implementation

### 3. Iterator Protocol
- Implements `[Symbol.iterator]()` for for...of loops
- Iterator respects rotation (starts from logical position 0)
- Enables standard JavaScript iteration patterns

### 4. Index Conversion
- Public API uses logical indices (0 to length-1)
- Internal conversion to physical indices: `(head + logicalIndex) % length`
- User never sees the rotation mechanism

## Iterator Pattern / Wzorzec Iteratora

The CircularArray implements the Iterator pattern:

```javascript
class CircularArrayIterator {
  constructor(circularArray) {
    this.array = circularArray;
    this.current = 0;
  }

  next() {
    if (this.current < this.array.size()) {
      return {
        value: this.array.get(this.current++),
        done: false
      };
    }
    return { done: true };
  }
}
```

## Example Usage / Przykład Użycia

```javascript
// Create circular array
const arr = new CircularArray([1, 2, 3, 4, 5]);

// Access elements
console.log(arr.get(0)); // 1
console.log(arr.get(2)); // 3

// Rotate right by 2
arr.rotate(2);
console.log(arr.get(0)); // 4 (was at index 3)
console.log(arr.get(1)); // 5 (was at index 4)

// Iterate with for...of
for (let item of arr) {
  console.log(item); // 4, 5, 1, 2, 3
}

// Rotate left by 1 (negative rotation)
arr.rotate(-1);
for (let item of arr) {
  console.log(item); // 3, 4, 5, 1, 2
}
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:** Internal rotation mechanism hidden from users
2. **Abstraction:** Simple array-like interface despite complex rotation
3. **Iterator Pattern:** Standard iteration protocol implementation
4. **Generic Programming:** Works with any data type
5. **Information Hiding:** Head pointer is implementation detail

## Design Patterns / Wzorce Projektowe

1. **Iterator Pattern:**
   - Provides sequential access without exposing internal structure
   - Supports for...of loops
   - Custom iterator respects rotation

2. **Virtual Proxy Pattern:**
   - Rotation doesn't move data, just changes perspective
   - Logical view vs. physical storage

## Extensions / Rozszerzenia

Easy to extend for:
- Array methods (push, pop, shift, unshift)
- Slice/splice operations
- Map, filter, reduce
- Reverse iteration
- Multi-dimensional circular arrays
- Fixed-size circular buffers
- Thread-safe version with locks

## Complexity / Złożoność

- **Constructor:** O(n) to copy elements
- **get(index):** O(1) - simple index calculation
- **set(index, item):** O(1) - direct access
- **rotate(k):** O(1) - just update head pointer
- **Iterator:** O(n) to iterate all elements
- **Space:** O(n) for storing n elements

## Benefits / Korzyści

1. **O(1) Rotation:** Much faster than shifting all elements
2. **Memory Efficient:** No element copying during rotation
3. **Standard Interface:** Behaves like normal array to users
4. **Flexible:** Supports positive and negative rotations
5. **Iterable:** Works with for...of, spread operator, etc.
