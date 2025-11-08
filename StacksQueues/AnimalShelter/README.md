# 3.6 Animal Shelter

## Problem
Animal shelter (dogs/cats) operates on FIFO. Support:
- `dequeueAny()` - oldest animal
- `dequeueDog()` - oldest dog
- `dequeueCat()` - oldest cat

---

## Solution

```javascript
class AnimalQueue {
  constructor() {
    this.dogs = [];
    this.cats = [];
    this.order = 0; // Global timestamp
  }

  enqueue(animal) {
    animal.setOrder(this.order++);
    if (animal instanceof Dog) this.dogs.push(animal);
    else this.cats.push(animal);
  }

  dequeueAny() {
    if (dogs[0].isOlderThan(cats[0])) {
      return this.dequeueDog();
    }
    return this.dequeueCat();
  }
}
```

**Key:** Use timestamps to compare oldest dog vs oldest cat.

**Complexity:** All operations O(1)
