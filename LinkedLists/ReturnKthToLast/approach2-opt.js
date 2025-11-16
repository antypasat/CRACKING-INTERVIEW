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
