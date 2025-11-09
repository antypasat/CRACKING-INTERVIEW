/**
 * Distributed Cache System Implementation
 * 分布式缓存系统实现
 *
 * Features:
 * - LRU Cache with O(1) operations
 * - Consistent Hashing for distribution
 * - Cache-aside pattern
 * - Replication for high availability
 * - TTL-based expiration
 */

// ============================================================================
// 1. LRU Cache Implementation / LRU缓存实现
// ============================================================================

class LRUNode {
  constructor(key, value, ttl = null) {
    this.key = key;
    this.value = value;
    this.ttl = ttl;
    this.createdAt = Date.now();
    this.accessedAt = Date.now();
    this.accessCount = 0;
    this.prev = null;
    this.next = null;
  }

  isExpired() {
    if (!this.ttl) return false;
    return Date.now() - this.createdAt > this.ttl * 1000;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new LRUNode(null, null); // Dummy head
    this.tail = new LRUNode(null, null); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Get value from cache
   * Time Complexity: O(1)
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }

    const node = this.cache.get(key);

    // Check if expired
    if (node.isExpired()) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Move to head (most recently used)
    this._removeNode(node);
    this._addToHead(node);

    // Update access metadata
    node.accessedAt = Date.now();
    node.accessCount++;

    this.stats.hits++;
    return node.value;
  }

  /**
   * Set value in cache
   * Time Complexity: O(1)
   */
  set(key, value, ttl = null) {
    // Update existing node
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      node.ttl = ttl;
      node.createdAt = Date.now();
      node.accessedAt = Date.now();
      this._removeNode(node);
      this._addToHead(node);
      this.stats.sets++;
      return true;
    }

    // Add new node
    const newNode = new LRUNode(key, value, ttl);
    this.cache.set(key, newNode);
    this._addToHead(newNode);
    this.stats.sets++;

    // Evict if over capacity
    if (this.cache.size > this.capacity) {
      const lruNode = this.tail.prev;
      this._removeNode(lruNode);
      this.cache.delete(lruNode.key);
      this.stats.evictions++;
    }

    return true;
  }

  /**
   * Delete value from cache
   * Time Complexity: O(1)
   */
  delete(key) {
    if (!this.cache.has(key)) {
      return false;
    }

    const node = this.cache.get(key);
    this._removeNode(node);
    this.cache.delete(key);
    this.stats.deletes++;
    return true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    return {
      ...this.stats,
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: hitRate.toFixed(4),
      missRate: (1 - hitRate).toFixed(4),
      utilization: (this.cache.size / this.capacity).toFixed(4)
    };
  }

  /**
   * Clear expired entries (passive expiration)
   */
  clearExpired() {
    let count = 0;
    for (const [key, node] of this.cache.entries()) {
      if (node.isExpired()) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  // Helper methods
  _addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

// ============================================================================
// 2. Consistent Hashing / 一致性哈希
// ============================================================================

const crypto = require('crypto');

class ConsistentHash {
  constructor(virtualNodesPerServer = 150) {
    this.virtualNodesPerServer = virtualNodesPerServer;
    this.ring = new Map(); // hash -> server
    this.servers = new Set();
    this.sortedHashes = [];
  }

  /**
   * Add server to hash ring
   */
  addServer(serverName) {
    if (this.servers.has(serverName)) {
      return;
    }

    this.servers.add(serverName);

    // Add virtual nodes
    for (let i = 0; i < this.virtualNodesPerServer; i++) {
      const virtualNodeName = `${serverName}:${i}`;
      const hash = this._hash(virtualNodeName);
      this.ring.set(hash, serverName);
    }

    // Re-sort hash values
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  /**
   * Remove server from hash ring
   */
  removeServer(serverName) {
    if (!this.servers.has(serverName)) {
      return;
    }

    this.servers.delete(serverName);

    // Remove virtual nodes
    for (let i = 0; i < this.virtualNodesPerServer; i++) {
      const virtualNodeName = `${serverName}:${i}`;
      const hash = this._hash(virtualNodeName);
      this.ring.delete(hash);
    }

    // Re-sort hash values
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  /**
   * Get server for a given key
   */
  getServer(key) {
    if (this.ring.size === 0) {
      return null;
    }

    const hash = this._hash(key);

    // Binary search for the first hash >= key hash
    let left = 0;
    let right = this.sortedHashes.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.sortedHashes[mid] < hash) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Wrap around if needed
    const serverHash = this.sortedHashes[left] >= hash
      ? this.sortedHashes[left]
      : this.sortedHashes[0];

    return this.ring.get(serverHash);
  }

  /**
   * Get N servers for replication (primary + replicas)
   */
  getServersForReplication(key, replicationFactor = 3) {
    if (this.ring.size === 0) {
      return [];
    }

    const servers = [];
    const serverSet = new Set();
    const hash = this._hash(key);

    // Find starting position
    let idx = this.sortedHashes.findIndex(h => h >= hash);
    if (idx === -1) idx = 0;

    // Collect unique servers
    while (serverSet.size < replicationFactor && serverSet.size < this.servers.size) {
      const serverHash = this.sortedHashes[idx];
      const server = this.ring.get(serverHash);

      if (!serverSet.has(server)) {
        serverSet.add(server);
        servers.push(server);
      }

      idx = (idx + 1) % this.sortedHashes.length;
    }

    return servers;
  }

  /**
   * Get distribution statistics
   */
  getDistribution() {
    const distribution = new Map();

    for (const server of this.servers) {
      distribution.set(server, 0);
    }

    // Sample keys to test distribution
    const sampleSize = 10000;
    for (let i = 0; i < sampleSize; i++) {
      const key = `key_${i}`;
      const server = this.getServer(key);
      distribution.set(server, distribution.get(server) + 1);
    }

    const result = {};
    for (const [server, count] of distribution.entries()) {
      result[server] = {
        count,
        percentage: ((count / sampleSize) * 100).toFixed(2) + '%'
      };
    }

    return result;
  }

  _hash(key) {
    return parseInt(
      crypto.createHash('md5').update(key).digest('hex').substring(0, 8),
      16
    );
  }
}

// ============================================================================
// 3. Cache Server Node / 缓存服务器节点
// ============================================================================

class CacheServerNode {
  constructor(nodeId, capacity = 10000) {
    this.nodeId = nodeId;
    this.cache = new LRUCache(capacity);
    this.status = 'ACTIVE'; // ACTIVE, DRAINING, DOWN
    this.lastHealthCheck = Date.now();
  }

  get(key) {
    if (this.status === 'DOWN') {
      throw new Error(`Server ${this.nodeId} is down`);
    }
    return this.cache.get(key);
  }

  set(key, value, ttl = null) {
    if (this.status === 'DOWN' || this.status === 'DRAINING') {
      throw new Error(`Server ${this.nodeId} is not accepting writes`);
    }
    return this.cache.set(key, value, ttl);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  getStats() {
    return {
      nodeId: this.nodeId,
      status: this.status,
      lastHealthCheck: this.lastHealthCheck,
      ...this.cache.getStats()
    };
  }

  healthCheck() {
    this.lastHealthCheck = Date.now();
    return this.status === 'ACTIVE';
  }

  drain() {
    this.status = 'DRAINING';
  }

  shutdown() {
    this.status = 'DOWN';
  }
}

// ============================================================================
// 4. Distributed Cache Client / 分布式缓存客户端
// ============================================================================

class DistributedCacheClient {
  constructor(replicationFactor = 3) {
    this.consistentHash = new ConsistentHash();
    this.servers = new Map();
    this.replicationFactor = replicationFactor;
    this.retryAttempts = 3;
    this.retryDelayMs = 100;
  }

  /**
   * Add cache server to cluster
   */
  addServer(nodeId, capacity = 10000) {
    const server = new CacheServerNode(nodeId, capacity);
    this.servers.set(nodeId, server);
    this.consistentHash.addServer(nodeId);
    return server;
  }

  /**
   * Remove cache server from cluster
   */
  removeServer(nodeId) {
    this.servers.delete(nodeId);
    this.consistentHash.removeServer(nodeId);
  }

  /**
   * Get value from cache (cache-aside pattern)
   */
  async get(key) {
    const serverIds = this.consistentHash.getServersForReplication(
      key,
      this.replicationFactor
    );

    // Try primary and replicas with failover
    for (const serverId of serverIds) {
      try {
        const server = this.servers.get(serverId);
        if (!server || server.status === 'DOWN') {
          continue;
        }

        const value = server.get(key);
        if (value !== null) {
          return { value, source: serverId };
        }
      } catch (error) {
        console.error(`Error getting from ${serverId}:`, error.message);
        continue;
      }
    }

    return { value: null, source: null };
  }

  /**
   * Set value in cache with replication
   */
  async set(key, value, ttl = null) {
    const serverIds = this.consistentHash.getServersForReplication(
      key,
      this.replicationFactor
    );

    const results = [];

    // Write to all replicas
    for (const serverId of serverIds) {
      try {
        const server = this.servers.get(serverId);
        if (!server || server.status !== 'ACTIVE') {
          results.push({ serverId, success: false, error: 'Server unavailable' });
          continue;
        }

        const success = server.set(key, value, ttl);
        results.push({ serverId, success });
      } catch (error) {
        results.push({ serverId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const writeSuccess = successCount > 0; // At least one write succeeded

    return {
      success: writeSuccess,
      replicas: successCount,
      results
    };
  }

  /**
   * Delete value from cache
   */
  async delete(key) {
    const serverIds = this.consistentHash.getServersForReplication(
      key,
      this.replicationFactor
    );

    const results = [];

    for (const serverId of serverIds) {
      try {
        const server = this.servers.get(serverId);
        if (!server) {
          continue;
        }

        const success = server.delete(key);
        results.push({ serverId, success });
      } catch (error) {
        results.push({ serverId, success: false, error: error.message });
      }
    }

    return { results };
  }

  /**
   * Get cluster statistics
   */
  getClusterStats() {
    const stats = {
      totalServers: this.servers.size,
      serverStats: [],
      totalHits: 0,
      totalMisses: 0,
      totalSize: 0,
      totalCapacity: 0
    };

    for (const [nodeId, server] of this.servers.entries()) {
      const serverStats = server.getStats();
      stats.serverStats.push(serverStats);
      stats.totalHits += serverStats.hits;
      stats.totalMisses += serverStats.misses;
      stats.totalSize += serverStats.size;
      stats.totalCapacity += serverStats.capacity;
    }

    const totalRequests = stats.totalHits + stats.totalMisses;
    stats.overallHitRate = totalRequests > 0
      ? (stats.totalHits / totalRequests).toFixed(4)
      : '0.0000';

    return stats;
  }

  /**
   * Get consistent hash distribution
   */
  getDistribution() {
    return this.consistentHash.getDistribution();
  }
}

// ============================================================================
// 5. Cache-Aside Pattern with Database / 缓存旁路模式
// ============================================================================

class CacheAsidePattern {
  constructor(cacheClient, database) {
    this.cache = cacheClient;
    this.db = database;
    this.defaultTTL = 3600; // 1 hour
  }

  /**
   * Read with cache-aside pattern
   */
  async read(key) {
    // 1. Try to get from cache
    const cachedResult = await this.cache.get(key);
    if (cachedResult.value !== null) {
      console.log(`Cache HIT for key: ${key}`);
      return cachedResult.value;
    }

    console.log(`Cache MISS for key: ${key}`);

    // 2. Get from database
    const value = await this.db.get(key);
    if (value === null) {
      return null;
    }

    // 3. Store in cache
    await this.cache.set(key, value, this.defaultTTL);

    return value;
  }

  /**
   * Write with cache-aside pattern
   */
  async write(key, value) {
    // 1. Write to database
    await this.db.set(key, value);

    // 2. Invalidate cache (or update it)
    await this.cache.delete(key);

    // Alternative: Update cache immediately (write-through)
    // await this.cache.set(key, value, this.defaultTTL);

    return true;
  }

  /**
   * Delete with cache-aside pattern
   */
  async remove(key) {
    // 1. Delete from database
    await this.db.delete(key);

    // 2. Delete from cache
    await this.cache.delete(key);

    return true;
  }
}

// ============================================================================
// 6. Mock Database (for demonstration) / 模拟数据库
// ============================================================================

class MockDatabase {
  constructor() {
    this.data = new Map();
    this.stats = {
      reads: 0,
      writes: 0,
      deletes: 0
    };
  }

  async get(key) {
    this.stats.reads++;
    // Simulate database latency
    await this._delay(10);
    return this.data.get(key) || null;
  }

  async set(key, value) {
    this.stats.writes++;
    await this._delay(20);
    this.data.set(key, value);
    return true;
  }

  async delete(key) {
    this.stats.deletes++;
    await this._delay(10);
    return this.data.delete(key);
  }

  getStats() {
    return this.stats;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// 7. Example Usage and Tests / 示例用法和测试
// ============================================================================

async function demonstrateDistributedCache() {
  console.log('='.repeat(70));
  console.log('Distributed Cache System Demonstration');
  console.log('分布式缓存系统演示');
  console.log('='.repeat(70));

  // Create distributed cache cluster
  console.log('\n1. Creating distributed cache cluster with 5 nodes...');
  const cacheClient = new DistributedCacheClient(3); // Replication factor 3

  for (let i = 1; i <= 5; i++) {
    cacheClient.addServer(`cache-server-${i}`, 1000);
  }
  console.log('✓ Created 5 cache servers with replication factor 3');

  // Test consistent hashing distribution
  console.log('\n2. Testing consistent hashing distribution...');
  const distribution = cacheClient.getDistribution();
  console.log('Key distribution across servers:');
  console.log(distribution);

  // Test cache operations
  console.log('\n3. Testing cache operations...');

  // Set values
  await cacheClient.set('user:1001', { id: 1001, name: 'Alice', email: 'alice@example.com' }, 3600);
  await cacheClient.set('user:1002', { id: 1002, name: 'Bob', email: 'bob@example.com' }, 3600);
  await cacheClient.set('search:javascript', ['result1', 'result2', 'result3'], 1800);
  console.log('✓ Set 3 cache entries');

  // Get values
  const user1 = await cacheClient.get('user:1001');
  console.log('\nGet user:1001:', user1);

  const search = await cacheClient.get('search:javascript');
  console.log('Get search:javascript:', search);

  // Test cache-aside pattern
  console.log('\n4. Testing cache-aside pattern with database...');
  const database = new MockDatabase();
  const cacheAside = new CacheAsidePattern(cacheClient, database);

  // Pre-populate database
  await database.set('product:5001', { id: 5001, name: 'Laptop', price: 999.99 });
  await database.set('product:5002', { id: 5002, name: 'Mouse', price: 29.99 });

  // First read (cache miss, load from DB)
  console.log('\nFirst read (cache miss):');
  const product1 = await cacheAside.read('product:5001');
  console.log('Product:', product1);

  // Second read (cache hit)
  console.log('\nSecond read (cache hit):');
  const product1Again = await cacheAside.read('product:5001');
  console.log('Product:', product1Again);

  // Write (invalidates cache)
  console.log('\nUpdate product:');
  await cacheAside.write('product:5001', { id: 5001, name: 'Laptop Pro', price: 1299.99 });

  // Read after write (cache miss again)
  console.log('\nRead after write (cache miss):');
  const product1Updated = await cacheAside.read('product:5001');
  console.log('Product:', product1Updated);

  // Show statistics
  console.log('\n5. Cache cluster statistics:');
  const clusterStats = cacheClient.getClusterStats();
  console.log('Overall hit rate:', clusterStats.overallHitRate);
  console.log('Total cache size:', clusterStats.totalSize, '/', clusterStats.totalCapacity);
  console.log('Total servers:', clusterStats.totalServers);

  console.log('\nPer-server statistics:');
  clusterStats.serverStats.forEach(stats => {
    console.log(`  ${stats.nodeId}:`);
    console.log(`    Status: ${stats.status}`);
    console.log(`    Size: ${stats.size}/${stats.capacity}`);
    console.log(`    Hit rate: ${stats.hitRate}`);
    console.log(`    Hits: ${stats.hits}, Misses: ${stats.misses}`);
  });

  console.log('\nDatabase statistics:');
  console.log(database.getStats());

  // Test node failure and failover
  console.log('\n6. Testing node failure and failover...');
  const server1 = cacheClient.servers.get('cache-server-1');
  server1.shutdown();
  console.log('✗ Shut down cache-server-1');

  console.log('Trying to read from cache (should failover to replica):');
  const failoverRead = await cacheClient.get('user:1001');
  console.log('Result:', failoverRead);

  // Test LRU eviction
  console.log('\n7. Testing LRU eviction...');
  const smallCache = new LRUCache(3);

  smallCache.set('a', 'value_a');
  smallCache.set('b', 'value_b');
  smallCache.set('c', 'value_c');
  console.log('Added 3 items (capacity 3):', smallCache.getStats());

  smallCache.set('d', 'value_d'); // Should evict 'a'
  console.log('Added 4th item:', smallCache.getStats());

  const evicted = smallCache.get('a');
  console.log('Try to get evicted item "a":', evicted);

  // Test TTL expiration
  console.log('\n8. Testing TTL expiration...');
  const ttlCache = new LRUCache(100);

  ttlCache.set('temp_key', 'temp_value', 1); // 1 second TTL
  console.log('Set key with 1 second TTL');

  console.log('Get immediately:', ttlCache.get('temp_key'));

  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('Get after 1.5 seconds:', ttlCache.get('temp_key'));

  console.log('\n' + '='.repeat(70));
  console.log('Demonstration complete!');
  console.log('='.repeat(70));
}

// Run demonstration
if (require.main === module) {
  demonstrateDistributedCache().catch(console.error);
}

// Export for use in other modules
module.exports = {
  LRUCache,
  LRUNode,
  ConsistentHash,
  CacheServerNode,
  DistributedCacheClient,
  CacheAsidePattern,
  MockDatabase
};
