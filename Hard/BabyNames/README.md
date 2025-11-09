# 17.7 Baby Names

## Original Problem

**Baby Names:** Each year, the government releases a list of the 10,000 most common baby names and their frequencies (the number of babies with that name). The only problem with this is that some names have multiple spellings. For example, "John" and "Jon" are essentially the same name but would be listed separately in the list. Given two lists - one of names/frequencies and the other of pairs of equivalent names - write an algorithm to print a new list of the true frequency of each name. Note that if John and Jon are synonyms, and Jon and Johnny are synonyms, then John and Johnny are synonyms. (It is both transitive and symmetric.) In the final list, any name can be used as the "real" name.

```
Example:
Names: {John: 15, Jon: 12, Chris: 13, Kris: 4, Christopher: 19}
Synonyms: {(Jon, John), (John, Johnny), (Chris, Kris), (Chris, Christopher)}

Output: {John: 27, Kris: 36}
or {Johnny: 27, Christopher: 36}
or any other valid grouping
```

Hints: #478, #493, #512, #537, #586, #605

---

## Understanding the Problem

We need to:
1. **Group** names that are synonymous (directly or transitively)
2. **Sum** their frequencies
3. **Pick** one representative name from each group

### Key Insight

This is a **Union-Find (Disjoint Set)** problem!
- Each name starts in its own set
- Synonym pairs merge sets
- Transitivity is handled automatically

```
Initial:  {John}, {Jon}, {Johnny}, {Chris}, {Kris}, {Christopher}

After (Jon, John):   {John, Jon}, {Johnny}, {Chris}, {Kris}, {Christopher}
After (John, Johnny): {John, Jon, Johnny}, {Chris}, {Kris}, {Christopher}
After (Chris, Kris):  {John, Jon, Johnny}, {Chris, Kris}, {Christopher}
After (Chris, Christopher): {John, Jon, Johnny}, {Chris, Kris, Christopher}

Final groups: {John, Jon, Johnny}, {Chris, Kris, Christopher}
```

---

## Solution Approaches

### Approach 1: Graph DFS/BFS

**Strategy:** Build graph of synonyms, then find connected components

```javascript
function consolidateNames(names, synonyms) {
  // Build adjacency list
  const graph = new Map();

  for (const name in names) {
    graph.set(name, []);
  }

  for (const [name1, name2] of synonyms) {
    if (graph.has(name1) && graph.has(name2)) {
      graph.get(name1).push(name2);
      graph.get(name2).push(name1);
    }
  }

  // Find connected components using DFS
  const visited = new Set();
  const result = {};

  function dfs(name, component) {
    if (visited.has(name)) return;
    visited.add(name);
    component.push(name);

    for (const neighbor of graph.get(name)) {
      dfs(neighbor, component);
    }
  }

  for (const name in names) {
    if (!visited.has(name)) {
      const component = [];
      dfs(name, component);

      // Sum frequencies and pick representative
      const representative = component[0];
      result[representative] = component.reduce(
        (sum, n) => sum + names[n],
        0
      );
    }
  }

  return result;
}
```

**Time:** O(N + P) where N = names, P = synonym pairs
**Space:** O(N + P) for graph

---

### Approach 2: Union-Find (Optimal)

**Strategy:** Use Union-Find with path compression and frequency tracking

```javascript
class UnionFind {
  constructor() {
    this.parent = new Map();
    this.frequency = new Map();
  }

  add(name, freq) {
    this.parent.set(name, name);  // Initially, parent is itself
    this.frequency.set(name, freq);
  }

  find(name) {
    if (!this.parent.has(name)) return null;

    // Path compression
    if (this.parent.get(name) !== name) {
      this.parent.set(name, this.find(this.parent.get(name)));
    }

    return this.parent.get(name);
  }

  union(name1, name2) {
    const root1 = this.find(name1);
    const root2 = this.find(name2);

    if (!root1 || !root2 || root1 === root2) return;

    // Merge: make root1 parent of root2
    this.parent.set(root2, root1);

    // Combine frequencies
    this.frequency.set(
      root1,
      this.frequency.get(root1) + this.frequency.get(root2)
    );
  }

  getGroups() {
    const result = {};

    for (const [name, freq] of this.frequency) {
      const root = this.find(name);
      if (root === name) {  // Only include roots
        result[name] = freq;
      }
    }

    return result;
  }
}

function consolidateNames(names, synonyms) {
  const uf = new UnionFind();

  // Add all names
  for (const [name, freq] of Object.entries(names)) {
    uf.add(name, freq);
  }

  // Union synonyms
  for (const [name1, name2] of synonyms) {
    if (name1 in names && name2 in names) {
      uf.union(name1, name2);
    }
  }

  return uf.getGroups();
}
```

**Time:** O(N + P × α(N)) where α is inverse Ackermann (≈ constant)
**Space:** O(N)

✅ **OPTIMAL SOLUTION**

---

## Algorithm Explanation

### Union-Find with Path Compression

```
Initial state:
  Names: {John: 15, Jon: 12, Johnny: 8}

  parent:    {John: John, Jon: Jon, Johnny: Johnny}
  frequency: {John: 15,   Jon: 12,  Johnny: 8}

Process: (Jon, John)
  find(Jon) → Jon
  find(John) → John

  union(Jon, John):
    parent[Jon] = John
    frequency[John] = 15 + 12 = 27

  State:
    parent:    {John: John, Jon: John, Johnny: Johnny}
    frequency: {John: 27,   Jon: 12,  Johnny: 8}

Process: (John, Johnny)
  find(John) → John
  find(Johnny) → Johnny

  union(John, Johnny):
    parent[Johnny] = John
    frequency[John] = 27 + 8 = 35

  Final state:
    parent:    {John: John, Jon: John, Johnny: John}
    frequency: {John: 35,   Jon: 12,  Johnny: 8}

getGroups():
  Only John is a root (parent[John] = John)
  Return: {John: 35}
```

### Path Compression Visualization

```
Before compression:
     John
      |
     Jon
      |
   Johnny
      |
   Johnnie

find(Johnnie):
  Johnnie → Johnny → Jon → John

After path compression:
     John
    / | \ \
  Jon Johnny Johnnie

All point directly to root!
```

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Graph DFS/BFS | O(N + P) | O(N + P) | Simple but more space |
| Union-Find | O(N + P × α(N)) | O(N) | **Optimal**, α ≈ constant |

---

## Edge Cases

```javascript
// No synonyms
names = {John: 15, Chris: 13}
synonyms = []
→ {John: 15, Chris: 13}

// Chain of synonyms
names = {A: 1, B: 2, C: 3, D: 4}
synonyms = [(A, B), (B, C), (C, D)]
→ {A: 10} (or any name: 10)

// Multiple separate groups
names = {A: 1, B: 2, C: 3, D: 4}
synonyms = [(A, B), (C, D)]
→ {A: 3, C: 7}

// Synonym not in names (ignore)
names = {John: 15}
synonyms = [(John, Jane)]
→ {John: 15}

// Self synonym (no effect)
synonyms = [(John, John)]
→ No change

// Duplicate synonyms
synonyms = [(John, Jon), (Jon, John)]
→ Process only once effectively
```

---

## Common Mistakes

### 1. Not handling transitivity

```javascript
// ❌ WRONG - only direct synonyms
for (const [name1, name2] of synonyms) {
  if (name1 in result) {
    result[name1] += names[name2];
  }
}

// ✅ CORRECT - use Union-Find for transitivity
```

### 2. Not checking if names exist

```javascript
// ❌ WRONG - crashes if synonym not in names
uf.union(name1, name2);

// ✅ CORRECT
if (name1 in names && name2 in names) {
  uf.union(name1, name2);
}
```

### 3. Including non-root frequencies

```javascript
// ❌ WRONG - returns all names
return this.frequency;

// ✅ CORRECT - only return roots
const result = {};
for (const [name, freq] of this.frequency) {
  const root = this.find(name);
  if (root === name) {
    result[name] = freq;
  }
}
return result;
```

---

## Variations

### 1. Return all names in each group

```javascript
function consolidateNamesWithGroups(names, synonyms) {
  const uf = new UnionFind();

  for (const [name, freq] of Object.entries(names)) {
    uf.add(name, freq);
  }

  for (const [name1, name2] of synonyms) {
    if (name1 in names && name2 in names) {
      uf.union(name1, name2);
    }
  }

  const groups = new Map();

  for (const name in names) {
    const root = uf.find(name);
    if (!groups.has(root)) {
      groups.set(root, []);
    }
    groups.get(root).push(name);
  }

  return groups;
}
```

### 2. Weighted union (by frequency)

```javascript
union(name1, name2) {
  const root1 = this.find(name1);
  const root2 = this.find(name2);

  if (!root1 || !root2 || root1 === root2) return;

  // Make higher frequency the root
  if (this.frequency.get(root1) >= this.frequency.get(root2)) {
    this.parent.set(root2, root1);
    this.frequency.set(root1,
      this.frequency.get(root1) + this.frequency.get(root2)
    );
  } else {
    this.parent.set(root1, root2);
    this.frequency.set(root2,
      this.frequency.get(root1) + this.frequency.get(root2)
    );
  }
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is a Union-Find problem with transitive equivalence"

2. **Explain transitivity:** Use example of Jon=John, John=Johnny → Jon=Johnny

3. **Start simple:** Graph approach is easier to explain, then optimize to Union-Find

4. **Discuss path compression:** Show how it improves performance

5. **Handle edge cases:** Synonyms not in names list, self-synonyms, duplicates

6. **Code incrementally:** Build UnionFind class first, then use it

---

## Key Takeaways

1. **Union-Find** is perfect for grouping with transitive relations

2. **Path compression** keeps tree flat, ensuring O(α(N)) operations

3. Sum frequencies during **union** operations

4. Only return **root** names in final result

5. Check that both names exist before unioning

6. This pattern applies to: friend groups, connected components, network connectivity

---

**Time Complexity:** O(N + P × α(N)) ≈ O(N + P)
**Space Complexity:** O(N)
**Difficulty:** Hard
