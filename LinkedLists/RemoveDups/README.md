Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)

:

Remove Dups: Write code to remove duplicates from an unsorted linked list.
FOLLOW UP
How would you solve this problem if a temporary buffer is not allowed?

====================================

# Remove Duplicates from Unsorted Linked List
# Usuwanie duplikatów z nieposortowanej listy połączonej

I'll provide two solutions: one with a buffer and one without.
Przedstawię dwa rozwiązania: jedno z buforem i jedno bez.

## Solution 1: Using Hash Set (Temporary Buffer)
## Rozwiązanie 1: Używając Hash Set (Bufor tymczasowy)

**Time Complexity: O(n)** - We traverse the list once / Przechodzimy listę raz
**Space Complexity: O(n)** - Hash set stores unique values / Hash set przechowuje unikalne wartości

```javascript
class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

function removeDuplicates(head) {
  if (!head) return head; // Empty list / Pusta lista

  const seen = new Set(); // Track seen values / Śledzimy widziane wartości
  seen.add(head.data); // Add first node / Dodajemy pierwszy węzeł

  let current = head;

  while (current.next) {
    if (seen.has(current.next.data)) {
      // Duplicate found - skip this node / Znaleziono duplikat - pomijamy węzeł
      current.next = current.next.next;
    } else {
      // New value - add to set and move forward / Nowa wartość - dodajemy do set i idziemy dalej
      seen.add(current.next.data);
      current = current.next;
    }
  }

  return head;
}
```

**Example usage / Przykład użycia:**
```javascript
// Create list: 1 -> 2 -> 3 -> 2 -> 4 -> 1
// Tworzymy listę: 1 -> 2 -> 3 -> 2 -> 4 -> 1
const head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);
head.next.next.next = new Node(2);
head.next.next.next.next = new Node(4);
head.next.next.next.next.next = new Node(1);

removeDuplicates(head);
// Result: 1 -> 2 -> 3 -> 4
// Wynik: 1 -> 2 -> 3 -> 4
```

## Solution 2: Without Buffer (Two Pointers)
## Rozwiązanie 2: Bez bufora (Dwa wskaźniki)

**Time Complexity: O(n²)** - For each node, check all following nodes / Dla każdego węzła sprawdzamy wszystkie kolejne
**Space Complexity: O(1)** - No extra space needed / Nie potrzeba dodatkowej pamięci

```javascript
function removeDuplicatesNoBuffer(head) {
  if (!head) return head; // Empty list / Pusta lista

  let current = head;

  // For each node / Dla każdego węzła
  while (current) {
    let runner = current; // Runner checks nodes ahead / Runner sprawdza węzły dalej

    // Check all remaining nodes / Sprawdzamy wszystkie pozostałe węzły
    while (runner.next) {
      if (runner.next.data === current.data) {
        // Found duplicate - remove it / Znaleziono duplikat - usuwamy go
        runner.next = runner.next.next;
      } else {
        // Move to next node / Przechodzimy do następnego węzła
        runner = runner.next;
      }
    }

    current = current.next; // Move to next unique value / Przechodzimy do następnej unikalnej wartości
  }

  return head;
}
```

## Comparison / Porównanie

| Approach / Podejście | Time / Czas | Space / Pamięć | Best When / Najlepsze gdy |
|---|---|---|---|
| Hash Set | O(n) | O(n) | Performance matters / Wydajność ma znaczenie |
| Two Pointers / Dwa wskaźniki | O(n²) | O(1) | Memory constrained / Ograniczona pamięć |

## Key Concepts / Kluczowe koncepty

1. **Hash Set approach** uses extra memory for faster lookups
   **Podejście Hash Set** używa dodatkowej pamięci dla szybszych wyszukiwań

2. **Two pointers** trades time for space - slower but no extra memory
   **Dwa wskaźniki** wymienia czas na przestrzeń - wolniejsze ale bez dodatkowej pamięci

3. **In-place modification** - we modify the list structure directly
   **Modyfikacja w miejscu** - modyfikujemy strukturę listy bezpośrednio

4. **current.next = current.next.next** removes a node by skipping it
   **current.next = current.next.next** usuwa węzeł przez jego pominięcie
