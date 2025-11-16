

Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)
: 

Return Kth to Last: Implement an algorithm to find the kth to last element of a singly linked list.


================


# Return Kth to Last Element - Singly Linked List
*Zwróć K-ty element od końca - Jednokierunkowa lista łączona*

## Problem Understanding | Zrozumienie problemu

We need to find the kth element from the end of a singly linked list.
*Musimy znaleźć k-ty element od końca jednokierunkowej listy łączonej.*

For example: `1 -> 2 -> 3 -> 4 -> 5`, k=2 returns `4`
*Na przykład: `1 -> 2 -> 3 -> 4 -> 5`, k=2 zwraca `4`*

## Solutions | Rozwiązania

### Approach 1: Two-Pass Solution (Using Length) | Podejście 1: Rozwiązanie dwuprzebiegowe (używając długości)

**Time: O(n) | Space: O(1)**

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function kthToLast(head, k) {
  // First pass: calculate length | Pierwszy przebieg: oblicz długość
  let length = 0;
  let current = head;
  
  while (current !== null) {
    length++;
    current = current.next;
  }
  
  // Edge case: k is larger than length | Przypadek brzegowy: k jest większe niż długość
  if (k > length || k < 1) {
    return null;
  }
  
  // Second pass: find the (length - k)th node | Drugi przebieg: znajdź (length - k)-ty węzeł
  current = head;
  let targetIndex = length - k;
  
  for (let i = 0; i < targetIndex; i++) {
    current = current.next;
  }
  
  return current; // or current.value
}
```

**Explanation | Wyjaśnienie:**
- Count total nodes, then navigate to position (length - k)
  *Policz wszystkie węzły, następnie przejdź do pozycji (length - k)*

### Approach 2: Two Pointers (Runner Technique) ⭐ **OPTIMAL** | Podejście 2: Dwa wskaźniki (Technika biegacza)

**Time: O(n) | Space: O(1)**

```javascript
function kthToLastOptimal(head, k) {
  // Initialize two pointers | Zainicjuj dwa wskaźniki
  let fast = head;
  let slow = head;
  
  // Move fast pointer k steps ahead | Przesuń szybki wskaźnik o k kroków do przodu
  for (let i = 0; i < k; i++) {
    if (fast === null) {
      return null; // k is larger than list length | k jest większe niż długość listy
    }
    fast = fast.next;
  }
  
  // Move both pointers until fast reaches end | Przesuń oba wskaźniki aż fast osiągnie koniec
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  
  return slow; // slow is now kth to last | slow jest teraz k-tym od końca
}
```

**How it works | Jak to działa:**
1. Fast pointer moves k steps ahead | Szybki wskaźnik przesuwa się o k kroków do przodu
2. Both pointers move together until fast reaches end | Oba wskaźniki przesuwają się razem aż fast osiągnie koniec
3. Slow pointer is now at kth to last position | Powolny wskaźnik jest teraz na k-tej pozycji od końca

### Approach 3: Recursive Solution | Podejście 3: Rozwiązanie rekurencyjne

**Time: O(n) | Space: O(n) due to call stack | ze względu na stos wywołań**

```javascript
function kthToLastRecursive(head, k) {
  // Helper function returns index from end | Funkcja pomocnicza zwraca indeks od końca
  function helper(node) {
    if (node === null) {
      return 0;
    }
    
    let index = helper(node.next) + 1;
    
    if (index === k) {
      console.log(`Found: ${node.value}`); // or store in outer variable | lub zapisz w zmiennej zewnętrznej
    }
    
    return index;
  }
  
  helper(head);
}

// Alternative: returning the node | Alternatywnie: zwracanie węzła
function kthToLastRecursiveReturn(head, k) {
  let result = { node: null };
  
  function helper(node, k, result) {
    if (node === null) {
      return 0;
    }
    
    let index = helper(node.next, k, result) + 1;
    
    if (index === k) {
      result.node = node;
    }
    
    return index;
  }
  
  helper(head, k, result);
  return result.node;
}
```

## Complete Test Example | Kompletny przykład testowy

```javascript
// Helper to create list | Pomocnik do tworzenia listy
function createList(values) {
  if (values.length === 0) return null;
  
  let head = new Node(values[0]);
  let current = head;
  
  for (let i = 1; i < values.length; i++) {
    current.next = new Node(values[i]);
    current = current.next;
  }
  
  return head;
}

// Helper to print list | Pomocnik do wyświetlania listy
function printList(head) {
  let values = [];
  let current = head;
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  console.log(values.join(' -> '));
}

// Test cases | Przypadki testowe
let list = createList([1, 2, 3, 4, 5]);
printList(list); // 1 -> 2 -> 3 -> 4 -> 5

console.log(kthToLastOptimal(list, 2).value); // 4 (2nd from end | 2-gi od końca)
console.log(kthToLastOptimal(list, 1).value); // 5 (last | ostatni)
console.log(kthToLastOptimal(list, 5).value); // 1 (first | pierwszy)
console.log(kthToLastOptimal(list, 6));        // null (out of bounds | poza zakresem)
```

## Complexity Comparison | Porównanie złożoności

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Two-pass | O(n) | O(1) | Simple but requires two passes \| Proste ale wymaga dwóch przebiegów |
| Two pointers ⭐ | O(n) | O(1) | **Best solution** - one pass \| **Najlepsze rozwiązanie** - jeden przebieg |
| Recursive | O(n) | O(n) | Elegant but uses stack space \| Eleganckie ale używa pamięci stosu |

## Key Edge Cases | Kluczowe przypadki brzegowe

```javascript
// Empty list | Pusta lista
kthToLastOptimal(null, 1); // null

// k larger than length | k większe niż długość
kthToLastOptimal(createList([1, 2]), 5); // null

// k = 0 or negative | k = 0 lub ujemne
kthToLastOptimal(createList([1, 2, 3]), 0); // null

// Single node | Jeden węzeł
kthToLastOptimal(createList([1]), 1); // Node(1)
```

## Interview Tips | Wskazówki do rozmowy kwalifikacyjnej

1. **Clarify requirements** | **Wyjaśnij wymagania**: Is k=1 the last element or k=0? | Czy k=1 to ostatni element czy k=0?
2. **Two-pointer technique is optimal** | **Technika dwóch wskaźników jest optymalna**
3. **Handle edge cases** | **Obsłuż przypadki brzegowe**: null list, k out of bounds | pusta lista, k poza zakresem
4. **Ask about return value** | **Zapytaj o wartość zwracaną**: node or value? | węzeł czy wartość?



-------------


# Approach 3: Recursive Solution - Szczegółowe Wyjaśnienie
*Podejście 3: Rozwiązanie rekurencyjne - Detailed Explanation*

## Jak działa rekursja? | How does recursion work?

The recursive solution works backwards from the end of the list.
*Rozwiązanie rekurencyjne działa od tyłu, od końca listy.*

### Key Idea | Kluczowa idea

**The recursion "unwinds" from the end, counting positions backwards.**
*Rekursja "rozwija się" od końca, licząc pozycje wstecz.*

## Step-by-Step Example | Przykład krok po kroku

Given list: `1 -> 2 -> 3 -> 4 -> 5`, find k=2
*Dana lista: `1 -> 2 -> 3 -> 4 -> 5`, znajdź k=2*

```javascript
function kthToLastRecursive(head, k) {
  function helper(node) {
    // Base case: reached end of list | Przypadek bazowy: osiągnięto koniec listy
    if (node === null) {
      return 0; // Return index 0 at the end | Zwróć indeks 0 na końcu
    }
    
    // Recursive call: go deeper | Wywołanie rekurencyjne: idź głębiej
    let index = helper(node.next) + 1;
    
    // Check if this is the kth element | Sprawdź czy to jest k-ty element
    if (index === k) {
      console.log(`Found: ${node.value}`);
    }
    
    // Return index to previous call | Zwróć indeks do poprzedniego wywołania
    return index;
  }
  
  helper(head);
}
```

### Execution Flow | Przepływ wykonania

```
GOING DOWN (recursive calls) | SCHODZENIE W DÓŁ (wywołania rekurencyjne)
=============================

helper(1) calls | wywołuje
  ↓
helper(2) calls | wywołuje
  ↓
helper(3) calls | wywołuje
  ↓
helper(4) calls | wywołuje
  ↓
helper(5) calls | wywołuje
  ↓
helper(null) → returns 0 | zwraca 0


COMING BACK UP (unwinding) | WRACANIE DO GÓRY (rozwijanie)
===========================

helper(null) → returns 0
  ↑
helper(5): index = 0 + 1 = 1 → returns 1 | zwraca 1
  ↑          (This is 1st from end | To jest 1-szy od końca)
helper(4): index = 1 + 1 = 2 → returns 2 | zwraca 2
  ↑          (This is 2nd from end | To jest 2-gi od końca) ✓ FOUND! | ZNALEZIONO!
helper(3): index = 2 + 1 = 3 → returns 3 | zwraca 3
  ↑          (This is 3rd from end | To jest 3-ci od końca)
helper(2): index = 3 + 1 = 4 → returns 4 | zwraca 4
  ↑          (This is 4th from end | To jest 4-ty od końca)
helper(1): index = 4 + 1 = 5 → returns 5 | zwraca 5
             (This is 5th from end | To jest 5-ty od końca)
```

## Visual Call Stack | Wizualizacja stosu wywołań

```javascript
// List: 1 -> 2 -> 3 -> 4 -> 5, k=2
// Lista: 1 -> 2 -> 3 -> 4 -> 5, k=2

/*
CALL STACK GROWTH | WZROST STOSU WYWOŁAŃ:
=====================================

helper(1)
  helper(2)
    helper(3)
      helper(4)
        helper(5)
          helper(null) → return 0
        ← index=1
      ← index=2  ✓ (k=2, MATCH! | PASUJE!)
    ← index=3
  ← index=4
← index=5
*/
```

## Version 2: Returning the Node | Wersja 2: Zwracanie węzła

```javascript
function kthToLastRecursiveReturn(head, k) {
  // Object to store result | Obiekt do przechowywania wyniku
  let result = { node: null };
  
  function helper(node, k, result) {
    // Base case | Przypadek bazowy
    if (node === null) {
      return 0;
    }
    
    // Recursive call | Wywołanie rekurencyjne
    let index = helper(node.next, k, result) + 1;
    
    // Store the node when we find it | Zapisz węzeł gdy go znajdziemy
    if (index === k) {
      result.node = node;
    }
    
    return index;
  }
  
  helper(head, k, result);
  return result.node;
}
```

### Why use an object? | Dlaczego używamy obiektu?

**Objects are passed by reference in JavaScript.**
*Obiekty są przekazywane przez referencję w JavaScript.*

```javascript
// This allows us to modify the result from deep in the recursion
// To pozwala nam modyfikować wynik z głęboko w rekursji

let result = { node: null };  // Created once | Utworzony raz

// All recursive calls share the same object
// Wszystkie wywołania rekurencyjne dzielą ten sam obiekt

helper(node1, k, result);  // Same object | Ten sam obiekt
  helper(node2, k, result);  // Same object | Ten sam obiekt
    helper(node3, k, result);  // Same object | Ten sam obiekt
      // When we find k, we update result.node
      // Gdy znajdziemy k, aktualizujemy result.node
```

## Complete Working Example | Kompletny działający przykład

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function kthToLastRecursive(head, k) {
  let result = { node: null, index: 0 };
  
  function helper(node) {
    if (node === null) {
      return 0;
    }
    
    // Go to the end first | Idź najpierw na koniec
    let index = helper(node.next) + 1;
    
    console.log(`Node: ${node.value}, Index from end: ${index}`);
    // Węzeł: ${node.value}, Indeks od końca: ${index}
    
    if (index === k) {
      result.node = node;
      result.index = index;
    }
    
    return index;
  }
  
  helper(head);
  return result.node;
}

// Test | Test
let list = new Node(1);
list.next = new Node(2);
list.next.next = new Node(3);
list.next.next.next = new Node(4);
list.next.next.next.next = new Node(5);

console.log("\nFinding k=2 | Szukanie k=2:");
let result = kthToLastRecursive(list, 2);
console.log(`Result: ${result.value}`); // 4

/* OUTPUT | WYJŚCIE:
Node: 5, Index from end: 1
Node: 4, Index from end: 2  ← This is returned | To jest zwrócone
Node: 3, Index from end: 3
Node: 2, Index from end: 4
Node: 1, Index from end: 5
Result: 4
*/
```

## Advantages vs Disadvantages | Zalety vs Wady

### ✅ Advantages | Zalety:

1. **Elegant and concise code** | **Elegancki i zwięzły kod**
2. **Only one pass through the list** | **Tylko jeden przebieg przez listę**
3. **Easy to understand the logic** | **Łatwa do zrozumienia logika**

### ❌ Disadvantages | Wady:

1. **O(n) space complexity due to call stack** | **O(n) złożoność pamięciowa przez stos wywołań**
   - Each recursive call takes memory | Każde wywołanie rekurencyjne zajmuje pamięć
   - Risk of stack overflow for very long lists | Ryzyko przepełnienia stosu dla bardzo długich list

2. **Not tail-recursive** | **Nie jest rekursją ogonową**
   - Can't be optimized by compiler | Nie może być zoptymalizowane przez kompilator

## Alternative: Counter Class Approach | Alternatywa: Podejście z klasą licznika

```javascript
function kthToLastWithCounter(head, k) {
  class Counter {
    constructor() {
      this.count = 0;
    }
  }
  
  let counter = new Counter();
  
  function helper(node, counter) {
    if (node === null) {
      return null;
    }
    
    // Recursive call first | Najpierw wywołanie rekurencyjne
    let result = helper(node.next, counter);
    
    // Increment counter on the way back | Zwiększ licznik w drodze powrotnej
    counter.count++;
    
    // Check if this is the kth element | Sprawdź czy to k-ty element
    if (counter.count === k) {
      return node;
    }
    
    return result;
  }
  
  return helper(head, counter);
}
```

## Interview Discussion Points | Punkty do dyskusji na rozmowie

**Interviewer: "Why use recursion here?"**
*Rekruter: "Dlaczego używać rekursji tutaj?"*

**Your answer | Twoja odpowiedź:**
- "Recursion naturally reaches the end of the list first, then counts backwards"
  *"Rekursja naturalnie osiąga najpierw koniec listy, potem liczy wstecz"*
- "However, I'd prefer the two-pointer approach for production code due to O(1) space"
  *"Jednak wolałbym podejście dwóch wskaźników dla kodu produkcyjnego ze względu na O(1) pamięć"*

**When is recursion better? | Kiedy rekursja jest lepsza?**
- When the list is guaranteed to be short | Gdy lista jest gwarantowanie krótka
- When code readability is more important than space | Gdy czytelność kodu jest ważniejsza niż pamięć
- For educational purposes | Do celów edukacyjnych