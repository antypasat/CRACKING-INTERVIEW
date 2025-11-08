# 2.4 Partition

## Original Problem / Oryginalne Zadanie

**Partition:** Write code to partition a linked list around a value x, such that all nodes less than x come before all nodes greater than or equal to x. If x is contained within the list, the values of x only need to be after the elements less than x (see below). The partition element x can appear anywhere in the "right partition"; it does not need to appear between the left and right partitions.

**EXAMPLE**
```
Input:  3 -> 5 -> 8 -> 5 -> 10 -> 2 -> 1 [partition = 5]
Output: 3 -> 1 -> 2 -> 10 -> 5 -> 5 -> 8
```

Hints: #3, #24

---

## Understanding the Problem / Zrozumienie Problemu

This problem asks us to **rearrange a linked list** so that all elements smaller than a given value `x` appear before all elements greater than or equal to `x`.
Ten problem wymaga **przestawienia listy połączonej** tak, aby wszystkie elementy mniejsze niż dana wartość `x` znajdowały się przed wszystkimi elementami większymi lub równymi `x`.

### Important Points / Ważne Punkty

1. **Not a full sort** - We only need to partition, not sort completely
   **Nie jest to pełne sortowanie** - Potrzebujemy tylko podziału, nie pełnego sortowania

2. **Relative order can change** - Elements within each partition don't need to maintain their original order (though our solution does preserve it)
   **Względna kolejność może się zmienić** - Elementy w ramach każdej partycji nie muszą zachowywać oryginalnej kolejności (choć nasze rozwiązanie ją zachowuje)

3. **Elements equal to x** go in the "greater than or equal" partition
   **Elementy równe x** trafiają do partycji "większe lub równe"

4. **x doesn't need to be in the list** - It's just a partition value
   **x nie musi być w liście** - To tylko wartość podziału

### Visual Example / Przykład Wizualny

```
Original / Oryginał:
3 -> 5 -> 8 -> 5 -> 10 -> 2 -> 1    [x = 5]

Elements < 5:  3, 2, 1
Elements >= 5: 5, 8, 5, 10

After partition / Po podziale:
3 -> 2 -> 1 -> 5 -> 8 -> 5 -> 10
└─────┬────┘   └──────┬────────┘
   < 5            >= 5
```

---

## Solution Approach / Podejście do Rozwiązania

### Strategy: Two Separate Lists
### Strategia: Dwie Osobne Listy

The most intuitive approach is to create **two separate lists**:
Najbardziej intuicyjne podejście to utworzenie **dwóch osobnych list**:

1. **Before list** - for elements < x
   **Lista before** - dla elementów < x

2. **After list** - for elements >= x
   **Lista after** - dla elementów >= x

3. Then **connect** them: before → after
   Potem je **łączymy**: before → after

### Step-by-Step Process / Proces Krok Po Kroku

```
Step 1: Initialize two empty lists
Krok 1: Inicjalizuj dwie puste listy

beforeHead → null
afterHead → null

Step 2: Traverse original list
Krok 2: Przejdź oryginalną listę

For each node:
  if (data < x) → add to before list
  else         → add to after list

Original: 3 -> 5 -> 8 -> 5 -> 10 -> 2 -> 1  [x = 5]

Process 3: < 5 → before: 3
Process 5: >= 5 → after: 5
Process 8: >= 5 → after: 5 -> 8
Process 5: >= 5 → after: 5 -> 8 -> 5
Process 10: >= 5 → after: 5 -> 8 -> 5 -> 10
Process 2: < 5 → before: 3 -> 2
Process 1: < 5 → before: 3 -> 2 -> 1

Step 3: Connect the lists
Krok 3: Połącz listy

before: 3 -> 2 -> 1 -> null
after:  5 -> 8 -> 5 -> 10 -> null

Result: 3 -> 2 -> 1 -> 5 -> 8 -> 5 -> 10
```

---

## Implementation / Implementacja

### Main Solution / Główne Rozwiązanie

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

function partition(head, x) {
  // Edge case: empty list / Przypadek brzegowy: pusta lista
  if (!head) return null;

  // Create dummy nodes for two lists / Tworzymy węzły dummy dla dwóch list
  let beforeHead = new Node(0); // Dummy for nodes < x
  let afterHead = new Node(0);  // Dummy for nodes >= x

  let before = beforeHead; // Pointer to build before list
  let after = afterHead;   // Pointer to build after list

  let current = head;

  // Traverse and partition / Przechodzimy i dzielimy
  while (current) {
    if (current.data < x) {
      before.next = current;
      before = before.next;
    } else {
      after.next = current;
      after = after.next;
    }
    current = current.next;
  }

  // CRITICAL: Terminate after list to prevent cycles
  // KRYTYCZNE: Zamknij listę after aby zapobiec cyklom
  after.next = null;

  // Connect before list to after list / Łączymy listy
  before.next = afterHead.next;

  // Return new head (skip dummy) / Zwracamy nową głowę (pomijając dummy)
  return beforeHead.next;
}
```

### Why Use Dummy Nodes? / Dlaczego Używamy Węzłów Dummy?

Dummy nodes simplify the code by avoiding special cases for empty lists.
Węzły dummy upraszczają kod przez uniknięcie specjalnych przypadków dla pustych list.

```javascript
// Without dummy - need to check if list is empty
// Bez dummy - trzeba sprawdzać czy lista jest pusta
if (beforeHead === null) {
  beforeHead = current;
  before = beforeHead;
} else {
  before.next = current;
  before = before.next;
}

// With dummy - always the same operation
// Z dummy - zawsze ta sama operacja
before.next = current;
before = before.next;
```

---

## Alternative Approach / Alternatywne Podejście

### Growing Lists at Head / Rozwijanie List od Głowy

Instead of adding nodes to the tail of each list, add them to the **head**:
Zamiast dodawać węzły na koniec każdej listy, dodajemy je na **początek**:

```javascript
function partitionAlternative(head, x) {
  if (!head) return null;

  let beforeHead = null;
  let afterHead = null;
  let current = head;

  while (current) {
    let next = current.next; // Save next / Zapisz next

    if (current.data < x) {
      // Add to beginning of before list / Dodaj na początek before
      current.next = beforeHead;
      beforeHead = current;
    } else {
      // Add to beginning of after list / Dodaj na początek after
      current.next = afterHead;
      afterHead = current;
    }

    current = next;
  }

  // Connect lists / Połącz listy
  if (!beforeHead) return afterHead;

  let beforeTail = beforeHead;
  while (beforeTail.next) {
    beforeTail = beforeTail.next;
  }
  beforeTail.next = afterHead;

  return beforeHead;
}
```

**Note:** This approach reverses the order within each partition!
**Uwaga:** To podejście odwraca kolejność w ramach każdej partycji!

```
Original: 3 -> 5 -> 8 -> 5 -> 10 -> 2 -> 1  [x = 5]

Head insertion order:
3 added: before = 3
5 added: after = 5
8 added: after = 8 -> 5
...
2 added: before = 2 -> 3
1 added: before = 1 -> 2 -> 3

Result: 1 -> 2 -> 3 -> 10 -> 5 -> 8 -> 5
        └─────┬────┘   └──────┬────────┘
           < 5 (reversed)  >= 5 (reversed)
```

---

## Critical Bug to Avoid / Krytyczny Błąd do Uniknięcia

### THE CYCLE BUG / BŁĄD CYKLU

**Always terminate the after list!** Otherwise, you might create a cycle.
**Zawsze zamykaj listę after!** W przeciwnym razie możesz utworzyć cykl.

```javascript
// BUG - Missing termination / BŁĄD - Brak zamknięcia
function partitionBuggy(head, x) {
  let beforeHead = new Node(0);
  let afterHead = new Node(0);
  let before = beforeHead;
  let after = afterHead;
  let current = head;

  while (current) {
    if (current.data < x) {
      before.next = current;
      before = before.next;
    } else {
      after.next = current;
      after = after.next;
    }
    current = current.next;
  }

  // Missing: after.next = null;  ❌ BUG!

  before.next = afterHead.next;
  return beforeHead.next;
}

// Example that creates cycle / Przykład tworzący cykl:
// List: 5 -> 2 -> 8
// x = 5

// After partitioning without termination:
// Po podziale bez zamknięcia:
// before: 2 -> 8 -> (8.next still points to original next!)
//                   (8.next nadal wskazuje na oryginalny next!)
```

**Fix / Naprawa:**
```javascript
after.next = null;  // ✅ Always do this! / Zawsze to rób!
before.next = afterHead.next;
```

---

## Complexity Analysis / Analiza Złożoności

### Time Complexity / Złożoność Czasowa: **O(n)**

- We traverse the list **once** / Przechodzimy listę **raz**
- Each node is visited and processed exactly once / Każdy węzeł jest odwiedzony i przetworzony dokładnie raz
- Connecting the lists is O(1) / Łączenie list to O(1)

```
n = number of nodes / liczba węzłów
Operations per node: constant / Operacje na węzeł: stałe
Total: O(n)
```

### Space Complexity / Złożoność Pamięciowa: **O(1)**

- We don't create new nodes / Nie tworzymy nowych węzłów
- We only use a few pointers (before, after, current) / Używamy tylko kilku wskaźników
- The dummy nodes are constant space / Węzły dummy to stała przestrzeń
- We're just **rearranging pointers** / Tylko **przestawiamy wskaźniki**

**Note:** If you count the input list as taking space, it's O(n), but since we're modifying in-place, the **additional** space is O(1).
**Uwaga:** Jeśli liczysz listę wejściową jako zajmującą miejsce, to O(n), ale ponieważ modyfikujemy w miejscu, **dodatkowa** przestrzeń to O(1).

---

## Edge Cases / Przypadki Brzegowe

### 1. Empty List / Pusta Lista
```javascript
partition(null, 5) → null
```

### 2. Single Element / Pojedynczy Element
```javascript
partition(5, 5) → 5 (goes to "after" since >= x)
partition(3, 5) → 3 (goes to "before")
```

### 3. All Elements < x
```javascript
partition([1,2,3,4], 10) → [1,2,3,4] (all in "before")
```

### 4. All Elements >= x
```javascript
partition([10,20,30], 5) → [10,20,30] (all in "after")
```

### 5. Partition Value Not in List
```javascript
partition([7,2,9,1,8,3], 5) → [2,1,3,7,9,8]
                               < 5    >= 5
```

### 6. Duplicate Partition Values
```javascript
partition([5,5,5,2,5,1], 5) → [2,1,5,5,5,5]
                              < 5   >= 5
```

### 7. Negative Numbers / Liczby Ujemne
```javascript
partition([-5,10,-3,7,0], 0) → [-5,-3,10,7,0]
                                < 0    >= 0
```

---

## Common Mistakes / Częste Błędy

### 1. Forgetting to Terminate After List
```javascript
// ❌ WRONG
before.next = afterHead.next;
return beforeHead.next;

// ✅ CORRECT
after.next = null;  // Critical! / Krytyczne!
before.next = afterHead.next;
return beforeHead.next;
```

### 2. Trying to Sort Instead of Partition
```javascript
// ❌ WRONG - This is partition, not sort!
// Problem asks for partition, not sorted list
// Zadanie wymaga podziału, nie sortowania

// ✅ CORRECT - Just partition
// Elements within each part can be in any order
// Elementy w ramach każdej części mogą być w dowolnej kolejności
```

### 3. Creating New Nodes Instead of Reusing
```javascript
// ❌ WRONG - Wastes space / Marnuje przestrzeń
before.next = new Node(current.data);

// ✅ CORRECT - Reuse existing nodes / Używaj istniejących węzłów
before.next = current;
```

### 4. Not Handling Empty Before or After List
```javascript
// ❌ WRONG - Crash if beforeHead is null
before.next = afterHead.next;

// ✅ CORRECT - Dummy nodes handle this automatically
// Or check: if (!beforeHead) return afterHead;
```

---

## Interview Tips / Wskazówki do Rozmowy Kwalifikacyjnej

### 1. Clarify Requirements / Wyjaśnij Wymagania
- "Should the relative order of elements be preserved?"
  "Czy względna kolejność elementów powinna być zachowana?"
- "Can x be not in the list?"
  "Czy x może nie być w liście?"
- "What should happen with elements equal to x?"
  "Co powinno się stać z elementami równymi x?"

### 2. Explain Your Approach / Wyjaśnij Swoje Podejście
"I'll use two separate lists - one for elements less than x, and one for elements greater than or equal to x. Then I'll connect them."

### 3. Mention the Critical Bug / Wspomnij o Krytycznym Błędzie
"It's important to terminate the after list with null, otherwise we might create a cycle in the linked list."

### 4. Discuss Alternatives / Omów Alternatywy
"We could also add nodes to the head of each partition, but that would reverse the order within each partition. The tail insertion approach preserves relative order."

### 5. Consider Trade-offs / Rozważ Kompromisy
- **Stable partition** (preserves order): Tail insertion approach
- **Simpler code** (but reverses order): Head insertion approach

---

## Related Problems / Powiązane Problemy

1. **Quick Sort Partition** - Similar partitioning concept for arrays
   **Partycja Quick Sort** - Podobna koncepcja podziału dla tablic

2. **Sort Colors** (Dutch National Flag) - Partition into 3 groups
   **Sortowanie Kolorów** - Podział na 3 grupy

3. **Partition List** (LeetCode 86) - Same problem!
   **Partition List** - To samo zadanie!

4. **Odd Even Linked List** - Partition by odd/even indices
   **Lista Nieparzysta Parzysta** - Podział według nieparzystych/parzystych indeksów

---

## Testing the Solution / Testowanie Rozwiązania

Run the solution file to see comprehensive test cases:
Uruchom plik rozwiązania aby zobaczyć kompleksowe testy:

```bash
node solution.js
```

The tests include:
Testy zawierają:
- ✅ Basic partition from example / Podstawowy podział z przykładu
- ✅ All elements less than x / Wszystkie elementy mniejsze niż x
- ✅ All elements greater than or equal to x / Wszystkie elementy większe lub równe x
- ✅ Partition value not in list / Wartość podziału nie ma w liście
- ✅ Single element / Pojedynczy element
- ✅ Two elements / Dwa elementy
- ✅ Duplicates of partition value / Duplikaty wartości podziału
- ✅ Alternative approach / Alternatywne podejście
- ✅ Empty list / Pusta lista
- ✅ Negative numbers / Liczby ujemne
- ✅ Already partitioned list / Już podzielona lista

---

## Key Takeaways / Kluczowe Wnioski

1. **Partition ≠ Sort** / **Podział ≠ Sortowanie**
   - Only need to separate into two groups / Tylko trzeba rozdzielić na dwie grupy
   - Don't need full ordering / Nie potrzeba pełnego uporządkowania

2. **Dummy Nodes Simplify Code** / **Węzły Dummy Upraszczają Kod**
   - Avoid special cases for empty lists / Unikamy specjalnych przypadków dla pustych list
   - Consistent operations throughout / Spójne operacje przez cały czas

3. **Always Terminate Lists** / **Zawsze Zamykaj Listy**
   - Setting `after.next = null` prevents cycles / Ustawienie `after.next = null` zapobiega cyklom
   - Critical for correctness / Krytyczne dla poprawności

4. **Reuse Nodes, Don't Create** / **Używaj Węzłów, Nie Twórz**
   - O(1) space by rearranging pointers / O(1) przestrzeni przez przestawianie wskaźników
   - More efficient than creating new nodes / Bardziej efektywne niż tworzenie nowych węzłów

5. **Two Valid Approaches** / **Dwa Poprawne Podejścia**
   - Tail insertion: preserves order, slightly more complex / Wstawianie na koniec: zachowuje kolejność, trochę bardziej złożone
   - Head insertion: reverses order, simpler / Wstawianie na początek: odwraca kolejność, prostsze

---

**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Difficulty:** Medium / Średni
