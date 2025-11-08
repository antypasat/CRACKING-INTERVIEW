# 2.6 Palindrome

## Original Problem / Oryginalne Zadanie

**Palindrome:** Implement a function to check if a linked list is a palindrome.

Hints: #5, #13, #29, #61, #101

---

## Understanding the Problem / Zrozumienie Problemu

A **palindrome** reads the same forwards and backwards.
**Palindrom** czyta się tak samo od przodu i od tyłu.

```
Examples / Przykłady:
1 -> 2 -> 3 -> 2 -> 1  ✓ Palindrome
1 -> 2 -> 2 -> 1       ✓ Palindrome
1 -> 2 -> 3 -> 4 -> 5  ✗ Not palindrome / Nie palindrom
a -> b -> a            ✓ Palindrome
```

### Challenge / Wyzwanie

In arrays: Easy - compare `arr[i]` with `arr[n-1-i]`
W tablicach: Łatwe - porównaj `arr[i]` z `arr[n-1-i]`

In linked lists: **Hard** - no backwards traversal!
W listach: **Trudne** - brak przechodzenia wstecz!

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Reverse and Compare / Odwróć i Porównaj

**Strategy:** Create reversed copy, compare with original
**Strategia:** Utwórz odwróconą kopię, porównaj z oryginałem

```javascript
function isPalindromeReverse(head) {
  const reversed = reverseAndClone(head);
  return isEqual(head, reversed);
}
```

**Pros:** Simple, intuitive / Proste, intuicyjne
**Cons:** O(n) extra space / Dodatkowa przestrzeń O(n)

---

### Approach 2: Stack (Runner Technique) / Stos (Technika Runner)

**Strategy:** Use fast/slow pointers to find middle, push first half to stack, compare with second half
**Strategia:** Użyj szybkich/wolnych wskaźników do znalezienia środka, odłóż pierwszą połowę na stos, porównaj z drugą

```javascript
function isPalindromeStack(head) {
  let slow = head;
  let fast = head;
  const stack = [];

  // Push first half onto stack / Odłóż pierwszą połowę na stos
  while (fast && fast.next) {
    stack.push(slow.data);
    slow = slow.next;      // 1 step / 1 krok
    fast = fast.next.next; // 2 steps / 2 kroki
  }

  // If odd length, skip middle / Jeśli nieparzysta długość, pomiń środek
  if (fast) slow = slow.next;

  // Compare second half with stack / Porównaj drugą połowę ze stosem
  while (slow) {
    if (stack.pop() !== slow.data) return false;
    slow = slow.next;
  }

  return true;
}
```

**Visual Example / Przykład Wizualny:**
```
List: 1 -> 2 -> 3 -> 2 -> 1

Step 1: Push first half to stack
slow/fast start at head:
  1 -> 2 -> 3 -> 2 -> 1
  ↑    ↑
  s    f

After iteration 1:
  1 -> 2 -> 3 -> 2 -> 1
       ↑         ↑
       s         f
  stack: [1]

After iteration 2:
  1 -> 2 -> 3 -> 2 -> 1
            ↑              (f.next is null)
            s
  stack: [1, 2]

Step 2: Skip middle (odd length)
  slow moves to: 2 (second 2)

Step 3: Compare
  slow: 2, stack.pop(): 2 ✓
  slow: 1, stack.pop(): 1 ✓
  Result: true
```

**Pros:** Only O(n/2) space / Tylko O(n/2) przestrzeni
**Cons:** Still O(n) space / Nadal O(n) przestrzeń

---

### Approach 3: Recursive / Rekurencyjne

**Strategy:** Use recursion to reach end, compare on way back
**Strategia:** Użyj rekurencji aby dotrzeć do końca, porównuj w drodze powrotnej

```javascript
function isPalindromeRecursive(head) {
  const length = getLength(head);
  const result = isPalindromeHelper(head, length);
  return result.isPalindrome;
}

function isPalindromeHelper(head, length) {
  if (length === 0) return { node: head, isPalindrome: true };
  if (length === 1) return { node: head.next, isPalindrome: true };

  // Recurse on inner sublist / Rekurencja na wewnętrznej podliście
  const result = isPalindromeHelper(head.next, length - 2);

  if (!result.isPalindrome) return result;

  // Compare outer nodes / Porównaj zewnętrzne węzły
  const matches = head.data === result.node.data;

  return {
    node: result.node.next,
    isPalindrome: matches
  };
}
```

**Pros:** Elegant / Eleganckie
**Cons:** Complex, O(n) recursion stack / Złożone, stos rekurencji O(n)

---

### Approach 4: In-Place (Optimal) / W Miejscu (Optymalne)

**Strategy:** Reverse second half in-place, compare, restore
**Strategia:** Odwróć drugą połowę w miejscu, porównaj, przywróć

```javascript
function isPalindromeInPlace(head) {
  if (!head || !head.next) return true;

  // Find middle / Znajdź środek
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Reverse second half / Odwróć drugą połowę
  let secondHalf = reverseList(slow);
  const secondHalfHead = secondHalf;

  // Compare / Porównaj
  let isPalindrome = true;
  while (secondHalf) {
    if (head.data !== secondHalf.data) {
      isPalindrome = false;
      break;
    }
    head = head.next;
    secondHalf = secondHalf.next;
  }

  // Restore list / Przywróć listę
  reverseList(secondHalfHead);

  return isPalindrome;
}
```

**Visual Example / Przykład Wizualny:**
```
List: 1 -> 2 -> 3 -> 2 -> 1

Step 1: Find middle (slow at 3)
  1 -> 2 -> 3 -> 2 -> 1
            ↑
          slow

Step 2: Reverse from middle
  Before: 1 -> 2 -> 3 -> 2 -> 1
  After:  1 -> 2 -> 3 <- 2 <- 1
          ↑              ↑
        first         second

Step 3: Compare
  1 == 1 ✓
  2 == 2 ✓
  3 (middle, no comparison needed)

Step 4: Restore (reverse second half again)
  Result: 1 -> 2 -> 3 -> 2 -> 1
```

**Pros:** O(1) space! / O(1) przestrzeń!
**Cons:** Modifies list (even if restored) / Modyfikuje listę (nawet jeśli przywrócona)

---

## Comparison / Porównanie

| Approach / Podejście | Time / Czas | Space / Pamięć | Pros / Zalety | Cons / Wady |
|---|---|---|---|---|
| Reverse & Compare | O(n) | O(n) | Simple / Proste | Extra space / Dodatkowa przestrzeń |
| Stack | O(n) | O(n/2)=O(n) | Intuitive / Intuicyjne | Still O(n) space / Nadal O(n) |
| Recursive | O(n) | O(n) | Elegant / Eleganckie | Complex / Złożone |
| In-place | O(n) | O(1) | **Optimal space** | Modifies list / Modyfikuje listę |

---

## Key Insights / Kluczowe Spostrzeżenia

### Runner Technique / Technika Runner

```javascript
let slow = head;
let fast = head;

while (fast && fast.next) {
  slow = slow.next;      // Move 1 / Przesuń o 1
  fast = fast.next.next; // Move 2 / Przesuń o 2
}
// slow is now at middle / slow jest teraz w środku
```

**Why it works:** When fast reaches end, slow is at middle
**Dlaczego działa:** Gdy fast dotrze do końca, slow jest w środku

### Handling Odd vs Even Length / Obsługa Nieparzystej i Parzystej Długości

```javascript
// After runner:
if (fast) {
  // Odd length - fast is at last node
  // Nieparzysta długość - fast jest na ostatnim węźle
  slow = slow.next; // Skip middle element
}
```

```
Even: 1 -> 2 -> 2 -> 1
      ↑              ↑
    slow           fast=null

Odd:  1 -> 2 -> 3 -> 2 -> 1
            ↑              ↑
          slow          fast
```

---

## Edge Cases / Przypadki Brzegowe

1. **Empty list:** `null` → `true` (vacuously true / próżno prawda)
2. **Single node:** `1` → `true`
3. **Two nodes same:** `1 -> 1` → `true`
4. **Two nodes different:** `1 -> 2` → `false`
5. **All same values:** `5 -> 5 -> 5` → `true`
6. **Almost palindrome:** `1 -> 2 -> 3 -> 3 -> 1` → `false`

---

## Implementation Tips / Wskazówki Implementacyjne

### 1. Always Check for null
```javascript
if (!head || !head.next) return true;
```

### 2. Runner Technique is Your Friend
Use it to find middle in O(n) time, O(1) space
Użyj jej do znalezienia środka w czasie O(n), przestrzeń O(1)

### 3. Stack Simplifies Comparison
Push first half, pop and compare with second half
Odłóż pierwszą połowę, zdejmuj i porównuj z drugą połową

### 4. Consider Trade-offs
- Need O(1) space? → In-place
- Can't modify list? → Stack or Reverse & Compare
- Want elegance? → Recursive

---

## Interview Tips / Wskazówki do Rozmowy

1. **Start with approach:** "I'll use the runner technique to find the middle, then compare halves."

2. **Clarify:** "Can I modify the list?" / "Czy mogę modyfikować listę?"

3. **Discuss trade-offs:** "The stack approach uses O(n/2) space but doesn't modify the list. The in-place approach is O(1) space but temporarily modifies the structure."

4. **Mention optimization:** "We only need to check half the list - the first half mirrors the second."

5. **Code carefully:** "I need to handle both odd and even length lists differently."

---

## Common Mistakes / Częste Błędy

### 1. Forgetting Odd Length Case
```javascript
// ❌ WRONG - doesn't skip middle
while (slow) { ... }

// ✅ CORRECT
if (fast) slow = slow.next; // Skip middle for odd length
```

### 2. Not Handling Empty/Single Node
```javascript
// ❌ WRONG
while (fast.next) { ... } // Crashes on null

// ✅ CORRECT
if (!head || !head.next) return true;
```

### 3. Incorrect Runner Logic
```javascript
// ❌ WRONG
while (fast.next && fast.next.next) { ... }
// slow ends BEFORE middle

// ✅ CORRECT
while (fast && fast.next) { ... }
// slow ends AT middle
```

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Odd and even length palindromes / Nieparzyste i parzyste palindromy
- ✅ Non-palindromes / Nie-palindromy
- ✅ Single/two character lists / Listy jedno/dwuelementowe
- ✅ All same values / Wszystkie te same wartości
- ✅ Letters and numbers / Litery i liczby
- ✅ Edge cases / Przypadki brzegowe
- ✅ All 4 approaches verified / Wszystkie 4 podejścia zweryfikowane

---

## Key Takeaways / Kluczowe Wnioski

1. **Runner technique** finds middle in O(n) time, O(1) space
   **Technika runner** znajduje środek w czasie O(n), przestrzeń O(1)

2. **Stack approach** is most intuitive - push half, compare with other half
   **Podejście stosowe** jest najbardziej intuicyjne

3. **In-place** gives O(1) space but modifies list
   **W miejscu** daje O(1) przestrzeń ale modyfikuje listę

4. **Handle odd/even** carefully - odd length has middle element to skip
   **Obsłuż nieparzystą/parzystą** ostrożnie - nieparzysta ma środkowy element do pominięcia

5. **Multiple solutions** exist - choose based on constraints
   **Wiele rozwiązań** istnieje - wybierz na podstawie ograniczeń

---

**Time Complexity:** O(n) for all approaches
**Space Complexity:** O(1) for in-place, O(n) for others
**Difficulty:** Medium / Średni
