/**
 * CTCI 17.13 - Re-Space
 *
 * Problem:
 * Oh, no! You have accidentally removed all spaces, punctuation, and capitalization
 * in a lengthy document. A sentence like "I reset the computer. It still didn't boot!"
 * became "iresetthecomputeritstilldidntboot". You'll deal with the punctuation and
 * capitalization later; right now you need to re-insert the spaces. Most of the words
 * are in a dictionary but a few are not. Given a dictionary (a list of strings) and
 * the document (a string), design an algorithm to unconcatenate the document in a way
 * that minimizes the number of unrecognized characters.
 *
 * Example:
 * Input: dictionary = ["looked", "just", "like", "her", "brother"]
 *        sentence = "jesslookedjustliketimherbrother"
 * Output: "jess looked just like tim her brother" (7 unrecognized chars: j,e,s,s,t,i,m)
 */

/**
 * Approach 1: Dynamic Programming with Memoization
 *
 * Key Insight:
 * - For each position in the string, we try all possible words from the dictionary
 * - We use DP to find the best split that minimizes unrecognized characters
 * - dp[i] = minimum unrecognized characters for substring [0...i)
 *
 * Time: O(n^2) where n is the length of the sentence
 * Space: O(n) for the DP array
 */
class ParseResult {
    constructor(invalid = Infinity, parsed = '') {
        this.invalid = invalid;  // Number of invalid/unrecognized characters
        this.parsed = parsed;    // The parsed string with spaces
    }

    clone() {
        return new ParseResult(this.invalid, this.parsed);
    }
}

function reSpace(dictionary, sentence) {
    if (!sentence || sentence.length === 0) {
        return new ParseResult(0, '');
    }

    // Convert dictionary to Set for O(1) lookup
    const dict = new Set(dictionary.map(word => word.toLowerCase()));

    // DP approach
    const n = sentence.length;
    const dp = Array(n + 1).fill(null).map(() => new ParseResult());

    // Base case: empty string
    dp[0] = new ParseResult(0, '');

    // Fill DP table
    for (let i = 1; i <= n; i++) {
        // Option 1: Treat current character as invalid
        dp[i] = new ParseResult(
            dp[i - 1].invalid + 1,
            dp[i - 1].parsed + sentence[i - 1]
        );

        // Option 2: Try to form a valid word ending at position i
        for (let j = 0; j < i; j++) {
            const word = sentence.substring(j, i).toLowerCase();

            if (dict.has(word)) {
                const newInvalid = dp[j].invalid;
                const newParsed = dp[j].parsed + (dp[j].parsed ? ' ' : '') + word;

                if (newInvalid < dp[i].invalid) {
                    dp[i] = new ParseResult(newInvalid, newParsed);
                }
            }
        }
    }

    return dp[n];
}

/**
 * Approach 2: Optimized with Trie
 *
 * Uses a Trie to efficiently check if substrings are valid words.
 * This can be faster when the dictionary is large.
 *
 * Time: O(n^2) worst case, but faster in practice
 * Space: O(d) where d is total characters in dictionary
 */
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isWord = true;
    }

    // Get all valid words starting at position 'start' in the string
    getValidWords(sentence, start) {
        const validWords = [];
        let node = this.root;

        for (let i = start; i < sentence.length; i++) {
            const char = sentence[i].toLowerCase();
            if (!node.children.has(char)) {
                break;
            }

            node = node.children.get(char);
            if (node.isWord) {
                validWords.push({
                    word: sentence.substring(start, i + 1),
                    endIndex: i + 1
                });
            }
        }

        return validWords;
    }
}

function reSpaceWithTrie(dictionary, sentence) {
    if (!sentence || sentence.length === 0) {
        return new ParseResult(0, '');
    }

    // Build Trie
    const trie = new Trie();
    for (const word of dictionary) {
        trie.insert(word);
    }

    const n = sentence.length;
    const dp = Array(n + 1).fill(null).map(() => new ParseResult());
    dp[0] = new ParseResult(0, '');

    for (let i = 1; i <= n; i++) {
        // Option 1: Treat current character as invalid
        dp[i] = new ParseResult(
            dp[i - 1].invalid + 1,
            dp[i - 1].parsed + sentence[i - 1]
        );

        // Option 2: Try to form valid words ending at position i
        for (let j = 0; j < i; j++) {
            const validWords = trie.getValidWords(sentence, j);

            for (const { word, endIndex } of validWords) {
                if (endIndex === i) {
                    const newInvalid = dp[j].invalid;
                    const newParsed = dp[j].parsed + (dp[j].parsed ? ' ' : '') + word;

                    if (newInvalid < dp[i].invalid) {
                        dp[i] = new ParseResult(newInvalid, newParsed);
                    }
                }
            }
        }
    }

    return dp[n];
}

/**
 * Approach 3: Top-Down DP with Memoization
 *
 * Recursive approach with memoization. Sometimes easier to understand
 * and can be more efficient for sparse solutions.
 *
 * Time: O(n^2)
 * Space: O(n) for memoization
 */
function reSpaceTopDown(dictionary, sentence) {
    if (!sentence || sentence.length === 0) {
        return new ParseResult(0, '');
    }

    const dict = new Set(dictionary.map(word => word.toLowerCase()));
    const memo = new Map();

    function dp(index) {
        if (index >= sentence.length) {
            return new ParseResult(0, '');
        }

        if (memo.has(index)) {
            return memo.get(index);
        }

        // Option 1: Treat current character as invalid
        let best = dp(index + 1).clone();
        best.invalid += 1;
        best.parsed = sentence[index] + best.parsed;

        // Option 2: Try all possible valid words starting at index
        for (let end = index + 1; end <= sentence.length; end++) {
            const word = sentence.substring(index, end).toLowerCase();

            if (dict.has(word)) {
                const rest = dp(end).clone();
                const newInvalid = rest.invalid;
                const newParsed = word + (rest.parsed ? ' ' : '') + rest.parsed;

                if (newInvalid < best.invalid) {
                    best = new ParseResult(newInvalid, newParsed);
                }
            }
        }

        memo.set(index, best);
        return best;
    }

    return dp(0);
}

/**
 * Approach 4: Space-optimized version
 *
 * Only tracks the minimum invalid count, reconstructs solution at the end.
 * Uses less memory but requires two passes.
 *
 * Time: O(n^2)
 * Space: O(n)
 */
function reSpaceOptimized(dictionary, sentence) {
    if (!sentence || sentence.length === 0) {
        return new ParseResult(0, '');
    }

    const dict = new Set(dictionary.map(word => word.toLowerCase()));
    const n = sentence.length;

    // First pass: find minimum invalid count
    const dp = Array(n + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        // Option 1: Invalid character
        dp[i] = dp[i - 1] + 1;

        // Option 2: Valid word
        for (let j = 0; j < i; j++) {
            const word = sentence.substring(j, i).toLowerCase();
            if (dict.has(word)) {
                dp[i] = Math.min(dp[i], dp[j]);
            }
        }
    }

    // Second pass: reconstruct the solution
    let parsed = '';
    let i = n;

    while (i > 0) {
        // Check if current character was marked as invalid
        if (dp[i] === dp[i - 1] + 1) {
            // Check if there's a valid word we should use instead
            let foundWord = false;

            for (let j = 0; j < i; j++) {
                const word = sentence.substring(j, i).toLowerCase();
                if (dict.has(word) && dp[i] === dp[j]) {
                    parsed = word + (parsed ? ' ' : '') + parsed;
                    i = j;
                    foundWord = true;
                    break;
                }
            }

            if (!foundWord) {
                parsed = sentence[i - 1] + parsed;
                i--;
            }
        } else {
            // Find the word that led to this state
            for (let j = 0; j < i; j++) {
                const word = sentence.substring(j, i).toLowerCase();
                if (dict.has(word) && dp[i] === dp[j]) {
                    parsed = word + (parsed ? ' ' : '') + parsed;
                    i = j;
                    break;
                }
            }
        }
    }

    return new ParseResult(dp[n], parsed);
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Remove spaces from a string (for testing)
 */
function removeSpaces(str) {
    return str.replace(/\s+/g, '');
}

/**
 * Count invalid characters in the result
 */
function countInvalidChars(dictionary, result) {
    const dict = new Set(dictionary.map(word => word.toLowerCase()));
    const words = result.split(' ');
    let invalid = 0;

    for (const word of words) {
        if (!dict.has(word.toLowerCase())) {
            invalid += word.length;
        }
    }

    return invalid;
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing Re-Space...\n');

    // Test 1: Example from problem
    console.log('Test 1: Example from problem');
    const dict1 = ["looked", "just", "like", "her", "brother"];
    const sentence1 = "jesslookedjustliketimherbrother";
    console.log('Sentence:', sentence1);
    console.log('Dictionary:', dict1);
    const result1 = reSpace(dict1, sentence1);
    console.log('Result:', result1.parsed);
    console.log('Invalid chars:', result1.invalid);
    console.log('Expected: "jess looked just like tim her brother" (7 invalid)\n');

    // Test 2: All valid words
    console.log('Test 2: All valid words');
    const dict2 = ["hello", "world", "this", "is", "a", "test"];
    const sentence2 = "helloworldthisisatest";
    const result2 = reSpace(dict2, sentence2);
    console.log('Sentence:', sentence2);
    console.log('Result:', result2.parsed);
    console.log('Invalid chars:', result2.invalid);
    console.log('Expected: "hello world this is a test" (0 invalid)\n');

    // Test 3: No valid words
    console.log('Test 3: No valid words');
    const dict3 = ["cat", "dog", "bird"];
    const sentence3 = "xyz";
    const result3 = reSpace(dict3, sentence3);
    console.log('Sentence:', sentence3);
    console.log('Result:', result3.parsed);
    console.log('Invalid chars:', result3.invalid);
    console.log('Expected: "xyz" (3 invalid)\n');

    // Test 4: Overlapping words
    console.log('Test 4: Overlapping words');
    const dict4 = ["the", "there", "answer", "any", "by", "bye", "their"];
    const sentence4 = "theanswer";
    const result4 = reSpace(dict4, sentence4);
    console.log('Sentence:', sentence4);
    console.log('Result:', result4.parsed);
    console.log('Invalid chars:', result4.invalid);
    console.log('Expected: "the answer" (0 invalid)\n');

    // Test 5: Empty string
    console.log('Test 5: Empty string');
    const result5 = reSpace(dict1, "");
    console.log('Result:', result5.parsed);
    console.log('Invalid chars:', result5.invalid);
    console.log('Expected: "" (0 invalid)\n');

    // Test 6: Trie approach
    console.log('Test 6: Trie approach');
    const result6 = reSpaceWithTrie(dict1, sentence1);
    console.log('Sentence:', sentence1);
    console.log('Result:', result6.parsed);
    console.log('Invalid chars:', result6.invalid);
    console.log('Expected: "jess looked just like tim her brother" (7 invalid)\n');

    // Test 7: Top-down approach
    console.log('Test 7: Top-down approach');
    const result7 = reSpaceTopDown(dict1, sentence1);
    console.log('Sentence:', sentence1);
    console.log('Result:', result7.parsed);
    console.log('Invalid chars:', result7.invalid);
    console.log('Expected: "jess looked just like tim her brother" (7 invalid)\n');

    // Test 8: Optimized approach
    console.log('Test 8: Optimized approach');
    const result8 = reSpaceOptimized(dict1, sentence1);
    console.log('Sentence:', sentence1);
    console.log('Result:', result8.parsed);
    console.log('Invalid chars:', result8.invalid);
    console.log('Expected: "jess looked just like tim her brother" (7 invalid)\n');

    // Test 9: Complex example
    console.log('Test 9: Complex example');
    const dict9 = ["i", "reset", "the", "computer", "it", "still", "didnt", "boot"];
    const sentence9 = "iresetthecomputeritstilldidntboot";
    const result9 = reSpace(dict9, sentence9);
    console.log('Sentence:', sentence9);
    console.log('Result:', result9.parsed);
    console.log('Invalid chars:', result9.invalid);
    console.log('Expected: "i reset the computer it still didnt boot" (0 invalid)\n');

    // Test 10: Single character words
    console.log('Test 10: Single character words');
    const dict10 = ["a", "b", "c", "ab", "bc", "abc"];
    const sentence10 = "abcd";
    const result10 = reSpace(dict10, sentence10);
    console.log('Sentence:', sentence10);
    console.log('Result:', result10.parsed);
    console.log('Invalid chars:', result10.invalid);
    console.log('Possible: "abc d" (1 invalid) or "ab c d" (1 invalid)\n');

    // Test 11: Performance comparison
    console.log('Test 11: Performance comparison');
    const largeDictionary = [
        "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
        "hello", "world", "test", "data", "structure", "algorithm",
        "dynamic", "programming", "computer", "science"
    ];
    const largeSentence = "thequickbrownfoxjumpsoverthelazydog";

    console.time('Bottom-up DP');
    const r1 = reSpace(largeDictionary, largeSentence);
    console.timeEnd('Bottom-up DP');
    console.log('Result:', r1.parsed, '(' + r1.invalid + ' invalid)');

    console.time('Trie approach');
    const r2 = reSpaceWithTrie(largeDictionary, largeSentence);
    console.timeEnd('Trie approach');
    console.log('Result:', r2.parsed, '(' + r2.invalid + ' invalid)');

    console.time('Top-down DP');
    const r3 = reSpaceTopDown(largeDictionary, largeSentence);
    console.timeEnd('Top-down DP');
    console.log('Result:', r3.parsed, '(' + r3.invalid + ' invalid)');

    console.time('Optimized');
    const r4 = reSpaceOptimized(largeDictionary, largeSentence);
    console.timeEnd('Optimized');
    console.log('Result:', r4.parsed, '(' + r4.invalid + ' invalid)');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParseResult,
        reSpace,
        reSpaceWithTrie,
        reSpaceTopDown,
        reSpaceOptimized,
        Trie,
        TrieNode,
        removeSpaces,
        countInvalidChars
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
