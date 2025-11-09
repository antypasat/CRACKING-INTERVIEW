# 9.3 Web Crawler Design (网络爬虫设计)

## Problem Statement (问题描述)

**English:**
Design a web crawler that can download all pages from a website while avoiding infinite loops. The crawler should be scalable, respect website policies, and handle edge cases like duplicate URLs, redirect chains, and dynamic content.

**中文:**
设计一个能从网站下载所有页面同时避免无限循环的网络爬虫。爬虫应该是可扩展的，尊重网站策略，并处理重复URL、重定向链和动态内容等边界情况。

---

## Requirements Analysis (需求分析)

### Functional Requirements (功能需求)

**English:**
1. Start from a seed URL and discover new URLs
2. Download and parse HTML content
3. Extract links from pages
4. Avoid infinite loops and duplicate crawling
5. Respect robots.txt
6. Handle different content types (HTML, PDF, images)
7. Store crawled data

**中文:**
1. 从种子URL开始并发现新URL
2. 下载和解析HTML内容
3. 从页面提取链接
4. 避免无限循环和重复爬取
5. 遵守robots.txt
6. 处理不同内容类型（HTML、PDF、图片）
7. 存储爬取的数据

### Non-Functional Requirements (非功能需求)

**English:**
- **Scale**: Handle billions of URLs
- **Throughput**: 1000+ pages per second
- **Politeness**: Rate limit per domain (1 request/second)
- **Reliability**: Resume from failures
- **Efficiency**: Minimize bandwidth and storage

**中文:**
- **规模**: 处理数十亿URL
- **吞吐量**: 每秒1000+页面
- **礼貌性**: 每个域的速率限制（1请求/秒）
- **可靠性**: 从失败中恢复
- **效率**: 最小化带宽和存储

---

## High-Level Architecture (高层架构)

```
┌─────────────────────────────────────────────────────────┐
│                    Seed URLs                            │
│              (Entry points to crawl)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  URL Frontier                           │
│           (Priority Queue of URLs to crawl)             │
│                                                          │
│  • Prioritization (important pages first)               │
│  • Politeness (rate limit per domain)                   │
│  • Freshness (re-crawl old pages)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              URL Deduplication                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Bloom Filter │  │  Hash Table  │  │   Database   │ │
│  │  (Fast check)│  │ (Recent URLs)│  │ (All URLs)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Crawler Workers (Distributed)              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Worker 1 │  │ Worker 2 │  │ Worker N │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  1. Fetch robots.txt                                    │
│  2. Download page                                       │
│  3. Parse HTML                                          │
│  4. Extract links                                       │
│  5. Normalize URLs                                      │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│  Content Store   │   │   Link Extractor │
│                  │   │                  │
│  • S3/HDFS       │   │  • New URLs      │
│  • Compressed    │   │  • Back to queue │
│  • Indexed       │   │                  │
└──────────────────┘   └──────────────────┘

┌─────────────────────────────────────────────────────────┐
│            Monitoring & Analytics                       │
├─────────────────────────────────────────────────────────┤
│  • Crawl rate, queue size, error rate                   │
│  • Domain statistics, duplicate rate                    │
│  • Worker health, resource usage                        │
└─────────────────────────────────────────────────────────┘
```

---

## Avoiding Infinite Loops (避免无限循环)

### Problem Scenarios (问题场景)

**English:**

1. **Duplicate URLs**: Same page accessible via multiple URLs
   - `example.com/page?id=1`
   - `example.com/page?id=1&ref=home`

2. **Redirect Chains**: A → B → C → A (cycle)

3. **Dynamic URLs**: Calendar, pagination with infinite pages
   - `example.com/calendar?date=2025-01-01`
   - `example.com/calendar?date=2025-01-02`
   - ... (infinite dates)

4. **Spider Traps**: Intentional infinite paths
   - `example.com/a/b/c/d/e/f/g/h/i/j/...`

**中文:**

1. **重复URL**: 同一页面通过多个URL访问
2. **重定向链**: A → B → C → A（循环）
3. **动态URL**: 日历、无限分页
4. **爬虫陷阱**: 故意的无限路径

### Solutions (解决方案)

#### 1. URL Deduplication (URL去重)

**Bloom Filter (布隆过滤器)**

```javascript
// Fast, memory-efficient probabilistic check
// False positive possible, false negative never

class BloomFilter {
  constructor(size, numHashFunctions) {
    this.size = size;
    this.bits = new Uint8Array(Math.ceil(size / 8));
    this.numHashFunctions = numHashFunctions;
  }

  add(url) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hash = this.hash(url, i) % this.size;
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      this.bits[byteIndex] |= (1 << bitIndex);
    }
  }

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

  hash(url, seed) {
    // Simple hash function (use better one in production)
    let hash = seed;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
```

**Memory Calculation:**
- For 10 billion URLs with 1% false positive rate:
- Bloom filter: ~14 GB
- Hash table: ~400 GB (assuming 40 bytes per URL)

#### 2. URL Normalization (URL规范化)

```javascript
function normalizeURL(url) {
  try {
    const parsed = new URL(url);

    // 1. Convert to lowercase
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();

    // 2. Remove default port
    if ((parsed.protocol === 'http:' && parsed.port === '80') ||
        (parsed.protocol === 'https:' && parsed.port === '443')) {
      parsed.port = '';
    }

    // 3. Remove fragment (anchor)
    parsed.hash = '';

    // 4. Sort query parameters
    if (parsed.search) {
      const params = new URLSearchParams(parsed.search);
      const sorted = new URLSearchParams(
        [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))
      );
      parsed.search = sorted.toString();
    }

    // 5. Remove trailing slash (except for root)
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }

    // 6. Remove session IDs and tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'sessionid'];
    const cleanParams = new URLSearchParams(parsed.search);
    trackingParams.forEach(param => cleanParams.delete(param));
    parsed.search = cleanParams.toString();

    return parsed.toString();
  } catch (error) {
    return null; // Invalid URL
  }
}

// Example:
// normalizeURL('HTTP://Example.com:80/Page?b=2&a=1#section')
// -> 'http://example.com/Page?a=1&b=2'
```

#### 3. Depth Limiting (深度限制)

```javascript
class CrawlURL {
  constructor(url, depth = 0, parent = null) {
    this.url = url;
    this.depth = depth;
    this.parent = parent;
  }
}

// Only crawl up to depth 5
const MAX_DEPTH = 5;

function shouldCrawl(crawlURL) {
  return crawlURL.depth <= MAX_DEPTH;
}
```

#### 4. Redirect Chain Detection (重定向链检测)

```javascript
const MAX_REDIRECTS = 10;

async function followRedirects(url, visited = new Set()) {
  if (visited.size > MAX_REDIRECTS) {
    throw new Error('Too many redirects');
  }

  if (visited.has(url)) {
    throw new Error('Redirect cycle detected');
  }

  visited.add(url);

  const response = await fetch(url, { redirect: 'manual' });

  if (response.status >= 300 && response.status < 400) {
    const redirectURL = response.headers.get('Location');
    return followRedirects(redirectURL, visited);
  }

  return url;
}
```

#### 5. robots.txt Respect (遵守robots.txt)

```javascript
class RobotsTxtParser {
  constructor() {
    this.rules = new Map(); // domain -> rules
  }

  async fetchRobotsTxt(domain) {
    const robotsURL = `${domain}/robots.txt`;

    try {
      const response = await fetch(robotsURL);
      const text = await response.text();
      this.parseRobotsTxt(domain, text);
    } catch (error) {
      // If robots.txt doesn't exist, allow everything
      this.rules.set(domain, { allowed: ['*'], disallowed: [] });
    }
  }

  parseRobotsTxt(domain, content) {
    const lines = content.split('\n');
    const rules = { allowed: [], disallowed: [], crawlDelay: 0 };

    let currentUserAgent = null;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('#') || trimmed === '') continue;

      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();

      if (key.toLowerCase() === 'user-agent') {
        currentUserAgent = value;
      } else if (currentUserAgent === '*' || currentUserAgent === 'MyBot') {
        if (key.toLowerCase() === 'disallow') {
          rules.disallowed.push(value);
        } else if (key.toLowerCase() === 'allow') {
          rules.allowed.push(value);
        } else if (key.toLowerCase() === 'crawl-delay') {
          rules.crawlDelay = parseInt(value);
        }
      }
    }

    this.rules.set(domain, rules);
  }

  canCrawl(url) {
    const parsed = new URL(url);
    const domain = `${parsed.protocol}//${parsed.hostname}`;
    const path = parsed.pathname;

    if (!this.rules.has(domain)) {
      return true; // No rules, allow
    }

    const rules = this.rules.get(domain);

    // Check disallowed paths
    for (const pattern of rules.disallowed) {
      if (pattern === '' || path.startsWith(pattern)) {
        return false;
      }
    }

    return true;
  }

  getCrawlDelay(domain) {
    return this.rules.get(domain)?.crawlDelay || 1; // Default 1 second
  }
}
```

---

## Politeness Policy (礼貌策略)

**English:**

To avoid overwhelming servers and getting blocked:

1. **Rate Limiting**: 1 request per second per domain
2. **Crawl Delay**: Respect robots.txt crawl-delay
3. **User-Agent**: Identify your crawler properly
4. **Backoff**: Exponential backoff on errors
5. **Time Restrictions**: Only crawl during off-peak hours (optional)

**中文:**

为避免使服务器过载和被封锁：

1. **速率限制**: 每个域每秒1个请求
2. **爬取延迟**: 遵守robots.txt的爬取延迟
3. **用户代理**: 正确识别你的爬虫
4. **退避**: 错误时指数退避
5. **时间限制**: 仅在非高峰时段爬取（可选）

```javascript
class PolitenessManager {
  constructor() {
    // Map: domain -> last access time
    this.lastAccess = new Map();
    this.crawlDelay = 1000; // 1 second default
  }

  async waitIfNeeded(domain) {
    const lastTime = this.lastAccess.get(domain);

    if (lastTime) {
      const elapsed = Date.now() - lastTime;
      const remaining = this.crawlDelay - elapsed;

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    }

    this.lastAccess.set(domain, Date.now());
  }
}
```

---

## URL Frontier (URL前沿队列)

**English:**

The URL Frontier is a priority queue that decides which URLs to crawl next.

**Factors:**
1. **Priority**: Important pages first (homepage > deep pages)
2. **Freshness**: Recently updated pages should be re-crawled
3. **Politeness**: Distribute requests across domains
4. **Depth**: Breadth-first vs depth-first

**中文:**

URL前沿队列是一个优先队列，决定接下来爬取哪些URL。

**因素:**
1. **优先级**: 重要页面优先（首页 > 深层页面）
2. **新鲜度**: 最近更新的页面应重新爬取
3. **礼貌性**: 在域之间分配请求
4. **深度**: 广度优先vs深度优先

```javascript
class URLFrontier {
  constructor() {
    // Separate queue for each domain
    this.domainQueues = new Map();

    // Priority of domains
    this.domainPriority = [];
  }

  add(url, priority = 0, depth = 0) {
    const domain = new URL(url).hostname;

    if (!this.domainQueues.has(domain)) {
      this.domainQueues.set(domain, []);
      this.domainPriority.push(domain);
    }

    this.domainQueues.get(domain).push({
      url,
      priority,
      depth,
      addedAt: Date.now()
    });

    // Sort by priority (higher first)
    this.domainQueues.get(domain).sort((a, b) => b.priority - a.priority);
  }

  getNext() {
    // Round-robin across domains for politeness
    if (this.domainPriority.length === 0) {
      return null;
    }

    const domain = this.domainPriority.shift();
    const queue = this.domainQueues.get(domain);

    if (queue && queue.length > 0) {
      const item = queue.shift();

      // Put domain back in rotation if it has more URLs
      if (queue.length > 0) {
        this.domainPriority.push(domain);
      } else {
        this.domainQueues.delete(domain);
      }

      return item;
    }

    return this.getNext();
  }

  isEmpty() {
    return this.domainPriority.length === 0;
  }

  size() {
    let total = 0;
    for (const queue of this.domainQueues.values()) {
      total += queue.length;
    }
    return total;
  }
}
```

---

## Distributed Crawling (分布式爬取)

**English:**

For large-scale crawling, distribute work across multiple machines.

**Approaches:**

1. **By Domain**: Each worker handles specific domains
   - Worker 1: a-f.com
   - Worker 2: g-m.com
   - Worker 3: n-z.com

2. **By URL Hash**: Hash URL and assign to worker
   - Worker i handles URLs where hash(url) % N == i

3. **Centralized Queue**: Central coordinator assigns URLs to workers
   - More flexible, but central coordinator is bottleneck

**中文:**

对于大规模爬取，在多台机器上分配工作。

**方法:**

1. **按域**: 每个工作器处理特定域
2. **按URL哈希**: 哈希URL并分配给工作器
3. **集中队列**: 中央协调器分配URL给工作器

---

## Storage (存储)

### Content Storage (内容存储)

```javascript
// Store raw HTML
{
  "url": "https://example.com/page",
  "content": "<html>...",
  "contentType": "text/html",
  "contentLength": 50000,
  "headers": {
    "content-type": "text/html; charset=utf-8",
    "last-modified": "2025-11-09T12:00:00Z"
  },
  "crawledAt": "2025-11-09T14:30:00Z",
  "statusCode": 200
}
```

### URL Index (URL索引)

```javascript
// Track crawl status
{
  "url": "https://example.com/page",
  "urlHash": "abc123...",
  "status": "crawled", // pending, crawling, crawled, error
  "lastCrawled": "2025-11-09T14:30:00Z",
  "nextCrawl": "2025-11-16T14:30:00Z",
  "crawlCount": 5,
  "depth": 2,
  "parentUrl": "https://example.com"
}
```

---

## Handling Edge Cases (处理边界情况)

### 1. JavaScript-Rendered Content

**Problem**: Modern websites use JavaScript to load content
**Solution**: Use headless browser (Puppeteer, Playwright)

```javascript
const puppeteer = require('puppeteer');

async function crawlJSPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const content = await page.content();
  const links = await page.$$eval('a', anchors =>
    anchors.map(a => a.href)
  );

  await browser.close();

  return { content, links };
}
```

### 2. API-Based Crawling

Some sites offer APIs instead of HTML crawling.

### 3. Image and PDF Handling

Extract text from images (OCR) and PDFs for indexing.

---

## Monitoring & Metrics (监控与指标)

**Key Metrics:**
- Pages crawled per second
- Queue size (URLs pending)
- Duplicate rate
- Error rate (4xx, 5xx)
- Average page size
- Crawl depth distribution

**Alerts:**
- Queue size > 1 million (too many pending)
- Error rate > 5%
- Worker down
- Disk space low

---

## Trade-offs (权衡)

| Aspect | Option A | Option B | Recommendation |
|--------|----------|----------|----------------|
| **Deduplication** | Hash table (exact) | Bloom filter (probabilistic) | Bloom filter + DB for verification |
| **Crawl Strategy** | Breadth-first | Depth-first | Breadth-first for most cases |
| **Content Storage** | Raw HTML | Parsed data | Raw HTML + extracted data |
| **Politeness** | Strict (slow) | Aggressive (fast) | Respect robots.txt, be polite |
| **Distribution** | Centralized | Distributed | Distributed for scale |

---

## Cost Estimation (成本估算)

**For crawling 10 billion URLs:**

- **Storage**: 10B URLs × 100 KB avg = 1 PB
- **Bandwidth**: 1 PB download + 100 TB upload = $10,000/month
- **Compute**: 1000 servers × $100/month = $100,000/month
- **Database**: $20,000/month

**Total**: ~$130,000/month

---

## References (参考资料)

- Bloom Filters for deduplication
- robots.txt specification
- Scrapy, Apache Nutch (open-source crawlers)
- URL normalization standards
- Politeness policies
