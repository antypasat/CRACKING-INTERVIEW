# 2.8 Loop Detection

## Original Problem / Oryginalne Zadanie

**Loop Detection:** Given a circular linked list, implement an algorithm that returns the node at the beginning of the loop.

**DEFINITION**

Circular linked list: A (corrupt) linked list in which a node's next pointer points to an earlier node, so as to make a loop in the linked list.

**EXAMPLE**
```
Input:  A -> B -> C -> D -> E -> C [the same C as earlier]
Output: C
```

Hints: #50, #69, #83, #90

---

## Understanding the Problem / Zrozumienie Problemu

A **circular/corrupt linked list** has a node that points back to a previous node, creating a **loop**.
**Okrągła/skorumpowana lista połączona** ma węzeł wskazujący z powrotem na poprzedni węzeł, tworząc **pętlę**.

```
Normal list / Normalna lista:
A -> B -> C -> D -> null

Circular list / Okrągła lista:
A -> B -> C -> D -> E
          ↑         |
          └─────────┘
(E points back to C / E wskazuje z powrotem na C)
```

**Goal:** Find node C (where loop starts)
**Cel:** Znajdź węzeł C (gdzie pętla się zaczyna)

---

## Solution: Floyd's Cycle Detection Algorithm

### "Tortoise and Hare" / "Żółw i Zając"

This is one of the **most famous algorithms** in computer science!
To jeden z **najsłynniejszych algorytmów** w informatyce!

### The Algorithm / Algorytm

**Two phases / Dwie fazy:**

#### Phase 1: Detect if loop exists / Wykryj czy pętla istnieje

Use two pointers moving at different speeds:
Użyj dwóch wskaźników poruszających się z różnymi prędkościami:

- **Slow (tortoise):** moves 1 step at a time / przesuwa się o 1 krok
- **Fast (hare):** moves 2 steps at a time / przesuwa się o 2 kroki

If there's a loop, they **will meet** inside the loop.
Jeśli jest pętla, **spotkają się** wewnątrz pętli.

```javascript
let slow = head;
let fast = head;

while (fast && fast.next) {
  slow = slow.next;      // 1 step / 1 krok
  fast = fast.next.next; // 2 steps / 2 kroki

  if (slow === fast) {
    // Loop detected! / Pętla wykryta!
    break;
  }
}
```

#### Phase 2: Find loop start / Znajdź początek pętli

**KEY INSIGHT / KLUCZOWA OBSERWACJA:**

After they meet:
- Move one pointer back to **head**
- Move both at **same speed** (1 step)
- They will meet at the **loop start**!

Po spotkaniu:
- Przesuń jeden wskaźnik z powrotem na **początek**
- Przesuwaj oba z **tą samą prędkością** (1 krok)
- Spotkają się na **początku pętli**!

```javascript
slow = head; // Reset to head / Przestaw na początek

while (slow !== fast) {
  slow = slow.next;
  fast = fast.next;
}

return slow; // Loop start! / Początek pętli!
```

### Complete Implementation / Pełna Implementacja

```javascript
function detectLoop(head) {
  if (!head || !head.next) return null;

  // Phase 1: Detect loop / Faza 1: Wykryj pętlę
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) break; // Loop found / Znaleziono pętlę
  }

  // No loop / Brak pętli
  if (!fast || !fast.next) return null;

  // Phase 2: Find loop start / Faza 2: Znajdź początek pętli
  slow = head;

  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow; // Loop start! / Początek pętli!
}
```

---

## Why Does This Work? / Dlaczego To Działa?

### Mathematical Proof / Dowód Matematyczny

```
Let's define / Zdefiniujmy:
k = distance from head to loop start / odległość od początku do startu pętli
m = distance from loop start to meeting point / odległość od startu pętli do punktu spotkania
L = loop length / długość pętli

When slow and fast meet / Gdy wolny i szybki się spotkają:

Distance traveled by slow / Odległość przebyta przez wolny:
  k + m

Distance traveled by fast / Odległość przebyta przez szybki:
  k + m + nL (n complete loops / n pełnych pętli)

Since fast moves twice as fast / Ponieważ szybki porusza się dwa razy szybciej:
  2(k + m) = k + m + nL
  2k + 2m = k + m + nL
  k + m = nL
  k = nL - m

This means / To oznacza:
  Distance from head to loop start =
  Distance from meeting point to loop start (going forward through loop)

  Odległość od początku do startu pętli =
  Odległość od punktu spotkania do startu pętli (idąc naprzód przez pętlę)

So if we move both pointers 1 step at a time:
- One from head
- One from meeting point
They will meet at loop start!

Więc jeśli przesuwamy oba wskaźniki po 1 kroku:
- Jeden od początku
- Jeden od punktu spotkania
Spotkają się na początku pętli!
```

---

## Visual Example / Przykład Wizualny

```
List: A -> B -> C -> D -> E -> C (loop)
           0    1    2    3    4

k = 2 (head to C)
L = 3 (loop: C -> D -> E -> C)

Phase 1: Detection / Faza 1: Wykrywanie

Step | Slow | Fast
-----|------|-----
  0  |  A   |  A
  1  |  B   |  C
  2  |  C   |  E
  3  |  D   |  D    ← They meet! / Spotykają się!

Phase 2: Find start / Faza 2: Znajdź początek

Reset slow to A, both move 1 step:

Step | Slow | Fast
-----|------|-----
  0  |  A   |  E
  1  |  B   |  C
  2  |  C   |  D
  3  |  C   |  C    ← Meet at loop start! / Spotkanie na początku pętli!

Result: C
```

---

## Alternative Approach: Hash Set / Alternatywne Podejście: Hash Set

```javascript
function detectLoopHashSet(head) {
  const visited = new Set();
  let current = head;

  while (current) {
    if (visited.has(current)) {
      return current; // First revisited node / Pierwszy ponownie odwiedzony węzeł
    }
    visited.add(current);
    current = current.next;
  }

  return null;
}
```

**Pros:** Simple, easy to understand
**Cons:** O(n) space

---

## Complexity Analysis / Analiza Złożoności

| Approach / Podejście | Time / Czas | Space / Pamięć |
|---|---|---|
| Floyd's Algorithm | **O(n)** | **O(1)** ⭐ |
| Hash Set | O(n) | O(n) |

**Floyd's is optimal!** / **Floyd jest optymalny!**

### Why O(n) time? / Dlaczego O(n) czas?

- **Phase 1:** Fast pointer visits at most 2n nodes
  - If no loop, it reaches end in n steps
  - If loop, slow and fast meet within 2n steps
- **Phase 2:** At most k steps (k ≤ n)
- **Total:** O(n)

---

## Variants / Warianty

### 1. Just detect if loop exists / Tylko wykryj czy pętla istnieje

```javascript
function hasLoop(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}
```

### 2. Find loop length / Znajdź długość pętli

```javascript
function getLoopLength(head) {
  const loopStart = detectLoop(head);
  if (!loopStart) return 0;

  let current = loopStart.next;
  let length = 1;

  while (current !== loopStart) {
    length++;
    current = current.next;
  }

  return length;
}
```

---

## Edge Cases / Przypadki Brzegowe

1. **No loop:** `A -> B -> C -> null` → `null`
2. **Empty list:** `null` → `null`
3. **Single node no loop:** `A -> null` → `null`
4. **Single node self loop:** `A -> A` → `A`
5. **Loop at head:** `A -> B -> A` → `A`
6. **Loop at end:** Entire list is the loop

---

## Common Mistakes / Częste Błędy

### 1. Wrong Loop Check
```javascript
// ❌ WRONG
while (fast.next && fast.next.next) // fast might be null!

// ✅ CORRECT
while (fast && fast.next)
```

### 2. Forgetting to Reset Slow
```javascript
// ❌ WRONG
// Don't reset slow to head in phase 2

// ✅ CORRECT
slow = head; // Reset for phase 2!
```

### 3. Moving Fast 1 Step in Phase 2
```javascript
// ❌ WRONG
fast = fast.next.next; // Still 2 steps

// ✅ CORRECT
fast = fast.next; // Now 1 step
```

---

## Interview Tips / Wskazówki do Rozmowy

1. **Name the algorithm:** "I'll use Floyd's Cycle Detection, also called Tortoise and Hare"

2. **Explain phases:** "First I detect if a loop exists, then I find where it starts"

3. **Mention math:** "The key insight is that the distance from head to loop start equals the distance from meeting point to loop start"

4. **Discuss alternatives:** "I could use a hash set for O(n) space, but Floyd's is O(1)"

5. **Handle edge cases:** "I need to check for null and single-node lists"

---

## Why "Tortoise and Hare"? / Dlaczego "Żółw i Zając"?

From Aesop's fable:
Z bajki Ezopa:

- **Tortoise (slow):** Steady, moves slowly / Stały, porusza się wolno
- **Hare (fast):** Quick, moves fast / Szybki, porusza się szybko

In the algorithm:
W algorytmie:

- If there's a loop, the fast hare will eventually **lap** the slow tortoise
  Jeśli jest pętla, szybki zając w końcu **dogoni** wolnego żółwia
- They meet inside the loop!
  Spotykają się w pętli!

---

## Key Takeaways / Kluczowe Wnioski

1. **Floyd's Algorithm is brilliant** - O(n) time, O(1) space
   **Algorytm Floyda jest genialny**

2. **Two phases:**
   - Detect loop (slow/fast meet)
   - Find start (reset slow, move both at same speed)

3. **Mathematical basis:** k = nL - m proves why it works
   **Podstawa matematyczna:** dowodzi dlaczego działa

4. **Classic interview question** - know it well!
   **Klasyczne pytanie na rozmowie** - znaj je dobrze!

5. **Elegant solution** to seemingly complex problem
   **Eleganckie rozwiązanie** pozornie złożonego problemu

---

## Related Problems / Powiązane Problemy

1. **Linked List Cycle** (LeetCode 141) - Detect if loop exists
2. **Linked List Cycle II** (LeetCode 142) - Find loop start (this problem!)
3. **Happy Number** - Uses same cycle detection
4. **Find the Duplicate Number** - Array version

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Medium / Średni

**This is Floyd's masterpiece! / To arcydzieło Floyda!** 🐢🐇
