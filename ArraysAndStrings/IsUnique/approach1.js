function isUnique(str) {
  // Set automatically handles uniqueness
  return new Set(str).size === str.length;
}

// Alternative with early return
function isUniqueSet(str) {
  // Jeśli długość > 128 (ASCII) lub 256 (Extended ASCII),
  // musi być duplikat (Zasada Szufladkowa Dirichleta)
  // If length > 128 (ASCII) or 256 (Extended ASCII),
  // must have duplicate (Pigeonhole Principle)
  if (str.length > 128) return false;

  const seen = new Set();

  for (let char of str) {
    if (seen.has(char)) {
      return false;
    }
    seen.add(char);
  }

  return true;
}

console.log(isUnique("abcdef")); // true
console.log(isUnique("hello")); // false (dwa 'l' / two 'l's)
console.log(isUnique("")); // true (pusty string / empty string)
console.log(isUnique("a")); // true
console.log(isUnique("aA")); // true (rozróżnia wielkość liter / case sensitive)

console.log(isUniqueSet("abcdef")); // true
console.log(isUniqueSet("hello")); // false
