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
  console.log(values.join(" -> "));
}

// Test cases | Przypadki testowe
let list = createList([1, 2, 3, 4, 5]);
printList(list); // 1 -> 2 -> 3 -> 4 -> 5

console.log(kthToLastOptimal(list, 2).value); // 4 (2nd from end | 2-gi od końca)
console.log(kthToLastOptimal(list, 1).value); // 5 (last | ostatni)
console.log(kthToLastOptimal(list, 5).value); // 1 (first | pierwszy)
console.log(kthToLastOptimal(list, 6)); // null (out of bounds | poza zakresem)
