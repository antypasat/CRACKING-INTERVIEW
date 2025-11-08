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
