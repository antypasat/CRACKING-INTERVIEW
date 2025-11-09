/**
 * Pastebin - Text Sharing Service
 * 文本分享服务
 *
 * Features:
 * - Short URL generation (base62 encoding)
 * - Content compression
 * - Expiration management
 * - Privacy settings
 * - Rate limiting
 * - Syntax highlighting metadata
 */

const crypto = require('crypto');
const zlib = require('zlib');

// ============================================================================
// 1. Base62 Encoding for Short URLs / Base62编码用于短URL
// ============================================================================

class Base62Encoder {
  constructor() {
    this.charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.base = this.charset.length; // 62
  }

  /**
   * Encode a number to base62 string
   */
  encode(num) {
    if (num === 0) return this.charset[0];

    let result = '';
    while (num > 0) {
      result = this.charset[num % this.base] + result;
      num = Math.floor(num / this.base);
    }

    return result;
  }

  /**
   * Decode a base62 string to number
   */
  decode(str) {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = this.charset.indexOf(char);
      if (value === -1) {
        throw new Error(`Invalid character in base62 string: ${char}`);
      }
      result = result * this.base + value;
    }
    return result;
  }

  /**
   * Generate random base62 string of given length
   */
  random(length = 7) {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.base);
      result += this.charset[randomIndex];
    }
    return result;
  }
}

// ============================================================================
// 2. URL Generator with Distributed Counter / 带分布式计数器的URL生成器
// ============================================================================

class URLGenerator {
  constructor(serverId = 0, totalServers = 10) {
    this.serverId = serverId;
    this.totalServers = totalServers;
    this.base62 = new Base62Encoder();

    // Range allocation per server to avoid collisions
    this.rangeSize = 1000000; // 1 million IDs per range
    this.currentRange = this.allocateRange();
    this.currentId = this.currentRange.start;
  }

  /**
   * Allocate a range of IDs for this server
   */
  allocateRange() {
    // Each server gets non-overlapping ranges
    const start = this.serverId * this.rangeSize;
    const end = start + this.rangeSize - 1;
    return { start, end };
  }

  /**
   * Get next sequential ID
   */
  getNextId() {
    if (this.currentId >= this.currentRange.end) {
      // Request new range (in production, this would be from DB)
      this.serverId += this.totalServers;
      this.currentRange = this.allocateRange();
      this.currentId = this.currentRange.start;
    }

    return this.currentId++;
  }

  /**
   * Generate short URL using counter-based approach
   */
  generateShortUrl() {
    const id = this.getNextId();
    return this.base62.encode(id);
  }

  /**
   * Generate short URL with bit shuffling for unpredictability
   */
  generateShortUrlShuffled() {
    const id = this.getNextId();
    const shuffled = this.shuffleBits(id);
    return this.base62.encode(shuffled);
  }

  /**
   * Shuffle bits to make IDs less predictable
   */
  shuffleBits(num) {
    // Simple bit reversal
    let result = 0;
    for (let i = 0; i < 32; i++) {
      result = (result << 1) | (num & 1);
      num >>= 1;
    }
    return result;
  }

  /**
   * Generate random short URL (with collision check needed)
   */
  generateRandomShortUrl(length = 7) {
    return this.base62.random(length);
  }
}

// ============================================================================
// 3. Content Compression / 内容压缩
// ============================================================================

class ContentCompressor {
  /**
   * Compress content using gzip
   */
  compress(text) {
    const buffer = Buffer.from(text, 'utf8');
    const compressed = zlib.gzipSync(buffer);
    return {
      data: compressed.toString('base64'),
      originalSize: buffer.length,
      compressedSize: compressed.length,
      compressionRatio: (1 - compressed.length / buffer.length).toFixed(2)
    };
  }

  /**
   * Decompress content
   */
  decompress(compressedData) {
    const buffer = Buffer.from(compressedData, 'base64');
    const decompressed = zlib.gunzipSync(buffer);
    return decompressed.toString('utf8');
  }

  /**
   * Check if compression is worthwhile
   */
  shouldCompress(text, threshold = 0.1) {
    // Only compress if we save at least 10%
    const result = this.compress(text);
    return parseFloat(result.compressionRatio) > threshold;
  }
}

// ============================================================================
// 4. Paste Model / 粘贴模型
// ============================================================================

class Paste {
  constructor(shortUrl, content, options = {}) {
    this.shortUrl = shortUrl;
    this.title = options.title || '';
    this.content = content;
    this.contentSize = Buffer.byteLength(content, 'utf8');

    this.language = options.language || 'text';
    this.privacy = options.privacy || 'PUBLIC'; // PUBLIC, UNLISTED, PRIVATE

    this.expirationTime = this.calculateExpiration(options.expiration);
    this.burnAfterRead = options.burnAfterRead || false;
    this.hasBeenRead = false;

    this.passwordHash = options.passwordHash || null;
    this.isEncrypted = !!options.passwordHash;

    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.lastAccessed = null;

    this.userId = options.userId || null;
    this.ipAddress = options.ipAddress || null;

    this.viewCount = 0;
    this.isDeleted = false;

    this.isCompressed = false;
    this.contentS3Key = null; // For large pastes stored in S3
  }

  /**
   * Calculate expiration time
   */
  calculateExpiration(expiration) {
    if (!expiration || expiration === 'never') {
      return null;
    }

    const now = Date.now();
    const durations = {
      '10m': 10 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000
    };

    const duration = durations[expiration] || durations['1d'];
    return now + duration;
  }

  /**
   * Check if paste is expired
   */
  isExpired() {
    if (!this.expirationTime) {
      return false;
    }
    return Date.now() > this.expirationTime;
  }

  /**
   * Check if paste should be deleted after read
   */
  shouldBurn() {
    return this.burnAfterRead && this.hasBeenRead;
  }

  /**
   * Mark as accessed
   */
  markAccessed() {
    this.lastAccessed = Date.now();
    this.viewCount++;

    if (this.burnAfterRead && !this.hasBeenRead) {
      this.hasBeenRead = true;
    }
  }

  /**
   * Get paste metadata without content
   */
  getMetadata() {
    return {
      shortUrl: this.shortUrl,
      title: this.title,
      contentSize: this.contentSize,
      language: this.language,
      privacy: this.privacy,
      createdAt: this.createdAt,
      expiresAt: this.expirationTime,
      viewCount: this.viewCount,
      burnAfterRead: this.burnAfterRead
    };
  }
}

// ============================================================================
// 5. Paste Storage Service / 粘贴存储服务
// ============================================================================

class PasteStorageService {
  constructor() {
    this.pastes = new Map(); // shortUrl -> Paste
    this.compressor = new ContentCompressor();
    this.smallPasteThreshold = 100 * 1024; // 100KB
  }

  /**
   * Store a paste
   */
  store(paste) {
    // Compress if content is large enough
    if (paste.contentSize > 1000 && this.compressor.shouldCompress(paste.content)) {
      const compressed = this.compressor.compress(paste.content);
      paste.content = compressed.data;
      paste.isCompressed = true;
      paste.contentSize = compressed.compressedSize;
    }

    // For very large pastes, simulate S3 storage
    if (paste.contentSize > this.smallPasteThreshold) {
      paste.contentS3Key = `pastes/${new Date().getFullYear()}/${paste.shortUrl}`;
      // In production, would upload to S3 here
      console.log(`[S3] Uploading large paste to ${paste.contentS3Key}`);
    }

    this.pastes.set(paste.shortUrl, paste);
    return paste;
  }

  /**
   * Retrieve a paste
   */
  retrieve(shortUrl) {
    const paste = this.pastes.get(shortUrl);

    if (!paste) {
      return null;
    }

    if (paste.isDeleted) {
      return null;
    }

    if (paste.isExpired()) {
      this.delete(shortUrl);
      return null;
    }

    // Decompress if needed
    if (paste.isCompressed) {
      paste.content = this.compressor.decompress(paste.content);
      paste.isCompressed = false;
    }

    // Load from S3 if needed (simulated)
    if (paste.contentS3Key && !paste.content) {
      console.log(`[S3] Downloading paste from ${paste.contentS3Key}`);
      // In production, would download from S3 here
    }

    paste.markAccessed();

    // Schedule burn if needed
    if (paste.shouldBurn()) {
      setTimeout(() => this.delete(shortUrl), 60000); // Delete after 1 minute
    }

    return paste;
  }

  /**
   * Delete a paste
   */
  delete(shortUrl) {
    const paste = this.pastes.get(shortUrl);
    if (paste) {
      paste.isDeleted = true;

      // Delete from S3 if applicable
      if (paste.contentS3Key) {
        console.log(`[S3] Deleting paste from ${paste.contentS3Key}`);
      }
    }
    return true;
  }

  /**
   * Get statistics
   */
  getStats() {
    let totalPastes = 0;
    let totalSize = 0;
    let compressedPastes = 0;
    let s3Pastes = 0;

    for (const paste of this.pastes.values()) {
      if (!paste.isDeleted) {
        totalPastes++;
        totalSize += paste.contentSize;
        if (paste.isCompressed) compressedPastes++;
        if (paste.contentS3Key) s3Pastes++;
      }
    }

    return {
      totalPastes,
      totalSize,
      compressedPastes,
      s3Pastes,
      averageSize: totalPastes > 0 ? (totalSize / totalPastes).toFixed(2) : 0
    };
  }

  /**
   * Cleanup expired pastes (background job)
   */
  cleanupExpired() {
    let deletedCount = 0;

    for (const [shortUrl, paste] of this.pastes.entries()) {
      if (paste.isExpired() || paste.shouldBurn()) {
        this.delete(shortUrl);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// ============================================================================
// 6. Rate Limiter / 速率限制器
// ============================================================================

class RateLimiter {
  constructor() {
    this.limits = new Map(); // key -> { count, resetTime }
  }

  /**
   * Check if request is allowed
   */
  checkLimit(key, maxRequests, windowMs) {
    const now = Date.now();
    const limiter = this.limits.get(key);

    if (!limiter || now > limiter.resetTime) {
      // New window
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (limiter.count >= maxRequests) {
      // Limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetIn: limiter.resetTime - now
      };
    }

    // Increment count
    limiter.count++;
    return {
      allowed: true,
      remaining: maxRequests - limiter.count
    };
  }

  /**
   * Clear old entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, limiter] of this.limits.entries()) {
      if (now > limiter.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// ============================================================================
// 7. Pastebin Service / Pastebin服务
// ============================================================================

class PastebinService {
  constructor() {
    this.urlGenerator = new URLGenerator();
    this.storage = new PasteStorageService();
    this.rateLimiter = new RateLimiter();

    // Rate limits
    this.limits = {
      anonymous: { requests: 10, window: 60 * 60 * 1000 }, // 10 per hour
      authenticated: { requests: 100, window: 60 * 60 * 1000 }, // 100 per hour
      api: { requests: 1000, window: 60 * 60 * 1000 } // 1000 per hour
    };
  }

  /**
   * Create a new paste
   */
  createPaste(content, options = {}) {
    // Check rate limit
    const userType = options.userId ? 'authenticated' : 'anonymous';
    const limitKey = options.ipAddress || options.userId || 'unknown';
    const limit = this.limits[userType];

    const rateLimitResult = this.rateLimiter.checkLimit(
      limitKey,
      limit.requests,
      limit.window
    );

    if (!rateLimitResult.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.resetIn / 1000)}s`);
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (Buffer.byteLength(content, 'utf8') > maxSize) {
      throw new Error('Content exceeds maximum size of 10MB');
    }

    // Generate short URL
    const shortUrl = this.urlGenerator.generateShortUrlShuffled();

    // Create paste
    const paste = new Paste(shortUrl, content, options);

    // Store paste
    this.storage.store(paste);

    return {
      shortUrl: paste.shortUrl,
      fullUrl: `https://pastebin.example.com/${paste.shortUrl}`,
      expiresAt: paste.expirationTime,
      created: true
    };
  }

  /**
   * Get a paste
   */
  getPaste(shortUrl, password = null) {
    const paste = this.storage.retrieve(shortUrl);

    if (!paste) {
      throw new Error('Paste not found or expired');
    }

    // Check password for private pastes
    if (paste.isEncrypted && paste.passwordHash) {
      if (!password || !this.verifyPassword(password, paste.passwordHash)) {
        throw new Error('Invalid password');
      }
    }

    return {
      shortUrl: paste.shortUrl,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      privacy: paste.privacy,
      createdAt: paste.createdAt,
      expiresAt: paste.expirationTime,
      viewCount: paste.viewCount,
      burnAfterRead: paste.burnAfterRead
    };
  }

  /**
   * Delete a paste
   */
  deletePaste(shortUrl, userId = null) {
    const paste = this.storage.pastes.get(shortUrl);

    if (!paste) {
      throw new Error('Paste not found');
    }

    // Check ownership
    if (paste.userId && paste.userId !== userId) {
      throw new Error('Unauthorized to delete this paste');
    }

    return this.storage.delete(shortUrl);
  }

  /**
   * List recent public pastes
   */
  listRecentPastes(limit = 10) {
    const pastes = Array.from(this.storage.pastes.values())
      .filter(p => !p.isDeleted && p.privacy === 'PUBLIC' && !p.isExpired())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map(p => p.getMetadata());

    return pastes;
  }

  /**
   * Get service statistics
   */
  getStats() {
    return this.storage.getStats();
  }

  /**
   * Run cleanup job
   */
  runCleanup() {
    const deletedCount = this.storage.cleanupExpired();
    this.rateLimiter.cleanup();
    return { deletedPastes: deletedCount };
  }

  verifyPassword(password, hash) {
    // Simplified password verification (use bcrypt in production)
    const crypto = require('crypto');
    const testHash = crypto.createHash('sha256').update(password).digest('hex');
    return testHash === hash;
  }

  hashPassword(password) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}

// ============================================================================
// 8. Example Usage and Tests / 示例用法和测试
// ============================================================================

function demonstratePastebin() {
  console.log('='.repeat(70));
  console.log('Pastebin Service Demonstration');
  console.log('文本分享服务演示');
  console.log('='.repeat(70));

  const pastebin = new PastebinService();

  // 1. Test Base62 encoding
  console.log('\n1. Base62 Encoding Test:');
  const base62 = new Base62Encoder();
  const testNumbers = [0, 123, 12345, 1234567890];

  for (const num of testNumbers) {
    const encoded = base62.encode(num);
    const decoded = base62.decode(encoded);
    console.log(`  ${num} → ${encoded} → ${decoded} ✓`);
  }

  // 2. Create pastes with different options
  console.log('\n2. Creating pastes...');

  const paste1 = pastebin.createPaste(
    'console.log("Hello, World!");',
    {
      title: 'Hello World',
      language: 'javascript',
      expiration: '1h',
      privacy: 'PUBLIC',
      ipAddress: '192.168.1.1'
    }
  );
  console.log('✓ Created public paste:', paste1.shortUrl);

  const paste2 = pastebin.createPaste(
    'SELECT * FROM users WHERE id = 1;',
    {
      title: 'SQL Query',
      language: 'sql',
      expiration: '1d',
      privacy: 'UNLISTED',
      ipAddress: '192.168.1.1'
    }
  );
  console.log('✓ Created unlisted paste:', paste2.shortUrl);

  const paste3 = pastebin.createPaste(
    'This is a secret message.',
    {
      title: 'Secret',
      language: 'text',
      expiration: 'never',
      privacy: 'PRIVATE',
      passwordHash: pastebin.hashPassword('secret123'),
      ipAddress: '192.168.1.1'
    }
  );
  console.log('✓ Created private paste:', paste3.shortUrl);

  const paste4 = pastebin.createPaste(
    'This message will self-destruct.',
    {
      title: 'Burn After Read',
      language: 'text',
      expiration: '1h',
      burnAfterRead: true,
      ipAddress: '192.168.1.1'
    }
  );
  console.log('✓ Created burn-after-read paste:', paste4.shortUrl);

  // 3. Retrieve pastes
  console.log('\n3. Retrieving pastes:');

  const retrieved1 = pastebin.getPaste(paste1.shortUrl);
  console.log(`\n  Paste: ${retrieved1.shortUrl}`);
  console.log(`  Title: ${retrieved1.title}`);
  console.log(`  Language: ${retrieved1.language}`);
  console.log(`  Content: ${retrieved1.content}`);
  console.log(`  Views: ${retrieved1.viewCount}`);

  // 4. Test password protection
  console.log('\n4. Testing password protection:');
  try {
    pastebin.getPaste(paste3.shortUrl); // No password
  } catch (error) {
    console.log('  ✗ Access denied without password:', error.message);
  }

  const retrieved3 = pastebin.getPaste(paste3.shortUrl, 'secret123');
  console.log('  ✓ Access granted with correct password');

  // 5. Test burn after read
  console.log('\n5. Testing burn after read:');
  const burnPaste1 = pastebin.getPaste(paste4.shortUrl);
  console.log(`  First read: ${burnPaste1.content}`);
  console.log('  Paste will be deleted in 60 seconds...');

  // 6. List recent pastes
  console.log('\n6. Recent public pastes:');
  const recentPastes = pastebin.listRecentPastes(5);
  console.table(
    recentPastes.map(p => ({
      ShortURL: p.shortUrl,
      Title: p.title,
      Language: p.language,
      Size: `${p.contentSize} bytes`,
      Views: p.viewCount
    }))
  );

  // 7. Test rate limiting
  console.log('\n7. Testing rate limiting (anonymous user):');
  console.log('  Creating 10 pastes rapidly...');

  for (let i = 0; i < 12; i++) {
    try {
      pastebin.createPaste(`Test paste ${i}`, { ipAddress: '192.168.1.100' });
      console.log(`  ✓ Paste ${i + 1} created`);
    } catch (error) {
      console.log(`  ✗ Paste ${i + 1} failed: ${error.message}`);
    }
  }

  // 8. Test compression
  console.log('\n8. Testing content compression:');
  const compressor = new ContentCompressor();

  const longText = 'Lorem ipsum dolor sit amet. '.repeat(100);
  const compressed = compressor.compress(longText);

  console.log(`  Original size: ${compressed.originalSize} bytes`);
  console.log(`  Compressed size: ${compressed.compressedSize} bytes`);
  console.log(`  Compression ratio: ${(compressed.compressionRatio * 100).toFixed(1)}%`);

  const decompressed = compressor.decompress(compressed.data);
  console.log(`  ✓ Decompression successful: ${decompressed.substring(0, 50)}...`);

  // 9. Service statistics
  console.log('\n9. Service statistics:');
  const stats = pastebin.getStats();
  console.log(`  Total pastes: ${stats.totalPastes}`);
  console.log(`  Total storage: ${stats.totalSize} bytes`);
  console.log(`  Compressed pastes: ${stats.compressedPastes}`);
  console.log(`  S3 pastes: ${stats.s3Pastes}`);
  console.log(`  Average size: ${stats.averageSize} bytes`);

  // 10. Cleanup expired pastes
  console.log('\n10. Running cleanup job:');
  const cleanup = pastebin.runCleanup();
  console.log(`  Deleted ${cleanup.deletedPastes} expired pastes`);

  // 11. URL generation capacity
  console.log('\n11. URL Generation Capacity:');
  const base = 62;
  const length = 7;
  const capacity = Math.pow(base, length);
  const dailyPastes = 10000000; // 10M per day
  const years = capacity / dailyPastes / 365;

  console.log(`  Base: ${base} (0-9, a-z, A-Z)`);
  console.log(`  Length: ${length} characters`);
  console.log(`  Capacity: ${capacity.toLocaleString()} URLs`);
  console.log(`  At 10M pastes/day: ${years.toFixed(1)} years capacity`);

  console.log('\n' + '='.repeat(70));
  console.log('Demonstration complete!');
  console.log('='.repeat(70));
}

// Run demonstration
if (require.main === module) {
  demonstratePastebin();
}

// Export for use in other modules
module.exports = {
  Base62Encoder,
  URLGenerator,
  ContentCompressor,
  Paste,
  PasteStorageService,
  RateLimiter,
  PastebinService
};
