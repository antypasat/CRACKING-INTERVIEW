/**
 * Social Network Data Structures and Algorithms
 * Demonstrates: Graph representation, BFS, bi-directional search, caching
 */

// ============================================================================
// 1. Basic Graph Data Structure (基础图数据结构)
// ============================================================================

class SocialGraph {
  constructor() {
    // Adjacency list: userId -> Set of friend userIds
    this.adjacencyList = new Map();

    // User metadata cache
    this.users = new Map();

    // Statistics
    this.stats = {
      totalUsers: 0,
      totalFriendships: 0
    };
  }

  /**
   * Add a user to the graph
   * 添加用户到图中
   */
  addUser(userId, userData = {}) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        userId,
        name: userData.name || `User ${userId}`,
        ...userData
      });
      this.stats.totalUsers++;
    }

    if (!this.adjacencyList.has(userId)) {
      this.adjacencyList.set(userId, new Set());
    }
  }

  /**
   * Add bi-directional friendship
   * 添加双向好友关系
   */
  addFriendship(userId1, userId2) {
    // Ensure both users exist
    if (!this.users.has(userId1)) {
      this.addUser(userId1);
    }
    if (!this.users.has(userId2)) {
      this.addUser(userId2);
    }

    // Check if friendship already exists
    const friends1 = this.adjacencyList.get(userId1);
    if (!friends1.has(userId2)) {
      // Add bi-directional relationship
      this.adjacencyList.get(userId1).add(userId2);
      this.adjacencyList.get(userId2).add(userId1);
      this.stats.totalFriendships++;
    }
  }

  /**
   * Remove friendship
   * 移除好友关系
   */
  removeFriendship(userId1, userId2) {
    if (this.adjacencyList.has(userId1)) {
      const friends1 = this.adjacencyList.get(userId1);
      if (friends1.has(userId2)) {
        friends1.delete(userId2);
        this.adjacencyList.get(userId2).delete(userId1);
        this.stats.totalFriendships--;
      }
    }
  }

  /**
   * Get friends of a user
   * 获取用户的好友
   */
  getFriends(userId) {
    return this.adjacencyList.get(userId) || new Set();
  }

  /**
   * Check if two users are friends
   * 检查两个用户是否是好友
   */
  areFriends(userId1, userId2) {
    if (!this.adjacencyList.has(userId1)) return false;
    return this.adjacencyList.get(userId1).has(userId2);
  }

  /**
   * Get user data
   * 获取用户数据
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * Get degree (number of friends)
   * 获取度数（好友数量）
   */
  getDegree(userId) {
    const friends = this.adjacencyList.get(userId);
    return friends ? friends.size : 0;
  }

  /**
   * Get graph statistics
   * 获取图统计信息
   */
  getStats() {
    return {
      ...this.stats,
      avgDegree: this.stats.totalUsers > 0
        ? (this.stats.totalFriendships * 2 / this.stats.totalUsers).toFixed(2)
        : 0
    };
  }
}

// ============================================================================
// 2. Standard BFS Path Finding (标准BFS路径查找)
// ============================================================================

class PathFinder {
  /**
   * Find shortest path using standard BFS
   * 使用标准BFS查找最短路径
   *
   * Time: O(V + E) where V = vertices, E = edges
   * Space: O(V) for queue and visited set
   */
  findShortestPath(graph, startUserId, endUserId) {
    // Edge cases
    if (startUserId === endUserId) {
      return {
        path: [startUserId],
        length: 0,
        nodesVisited: 1
      };
    }

    if (!graph.adjacencyList.has(startUserId) || !graph.adjacencyList.has(endUserId)) {
      return null;
    }

    // BFS setup
    const queue = [[startUserId]]; // Queue of paths
    const visited = new Set([startUserId]);
    let nodesVisited = 1;

    while (queue.length > 0) {
      const path = queue.shift();
      const currentUser = path[path.length - 1];

      // Get friends of current user
      const friends = graph.getFriends(currentUser);

      for (const friend of friends) {
        // Found the target!
        if (friend === endUserId) {
          return {
            path: [...path, friend],
            length: path.length, // Number of hops
            nodesVisited: nodesVisited + 1
          };
        }

        // Not visited yet, add to queue
        if (!visited.has(friend)) {
          visited.add(friend);
          nodesVisited++;
          queue.push([...path, friend]);
        }
      }
    }

    // No path found
    return null;
  }

  /**
   * Find path with user details
   * 查找包含用户详情的路径
   */
  findPathWithDetails(graph, startUserId, endUserId) {
    const result = this.findShortestPath(graph, startUserId, endUserId);

    if (!result) {
      return null;
    }

    return {
      ...result,
      users: result.path.map(userId => graph.getUser(userId))
    };
  }

  /**
   * Find all paths up to a certain length (for analysis)
   * 查找指定长度内的所有路径
   */
  findAllPaths(graph, startUserId, endUserId, maxLength = 6) {
    const allPaths = [];
    const visited = new Set();

    const dfs = (currentPath) => {
      const currentUser = currentPath[currentPath.length - 1];

      // Found a path
      if (currentUser === endUserId) {
        allPaths.push([...currentPath]);
        return;
      }

      // Exceeded max length
      if (currentPath.length > maxLength) {
        return;
      }

      visited.add(currentUser);

      const friends = graph.getFriends(currentUser);
      for (const friend of friends) {
        if (!visited.has(friend)) {
          currentPath.push(friend);
          dfs(currentPath);
          currentPath.pop();
        }
      }

      visited.delete(currentUser);
    };

    dfs([startUserId]);
    return allPaths;
  }
}

// ============================================================================
// 3. Optimized Bi-directional BFS (优化的双向BFS)
// ============================================================================

class OptimizedPathFinder {
  /**
   * Bi-directional BFS for faster path finding
   * 双向BFS实现更快的路径查找
   *
   * For a graph with branching factor b and depth d:
   * - Standard BFS: O(b^d)
   * - Bi-directional BFS: O(2 * b^(d/2))
   *
   * Example: b=100, d=6
   * - Standard: 100^6 = 1,000,000,000,000 nodes
   * - Bi-directional: 2 * 100^3 = 2,000,000 nodes
   */
  findShortestPath(graph, startUserId, endUserId) {
    if (startUserId === endUserId) {
      return {
        path: [startUserId],
        length: 0,
        nodesVisited: 1
      };
    }

    if (!graph.adjacencyList.has(startUserId) || !graph.adjacencyList.has(endUserId)) {
      return null;
    }

    // Two BFS searches: one from start, one from end
    const forwardQueue = [startUserId];
    const backwardQueue = [endUserId];

    // Map: userId -> parent userId (for path reconstruction)
    const forwardParent = new Map([[startUserId, null]]);
    const backwardParent = new Map([[endUserId, null]]);

    let nodesVisited = 2;
    let meetingPoint = null;

    // Alternate between forward and backward search
    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
      // Forward search step
      if (forwardQueue.length > 0) {
        meetingPoint = this.bfsStep(
          graph,
          forwardQueue,
          forwardParent,
          backwardParent
        );

        nodesVisited += forwardQueue.length;

        if (meetingPoint) {
          const path = this.reconstructPath(
            forwardParent,
            backwardParent,
            startUserId,
            endUserId,
            meetingPoint
          );
          return {
            path,
            length: path.length - 1,
            nodesVisited
          };
        }
      }

      // Backward search step
      if (backwardQueue.length > 0) {
        meetingPoint = this.bfsStep(
          graph,
          backwardQueue,
          backwardParent,
          forwardParent
        );

        nodesVisited += backwardQueue.length;

        if (meetingPoint) {
          const path = this.reconstructPath(
            forwardParent,
            backwardParent,
            startUserId,
            endUserId,
            meetingPoint
          );
          return {
            path,
            length: path.length - 1,
            nodesVisited
          };
        }
      }
    }

    return null;
  }

  /**
   * Single BFS step
   * 单步BFS
   */
  bfsStep(graph, queue, visited, otherVisited) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentUser = queue.shift();
      const friends = graph.getFriends(currentUser);

      for (const friend of friends) {
        // Check if other search has visited this node (paths meet!)
        if (otherVisited.has(friend)) {
          return friend; // Meeting point found
        }

        // Not visited in this direction yet
        if (!visited.has(friend)) {
          visited.set(friend, currentUser); // Store parent
          queue.push(friend);
        }
      }
    }

    return null;
  }

  /**
   * Reconstruct path from meeting point
   * 从相遇点重建路径
   */
  reconstructPath(forwardParent, backwardParent, start, end, meetingPoint) {
    const path = [];

    // Build forward path (start -> meeting point)
    let current = meetingPoint;
    while (current !== null) {
      path.unshift(current);
      current = forwardParent.get(current);
    }

    // Build backward path (meeting point -> end)
    current = backwardParent.get(meetingPoint);
    while (current !== null) {
      path.push(current);
      current = backwardParent.get(current);
    }

    return path;
  }
}

// ============================================================================
// 4. Social Network Features (社交网络功能)
// ============================================================================

class SocialNetworkService {
  constructor(graph) {
    this.graph = graph;
    this.pathFinder = new OptimizedPathFinder();
  }

  /**
   * Get mutual friends
   * 获取共同好友
   */
  getMutualFriends(userId1, userId2) {
    const friends1 = this.graph.getFriends(userId1);
    const friends2 = this.graph.getFriends(userId2);

    // Intersection of two sets
    const mutual = [...friends1].filter(friend => friends2.has(friend));

    return {
      count: mutual.length,
      friends: mutual.map(id => this.graph.getUser(id))
    };
  }

  /**
   * Suggest friends (friends of friends)
   * 推荐好友（好友的好友）
   */
  suggestFriends(userId, limit = 10) {
    const friends = this.graph.getFriends(userId);
    const suggestions = new Map(); // friendId -> mutual count

    // Friends of friends
    for (const friend of friends) {
      const friendsOfFriend = this.graph.getFriends(friend);

      for (const fof of friendsOfFriend) {
        // Don't suggest self or existing friends
        if (fof !== userId && !friends.has(fof)) {
          suggestions.set(fof, (suggestions.get(fof) || 0) + 1);
        }
      }
    }

    // Sort by mutual friends count
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, mutualCount]) => ({
        user: this.graph.getUser(userId),
        mutualFriends: mutualCount
      }));
  }

  /**
   * Get degrees of separation
   * 获取分隔度数
   */
  getDegreesOfSeparation(userId1, userId2) {
    const result = this.pathFinder.findShortestPath(this.graph, userId1, userId2);
    return result ? result.length : Infinity;
  }

  /**
   * Find connection path with details
   * 查找包含详情的连接路径
   */
  findConnectionPath(userId1, userId2) {
    const result = this.pathFinder.findShortestPath(this.graph, userId1, userId2);

    if (!result) {
      return null;
    }

    return {
      degrees: result.length,
      nodesVisited: result.nodesVisited,
      path: result.path.map((userId, index) => ({
        user: this.graph.getUser(userId),
        step: index
      }))
    };
  }

  /**
   * Get friend network stats for a user
   * 获取用户的好友网络统计
   */
  getFriendNetworkStats(userId) {
    const friends = this.graph.getFriends(userId);
    const friendDegrees = Array.from(friends).map(friendId =>
      this.graph.getDegree(friendId)
    );

    return {
      totalFriends: friends.size,
      avgFriendDegree: friendDegrees.length > 0
        ? (friendDegrees.reduce((a, b) => a + b, 0) / friendDegrees.length).toFixed(2)
        : 0,
      maxFriendDegree: friendDegrees.length > 0 ? Math.max(...friendDegrees) : 0,
      minFriendDegree: friendDegrees.length > 0 ? Math.min(...friendDegrees) : 0
    };
  }

  /**
   * Calculate clustering coefficient (how interconnected friends are)
   * 计算聚类系数（好友之间的连接程度）
   */
  getClusteringCoefficient(userId) {
    const friends = Array.from(this.graph.getFriends(userId));
    const n = friends.length;

    if (n < 2) return 0;

    // Count connections between friends
    let connections = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (this.graph.areFriends(friends[i], friends[j])) {
          connections++;
        }
      }
    }

    // Clustering coefficient = actual connections / possible connections
    const possibleConnections = (n * (n - 1)) / 2;
    return (connections / possibleConnections).toFixed(4);
  }
}

// ============================================================================
// 5. Caching Layer (缓存层)
// ============================================================================

class CachedSocialGraph {
  constructor(graph, cacheConfig = {}) {
    this.graph = graph;
    this.cache = new Map();
    this.cacheTTL = cacheConfig.ttl || 3600000; // 1 hour default
    this.cacheStats = {
      hits: 0,
      misses: 0
    };
  }

  /**
   * Get friends with caching
   * 带缓存获取好友
   */
  getFriends(userId) {
    const cacheKey = `friends:${userId}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      this.cacheStats.hits++;
      return cached;
    }

    this.cacheStats.misses++;
    const friends = this.graph.getFriends(userId);
    this.setCache(cacheKey, friends);

    return friends;
  }

  /**
   * Invalidate cache for a user
   * 使用户的缓存失效
   */
  invalidateUserCache(userId) {
    // Remove friends cache
    this.cache.delete(`friends:${userId}`);

    // Also invalidate caches of all friends (their mutual friends changed)
    const friends = this.graph.getFriends(userId);
    for (const friendId of friends) {
      this.cache.delete(`friends:${friendId}`);
    }
  }

  getFromCache(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  setCache(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  getCacheStats() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    return {
      ...this.cacheStats,
      hitRate: total > 0
        ? ((this.cacheStats.hits / total) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
}

// ============================================================================
// 6. Demo and Testing (演示和测试)
// ============================================================================

function runDemo() {
  console.log('='.repeat(60));
  console.log('Social Network Demo - BFS Path Finding');
  console.log('='.repeat(60));

  // Create social graph
  const graph = new SocialGraph();

  // Add users
  const users = [
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
    { id: 'charlie', name: 'Charlie' },
    { id: 'david', name: 'David' },
    { id: 'eve', name: 'Eve' },
    { id: 'frank', name: 'Frank' },
    { id: 'grace', name: 'Grace' },
    { id: 'henry', name: 'Henry' }
  ];

  users.forEach(user => graph.addUser(user.id, user));

  // Create friendships
  const friendships = [
    ['alice', 'bob'],
    ['alice', 'charlie'],
    ['bob', 'david'],
    ['charlie', 'eve'],
    ['david', 'frank'],
    ['eve', 'frank'],
    ['frank', 'grace'],
    ['grace', 'henry']
  ];

  friendships.forEach(([u1, u2]) => graph.addFriendship(u1, u2));

  console.log('\n1. Graph Statistics:');
  console.log(graph.getStats());

  // Test path finding
  const service = new SocialNetworkService(graph);

  console.log('\n2. Find Path (Alice -> Henry):');
  const path = service.findConnectionPath('alice', 'henry');
  if (path) {
    console.log(`   Degrees of Separation: ${path.degrees}`);
    console.log(`   Nodes Visited: ${path.nodesVisited}`);
    console.log('   Path:');
    path.path.forEach(step => {
      console.log(`     ${step.step}. ${step.user.name} (${step.user.userId})`);
    });
  }

  console.log('\n3. Mutual Friends (Bob & Charlie):');
  const mutual = service.getMutualFriends('bob', 'charlie');
  console.log(`   Count: ${mutual.count}`);
  mutual.friends.forEach(friend => console.log(`   - ${friend.name}`));

  console.log('\n4. Friend Suggestions (Alice):');
  const suggestions = service.suggestFriends('alice', 5);
  suggestions.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.user.name} (${s.mutualFriends} mutual friends)`);
  });

  console.log('\n5. Network Stats (Alice):');
  const stats = service.getFriendNetworkStats('alice');
  console.log(stats);

  console.log('\n6. Clustering Coefficient (Alice):');
  const clustering = service.getClusteringCoefficient('alice');
  console.log(`   ${clustering} (0 = no connections, 1 = fully connected)`);

  // Performance comparison
  console.log('\n7. Performance Comparison (Standard vs Bi-directional BFS):');

  const standardFinder = new PathFinder();
  const optimizedFinder = new OptimizedPathFinder();

  const start = 'alice';
  const end = 'henry';

  const result1 = standardFinder.findShortestPath(graph, start, end);
  const result2 = optimizedFinder.findShortestPath(graph, start, end);

  console.log(`   Standard BFS - Nodes Visited: ${result1.nodesVisited}`);
  console.log(`   Bi-directional BFS - Nodes Visited: ${result2.nodesVisited}`);
  console.log(`   Improvement: ${((1 - result2.nodesVisited / result1.nodesVisited) * 100).toFixed(1)}%`);

  console.log('\n' + '='.repeat(60));
}

// Run demo if executed directly
if (require.main === module) {
  runDemo();
}

// ============================================================================
// 7. Exports (导出)
// ============================================================================

module.exports = {
  SocialGraph,
  PathFinder,
  OptimizedPathFinder,
  SocialNetworkService,
  CachedSocialGraph,
  runDemo
};
