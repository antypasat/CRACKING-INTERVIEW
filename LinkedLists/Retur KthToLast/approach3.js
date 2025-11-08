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
