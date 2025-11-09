/**
 * CTCI 17.12 - BiNode
 *
 * Problem:
 * Consider a simple data structure called BiNode, which has pointers to two other nodes.
 * The data structure BiNode could be used to represent both a binary tree (where node1
 * is the left node and node2 is the right node) or a doubly linked list (where node1
 * is the previous node and node2 is the next node). Implement a method to convert a
 * binary search tree (implemented with BiNode) into a doubly linked list. The values
 * should be kept in order and the operation should be performed in place (that is, on
 * the original data structure).
 *
 * Example:
 *       4
 *      / \
 *     2   6
 *    / \ / \
 *   1  3 5  7
 *
 * Converts to: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6 <-> 7
 */

class BiNode {
    constructor(data) {
        this.data = data;
        this.node1 = null;  // left in BST, prev in linked list
        this.node2 = null;  // right in BST, next in linked list
    }

    // Helper methods for BST operations
    get left() {
        return this.node1;
    }

    set left(node) {
        this.node1 = node;
    }

    get right() {
        return this.node2;
    }

    set right(node) {
        this.node2 = node;
    }

    // Helper methods for linked list operations
    get prev() {
        return this.node1;
    }

    set prev(node) {
        this.node1 = node;
    }

    get next() {
        return this.node2;
    }

    set next(node) {
        this.node2 = node;
    }
}

/**
 * Approach 1: Using In-Order Traversal with Head and Tail Tracking
 *
 * Key Insight:
 * - In-order traversal of BST visits nodes in sorted order
 * - We need to maintain both head and tail of the linked list being built
 * - Each subtree conversion returns its head and tail
 *
 * Time: O(n) - visit each node once
 * Space: O(h) - recursion stack, where h is height
 */

class NodePair {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
}

function convertToLinkedList(root) {
    if (!root) return null;

    const result = convertHelper(root);
    return result.head;
}

function convertHelper(node) {
    if (!node) {
        return new NodePair(null, null);
    }

    // Convert left subtree
    const leftPart = convertHelper(node.left);

    // Convert right subtree
    const rightPart = convertHelper(node.right);

    // Connect left part to current node
    if (leftPart.tail) {
        leftPart.tail.next = node;
        node.prev = leftPart.tail;
    }

    // Connect current node to right part
    if (rightPart.head) {
        node.next = rightPart.head;
        rightPart.head.prev = node;
    }

    // Determine the head and tail of this subtree's linked list
    const head = leftPart.head || node;
    const tail = rightPart.tail || node;

    return new NodePair(head, tail);
}

/**
 * Approach 2: Iterative In-Order Traversal
 *
 * Uses a stack to perform in-order traversal iteratively and builds
 * the linked list as we visit nodes.
 *
 * Time: O(n)
 * Space: O(h) for stack
 */
function convertToLinkedListIterative(root) {
    if (!root) return null;

    const stack = [];
    let current = root;
    let head = null;
    let prev = null;

    while (current || stack.length > 0) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // Process current node
        current = stack.pop();

        // Set head on first node
        if (!head) {
            head = current;
        }

        // Link with previous node
        if (prev) {
            prev.next = current;
            current.prev = prev;
        }

        prev = current;
        current = current.right;
    }

    return head;
}

/**
 * Approach 3: Using a wrapper to track head and tail globally
 *
 * This approach uses a wrapper object to maintain the head and tail
 * throughout the recursive calls.
 *
 * Time: O(n)
 * Space: O(h)
 */
function convertToLinkedListWithWrapper(root) {
    if (!root) return null;

    const wrapper = { head: null, tail: null };
    convertWithWrapper(root, wrapper);
    return wrapper.head;
}

function convertWithWrapper(node, wrapper) {
    if (!node) return;

    // Process left subtree
    convertWithWrapper(node.left, wrapper);

    // Process current node
    if (!wrapper.head) {
        // First node becomes head
        wrapper.head = node;
        wrapper.tail = node;
        node.prev = null;
    } else {
        // Link current node to the end of the list
        wrapper.tail.next = node;
        node.prev = wrapper.tail;
        wrapper.tail = node;
    }

    // Process right subtree
    convertWithWrapper(node.right, wrapper);
}

/**
 * Approach 4: Concatenate sublists
 *
 * This is a cleaner version that explicitly concatenates three parts:
 * left sublist, current node, and right sublist
 *
 * Time: O(n)
 * Space: O(h)
 */
function convertToLinkedListConcat(root) {
    if (!root) return null;

    const result = convertConcat(root);
    return result.head;
}

function convertConcat(node) {
    if (!node) {
        return new NodePair(null, null);
    }

    // Get left and right parts
    const left = convertConcat(node.left);
    const right = convertConcat(node.right);

    // Create a single-node list for current node
    node.prev = null;
    node.next = null;

    // Concatenate: left <-> node <-> right
    const head = concat(left, new NodePair(node, node));
    const result = concat(head, right);

    return result;
}

function concat(left, right) {
    if (!left.head) return right;
    if (!right.head) return left;

    left.tail.next = right.head;
    right.head.prev = left.tail;

    return new NodePair(left.head, right.tail);
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert array to BST (for testing)
 */
function arrayToBST(arr, start = 0, end = arr.length - 1) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node = new BiNode(arr[mid]);

    node.left = arrayToBST(arr, start, mid - 1);
    node.right = arrayToBST(arr, mid + 1, end);

    return node;
}

/**
 * Insert into BST (for testing)
 */
function insertBST(root, data) {
    if (!root) return new BiNode(data);

    if (data < root.data) {
        root.left = insertBST(root.left, data);
    } else {
        root.right = insertBST(root.right, data);
    }

    return root;
}

/**
 * Convert linked list to array (for testing)
 */
function linkedListToArray(head) {
    const result = [];
    let current = head;

    while (current) {
        result.push(current.data);
        current = current.next;
    }

    return result;
}

/**
 * Verify doubly linked list integrity
 */
function verifyDoublyLinkedList(head) {
    if (!head) return true;

    const errors = [];
    let current = head;
    let prev = null;
    const visited = new Set();

    // Check forward links and prev pointers
    while (current) {
        // Check for cycles
        if (visited.has(current)) {
            errors.push(`Cycle detected at node ${current.data}`);
            break;
        }
        visited.add(current);

        // Check prev pointer
        if (current.prev !== prev) {
            errors.push(`Node ${current.data} has incorrect prev pointer`);
        }

        prev = current;
        current = current.next;
    }

    // Go backwards to verify backward links
    current = prev; // Start from tail
    let next = null;

    while (current) {
        if (current.next !== next) {
            errors.push(`Node ${current.data} has incorrect next pointer going backwards`);
        }

        next = current;
        current = current.prev;
    }

    // Verify we reached the head
    if (next !== head) {
        errors.push('Backward traversal did not reach head');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Print tree structure (for debugging)
 */
function printTree(node, prefix = '', isLeft = true) {
    if (!node) return;

    console.log(prefix + (isLeft ? '├── ' : '└── ') + node.data);

    if (node.left || node.right) {
        if (node.left) {
            printTree(node.left, prefix + (isLeft ? '│   ' : '    '), true);
        }
        if (node.right) {
            printTree(node.right, prefix + (isLeft ? '│   ' : '    '), false);
        }
    }
}

/**
 * Print linked list (for debugging)
 */
function printLinkedList(head) {
    const values = [];
    let current = head;
    let count = 0;
    const maxCount = 100; // Prevent infinite loops

    while (current && count < maxCount) {
        values.push(current.data);
        current = current.next;
        count++;
    }

    console.log(values.join(' <-> '));

    if (count >= maxCount) {
        console.log('(truncated - possible cycle)');
    }
}

// =============================================================================
// Tests
// =============================================================================

function runTests() {
    console.log('Testing BiNode Conversion...\n');

    // Test 1: Basic BST
    console.log('Test 1: Basic BST conversion');
    const tree1 = arrayToBST([1, 2, 3, 4, 5, 6, 7]);
    console.log('Original tree:');
    printTree(tree1);
    const list1 = convertToLinkedList(tree1);
    console.log('Linked list:', linkedListToArray(list1).join(' <-> '));
    const verify1 = verifyDoublyLinkedList(list1);
    console.log('Valid:', verify1.valid);
    console.log('Expected: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6 <-> 7\n');

    // Test 2: Single node
    console.log('Test 2: Single node');
    const tree2 = new BiNode(42);
    const list2 = convertToLinkedList(tree2);
    console.log('Linked list:', linkedListToArray(list2).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list2).valid);
    console.log('Expected: 42\n');

    // Test 3: Left-skewed tree
    console.log('Test 3: Left-skewed tree');
    let tree3 = new BiNode(5);
    tree3.left = new BiNode(4);
    tree3.left.left = new BiNode(3);
    tree3.left.left.left = new BiNode(2);
    tree3.left.left.left.left = new BiNode(1);
    console.log('Original tree:');
    printTree(tree3);
    const list3 = convertToLinkedList(tree3);
    console.log('Linked list:', linkedListToArray(list3).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list3).valid);
    console.log('Expected: 1 <-> 2 <-> 3 <-> 4 <-> 5\n');

    // Test 4: Right-skewed tree
    console.log('Test 4: Right-skewed tree');
    let tree4 = new BiNode(1);
    tree4.right = new BiNode(2);
    tree4.right.right = new BiNode(3);
    tree4.right.right.right = new BiNode(4);
    tree4.right.right.right.right = new BiNode(5);
    console.log('Original tree:');
    printTree(tree4);
    const list4 = convertToLinkedList(tree4);
    console.log('Linked list:', linkedListToArray(list4).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list4).valid);
    console.log('Expected: 1 <-> 2 <-> 3 <-> 4 <-> 5\n');

    // Test 5: Iterative approach
    console.log('Test 5: Iterative approach');
    const tree5 = arrayToBST([1, 2, 3, 4, 5, 6, 7]);
    const list5 = convertToLinkedListIterative(tree5);
    console.log('Linked list:', linkedListToArray(list5).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list5).valid);
    console.log('Expected: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6 <-> 7\n');

    // Test 6: Wrapper approach
    console.log('Test 6: Wrapper approach');
    const tree6 = arrayToBST([10, 20, 30, 40, 50]);
    const list6 = convertToLinkedListWithWrapper(tree6);
    console.log('Linked list:', linkedListToArray(list6).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list6).valid);
    console.log('Expected: 10 <-> 20 <-> 30 <-> 40 <-> 50\n');

    // Test 7: Concat approach
    console.log('Test 7: Concat approach');
    const tree7 = arrayToBST([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const list7 = convertToLinkedListConcat(tree7);
    console.log('Linked list:', linkedListToArray(list7).join(' <-> '));
    console.log('Valid:', verifyDoublyLinkedList(list7).valid);
    console.log('Expected: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6 <-> 7 <-> 8 <-> 9\n');

    // Test 8: Empty tree
    console.log('Test 8: Empty tree');
    const list8 = convertToLinkedList(null);
    console.log('Result:', list8);
    console.log('Expected: null\n');

    // Test 9: Large tree
    console.log('Test 9: Large tree (performance test)');
    const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1);
    const largeTree = arrayToBST(largeArray);
    console.time('Convert large tree');
    const largeList = convertToLinkedList(largeTree);
    console.timeEnd('Convert large tree');
    const largeVerify = verifyDoublyLinkedList(largeList);
    console.log('Valid:', largeVerify.valid);
    console.log('First 10 elements:', linkedListToArray(largeList).slice(0, 10).join(' <-> '));
    console.log('Last 10 elements:', linkedListToArray(largeList).slice(-10).join(' <-> '));

    // Test 10: Verify backward traversal
    console.log('\nTest 10: Backward traversal');
    const tree10 = arrayToBST([1, 2, 3, 4, 5]);
    const list10 = convertToLinkedList(tree10);
    console.log('Forward:', linkedListToArray(list10).join(' <-> '));

    // Go to tail
    let tail = list10;
    while (tail.next) {
        tail = tail.next;
    }

    // Traverse backward
    const backward = [];
    let current = tail;
    while (current) {
        backward.push(current.data);
        current = current.prev;
    }
    console.log('Backward:', backward.join(' <-> '));
    console.log('Expected forward: 1 <-> 2 <-> 3 <-> 4 <-> 5');
    console.log('Expected backward: 5 <-> 4 <-> 3 <-> 2 <-> 1');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BiNode,
        NodePair,
        convertToLinkedList,
        convertToLinkedListIterative,
        convertToLinkedListWithWrapper,
        convertToLinkedListConcat,
        arrayToBST,
        linkedListToArray,
        verifyDoublyLinkedList,
        printTree,
        printLinkedList
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
