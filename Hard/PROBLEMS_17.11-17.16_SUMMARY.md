# Hard Chapter Problems 17.11 - 17.16 Summary

## Overview
Created comprehensive solution.js files for all 6 problems with multiple approaches, detailed tests, and edge case handling.

---

## 17.11 Word Distance
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/WordDistance/solution.js`

**Problem:** Find shortest distance between two words in a text.

**Implementations:**
1. **Single Query (O(n))** - One pass through array tracking positions
2. **Repeated Queries with Preprocessing (O(n) setup, O(p1+p2) query)** - Hash map storing all positions
3. **LocationPair Class** - Cleaner encapsulation with helper class

**Key Features:**
- Handles edge cases (empty arrays, missing words, same word)
- Performance comparison between approaches
- Position tracking and verification

---

## 17.12 BiNode  
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/BiNode/solution.js`

**Problem:** Convert binary search tree to doubly linked list in-place.

**Implementations:**
1. **Recursive with NodePair (O(n))** - Returns head/tail for each subtree
2. **Iterative In-Order (O(n))** - Stack-based traversal
3. **Wrapper Approach (O(n))** - Global head/tail tracking
4. **Concatenate Sublists (O(n))** - Explicit concatenation of parts

**Key Features:**
- BiNode class with dual-purpose node1/node2 pointers
- Integrity verification for doubly linked list
- Backward traversal testing
- Tree visualization helpers

---

## 17.13 Re-Space
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/ReSpace/solution.js`

**Problem:** Minimize unrecognized characters when adding spaces to concatenated string.

**Implementations:**
1. **Bottom-Up DP (O(n²))** - Build solution from left to right
2. **Trie Optimization (O(n²))** - Faster word lookup with Trie
3. **Top-Down with Memoization (O(n²))** - Recursive approach
4. **Space-Optimized (O(n²))** - Two-pass with reconstruction

**Key Features:**
- ParseResult class tracking invalid count and parsed string
- Trie implementation for efficient prefix matching
- Dictionary-based word segmentation
- Multiple DP formulations

---

## 17.14 Smallest K
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/SmallestK/solution.js`

**Problem:** Find k smallest elements from array.

**Implementations:**
1. **Sorting (O(n log n))** - Simple sort and slice
2. **Max Heap of Size K (O(n log k))** - Best for small k
3. **Min Heap (O(n + k log n))** - Heapify all, extract k
4. **QuickSelect (O(n) average)** - Partitioning approach
5. **QuickSelect 3-Way (O(n) average)** - Better for duplicates
6. **Built-in Sort (O(n log n))** - Most practical for small arrays

**Key Features:**
- Complete MaxHeap and MinHeap implementations
- Performance comparisons across all approaches
- Verification functions
- Handles duplicates, negatives, edge cases

---

## 17.15 Longest Word
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/LongestWord/solution.js`

**Problem:** Find longest word made of other words in list.

**Implementations:**
1. **Recursive with Memoization (O(n·w²))** - Check all possible splits
2. **Dynamic Programming (O(n·w²))** - Word segmentation DP
3. **Trie Approach (O(n·w²))** - Optimized prefix checking
4. **Find All Longest** - Return all words tied for longest
5. **Optimized Early Termination** - Better pruning

**Key Features:**
- Word decomposition tracking
- Trie data structure for efficient lookups
- Multiple DP formulations
- Examples: "dogwalker", "ratcatdogcat"

---

## 17.16 The Masseuse
**Location:** `/home/user/CRACKING-INTERVIEW/Hard/TheMasseuse/solution.js`

**Problem:** Maximum appointment time with no adjacent appointments (House Robber variant).

**Implementations:**
1. **Recursive with Memoization (O(n))** - Top-down DP
2. **Iterative Bottom-Up (O(n))** - Build DP table
3. **Space-Optimized (O(1))** - Only track last two values
4. **Alternative Formulation (O(n))** - Different DP definition
5. **With Tracking (O(n))** - Returns selected indices
6. **Fast Version (O(n))** - Optimized implementation
7. **With Negatives (O(n))** - Handles penalty values

**Key Features:**
- Solution verification (no adjacent appointments)
- Backtracking to find selected appointments
- Find all optimal solutions
- Extensive test coverage including edge cases

---

## Test Coverage

All solutions include comprehensive tests for:
- ✓ Example cases from problem statements
- ✓ Edge cases (empty, single element, etc.)
- ✓ Performance benchmarks with large inputs
- ✓ Multiple algorithm comparisons
- ✓ Correctness verification
- ✓ Special cases (duplicates, negatives, extremes)

---

## Running Tests

Each solution can be run independently:

```bash
# Test individual problems
node /home/user/CRACKING-INTERVIEW/Hard/WordDistance/solution.js
node /home/user/CRACKING-INTERVIEW/Hard/BiNode/solution.js
node /home/user/CRACKING-INTERVIEW/Hard/ReSpace/solution.js
node /home/user/CRACKING-INTERVIEW/Hard/SmallestK/solution.js
node /home/user/CRACKING-INTERVIEW/Hard/LongestWord/solution.js
node /home/user/CRACKING-INTERVIEW/Hard/TheMasseuse/solution.js
```

All solutions are also exportable as modules for use in other files.

---

## File Sizes
- WordDistance: 8.8 KB
- BiNode: 15 KB
- ReSpace: 16 KB
- SmallestK: 15 KB
- LongestWord: 16 KB
- TheMasseuse: 15 KB

**Total:** ~85 KB of comprehensive, well-tested code
