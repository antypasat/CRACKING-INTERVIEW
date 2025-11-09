/**
 * CTCI 17.15 - Longest Word
 *
 * Problem:
 * Given a list of words, write a program to find the longest word made of other words
 * in the list.
 *
 * Example:
 * Input: ["cat", "banana", "dog", "nana", "walk", "walker", "dogwalker"]
 * Output: "dogwalker"
 *
 * Note: "dogwalker" can be made from "dog" + "walker", and "walker" can be made
 * from "walk" + "er"... wait, "er" is not in the list. Let's check: "walker" alone
 * is not made of other words unless we consider substrings. The correct interpretation
 * is that a word can be made by concatenating two or more words from the list.
 *
 * Better example:
 * Input: ["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses", "rat", "ratcatdogcat"]
 * Output: "ratcatdogcat" (can be built from "rat", "cat", "dog", "cat")
 */

/**
 * Approach 1: Brute Force with Recursion and Memoization
 *
 * For each word, check if it can be built from other words in the list.
 * Use recursion with memoization to check all possible splits.
 *
 * Time: O(n * w^2) where n is number of words, w is average word length
 * Space: O(n) for the set and memoization
 */
function findLongestWord(words) {
    if (!words || words.length === 0) return "";

    // Sort by length (descending) to check longest words first
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    // Convert to set for O(1) lookup
    const wordSet = new Set(words);

    // Check each word
    for (const word of sortedWords) {
        if (canBuildWord(word, true, wordSet, new Map())) {
            return word;
        }
    }

    return "";
}

/**
 * Check if a word can be built from other words in the set
 * @param {string} word - word to check
 * @param {boolean} isOriginalWord - true if this is the original word being checked
 * @param {Set} wordSet - set of all words
 * @param {Map} memo - memoization cache
 */
function canBuildWord(word, isOriginalWord, wordSet, memo) {
    // If we've seen this word before, return cached result
    if (memo.has(word)) {
        return memo.get(word);
    }

    // Base case: if word is in the set and not the original word, it's valid
    if (!isOriginalWord && wordSet.has(word)) {
        return true;
    }

    // Try all possible splits
    for (let i = 1; i < word.length; i++) {
        const left = word.substring(0, i);
        const right = word.substring(i);

        // Check if left part is a valid word and right part can be built
        if (wordSet.has(left) && canBuildWord(right, false, wordSet, memo)) {
            memo.set(word, true);
            return true;
        }
    }

    memo.set(word, false);
    return false;
}

/**
 * Approach 2: Dynamic Programming
 *
 * For each word, use DP to check if it can be segmented into words from the list.
 *
 * Time: O(n * w^2) where n is number of words, w is max word length
 * Space: O(n + w)
 */
function findLongestWordDP(words) {
    if (!words || words.length === 0) return "";

    const wordSet = new Set(words);
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
        if (canSegment(word, wordSet, true)) {
            return word;
        }
    }

    return "";
}

/**
 * Check if word can be segmented using DP
 */
function canSegment(word, wordSet, requireMultiple) {
    const n = word.length;
    const dp = Array(n + 1).fill(false);
    dp[0] = true; // Empty string can be segmented

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            const substring = word.substring(j, i);

            // For the original word, we need at least one valid split
            // (can't just be the word itself)
            if (j === 0 && i === n && requireMultiple) {
                continue;
            }

            if (dp[j] && wordSet.has(substring)) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n];
}

/**
 * Approach 3: Using Trie for Optimization
 *
 * Build a Trie of all words for faster prefix checking.
 *
 * Time: O(n * w^2) but with better constants
 * Space: O(total characters in all words)
 */
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isWord = false;
        this.word = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isWord = true;
        node.word = word;
    }

    contains(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return node.isWord;
    }
}

function findLongestWordTrie(words) {
    if (!words || words.length === 0) return "";

    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
    }

    // Sort by length descending
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
        if (canBuildWithTrie(word, 0, 0, trie, new Map())) {
            return word;
        }
    }

    return "";
}

/**
 * Check if word can be built using Trie
 * @param {string} word - word to check
 * @param {number} start - starting index in word
 * @param {number} count - number of words used so far
 * @param {Trie} trie - Trie of all words
 * @param {Map} memo - memoization cache
 */
function canBuildWithTrie(word, start, count, trie, memo) {
    if (start === word.length) {
        return count >= 2; // Must use at least 2 words
    }

    const key = `${start}-${count}`;
    if (memo.has(key)) {
        return memo.get(key);
    }

    let node = trie.root;
    for (let i = start; i < word.length; i++) {
        const char = word[i];
        if (!node.children.has(char)) {
            memo.set(key, false);
            return false;
        }

        node = node.children.get(char);
        if (node.isWord) {
            // Found a valid word, check if we can build the rest
            if (canBuildWithTrie(word, i + 1, count + 1, trie, memo)) {
                memo.set(key, true);
                return true;
            }
        }
    }

    memo.set(key, false);
    return false;
}

/**
 * Approach 4: Find All Longest Words
 *
 * Instead of returning just one, return all words tied for longest.
 *
 * Time: O(n * w^2)
 * Space: O(n)
 */
function findAllLongestWords(words) {
    if (!words || words.length === 0) return [];

    const wordSet = new Set(words);
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    const result = [];
    let maxLength = 0;

    for (const word of sortedWords) {
        // If word is shorter than current max, we can stop
        if (word.length < maxLength) break;

        if (canBuildWord(word, true, wordSet, new Map())) {
            if (word.length > maxLength) {
                maxLength = word.length;
                result.length = 0; // Clear previous results
            }
            result.push(word);
        }
    }

    return result;
}

/**
 * Approach 5: Optimized with early termination
 *
 * Sort by length and check longest first, return immediately when found.
 *
 * Time: O(n log n + n * w^2) best case can be much better
 * Space: O(n)
 */
function findLongestWordOptimized(words) {
    if (!words || words.length === 0) return "";

    // Sort by length (descending), then alphabetically for consistency
    const sortedWords = [...words].sort((a, b) => {
        if (a.length !== b.length) {
            return b.length - a.length;
        }
        return a.localeCompare(b);
    });

    const wordSet = new Set(words);

    for (const word of sortedWords) {
        if (canBuildWordOptimized(word, wordSet, new Map())) {
            return word;
        }
    }

    return "";
}

/**
 * Optimized version with better memoization
 */
function canBuildWordOptimized(word, wordSet, memo) {
    if (memo.has(word)) {
        return memo.get(word);
    }

    // Try to build this word from others
    for (let i = 1; i < word.length; i++) {
        const prefix = word.substring(0, i);
        const suffix = word.substring(i);

        // Check if prefix exists in wordSet
        if (wordSet.has(prefix)) {
            // Check if suffix is either in wordSet or can be built
            if (wordSet.has(suffix) || canBuildWordOptimized(suffix, wordSet, memo)) {
                memo.set(word, true);
                return true;
            }
        }
    }

    memo.set(word, false);
    return false;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Print the decomposition of a compound word
 */
function getWordDecomposition(word, wordSet, memo = new Map()) {
    if (wordSet.has(word) && word.length > 0) {
        // Word exists in set, but might also be compound
        // Try to find a decomposition
        for (let i = 1; i < word.length; i++) {
            const prefix = word.substring(0, i);
            const suffix = word.substring(i);

            if (wordSet.has(prefix)) {
                const suffixDecomp = getWordDecomposition(suffix, wordSet, memo);
                if (suffixDecomp) {
                    return [prefix, ...suffixDecomp];
                }
            }
        }
        // No decomposition found, return as single word
        return [word];
    }

    // Try to decompose
    for (let i = 1; i < word.length; i++) {
        const prefix = word.substring(0, i);
        const suffix = word.substring(i);

        if (wordSet.has(prefix)) {
            const suffixDecomp = getWordDecomposition(suffix, wordSet, memo);
            if (suffixDecomp) {
                return [prefix, ...suffixDecomp];
            }
        }
    }

    return null; // Cannot decompose
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing Longest Word...\n');

    // Test 1: Example from problem
    console.log('Test 1: Example from problem');
    const words1 = ["cat", "cats", "catsdogcats", "dog", "dogcatsdog", "hippopotamuses", "rat", "ratcatdogcat"];
    console.log('Words:', words1);
    const result1 = findLongestWord(words1);
    console.log('Longest word:', result1);
    const decomp1 = getWordDecomposition(result1, new Set(words1));
    console.log('Decomposition:', decomp1 ? decomp1.join(' + ') : 'none');
    console.log('Expected: "ratcatdogcat" or "catsdogcats"\n');

    // Test 2: Simple example
    console.log('Test 2: Simple example');
    const words2 = ["cat", "dog", "catdog"];
    const result2 = findLongestWord(words2);
    console.log('Words:', words2);
    console.log('Result:', result2);
    console.log('Expected: "catdog"\n');

    // Test 3: Multiple valid words
    console.log('Test 3: Multiple valid words');
    const words3 = ["a", "b", "ab", "abc", "c", "bc"];
    const result3 = findLongestWord(words3);
    console.log('Words:', words3);
    console.log('Result:', result3);
    console.log('All longest:', findAllLongestWords(words3));
    console.log('Expected: "abc"\n');

    // Test 4: No compound words
    console.log('Test 4: No compound words');
    const words4 = ["apple", "banana", "cherry"];
    const result4 = findLongestWord(words4);
    console.log('Words:', words4);
    console.log('Result:', result4);
    console.log('Expected: "" (empty string)\n');

    // Test 5: Single word
    console.log('Test 5: Single word');
    const words5 = ["hello"];
    const result5 = findLongestWord(words5);
    console.log('Words:', words5);
    console.log('Result:', result5);
    console.log('Expected: "" (empty string)\n');

    // Test 6: Complex nesting
    console.log('Test 6: Complex nesting');
    const words6 = ["test", "tester", "testertest", "testertestertest"];
    const result6 = findLongestWord(words6);
    console.log('Words:', words6);
    console.log('Result:', result6);
    const decomp6 = getWordDecomposition(result6, new Set(words6));
    console.log('Decomposition:', decomp6 ? decomp6.join(' + ') : 'none');
    console.log('Expected: "testertestertest"\n');

    // Test 7: DP approach
    console.log('Test 7: DP approach');
    const result7 = findLongestWordDP(words1);
    console.log('Words:', words1);
    console.log('Result:', result7);
    console.log('Expected: "ratcatdogcat" or "catsdogcats"\n');

    // Test 8: Trie approach
    console.log('Test 8: Trie approach');
    const result8 = findLongestWordTrie(words1);
    console.log('Words:', words1);
    console.log('Result:', result8);
    console.log('Expected: "ratcatdogcat" or "catsdogcats"\n');

    // Test 9: Edge cases
    console.log('Test 9: Edge cases');
    console.log('Empty array:', findLongestWord([]));
    console.log('Two words, one compound:', findLongestWord(["a", "aa"]));
    console.log('Expected: "", "aa"\n');

    // Test 10: Real-world example
    console.log('Test 10: Real-world example');
    const words10 = [
        "cat", "cats", "dog", "dogs", "walk", "walker", "walking",
        "catdog", "dogcat", "catdogwalker", "dogwalker"
    ];
    console.log('Words:', words10);
    const result10 = findLongestWord(words10);
    console.log('Result:', result10);
    const decomp10 = getWordDecomposition(result10, new Set(words10));
    console.log('Decomposition:', decomp10 ? decomp10.join(' + ') : 'none');

    // Test 11: Performance comparison
    console.log('\nTest 11: Performance comparison');
    const largeWords = [
        "a", "aa", "aaa", "aaaa", "aaaaa", "aaaaaa",
        "b", "bb", "bbb", "bbbb", "bbbbb", "bbbbbb",
        "ab", "aabb", "aaabbb", "aaaabbbb",
        "ba", "bbaa", "bbbaaaa",
        "aaaaaabbbbbb", "aaaaabbbbb", "aaaabbbb"
    ];

    console.time('Recursive with memo');
    const r1 = findLongestWord(largeWords);
    console.timeEnd('Recursive with memo');
    console.log('Result:', r1);

    console.time('DP approach');
    const r2 = findLongestWordDP(largeWords);
    console.timeEnd('DP approach');
    console.log('Result:', r2);

    console.time('Trie approach');
    const r3 = findLongestWordTrie(largeWords);
    console.timeEnd('Trie approach');
    console.log('Result:', r3);

    console.time('Optimized');
    const r4 = findLongestWordOptimized(largeWords);
    console.timeEnd('Optimized');
    console.log('Result:', r4);

    // Test 12: All longest words
    console.log('\nTest 12: Find all longest words');
    const words12 = ["a", "b", "ab", "ba", "c", "ac", "ca"];
    console.log('Words:', words12);
    console.log('All longest:', findAllLongestWords(words12));
    console.log('Expected: ["ab", "ba", "ac", "ca"] (all length 2)');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findLongestWord,
        findLongestWordDP,
        findLongestWordTrie,
        findAllLongestWords,
        findLongestWordOptimized,
        canBuildWord,
        canSegment,
        Trie,
        TrieNode,
        getWordDecomposition
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
