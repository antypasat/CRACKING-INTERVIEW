# 2.3 Delete Middle Node

## Original Problem / Oryginalne Zadanie

**Delete Middle Node:** Implement an algorithm to delete a node in the middle (i.e., any node but the first and last node, not necessarily the exact middle) of a singly linked list, given only access to that node.

**EXAMPLE**
```
Input:  the node c from the linked list a->b->c->d->e->f
Result: nothing is returned, but the new linked list looks like a->b->d->e->f
```

Hints: #72

---

## Understanding the Problem / Zrozumienie Problemu

This is a **trick question** that tests your understanding of how linked lists work at a fundamental level.
To jest **pytanie podchwytliwe**, które sprawdza twoje zrozumienie jak działają listy połączone na podstawowym poziomie.

### The Challenge / Wyzwanie

Normally, to delete a node from a linked list, you need access to the **previous node** so you can update its `next` pointer to skip the node being deleted.
Normalnie, aby usunąć węzeł z listy połączonej, potrzebujesz dostępu do **poprzedniego węzła**, aby móc zaktualizować jego wskaźnik `next` i pominąć usuwany węzeł.

```javascript
// Normal deletion / Normalne usunięcie
previous.next = nodeToDelete.next;
```

**But in this problem**, you're only given the node to delete, NOT the head of the list!
**Ale w tym problemie**, dostajesz tylko węzeł do usunięcia, NIE głowę listy!

### The Insight / Kluczowa Obserwacja

Since we can't access the previous node, we **can't actually delete the given node**. But we can make it look like we did!
Ponieważ nie mamy dostępu do poprzedniego węzła, **nie możemy faktycznie usunąć danego węzła**. Ale możemy sprawić, że będzie to wyglądało jak byśmy to zrobili!

**The trick:** Copy the data from the next node into the current node, then delete the next node!
**Sztuczka:** Skopiuj dane z następnego węzła do obecnego węzła, a następnie usuń następny węzeł!

---

## Solution Approach / Podejście do Rozwiązania

### Visual Explanation / Wyjaśnienie Wizualne

Let's say we want to delete node `c`:
Powiedzmy, że chcemy usunąć węzeł `c`:

```
Original / Oryginał:
a -> b -> c -> d -> e -> f
          ↑
      (delete this / usuń to)

Step 1: Copy data from next node (d) to current node (c)
Krok 1: Kopiuj dane z następnego węzła (d) do obecnego węzła (c)

a -> b -> d -> d -> e -> f
          ↑    ↑
       (now c   (original d
        has 'd')  oryginał d)

Step 2: Skip the next node
Krok 2: Pomiń następny węzeł

a -> b -> d -----> e -> f
          ↑
     (looks like we deleted 'c'!
      wygląda jakbyśmy usunęli 'c'!)
```

### Implementation / Implementacja

```javascript
class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

function deleteMiddleNode(node) {
  // Edge case: If node is null or it's the last node, we can't delete it
  // Przypadek brzegowy: Jeśli węzeł jest null lub to ostatni węzeł, nie możemy go usunąć
  if (!node || !node.next) {
    return false; // Cannot delete / Nie można usunąć
  }

  // Step 1: Copy data from next node to current node
  // Krok 1: Kopiuj dane z następnego węzła do obecnego węzła
  node.data = node.next.data;

  // Step 2: Skip the next node (effectively deleting it)
  // Krok 2: Pomiń następny węzeł (efektywnie go usuwając)
  node.next = node.next.next;

  return true; // Successfully "deleted" the node / Pomyślnie "usunięto" węzeł
}
```

---

## Detailed Explanation / Szczegółowe Wyjaśnienie

### Why This Works / Dlaczego To Działa

The key insight is that **the identity of a node doesn't matter** - what matters is its data and position in the list.
Kluczowa obserwacja jest taka, że **tożsamość węzła nie ma znaczenia** - liczy się jego dane i pozycja w liście.

When we:
Gdy:
1. Copy the next node's data to the current node
   Kopiujemy dane następnego węzła do obecnego węzła
2. Skip the next node
   Pomijamy następny węzeł

We effectively make the current node "become" the next node, and the next node disappears from the list.
Efektywnie sprawiamy, że obecny węzeł "staje się" następnym węzłem, a następny węzeł znika z listy.

### Step-by-Step Example / Przykład Krok Po Kroku

```javascript
// Starting list: a -> b -> c -> d -> e -> f
// Want to delete: c

// Given: nodeToDelete = c
// c.data = 'c'
// c.next = d

// Step 1: c.data = c.next.data
// Now: c.data = 'd' (but it's still the same node object!)
// List looks like: a -> b -> d -> d -> e -> f
//                             ↑    ↑
//                           same  original
//                           node  next node

// Step 2: c.next = c.next.next
// Now: c.next points to e (skipping the old d)
// List looks like: a -> b -> d -> e -> f
// The old 'd' node is now orphaned and will be garbage collected
// Stary węzeł 'd' jest teraz osierocony i zostanie usunięty przez garbage collector
```

---

## Complexity Analysis / Analiza Złożoności

### Time Complexity / Złożoność Czasowa: **O(1)**
- We perform only constant-time operations / Wykonujemy tylko operacje w stałym czasie
- One data copy / Jedno kopiowanie danych
- One pointer update / Jedna aktualizacja wskaźnika
- No loops or recursion / Brak pętli czy rekurencji

### Space Complexity / Złożoność Pamięciowa: **O(1)**
- We don't allocate any new nodes / Nie alokujemy żadnych nowych węzłów
- We only modify existing pointers / Tylko modyfikujemy istniejące wskaźniki
- No additional data structures / Brak dodatkowych struktur danych

---

## Limitations and Edge Cases / Ograniczenia i Przypadki Brzegowe

### Cannot Delete the Last Node / Nie Można Usunąć Ostatniego Węzła

```javascript
// List: 1 -> 2 -> 3 -> 4 -> 5
//                         ↑
//                   (last node / ostatni węzeł)

// If we try to delete node 5:
// Jeśli spróbujemy usunąć węzeł 5:
deleteMiddleNode(node5); // Returns false / Zwraca false

// Why? Because there's no next node to copy from!
// Dlaczego? Bo nie ma następnego węzła z którego można skopiować!
```

**Solution:** The problem states "any node but the first and last node", so this is an acceptable limitation.
**Rozwiązanie:** Problem mówi "dowolny węzeł oprócz pierwszego i ostatniego", więc to jest akceptowalne ograniczenie.

### What About Data Type Issues? / Co z Problemami Typów Danych?

If nodes contain complex objects, this solution still works because we're copying the **reference** to the data, not the data itself.
Jeśli węzły zawierają złożone obiekty, to rozwiązanie nadal działa, bo kopiujemy **referencję** do danych, nie same dane.

```javascript
// Works with any data type / Działa z dowolnym typem danych
node.data = { name: 'John', age: 30 };  // Object / Obiekt
node.data = [1, 2, 3];                   // Array / Tablica
node.data = 'string';                    // String / Ciąg znaków
node.data = 42;                          // Number / Liczba
```

---

## Common Mistakes / Częste Błędy

### Mistake 1: Trying to Delete Without Checking next
### Błąd 1: Próba Usunięcia Bez Sprawdzenia next

```javascript
// WRONG / ŹLE
function deleteMiddleNode(node) {
  node.data = node.next.data;  // ❌ Crashes if node.next is null!
  node.next = node.next.next;
}

// CORRECT / DOBRZE
function deleteMiddleNode(node) {
  if (!node || !node.next) return false;  // ✅ Check first!
  node.data = node.next.data;
  node.next = node.next.next;
  return true;
}
```

### Mistake 2: Trying to "Really" Delete the Node
### Błąd 2: Próba "Prawdziwego" Usunięcia Węzła

```javascript
// WRONG - This doesn't help! / ŹLE - To nie pomaga!
function deleteMiddleNode(node) {
  node.data = node.next.data;
  node.next = node.next.next;
  node = null;  // ❌ This only affects the local variable!
                // To tylko wpływa na lokalną zmienną!
}
```

The caller still has a reference to the node, so setting `node = null` doesn't delete it.
Wywołujący nadal ma referencję do węzła, więc ustawienie `node = null` go nie usuwa.

---

## Interview Tips / Wskazówki do Rozmowy Kwalifikacyjnej

### 1. Clarify the Constraints / Wyjaśnij Ograniczenia
Ask: "Can I assume this node will never be the last node?"
Zapytaj: "Czy mogę założyć, że ten węzeł nigdy nie będzie ostatnim węzłem?"

### 2. Explain the Limitation / Wyjaśnij Ograniczenie
"This approach won't work for the last node because we need a next node to copy from."
"To podejście nie zadziała dla ostatniego węzła, bo potrzebujemy następnego węzła do skopiowania."

### 3. Discuss Alternative Approaches / Omów Alternatywne Podejścia
If you had access to the head:
Gdybyś miał dostęp do głowy:
```javascript
// Alternative with head access / Alternatywa z dostępem do głowy
function deleteNodeWithHead(head, nodeToDelete) {
  let current = head;
  while (current.next !== nodeToDelete) {
    current = current.next;
  }
  current.next = nodeToDelete.next;
}
// Time: O(n), Space: O(1)
```

### 4. Mention the Trick / Wspomnij o Sztuczce
"This is a classic trick question that tests understanding of how references work in linked lists."
"To klasyczne pytanie podchwytliwe, które sprawdza zrozumienie jak działają referencje w listach połączonych."

---

## Related Problems / Powiązane Problemy

1. **Remove Nth Node From End of List** - Similar concept but with head access
   **Usuń N-ty Węzeł od Końca** - Podobna koncepcja ale z dostępem do głowy

2. **Delete Node in a BST** - Similar "copy and delete" approach
   **Usuń Węzeł w BST** - Podobne podejście "kopiuj i usuń"

3. **Remove Linked List Elements** - Related deletion operations
   **Usuń Elementy Listy Połączonej** - Powiązane operacje usuwania

---

## Testing the Solution / Testowanie Rozwiązania

Run the solution file to see comprehensive test cases:
Uruchom plik rozwiązania aby zobaczyć kompleksowe testy:

```bash
node solution.js
```

The tests include:
Testy zawierają:
- ✅ Basic deletion from middle / Podstawowe usunięcie ze środka
- ✅ Delete second node / Usuń drugi węzeł
- ✅ Delete exact middle / Usuń dokładny środek
- ✅ Delete second-to-last / Usuń przedostatni
- ✅ Three-node list / Lista trzech węzłów
- ✅ Edge case: last node (should fail) / Przypadek brzegowy: ostatni węzeł (powinno się nie udać)
- ✅ Edge case: null node / Przypadek brzegowy: węzeł null
- ✅ Edge case: two-node list / Przypadek brzegowy: lista dwóch węzłów

---

## Key Takeaways / Kluczowe Wnioski

1. **Think Outside the Box** / **Myśl Nieszablonowo**
   - Sometimes you can't solve a problem directly / Czasami nie można rozwiązać problemu bezpośrednio
   - Look for creative workarounds / Szukaj kreatywnych obejść

2. **Understand References** / **Rozumiej Referencje**
   - Node identity vs. node data / Tożsamość węzła vs. dane węzła
   - What matters to the list structure / Co ma znaczenie dla struktury listy

3. **Know the Limitations** / **Znaj Ograniczenia**
   - This only works for middle nodes / To działa tylko dla środkowych węzłów
   - Can't delete last node without previous node / Nie można usunąć ostatniego węzła bez poprzedniego

4. **O(1) is Optimal** / **O(1) Jest Optymalne**
   - Can't do better than constant time / Nie można zrobić lepiej niż stały czas
   - No need to traverse the list / Nie trzeba przechodzić listy

---

**Time Complexity:** O(1)
**Space Complexity:** O(1)
**Difficulty:** Easy-Medium (trick question) / Łatwy-Średni (pytanie podchwytliwe)
