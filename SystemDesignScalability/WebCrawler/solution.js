/**
 * Web Crawler Implementation
 * Demonstrates: URL deduplication, normalization, politeness, robots.txt, frontier queue
 */

const crypto = require('crypto');

// ============================================================================
// 1. Bloom Filter for URL Deduplication (布隆过滤器用于URL去重)
// ============================================================================

class BloomFilter {
  /**
   * Probabilistic data structure for fast membership testing
   * 用于快速成员测试的概率数据结构
   *
   * @param {number} expectedItems - Expected number of items
   * @param {number} falsePositiveRate - Desired false positive rate (e.g., 0.01)
   */
  constructor(expectedItems, falsePositiveRate = 0.01) {
    // Calculate optimal size and number of hash functions
    this.size = Math.ceil(
      -(expectedItems * Math.log(falsePositiveRate)) / (Math.log(2) ** 2)
    );
    this.numHashFunctions = Math.ceil((this.size / expectedItems) * Math.log(2));

    // Use typed array for memory efficiency
    this.bits = new Uint8Array(Math.ceil(this.size / 8));

    this.itemCount = 0;
  }

  /**
   * Add URL to bloom filter
   * 添加URL到布隆过滤器
   */
  add(url) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hash = this.hash(url, i) % this.size;
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      this.bits[byteIndex] |= (1 << bitIndex);
    }
    this.itemCount++;
  }

  /**
   * Check if URL might be in the set
   * 检查URL是否可能在集合中
   *
   * @returns {boolean} - true: might be in set, false: definitely not in set
   */
  contains(url) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hash = this.hash(url, i) % this.size;
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      if ((this.bits[byteIndex] & (1 << bitIndex)) === 0) {
        return false; // Definitely not seen
      }
    }
    return true; // Probably seen
  }

  /**
   * Hash function with seed
   * 带种子的哈希函数
   */
  hash(str, seed) {
    const hash = crypto.createHash('md5');
    hash.update(str + seed);
    const digest = hash.digest();

    // Convert first 4 bytes to integer
    return Math.abs(
      digest[0] | (digest[1] << 8) | (digest[2] << 16) | (digest[3] << 24)
    );
  }

  /**
   * Get memory usage in MB
   * 获取内存使用量（MB）
   */
  getMemoryUsage() {
    return (this.bits.length / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Get estimated false positive rate
   * 获取估计的假阳性率
   */
  getEstimatedFPR() {
    const k = this.numHashFunctions;
    const m = this.size;
    const n = this.itemCount;

    // FPR = (1 - e^(-kn/m))^k
    const fpr = Math.pow(1 - Math.exp(-k * n / m), k);
    return (fpr * 100).toFixed(4) + '%';
  }
}

// ============================================================================
// 2. URL Normalization (URL规范化)
// ============================================================================

class URLNormalizer {
  /**
   * Normalize URL to canonical form
   * 将URL规范化为标准形式
   */
  static normalize(urlString) {
    try {
      const url = new URL(urlString);

      // 1. Convert protocol and hostname to lowercase
      url.protocol = url.protocol.toLowerCase();
      url.hostname = url.hostname.toLowerCase();

      // 2. Remove default ports
      if ((url.protocol === 'http:' && url.port === '80') ||
          (url.protocol === 'https:' && url.port === '443')) {
        url.port = '';
      }

      // 3. Remove fragment (anchor)
      url.hash = '';

      // 4. Sort query parameters
      if (url.search) {
        const params = new URLSearchParams(url.search);
        const sorted = new URLSearchParams(
          [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))
        );
        url.search = sorted.toString();
      }

      // 5. Remove trailing slash (except for root)
      if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
      }

      // 6. Remove common tracking parameters
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'fbclid', 'gclid', 'msclkid', 'sessionid', 'sid'
      ];

      const cleanParams = new URLSearchParams(url.search);
      trackingParams.forEach(param => cleanParams.delete(param));

      if (cleanParams.toString()) {
        url.search = '?' + cleanParams.toString();
      } else {
        url.search = '';
      }

      // 7. Decode percent-encoded characters (if safe)
      try {
        url.pathname = decodeURIComponent(url.pathname);
        url.pathname = encodeURI(url.pathname);
      } catch (e) {
        // Keep original if decoding fails
      }

      return url.toString();
    } catch (error) {
      return null; // Invalid URL
    }
  }

  /**
   * Extract domain from URL
   * 从URL提取域名
   */
  static getDomain(urlString) {
    try {
      const url = new URL(urlString);
      return `${url.protocol}//${url.hostname}`;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if URL is absolute
   * 检查URL是否是绝对路径
   */
  static isAbsolute(urlString) {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Resolve relative URL to absolute
   * 将相对URL解析为绝对URL
   */
  static resolve(baseURL, relativeURL) {
    try {
      return new URL(relativeURL, baseURL).toString();
    } catch (error) {
      return null;
    }
  }
}

// ============================================================================
// 3. robots.txt Parser (robots.txt解析器)
// ============================================================================

class RobotsTxtParser {
  constructor() {
    this.rules = new Map(); // domain -> rules
  }

  /**
   * Parse robots.txt content
   * 解析robots.txt内容
   */
  parse(domain, content) {
    const lines = content.split('\n');
    const rules = {
      allowed: [],
      disallowed: [],
      crawlDelay: 1,
      sitemaps: []
    };

    let currentUserAgent = null;
    let isRelevantUserAgent = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key === 'user-agent') {
        currentUserAgent = value.toLowerCase();
        isRelevantUserAgent = (currentUserAgent === '*' || currentUserAgent === 'mybot');
      } else if (isRelevantUserAgent) {
        if (key === 'disallow') {
          rules.disallowed.push(value);
        } else if (key === 'allow') {
          rules.allowed.push(value);
        } else if (key === 'crawl-delay') {
          rules.crawlDelay = Math.max(1, parseInt(value) || 1);
        } else if (key === 'sitemap') {
          rules.sitemaps.push(value);
        }
      }
    }

    this.rules.set(domain, rules);
    return rules;
  }

  /**
   * Check if URL can be crawled
   * 检查URL是否可以被爬取
   */
  canCrawl(url) {
    const domain = URLNormalizer.getDomain(url);
    const path = new URL(url).pathname;

    if (!this.rules.has(domain)) {
      return true; // No rules, allow by default
    }

    const rules = this.rules.get(domain);

    // Check allowed paths first (more specific)
    for (const pattern of rules.allowed) {
      if (path.startsWith(pattern)) {
        return true;
      }
    }

    // Check disallowed paths
    for (const pattern of rules.disallowed) {
      if (pattern === '' || path.startsWith(pattern)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get crawl delay for domain
   * 获取域的爬取延迟
   */
  getCrawlDelay(domain) {
    return this.rules.get(domain)?.crawlDelay || 1;
  }
}

// ============================================================================
// 4. URL Frontier (Priority Queue) (URL前沿优先队列)
// ============================================================================

class URLFrontier {
  constructor() {
    // Separate queue for each domain (for politeness)
    this.domainQueues = new Map();

    // Domain rotation for round-robin
    this.domainRotation = [];

    // Total URLs in frontier
    this.totalSize = 0;
  }

  /**
   * Add URL to frontier
   * 添加URL到前沿队列
   */
  add(url, priority = 0, depth = 0) {
    const domain = URLNormalizer.getDomain(url);

    if (!domain) return;

    if (!this.domainQueues.has(domain)) {
      this.domainQueues.set(domain, []);
      this.domainRotation.push(domain);
    }

    this.domainQueues.get(domain).push({
      url,
      priority,
      depth,
      addedAt: Date.now()
    });

    this.totalSize++;

    // Keep domain queue sorted by priority (higher first)
    this.domainQueues.get(domain).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get next URL to crawl (round-robin across domains)
   * 获取下一个要爬取的URL（域之间轮询）
   */
  getNext() {
    if (this.domainRotation.length === 0) {
      return null;
    }

    // Round-robin: take from first domain in rotation
    const domain = this.domainRotation.shift();
    const queue = this.domainQueues.get(domain);

    if (queue && queue.length > 0) {
      const item = queue.shift();
      this.totalSize--;

      // Put domain back in rotation if it has more URLs
      if (queue.length > 0) {
        this.domainRotation.push(domain);
      } else {
        this.domainQueues.delete(domain);
      }

      return item;
    }

    // Queue was empty, try next domain
    return this.getNext();
  }

  /**
   * Check if frontier is empty
   * 检查前沿队列是否为空
   */
  isEmpty() {
    return this.totalSize === 0;
  }

  /**
   * Get total size
   * 获取总大小
   */
  size() {
    return this.totalSize;
  }

  /**
   * Get stats
   * 获取统计信息
   */
  getStats() {
    return {
      totalURLs: this.totalSize,
      numDomains: this.domainQueues.size,
      avgURLsPerDomain: this.domainQueues.size > 0
        ? (this.totalSize / this.domainQueues.size).toFixed(2)
        : 0
    };
  }
}

// ============================================================================
// 5. Politeness Manager (礼貌管理器)
// ============================================================================

class PolitenessManager {
  constructor(defaultDelay = 1000) {
    // Map: domain -> last access time
    this.lastAccess = new Map();

    // Map: domain -> crawl delay (ms)
    this.crawlDelays = new Map();

    this.defaultDelay = defaultDelay;
  }

  /**
   * Wait if needed to respect crawl delay
   * 如果需要等待以遵守爬取延迟
   */
  async waitIfNeeded(domain) {
    const delay = this.crawlDelays.get(domain) || this.defaultDelay;
    const lastTime = this.lastAccess.get(domain);

    if (lastTime) {
      const elapsed = Date.now() - lastTime;
      const remaining = delay - elapsed;

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    }

    this.lastAccess.set(domain, Date.now());
  }

  /**
   * Set crawl delay for domain
   * 设置域的爬取延迟
   */
  setCrawlDelay(domain, delaySeconds) {
    this.crawlDelays.set(domain, delaySeconds * 1000);
  }
}

// ============================================================================
// 6. Web Crawler (网络爬虫)
// ============================================================================

class WebCrawler {
  constructor(config = {}) {
    this.maxDepth = config.maxDepth || 5;
    this.maxURLs = config.maxURLs || 1000;
    this.userAgent = config.userAgent || 'MyBot/1.0';
    this.respectRobotsTxt = config.respectRobotsTxt !== false;

    // Components
    this.bloomFilter = new BloomFilter(this.maxURLs * 2, 0.01);
    this.visitedURLs = new Set(); // Exact tracking for small scale
    this.frontier = new URLFrontier();
    this.robotsParser = new RobotsTxtParser();
    this.politeness = new PolitenessManager();

    // Statistics
    this.stats = {
      urlsDiscovered: 0,
      urlsCrawled: 0,
      urlsSkipped: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };

    // Results
    this.crawledPages = [];
  }

  /**
   * Start crawling from seed URLs
   * 从种子URL开始爬取
   */
  async crawl(seedURLs) {
    this.stats.startTime = Date.now();

    // Add seed URLs to frontier
    for (const url of seedURLs) {
      const normalized = URLNormalizer.normalize(url);
      if (normalized) {
        this.frontier.add(normalized, 100, 0); // High priority, depth 0
        this.stats.urlsDiscovered++;
      }
    }

    // Main crawl loop
    while (!this.frontier.isEmpty() && this.stats.urlsCrawled < this.maxURLs) {
      const item = this.frontier.getNext();

      if (!item) break;

      await this.crawlURL(item.url, item.depth);
    }

    this.stats.endTime = Date.now();

    return this.getResults();
  }

  /**
   * Crawl a single URL
   * 爬取单个URL
   */
  async crawlURL(url, depth) {
    const normalized = URLNormalizer.normalize(url);

    if (!normalized) {
      this.stats.urlsSkipped++;
      return;
    }

    // Check if already visited (avoid loops)
    if (this.bloomFilter.contains(normalized)) {
      if (this.visitedURLs.has(normalized)) {
        console.log(`⏭️  Skipping duplicate: ${normalized}`);
        this.stats.urlsSkipped++;
        return;
      }
    }

    // Check depth limit
    if (depth > this.maxDepth) {
      console.log(`⏭️  Skipping (max depth): ${normalized}`);
      this.stats.urlsSkipped++;
      return;
    }

    // Check robots.txt
    const domain = URLNormalizer.getDomain(normalized);

    if (this.respectRobotsTxt) {
      if (!this.robotsParser.rules.has(domain)) {
        await this.fetchRobotsTxt(domain);
      }

      if (!this.robotsParser.canCrawl(normalized)) {
        console.log(`🚫 Blocked by robots.txt: ${normalized}`);
        this.stats.urlsSkipped++;
        return;
      }
    }

    // Wait for politeness
    await this.politeness.waitIfNeeded(domain);

    // Mark as visited
    this.bloomFilter.add(normalized);
    this.visitedURLs.add(normalized);

    try {
      console.log(`🕷️  Crawling [depth ${depth}]: ${normalized}`);

      // Simulate fetch (in production, use real HTTP client)
      const pageData = await this.fetchPage(normalized);

      this.stats.urlsCrawled++;

      // Extract links
      const links = this.extractLinks(pageData.content, normalized);

      // Add new links to frontier
      for (const link of links) {
        const normalizedLink = URLNormalizer.normalize(link);
        if (normalizedLink && !this.visitedURLs.has(normalizedLink)) {
          this.frontier.add(normalizedLink, 50, depth + 1);
          this.stats.urlsDiscovered++;
        }
      }

      // Store result
      this.crawledPages.push({
        url: normalized,
        depth,
        links: links.length,
        size: pageData.content.length,
        crawledAt: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ Error crawling ${normalized}:`, error.message);
      this.stats.errors++;
    }
  }

  /**
   * Fetch robots.txt for domain
   * 获取域的robots.txt
   */
  async fetchRobotsTxt(domain) {
    const robotsURL = `${domain}/robots.txt`;

    try {
      console.log(`📋 Fetching robots.txt: ${robotsURL}`);

      // Simulate fetch (in production, use real HTTP client)
      const content = await this.fetchPage(robotsURL);

      this.robotsParser.parse(domain, content.content);

      const crawlDelay = this.robotsParser.getCrawlDelay(domain);
      this.politeness.setCrawlDelay(domain, crawlDelay);

    } catch (error) {
      // If robots.txt doesn't exist, allow everything
      console.log(`ℹ️  No robots.txt for ${domain}, allowing all`);
      this.robotsParser.parse(domain, ''); // Empty rules = allow all
    }
  }

  /**
   * Fetch page content (simulated)
   * 获取页面内容（模拟）
   */
  async fetchPage(url) {
    // In production, use a real HTTP client like axios or node-fetch
    // This is a simulation

    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    // Simulate different page contents
    const content = `
      <html>
        <head><title>Page ${url}</title></head>
        <body>
          <h1>Page ${url}</h1>
          <a href="${url}/page1">Link 1</a>
          <a href="${url}/page2">Link 2</a>
          <a href="https://example.com/external">External</a>
        </body>
      </html>
    `;

    return {
      url,
      content,
      statusCode: 200,
      headers: {
        'content-type': 'text/html'
      }
    };
  }

  /**
   * Extract links from HTML content (simplified)
   * 从HTML内容提取链接（简化版）
   */
  extractLinks(html, baseURL) {
    const links = [];

    // Simple regex to find href attributes (in production, use proper HTML parser)
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;

    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];

      // Resolve relative URLs
      const absoluteURL = URLNormalizer.isAbsolute(href)
        ? href
        : URLNormalizer.resolve(baseURL, href);

      if (absoluteURL && (absoluteURL.startsWith('http://') || absoluteURL.startsWith('https://'))) {
        links.push(absoluteURL);
      }
    }

    return links;
  }

  /**
   * Get crawl results and statistics
   * 获取爬取结果和统计信息
   */
  getResults() {
    const duration = (this.stats.endTime - this.stats.startTime) / 1000;

    return {
      stats: {
        ...this.stats,
        duration: duration.toFixed(2) + ' seconds',
        urlsPerSecond: (this.stats.urlsCrawled / duration).toFixed(2),
        duplicateRate: ((this.stats.urlsSkipped / this.stats.urlsDiscovered) * 100).toFixed(2) + '%'
      },
      bloomFilter: {
        memoryUsage: this.bloomFilter.getMemoryUsage(),
        estimatedFPR: this.bloomFilter.getEstimatedFPR()
      },
      frontier: this.frontier.getStats(),
      pages: this.crawledPages
    };
  }
}

// ============================================================================
// 7. Demo (演示)
// ============================================================================

async function runDemo() {
  console.log('='.repeat(60));
  console.log('Web Crawler Demo - Avoiding Infinite Loops');
  console.log('='.repeat(60));

  const crawler = new WebCrawler({
    maxDepth: 3,
    maxURLs: 20,
    userAgent: 'MyBot/1.0',
    respectRobotsTxt: true
  });

  const seedURLs = [
    'https://example.com',
    'https://example.org'
  ];

  console.log('\n📍 Starting crawl from seed URLs:');
  seedURLs.forEach(url => console.log(`   - ${url}`));
  console.log('');

  const results = await crawler.crawl(seedURLs);

  console.log('\n' + '='.repeat(60));
  console.log('📊 Crawl Results');
  console.log('='.repeat(60));

  console.log('\nStatistics:');
  console.log(`   URLs Discovered: ${results.stats.urlsDiscovered}`);
  console.log(`   URLs Crawled: ${results.stats.urlsCrawled}`);
  console.log(`   URLs Skipped: ${results.stats.urlsSkipped}`);
  console.log(`   Errors: ${results.stats.errors}`);
  console.log(`   Duration: ${results.stats.duration}`);
  console.log(`   URLs/second: ${results.stats.urlsPerSecond}`);
  console.log(`   Duplicate Rate: ${results.stats.duplicateRate}`);

  console.log('\nBloom Filter:');
  console.log(`   Memory Usage: ${results.bloomFilter.memoryUsage}`);
  console.log(`   Estimated FPR: ${results.bloomFilter.estimatedFPR}`);

  console.log('\nFrontier Stats:');
  console.log(`   Total URLs: ${results.frontier.totalURLs}`);
  console.log(`   Num Domains: ${results.frontier.numDomains}`);

  console.log('\nCrawled Pages (sample):');
  results.pages.slice(0, 10).forEach((page, i) => {
    console.log(`   ${i + 1}. ${page.url}`);
    console.log(`      Depth: ${page.depth}, Links: ${page.links}, Size: ${page.size} bytes`);
  });

  console.log('\n' + '='.repeat(60));
}

// Run demo if executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

// ============================================================================
// 8. Exports (导出)
// ============================================================================

module.exports = {
  BloomFilter,
  URLNormalizer,
  RobotsTxtParser,
  URLFrontier,
  PolitenessManager,
  WebCrawler,
  runDemo
};
