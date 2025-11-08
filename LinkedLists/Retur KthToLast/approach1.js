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
