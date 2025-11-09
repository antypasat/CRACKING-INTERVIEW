/**
 * Duplicate URL Detection at Scale
 * Demonstrates: Hash partitioning, Bloom filters, external sorting, MapReduce pattern
 */

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const { Readable } = require('stream');

// ============================================================================
// 1. URL Normalization (URL规范化)
// ============================================================================

class URLNormalizer {
  /**
   * Normalize URL to canonical form for duplicate detection
   * 将URL规范化为用于重复检测的标准形式
   */
  static normalize(urlString) {
    try {
      // Parse and lowercase
      const url = new URL(urlString.toLowerCase());

      // Remove www prefix
      let hostname = url.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }

      // Remove default ports
      let port = url.port;
      if ((url.protocol === 'http:' && port === '80') ||
          (url.protocol === 'https:' && port === '443')) {
        port = '';
      }

      // Remove trailing slash (except for root)
      let pathname = url.pathname;
      if (pathname.length > 1 && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }

      // Sort query parameters
      let search = '';
      if (url.search) {
        const params = new URLSearchParams(url.search);

        // Remove tracking parameters
        const trackingParams = [
          'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
          'fbclid', 'gclid', 'msclkid', 'ref', 'source'
        ];
        trackingParams.forEach(param => params.delete(param));

        // Sort remaining parameters
        const sorted = [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]));
        if (sorted.length > 0) {
          search = '?' + new URLSearchParams(sorted).toString();
        }
      }

      // Remove fragment
      // const fragment = ''; // Always remove

      // Reconstruct normalized URL
      const portStr = port ? `:${port}` : '';
      return `${url.protocol}//${hostname}${portStr}${pathname}${search}`;
    } catch (error) {
      // Invalid URL
      return null;
    }
  }

  /**
   * Hash URL for partitioning
   * 哈希URL用于分区
   */
  static hash(urlString) {
    return crypto.createHash('md5').update(urlString).digest('hex');
  }

  /**
   * Get partition ID for URL
   * 获取URL的分区ID
   */
  static getPartitionId(urlString, numPartitions) {
    const hash = this.hash(urlString);
    // Use first 8 characters of hex hash
    const hashValue = parseInt(hash.substring(0, 8), 16);
    return hashValue % numPartitions;
  }
}

// ============================================================================
// 2. Bloom Filter (布隆过滤器)
// ============================================================================

class BloomFilter {
  /**
   * Memory-efficient probabilistic data structure
   * 内存高效的概率数据结构
   */
  constructor(expectedItems, falsePositiveRate = 0.01) {
    // Calculate optimal parameters
    this.size = Math.ceil(
      -(expectedItems * Math.log(falsePositiveRate)) / (Math.log(2) ** 2)
    );
    this.numHashFunctions = Math.ceil((this.size / expectedItems) * Math.log(2));

    // Bit array
    this.bits = new Uint8Array(Math.ceil(this.size / 8));

    this.itemCount = 0;
  }

  add(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const bitIndex = this.computeHash(item, i) % this.size;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      this.bits[byteIndex] |= (1 << bitOffset);
    }
    this.itemCount++;
  }

  contains(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const bitIndex = this.computeHash(item, i) % this.size;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;

      if ((this.bits[byteIndex] & (1 << bitOffset)) === 0) {
        return false; // Definitely not in set
      }
    }
    return true; // Probably in set
  }

  computeHash(str, seed) {
    const hash = crypto.createHash('md5');
    hash.update(str + seed);
    const digest = hash.digest();

    // Convert to integer
    return Math.abs(
      digest[0] | (digest[1] << 8) | (digest[2] << 16) | (digest[3] << 24)
    );
  }

  getStats() {
    const memoryMB = (this.bits.length / (1024 * 1024)).toFixed(2);
    const k = this.numHashFunctions;
    const m = this.size;
    const n = this.itemCount;

    // Actual false positive rate
    const fpr = n > 0 ? Math.pow(1 - Math.exp(-k * n / m), k) : 0;

    return {
      memoryUsage: memoryMB + ' MB',
      itemCount: n,
      capacity: m,
      hashFunctions: k,
      estimatedFPR: (fpr * 100).toFixed(4) + '%'
    };
  }
}

// ============================================================================
// 3. Hash-Based Partitioning (基于哈希的分区)
// ============================================================================

class HashPartitioner {
  /**
   * Partition URLs into chunks that fit in memory
   * 将URL分区为适合内存的块
   */
  constructor(numPartitions = 100) {
    this.numPartitions = numPartitions;
    this.partitions = Array(numPartitions).fill(0).map(() => []);
  }

  /**
   * Add URL to appropriate partition
   * 将URL添加到适当的分区
   */
  addURL(url) {
    const normalized = URLNormalizer.normalize(url);
    if (!normalized) return;

    const partitionId = URLNormalizer.getPartitionId(normalized, this.numPartitions);
    this.partitions[partitionId].push(normalized);
  }

  /**
   * Find duplicates in a single partition
   * 在单个分区中查找重复
   */
  static findDuplicatesInPartition(urls) {
    const seen = new Map(); // url -> count
    const duplicates = [];

    for (const url of urls) {
      if (seen.has(url)) {
        const count = seen.get(url);
        if (count === 1) {
          // First duplicate found
          duplicates.push({ url, count: 2 });
        } else {
          // Update count
          duplicates[duplicates.length - 1].count = count + 1;
        }
        seen.set(url, count + 1);
      } else {
        seen.set(url, 1);
      }
    }

    return duplicates;
  }

  /**
   * Find all duplicates across all partitions
   * 在所有分区中查找所有重复
   */
  findAllDuplicates() {
    const allDuplicates = [];

    console.log(`\nProcessing ${this.numPartitions} partitions...`);

    for (let i = 0; i < this.numPartitions; i++) {
      const partition = this.partitions[i];

      if (partition.length === 0) continue;

      console.log(`  Partition ${i}: ${partition.length} URLs`);

      const duplicates = HashPartitioner.findDuplicatesInPartition(partition);

      if (duplicates.length > 0) {
        console.log(`    Found ${duplicates.length} duplicate URLs`);
        allDuplicates.push(...duplicates);
      }
    }

    return allDuplicates;
  }

  getStats() {
    const sizes = this.partitions.map(p => p.length);
    const total = sizes.reduce((sum, size) => sum + size, 0);
    const avg = total / this.numPartitions;
    const max = Math.max(...sizes);
    const min = Math.min(...sizes);

    return {
      numPartitions: this.numPartitions,
      totalURLs: total,
      avgPerPartition: avg.toFixed(2),
      maxPerPartition: max,
      minPerPartition: min,
      imbalance: max > 0 ? ((max - avg) / avg * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// ============================================================================
// 4. Bloom Filter + Hash Set Approach (布隆过滤器+哈希集合方法)
// ============================================================================

class BloomFilterDuplicateDetector {
  /**
   * Two-pass approach: Bloom filter for candidates, then exact verification
   * 两遍方法：布隆过滤器查找候选，然后精确验证
   */
  constructor(expectedURLs, falsePositiveRate = 0.01) {
    this.bloomFilter = new BloomFilter(expectedURLs, falsePositiveRate);
    this.possibleDuplicates = [];
    this.stats = {
      totalProcessed: 0,
      possibleDuplicates: 0,
      confirmedDuplicates: 0
    };
  }

  /**
   * First pass: identify possible duplicates using Bloom filter
   * 第一遍：使用布隆过滤器识别可能的重复
   */
  firstPass(urls) {
    console.log('\n🔍 First Pass: Bloom Filter Screening...');

    for (const url of urls) {
      const normalized = URLNormalizer.normalize(url);
      if (!normalized) continue;

      this.stats.totalProcessed++;

      if (this.bloomFilter.contains(normalized)) {
        // Possibly a duplicate
        this.possibleDuplicates.push(normalized);
        this.stats.possibleDuplicates++;
      } else {
        // Definitely not a duplicate
        this.bloomFilter.add(normalized);
      }
    }

    console.log(`   Processed: ${this.stats.totalProcessed} URLs`);
    console.log(`   Possible duplicates: ${this.stats.possibleDuplicates}`);
  }

  /**
   * Second pass: verify actual duplicates
   * 第二遍：验证实际重复
   */
  secondPass() {
    console.log('\n✅ Second Pass: Exact Verification...');

    const seen = new Set();
    const confirmed = [];

    for (const url of this.possibleDuplicates) {
      if (seen.has(url)) {
        confirmed.push(url);
        this.stats.confirmedDuplicates++;
      } else {
        seen.add(url);
      }
    }

    console.log(`   Confirmed duplicates: ${this.stats.confirmedDuplicates}`);

    return confirmed;
  }

  getResults() {
    const fpr = this.stats.possibleDuplicates > 0
      ? ((this.stats.possibleDuplicates - this.stats.confirmedDuplicates) /
         this.stats.possibleDuplicates * 100)
      : 0;

    return {
      stats: this.stats,
      bloomFilter: this.bloomFilter.getStats(),
      actualFPR: fpr.toFixed(2) + '%'
    };
  }
}

// ============================================================================
// 5. MapReduce Pattern (MapReduce模式)
// ============================================================================

class MapReduceDuplicateDetector {
  /**
   * Simulated MapReduce for duplicate detection
   * 用于重复检测的模拟MapReduce
   */
  constructor() {
    this.mapOutput = new Map(); // hash -> [urls]
  }

  /**
   * Map phase: (offset, url) -> (hash, url)
   * Map阶段：(偏移量, url) -> (哈希, url)
   */
  map(offset, url) {
    const normalized = URLNormalizer.normalize(url);
    if (!normalized) return null;

    const hash = URLNormalizer.hash(normalized);
    return { key: hash, value: normalized };
  }

  /**
   * Shuffle phase: Group by key
   * Shuffle阶段：按键分组
   */
  shuffle(mapResults) {
    for (const result of mapResults) {
      if (!result) continue;

      const { key, value } = result;

      if (!this.mapOutput.has(key)) {
        this.mapOutput.set(key, []);
      }

      this.mapOutput.get(key).push(value);
    }
  }

  /**
   * Reduce phase: (hash, [urls]) -> duplicates
   * Reduce阶段：(哈希, [urls]) -> 重复
   */
  reduce(hash, urls) {
    if (urls.length > 1) {
      // Found duplicates
      return {
        hash,
        urls: [...new Set(urls)], // Remove exact duplicates
        count: urls.length
      };
    }
    return null; // Unique URL
  }

  /**
   * Run full MapReduce job
   * 运行完整的MapReduce作业
   */
  runJob(urls) {
    console.log('\n🗺️  MapReduce Job: Finding Duplicates...');

    // Map phase
    console.log('   Map phase...');
    const mapResults = urls.map((url, offset) => this.map(offset, url));

    // Shuffle phase
    console.log('   Shuffle phase...');
    this.shuffle(mapResults);

    // Reduce phase
    console.log('   Reduce phase...');
    const duplicates = [];

    for (const [hash, urlList] of this.mapOutput.entries()) {
      const result = this.reduce(hash, urlList);
      if (result) {
        duplicates.push(result);
      }
    }

    console.log(`   Found ${duplicates.length} duplicate groups`);

    return duplicates;
  }
}

// ============================================================================
// 6. Streaming Duplicate Detector (流式重复检测器)
// ============================================================================

class StreamingDuplicateDetector {
  /**
   * Process URLs as they arrive (real-time)
   * 在URL到达时处理（实时）
   */
  constructor(maxMemory = 1000000) {
    this.seen = new Set();
    this.maxMemory = maxMemory;
    this.stats = {
      processed: 0,
      duplicates: 0,
      unique: 0
    };
  }

  processURL(url) {
    const normalized = URLNormalizer.normalize(url);
    if (!normalized) return null;

    this.stats.processed++;

    // Check memory limit
    if (this.seen.size >= this.maxMemory) {
      console.warn('⚠️  Memory limit reached, clearing old entries');
      this.seen.clear();
    }

    if (this.seen.has(normalized)) {
      this.stats.duplicates++;
      return {
        url: normalized,
        isDuplicate: true,
        timestamp: Date.now()
      };
    }

    this.seen.add(normalized);
    this.stats.unique++;

    return {
      url: normalized,
      isDuplicate: false,
      timestamp: Date.now()
    };
  }

  getStats() {
    return {
      ...this.stats,
      duplicateRate: this.stats.processed > 0
        ? ((this.stats.duplicates / this.stats.processed) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
}

// ============================================================================
// 7. Demo and Testing (演示和测试)
// ============================================================================

function generateTestURLs(count) {
  const urls = [];
  const baseURLs = [
    'https://example.com/page',
    'https://example.org/article',
    'https://test.com/product',
    'https://demo.net/user'
  ];

  for (let i = 0; i < count; i++) {
    const base = baseURLs[i % baseURLs.length];
    const id = Math.floor(Math.random() * (count / 2)); // Generate some duplicates

    // Add variations
    const variations = [
      `${base}/${id}`,
      `${base}/${id}?ref=home`,
      `${base}/${id}?utm_source=google`,
      `${base}/${id}/`,
      `${base}/${id}#section`,
      `HTTP://${base.replace('https://', '')}/${id}`,
      `${base.replace('example', 'WWW.EXAMPLE')}/${id}`
    ];

    urls.push(variations[Math.floor(Math.random() * variations.length)]);
  }

  return urls;
}

async function runDemo() {
  console.log('='.repeat(70));
  console.log('Duplicate URL Detection at Scale - Demo');
  console.log('='.repeat(70));

  // Generate test URLs
  const numURLs = 10000;
  console.log(`\n📊 Generating ${numURLs} test URLs...`);
  const urls = generateTestURLs(numURLs);

  console.log('   Sample URLs:');
  urls.slice(0, 5).forEach((url, i) => {
    console.log(`     ${i + 1}. ${url}`);
  });

  // Test 1: Hash Partitioning
  console.log('\n' + '='.repeat(70));
  console.log('Method 1: Hash-Based Partitioning');
  console.log('='.repeat(70));

  const partitioner = new HashPartitioner(100);

  console.log('\n📦 Partitioning URLs...');
  for (const url of urls) {
    partitioner.addURL(url);
  }

  console.log('\nPartition Stats:');
  const partStats = partitioner.getStats();
  Object.entries(partStats).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });

  const duplicates1 = partitioner.findAllDuplicates();

  console.log(`\n✅ Results:`);
  console.log(`   Total duplicates found: ${duplicates1.length}`);
  console.log(`   Sample duplicates:`);
  duplicates1.slice(0, 5).forEach(dup => {
    console.log(`     - ${dup.url} (${dup.count} occurrences)`);
  });

  // Test 2: Bloom Filter Approach
  console.log('\n' + '='.repeat(70));
  console.log('Method 2: Bloom Filter + Verification');
  console.log('='.repeat(70));

  const bloomDetector = new BloomFilterDuplicateDetector(numURLs, 0.01);

  bloomDetector.firstPass(urls);
  const duplicates2 = bloomDetector.secondPass();

  const bloomResults = bloomDetector.getResults();

  console.log('\n✅ Results:');
  console.log('   Stats:', bloomResults.stats);
  console.log('   Bloom Filter:', bloomResults.bloomFilter);
  console.log('   Actual FPR:', bloomResults.actualFPR);

  // Test 3: MapReduce Pattern
  console.log('\n' + '='.repeat(70));
  console.log('Method 3: MapReduce Pattern');
  console.log('='.repeat(70));

  const mapReduceDetector = new MapReduceDuplicateDetector();
  const duplicates3 = mapReduceDetector.runJob(urls);

  console.log('\n✅ Results:');
  console.log(`   Duplicate groups found: ${duplicates3.length}`);
  console.log(`   Sample groups:`);
  duplicates3.slice(0, 3).forEach(group => {
    console.log(`     Hash: ${group.hash.substring(0, 8)}...`);
    console.log(`     Count: ${group.count}`);
    console.log(`     URLs: ${group.urls.slice(0, 2).join(', ')}...`);
  });

  // Test 4: Streaming Detector
  console.log('\n' + '='.repeat(70));
  console.log('Method 4: Streaming Detection');
  console.log('='.repeat(70));

  const streamDetector = new StreamingDuplicateDetector(5000);

  console.log('\n⚡ Processing URLs in stream...');
  let duplicateCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const result = streamDetector.processURL(urls[i]);
    if (result && result.isDuplicate) {
      duplicateCount++;
      if (duplicateCount <= 5) {
        console.log(`   Duplicate detected: ${result.url}`);
      }
    }
  }

  console.log('\n✅ Results:');
  const streamStats = streamDetector.getStats();
  Object.entries(streamStats).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });

  // Comparison
  console.log('\n' + '='.repeat(70));
  console.log('📊 Method Comparison');
  console.log('='.repeat(70));

  console.log(`
┌─────────────────────┬──────────────┬──────────────┬──────────────┐
│ Method              │ Duplicates   │ Memory       │ Performance  │
├─────────────────────┼──────────────┼──────────────┼──────────────┤
│ Hash Partitioning   │ ${duplicates1.length.toString().padEnd(12)} │ Low          │ Fast         │
│ Bloom Filter        │ ${duplicates2.length.toString().padEnd(12)} │ Very Low     │ Medium       │
│ MapReduce           │ ${duplicates3.length.toString().padEnd(12)} │ Distributed  │ Scalable     │
│ Streaming           │ ${streamStats.duplicates.toString().padEnd(12)} │ Fixed        │ Real-time    │
└─────────────────────┴──────────────┴──────────────┴──────────────┘
  `);

  console.log('\n' + '='.repeat(70));
  console.log('Recommendation:');
  console.log('  • Small dataset (<10M URLs): Hash Set in memory');
  console.log('  • Medium dataset (10M-1B URLs): Hash Partitioning');
  console.log('  • Large dataset (>1B URLs): MapReduce or Bloom Filter');
  console.log('  • Real-time: Streaming with fixed memory');
  console.log('='.repeat(70));
}

// Run demo if executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

// ============================================================================
// 8. Exports (导出)
// ============================================================================

module.exports = {
  URLNormalizer,
  BloomFilter,
  HashPartitioner,
  BloomFilterDuplicateDetector,
  MapReduceDuplicateDetector,
  StreamingDuplicateDetector,
  generateTestURLs,
  runDemo
};
