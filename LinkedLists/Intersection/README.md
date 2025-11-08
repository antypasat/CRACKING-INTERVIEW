# 2.7 Intersection

## Original Problem / Oryginalne Zadanie

**Intersection:** Given two (singly) linked lists, determine if the two lists intersect. Return the intersecting node. Note that the intersection is defined based on **reference**, not value. That is, if the kth node of the first linked list is the exact same node (by reference) as the jth node of the second linked list, then they are intersecting.

Hints: #20, #45, #55, #65, #76, #93, #111, #120, #129

---

## Understanding the Problem / Zrozumienie Problemu

**Key Point:** Intersection is by **REFERENCE**, not value!
**Kluczowy Punkt:** Przecięcie jest przez **REFERENCJĘ**, nie wartość!

```
Example of intersection / Przykład przecięcia:

List 1: 1 -> 2 -> 3 \
                     -> 7 -> 8 -> 9 -> null
List 2: 4 -> 5 -> 6 /

Lists intersect at node with value 7 (same object reference)
Listy przecinają się w węźle z wartością 7 (ta sama referencja obiektu)

NOT an intersection / NIE przecięcie:
List 1: 1 -> 2 -> 7 -> 8 -> null
List 2: 3 -> 4 -> 7 -> 9 -> null
           (different node objects with same value)
           (różne obiekty węzłów z tą samą wartością)
```

### Critical Insight / Kluczowa Obserwacja

If two lists intersect, they share a **common tail** from the intersection point to the end.
Jeśli dwie listy się przecinają, dzielą **wspólny ogon** od punktu przecięcia do końca.

```
After intersection, SAME nodes (same references)
Po przecięciu, TE SAME węzły (te same referencje)

List 1: A -> B -> C \
                     -> X -> Y -> Z -> null
List 2: D -> E ------/
                (same X, Y, Z objects)
```

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Hash Set / Zbiór Hash

**Strategy:** Store all nodes from list1, check list2 for matches
**Strategia:** Przechowaj wszystkie węzły z list1, sprawdź list2 pod kątem dopasowań

```javascript
function findIntersectionHashSet(head1, head2) {
  const nodes = new Set();
  let current = head1;

  // Store all nodes from list1 / Przechowaj wszystkie węzły z list1
  while (current) {
    nodes.add(current);
    current = current.next;
  }

  // Find first node from list2 in set / Znajdź pierwszy węzeł z list2 w zbiorze
  current = head2;
  while (current) {
    if (nodes.has(current)) return current;
    current = current.next;
  }

  return null;
}
```

**Time:** O(n + m)
**Space:** O(n)

---

### Approach 2: Optimal (Length-based) - BEST / NAJLEPSZE

**Key Insights / Kluczowe Spostrzeżenia:**

1. If lists intersect, they have **same tail** (last node is identical)
   Jeśli listy się przecinają, mają **ten sam ogon** (ostatni węzeł jest identyczny)

2. We can **align** the lists by offsetting the longer one
   Możemy **wyrównać** listy przez przesunięcie dłuższej

```
List 1: 1 -> 2 -> 3 -> 4 -> 7 -> 8 -> 9    (length 7)
List 2:           5 -> 6 -> 7 -> 8 -> 9    (length 5)

Difference: 2
Advance list1 by 2:
             3 -> 4 -> 7 -> 8 -> 9
                  5 -> 6 -> 7 -> 8 -> 9

Now traverse in parallel until nodes match!
```

```javascript
function findIntersection(head1, head2) {
  // Get lengths and tails / Pobierz długości i ogony
  const result1 = getLengthAndTail(head1);
  const result2 = getLengthAndTail(head2);

  // Different tails = no intersection / Różne ogony = brak przecięcia
  if (result1.tail !== result2.tail) return null;

  // Align starting positions / Wyrównaj pozycje startowe
  let shorter = result1.length < result2.length ? head1 : head2;
  let longer = result1.length < result2.length ? head2 : head1;
  let diff = Math.abs(result1.length - result2.length);

  // Advance longer list / Przesuń dłuższą listę
  for (let i = 0; i < diff; i++) {
    longer = longer.next;
  }

  // Traverse in parallel / Przejdź równolegle
  while (shorter !== longer) {
    shorter = shorter.next;
    longer = longer.next;
  }

  return shorter; // Intersection node / Węzeł przecięcia
}
```

**Time:** O(n + m)
**Space:** O(1) ⭐

---

### Approach 3: Two Pointers (Elegant)

**Clever Trick / Sprytna Sztuczka:**

When a pointer reaches the end, redirect it to the **other list's head**.

```javascript
function findIntersectionTwoPointers(head1, head2) {
  let p1 = head1;
  let p2 = head2;

  while (p1 !== p2) {
    p1 = p1 ? p1.next : head2;  // Switch to head2 when done
    p2 = p2 ? p2.next : head1;  // Switch to head1 when done
  }

  return p1; // Either intersection or null
}
```

**Why it works / Dlaczego działa:**

```
List 1: A -> B -> C \
                     -> X -> Y -> Z
List 2: D -> E ------/

p1 path: A -> B -> C -> X -> Y -> Z -> D -> E -> X (meets here!)
p2 path: D -> E -> X -> Y -> Z -> A -> B -> C -> X (meets here!)

Both travel same total distance: (a + c) + (b) = (b + c) + (a)
where a = unique to list1, b = unique to list2, c = common
```

**Time:** O(n + m)
**Space:** O(1) ⭐

---

## Step-by-Step Example / Przykład Krok Po Kroku

```
Lists:
L1: 1 -> 2 -> 3 -> 7 -> 8 (length 5)
L2: 4 -> 5 -> 7 -> 8      (length 4)
                    (same 7, 8 nodes)

Optimal Approach:

Step 1: Get lengths and tails
  L1: length=5, tail=8 (node object)
  L2: length=4, tail=8 (same node object) ✓

Step 2: Align
  diff = 5 - 4 = 1
  Advance L1 by 1:
    L1: 2 -> 3 -> 7 -> 8
    L2: 4 -> 5 -> 7 -> 8

Step 3: Traverse in parallel
  Compare: 2 ≠ 4, advance both
  Compare: 3 ≠ 5, advance both
  Compare: 7 === 7 (same reference!) ✓

Result: node 7
```

---

## Complexity Analysis / Analiza Złożoności

| Approach / Podejście | Time / Czas | Space / Pamięć | Notes |
|---|---|---|---|
| Hash Set | O(n + m) | O(n) | Simple but uses extra space / Proste ale używa dodatkowej przestrzeni |
| Length-based | O(n + m) | **O(1)** | Optimal! / Optymalne! |
| Two Pointers | O(n + m) | **O(1)** | Elegant! / Eleganckie! |

---

## Edge Cases / Przypadki Brzegowe

1. **No intersection:** Return null
2. **One/both lists null:** Return null
3. **Same list:** Intersect at head
4. **Intersection at last node only:** Still works
5. **Very different lengths:** Algorithm handles it

---

## Common Mistakes / Częste Błędy

### 1. Comparing Values Instead of References
```javascript
// ❌ WRONG
if (node1.data === node2.data) return node1;

// ✅ CORRECT
if (node1 === node2) return node1;
```

### 2. Not Checking Tail First
```javascript
// Optimization: If tails differ, no intersection
if (tail1 !== tail2) return null;
```

### 3. Off-by-One in Length Calculation
```javascript
// Make sure to count all nodes correctly
```

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify:** "The intersection is by reference, not value, correct?"
2. **Mention tail check:** "I can optimize by checking if tails match first"
3. **Explain alignment:** "I'll offset the longer list to align starting positions"
4. **Discuss trade-offs:** "Hash set is simple but uses O(n) space. Length-based is O(1) space."

---

## Key Takeaways / Kluczowe Wnioski

1. **Intersection = same tail** from intersection point
2. **Check tails first** for quick null check
3. **Align lists** by offsetting longer one
4. **O(1) space** is achievable with clever traversal
5. **Two pointers trick** is elegant but length-based is clearer

---

**Time Complexity:** O(n + m)
**Space Complexity:** O(1) (optimal approaches)
**Difficulty:** Medium / Średni
