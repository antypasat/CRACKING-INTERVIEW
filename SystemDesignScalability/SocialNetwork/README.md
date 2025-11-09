# 9.2 Social Network Data Structures (社交网络数据结构)

## Problem Statement (问题描述)

**English:**
Design data structures for a large social network like Facebook or LinkedIn. Implement an algorithm to find the shortest path between two people using BFS (Breadth-First Search). The system should handle millions of users and billions of relationships efficiently.

**中文:**
为大型社交网络（如Facebook或LinkedIn）设计数据结构。实现使用BFS（广度优先搜索）查找两个人之间最短路径的算法。系统应该能够高效处理数百万用户和数十亿关系。

---

## Requirements Analysis (需求分析)

### Functional Requirements (功能需求)

**English:**
1. Store user profiles and relationships (friendships)
2. Find shortest path between any two users
3. Get friend list for a user
4. Add/remove friendships
5. Get mutual friends
6. Suggest friends (friends of friends)
7. Handle bi-directional relationships

**中文:**
1. 存储用户资料和关系（好友关系）
2. 查找任意两个用户之间的最短路径
3. 获取用户的好友列表
4. 添加/删除好友关系
5. 获取共同好友
6. 推荐好友（好友的好友）
7. 处理双向关系

### Non-Functional Requirements (非功能需求)

**English:**
- **Scale**: 1 billion users, 100 friends average = 100 billion relationships
- **Performance**: Path finding < 1 second for 6 degrees of separation
- **Availability**: 99.99% uptime
- **Consistency**: Eventually consistent is acceptable for social graphs
- **Storage**: Efficient graph storage and traversal

**中文:**
- **规模**: 10亿用户，平均100个好友 = 1000亿关系
- **性能**: 6度分隔路径查找 < 1秒
- **可用性**: 99.99%正常运行时间
- **一致性**: 社交图可接受最终一致性
- **存储**: 高效的图存储和遍历

---

## High-Level Architecture (高层架构)

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│     (Web App, Mobile App, API Consumers)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               API Gateway / Load Balancer               │
│            (Rate Limiting, Authentication)              │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┬──────────────┐
          │                     │              │
          ▼                     ▼              ▼
┌──────────────────┐  ┌──────────────┐  ┌────────────────┐
│  Profile Service │  │ Graph Service│  │ Search Service │
│                  │  │              │  │                │
│ - User profiles  │  │ - Friends    │  │ - Find paths   │
│ - Metadata       │  │ - Followers  │  │ - Suggestions  │
└────────┬─────────┘  └──────┬───────┘  └────────┬───────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│   PostgreSQL    │  │  Graph Database  │  │    Redis     │
│                 │  │                  │  │              │
│ - User profiles │  │  - Neo4j         │  │ - Cache      │
│ - Attributes    │  │  - JanusGraph    │  │ - Sessions   │
└─────────────────┘  │  - DGraph        │  └──────────────┘
                     │                  │
                     │ Sharded by       │
                     │ user_id hash     │
                     └──────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Background Processing                      │
├─────────────────────────────────────────────────────────┤
│ • Friend Suggestion Worker (friends of friends)         │
│ • Graph Analytics (PageRank, community detection)       │
│ • Data Sync (between services)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Data Structure Design (数据结构设计)

### 1. Graph Representation (图表示)

**English:**

**Adjacency List (Most Common for Social Networks):**
```javascript
// User node
{
  userId: "user123",
  name: "John Doe",
  friends: ["user456", "user789", "user101"] // adjacency list
}

// Advantages:
// - Memory efficient for sparse graphs
// - Fast to iterate over friends
// - Easy to add/remove edges

// Disadvantages:
// - Slower to check if two users are friends (O(d) where d is degree)
```

**Adjacency Matrix (Not Practical for Large Scale):**
```javascript
// For N users, N x N matrix
// matrix[i][j] = 1 if user i is friends with user j

// Advantages:
// - O(1) friendship check

// Disadvantages:
// - O(N²) space complexity
// - Not practical for 1 billion users (10^18 cells!)
```

**中文:**

**邻接表（社交网络最常用）:**
- 优点：稀疏图内存高效，快速遍历好友，易于添加/删除边
- 缺点：检查两个用户是否是好友较慢（O(d)，d是度数）

**邻接矩阵（大规模不实用）:**
- 优点：O(1)好友检查
- 缺点：O(N²)空间复杂度，对10亿用户不实用

### 2. Database Schema (数据库模式)

#### SQL Database (User Profiles) (SQL数据库-用户资料)

```sql
-- Users table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- Friendships table (bi-directional)
CREATE TABLE friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id_1 BIGINT NOT NULL REFERENCES users(user_id),
    user_id_2 BIGINT NOT NULL REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT friendship_unique UNIQUE (user_id_1, user_id_2),
    CONSTRAINT friendship_ordered CHECK (user_id_1 < user_id_2)
);

-- Always store with user_id_1 < user_id_2 to avoid duplicates
CREATE INDEX idx_user1 ON friendships(user_id_1);
CREATE INDEX idx_user2 ON friendships(user_id_2);
CREATE INDEX idx_status ON friendships(status);
```

#### Graph Database (Neo4j) (图数据库)

```cypher
// Create user node
CREATE (u:User {
    userId: "user123",
    username: "johndoe",
    name: "John Doe"
})

// Create friendship relationship
MATCH (u1:User {userId: "user123"})
MATCH (u2:User {userId: "user456"})
CREATE (u1)-[:FRIENDS]->(u2)
CREATE (u2)-[:FRIENDS]->(u1)

// Find shortest path
MATCH path = shortestPath(
    (u1:User {userId: "user123"})-[:FRIENDS*]-(u2:User {userId: "user789"})
)
RETURN path

// Get friends
MATCH (u:User {userId: "user123"})-[:FRIENDS]->(friend:User)
RETURN friend

// Get mutual friends
MATCH (u1:User {userId: "user123"})-[:FRIENDS]->(mutual:User)<-[:FRIENDS]-(u2:User {userId: "user456"})
RETURN mutual
```

### 3. In-Memory Data Structure (内存数据结构)

```javascript
class SocialGraph {
  constructor() {
    // Adjacency list: userId -> Set of friend userIds
    this.adjacencyList = new Map();

    // User metadata cache
    this.users = new Map();
  }

  addUser(userId, userData) {
    this.users.set(userId, userData);
    if (!this.adjacencyList.has(userId)) {
      this.adjacencyList.set(userId, new Set());
    }
  }

  addFriendship(userId1, userId2) {
    // Ensure both users exist
    if (!this.adjacencyList.has(userId1)) {
      this.adjacencyList.set(userId1, new Set());
    }
    if (!this.adjacencyList.has(userId2)) {
      this.adjacencyList.set(userId2, new Set());
    }

    // Bi-directional relationship
    this.adjacencyList.get(userId1).add(userId2);
    this.adjacencyList.get(userId2).add(userId1);
  }

  removeFriendship(userId1, userId2) {
    if (this.adjacencyList.has(userId1)) {
      this.adjacencyList.get(userId1).delete(userId2);
    }
    if (this.adjacencyList.has(userId2)) {
      this.adjacencyList.get(userId2).delete(userId1);
    }
  }

  getFriends(userId) {
    return this.adjacencyList.get(userId) || new Set();
  }

  areFriends(userId1, userId2) {
    if (!this.adjacencyList.has(userId1)) return false;
    return this.adjacencyList.get(userId1).has(userId2);
  }
}
```

---

## BFS Algorithm for Shortest Path (BFS最短路径算法)

### Standard BFS (标准BFS)

**English:**

Time Complexity: O(V + E) where V = vertices (users), E = edges (friendships)
Space Complexity: O(V) for visited set and queue

**中文:**

时间复杂度：O(V + E)，V = 顶点（用户），E = 边（好友关系）
空间复杂度：O(V)用于访问集合和队列

```javascript
class PathFinder {
  /**
   * Find shortest path using BFS
   * 使用BFS查找最短路径
   *
   * @param {Map} graph - Adjacency list representation
   * @param {string} startUserId - Starting user ID
   * @param {string} endUserId - Target user ID
   * @returns {Array|null} - Array of user IDs in path, or null if no path
   */
  findShortestPath(graph, startUserId, endUserId) {
    // Edge cases
    if (startUserId === endUserId) {
      return [startUserId];
    }

    if (!graph.has(startUserId) || !graph.has(endUserId)) {
      return null;
    }

    // BFS setup
    const queue = [[startUserId]]; // Queue of paths
    const visited = new Set([startUserId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const currentUser = path[path.length - 1];

      // Get friends of current user
      const friends = graph.get(currentUser);

      for (const friend of friends) {
        // Found the target!
        if (friend === endUserId) {
          return [...path, friend];
        }

        // Not visited yet, add to queue
        if (!visited.has(friend)) {
          visited.add(friend);
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
  findPathWithDetails(graph, userCache, startUserId, endUserId) {
    const path = this.findShortestPath(graph, startUserId, endUserId);

    if (!path) {
      return null;
    }

    return {
      path: path,
      length: path.length - 1, // Number of hops
      users: path.map(userId => userCache.get(userId))
    };
  }
}
```

### Bi-directional BFS (双向BFS)

**English:**

**Optimization:** Search from both start and end simultaneously, meet in the middle.

**Benefits:**
- Significantly faster for large graphs
- If BFS explores b^d nodes (b = branching factor, d = depth), bi-directional explores 2 * b^(d/2)
- For social networks with avg 100 friends and 6 degrees: 100^6 vs 2 * 100^3 = huge difference!

**中文:**

**优化：** 同时从起点和终点搜索，在中间相遇。

**优势:**
- 对大型图显著更快
- 如果BFS探索b^d个节点（b=分支因子，d=深度），双向BFS探索2 * b^(d/2)
- 对于平均100个好友和6度的社交网络：100^6 vs 2 * 100^3 = 巨大差异！

```javascript
class OptimizedPathFinder {
  /**
   * Bi-directional BFS for faster path finding
   * 双向BFS实现更快的路径查找
   */
  findShortestPathBidirectional(graph, startUserId, endUserId) {
    if (startUserId === endUserId) {
      return [startUserId];
    }

    if (!graph.has(startUserId) || !graph.has(endUserId)) {
      return null;
    }

    // Two BFS searches: one from start, one from end
    const forwardQueue = [[startUserId]];
    const backwardQueue = [[endUserId]];

    const forwardVisited = new Map([[startUserId, [startUserId]]]);
    const backwardVisited = new Map([[endUserId, [endUserId]]]);

    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
      // Forward search
      if (forwardQueue.length > 0) {
        const result = this.bfsStep(
          graph,
          forwardQueue,
          forwardVisited,
          backwardVisited
        );

        if (result) {
          return result;
        }
      }

      // Backward search
      if (backwardQueue.length > 0) {
        const result = this.bfsStep(
          graph,
          backwardQueue,
          backwardVisited,
          forwardVisited
        );

        if (result) {
          return result.reverse();
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
    const path = queue.shift();
    const currentUser = path[path.length - 1];
    const friends = graph.get(currentUser);

    for (const friend of friends) {
      // Check if other search has visited this node (paths meet!)
      if (otherVisited.has(friend)) {
        const otherPath = otherVisited.get(friend);
        return [...path, ...otherPath.slice().reverse()];
      }

      // Not visited in this direction yet
      if (!visited.has(friend)) {
        const newPath = [...path, friend];
        visited.set(friend, newPath);
        queue.push(newPath);
      }
    }

    return null;
  }
}
```

---

## Sharding Strategy (分片策略)

**English:**

For a billion users, we cannot store all data on a single server. We need to shard the graph.

### Sharding by User ID (按用户ID分片)

```javascript
// Hash-based sharding
function getShardForUser(userId, numShards = 1000) {
  // Consistent hashing
  const hash = hashFunction(userId);
  return hash % numShards;
}

// Example: User123 -> Shard 456
// All of User123's data (profile, friend list) is on Shard 456
```

**Advantages:**
- Even distribution of users
- Easy to locate user data

**Disadvantages:**
- Friends may be on different shards
- Path finding requires cross-shard queries

### Graph Partitioning (图分区)

```javascript
// Try to keep friends together on same shard
// Use community detection algorithms (Louvain, Label Propagation)

// Example:
// Shard 1: Users in USA
// Shard 2: Users in Europe
// Shard 3: Users in Asia

// Reduces cross-shard queries for most friend lookups
```

**中文:**

对于10亿用户，我们不能将所有数据存储在单个服务器上。我们需要对图进行分片。

### 按用户ID分片
- 优点：用户均匀分布，易于定位用户数据
- 缺点：好友可能在不同分片上，路径查找需要跨分片查询

### 图分区
- 尝试将好友保持在同一分片上
- 使用社区检测算法（Louvain、标签传播）
- 减少大多数好友查找的跨分片查询

---

## Caching Strategy (缓存策略)

```javascript
class CachedSocialGraph {
  constructor(graphDb, cache) {
    this.db = graphDb;
    this.cache = cache;
  }

  async getFriends(userId) {
    // Try cache first
    const cacheKey = `friends:${userId}`;
    let friends = await this.cache.get(cacheKey);

    if (friends) {
      return friends;
    }

    // Cache miss - fetch from database
    friends = await this.db.getFriends(userId);

    // Cache for 1 hour
    await this.cache.set(cacheKey, friends, 3600);

    return friends;
  }

  async invalidateFriendsCache(userId) {
    await this.cache.delete(`friends:${userId}`);
  }
}
```

**Caching Strategies:**
1. **Friend Lists**: Cache frequently accessed friend lists (1 hour TTL)
2. **Paths**: Cache recently computed paths between popular users (30 min TTL)
3. **Mutual Friends**: Cache mutual friend computations (1 hour TTL)
4. **Degrees of Separation**: Pre-compute for celebrities/popular users

---

## Scalability Considerations (可扩展性考虑)

### Performance Optimizations (性能优化)

**English:**

1. **Early Termination**
   - Stop BFS if path gets too long (e.g., > 6 degrees)
   - Use heuristics to prioritize certain paths

2. **Materialized Friend Lists**
   - Pre-compute and store friend lists in fast storage
   - Update async when friendships change

3. **Friend Suggestion Cache**
   - Pre-compute friends-of-friends for suggestions
   - Update periodically (daily batch job)

4. **Graph Compression**
   - Store only mutual friends in hot cache
   - Full graph in cold storage

5. **Parallel Processing**
   - Distribute path finding across multiple servers
   - Use MapReduce for graph analytics

**中文:**

1. **提前终止**: 如果路径过长（如>6度）停止BFS
2. **物化好友列表**: 预计算并存储好友列表
3. **好友推荐缓存**: 预计算好友的好友
4. **图压缩**: 热缓存仅存储互相好友
5. **并行处理**: 在多个服务器上分布路径查找

---

## Trade-offs (权衡)

| Aspect | Option A | Option B | Recommendation |
|--------|----------|----------|----------------|
| **Graph Storage** | SQL (normalized) | Graph DB (Neo4j) | Graph DB for path queries, SQL for profiles |
| **Path Finding** | Standard BFS | Bi-directional BFS | Bi-directional for better performance |
| **Consistency** | Strong consistency | Eventual consistency | Eventual (friend updates can be async) |
| **Sharding** | By User ID | By Geography/Community | Hybrid (by User ID, optimize locality) |
| **Caching** | Cache everything | Cache popular only | Cache based on access patterns |

---

## API Design (API设计)

```javascript
// REST API endpoints

// Get user profile
GET /api/v1/users/{userId}

// Get friends
GET /api/v1/users/{userId}/friends

// Add friend
POST /api/v1/users/{userId}/friends
Body: { friendId: "user456" }

// Find path
GET /api/v1/users/{userId}/path/{targetUserId}

// Get mutual friends
GET /api/v1/users/{userId}/mutual/{otherUserId}

// Friend suggestions
GET /api/v1/users/{userId}/suggestions

// Degrees of separation
GET /api/v1/users/{userId}/degrees/{targetUserId}
```

---

## Advanced Features (高级功能)

### 1. Degrees of Separation (分隔度数)

```javascript
function getDegreesOfSeparation(graph, userId1, userId2) {
  const path = findShortestPath(graph, userId1, userId2);
  if (!path) return Infinity;
  return path.length - 1; // Number of hops
}
```

### 2. Mutual Friends (共同好友)

```javascript
function getMutualFriends(graph, userId1, userId2) {
  const friends1 = graph.get(userId1);
  const friends2 = graph.get(userId2);

  // Intersection of two sets
  return [...friends1].filter(friend => friends2.has(friend));
}
```

### 3. Friend Suggestions (好友推荐)

```javascript
function suggestFriends(graph, userId, limit = 10) {
  const friends = graph.get(userId);
  const suggestions = new Map(); // friendId -> mutual count

  // Friends of friends
  for (const friend of friends) {
    const friendsOfFriend = graph.get(friend);

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
    .map(([userId, mutualCount]) => ({ userId, mutualCount }));
}
```

---

## Monitoring (监控)

**Key Metrics:**
- Path finding latency (p50, p95, p99)
- Cache hit rate for friend lists
- Cross-shard query rate
- Graph database query time
- Friend suggestion accuracy

**Alerts:**
- Path finding > 1 second
- Cache hit rate < 70%
- Database connection pool exhausted
- Shard imbalance > 20%

---

## References (参考资料)

- Graph Databases: Neo4j, JanusGraph, DGraph
- Six Degrees of Separation theory
- BFS algorithm and optimizations
- Graph partitioning algorithms
- Social network analysis techniques
