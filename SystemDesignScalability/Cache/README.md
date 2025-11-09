# Cache - Distributed Caching System / 分布式缓存系统

## Problem Description / 问题描述

**English:**
Design a distributed caching system for search queries across 100 machines. The system should handle millions of queries per second, implement efficient eviction policies, and ensure high availability and low latency.

**中文:**
设计一个分布式缓存系统，用于在100台机器上缓存搜索查询。系统应该能够处理每秒数百万次查询，实现高效的驱逐策略，并确保高可用性和低延迟。

## Requirements Analysis / 需求分析

### Functional Requirements / 功能需求

1. **Cache Operations / 缓存操作**
   - Get: Retrieve cached search results
   - Set: Store search results in cache
   - Delete: Remove entries from cache
   - Batch operations for efficiency

2. **Eviction Policy / 驱逐策略**
   - LRU (Least Recently Used) for automatic eviction
   - TTL (Time To Live) for expiration
   - Memory-based eviction when capacity reached

3. **Distribution / 分布**
   - Consistent hashing for data distribution
   - Replication for high availability
   - Load balancing across cache servers

### Non-Functional Requirements / 非功能需求

1. **Performance / 性能**
   - Latency: < 1ms for cache hits
   - Throughput: Handle millions of QPS
   - Hit rate: > 90% for popular queries

2. **Scalability / 可扩展性**
   - Horizontal scaling by adding more nodes
   - Handle growing data and traffic
   - Dynamic node addition/removal

3. **Availability / 可用性**
   - 99.99% uptime
   - Fault tolerance with replication
   - Graceful degradation

4. **Consistency / 一致性**
   - Eventually consistent across replicas
   - Strong consistency for critical data (optional)

## High-Level Architecture / 高层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Web App │  │ Mobile   │  │  Search  │  │   API    │       │
│  │          │  │   App    │  │  Service │  │ Gateway  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼─────────────────────────────────────────────────────────┐
│               Cache Client Library / SDK                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Connection  │  │  Consistent  │  │   Retry &    │         │
│  │    Pool      │  │   Hashing    │  │  Failover    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────┬─────────────────────────────────────────────────────────┘
        │
        │         Consistent Hashing Ring
        │    ┌─────────────────────────────┐
        │    │   Hash(key) → Server Node   │
        │    └─────────────────────────────┘
        │
┌───────┴─────────────────────────────────────────────────────────┐
│                   Cache Cluster Layer                           │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Cache     │  │   Cache     │  │   Cache     │            │
│  │  Server 1   │  │  Server 2   │  │  Server N   │            │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤            │
│  │ LRU Cache   │  │ LRU Cache   │  │ LRU Cache   │            │
│  │ Hash Table  │  │ Hash Table  │  │ Hash Table  │            │
│  │ Stats       │  │ Stats       │  │ Stats       │            │
│  └─────┬───────┘  └─────┬───────┘  └─────┬───────┘            │
│        │                 │                 │                    │
└────────┼─────────────────┼─────────────────┼────────────────────┘
         │                 │                 │
         │    Replication & Sync             │
         └────────┬────────┴─────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│               Coordination Layer (Optional)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  ZooKeeper   │  │   Cluster    │  │   Health     │         │
│  │  / etcd      │  │   Metadata   │  │  Monitoring  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                  Monitoring & Metrics                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Prometheus  │  │   Grafana    │  │   Alerting   │         │
│  │   Metrics    │  │  Dashboard   │  │    System    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structures / 数据结构

### LRU Cache Implementation / LRU缓存实现

```
┌─────────────────────────────────────────────────────────────────┐
│                         LRU Cache                               │
│                                                                  │
│  Hash Map (O(1) lookup)                                         │
│  ┌──────────┬──────────────┐                                   │
│  │   Key    │    Node*     │                                   │
│  ├──────────┼──────────────┤                                   │
│  │ "query1" │  ─────┐      │                                   │
│  │ "query2" │  ─────┼──┐   │                                   │
│  │ "query3" │  ─────┼──┼─┐ │                                   │
│  └──────────┴──────┬┴──┴─┴─┘                                   │
│                    │  │   │                                     │
│  Doubly Linked List (O(1) insertion/deletion)                  │
│                    ▼  ▼   ▼                                     │
│  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐           │
│  │  HEAD  │◄─►│ Node 3 │◄─►│ Node 2 │◄─►│ Node 1 │◄─►TAIL    │
│  │ (Most  │   │  Key   │   │  Key   │   │  Key   │   (Least  │
│  │ Recent)│   │  Value │   │  Value │   │  Value │   Recent) │
│  └────────┘   │  TTL   │   │  TTL   │   │  TTL   │           │
│               └────────┘   └────────┘   └────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Consistent Hashing / 一致性哈希

```
                  Virtual Nodes on Hash Ring

                      Server A-1
                         ▲
                    (320°)│
                          │
    Server B-2 ◄──────────┼──────────► Server C-1
      (240°)              │               (40°)
                          │
                    ┌─────┴─────┐
                    │   Hash    │
                    │   Ring    │
                    │  (0-360°) │
                    └─────┬─────┘
                          │
     Server A-2 ◄─────────┼──────────► Server B-1
       (180°)             │               (120°)
                          │
                        (280°)
                          │
                      Server C-2

Key Distribution Algorithm:
1. Hash(key) → angle on ring (0-360°)
2. Find next clockwise server node
3. Use that server for the key
4. Fallback to next node if server fails
```

## Database Schema / 数据库模式

### Cache Entry Structure / 缓存条目结构

```javascript
{
  key: String,           // Search query hash or identifier
  value: Object,         // Cached search results
  metadata: {
    createdAt: Timestamp,
    accessedAt: Timestamp,
    accessCount: Integer,
    ttl: Integer,        // Time to live in seconds
    size: Integer,       // Size in bytes
    compressed: Boolean
  }
}
```

### Cache Node Metadata / 缓存节点元数据

```javascript
{
  nodeId: String,
  hostname: String,
  port: Integer,
  virtualNodes: Array[String],  // Virtual node identifiers
  capacity: {
    total: Integer,      // Total memory in bytes
    used: Integer,       // Used memory in bytes
    available: Integer
  },
  stats: {
    hitRate: Float,
    missRate: Float,
    evictionCount: Integer,
    requestsPerSecond: Integer
  },
  status: Enum["ACTIVE", "DRAINING", "DOWN"],
  healthCheck: {
    lastCheck: Timestamp,
    isHealthy: Boolean
  }
}
```

## API Specifications / API规范

### Cache Operations API

```
GET /cache/{key}
Description: Retrieve cached value
Response:
  200 OK: { value: Object, metadata: Object }
  404 Not Found: { error: "Cache miss" }
  503 Service Unavailable: { error: "Cache unavailable" }

PUT /cache/{key}
Description: Store value in cache
Body: { value: Object, ttl: Integer }
Response:
  201 Created: { success: true, key: String }
  400 Bad Request: { error: "Invalid request" }

DELETE /cache/{key}
Description: Remove value from cache
Response:
  204 No Content
  404 Not Found: { error: "Key not found" }

POST /cache/batch
Description: Batch operations
Body: { operations: Array[{op: "get"|"set"|"delete", key: String, value: Object}] }
Response:
  200 OK: { results: Array[{key: String, success: Boolean, value: Object}] }
```

### Admin API

```
GET /admin/nodes
Description: List all cache nodes
Response: { nodes: Array[NodeMetadata] }

GET /admin/stats
Description: Get cluster statistics
Response: {
  totalNodes: Integer,
  totalCapacity: Integer,
  totalUsed: Integer,
  avgHitRate: Float,
  totalRequests: Integer
}

POST /admin/nodes/{nodeId}/drain
Description: Gracefully drain a node
Response: { success: true, message: "Node draining" }

POST /admin/invalidate
Description: Invalidate cache entries by pattern
Body: { pattern: String }
Response: { invalidatedCount: Integer }
```

## Key Design Considerations / 关键设计考虑

### 1. Cache Eviction Strategies / 缓存驱逐策略

**LRU (Least Recently Used) / 最近最少使用**
- Evict least recently accessed items when capacity reached
- O(1) get and put operations using HashMap + Doubly Linked List
- Good for most web caching scenarios

**LFU (Least Frequently Used) / 最不经常使用**
- Evict least frequently accessed items
- Better for workloads with clear hot/cold data patterns
- More complex implementation

**TTL-Based Expiration / 基于TTL的过期**
- Automatic expiration after time period
- Active expiration: Background task checks periodically
- Passive expiration: Check on access
- Combination of both for efficiency

### 2. Consistent Hashing / 一致性哈希

**Benefits / 优势:**
- Minimal data movement when adding/removing nodes
- Load balancing across servers
- Virtual nodes for better distribution

**Implementation / 实现:**
```
hash_function = SHA256 or MD5
virtual_nodes_per_server = 150-200 (tunable)

Adding server:
1. Generate virtual node hashes
2. Insert into hash ring
3. Only affected keys need migration

Removing server:
1. Remove virtual nodes from ring
2. Affected keys move to next node
3. Graceful draining recommended
```

### 3. Cache Invalidation / 缓存失效

**Strategies / 策略:**

1. **Time-based (TTL) / 基于时间**
   - Set expiration time for each entry
   - Simple but may serve stale data

2. **Event-based / 基于事件**
   - Invalidate when source data changes
   - Requires pub/sub or message queue
   - More complex but fresher data

3. **Write-through / 写穿透**
   - Update cache and database together
   - Strong consistency
   - Higher latency for writes

4. **Write-behind (Write-back) / 写回**
   - Update cache first, database later
   - Better write performance
   - Risk of data loss

### 4. Cache Patterns / 缓存模式

**Cache-Aside (Lazy Loading) / 旁路缓存**
```
Read:
1. Check cache
2. If miss, read from database
3. Store in cache
4. Return data

Write:
1. Write to database
2. Invalidate cache entry
```

**Read-Through / 读穿透**
```
Cache handles database reads
Application only talks to cache
```

**Write-Through / 写穿透**
```
Cache handles database writes
Synchronous updates
```

### 5. Replication and High Availability / 复制与高可用

**Master-Slave Replication / 主从复制**
```
Write → Master → Replicate → Slaves
Read from any replica
Failover to slave if master fails
```

**Multi-Master Replication / 多主复制**
```
Multiple write nodes
Conflict resolution needed
Higher availability
```

## Scalability Considerations / 可扩展性考虑

### Horizontal Scaling / 水平扩展

1. **Adding Cache Nodes / 添加缓存节点**
   - Use consistent hashing for minimal disruption
   - Gradual traffic migration
   - Warm up new nodes before full traffic

2. **Sharding Strategy / 分片策略**
   - Hash-based sharding by key
   - Range-based sharding by key prefix
   - Geographic sharding for global services

3. **Connection Pooling / 连接池**
   - Reuse connections to cache servers
   - Configure pool size based on load
   - Monitor connection health

### Capacity Planning / 容量规划

```
Memory Requirements:
- Average cache entry size: E bytes
- Cache capacity per node: C entries
- Memory per node: E × C + overhead (30%)
- Total nodes needed: Total_Cache_Size / Memory_per_node

Example:
- Entry size: 10KB
- Entries per node: 100,000
- Memory per node: 10KB × 100,000 × 1.3 = 1.3GB
- For 100GB total cache: 100GB / 1.3GB ≈ 77 nodes
```

## Performance Optimization / 性能优化

### 1. Memory Optimization / 内存优化

- **Compression / 压缩**: Compress large values (>1KB)
- **Serialization / 序列化**: Use efficient formats (Protocol Buffers, MessagePack)
- **Memory Pooling / 内存池**: Reduce allocation overhead
- **Slab Allocation / 板式分配**: Fixed-size memory chunks like Memcached

### 2. Network Optimization / 网络优化

- **Batching / 批处理**: Combine multiple requests
- **Connection Multiplexing / 连接复用**: Single connection for multiple requests
- **Binary Protocol / 二进制协议**: More efficient than text protocols
- **Local Cache / 本地缓存**: Client-side L1 cache

### 3. CPU Optimization / CPU优化

- **Lock-free Data Structures / 无锁数据结构**: Reduce contention
- **Async I/O / 异步I/O**: Non-blocking operations
- **NUMA-aware / NUMA感知**: Optimize for multi-socket servers

## Security Considerations / 安全考虑

### 1. Access Control / 访问控制

- **Authentication / 认证**: API keys, OAuth tokens
- **Authorization / 授权**: Role-based access control
- **Network Isolation / 网络隔离**: Private VPC, security groups

### 2. Data Protection / 数据保护

- **Encryption in Transit / 传输加密**: TLS 1.3
- **Encryption at Rest / 静态加密**: Encrypt sensitive cached data
- **PII Handling / 个人信息处理**: Avoid caching sensitive user data

### 3. DDoS Protection / DDoS防护

- **Rate Limiting / 速率限制**: Per-client request limits
- **Connection Limits / 连接限制**: Max connections per client
- **Request Size Limits / 请求大小限制**: Prevent memory exhaustion

## Monitoring and Alerting / 监控和告警

### Key Metrics / 关键指标

```
Performance Metrics:
- Hit Rate / 命中率: cache_hits / total_requests
- Miss Rate / 未命中率: cache_misses / total_requests
- Average Latency / 平均延迟: p50, p95, p99
- Throughput / 吞吐量: requests per second

Resource Metrics:
- Memory Usage / 内存使用: used_memory / total_memory
- CPU Usage / CPU使用率: percentage
- Network Bandwidth / 网络带宽: bytes in/out per second
- Eviction Rate / 驱逐率: evictions per second

Health Metrics:
- Node Availability / 节点可用性: up/down status
- Replication Lag / 复制延迟: seconds behind master
- Connection Pool / 连接池: active/idle connections
```

### Alerts / 告警

```
Critical:
- Cache cluster down
- Hit rate < 50%
- Memory usage > 90%
- Average latency > 10ms

Warning:
- Hit rate < 80%
- Memory usage > 75%
- Node unresponsive
- Replication lag > 10s
```

## Trade-offs / 权衡

### Consistency vs. Availability / 一致性 vs 可用性

**Strong Consistency / 强一致性**
- ✅ Guarantees latest data
- ❌ Lower availability
- ❌ Higher latency
- Use case: Financial transactions

**Eventual Consistency / 最终一致性**
- ✅ Higher availability
- ✅ Lower latency
- ❌ Temporary stale data
- Use case: Search results, social feeds

### Memory vs. Latency / 内存 vs 延迟

**More Memory / 更多内存**
- ✅ Higher hit rate
- ✅ Lower latency
- ❌ Higher cost
- ❌ Longer eviction time

**Less Memory / 更少内存**
- ✅ Lower cost
- ❌ Lower hit rate
- ❌ More database load
- ❌ Higher latency

### Replication Factor / 复制因子

**High Replication (3x) / 高复制**
- ✅ Higher availability
- ✅ Better read performance
- ❌ 3x storage cost
- ❌ Slower writes

**Low Replication (1x) / 低复制**
- ✅ Lower cost
- ✅ Faster writes
- ❌ Lower availability
- ❌ Data loss risk

## Implementation Example / 实现示例

See `solution.js` for:
- LRU Cache implementation with O(1) operations
- Consistent hashing with virtual nodes
- Cache client with failover
- Distributed cache cluster simulation
- Cache-aside pattern implementation

## Recommended Technologies / 推荐技术

### Cache Servers / 缓存服务器
- **Redis**: Feature-rich, supports data structures
- **Memcached**: Simple, high performance
- **Apache Ignite**: Distributed cache with SQL
- **Hazelcast**: In-memory data grid

### Client Libraries / 客户端库
- **ioredis**: Node.js Redis client
- **node-cache**: In-memory cache
- **lru-cache**: LRU cache implementation

### Monitoring / 监控
- **Prometheus + Grafana**: Metrics and dashboards
- **Redis Exporter**: Redis metrics for Prometheus
- **DataDog**: Full-stack monitoring

## Further Reading / 延伸阅读

- [Redis Documentation](https://redis.io/documentation)
- [Memcached Wiki](https://github.com/memcached/memcached/wiki)
- [Consistent Hashing and Random Trees](https://www.akamai.com/us/en/multimedia/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf)
- [Cache Replacement Policies](https://en.wikipedia.org/wiki/Cache_replacement_policies)
- [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem)

## Conclusion / 结论

**English:**
This distributed caching system design provides high performance, scalability, and availability for search query caching across 100 machines. The use of LRU eviction, consistent hashing, and replication ensures efficient resource utilization and fault tolerance. The system can handle millions of queries per second with sub-millisecond latency.

**中文:**
这个分布式缓存系统设计为100台机器上的搜索查询缓存提供了高性能、可扩展性和可用性。使用LRU驱逐、一致性哈希和复制确保了高效的资源利用和容错能力。系统可以处理每秒数百万次查询，延迟低于毫秒级。
