# Sort Big File - Sortowanie Dużego Pliku

## Treść Zadania / Problem Statement

**English:**
Imagine you have a 20 GB file with one string per line. Explain how you would sort the file.

**Polski:**
Wyobraź sobie, że masz plik 20 GB z jednym stringiem na linię. Wyjaśnij, jak posortowałbyś ten plik.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
To jest klasyczne pytanie o **external sorting** (sortowanie zewnętrzne). Problem polega na tym, że:
- Plik ma 20 GB
- Zakładamy, że mamy np. 2-4 GB RAM dostępnej pamięci
- **Nie możemy załadować całego pliku do pamięci**

Musimy użyć dysku jako "rozszerzonej pamięci" i sortować w częściach.

**English:**
This is a classic question about **external sorting**. The problem is that:
- File is 20 GB
- Assume we have e.g., 2-4 GB of available RAM
- **We cannot load entire file into memory**

We must use disk as "extended memory" and sort in chunks.

## Rozwiązanie: External Merge Sort / Zewnętrzne Sortowanie przez Scalanie

### Algorytm / Algorithm

**Faza 1: Dziel i Sortuj (Divide and Sort)**

1. Podziel plik na **chunki** (kawałki), które mieszczą się w pamięci
   - Przykład: Jeśli mamy 2 GB RAM, dzielimy 20 GB na 10 chunków po 2 GB
2. Dla każdego chunka:
   - Załaduj do pamięci
   - Posortuj w pamięci (quicksort, mergesort, etc.)
   - Zapisz posortowany chunk do tymczasowego pliku

**Phase 1: Divide and Sort**

1. Divide file into **chunks** that fit in memory
   - Example: If we have 2 GB RAM, divide 20 GB into 10 chunks of 2 GB each
2. For each chunk:
   - Load into memory
   - Sort in memory (quicksort, mergesort, etc.)
   - Write sorted chunk to temporary file

**Faza 2: K-way Merge (Scalanie K-kierunkowe)**

3. Scal wszystkie posortowane chunki w jeden plik używając **min-heap**:
   - Otwórz wszystkie chunki jednocześnie (buffory odczytu)
   - Użyj min-heap do śledzenia najmniejszego elementu z każdego chunka
   - Iteracyjnie wyciągaj najmniejszy element i zapisz do wynikowego pliku
   - Ładuj kolejne elementy z odpowiednich chunków

**Phase 2: K-way Merge**

3. Merge all sorted chunks into one file using **min-heap**:
   - Open all chunks simultaneously (read buffers)
   - Use min-heap to track smallest element from each chunk
   - Iteratively extract smallest element and write to output file
   - Load next elements from appropriate chunks

### Wizualizacja / Visualization

```
FAZA 1: Podział i sortowanie / Division and sorting
=================================================

Oryginalny plik 20 GB:
[zebra, apple, dog, cat, bird, ...]

↓ Podział na 10 chunków po 2 GB

Chunk 1: [zebra, apple, dog] → Sort → [apple, dog, zebra]
Chunk 2: [cat, bird, ...]    → Sort → [bird, cat, ...]
...
Chunk 10: [...]              → Sort → [...]

Wynik: 10 posortowanych plików tymczasowych
Result: 10 sorted temporary files


FAZA 2: K-way Merge (10 plików)
================================

Min-Heap (po 1 elemencie z każdego chunka):
  [apple(chunk1), bird(chunk2), ..., aardvark(chunk10)]

Krok 1: Wyciągnij "aardvark" → zapisz do wyniku
        Załaduj następny z chunk10 do heap

Krok 2: Wyciągnij "apple" → zapisz do wyniku
        Załaduj następny z chunk1 do heap

...kontynuuj aż wszystkie chunki są wyczerpane

Wynik: Posortowany plik 20 GB
Result: Sorted 20 GB file
```

## Implementacja Koncepcyjna / Conceptual Implementation

### Faza 1: Sortowanie Chunków

```javascript
function sortChunks(inputFile, chunkSize) {
  const chunks = [];
  let chunkIndex = 0;

  // Czytaj plik w kawałkach / Read file in chunks
  while (hasMoreData(inputFile)) {
    // Załaduj chunk do pamięci / Load chunk into memory
    const chunk = readChunk(inputFile, chunkSize);

    // Sortuj w pamięci / Sort in memory
    chunk.sort();

    // Zapisz do tymczasowego pliku / Write to temporary file
    const tempFile = `temp_chunk_${chunkIndex}.txt`;
    writeToFile(tempFile, chunk);
    chunks.push(tempFile);

    chunkIndex++;
  }

  return chunks; // Lista plików tymczasowych / List of temp files
}
```

### Faza 2: K-way Merge z Min-Heap

```javascript
function kWayMerge(chunkFiles, outputFile) {
  // Min-heap przechowuje {value, chunkIndex}
  // Min-heap stores {value, chunkIndex}
  const minHeap = new MinHeap();

  // Otwórz wszystkie pliki chunków / Open all chunk files
  const readers = chunkFiles.map(file => openFileReader(file));

  // Inicjalizuj heap pierwszym elementem z każdego chunka
  // Initialize heap with first element from each chunk
  readers.forEach((reader, index) => {
    const line = reader.readLine();
    if (line) {
      minHeap.insert({ value: line, chunkIndex: index });
    }
  });

  const writer = openFileWriter(outputFile);

  // Scalaj / Merge
  while (!minHeap.isEmpty()) {
    // Wyciągnij najmniejszy element / Extract smallest element
    const { value, chunkIndex } = minHeap.extractMin();

    // Zapisz do wyniku / Write to output
    writer.writeLine(value);

    // Załaduj następny element z tego samego chunka
    // Load next element from same chunk
    const nextLine = readers[chunkIndex].readLine();
    if (nextLine) {
      minHeap.insert({ value: nextLine, chunkIndex });
    }
  }

  // Zamknij wszystkie pliki / Close all files
  readers.forEach(r => r.close());
  writer.close();
}
```

## Analiza Złożoności / Complexity Analysis

**Faza 1: Sortowanie chunków**
- Liczba chunków: k = total_size / chunk_size = 20GB / 2GB = 10
- Sortowanie każdego chunka: O(n log n) gdzie n = rozmiar chunka
- Łącznie: O(N log(N/k)) gdzie N = całkowity rozmiar

**Phase 1: Sorting chunks**
- Number of chunks: k = total_size / chunk_size = 20GB / 2GB = 10
- Sorting each chunk: O(n log n) where n = chunk size
- Total: O(N log(N/k)) where N = total size

**Faza 2: K-way merge**
- Każdy element jest przetworzony raz: O(N)
- Operacje na heap: O(log k) dla każdego elementu
- Łącznie: O(N log k)

**Phase 2: K-way merge**
- Each element processed once: O(N)
- Heap operations: O(log k) for each element
- Total: O(N log k)

**Całkowita złożoność / Total complexity:** O(N log N)
**Pamięć / Memory:** O(chunk_size + k) - rozmiar chunka + buffory dla k plików

## Optymalizacje / Optimizations

### 1. **Multi-way Merge w Jednym Przejściu**
Zamiast scalać po 2, scal wszystkie chunki naraz używając heap.

Instead of merging 2 at a time, merge all chunks at once using heap.

### 2. **Buffering I/O**
Użyj buforów do czytania/pisania wielu linii naraz, nie pojedynczo.

Use buffers to read/write multiple lines at once, not individually.

### 3. **Kompresja**
Kompresuj chunki podczas zapisywania do oszczędzenia miejsca.

Compress chunks when writing to save space.

### 4. **Równoległość**
Sortuj chunki równolegle na wielu rdzeniach/wątkach.

Sort chunks in parallel on multiple cores/threads.

### 5. **SSD vs HDD**
Na SSD możemy bezpiecznie używać więcej małych plików. Na HDD lepiej mniej, większych.

On SSD we can safely use more small files. On HDD better fewer, larger ones.

## Warianty Problemu / Problem Variants

### Co jeśli mamy tylko 100 MB RAM?
- Zmniejsz rozmiar chunków do 100 MB
- Liczba chunków: 20 GB / 100 MB = 200 chunków
- K-way merge z 200 chunkami
- Może wymagać merge w wielu fazach (hierarchiczne scalanie)

### What if we only have 100 MB RAM?
- Reduce chunk size to 100 MB
- Number of chunks: 20 GB / 100 MB = 200 chunks
- K-way merge with 200 chunks
- May require multi-phase merge (hierarchical merging)

### Co jeśli plik ma duplikaty?
- Możemy je usunąć podczas scalania
- Lub policzyć częstość wystąpień

### What if file has duplicates?
- We can remove them during merge
- Or count occurrence frequency

## Narzędzia w Praktyce / Tools in Practice

W rzeczywistości używamy:
- **Unix `sort`** - implementuje external merge sort
- **MapReduce** - dla masywnie równoległego sortowania
- **Spark** - dla przetwarzania dużych danych
- **External sorting libraries** - gotowe rozwiązania

In practice we use:
- **Unix `sort`** - implements external merge sort
- **MapReduce** - for massively parallel sorting
- **Spark** - for big data processing
- **External sorting libraries** - ready solutions

## Przykład Unix `sort`:

```bash
# Sortuj duży plik z ograniczeniem pamięci
sort -S 2G large_file.txt -o sorted_file.txt

# -S 2G = użyj maksymalnie 2 GB RAM
# -o = plik wyjściowy
```

## Pytania do Rekrutera / Questions for Interviewer

1. Ile mamy dostępnej pamięci RAM? / How much RAM available?
2. Czy stringi mogą być duplikowane? / Can strings be duplicated?
3. Czy musimy obsłużyć bardzo długie stringi? / Must we handle very long strings?
4. Czy możemy użyć wielu dysków? / Can we use multiple disks?
5. Czy sortowanie musi być stabilne? / Must sorting be stable?

## Kluczowe Wnioski / Key Takeaways

1. **External sorting dla danych większych niż RAM** - divide and conquer
2. **K-way merge z min-heap** - efektywne scalanie wielu plików
3. **Trade-off: liczba chunków vs rozmiar chunka** - wpływa na wydajność I/O
4. **Buffering i równoległość** - kluczowe optymalizacje
5. **W praktyce używaj gotowych narzędzi** - `sort`, MapReduce, Spark

1. **External sorting for data larger than RAM** - divide and conquer
2. **K-way merge with min-heap** - efficient merging of multiple files
3. **Trade-off: number of chunks vs chunk size** - affects I/O performance
4. **Buffering and parallelism** - key optimizations
5. **In practice use ready tools** - `sort`, MapReduce, Spark
