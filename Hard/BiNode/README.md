# 17.12 BiNode

## Original Problem

**BiNode:** Consider a simple data structure called BiNode, which has pointers to two other nodes. The data structure could be used to represent both a binary tree (where node1 is the left node and node2 is the right node) or a doubly linked list (where node1 is the previous node and node2 is the next node). Implement a method to convert a binary search tree (implemented with BiNode) into a doubly linked list. The values should be kept in order and the operation should be performed in place (that is, on the original data structure).

```javascript
class BiNode {
  constructor(data) {
    this.data = data;
    this.node1 = null;  // left in BST, prev in DLL
    this.node2 = null;  // right in BST, next in DLL
  }
}
```

Hints: #509, #608, #646, #680, #701, #719

---

## Understanding the Problem

Convert a Binary Search Tree to a sorted Doubly Linked List **in-place**.

```
BST:
        4
       / \
      2   6
     / \ / \
    1  3 5  7

Doubly Linked List (in-order):
  1 ↔ 2 ↔ 3 ↔ 4 ↔ 5 ↔ 6 ↔ 7
```

### Key Insight

**In-order traversal** of a BST gives sorted order!
- Process left subtree
- Process current node
- Process right subtree

We need to link nodes during traversal.

---

## Solution Approaches

### Approach 1: Collect Nodes Then Link

**Strategy:** Traverse BST, collect nodes in array, then link them

```javascript
function convertToLinkedList(root) {
  const nodes = [];

  // In-order traversal to collect nodes
  function inorder(node) {
    if (!node) return;
    inorder(node.node1);  // left
    nodes.push(node);
    inorder(node.node2);  // right
  }

  inorder(root);

  // Link nodes into doubly linked list
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].node1 = i > 0 ? nodes[i - 1] : null;  // prev
    nodes[i].node2 = i < nodes.length - 1 ? nodes[i + 1] : null;  // next
  }

  return nodes[0];  // Return head
}
```

**Time:** O(n)
**Space:** O(n) - array storage (not in-place!)

---

### Approach 2: In-Order Traversal with Linking (Optimal)

**Strategy:** Link nodes during in-order traversal

```javascript
function convertToLinkedList(root) {
  if (!root) return null;

  const result = convertHelper(root);
  return result.head;
}

function convertHelper(node) {
  if (!node) {
    return { head: null, tail: null };
  }

  // Convert left subtree
  const left = convertHelper(node.node1);

  // Convert right subtree
  const right = convertHelper(node.node2);

  // Link current node with left tail
  if (left.tail) {
    left.tail.node2 = node;
    node.node1 = left.tail;
  }

  // Link current node with right head
  if (right.head) {
    node.node2 = right.head;
    right.head.node1 = node;
  }

  // Return head and tail of this subtree's list
  return {
    head: left.head || node,
    tail: right.tail || node
  };
}
```

**Time:** O(n) - visit each node once
**Space:** O(h) - recursion stack height

✅ **OPTIMAL SOLUTION (IN-PLACE)**

---

### Approach 3: Iterative with Stack

**Strategy:** In-order traversal iteratively, link as we go

```javascript
function convertToLinkedList(root) {
  if (!root) return null;

  const stack = [];
  let current = root;
  let prev = null;
  let head = null;

  while (current || stack.length > 0) {
    // Go to leftmost node
    while (current) {
      stack.push(current);
      current = current.node1;
    }

    // Process current node
    current = stack.pop();

    // Link with previous node
    if (prev) {
      prev.node2 = current;
      current.node1 = prev;
    } else {
      head = current;  // First node
    }

    prev = current;
    current = current.node2;  // Go to right
  }

  return head;
}
```

**Time:** O(n)
**Space:** O(h) - stack

---

## Algorithm Explanation

### Recursive Linking Process

```
BST:
        4
       / \
      2   6
     / \
    1   3

Step-by-step:

convertHelper(4):
  left = convertHelper(2):
    left = convertHelper(1):
      left = { head: null, tail: null }
      right = { head: null, tail: null }
      return { head: 1, tail: 1 }

    right = convertHelper(3):
      left = { head: null, tail: null }
      right = { head: null, tail: null }
      return { head: 3, tail: 3 }

    Link: 1 ← 2 → 3
    return { head: 1, tail: 3 }

  right = convertHelper(6):
    return { head: 6, tail: 6 }

  Link left.tail (3) with node (4):
    3 ← 4

  Link node (4) with right.head (6):
    4 → 6

  Final: 1 ↔ 2 ↔ 3 ↔ 4 ↔ 6
  return { head: 1, tail: 6 }
```

### Visual Transformation

```
Before:
        4
       / \
      2   6
     / \
    1   3

node1 = left
node2 = right

After:
  1 ↔ 2 ↔ 3 ↔ 4 ↔ 6

node1 = prev
node2 = next
```

---

## Complexity Analysis

| Approach | Time | Space | In-Place? |
|----------|------|-------|-----------|
| Array Collection | O(n) | O(n) | ❌ |
| Recursive Linking | O(n) | O(h) | ✅ |
| Iterative Stack | O(n) | O(h) | ✅ |

---

## Edge Cases

```javascript
// Empty tree
convertToLinkedList(null) → null

// Single node
    1
→ 1 (node1=null, node2=null)

// Only left children (degenerate)
    3
   /
  2
 /
1
→ 1 ↔ 2 ↔ 3

// Only right children (degenerate)
  1
   \
    2
     \
      3
→ 1 ↔ 2 ↔ 3

// Balanced tree
      4
     / \
    2   6
   / \ / \
  1  3 5  7
→ 1 ↔ 2 ↔ 3 ↔ 4 ↔ 5 ↔ 6 ↔ 7
```

---

## Common Mistakes

### 1. Not returning head and tail

```javascript
// ❌ WRONG - only returning head
function convertHelper(node) {
  // Can't link properly without tail!
  return head;
}

// ✅ CORRECT - return both
return { head: leftHead || node, tail: rightTail || node };
```

### 2. Forgetting bidirectional links

```javascript
// ❌ WRONG - only linking one direction
left.tail.node2 = node;

// ✅ CORRECT - link both directions
left.tail.node2 = node;
node.node1 = left.tail;
```

### 3. Not handling null subtrees

```javascript
// ❌ WRONG - crashes on null
left.tail.node2 = node;

// ✅ CORRECT - check first
if (left.tail) {
  left.tail.node2 = node;
  node.node1 = left.tail;
}
```

---

## Testing the Result

```javascript
function printList(head) {
  const values = [];
  let current = head;

  // Forward traversal
  while (current) {
    values.push(current.data);
    current = current.node2;
  }

  return values;  // Should be sorted
}

function verifyDoublyLinked(head) {
  let current = head;

  // Go forward to end
  let tail = null;
  while (current) {
    tail = current;
    current = current.node2;
  }

  // Go backward to start
  const reverseValues = [];
  current = tail;
  while (current) {
    reverseValues.push(current.data);
    current = current.node1;
  }

  // Should be reverse of forward
  return reverseValues.reverse();
}
```

---

## Variations

### 1. Return tail as well as head

```javascript
function convertToLinkedList(root) {
  const result = convertHelper(root);
  return {
    head: result.head,
    tail: result.tail
  };
}
```

### 2. Circular doubly linked list

```javascript
function convertToCircularList(root) {
  const result = convertHelper(root);

  if (result.head && result.tail) {
    // Link head and tail to make circular
    result.head.node1 = result.tail;
    result.tail.node2 = result.head;
  }

  return result.head;
}
```

### 3. Convert to singly linked list

```javascript
function convertToSinglyLinkedList(root) {
  if (!root) return null;

  let head = null;
  let prev = null;

  function inorder(node) {
    if (!node) return;

    inorder(node.node1);  // Left

    // Process current
    if (!head) head = node;
    if (prev) prev.node2 = node;

    node.node1 = null;  // Clear prev pointer
    prev = node;

    inorder(node.node2);  // Right
  }

  inorder(root);
  return head;
}
```

---

## Interview Tips

1. **Recognize the pattern:** "This is in-order traversal with linking"

2. **Draw it out:**
   ```
   BST:     2          DLL:  1 ↔ 2 ↔ 3
           / \
          1   3
   ```

3. **Explain in-order:** "In-order gives sorted sequence for BST"

4. **Discuss return values:** "We need both head and tail to link subtrees"

5. **Walk through linking:**
   - Left subtree's tail links to current
   - Current links to right subtree's head

6. **Mention space:** "O(h) stack space, but in-place data structure modification"

7. **Test edge cases:** Single node, all left, all right

---

## Key Takeaways

1. **In-order traversal** of BST gives sorted order

2. Return **both head and tail** to enable linking

3. Link during traversal for **in-place** conversion

4. **Bidirectional linking:** Don't forget node1 (prev) pointers

5. Recursion naturally handles tree structure

6. Alternative: iterative with explicit stack

7. This pattern appears in: flatten tree, serialize tree, tree to list conversions

---

**Time Complexity:** O(n)
**Space Complexity:** O(h) recursion stack
**Difficulty:** Hard
