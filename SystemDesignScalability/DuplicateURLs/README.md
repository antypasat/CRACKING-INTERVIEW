# 9.4 Duplicate URLs Detection (重复URL检测)

## Problem Statement (问题描述)

**English:**
You have 10 billion URLs. How do you detect the duplicate URLs? Memory is limited - you cannot load all URLs into memory at once.

**中文:**
你有100亿个URL。如何检测重复的URL？内存有限 - 你不能一次将所有URL加载到内存中。

---

## Problem Analysis (问题分析)

### Scale Estimation (规模估算)

**English:**

**Assumptions:**
- 10 billion URLs
- Average URL length: 100 characters
- Character encoding: 1 byte per char (ASCII)

**Memory Requirements:**

1. **Store all URLs in memory**: 10B × 100 bytes = 1 TB
   - **NOT FEASIBLE** on a single machine

2. **Store URL hashes**: 10B × 8 bytes (64-bit hash) = 80 GB
   - **FEASIBLE** on a high-end server, but tight

3. **Bloom Filter**: ~14 GB (with 1% false positive rate)
   - **FEASIBLE** and efficient

**中文:**

**假设:**
- 100亿URL
- 平均URL长度：100字符
- 字符编码：每字符1字节（ASCII）

**内存需求:**

1. **将所有URL存储在内存中**: 10B × 100字节 = 1 TB - **不可行**
2. **存储URL哈希**: 10B × 8字节（64位哈希）= 80 GB - **可行**但紧张
3. **布隆过滤器**: ~14 GB（1%假阳性率）- **可行**且高效

---

## High-Level Architecture (高层架构)

```
┌─────────────────────────────────────────────────────────┐
│              Input: 10 Billion URLs                     │
│         (From log files, databases, crawlers)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              1. Preprocessing                           │
│  • Normalize URLs (lowercase, remove tracking params)  │
│  • Hash URLs (MD5, SHA-1, etc.)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              2. Partitioning/Sharding                   │
│  Divide URLs into manageable chunks by hash             │
│                                                          │
│  hash(url) % N = partition number                       │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                │
│  │ Part 0  │  │ Part 1  │  │ Part N  │                │
│  │ 10M URLs│  │ 10M URLs│  │ 10M URLs│                │
│  └─────────┘  └─────────┘  └─────────┘                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           3. Duplicate Detection (Per Partition)        │
│                                                          │
│  For each partition (fits in memory):                   │
│  • Load URLs into hash set                              │
│  • Check for duplicates                                 │
│  • Output duplicate pairs                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              4. Output Duplicates                       │
│                                                          │
│  • List of duplicate URL pairs                          │
│  • Statistics (total duplicates, duplicate rate)        │
└─────────────────────────────────────────────────────────┘
```

---

## Solution Approaches (解决方案)

### Solution 1: Hash-Based Partitioning (哈希分区)

**English:**

**Idea:** Divide URLs into partitions such that duplicate URLs always end up in the same partition.

**Algorithm:**
1. Hash each URL: `hash = hash_function(url)`
2. Assign to partition: `partition_id = hash % N`
3. Process each partition independently:
   - Load partition into memory (hash set)
   - Find duplicates within partition
   - Output duplicates

**Why this works:**
- If two URLs are identical, their hash is identical
- Therefore, they'll be in the same partition
- Each partition is small enough to fit in memory

**中文:**

**思路：** 将URL分成多个分区，使重复URL总是在同一分区。

**算法:**
1. 哈希每个URL：`hash = hash_function(url)`
2. 分配到分区：`partition_id = hash % N`
3. 独立处理每个分区：加载分区到内存（哈希集合），查找分区内的重复，输出重复

**为什么有效:**
- 如果两个URL相同，它们的哈希相同
- 因此，它们会在同一分区
- 每个分区足够小以适应内存

#### Implementation Details (实现细节)

```javascript
// Step 1: Partition URLs
function partitionURLs(urlsFile, numPartitions) {
  const partitionFiles = [];

  for (let i = 0; i < numPartitions; i++) {
    partitionFiles[i] = fs.createWriteStream(`partition_${i}.txt`);
  }

  // Read URLs line by line
  const lineReader = readline.createInterface({
    input: fs.createReadStream(urlsFile)
  });

  lineReader.on('line', (url) => {
    const normalized = normalizeURL(url);
    const hash = hashFunction(normalized);
    const partitionId = hash % numPartitions;

    partitionFiles[partitionId].write(normalized + '\n');
  });

  return partitionFiles;
}

// Step 2: Find duplicates in each partition
function findDuplicatesInPartition(partitionFile) {
  const seen = new Set();
  const duplicates = [];

  const lineReader = readline.createInterface({
    input: fs.createReadStream(partitionFile)
  });

  lineReader.on('line', (url) => {
    if (seen.has(url)) {
      duplicates.push(url);
    } else {
      seen.add(url);
    }
  });

  return duplicates;
}
```

**Complexity:**
- Time: O(N) to read all URLs, O(N) to process partitions = O(N) total
- Space: O(N/P) per partition, where P = number of partitions
- I/O: 2 passes over data (partition + process)

**Number of Partitions:**
```
Available memory: 4 GB
Partition size: 4 GB / 2 (for safety) = 2 GB
URLs per partition: 2 GB / 100 bytes = 20 million URLs
Number of partitions: 10 billion / 20 million = 500 partitions
```

---

### Solution 2: MapReduce (分布式MapReduce)

**English:**

Use MapReduce framework to distribute work across multiple machines.

**Map Phase:**
- Input: (offset, url)
- Output: (hash(url), url)

**Shuffle Phase:**
- Group all URLs with same hash together

**Reduce Phase:**
- Input: (hash, [url1, url2, ...])
- Output: Duplicate URLs (if list has > 1 URL)

**中文:**

使用MapReduce框架在多台机器上分配工作。

**Map阶段:** 输入(offset, url) → 输出(hash(url), url)
**Shuffle阶段:** 将相同哈希的所有URL分组在一起
**Reduce阶段:** 输入(hash, [url1, url2, ...]) → 输出重复URL（如果列表>1个URL）

```python
# Pseudo-code in Python-like syntax

# Map function
def map(offset, url):
    normalized = normalize_url(url)
    hash_value = hash(normalized)
    emit(hash_value, normalized)

# Reduce function
def reduce(hash_value, urls):
    if len(urls) > 1:
        # Found duplicates
        for url in urls:
            emit("DUPLICATE", url)
    else:
        emit("UNIQUE", urls[0])
```

**Advantages:**
- Automatically distributes work
- Handles failures and retries
- Scales to any number of machines

**Disadvantages:**
- Requires MapReduce infrastructure (Hadoop, Spark)
- Overkill for smaller datasets

---

### Solution 3: Bloom Filter + Verification (布隆过滤器+验证)

**English:**

Use Bloom Filter for fast preliminary duplicate detection, then verify with exact method.

**Algorithm:**
1. **First Pass**: Build Bloom Filter
   - Add each URL to Bloom Filter
   - Mark possible duplicates

2. **Second Pass**: Verify duplicates
   - Use hash-based partitioning on possible duplicates
   - Confirm with exact matching

**中文:**

使用布隆过滤器进行快速初步重复检测，然后用精确方法验证。

**算法:**
1. **第一遍**: 构建布隆过滤器 - 将每个URL添加到布隆过滤器，标记可能的重复
2. **第二遍**: 验证重复 - 对可能的重复使用基于哈希的分区，用精确匹配确认

```javascript
class DuplicateDetectorWithBloom {
  constructor(expectedURLs, falsePositiveRate = 0.01) {
    this.bloomFilter = new BloomFilter(expectedURLs, falsePositiveRate);
    this.possibleDuplicates = [];
  }

  // First pass: mark possible duplicates
  firstPass(urls) {
    for (const url of urls) {
      const normalized = normalizeURL(url);

      if (this.bloomFilter.contains(normalized)) {
        // Possibly seen before
        this.possibleDuplicates.push(normalized);
      } else {
        // Definitely not seen
        this.bloomFilter.add(normalized);
      }
    }
  }

  // Second pass: verify actual duplicates
  secondPass() {
    // Use hash set for exact matching
    const seen = new Set();
    const confirmedDuplicates = [];

    for (const url of this.possibleDuplicates) {
      if (seen.has(url)) {
        confirmedDuplicates.push(url);
      } else {
        seen.add(url);
      }
    }

    return confirmedDuplicates;
  }
}
```

**Benefits:**
- Memory efficient (Bloom Filter ~14 GB vs Hash Table ~80 GB)
- Fast first pass
- Only need to verify small subset in second pass

**Trade-offs:**
- Two passes over data
- False positives need verification
- More complex implementation

---

### Solution 4: External Sorting (外部排序)

**English:**

Sort all URLs, then scan for consecutive duplicates.

**Algorithm:**
1. External sort URLs (merge sort on disk)
2. Scan sorted file for consecutive duplicates

**中文:**

对所有URL排序，然后扫描连续的重复。

**算法:**
1. 外部排序URL（在磁盘上归并排序）
2. 扫描已排序文件查找连续重复

```javascript
// External merge sort
function externalSort(inputFile, memoryLimit) {
  // Step 1: Create sorted runs
  const runs = [];
  const chunkSize = memoryLimit / BYTES_PER_URL;

  let chunk = [];
  for (const url of readURLs(inputFile)) {
    chunk.push(url);

    if (chunk.length >= chunkSize) {
      // Sort in memory
      chunk.sort();

      // Write to disk
      const runFile = writeRun(chunk);
      runs.push(runFile);

      chunk = [];
    }
  }

  // Step 2: Merge runs
  return mergeRuns(runs);
}

// Scan for duplicates
function findDuplicatesInSorted(sortedFile) {
  const duplicates = [];
  let prev = null;

  for (const url of readURLs(sortedFile)) {
    if (url === prev) {
      duplicates.push(url);
    }
    prev = url;
  }

  return duplicates;
}
```

**Complexity:**
- Time: O(N log N) for sorting
- Space: O(M) where M = memory limit
- I/O: Multiple passes (sort + scan)

**Pros:**
- Simple concept
- Works with limited memory

**Cons:**
- Slower than hash-based (O(N log N) vs O(N))
- More disk I/O

---

### Solution 5: Database with Index (数据库索引)

**English:**

Use a database with unique index on URLs.

**中文:**

使用带URL唯一索引的数据库。

```sql
-- Create table
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    url_hash CHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create unique index (will detect duplicates)
CREATE UNIQUE INDEX idx_url_hash ON urls(url_hash);

-- Insert URLs (duplicates will fail)
INSERT INTO urls (url, url_hash)
VALUES ($1, MD5($1))
ON CONFLICT (url_hash) DO NOTHING;

-- Find duplicates
SELECT url_hash, COUNT(*) as count
FROM urls
GROUP BY url_hash
HAVING COUNT(*) > 1;
```

**Pros:**
- Automatic duplicate detection
- Persistent storage
- Easy to query

**Cons:**
- Slower than in-memory solutions
- Requires database infrastructure

---

## Comparison of Solutions (方案比较)

| Solution | Time | Space | I/O Passes | Pros | Cons |
|----------|------|-------|------------|------|------|
| **Hash Partitioning** | O(N) | O(N/P) | 2 | Fast, simple | Needs good hash function |
| **MapReduce** | O(N) | O(N/M) | 2 | Scalable, fault-tolerant | Infrastructure overhead |
| **Bloom Filter** | O(N) | O(N) | 2 | Memory efficient | False positives |
| **External Sort** | O(N log N) | O(M) | 3+ | Simple, deterministic | Slower, more I/O |
| **Database** | O(N log N) | Variable | 1 | Persistent, queryable | Slowest |

**Recommendation:** Hash Partitioning for best performance, Bloom Filter for memory efficiency

---

## Advanced Optimizations (高级优化)

### 1. Parallel Processing (并行处理)

```javascript
// Process multiple partitions in parallel
async function findDuplicatesParallel(partitions, numWorkers) {
  const workers = [];

  for (let i = 0; i < numWorkers; i++) {
    workers.push(processPartitions(partitions, i, numWorkers));
  }

  const results = await Promise.all(workers);
  return results.flat();
}
```

### 2. Streaming Processing (流式处理)

```javascript
// Process URLs as they arrive (real-time)
class StreamingDuplicateDetector {
  constructor() {
    this.seen = new Set();
    this.duplicateCount = 0;
  }

  processURL(url) {
    const normalized = normalizeURL(url);

    if (this.seen.has(normalized)) {
      this.duplicateCount++;
      return { isDuplicate: true, url: normalized };
    }

    this.seen.add(normalized);
    return { isDuplicate: false };
  }
}
```

### 3. Approximate Duplicate Detection (近似重复检测)

```javascript
// Use MinHash for finding similar URLs (not exact duplicates)
class MinHashDuplicateDetector {
  constructor(numHashes = 100) {
    this.numHashes = numHashes;
    this.signatures = new Map();
  }

  computeSignature(url) {
    const shingles = this.getShingles(url, 3);
    const signature = [];

    for (let i = 0; i < this.numHashes; i++) {
      let minHash = Infinity;

      for (const shingle of shingles) {
        const hash = this.hash(shingle, i);
        minHash = Math.min(minHash, hash);
      }

      signature.push(minHash);
    }

    return signature;
  }

  getSimilarity(sig1, sig2) {
    let matches = 0;
    for (let i = 0; i < sig1.length; i++) {
      if (sig1[i] === sig2[i]) matches++;
    }
    return matches / sig1.length;
  }
}
```

---

## Implementation Considerations (实现考虑)

### URL Normalization (URL规范化)

**English:**
Before comparing URLs, normalize them:

1. Convert to lowercase
2. Remove protocol prefix (http:// vs https://)
3. Remove www prefix
4. Remove trailing slash
5. Sort query parameters
6. Remove tracking parameters (utm_*, fbclid, etc.)
7. Remove anchors (#section)

**中文:**
比较URL之前，规范化它们：

1. 转换为小写
2. 删除协议前缀（http://vs https://）
3. 删除www前缀
4. 删除尾部斜杠
5. 排序查询参数
6. 删除跟踪参数
7. 删除锚点

```javascript
function normalizeURL(url) {
  // Parse URL
  const parsed = new URL(url.toLowerCase());

  // Remove www
  const hostname = parsed.hostname.replace(/^www\./, '');

  // Remove trailing slash
  let pathname = parsed.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Sort query parameters
  const params = new URLSearchParams(parsed.search);
  const sortedParams = [...params.entries()].sort();
  const search = sortedParams.length > 0
    ? '?' + new URLSearchParams(sortedParams).toString()
    : '';

  // Reconstruct
  return `${hostname}${pathname}${search}`;
}
```

### Hash Function Selection (哈希函数选择)

**Good hash functions:**
- MD5: Fast, 128-bit
- SHA-1: More secure, 160-bit
- MurmurHash: Very fast, 32/64/128-bit
- CityHash: Google's fast hash

```javascript
const crypto = require('crypto');

function hashURL(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}
```

---

## Cost Analysis (成本分析)

### Storage Costs (存储成本)

**For 10 billion URLs:**

- **Input files**: 10B × 100 bytes = 1 TB
- **Partition files**: 1 TB (intermediate)
- **Output**: ~10 GB (assuming 10% duplicates)
- **Total**: ~2 TB storage

**S3 Storage Cost**: $23/TB/month = $46/month

### Compute Costs (计算成本)

**Single Machine:**
- Machine: 8 cores, 64 GB RAM
- Processing time: ~3 hours
- Cost: $5/hour = $15

**Distributed (10 machines):**
- Processing time: ~30 minutes
- Cost: 10 × $5/hour × 0.5 = $25

### Total Cost (总成本)

- **One-time job**: $15-25
- **Monthly (with storage)**: $46/month
- **Yearly**: $550/year

---

## Performance Benchmarks (性能基准)

| Dataset Size | Method | Time | Memory | I/O |
|--------------|--------|------|--------|-----|
| 1M URLs | Hash Set | 2s | 200 MB | 0.1 GB |
| 10M URLs | Hash Set | 20s | 2 GB | 1 GB |
| 100M URLs | Hash Partition | 5 min | 5 GB | 20 GB |
| 1B URLs | Hash Partition | 50 min | 5 GB | 200 GB |
| 10B URLs | Distributed | 30 min | 50 GB | 2 TB |

---

## References (参考资料)

- Bloom Filters for probabilistic membership testing
- External sorting algorithms (merge sort)
- MapReduce programming model (Hadoop, Spark)
- MinHash for approximate duplicate detection
- Consistent hashing for partitioning
