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
