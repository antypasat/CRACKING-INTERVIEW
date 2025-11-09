# Pastebin - Text Sharing Service / 文本分享服务

## Problem Description / 问题描述

**English:**
Design a service like Pastebin where users can enter text (code snippets, logs, notes) and receive a short, randomly generated URL to share. The system should handle millions of pastes per day, support expiration, syntax highlighting, privacy settings, and scale globally with high availability.

**中文:**
设计一个类似Pastebin的服务，用户可以输入文本（代码片段、日志、笔记）并获得一个简短的随机生成URL来分享。系统应该能够处理每天数百万次粘贴，支持过期、语法高亮、隐私设置，并在全球范围内扩展，具有高可用性。

## Requirements Analysis / 需求分析

### Functional Requirements / 功能需求

1. **Create Paste / 创建粘贴**
   - Submit text content (up to 10MB)
   - Get unique short URL
   - Optional: Set expiration time (1 hour, 1 day, 1 week, never)
   - Optional: Set privacy (public, unlisted, private with password)
   - Optional: Set syntax highlighting language

2. **View Paste / 查看粘贴**
   - Access via short URL
   - View formatted text with syntax highlighting
   - Download raw content
   - Clone/fork paste

3. **Expiration / 过期**
   - Auto-delete after expiration time
   - Burn after read (self-destruct after first view)
   - Manual deletion by creator

4. **Additional Features / 附加功能**
   - Anonymous and authenticated posting
   - Edit paste (for authenticated users)
   - Paste history (for authenticated users)
   - Search public pastes
   - API access

### Non-Functional Requirements / 非功能需求

1. **Scalability / 可扩展性**
   - Handle 10M+ pastes per day
   - Store 100B+ pastes
   - Serve 100K+ reads per second
   - Global distribution

2. **Availability / 可用性**
   - 99.9% uptime
   - Low latency (<100ms) globally
   - Graceful degradation

3. **Performance / 性能**
   - Paste creation: <500ms
   - Paste retrieval: <100ms
   - URL generation: <10ms

4. **Storage / 存储**
   - Efficient storage for large text files
   - Compression for text
   - Archival of old pastes

5. **Security / 安全**
   - Rate limiting to prevent abuse
   - CAPTCHA for anonymous users
   - Content moderation
   - Password protection for private pastes

## High-Level Architecture / 高层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Web    │  │  Mobile  │  │   CLI    │  │   API    │       │
│  │ Browser  │  │   App    │  │   Tool   │  │ Clients  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼────────────────────────────────────────────────────────┐
│                  CDN / Edge Network                            │
│              (CloudFlare, CloudFront)                          │
│                                                                 │
│  • Static assets (CSS, JS, fonts)                             │
│  • Popular paste caching                                       │
│  • DDoS protection                                             │
│  • SSL/TLS termination                                         │
└───────┬────────────────────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────────────────────┐
│              Load Balancer (NGINX / ALB)                       │
│                                                                 │
│  • Health checks                                               │
│  • SSL/TLS                                                     │
│  • Rate limiting (global)                                      │
│  • Request routing                                             │
└───────┬────────────────────────────────────────────────────────┘
        │
        ├──────────────┬──────────────┬──────────────┐
        │              │              │              │
┌───────▼────┐ ┌──────▼──────┐┌─────▼──────┐┌──────▼─────┐
│   Write    │ │    Read     ││   Delete   ││   Search   │
│  Service   │ │   Service   ││  Service   ││  Service   │
│            │ │             ││            ││            │
│ • Create   │ │ • Get paste ││ • Expire   ││ • Index    │
│   paste    │ │ • Validate  ││ • Cleanup  ││ • Query    │
│ • Generate │ │ • Decompress││            ││            │
│   URL      │ │ • Syntax    ││            ││            │
│ • Compress │ │   highlight ││            ││            │
└───────┬────┘ └──────┬──────┘└─────┬──────┘└──────┬─────┘
        │              │             │              │
        └──────────────┴─────────────┴──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────────────┐  ┌────▼────────────────────────┐
│    URL Generation          │  │    Message Queue            │
│       Service              │  │      (Kafka/SQS)            │
│                            │  │                             │
│  • Base62 encoding         │  │  ┌────────────────────────┐ │
│  • Collision detection     │  │  │  Expiration Events     │ │
│  • Range-based ID          │  │  │  Analytics Events      │ │
│  • Distributed counter     │  │  │  Moderation Events     │ │
│  • Zookeeper coordination  │  │  └────────────────────────┘ │
└────────────────────────────┘  └─────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────────────┐  ┌────▼────────────────────────┐
│    Cache Layer (Redis)     │  │   Background Workers        │
│                            │  │                             │
│  • Recent pastes           │  │  • Expiration cleanup       │
│  • Popular pastes          │  │  • Syntax highlighting      │
│  • Metadata cache          │  │  • Analytics aggregation    │
│  • Rate limit counters     │  │  • Content moderation       │
│  • TTL: 1-24 hours         │  │  • Archive old pastes       │
└────────────────────────────┘  └─────────────────────────────┘
                       │
        ┌──────────────┴──────────────────────────────┐
        │                                              │
┌───────▼────────────────────┐  ┌──────────────────────▼──────┐
│   Primary Database         │  │   Object Storage (S3)       │
│   (PostgreSQL/Cassandra)   │  │                             │
│                            │  │  • Large pastes (>1MB)      │
│  • Paste metadata          │  │  • Raw text files           │
│  • User data               │  │  • Compressed archives      │
│  • Short URLs              │  │  • Syntax highlighted HTML  │
│  • Small pastes (<100KB)   │  │  • Backups                  │
│                            │  │                             │
│  Partitioned by:           │  │  Organized by:              │
│  • Creation time           │  │  • Year/Month buckets       │
│  • Hash of short URL       │  │  • Lifecycle policies       │
└────────────────────────────┘  └─────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              Analytics & Monitoring                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Prometheus  │  │   Grafana    │  │  ELK Stack   │         │
│  │   Metrics    │  │  Dashboards  │  │     Logs     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema / 数据库模式

### Paste Table / 粘贴表

```sql
CREATE TABLE pastes (
    paste_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_url VARCHAR(10) UNIQUE NOT NULL,  -- e.g., "aB3xK9"
    title VARCHAR(255),
    content TEXT,  -- For small pastes (<100KB), else NULL
    content_s3_key VARCHAR(500),  -- S3 key for large pastes
    content_size BIGINT NOT NULL,  -- Size in bytes
    is_compressed BOOLEAN DEFAULT TRUE,

    language VARCHAR(50),  -- Syntax highlighting language
    is_encrypted BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),  -- For password-protected pastes

    privacy ENUM('PUBLIC', 'UNLISTED', 'PRIVATE') DEFAULT 'PUBLIC',

    expiration_time TIMESTAMP NULL,  -- NULL = never expires
    burn_after_read BOOLEAN DEFAULT FALSE,
    has_been_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP,

    user_id BIGINT,  -- NULL for anonymous
    ip_address VARCHAR(45),  -- IPv6 compatible
    user_agent TEXT,

    view_count BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    INDEX idx_short_url (short_url),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    INDEX idx_expiration (expiration_time),
    INDEX idx_privacy_created (privacy, created_at DESC),
    FULLTEXT INDEX idx_content (title, content)
) PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
    PARTITION p202401 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01'))
    -- Add partitions monthly
);
```

### User Table / 用户表

```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    api_key VARCHAR(64) UNIQUE,

    -- Limits
    daily_paste_limit INT DEFAULT 100,
    max_paste_size BIGINT DEFAULT 10485760,  -- 10MB

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_api_key (api_key)
);
```

### URL Counter Table (for distributed ID generation) / URL计数器表

```sql
CREATE TABLE url_counters (
    shard_id INT PRIMARY KEY,
    current_value BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initialize shards (0-99 for 100 shards)
INSERT INTO url_counters (shard_id, current_value)
SELECT seq, 0 FROM (SELECT @row := @row + 1 as seq FROM
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t1,
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t2,
    (SELECT @row := -1) r LIMIT 100) numbers;
```

### Analytics Table / 分析表

```sql
CREATE TABLE paste_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_url VARCHAR(10) NOT NULL,
    event_type ENUM('VIEW', 'DOWNLOAD', 'CLONE', 'DELETE'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    referer TEXT,

    INDEX idx_short_url_time (short_url, timestamp),
    INDEX idx_timestamp (timestamp)
) PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp));
```

## URL Generation Strategy / URL生成策略

### Requirements for Short URLs / 短URL需求

```
Characters: [a-zA-Z0-9] = 62 characters (base62)
URL length: 6-7 characters

Capacity:
- 6 characters: 62^6 = 56.8 billion URLs
- 7 characters: 62^7 = 3.5 trillion URLs

For 10M pastes/day:
- 6 characters: 56.8B / 10M = 5,680 days (~15.6 years)
- 7 characters: 3.5T / 10M = 350,000 days (~958 years)

Decision: Use 7 characters for future-proofing
```

### Approach 1: Hash-based / 基于哈希

```javascript
// Hash the content and take first 7 characters
function generateShortUrl(content) {
    const hash = md5(content);
    return base62Encode(hash).substring(0, 7);
}

Pros:
✅ Deterministic (same content = same URL, deduplication)
✅ No database lookup for generation
✅ Distributed-friendly

Cons:
❌ Hash collisions possible
❌ Predictable URLs (security concern)
❌ Cannot customize URLs
```

### Approach 2: Counter-based (Recommended) / 基于计数器

```javascript
// Use distributed counter with base62 encoding
function generateShortUrl() {
    const id = getNextId(); // e.g., 12345678
    return base62Encode(id); // e.g., "aBc123D"
}

// Distributed counter using range allocation
class DistributedCounter {
    constructor(serverId, rangeSize = 1000000) {
        this.serverId = serverId;
        this.rangeSize = rangeSize;
        this.currentRange = this.allocateRange();
        this.currentId = this.currentRange.start;
    }

    allocateRange() {
        // Get exclusive range from database
        // Server 0: 0-999,999
        // Server 1: 1,000,000-1,999,999
        // etc.
        const start = db.incrementCounter(serverId, rangeSize);
        return { start, end: start + rangeSize - 1 };
    }

    getNextId() {
        if (this.currentId >= this.currentRange.end) {
            this.currentRange = this.allocateRange();
            this.currentId = this.currentRange.start;
        }
        return this.currentId++;
    }
}

Pros:
✅ Guaranteed unique IDs
✅ Sequential (good for database indexing)
✅ No collisions
✅ Scalable with range allocation

Cons:
❌ Requires coordination
❌ Predictable (can enumerate all pastes)
```

### Approach 3: Random with Collision Check / 随机加冲突检查

```javascript
function generateShortUrl() {
    const maxAttempts = 5;

    for (let i = 0; i < maxAttempts; i++) {
        const url = generateRandomString(7);
        if (!urlExists(url)) {
            return url;
        }
    }

    // Fallback to counter-based
    return base62Encode(getNextId());
}

Pros:
✅ Unpredictable URLs (better security)
✅ Simple implementation
✅ No central coordination

Cons:
❌ Collision checks required
❌ Performance degrades as DB fills
❌ Wasted database queries
```

### Recommended Hybrid Approach / 推荐的混合方法

```javascript
// Use counter but shuffle bits for unpredictability
function generateShortUrl() {
    const id = getNextId();
    const shuffled = shuffleBits(id);  // Bit manipulation
    return base62Encode(shuffled);
}

// Example bit shuffling
function shuffleBits(num) {
    // Reverse bits
    let result = 0;
    for (let i = 0; i < 48; i++) {
        result = (result << 1) | (num & 1);
        num >>= 1;
    }
    return result;
}

Pros:
✅ Unique IDs
✅ Unpredictable URLs
✅ No collision checks
✅ Reversible (can decode back to ID)
```

## API Specifications / API规范

### Create Paste / 创建粘贴

```
POST /api/v1/paste
Description: Create a new paste
Request Body:
{
    "content": "console.log('Hello, World!');",
    "title": "Hello World Example",
    "language": "javascript",
    "privacy": "PUBLIC",  // PUBLIC, UNLISTED, PRIVATE
    "expiration": "1h",   // 1h, 1d, 1w, never
    "burnAfterRead": false,
    "password": "optional_password"  // For PRIVATE
}

Response:
{
    "success": true,
    "shortUrl": "aB3xK9",
    "fullUrl": "https://pastebin.example.com/aB3xK9",
    "expiresAt": "2024-01-15T11:30:00Z"
}

Status Codes:
201 Created: Paste created successfully
400 Bad Request: Invalid input
413 Payload Too Large: Content exceeds size limit
429 Too Many Requests: Rate limit exceeded
```

### Get Paste / 获取粘贴

```
GET /api/v1/paste/{shortUrl}
Description: Retrieve a paste
Query Parameters:
    - password: Required if paste is password-protected
    - raw: true (return plain text instead of JSON)

Response:
{
    "shortUrl": "aB3xK9",
    "title": "Hello World Example",
    "content": "console.log('Hello, World!');",
    "language": "javascript",
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-01-15T11:30:00Z",
    "viewCount": 42,
    "privacy": "PUBLIC"
}

Status Codes:
200 OK: Paste retrieved successfully
401 Unauthorized: Invalid password
404 Not Found: Paste not found or expired
410 Gone: Paste was deleted or burned
```

### Delete Paste / 删除粘贴

```
DELETE /api/v1/paste/{shortUrl}
Description: Delete a paste (creator only)
Headers:
    Authorization: Bearer {token}

Status Codes:
204 No Content: Deleted successfully
401 Unauthorized: Invalid token
403 Forbidden: Not the creator
404 Not Found: Paste not found
```

### Search Pastes / 搜索粘贴

```
GET /api/v1/search
Description: Search public pastes
Query Parameters:
    - q: Search query
    - language: Filter by language
    - limit: Number of results (max 100)
    - offset: Pagination offset

Response:
{
    "results": [
        {
            "shortUrl": "aB3xK9",
            "title": "Hello World Example",
            "snippet": "console.log('Hello, World!')",
            "language": "javascript",
            "createdAt": "2024-01-15T10:30:00Z"
        }
    ],
    "total": 1523,
    "limit": 20,
    "offset": 0
}
```

## Key Design Considerations / 关键设计考虑

### 1. Storage Strategy / 存储策略

**Small Pastes (<100KB) / 小粘贴**
```
Storage: Database (TEXT column)
Reason:
- Fast retrieval (no external API call)
- Atomic with metadata
- Good for majority of pastes

Format: Compressed (gzip) base64
Example:
Original: 10KB → Compressed: 2KB (80% reduction)
```

**Large Pastes (100KB-10MB) / 大粘贴**
```
Storage: Object Storage (S3, GCS, Azure Blob)
Reason:
- Cost-effective for large files
- Scalable
- CDN integration

Organization:
s3://pastebin-content/{year}/{month}/{shortUrl}.txt.gz

Lifecycle:
- Frequent Access: S3 Standard (first 30 days)
- Infrequent Access: S3 IA (30-90 days)
- Archive: S3 Glacier (>90 days)
```

**Content Compression / 内容压缩**
```javascript
// Compress text before storage
const zlib = require('zlib');

function compressContent(text) {
    return zlib.gzipSync(text).toString('base64');
}

function decompressContent(compressed) {
    return zlib.gunzipSync(Buffer.from(compressed, 'base64')).toString();
}

Compression Ratios:
- Source code: 60-80% reduction
- JSON/XML: 70-90% reduction
- Plain text: 50-70% reduction
- Already compressed: 0-10% reduction
```

### 2. Expiration and Cleanup / 过期和清理

**Passive Expiration / 被动过期**
```javascript
// Check expiration on read
function getPaste(shortUrl) {
    const paste = db.getPaste(shortUrl);

    if (!paste) {
        return null;
    }

    if (paste.expirationTime && Date.now() > paste.expirationTime) {
        // Lazy deletion
        deletePaste(shortUrl);
        return null;
    }

    return paste;
}
```

**Active Expiration / 主动过期**
```javascript
// Background job runs every hour
function expireOldPastes() {
    const expiredPastes = db.query(`
        SELECT short_url, content_s3_key
        FROM pastes
        WHERE expiration_time < NOW()
        AND is_deleted = FALSE
        LIMIT 10000
    `);

    for (const paste of expiredPastes) {
        // Delete from S3 if applicable
        if (paste.content_s3_key) {
            s3.deleteObject(paste.content_s3_key);
        }

        // Mark as deleted in DB (or hard delete)
        db.deletePaste(paste.short_url);
    }
}

Schedule: Every hour via cron or scheduled task
```

**Burn After Read / 阅后即焚**
```javascript
function getPaste(shortUrl) {
    const paste = db.getPaste(shortUrl);

    if (!paste) {
        return null;
    }

    if (paste.burnAfterRead && !paste.hasBeenRead) {
        // Mark as read and schedule deletion
        db.update(paste.id, { hasBeenRead: true });
        queue.push({ action: 'delete', shortUrl, delay: 60000 }); // Delete after 1 min
    }

    return paste;
}
```

### 3. Caching Strategy / 缓存策略

**Cache Layers / 缓存层**

```
L1 - CDN Edge Cache:
    Content: Popular public pastes
    TTL: 1 hour
    Hit rate: 40-50%

L2 - Redis Cache:
    Content: Recent pastes, metadata
    TTL: 30 minutes
    Hit rate: 30-40%

L3 - Database Query Cache:
    Content: Query results
    TTL: 5 minutes
    Hit rate: 10-20%

Total cache hit rate: 80-90%
```

**Cache Invalidation / 缓存失效**
```javascript
function updatePaste(shortUrl, newContent) {
    // Update database
    db.updatePaste(shortUrl, newContent);

    // Invalidate caches
    redis.del(`paste:${shortUrl}`);
    cdn.purge(`https://pastebin.com/${shortUrl}`);

    // Publish cache invalidation event
    pubsub.publish('cache-invalidate', { shortUrl });
}
```

### 4. Rate Limiting / 速率限制

**Per-IP Rate Limiting / 基于IP的速率限制**
```javascript
// Using Redis for distributed rate limiting
class RateLimiter {
    constructor(redis) {
        this.redis = redis;
    }

    async checkLimit(ip, limit, windowSeconds) {
        const key = `ratelimit:${ip}`;
        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.expire(key, windowSeconds);
        }

        return current <= limit;
    }
}

// Apply limits
Anonymous users: 10 pastes per hour
Authenticated users: 100 pastes per hour
API users: 1000 pastes per hour (with API key)
```

**Sliding Window Rate Limiting / 滑动窗口速率限制**
```javascript
async function checkRateLimitSlidingWindow(userId, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove old entries
    await redis.zremrangebyscore(`rl:${userId}`, 0, windowStart);

    // Count current entries
    const count = await redis.zcard(`rl:${userId}`);

    if (count >= limit) {
        return false; // Rate limit exceeded
    }

    // Add new entry
    await redis.zadd(`rl:${userId}`, now, now);
    await redis.expire(`rl:${userId}`, windowMs / 1000);

    return true;
}
```

### 5. Security Considerations / 安全考虑

**Content Validation / 内容验证**
```javascript
function validatePaste(content, title) {
    // Size limits
    if (content.length > 10 * 1024 * 1024) {
        throw new Error('Content too large');
    }

    // Malicious content detection
    if (containsMalware(content)) {
        throw new Error('Malicious content detected');
    }

    // Spam detection
    if (isSpam(content, title)) {
        throw new Error('Spam detected');
    }

    // PII detection (optional warning)
    if (containsPII(content)) {
        warn('Possible PII detected');
    }

    return true;
}
```

**Password Protection / 密码保护**
```javascript
const bcrypt = require('bcrypt');

function createPrivatePaste(content, password) {
    const passwordHash = bcrypt.hashSync(password, 10);

    return db.createPaste({
        content,
        privacy: 'PRIVATE',
        passwordHash
    });
}

function accessPrivatePaste(shortUrl, password) {
    const paste = db.getPaste(shortUrl);

    if (!paste || paste.privacy !== 'PRIVATE') {
        throw new Error('Not found');
    }

    if (!bcrypt.compareSync(password, paste.passwordHash)) {
        throw new Error('Invalid password');
    }

    return paste;
}
```

**DDoS Protection / DDoS防护**
```
1. Rate limiting at multiple levels:
   - CDN level (CloudFlare)
   - Load balancer level (NGINX)
   - Application level (Redis)

2. CAPTCHA for anonymous users:
   - reCAPTCHA v3 (invisible)
   - Challenge for suspicious activity

3. IP blocking:
   - Automatic blocking of abusive IPs
   - Geo-blocking if needed

4. Request size limits:
   - Max 10MB per paste
   - Max 100 requests per minute
```

## Scalability Patterns / 可扩展性模式

### Horizontal Scaling / 水平扩展

**Stateless Application Servers / 无状态应用服务器**
```
All servers are identical and stateless
Session data in Redis (if needed)
Easy to add/remove servers
Auto-scaling based on CPU/memory
```

**Database Sharding / 数据库分片**
```
Shard by: hash(short_url) % num_shards

Shard 0: URLs starting with [a-m]
Shard 1: URLs starting with [n-z, 0-9]

Advantages:
- Distribute load
- Parallel queries
- Independent scaling

Disadvantages:
- Complex cross-shard queries
- Rebalancing difficulty
```

**Read Replicas / 读副本**
```
1 Master (writes)
N Replicas (reads)

Read/Write Ratio: ~100:1 for Pastebin
Use replicas for all GET requests
Master only for POST, DELETE
```

### Geographic Distribution / 地理分布

```
Multi-Region Deployment:

US-East: Primary (RDS master, S3 primary)
US-West: Replica (RDS replica, S3 replication)
EU: Replica (RDS replica, S3 replication)
Asia: Replica (RDS replica, S3 replication)

DNS-based routing (Route53):
- Latency-based routing
- Geo-proximity routing
- Health-check failover

CDN: Global edge caching
- CloudFront / CloudFlare
- Cache popular pastes
- SSL termination
```

## Performance Optimization / 性能优化

### Database Optimization / 数据库优化

```sql
-- Optimize for read-heavy workload

-- Index on short_url for fast lookups
CREATE INDEX idx_short_url ON pastes(short_url);

-- Index on expiration for cleanup jobs
CREATE INDEX idx_expiration ON pastes(expiration_time)
WHERE expiration_time IS NOT NULL;

-- Partial index for active pastes only
CREATE INDEX idx_active_pastes ON pastes(created_at DESC)
WHERE is_deleted = FALSE;

-- Covering index for list queries
CREATE INDEX idx_list_covering ON pastes(privacy, created_at DESC)
INCLUDE (short_url, title, language);

-- Partition by creation date for easier archival
ALTER TABLE pastes PARTITION BY RANGE (YEAR(created_at));
```

### Query Optimization / 查询优化

```javascript
// Use prepared statements
const stmt = db.prepare('SELECT * FROM pastes WHERE short_url = ?');
const paste = stmt.get(shortUrl);

// Fetch only needed columns
SELECT short_url, content, language, created_at
FROM pastes
WHERE short_url = ?;
// Don't SELECT *

// Use LIMIT for list queries
SELECT * FROM pastes
WHERE privacy = 'PUBLIC'
ORDER BY created_at DESC
LIMIT 100;
```

## Monitoring and Metrics / 监控和指标

### Key Metrics / 关键指标

```
Business Metrics:
- Pastes created per day/hour
- Unique visitors
- Popular languages
- Average paste size
- Expiration distribution

Performance Metrics:
- API latency (p50, p95, p99)
- Cache hit rate
- Database query time
- S3 upload/download time
- CDN hit rate

System Metrics:
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth
- Error rate

Security Metrics:
- Rate limit violations
- Failed password attempts
- Suspicious content detections
```

## Trade-offs / 权衡

### Short URL Length / 短URL长度

**6 characters / 6个字符:**
- ✅ Shorter URLs
- ✅ Easier to type/share
- ❌ Limited capacity (56B)
- ❌ Runs out sooner

**7 characters / 7个字符:**
- ✅ Huge capacity (3.5T)
- ✅ Future-proof
- ❌ Slightly longer URLs

**Decision: 7 characters / 决定：7个字符**

### Storage Location / 存储位置

**Database / 数据库:**
- ✅ Fast access
- ✅ ACID properties
- ✅ Simple queries
- ❌ Expensive for large files
- ❌ Limited scalability

**Object Storage (S3) / 对象存储:**
- ✅ Cheap storage
- ✅ Unlimited scalability
- ✅ CDN integration
- ❌ Network latency
- ❌ Eventual consistency

**Decision: Hybrid (DB for small, S3 for large) / 决定：混合方式**

### Expiration Strategy / 过期策略

**Active Deletion / 主动删除:**
- ✅ Frees storage immediately
- ✅ Clean database
- ❌ CPU overhead
- ❌ Needs scheduling

**Lazy Deletion / 懒惰删除:**
- ✅ No background jobs
- ✅ Low overhead
- ❌ Storage not freed immediately
- ❌ Clutter in database

**Decision: Hybrid (lazy + scheduled cleanup) / 决定：混合方式**

## Recommended Technologies / 推荐技术

### Backend / 后端
- **Node.js + Express**: Fast, async I/O
- **Go**: High performance, low memory
- **Python + FastAPI**: Rapid development

### Database / 数据库
- **PostgreSQL**: ACID, full-text search
- **Cassandra**: High write throughput, scalability
- **MongoDB**: Flexible schema, good for JSON

### Cache / 缓存
- **Redis**: Fast, distributed, pub/sub
- **Memcached**: Simple, high performance

### Object Storage / 对象存储
- **AWS S3**: Durable, scalable, cheap
- **Google Cloud Storage**: Similar to S3
- **MinIO**: Self-hosted S3-compatible

### CDN / 内容分发网络
- **CloudFlare**: Free tier, DDoS protection
- **CloudFront**: AWS integration
- **Fastly**: Real-time purging

### Load Balancer / 负载均衡
- **NGINX**: High performance, flexible
- **HAProxy**: Advanced features
- **AWS ALB**: Managed service

## Conclusion / 结论

**English:**
This Pastebin design provides a scalable, performant, and secure text-sharing service. The hybrid storage approach, distributed URL generation, multi-level caching, and global CDN distribution ensure the system can handle millions of pastes per day with low latency worldwide. The architecture supports both anonymous and authenticated users while providing features like expiration, syntax highlighting, and privacy controls.

**中文:**
这个Pastebin设计提供了一个可扩展、高性能和安全的文本分享服务。混合存储方法、分布式URL生成、多级缓存和全球CDN分发确保系统可以处理每天数百万次粘贴，并在全球范围内保持低延迟。该架构支持匿名和认证用户，同时提供过期、语法高亮和隐私控制等功能。
