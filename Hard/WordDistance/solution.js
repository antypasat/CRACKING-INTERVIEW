/**
 * CTCI 17.11 - Word Distance
 *
 * Problem:
 * You have a large text file containing words. Given any two words, find the shortest
 * distance (in terms of number of words) between them in the file. If the operation
 * will be repeated many times for the same file (but different pairs of words), can
 * you optimize it?
 *
 * Example:
 * Input: words = ["the", "quick", "brown", "fox", "quick", "the", "dog"]
 *        word1 = "quick", word2 = "fox"
 * Output: 1 (positions 1 and 2)
 */

/**
 * Approach 1: Single Query - O(n) time, O(1) space
 * For a single query, we iterate through the array once, tracking the most recent
 * positions of both words and updating the minimum distance.
 *
 * Time: O(n) - single pass through the array
 * Space: O(1) - only storing indices
 */
function findClosestDistance(words, word1, word2) {
    if (!words || words.length === 0) return -1;
    if (word1 === word2) return 0;

    let pos1 = -1;
    let pos2 = -1;
    let minDistance = Infinity;

    for (let i = 0; i < words.length; i++) {
        if (words[i] === word1) {
            pos1 = i;
            if (pos2 !== -1) {
                minDistance = Math.min(minDistance, pos1 - pos2);
            }
        } else if (words[i] === word2) {
            pos2 = i;
            if (pos1 !== -1) {
                minDistance = Math.min(minDistance, pos2 - pos1);
            }
        }
    }

    return minDistance === Infinity ? -1 : minDistance;
}

/**
 * Approach 2: Repeated Queries with Preprocessing
 * For multiple queries on the same file, we preprocess the file to store all
 * positions of each word in a hash map. Then we can find the minimum distance
 * between any two words by comparing their position arrays.
 *
 * Preprocessing: O(n) time, O(n) space
 * Query: O(p1 + p2) where p1, p2 are number of occurrences of the words
 */
class WordDistanceFinder {
    constructor(words) {
        this.wordPositions = new Map();

        // Preprocess: store all positions for each word
        for (let i = 0; i < words.length; i++) {
            if (!this.wordPositions.has(words[i])) {
                this.wordPositions.set(words[i], []);
            }
            this.wordPositions.get(words[i]).push(i);
        }
    }

    /**
     * Find shortest distance between two words using stored positions
     * Uses two-pointer technique on sorted position arrays
     */
    findDistance(word1, word2) {
        if (word1 === word2) return 0;

        const positions1 = this.wordPositions.get(word1);
        const positions2 = this.wordPositions.get(word2);

        if (!positions1 || !positions2) return -1;

        return this.findMinDistance(positions1, positions2);
    }

    /**
     * Find minimum distance between two sorted arrays of positions
     * Uses two-pointer technique
     */
    findMinDistance(positions1, positions2) {
        let i = 0;
        let j = 0;
        let minDistance = Infinity;

        while (i < positions1.length && j < positions2.length) {
            const pos1 = positions1[i];
            const pos2 = positions2[j];

            minDistance = Math.min(minDistance, Math.abs(pos1 - pos2));

            // Move the pointer with the smaller position
            if (pos1 < pos2) {
                i++;
            } else {
                j++;
            }
        }

        return minDistance === Infinity ? -1 : minDistance;
    }

    /**
     * Check if a word exists in the dictionary
     */
    hasWord(word) {
        return this.wordPositions.has(word);
    }

    /**
     * Get all positions of a word
     */
    getPositions(word) {
        return this.wordPositions.get(word) || [];
    }
}

/**
 * Optimized Approach 3: LocationPair class for cleaner code
 * Similar to Approach 2 but with better encapsulation
 */
class LocationPair {
    constructor(location1, location2) {
        this.location1 = location1;
        this.location2 = location2;
    }

    distance() {
        return Math.abs(this.location1 - this.location2);
    }

    isValid() {
        return this.location1 >= 0 && this.location2 >= 0;
    }
}

function findClosestWithLocationPair(positions1, positions2) {
    let i = 0;
    let j = 0;
    let best = new LocationPair(-1, -1);
    let current = new LocationPair(-1, -1);

    while (i < positions1.length && j < positions2.length) {
        current.location1 = positions1[i];
        current.location2 = positions2[j];

        if (!best.isValid() || current.distance() < best.distance()) {
            best = new LocationPair(current.location1, current.location2);
        }

        if (current.location1 < current.location2) {
            i++;
        } else {
            j++;
        }
    }

    return best.isValid() ? best.distance() : -1;
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing Word Distance...\n');

    // Test 1: Basic test case
    console.log('Test 1: Basic test case');
    const words1 = ["the", "quick", "brown", "fox", "quick", "the", "dog"];
    console.log('Words:', words1);
    console.log('Distance("quick", "fox"):', findClosestDistance(words1, "quick", "fox"));
    console.log('Expected: 1\n');

    // Test 2: Words at the ends
    console.log('Test 2: Words at the ends');
    console.log('Distance("the", "dog"):', findClosestDistance(words1, "the", "dog"));
    console.log('Expected: 1 (between positions 5 and 6)\n');

    // Test 3: Same word
    console.log('Test 3: Same word');
    console.log('Distance("quick", "quick"):', findClosestDistance(words1, "quick", "quick"));
    console.log('Expected: 0\n');

    // Test 4: Word not found
    console.log('Test 4: Word not found');
    console.log('Distance("cat", "dog"):', findClosestDistance(words1, "cat", "dog"));
    console.log('Expected: -1\n');

    // Test 5: Multiple occurrences
    console.log('Test 5: Multiple occurrences');
    const words2 = ["a", "b", "c", "a", "d", "b", "a"];
    console.log('Words:', words2);
    console.log('Distance("a", "b"):', findClosestDistance(words2, "a", "b"));
    console.log('Expected: 1 (positions 5 and 6)\n');

    // Test 6: Using WordDistanceFinder for repeated queries
    console.log('Test 6: Repeated queries with preprocessing');
    const finder = new WordDistanceFinder(words1);
    console.log('Words:', words1);
    console.log('Distance("quick", "fox"):', finder.findDistance("quick", "fox"));
    console.log('Distance("the", "dog"):', finder.findDistance("the", "dog"));
    console.log('Distance("brown", "the"):', finder.findDistance("brown", "the"));
    console.log('Expected: 1, 1, 1\n');

    // Test 7: Large text example
    console.log('Test 7: Large text simulation');
    const text = "Once upon a time in a land far far away there lived a wise old owl".split(" ");
    const finder2 = new WordDistanceFinder(text);
    console.log('Text:', text.join(" "));
    console.log('Distance("a", "far"):', finder2.findDistance("a", "far"));
    console.log('Distance("once", "owl"):', finder2.findDistance("once", "owl"));
    console.log('Expected: 1, 12\n');

    // Test 8: Edge cases
    console.log('Test 8: Edge cases');
    console.log('Empty array:', findClosestDistance([], "a", "b"));
    console.log('Single word:', findClosestDistance(["hello"], "hello", "world"));
    console.log('Two words:', findClosestDistance(["hello", "world"], "hello", "world"));
    console.log('Expected: -1, -1, 1\n');

    // Test 9: Performance comparison
    console.log('Test 9: Performance comparison');
    const largeText = Array(10000).fill().map((_, i) => `word${i % 100}`);

    console.time('Single query approach');
    findClosestDistance(largeText, "word5", "word50");
    console.timeEnd('Single query approach');

    console.time('Preprocessing approach - setup');
    const largeFinder = new WordDistanceFinder(largeText);
    console.timeEnd('Preprocessing approach - setup');

    console.time('Preprocessing approach - 100 queries');
    for (let i = 0; i < 100; i++) {
        largeFinder.findDistance("word5", "word50");
    }
    console.timeEnd('Preprocessing approach - 100 queries');

    // Test 10: Get positions
    console.log('\nTest 10: Get word positions');
    console.log('Positions of "a" in text:', finder2.getPositions("a"));
    console.log('Positions of "far" in text:', finder2.getPositions("far"));
    console.log('Has word "once":', finder2.hasWord("once"));
    console.log('Has word "never":', finder2.hasWord("never"));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findClosestDistance,
        WordDistanceFinder,
        LocationPair,
        findClosestWithLocationPair
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
