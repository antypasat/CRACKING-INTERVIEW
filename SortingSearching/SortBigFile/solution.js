/**
 * Sort Big File - Sortowanie Dużego Pliku
 * UWAGA: To jest koncepcyjna implementacja w JavaScript.
 * W rzeczywistości używalibyśmy Node.js streams lub gotowych narzędzi.
 *
 * NOTE: This is a conceptual implementation in JavaScript.
 * In reality we would use Node.js streams or ready-made tools.
 */

/**
 * Min-Heap dla K-way merge
 * Min-Heap for K-way merge
 */
class MinHeap {
  constructor(compareFn = (a, b) => a.value.localeCompare(b.value)) {
    this.heap = [];
    this.compare = compareFn;
  }

  // Wstaw element do heap / Insert element into heap
  insert(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  // Wyciągnij najmniejszy element / Extract minimum element
  extractMin() {
    if (this.isEmpty()) return null;

    const min = this.heap[0];
    const last = this.heap.pop();

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return min;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }

      [this.heap[index], this.heap[parentIndex]] =
        [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length &&
          this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length &&
          this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] =
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }
}

/**
 * FAZA 1: Sortuje chunki danych
 * PHASE 1: Sorts data chunks
 *
 * W prawdziwej implementacji:
 * - Czytalibyśmy plik w kawałkach używając streams
 * - Każdy chunk byłby zapisywany do osobnego pliku
 *
 * In real implementation:
 * - We would read file in chunks using streams
 * - Each chunk would be saved to separate file
 */
function sortChunks(data, chunkSize) {
  console.log(`\n=== FAZA 1: Sortowanie chunków ===`);
  console.log(`Rozmiar danych: ${data.length} linii`);
  console.log(`Rozmiar chunka: ${chunkSize} linii`);

  const sortedChunks = [];
  const numChunks = Math.ceil(data.length / chunkSize);

  console.log(`Liczba chunków: ${numChunks}\n`);

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);

    // Wytnij chunk / Extract chunk
    const chunk = data.slice(start, end);

    console.log(`Chunk ${i + 1}:`);
    console.log(`  Przed sortowaniem: [${chunk.slice(0, 3).join(', ')}...]`);

    // Sortuj chunk w pamięci / Sort chunk in memory
    chunk.sort();

    console.log(`  Po sortowaniu: [${chunk.slice(0, 3).join(', ')}...]`);

    sortedChunks.push(chunk);
  }

  return sortedChunks;
}

/**
 * FAZA 2: K-way merge używając min-heap
 * PHASE 2: K-way merge using min-heap
 *
 * @param {string[][]} chunks - Tablica posortowanych chunków
 * @return {string[]} - Scalona posortowana tablica
 */
function kWayMerge(chunks) {
  console.log(`\n=== FAZA 2: K-way Merge ===`);
  console.log(`Liczba chunków do scalenia: ${chunks.length}\n`);

  const result = [];
  const minHeap = new MinHeap();

  // Wskaźniki dla każdego chunka - którą linię obecnie przetwarzamy
  // Pointers for each chunk - which line we're currently processing
  const pointers = new Array(chunks.length).fill(0);

  // Inicjalizuj heap pierwszym elementem z każdego chunka
  // Initialize heap with first element from each chunk
  chunks.forEach((chunk, chunkIndex) => {
    if (chunk.length > 0) {
      minHeap.insert({
        value: chunk[0],
        chunkIndex: chunkIndex
      });
      pointers[chunkIndex] = 1; // Następny do przetworzenia / Next to process
    }
  });

  console.log(`Heap zainicjalizowany z ${minHeap.size()} elementami`);

  let stepCount = 0;
  const maxStepsToShow = 10;

  // Scalaj wszystkie elementy / Merge all elements
  while (!minHeap.isEmpty()) {
    // Wyciągnij najmniejszy element / Extract smallest element
    const { value, chunkIndex } = minHeap.extractMin();
    result.push(value);

    // Pokaż kilka pierwszych kroków / Show first few steps
    if (stepCount < maxStepsToShow) {
      console.log(`Krok ${stepCount + 1}: Wyciągnięto '${value}' z chunka ${chunkIndex + 1}`);
    } else if (stepCount === maxStepsToShow) {
      console.log(`...kontynuacja scalania ${result.length - maxStepsToShow} pozostałych elementów...`);
    }

    // Załaduj następny element z tego samego chunka do heap
    // Load next element from same chunk into heap
    if (pointers[chunkIndex] < chunks[chunkIndex].length) {
      const nextValue = chunks[chunkIndex][pointers[chunkIndex]];
      minHeap.insert({
        value: nextValue,
        chunkIndex: chunkIndex
      });
      pointers[chunkIndex]++;
    }

    stepCount++;
  }

  console.log(`\nScalono łącznie ${result.length} elementów`);
  return result;
}

/**
 * Główna funkcja external sort
 * Main external sort function
 */
function externalSort(data, chunkSize) {
  console.log("========================================");
  console.log("EXTERNAL MERGE SORT - Symulacja");
  console.log("========================================");

  // Faza 1: Podziel i sortuj / Divide and sort
  const sortedChunks = sortChunks(data, chunkSize);

  // Faza 2: K-way merge / K-way merge
  const sortedData = kWayMerge(sortedChunks);

  console.log("\n========================================");
  console.log("SORTOWANIE ZAKOŃCZONE");
  console.log("========================================");

  return sortedData;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Mały przykład / Small example ===");
const data1 = ["zebra", "apple", "dog", "cat", "bird", "elephant", "ant", "bear"];
console.log("Dane oryginalne / Original data:", data1);
const sorted1 = externalSort([...data1], 3); // Chunki po 3 elementy
console.log("\nWynik / Result:", sorted1);
console.log("Czy poprawnie posortowane? / Correctly sorted?",
  JSON.stringify(sorted1) === JSON.stringify([...data1].sort()));
console.log();

console.log("=== Test 2: Większy przykład / Larger example ===");
const data2 = [
  "mango", "apple", "zebra", "cat", "dog", "elephant",
  "ant", "bear", "fox", "goat", "horse", "iguana",
  "jaguar", "kangaroo", "lion", "monkey"
];
console.log("Liczba elementów / Number of elements:", data2.length);
console.log("Rozmiar chunka / Chunk size: 4");
const sorted2 = externalSort([...data2], 4);
console.log("\nPierwszych 5 / First 5:", sorted2.slice(0, 5));
console.log("Ostatnich 5 / Last 5:", sorted2.slice(-5));
console.log("Czy poprawnie posortowane? / Correctly sorted?",
  JSON.stringify(sorted2) === JSON.stringify([...data2].sort()));
console.log();

console.log("=== Test 3: Duplikaty / Duplicates ===");
const data3 = ["cat", "dog", "cat", "bird", "dog", "ant", "cat", "bird"];
console.log("Dane z duplikatami / Data with duplicates:", data3);
const sorted3 = externalSort([...data3], 3);
console.log("\nWynik / Result:", sorted3);
console.log();

console.log("=== Test 4: Już posortowane / Already sorted ===");
const data4 = ["a", "b", "c", "d", "e", "f", "g", "h"];
console.log("Już posortowane / Already sorted:", data4);
const sorted4 = externalSort([...data4], 3);
console.log("\nWynik / Result:", sorted4);
console.log();

console.log("=== Test 5: Odwrotnie posortowane / Reverse sorted ===");
const data5 = ["h", "g", "f", "e", "d", "c", "b", "a"];
console.log("Odwrotnie posortowane / Reverse sorted:", data5);
const sorted5 = externalSort([...data5], 2);
console.log("\nWynik / Result:", sorted5);
console.log();

console.log("=== Test 6: Pojedynczy chunk / Single chunk ===");
const data6 = ["cat", "dog", "bird"];
console.log("Dane / Data:", data6);
console.log("Chunk większy niż dane / Chunk larger than data");
const sorted6 = externalSort([...data6], 10);
console.log("\nWynik / Result:", sorted6);
console.log();

console.log("=== Test 7: Wiele małych chunków / Many small chunks ===");
const data7 = ["z", "y", "x", "w", "v", "u", "t", "s"];
console.log("Dane / Data:", data7);
console.log("Chunki po 1 elemencie / Chunks of 1 element");
const sorted7 = externalSort([...data7], 1);
console.log("\nWynik / Result:", sorted7);
console.log();

console.log("=== Test 8: Symulacja większych danych / Simulate larger data ===");
const data8 = [];
for (let i = 0; i < 100; i++) {
  data8.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)) + i);
}
console.log("Wygenerowano 100 losowych stringów");
console.log("Generated 100 random strings");
console.log("Pierwsze 10 / First 10:", data8.slice(0, 10));

console.time("External Sort");
const sorted8 = externalSort([...data8], 10);
console.timeEnd("External Sort");

console.log("Posortowanych pierwszych 10 / Sorted first 10:", sorted8.slice(0, 10));

// Weryfikacja / Verification
const expected8 = [...data8].sort();
const isCorrect8 = JSON.stringify(sorted8) === JSON.stringify(expected8);
console.log("Czy poprawnie posortowane? / Correctly sorted?", isCorrect8);
console.log();

console.log("=== Analiza wydajności / Performance analysis ===");
console.log("\nLiczba chunków a liczba operacji na heap:");
console.log("Number of chunks vs heap operations:");

function analyzeComplexity(dataSize, chunkSize) {
  const numChunks = Math.ceil(dataSize / chunkSize);
  const heapOpsPerElement = Math.log2(numChunks);
  const totalHeapOps = dataSize * heapOpsPerElement;

  console.log(`\nRozmiar danych: ${dataSize}, Rozmiar chunka: ${chunkSize}`);
  console.log(`  Liczba chunków: ${numChunks}`);
  console.log(`  Operacje heap per element: ~${heapOpsPerElement.toFixed(2)}`);
  console.log(`  Całkowite operacje heap: ~${totalHeapOps.toFixed(0)}`);
}

analyzeComplexity(1000000, 100000);  // 10 chunków
analyzeComplexity(1000000, 50000);   // 20 chunków
analyzeComplexity(1000000, 10000);   // 100 chunków
analyzeComplexity(1000000, 1000);    // 1000 chunków

console.log("\n=== Wnioski / Conclusions ===");
console.log("1. Mniejsze chunki = więcej operacji heap, ale mniej pamięci");
console.log("   Smaller chunks = more heap operations, but less memory");
console.log("2. Większe chunki = szybsze, ale wymaga więcej RAM");
console.log("   Larger chunks = faster, but requires more RAM");
console.log("3. Optymalna wielkość chunka zależy od dostępnej pamięci");
console.log("   Optimal chunk size depends on available memory");

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MinHeap,
    sortChunks,
    kWayMerge,
    externalSort
  };
}
