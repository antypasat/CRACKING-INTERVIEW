/**
 * CTCI 17.16 - The Masseuse
 *
 * Problem:
 * A popular masseuse receives a sequence of back-to-back appointment requests and is
 * debating which ones to accept. She needs a 15-minute break between appointments and
 * therefore she cannot accept any adjacent requests. Given a sequence of back-to-back
 * appointment requests (all multiples of 15 minutes, none overlap, and none can be moved),
 * find the optimal (highest total booked minutes) set the masseuse can honor. Return the
 * number of minutes.
 *
 * Example:
 * Input: [30, 15, 60, 75, 45, 15, 15, 45]
 * Output: 180 (appointments at indices 0, 2, 4, 7: 30 + 60 + 45 + 45 = 180)
 *
 * Note: This is a classic dynamic programming problem, similar to "House Robber"
 */

/**
 * Approach 1: Recursive with Memoization (Top-Down DP)
 *
 * For each appointment, we have two choices:
 * 1. Take it: current value + best from (i+2) onwards
 * 2. Skip it: best from (i+1) onwards
 *
 * Time: O(n) with memoization
 * Space: O(n) for recursion stack and memoization
 */
function maxMinutesRecursive(appointments) {
    if (!appointments || appointments.length === 0) return 0;

    const memo = new Map();

    function dp(index) {
        if (index >= appointments.length) return 0;

        if (memo.has(index)) {
            return memo.get(index);
        }

        // Option 1: Take current appointment (skip next one)
        const takeIt = appointments[index] + dp(index + 2);

        // Option 2: Skip current appointment
        const skipIt = dp(index + 1);

        const result = Math.max(takeIt, skipIt);
        memo.set(index, result);

        return result;
    }

    return dp(0);
}

/**
 * Approach 2: Iterative Bottom-Up DP
 *
 * Build solution from bottom up using a DP array.
 * dp[i] = maximum minutes from appointments[i..n-1]
 *
 * Time: O(n)
 * Space: O(n)
 */
function maxMinutesIterative(appointments) {
    if (!appointments || appointments.length === 0) return 0;
    if (appointments.length === 1) return appointments[0];

    const n = appointments.length;
    const dp = Array(n + 2).fill(0);

    // Build from right to left
    for (let i = n - 1; i >= 0; i--) {
        // Take current or skip it
        dp[i] = Math.max(
            appointments[i] + dp[i + 2],  // take current
            dp[i + 1]                      // skip current
        );
    }

    return dp[0];
}

/**
 * Approach 3: Space-Optimized Iterative DP
 *
 * We only need to keep track of the last two values, not the entire array.
 *
 * Time: O(n)
 * Space: O(1)
 */
function maxMinutesOptimized(appointments) {
    if (!appointments || appointments.length === 0) return 0;
    if (appointments.length === 1) return appointments[0];

    let twoBack = 0;
    let oneBack = 0;

    for (const appointment of appointments) {
        const current = Math.max(
            appointment + twoBack,  // take current
            oneBack                 // skip current
        );

        twoBack = oneBack;
        oneBack = current;
    }

    return oneBack;
}

/**
 * Approach 4: Alternative DP formulation
 *
 * dp[i] = maximum minutes from appointments[0..i]
 *
 * Time: O(n)
 * Space: O(n)
 */
function maxMinutesAlternative(appointments) {
    if (!appointments || appointments.length === 0) return 0;
    if (appointments.length === 1) return appointments[0];

    const n = appointments.length;
    const dp = Array(n).fill(0);

    dp[0] = appointments[0];
    dp[1] = Math.max(appointments[0], appointments[1]);

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(
            appointments[i] + dp[i - 2],  // take current
            dp[i - 1]                     // skip current
        );
    }

    return dp[n - 1];
}

/**
 * Approach 5: With appointment tracking
 *
 * Returns both the maximum minutes and which appointments were selected.
 *
 * Time: O(n)
 * Space: O(n)
 */
function maxMinutesWithTracking(appointments) {
    if (!appointments || appointments.length === 0) {
        return { maxMinutes: 0, selectedIndices: [] };
    }

    if (appointments.length === 1) {
        return { maxMinutes: appointments[0], selectedIndices: [0] };
    }

    const n = appointments.length;
    const dp = Array(n).fill(0);

    dp[0] = appointments[0];
    dp[1] = Math.max(appointments[0], appointments[1]);

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(
            appointments[i] + dp[i - 2],
            dp[i - 1]
        );
    }

    // Backtrack to find selected appointments
    const selectedIndices = [];
    let i = n - 1;

    while (i >= 0) {
        if (i === 0) {
            selectedIndices.push(0);
            break;
        } else if (i === 1) {
            if (appointments[1] > appointments[0]) {
                selectedIndices.push(1);
            } else {
                selectedIndices.push(0);
            }
            break;
        } else {
            // Check if current was taken
            if (appointments[i] + dp[i - 2] > dp[i - 1]) {
                selectedIndices.push(i);
                i -= 2;
            } else {
                i -= 1;
            }
        }
    }

    return {
        maxMinutes: dp[n - 1],
        selectedIndices: selectedIndices.reverse()
    };
}

/**
 * Approach 6: Optimized with early termination
 *
 * If all appointments are positive, we can use some optimizations.
 *
 * Time: O(n)
 * Space: O(1)
 */
function maxMinutesFast(appointments) {
    if (!appointments || appointments.length === 0) return 0;

    let prev1 = 0; // max minutes if we skip current
    let prev2 = 0; // max minutes if we take current

    for (const appointment of appointments) {
        const temp = prev1;
        prev1 = Math.max(prev1, prev2);
        prev2 = appointment + temp;
    }

    return Math.max(prev1, prev2);
}

/**
 * Approach 7: Handle negative values (if appointments can be negative)
 *
 * Some variations might include penalties or negative values.
 *
 * Time: O(n)
 * Space: O(1)
 */
function maxMinutesWithNegatives(appointments) {
    if (!appointments || appointments.length === 0) return 0;

    let include = 0;
    let exclude = 0;

    for (const appointment of appointments) {
        const newInclude = exclude + appointment;
        const newExclude = Math.max(include, exclude);

        include = newInclude;
        exclude = newExclude;
    }

    return Math.max(include, exclude);
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Verify solution is valid (no adjacent appointments)
 */
function verifySolution(appointments, selectedIndices) {
    if (selectedIndices.length === 0) return true;

    // Check no adjacent indices
    for (let i = 1; i < selectedIndices.length; i++) {
        if (selectedIndices[i] - selectedIndices[i - 1] === 1) {
            return false;
        }
    }

    // Verify sum
    const sum = selectedIndices.reduce((acc, idx) => acc + appointments[idx], 0);

    return sum;
}

/**
 * Generate random appointments for testing
 */
function generateRandomAppointments(length, min = 15, max = 120) {
    return Array.from({ length }, () => {
        const minutes = Math.floor(Math.random() * ((max - min) / 15 + 1)) * 15 + min;
        return minutes;
    });
}

/**
 * Find all optimal solutions (there might be multiple)
 */
function findAllOptimalSolutions(appointments) {
    if (!appointments || appointments.length === 0) return [];

    const n = appointments.length;
    const dp = Array(n).fill(0);
    dp[0] = appointments[0];
    if (n > 1) {
        dp[1] = Math.max(appointments[0], appointments[1]);
    }

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(
            appointments[i] + dp[i - 2],
            dp[i - 1]
        );
    }

    const maxMinutes = dp[n - 1];
    const allSolutions = [];

    // DFS to find all solutions
    function dfs(index, selected, sum) {
        if (index >= n) {
            if (sum === maxMinutes) {
                allSolutions.push([...selected]);
            }
            return;
        }

        // Skip current
        dfs(index + 1, selected, sum);

        // Take current (if no conflict)
        if (selected.length === 0 || selected[selected.length - 1] < index - 1) {
            selected.push(index);
            dfs(index + 1, selected, sum + appointments[index]);
            selected.pop();
        }
    }

    dfs(0, [], 0);
    return allSolutions;
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing The Masseuse...\n');

    // Test 1: Example from problem
    console.log('Test 1: Example from problem');
    const appointments1 = [30, 15, 60, 75, 45, 15, 15, 45];
    console.log('Appointments:', appointments1);
    console.log('Recursive:', maxMinutesRecursive(appointments1));
    console.log('Iterative:', maxMinutesIterative(appointments1));
    console.log('Optimized:', maxMinutesOptimized(appointments1));
    const tracked1 = maxMinutesWithTracking(appointments1);
    console.log('With tracking:', tracked1);
    console.log('Verification:', verifySolution(appointments1, tracked1.selectedIndices));
    console.log('Expected: 180 (indices: 0, 2, 4, 7)\n');

    // Test 2: Simple case
    console.log('Test 2: Simple case');
    const appointments2 = [10, 5, 3, 7, 2];
    console.log('Appointments:', appointments2);
    const tracked2 = maxMinutesWithTracking(appointments2);
    console.log('Result:', tracked2);
    console.log('Verification:', verifySolution(appointments2, tracked2.selectedIndices));
    console.log('Expected: 17 (indices: 0, 3)\n');

    // Test 3: Alternating high-low
    console.log('Test 3: Alternating high-low');
    const appointments3 = [100, 1, 100, 1, 100];
    console.log('Appointments:', appointments3);
    const tracked3 = maxMinutesWithTracking(appointments3);
    console.log('Result:', tracked3);
    console.log('Expected: 300 (indices: 0, 2, 4)\n');

    // Test 4: Single appointment
    console.log('Test 4: Single appointment');
    const appointments4 = [75];
    console.log('Appointments:', appointments4);
    console.log('Result:', maxMinutesOptimized(appointments4));
    console.log('Expected: 75\n');

    // Test 5: Two appointments
    console.log('Test 5: Two appointments');
    const appointments5 = [30, 60];
    console.log('Appointments:', appointments5);
    const tracked5 = maxMinutesWithTracking(appointments5);
    console.log('Result:', tracked5);
    console.log('Expected: 60 (index: 1)\n');

    // Test 6: All same value
    console.log('Test 6: All same value');
    const appointments6 = [15, 15, 15, 15, 15];
    console.log('Appointments:', appointments6);
    const tracked6 = maxMinutesWithTracking(appointments6);
    console.log('Result:', tracked6);
    console.log('Expected: 45 (indices: 0, 2, 4)\n');

    // Test 7: Decreasing values
    console.log('Test 7: Decreasing values');
    const appointments7 = [100, 90, 80, 70, 60, 50];
    console.log('Appointments:', appointments7);
    const tracked7 = maxMinutesWithTracking(appointments7);
    console.log('Result:', tracked7);
    console.log('Verification:', verifySolution(appointments7, tracked7.selectedIndices));
    console.log('Expected: 210 (indices: 0, 2, 4)\n');

    // Test 8: Increasing values
    console.log('Test 8: Increasing values');
    const appointments8 = [10, 20, 30, 40, 50, 60];
    console.log('Appointments:', appointments8);
    const tracked8 = maxMinutesWithTracking(appointments8);
    console.log('Result:', tracked8);
    console.log('Verification:', verifySolution(appointments8, tracked8.selectedIndices));
    console.log('Expected: 120 (indices: 1, 3, 5)\n');

    // Test 9: Empty array
    console.log('Test 9: Empty array');
    console.log('Result:', maxMinutesOptimized([]));
    console.log('Expected: 0\n');

    // Test 10: Large array performance test
    console.log('Test 10: Performance comparison');
    const largeAppointments = generateRandomAppointments(10000);

    console.time('Recursive with memo');
    const r1 = maxMinutesRecursive(largeAppointments);
    console.timeEnd('Recursive with memo');

    console.time('Iterative');
    const r2 = maxMinutesIterative(largeAppointments);
    console.timeEnd('Iterative');

    console.time('Optimized');
    const r3 = maxMinutesOptimized(largeAppointments);
    console.timeEnd('Optimized');

    console.time('Fast');
    const r4 = maxMinutesFast(largeAppointments);
    console.timeEnd('Fast');

    console.log('All equal:', r1 === r2 && r2 === r3 && r3 === r4);
    console.log('Result:', r1);

    // Test 11: Find all optimal solutions
    console.log('\nTest 11: Find all optimal solutions');
    const appointments11 = [10, 10, 10, 10];
    console.log('Appointments:', appointments11);
    const allSolutions = findAllOptimalSolutions(appointments11);
    console.log('All optimal solutions:', allSolutions);
    console.log('Expected: [[0, 2], [1, 3]]\n');

    // Test 12: Edge case - first element is best
    console.log('Test 12: First element is best');
    const appointments12 = [100, 1, 1, 1, 1];
    const tracked12 = maxMinutesWithTracking(appointments12);
    console.log('Appointments:', appointments12);
    console.log('Result:', tracked12);
    console.log('Expected: 102 (indices: 0, 2, 4) or (0, 3)\n');

    // Test 13: Last element is best
    console.log('Test 13: Last element is best');
    const appointments13 = [1, 1, 1, 1, 100];
    const tracked13 = maxMinutesWithTracking(appointments13);
    console.log('Appointments:', appointments13);
    console.log('Result:', tracked13);
    console.log('Expected: 102\n');

    // Test 14: Zigzag pattern
    console.log('Test 14: Zigzag pattern');
    const appointments14 = [5, 10, 5, 10, 5, 10];
    const tracked14 = maxMinutesWithTracking(appointments14);
    console.log('Appointments:', appointments14);
    console.log('Result:', tracked14);
    console.log('Verification:', verifySolution(appointments14, tracked14.selectedIndices));
    console.log('Expected: 30 (indices: 1, 3, 5)\n');

    // Test 15: With negative values (penalties)
    console.log('Test 15: With negative values');
    const appointments15 = [10, -5, 10, -5, 10];
    console.log('Appointments:', appointments15);
    console.log('Result:', maxMinutesWithNegatives(appointments15));
    console.log('Expected: 30 (take indices 0, 2, 4)\n');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxMinutesRecursive,
        maxMinutesIterative,
        maxMinutesOptimized,
        maxMinutesAlternative,
        maxMinutesWithTracking,
        maxMinutesFast,
        maxMinutesWithNegatives,
        verifySolution,
        generateRandomAppointments,
        findAllOptimalSolutions
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
