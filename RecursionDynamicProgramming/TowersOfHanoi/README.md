# Towers of Hanoi / 汉诺塔

## Problem Description / 问题描述

**English:**
In the classic problem of the Towers of Hanoi, you have 3 towers and N disks of different sizes which can slide onto any tower. The puzzle starts with disks sorted in ascending order of size from top to bottom (i.e., each disk sits on top of an even larger one). You have the following constraints:

1. Only one disk can be moved at a time
2. A disk is slid off the top of one tower onto another tower
3. A disk cannot be placed on top of a smaller disk

Write a program to move the disks from the first tower to the last using stacks.

**中文:**
在经典的汉诺塔问题中，你有3个塔和N个不同大小的圆盘，这些圆盘可以滑动到任何塔上。游戏开始时，圆盘按从上到下的大小升序排列（即每个圆盘都位于更大的圆盘之上）。你有以下约束：

1. 一次只能移动一个圆盘
2. 圆盘从一个塔的顶部滑到另一个塔
3. 圆盘不能放在更小的圆盘之上

编写程序使用栈将圆盘从第一个塔移动到最后一个塔。

## Solution / 解决方案

### Recursive Approach / 递归方法 ⭐

**Algorithm:**
To move n disks from origin to destination using buffer:
1. Move n-1 disks from origin to buffer (using destination as temporary storage)
2. Move the largest disk from origin to destination
3. Move n-1 disks from buffer to destination (using origin as temporary storage)

**Base Case:** n = 0, do nothing

**Time Complexity:** O(2^n)
**Space Complexity:** O(n) - recursion stack depth

```javascript
class Tower {
  moveDisks(n, destination, buffer) {
    if (n <= 0) return;

    // Step 1: Move n-1 disks to buffer
    this.moveDisks(n - 1, buffer, destination);

    // Step 2: Move bottom disk to destination
    this.moveTopTo(destination);

    // Step 3: Move n-1 disks from buffer to destination
    buffer.moveDisks(n - 1, destination, this);
  }
}
```

### Example: N = 3 / 示例：N = 3

```
Initial:    Tower 0: [3, 2, 1]
            Tower 1: []
            Tower 2: []

Move 1:     Disk 1: Tower 0 → Tower 2
Move 2:     Disk 2: Tower 0 → Tower 1
Move 3:     Disk 1: Tower 2 → Tower 1
Move 4:     Disk 3: Tower 0 → Tower 2
Move 5:     Disk 1: Tower 1 → Tower 0
Move 6:     Disk 2: Tower 1 → Tower 2
Move 7:     Disk 1: Tower 0 → Tower 2

Final:      Tower 0: []
            Tower 1: []
            Tower 2: [3, 2, 1]
```

## Key Insights / 关键见解

**English:**
1. **Recursive structure:** The problem has a natural recursive structure - to move n disks, we first move n-1 disks
2. **Number of moves:** The minimum number of moves is always 2^n - 1
   - N=1: 1 move
   - N=2: 3 moves
   - N=3: 7 moves
   - N=4: 15 moves
3. **Three-step process:** Every solution follows the pattern: move n-1, move 1, move n-1
4. **Exponential growth:** The problem exhibits exponential time complexity, making it impractical for large n
5. **Optimal solution:** The recursive solution provides the minimum number of moves

**中文:**
1. **递归结构：** 问题具有自然的递归结构 - 要移动n个圆盘，我们首先移动n-1个圆盘
2. **移动次数：** 最小移动次数总是 2^n - 1
   - N=1: 1次移动
   - N=2: 3次移动
   - N=3: 7次移动
   - N=4: 15次移动
3. **三步过程：** 每个解决方案都遵循模式：移动n-1，移动1，移动n-1
4. **指数增长：** 问题表现出指数时间复杂度，使得大n不切实际
5. **最优解：** 递归解决方案提供最少的移动次数

## Recursion Tree / 递归树

For N=3, moving from Tower 0 to Tower 2:

```
                    Move(3, T0→T2, T1)
                    /        |        \
                   /         |         \
        Move(2,T0→T1,T2)  Move(1,T0→T2)  Move(2,T1→T2,T0)
           /    |    \                      /    |    \
          /     |     \                    /     |     \
   M(1,T0→T2) M(1,T0→T1) M(1,T2→T1)  M(1,T1→T0) M(1,T1→T2) M(1,T0→T2)
```

## Mathematical Proof / 数学证明

**Minimum number of moves:**

Let T(n) = number of moves to solve n disks

- T(1) = 1
- T(n) = T(n-1) + 1 + T(n-1) = 2T(n-1) + 1

Solving the recurrence:
- T(n) = 2T(n-1) + 1
- T(n) = 2(2T(n-2) + 1) + 1 = 2²T(n-2) + 2 + 1
- T(n) = 2³T(n-3) + 2² + 2 + 1
- ...
- T(n) = 2^(n-1)T(1) + 2^(n-2) + ... + 2 + 1
- T(n) = 2^(n-1) + 2^(n-2) + ... + 2 + 1
- T(n) = 2^n - 1

## Alternative: Iterative Solution / 替代方案：迭代解决方案

For those interested, there's also an iterative solution:

**Algorithm:**
- For odd n: rotate disks clockwise (0→2→1→0)
- For even n: rotate disks counter-clockwise (0→1→2→0)
- Make total of 2^n - 1 legal moves

**Time Complexity:** O(2^n)
**Space Complexity:** O(1)

## Complexity Analysis / 复杂度分析

| N | Moves | Time |
|---|-------|------|
| 1 | 1 | ~instant |
| 5 | 31 | ~instant |
| 10 | 1,023 | ~instant |
| 20 | 1,048,575 | ~1 second |
| 30 | 1,073,741,823 | ~18 minutes |
| 64 | 18,446,744,073,709,551,615 | ~585 billion years! |

## Test Cases / 测试用例

```javascript
// Basic cases
towersOfHanoi(1)  // 1 move
towersOfHanoi(2)  // 3 moves
towersOfHanoi(3)  // 7 moves

// Validation
const result = towersOfHanoiWithTracking(4);
result.moves.length === 15  // true
result.towers[2].size() === 4  // true (all disks on tower 2)

// Larger case
towersOfHanoi(5)  // 31 moves
```

## Implementation Details / 实现细节

**English:**
- **Tower class:** Encapsulates disk storage and movement operations
- **Validation:** Prevents invalid moves (larger disk on smaller disk)
- **Move tracking:** Optional feature to record all moves for analysis
- **Error handling:** Throws errors for invalid operations

**中文:**
- **塔类：** 封装圆盘存储和移动操作
- **验证：** 防止无效移动（大圆盘在小圆盘上）
- **移动跟踪：** 可选功能，记录所有移动以供分析
- **错误处理：** 对无效操作抛出错误

## Running the Solution / 运行解决方案

```bash
node solution.js
```

## Historical Note / 历史注释

**English:**
The Tower of Hanoi puzzle was invented by French mathematician Édouard Lucas in 1883. The legend says that in a temple in Benares, there are 64 golden disks. Priests move these disks according to the rules. When all disks are moved, the world will end. With 2^64 - 1 moves, this would take approximately 585 billion years!

**中文:**
汉诺塔谜题由法国数学家爱德华·卢卡斯于1883年发明。传说在贝拿勒斯的一座寺庙里，有64个金色圆盘。僧侣们按照规则移动这些圆盘。当所有圆盘都移动完毕时，世界将终结。需要 2^64 - 1 次移动，这大约需要5850亿年！

## Related Problems / 相关问题

- Four Towers of Hanoi (Frame-Stewart algorithm)
- Tower of Hanoi with forbidden moves
- Iterative Tower of Hanoi
- Multi-peg Tower of Hanoi
