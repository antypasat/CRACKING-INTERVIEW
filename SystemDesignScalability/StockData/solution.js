/**
 * Stock Data Service - System Design Implementation
 * Demonstrates key concepts: API design, caching, rate limiting, monitoring
 */

const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');

// ============================================================================
// 1. Configuration (配置)
// ============================================================================

const CONFIG = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: {
      latest: 300,      // 5 minutes for latest prices
      historical: 86400 // 24 hours for historical data
    }
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'stockdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20, // connection pool size
    idleTimeoutMillis: 30000
  },
  rateLimit: {
    free: {
      requestsPerMinute: 60,
      requestsPerDay: 5000
    },
    premium: {
      requestsPerMinute: 600,
      requestsPerDay: 100000
    }
  }
};

// ============================================================================
// 2. Database Layer (数据库层)
// ============================================================================

class StockDatabase {
  constructor(config) {
    this.pool = new Pool(config);
  }

  /**
   * Get latest stock price from database
   * 从数据库获取最新股票价格
   */
  async getLatestPrice(symbol) {
    const query = `
      SELECT symbol, date, open, close, high, low, volume, created_at
      FROM stock_prices
      WHERE symbol = $1
      ORDER BY date DESC
      LIMIT 1
    `;

    try {
      const result = await this.pool.query(query, [symbol.toUpperCase()]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Database error fetching ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get historical stock prices
   * 获取历史股票价格
   */
  async getHistoricalPrices(symbol, fromDate, toDate) {
    const query = `
      SELECT symbol, date, open, close, high, low, volume
      FROM stock_prices
      WHERE symbol = $1
        AND date >= $2
        AND date <= $3
      ORDER BY date DESC
      LIMIT 365
    `;

    try {
      const result = await this.pool.query(query, [
        symbol.toUpperCase(),
        fromDate,
        toDate
      ]);
      return result.rows;
    } catch (error) {
      console.error(`Database error fetching historical ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Batch fetch multiple stocks
   * 批量获取多个股票
   */
  async getBatchPrices(symbols) {
    const query = `
      SELECT DISTINCT ON (symbol)
        symbol, date, open, close, high, low, volume
      FROM stock_prices
      WHERE symbol = ANY($1)
      ORDER BY symbol, date DESC
    `;

    try {
      const upperSymbols = symbols.map(s => s.toUpperCase());
      const result = await this.pool.query(query, [upperSymbols]);
      return result.rows;
    } catch (error) {
      console.error('Database error fetching batch:', error);
      throw error;
    }
  }

  /**
   * Insert new stock price (for data ingestion)
   * 插入新股票价格（用于数据摄取）
   */
  async insertPrice(stockData) {
    const query = `
      INSERT INTO stock_prices
        (symbol, date, open, close, high, low, volume)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (symbol, date)
      DO UPDATE SET
        open = EXCLUDED.open,
        close = EXCLUDED.close,
        high = EXCLUDED.high,
        low = EXCLUDED.low,
        volume = EXCLUDED.volume
      RETURNING *
    `;

    try {
      const result = await this.pool.query(query, [
        stockData.symbol.toUpperCase(),
        stockData.date,
        stockData.open,
        stockData.close,
        stockData.high,
        stockData.low,
        stockData.volume
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error inserting price:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

// ============================================================================
// 3. Cache Layer (缓存层)
// ============================================================================

class StockCache {
  constructor(config) {
    this.client = redis.createClient({
      socket: {
        host: config.host,
        port: config.port
      }
    });
    this.ttl = config.ttl;
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  /**
   * Cache key generator
   * 缓存键生成器
   */
  getCacheKey(type, ...params) {
    return `stock:${type}:${params.join(':')}`;
  }

  /**
   * Get from cache
   * 从缓存获取
   */
  async get(key) {
    try {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null; // Fail gracefully
    }
  }

  /**
   * Set to cache with TTL
   * 设置缓存并指定TTL
   */
  async set(key, value, ttl) {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Cache latest price
   * 缓存最新价格
   */
  async cacheLatestPrice(symbol, data) {
    const key = this.getCacheKey('price', 'latest', symbol.toUpperCase());
    return await this.set(key, data, this.ttl.latest);
  }

  /**
   * Get cached latest price
   * 获取缓存的最新价格
   */
  async getLatestPrice(symbol) {
    const key = this.getCacheKey('price', 'latest', symbol.toUpperCase());
    return await this.get(key);
  }

  /**
   * Cache historical prices
   * 缓存历史价格
   */
  async cacheHistoricalPrices(symbol, fromDate, toDate, data) {
    const key = this.getCacheKey('price', 'history', symbol.toUpperCase(), fromDate, toDate);
    return await this.set(key, data, this.ttl.historical);
  }

  /**
   * Get cached historical prices
   * 获取缓存的历史价格
   */
  async getHistoricalPrices(symbol, fromDate, toDate) {
    const key = this.getCacheKey('price', 'history', symbol.toUpperCase(), fromDate, toDate);
    return await this.get(key);
  }

  /**
   * Invalidate cache for symbol
   * 使符号的缓存失效
   */
  async invalidate(symbol) {
    const pattern = this.getCacheKey('price', '*', symbol.toUpperCase(), '*');
    // In production, use SCAN instead of KEYS
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }
}

// ============================================================================
// 4. Rate Limiter (速率限制器)
// ============================================================================

class RateLimiter {
  constructor(redisClient, config) {
    this.redis = redisClient;
    this.config = config;
  }

  /**
   * Token bucket algorithm implementation
   * 令牌桶算法实现
   */
  async checkRateLimit(apiKey, tier = 'free') {
    const limits = this.config[tier];
    const now = Date.now();
    const minuteKey = `ratelimit:${apiKey}:minute:${Math.floor(now / 60000)}`;
    const dayKey = `ratelimit:${apiKey}:day:${new Date().toISOString().split('T')[0]}`;

    try {
      // Check minute limit
      const minuteCount = await this.redis.client.incr(minuteKey);
      if (minuteCount === 1) {
        await this.redis.client.expire(minuteKey, 60);
      }
      if (minuteCount > limits.requestsPerMinute) {
        return {
          allowed: false,
          reason: 'Rate limit exceeded (per minute)',
          retryAfter: 60 - (now % 60000) / 1000
        };
      }

      // Check day limit
      const dayCount = await this.redis.client.incr(dayKey);
      if (dayCount === 1) {
        await this.redis.client.expire(dayKey, 86400);
      }
      if (dayCount > limits.requestsPerDay) {
        return {
          allowed: false,
          reason: 'Rate limit exceeded (per day)',
          retryAfter: 86400
        };
      }

      return {
        allowed: true,
        remaining: {
          minute: limits.requestsPerMinute - minuteCount,
          day: limits.requestsPerDay - dayCount
        }
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Fail open
    }
  }
}

// ============================================================================
// 5. Service Layer (服务层)
// ============================================================================

class StockService {
  constructor(database, cache) {
    this.db = database;
    this.cache = cache;
  }

  /**
   * Get latest stock price with cache-aside pattern
   * 使用缓存旁路模式获取最新股票价格
   */
  async getLatestPrice(symbol) {
    // Try cache first
    let price = await this.cache.getLatestPrice(symbol);

    if (price) {
      console.log(`Cache HIT for ${symbol}`);
      return { ...price, source: 'cache' };
    }

    // Cache miss - fetch from database
    console.log(`Cache MISS for ${symbol}`);
    price = await this.db.getLatestPrice(symbol);

    if (price) {
      // Update cache
      await this.cache.cacheLatestPrice(symbol, price);
      return { ...price, source: 'database' };
    }

    return null;
  }

  /**
   * Get historical prices with caching
   * 获取带缓存的历史价格
   */
  async getHistoricalPrices(symbol, fromDate, toDate) {
    // Try cache first
    let prices = await this.cache.getHistoricalPrices(symbol, fromDate, toDate);

    if (prices) {
      console.log(`Cache HIT for ${symbol} history`);
      return prices;
    }

    // Cache miss - fetch from database
    console.log(`Cache MISS for ${symbol} history`);
    prices = await this.db.getHistoricalPrices(symbol, fromDate, toDate);

    if (prices && prices.length > 0) {
      // Update cache
      await this.cache.cacheHistoricalPrices(symbol, fromDate, toDate, prices);
    }

    return prices;
  }

  /**
   * Batch fetch with parallel processing
   * 并行处理的批量获取
   */
  async getBatchPrices(symbols) {
    // For small batches, fetch all from database in one query
    if (symbols.length <= 10) {
      return await this.db.getBatchPrices(symbols);
    }

    // For larger batches, try cache first, then batch fetch misses
    const results = await Promise.all(
      symbols.map(symbol => this.getLatestPrice(symbol))
    );

    return results.filter(r => r !== null);
  }
}

// ============================================================================
// 6. API Server (API服务器)
// ============================================================================

class StockDataAPI {
  constructor(config) {
    this.app = express();
    this.config = config;

    // Initialize components
    this.db = new StockDatabase(config.database);
    this.cache = new StockCache(config.redis);
    this.rateLimiter = null; // Will be initialized after cache connects
    this.service = new StockService(this.db, this.cache);

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Parse JSON
    this.app.use(express.json());

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
      });
      next();
    });

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-API-Key');
      next();
    });

    // API Key authentication & rate limiting
    this.app.use(async (req, res, next) => {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // In production, validate API key against database
      const tier = apiKey.startsWith('premium_') ? 'premium' : 'free';

      // Rate limiting
      if (this.rateLimiter) {
        const rateCheck = await this.rateLimiter.checkRateLimit(apiKey, tier);

        if (!rateCheck.allowed) {
          return res.status(429).json({
            error: rateCheck.reason,
            retryAfter: rateCheck.retryAfter
          });
        }

        // Add rate limit headers
        if (rateCheck.remaining) {
          res.header('X-RateLimit-Remaining-Minute', rateCheck.remaining.minute);
          res.header('X-RateLimit-Remaining-Day', rateCheck.remaining.day);
        }
      }

      req.apiKey = apiKey;
      req.tier = tier;
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Get latest price for a stock
    this.app.get('/api/v1/stocks/:symbol/price/latest', async (req, res) => {
      try {
        const { symbol } = req.params;

        // Input validation
        if (!symbol || !/^[A-Z]{1,5}$/.test(symbol.toUpperCase())) {
          return res.status(400).json({ error: 'Invalid symbol format' });
        }

        const price = await this.service.getLatestPrice(symbol);

        if (!price) {
          return res.status(404).json({ error: 'Stock not found' });
        }

        // Cache header for CDN
        res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.json(price);
      } catch (error) {
        console.error('Error fetching latest price:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get historical prices
    this.app.get('/api/v1/stocks/:symbol/price/history', async (req, res) => {
      try {
        const { symbol } = req.params;
        const { from, to } = req.query;

        // Input validation
        if (!symbol || !/^[A-Z]{1,5}$/.test(symbol.toUpperCase())) {
          return res.status(400).json({ error: 'Invalid symbol format' });
        }

        if (!from || !to) {
          return res.status(400).json({ error: 'from and to dates required' });
        }

        const prices = await this.service.getHistoricalPrices(symbol, from, to);

        // Cache header for CDN
        res.header('Cache-Control', 'public, max-age=86400'); // 24 hours
        res.json({
          symbol: symbol.toUpperCase(),
          from,
          to,
          count: prices.length,
          data: prices
        });
      } catch (error) {
        console.error('Error fetching historical prices:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Batch fetch multiple stocks
    this.app.get('/api/v1/stocks/batch', async (req, res) => {
      try {
        const { symbols } = req.query;

        if (!symbols) {
          return res.status(400).json({ error: 'symbols parameter required' });
        }

        const symbolList = symbols.split(',').map(s => s.trim()).slice(0, 50); // Max 50

        if (symbolList.length === 0) {
          return res.status(400).json({ error: 'At least one symbol required' });
        }

        const prices = await this.service.getBatchPrices(symbolList);

        // Cache header for CDN
        res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.json({
          count: prices.length,
          data: prices
        });
      } catch (error) {
        console.error('Error fetching batch prices:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  async start() {
    try {
      // Connect to cache
      await this.cache.connect();
      console.log('Connected to Redis');

      // Initialize rate limiter after cache is connected
      this.rateLimiter = new RateLimiter(this.cache, this.config.rateLimit);

      // Start server
      this.server = this.app.listen(this.config.server.port, () => {
        console.log(`Stock Data API listening on port ${this.config.server.port}`);
        console.log(`Environment: ${this.config.server.environment}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop() {
    console.log('Shutting down gracefully...');

    if (this.server) {
      await new Promise(resolve => this.server.close(resolve));
    }

    await this.cache.disconnect();
    await this.db.close();

    console.log('Server stopped');
  }
}

// ============================================================================
// 7. Monitoring & Metrics (监控与指标)
// ============================================================================

class MetricsCollector {
  constructor() {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      latencies: []
    };
  }

  recordRequest() {
    this.metrics.requestCount++;
  }

  recordError() {
    this.metrics.errorCount++;
  }

  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  recordLatency(latencyMs) {
    this.metrics.latencies.push(latencyMs);
    // Keep only last 1000 latencies
    if (this.metrics.latencies.length > 1000) {
      this.metrics.latencies.shift();
    }
  }

  getMetrics() {
    const latencies = this.metrics.latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
    const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
    const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

    return {
      requests: this.metrics.requestCount,
      errors: this.metrics.errorCount,
      errorRate: this.metrics.requestCount > 0
        ? (this.metrics.errorCount / this.metrics.requestCount * 100).toFixed(2) + '%'
        : '0%',
      cacheHitRate: (this.metrics.cacheHits + this.metrics.cacheMisses) > 0
        ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100).toFixed(2) + '%'
        : '0%',
      latency: {
        p50: p50.toFixed(2) + 'ms',
        p95: p95.toFixed(2) + 'ms',
        p99: p99.toFixed(2) + 'ms'
      }
    };
  }
}

// ============================================================================
// 8. Main Entry Point (主入口)
// ============================================================================

if (require.main === module) {
  const api = new StockDataAPI(CONFIG);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await api.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await api.stop();
    process.exit(0);
  });

  api.start().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// ============================================================================
// 9. Exports (导出)
// ============================================================================

module.exports = {
  StockDatabase,
  StockCache,
  RateLimiter,
  StockService,
  StockDataAPI,
  MetricsCollector,
  CONFIG
};
