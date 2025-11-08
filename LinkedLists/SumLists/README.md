# 2.5 Sum Lists

## Original Problem / Oryginalne Zadanie

**Sum Lists:** You have two numbers represented by a linked list, where each node contains a single digit. The digits are stored in reverse order, such that the 1's digit is at the head of the list. Write a function that adds the two numbers and returns the sum as a linked list.

**EXAMPLE**
```
Input:  (7 -> 1 -> 6) + (5 -> 9 -> 2). That is, 617 + 295.
Output: 2 -> 1 -> 9. That is, 912.
```

**FOLLOW UP**

Suppose the digits are stored in forward order. Repeat the above problem.

**EXAMPLE**
```
Input:  (6 -> 1 -> 7) + (2 -> 9 -> 5). That is, 617 + 295.
Output: 9 -> 1 -> 2. That is, 912.
```

Hints: #7, #30, #71, #95, #109

---

## Understanding the Problem / Zrozumienie Problemu

This problem simulates **addition of two numbers** where each digit is stored in a linked list node.
Ten problem symuluje **dodawanie dwóch liczb**, gdzie każda cyfra jest przechowana w węźle listy połączonej.

There are **two variants:**
Są **dwa warianty:**

### Part 1: Reverse Order (Easier)
### Część 1: Odwrócona Kolejność (Łatwiejsza)

Digits are stored with the **1's digit at the head**:
Cyfry są przechowane z **cyfrą jedności na początku**:

```
Number: 617
List:   7 -> 1 -> 6
        ↑         ↑
      ones    hundreds
    jedności   setki
```

This matches how we **add by hand** (right to left with carry)!
To odpowiada temu jak **dodajemy ręcznie** (od prawej do lewej z przeniesieniem)!

### Part 2: Forward Order (Harder)
### Część 2: Normalna Kolejność (Trudniejsza)

Digits are stored in **normal order**:
Cyfry są przechowane w **normalnej kolejności**:

```
Number: 617
List:   6 -> 1 -> 7
        ↑         ↑
    hundreds    ones
      setki   jedności
```

This is harder because we need to add from right to left, but the list goes left to right!
To jest trudniejsze, bo musimy dodawać od prawej do lewej, ale lista idzie od lewej do prawej!

---

## Solution Part 1: Reverse Order / Rozwiązanie Część 1: Odwrócona Kolejność

### Visual Example / Przykład Wizualny

```
Add: 617 + 295

Lists in reverse order:
  7 -> 1 -> 6
+ 5 -> 9 -> 2
--------------

Step-by-step / Krok po kroku:

Position 1 (ones / jedności):
  7 + 5 = 12
  digit = 2, carry = 1
  Result: 2

Position 2 (tens / dziesiątki):
  1 + 9 + 1 (carry) = 11
  digit = 1, carry = 1
  Result: 2 -> 1

Position 3 (hundreds / setki):
  6 + 2 + 1 (carry) = 9
  digit = 9, carry = 0
  Result: 2 -> 1 -> 9

Final: 2 -> 1 -> 9 (represents 912)
```

### Implementation / Implementacja

```javascript
function sumListsReverse(l1, l2) {
  let dummyHead = new Node(0); // Dummy node / Węzeł dummy
  let current = dummyHead;
  let carry = 0; // Carry from addition / Przeniesienie z dodawania

  // Continue while there are nodes or carry
  // Kontynuuj gdy są węzły lub przeniesienie
  while (l1 || l2 || carry) {
    // Get values (0 if null) / Pobierz wartości (0 jeśli null)
    const val1 = l1 ? l1.data : 0;
    const val2 = l2 ? l2.data : 0;

    // Calculate sum / Oblicz sumę
    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10); // New carry / Nowe przeniesienie
    const digit = sum % 10;        // Current digit / Obecna cyfra

    // Create new node / Utwórz nowy węzeł
    current.next = new Node(digit);
    current = current.next;

    // Move to next nodes / Przejdź do następnych węzłów
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummyHead.next; // Skip dummy / Pomiń dummy
}
```

### Key Points / Kluczowe Punkty

1. **Dummy head** simplifies code - no special case for first node
   **Dummy head** upraszcza kod - brak specjalnego przypadku dla pierwszego węzła

2. **Carry handling** is automatic - just like manual addition
   **Obsługa przeniesienia** jest automatyczna - jak przy ręcznym dodawaniu

3. **Different lengths** are handled by treating missing nodes as 0
   **Różne długości** są obsługiwane przez traktowanie brakujących węzłów jako 0

4. **Final carry** might create an extra digit (e.g., 99 + 1 = 100)
   **Końcowe przeniesienie** może utworzyć dodatkową cyfrę (np. 99 + 1 = 100)

---

## Solution Part 2: Forward Order / Rozwiązanie Część 2: Normalna Kolejność

### Approach 1: Reverse, Add, Reverse
### Podejście 1: Odwróć, Dodaj, Odwróć

The simplest approach: convert to reverse order, use Part 1 solution, convert back!
Najprostsze podejście: konwertuj do odwróconej kolejności, użyj rozwiązania z części 1, konwertuj z powrotem!

```javascript
function sumListsForward(l1, l2) {
  // Step 1: Reverse both lists / Krok 1: Odwróć obie listy
  const rev1 = reverseList(l1);
  const rev2 = reverseList(l2);

  // Step 2: Add reversed lists / Krok 2: Dodaj odwrócone listy
  const revSum = sumListsReverse(rev1, rev2);

  // Step 3: Reverse result / Krok 3: Odwróć wynik
  return reverseList(revSum);
}

function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}
```

**Time:** O(n + m) - three linear passes
**Space:** O(max(n, m)) - for result list

### Approach 2: Recursive (More Elegant)
### Podejście 2: Rekurencyjne (Bardziej Eleganckie)

Use recursion to process from right to left without reversing!
Użyj rekurencji aby przetwarzać od prawej do lewej bez odwracania!

```javascript
function sumListsForwardRecursive(l1, l2) {
  // First, pad shorter list with zeros / Najpierw dopełnij krótszą listę zerami
  const len1 = getLength(l1);
  const len2 = getLength(l2);

  if (len1 < len2) {
    l1 = padList(l1, len2 - len1);
  } else if (len2 < len1) {
    l2 = padList(l2, len1 - len2);
  }

  // Add recursively / Dodaj rekurencyjnie
  const result = addListsHelper(l1, l2);

  // Handle final carry / Obsłuż końcowe przeniesienie
  if (result.carry > 0) {
    const newNode = new Node(result.carry);
    newNode.next = result.sum;
    return newNode;
  }

  return result.sum;
}

function addListsHelper(l1, l2) {
  // Base case / Przypadek bazowy
  if (!l1 && !l2) {
    return { sum: null, carry: 0 };
  }

  // Recursively add rest / Rekurencyjnie dodaj resztę
  const result = addListsHelper(l1.next, l2.next);

  // Add current digits plus carry / Dodaj obecne cyfry plus przeniesienie
  const sum = l1.data + l2.data + result.carry;
  const digit = sum % 10;
  const carry = Math.floor(sum / 10);

  // Create node / Utwórz węzeł
  const node = new Node(digit);
  node.next = result.sum;

  return { sum: node, carry: carry };
}
```

**Why padding?** Lists must be same length for recursion to work correctly.
**Dlaczego dopełnianie?** Listy muszą mieć tę samą długość aby rekurencja działała poprawnie.

```
Example / Przykład:
  99 → 0 -> 9 -> 9
+ 1  → 0 -> 0 -> 1
     (padded / dopełnione)
```

---

## Detailed Walkthrough / Szczegółowe Przejście

### Example: 617 + 295 (Forward Order)
### Przykład: 617 + 295 (Normalna Kolejność)

**Using Recursive Approach:**

```
Lists (after padding if needed):
L1: 6 -> 1 -> 7
L2: 2 -> 9 -> 5

Recursion tree / Drzewo rekurencji:

addHelper(6,2)
  ├─ addHelper(1,9)
  │   ├─ addHelper(7,5)
  │   │   ├─ addHelper(null,null)
  │   │   │   └─ return {sum: null, carry: 0}
  │   │   ├─ sum = 7+5+0 = 12
  │   │   ├─ digit = 2, carry = 1
  │   │   └─ return {sum: 2, carry: 1}
  │   ├─ sum = 1+9+1 = 11
  │   ├─ digit = 1, carry = 1
  │   ├─ node: 1 -> 2
  │   └─ return {sum: 1->2, carry: 1}
  ├─ sum = 6+2+1 = 9
  ├─ digit = 9, carry = 0
  ├─ node: 9 -> 1 -> 2
  └─ return {sum: 9->1->2, carry: 0}

Final result: 9 -> 1 -> 2 (represents 912)
```

---

## Comparison of Approaches / Porównanie Podejść

### Forward Order Solutions

| Approach / Podejście | Time / Czas | Space / Pamięć | Pros / Zalety | Cons / Wady |
|---|---|---|---|---|
| Reverse-Add-Reverse | O(n+m) | O(max(n,m)) | Simple, reuses Part 1 / Proste, używa części 1 | Modifies input / Modyfikuje wejście |
| Recursive | O(n+m) | O(max(n,m)) | Elegant, doesn't modify input / Eleganckie, nie modyfikuje wejścia | More complex, recursion overhead / Bardziej złożone, narzut rekurencji |
| Stack-based | O(n+m) | O(n+m) | Iterative alternative / Iteracyjna alternatywa | Extra space for stacks / Dodatkowa przestrzeń dla stosów |

---

## Complexity Analysis / Analiza Złożoności

### Reverse Order / Odwrócona Kolejność

**Time Complexity:** O(n + m)
- n = length of first list / długość pierwszej listy
- m = length of second list / długość drugiej listy
- Single pass through both lists / Jedno przejście przez obie listy

**Space Complexity:** O(max(n, m))
- Result list length / Długość listy wynikowej
- Could be max(n,m) or max(n,m)+1 if final carry / Może być max(n,m) lub max(n,m)+1 jeśli końcowe przeniesienie

### Forward Order / Normalna Kolejność

**Time Complexity:** O(n + m)
- Reverse approach: 3 linear passes / Podejście odwracania: 3 liniowe przejścia
- Recursive: single pass with recursion / Rekurencyjne: jedno przejście z rekurencją

**Space Complexity:** O(max(n, m))
- Result list / Lista wynikowa
- Recursive: also recursion stack / Rekurencyjne: także stos rekurencji

---

## Edge Cases / Przypadki Brzegowe

### 1. Different Lengths / Różne Długości
```javascript
99 + 1 = 100
(9->9) + (1) = (0->0->1) or (1->0->0) depending on order
```

### 2. Carry Propagation / Propagacja Przeniesienia
```javascript
999 + 1 = 1000
Carry propagates through entire number
Przeniesienie propaguje przez całą liczbę
```

### 3. Zero / Zero
```javascript
0 + 0 = 0
(0) + (0) = (0)
```

### 4. One Null List / Jedna Pusta Lista
```javascript
null + 123 = 123
Treat null as 0 / Traktuj null jako 0
```

### 5. Single Digit Sum > 9
```javascript
5 + 7 = 12
(5) + (7) = (2->1) in reverse
(5) + (7) = (1->2) in forward
```

### 6. Large Numbers / Duże Liczby
```javascript
12345 + 6789 = 19134
Works for any length / Działa dla dowolnej długości
```

---

## Common Mistakes / Częste Błędy

### 1. Forgetting Final Carry
```javascript
// ❌ WRONG
while (l1 || l2) {  // Missing carry check / Brak sprawdzenia przeniesienia
  ...
}

// ✅ CORRECT
while (l1 || l2 || carry) {  // Include carry / Uwzględnij przeniesienie
  ...
}
```

### 2. Not Handling Null Nodes
```javascript
// ❌ WRONG
const sum = l1.data + l2.data;  // Crashes if null / Zawiesza się jeśli null

// ✅ CORRECT
const val1 = l1 ? l1.data : 0;
const val2 = l2 ? l2.data : 0;
```

### 3. Wrong Carry Calculation
```javascript
// ❌ WRONG
carry = sum / 10;  // Gives float! / Daje float!

// ✅ CORRECT
carry = Math.floor(sum / 10);  // Integer division / Dzielenie całkowite
```

### 4. Forgetting Dummy Head
```javascript
// ❌ WRONG - Complex special cases / Złożone specjalne przypadki
if (!head) {
  head = new Node(digit);
} else {
  current.next = new Node(digit);
}

// ✅ CORRECT - Uniform operation / Jednolita operacja
dummyHead = new Node(0);
current = dummyHead;
// ...
return dummyHead.next;
```

### 5. Modifying Input Lists (if not allowed)
```javascript
// ❌ WRONG if inputs shouldn't be modified
// Źle jeśli nie powinniśmy modyfikować wejść
const rev1 = reverseList(l1);  // Modifies l1!

// ✅ CORRECT - Clone first / Sklonuj najpierw
const clone1 = cloneList(l1);
const rev1 = reverseList(clone1);
```

---

## Interview Tips / Wskazówki do Rozmowy Kwalifikacyjnej

### 1. Start with Reverse Order
"I'll start with the reverse order version since it's more straightforward - it mimics how we add numbers by hand."

### 2. Explain Carry Logic
"The key is tracking the carry. Each position: digit = (val1 + val2 + carry) % 10, and new carry = floor((val1 + val2 + carry) / 10)."

### 3. Clarify Requirements
- "Can I modify the input lists?"
  "Czy mogę modyfikować listy wejściowe?"
- "Should I handle negative numbers?"
  "Czy powinienem obsługiwać liczby ujemne?"
- "What if one list is much longer?"
  "Co jeśli jedna lista jest znacznie dłuższa?"

### 4. Discuss Trade-offs
"For forward order, I can reverse-add-reverse (simpler) or use recursion (more elegant but uses stack space)."

### 5. Optimize
"If lists are very long, we might want to avoid recursion to prevent stack overflow."

---

## Related Problems / Powiązane Problemy

1. **Add Two Numbers** (LeetCode 2) - Exact same problem (reverse order)
   **Dodaj Dwie Liczby** - Dokładnie to samo zadanie

2. **Add Two Numbers II** (LeetCode 445) - Forward order variant
   **Dodaj Dwie Liczby II** - Wariant w normalnej kolejności

3. **Multiply Strings** - Similar digit-by-digit operation
   **Mnożenie Ciągów** - Podobna operacja cyfra po cyfrze

4. **Plus One** - Adding 1 to a number in array form
   **Plus Jeden** - Dodawanie 1 do liczby w formie tablicy

---

## Testing the Solution / Testowanie Rozwiązania

Run the solution file to see comprehensive test cases:
Uruchom plik rozwiązania aby zobaczyć kompleksowe testy:

```bash
node solution.js
```

The tests include:
Testy zawierają:
- ✅ Basic addition (617 + 295) / Podstawowe dodawanie
- ✅ Different lengths (99 + 1) / Różne długości
- ✅ Carry propagation (999 + 1) / Propagacja przeniesienia
- ✅ Zero cases / Przypadki zera
- ✅ Both reverse and forward order / Obie kolejności
- ✅ Recursive approach / Podejście rekurencyjne
- ✅ Edge cases (null, single digit) / Przypadki brzegowe
- ✅ Large numbers / Duże liczby

---

## Key Takeaways / Kluczowe Wnioski

1. **Reverse Order is Natural** / **Odwrócona Kolejność Jest Naturalna**
   - Matches manual addition / Odpowiada ręcznemu dodawaniu
   - Process left-to-right with carry / Przetwarzaj od lewej do prawej z przeniesieniem

2. **Carry is Critical** / **Przeniesienie Jest Krytyczne**
   - Must check carry even after lists end / Trzeba sprawdzić przeniesienie nawet po zakończeniu list
   - Can create extra digit / Może utworzyć dodatkową cyfrę

3. **Forward Order Requires Creativity** / **Normalna Kolejność Wymaga Kreatywności**
   - Reverse-add-reverse: simple but modifies input / Odwróć-dodaj-odwróć: proste ale modyfikuje wejście
   - Recursion: elegant but uses stack / Rekurencja: elegancka ale używa stosu

4. **Dummy Heads Simplify Code** / **Węzły Dummy Upraszczają Kod**
   - Avoid special cases / Unikaj specjalnych przypadków
   - Consistent node operations / Spójne operacje na węzłach

5. **Handle Different Lengths Gracefully** / **Obsługuj Różne Długości Gracznie**
   - Treat missing nodes as 0 / Traktuj brakujące węzły jako 0
   - Or pad with zeros for recursion / Lub dopełnij zerami dla rekurencji

---

**Time Complexity:** O(n + m) for both variants
**Space Complexity:** O(max(n, m)) for result
**Difficulty:** Medium / Średni
