/**
 * Rank from Stream - Ranga ze Strumienia
 */

class Node {
  constructor(value) {
    this.value = value;
    this.leftSize = 0; // Liczba węzłów w lewym poddrzewie
    this.left = null;
    this.right = null;
  }
}

class RankTree {
  constructor() {
    this.root = null;
  }

  track(value) {
    if (this.root === null) {
      this.root = new Node(value);
    } else {
      this.insert(this.root, value);
    }
  }

  insert(node, value) {
    if (value <= node.value) {
      // Idź w lewo
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.insert(node.left, value);
      }
      node.leftSize++; // Zwiększ licznik lewego poddrzewa
    } else {
      // Idź w prawo
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.insert(node.right, value);
      }
    }
  }

  getRankOfNumber(value) {
    return this.getRank(this.root, value);
  }

  getRank(node, value) {
    if (node === null) {
      return -1; // Nie znaleziono
    }

    if (value === node.value) {
      return node.leftSize;
    } else if (value < node.value) {
      return this.getRank(node.left, value);
    } else {
      // value > node.value
      const rightRank = this.getRank(node.right, value);
      if (rightRank === -1) return -1;
      return node.leftSize + 1 + rightRank;
    }
  }
}

// TESTY
console.log("=== Rank from Stream ===\n");

const tree = new RankTree();
const stream = [5, 1, 4, 4, 5, 9, 7, 13, 3];

console.log("Stream:", stream);
console.log("\nDodawanie liczb:");
stream.forEach(num => {
  tree.track(num);
  console.log(`  track(${num})`);
});

console.log("\nSprawdzanie rang:");
console.log("getRankOfNumber(1):", tree.getRankOfNumber(1), "// Expected: 0");
console.log("getRankOfNumber(3):", tree.getRankOfNumber(3), "// Expected: 1");
console.log("getRankOfNumber(4):", tree.getRankOfNumber(4), "// Expected: 3");

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RankTree, Node };
}
