function compressStringOptimized(str) {
  // Sprawdź długość przed kompresją
  // Check length before compression
  const finalLength = calculateCompressedLength(str);
  if (finalLength >= str.length) {
    return str;
  }

  // Buduj skompresowany string tylko jeśli będzie krótszy
  // Build compressed string only if it will be shorter
  let compressed = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (i + 1 < str.length && str[i] === str[i + 1]) {
      count++;
    } else {
      compressed += str[i] + count;
      count = 1;
    }
  }

  return compressed;
}

function calculateCompressedLength(str) {
  // Oblicz długość bez budowania stringa
  // Calculate length without building the string
  let compressedLength = 0;
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (i + 1 < str.length && str[i] === str[i + 1]) {
      count++;
    } else {
      compressedLength += 1 + count.toString().length;
      count = 1;
    }
  }

  return compressedLength;
}
