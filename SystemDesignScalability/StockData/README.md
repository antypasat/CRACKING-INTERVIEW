# 9.1 Stock Data Service (股票数据服务)

## Problem Statement (问题描述)

**English:**
Design a service that provides end-of-day stock price information (open, close, high, low) to 1,000 clients. The service should be scalable, reliable, and efficient.

**中文:**
设计一个为1,000个客户端提供每日股票价格信息（开盘价、收盘价、最高价、最低价）的服务。该服务应该是可扩展、可靠且高效的。

---

## Requirements Analysis (需求分析)

### Functional Requirements (功能需求)

**English:**
1. Provide end-of-day stock prices (open, close, high, low)
2. Support 1,000 concurrent clients
3. Historical data access
4. Real-time or near-real-time updates when market closes
5. Support for multiple stock symbols

**中文:**
1. 提供每日股票价格（开盘价、收盘价、最高价、最低价）
2. 支持1,000个并发客户端
3. 历史数据访问
4. 市场收盘时的实时或近实时更新
5. 支持多个股票代码

### Non-Functional Requirements (非功能需求)

**English:**
- **Availability**: 99.9% uptime
- **Latency**: < 100ms for cached data
- **Scalability**: Easy to scale to 10,000+ clients
- **Data Consistency**: Eventually consistent is acceptable
- **Cost**: Minimize bandwidth and storage costs

**中文:**
- **可用性**: 99.9%正常运行时间
- **延迟**: 缓存数据 < 100毫秒
- **可扩展性**: 易于扩展到10,000+客户端
- **数据一致性**: 最终一致性可接受
- **成本**: 最小化带宽和存储成本

---

## High-Level Architecture (高层架构)

```
┌─────────────┐
│   Clients   │
│  (1000+)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│              CDN / Edge Cache                    │
│  (CloudFront, Cloudflare, Akamai)               │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│           Load Balancer (ALB/NLB)               │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│         API Gateway / Rate Limiting             │
│    (Kong, AWS API Gateway, nginx)               │
└──────┬──────────────────────────────────────────┘
       │
       ├───────────────┬───────────────┐
       ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│ API      │    │ API      │    │ API      │
│ Server 1 │    │ Server 2 │    │ Server N │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  Redis Cache    │    │   PostgreSQL     │
│  (L1 Cache)     │    │   Time-Series DB │
│                 │    │   (TimescaleDB)  │
│ - Hot data      │    │                  │
│ - Recent prices │    │ - Historical     │
│ - TTL: 1 day    │    │ - All stocks     │
└─────────────────┘    └──────────────────┘
                                │
                                ▼
                     ┌──────────────────┐
                     │  S3 / Object     │
                     │  Storage         │
                     │  (Cold Archive)  │
                     └──────────────────┘

┌─────────────────────────────────────────────────┐
│         Background Services                     │
├─────────────────────────────────────────────────┤
│ • Data Ingestion Worker (from stock exchange)  │
│ • Cache Warming Service                         │
│ • Monitoring & Alerting (Prometheus/Grafana)   │
└─────────────────────────────────────────────────┘
```

---

## Component Design (组件设计)

### 1. API Design (API设计)

#### REST API Endpoints

**English:**
```
GET  /api/v1/stocks/{symbol}/price/latest
GET  /api/v1/stocks/{symbol}/price/history?from={date}&to={date}
GET  /api/v1/stocks/batch?symbols={symbol1,symbol2,...}
POST /api/v1/stocks/subscribe (WebSocket upgrade)
```

**中文:**
```
GET  /api/v1/stocks/{symbol}/price/latest      # 获取最新价格
GET  /api/v1/stocks/{symbol}/price/history     # 获取历史价格
GET  /api/v1/stocks/batch                      # 批量获取
POST /api/v1/stocks/subscribe                  # WebSocket订阅
```

#### Response Format (响应格式)

**Option 1: JSON (Good for web clients)**
```json
{
  "symbol": "AAPL",
  "date": "2025-11-09",
  "open": 150.25,
  "close": 152.50,
  "high": 153.00,
  "low": 149.75,
  "volume": 75000000,
  "timestamp": "2025-11-09T16:00:00Z"
}
```

**Option 2: Protocol Buffers (More efficient)**
```protobuf
message StockPrice {
  string symbol = 1;
  string date = 2;
  double open = 3;
  double close = 4;
  double high = 5;
  double low = 6;
  int64 volume = 7;
  int64 timestamp = 8;
}
```

### 2. Caching Strategy (缓存策略)

**English:**

**L1 Cache (Redis):**
- Cache latest prices for all stocks
- Cache frequently requested historical data
- TTL: 24 hours for end-of-day data
- Eviction: LRU (Least Recently Used)

**L2 Cache (CDN):**
- Cache API responses at edge locations
- Geo-distributed for low latency
- TTL: 5 minutes for latest prices, 1 day for historical

**Cache Key Pattern:**
```
stock:price:latest:{symbol}
stock:price:history:{symbol}:{date}
stock:price:batch:{symbol1}_{symbol2}_{symbolN}
```

**中文:**

**L1缓存 (Redis):**
- 缓存所有股票的最新价格
- 缓存频繁请求的历史数据
- TTL: 收盘数据24小时
- 驱逐策略: LRU（最近最少使用）

**L2缓存 (CDN):**
- 在边缘位置缓存API响应
- 地理分布以降低延迟
- TTL: 最新价格5分钟，历史数据1天

### 3. Rate Limiting (速率限制)

**English:**
```javascript
// Token bucket algorithm
const rateLimits = {
  free: {
    requestsPerMinute: 60,
    requestsPerDay: 5000
  },
  premium: {
    requestsPerMinute: 600,
    requestsPerDay: 100000
  }
};
```

**中文:**
- 使用令牌桶算法
- 免费层: 60请求/分钟，5000请求/天
- 高级层: 600请求/分钟，100000请求/天

### 4. Push vs Pull (推送vs拉取)

**English:**

**Pull Model (REST API):**
- Pros: Simple, stateless, cacheable
- Cons: Client must poll, wasted requests

**Push Model (WebSocket/SSE):**
- Pros: Real-time updates, efficient
- Cons: Stateful, harder to scale, no caching

**Hybrid Approach (Recommended):**
- Use REST for historical data (pull)
- Use WebSocket for real-time updates (push)
- Clients subscribe to symbols they care about

**中文:**

**拉取模型 (REST API):**
- 优点: 简单、无状态、可缓存
- 缺点: 客户端必须轮询、浪费请求

**推送模型 (WebSocket/SSE):**
- 优点: 实时更新、高效
- 缺点: 有状态、难以扩展、无缓存

**混合方法（推荐）:**
- 历史数据使用REST（拉取）
- 实时更新使用WebSocket（推送）

---

## Data Storage (数据存储)

### Database Schema (数据库模式)

```sql
-- PostgreSQL with TimescaleDB extension
CREATE TABLE stock_prices (
    symbol VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    open DECIMAL(10, 2) NOT NULL,
    close DECIMAL(10, 2) NOT NULL,
    high DECIMAL(10, 2) NOT NULL,
    low DECIMAL(10, 2) NOT NULL,
    volume BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (symbol, date)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('stock_prices', 'date');

-- Indexes
CREATE INDEX idx_symbol ON stock_prices(symbol);
CREATE INDEX idx_date ON stock_prices(date DESC);

-- Compression policy (compress data older than 7 days)
ALTER TABLE stock_prices SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'symbol'
);

SELECT add_compression_policy('stock_prices', INTERVAL '7 days');

-- Retention policy (keep 10 years, archive to S3 after)
SELECT add_retention_policy('stock_prices', INTERVAL '10 years');
```

---

## Scalability Considerations (可扩展性考虑)

### Horizontal Scaling (水平扩展)

**English:**
1. **API Servers**: Stateless, can add more instances behind load balancer
2. **Cache Layer**: Redis Cluster with sharding by symbol hash
3. **Database**: Read replicas for queries, write to primary
4. **CDN**: Automatically scaled by provider

**中文:**
1. **API服务器**: 无状态，可在负载均衡器后添加更多实例
2. **缓存层**: Redis集群，按符号哈希分片
3. **数据库**: 查询使用只读副本，写入主库
4. **CDN**: 由提供商自动扩展

### Vertical Scaling (垂直扩展)

**English:**
- Increase server CPU/RAM for better cache hit rates
- Use larger database instances for complex queries
- Limited by single machine capacity

**中文:**
- 增加服务器CPU/RAM以提高缓存命中率
- 对复杂查询使用更大的数据库实例
- 受单机容量限制

### Data Partitioning (数据分区)

**English:**
```
Partition by symbol range:
- Partition 1: A-F
- Partition 2: G-L
- Partition 3: M-R
- Partition 4: S-Z

Or partition by date (time-based):
- Partition 1: 2025-01 to 2025-03
- Partition 2: 2025-04 to 2025-06
- etc.
```

---

## Monitoring & Observability (监控与可观察性)

**English:**

**Key Metrics:**
- Request rate (requests/sec)
- Error rate (4xx, 5xx)
- Latency (p50, p95, p99)
- Cache hit rate
- Database connection pool usage

**Logging:**
- Structured logging (JSON format)
- Request ID for tracing
- Log levels: ERROR, WARN, INFO, DEBUG

**Alerting:**
- Error rate > 1%
- Latency p99 > 500ms
- Cache hit rate < 80%
- Database connections > 80% of pool

**中文:**

**关键指标:**
- 请求速率（请求/秒）
- 错误率（4xx、5xx）
- 延迟（p50、p95、p99）
- 缓存命中率
- 数据库连接池使用率

---

## Trade-offs (权衡)

| Aspect | Option A | Option B | Recommendation |
|--------|----------|----------|----------------|
| **Data Format** | JSON (easy to debug) | Protocol Buffers (efficient) | JSON for web, Protobuf for mobile |
| **API Style** | REST (simple, cacheable) | GraphQL (flexible) | REST for this use case |
| **Push vs Pull** | Pull/REST (stateless) | Push/WebSocket (real-time) | Hybrid approach |
| **Cache** | In-memory (fast) | Disk-based (persistent) | In-memory with persistence |
| **Database** | SQL (structured) | NoSQL (scalable) | SQL (time-series data fits well) |

---

## Security Considerations (安全考虑)

**English:**
1. **Authentication**: API keys, JWT tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Rate Limiting**: Prevent abuse and DDoS
4. **Encryption**: TLS 1.3 for data in transit
5. **Input Validation**: Sanitize symbol names, date ranges

**中文:**
1. **认证**: API密钥、JWT令牌
2. **授权**: 基于角色的访问控制（RBAC）
3. **速率限制**: 防止滥用和DDoS
4. **加密**: 传输中数据使用TLS 1.3
5. **输入验证**: 清理股票代码、日期范围

---

## Cost Optimization (成本优化)

**English:**
1. **CDN Caching**: Reduce origin server load by 80-90%
2. **Data Compression**: Use gzip/brotli for responses
3. **Efficient Format**: Protocol Buffers saves ~40% bandwidth vs JSON
4. **Cold Storage**: Archive old data to S3 Glacier
5. **Auto-scaling**: Scale down during off-hours

**中文:**
1. **CDN缓存**: 减少源服务器负载80-90%
2. **数据压缩**: 响应使用gzip/brotli
3. **高效格式**: Protocol Buffers比JSON节省约40%带宽
4. **冷存储**: 将旧数据归档到S3 Glacier
5. **自动扩展**: 非高峰期缩减规模

---

## Implementation Complexity (实现复杂度)

**Phase 1 - MVP (2-3 weeks):**
- Simple REST API
- PostgreSQL database
- Basic Redis caching
- Single server deployment

**Phase 2 - Production (4-6 weeks):**
- Load balancer + multiple API servers
- CDN integration
- Rate limiting
- Monitoring and alerting

**Phase 3 - Scale (8-12 weeks):**
- WebSocket support
- Database sharding
- Advanced caching strategies
- Multi-region deployment

---

## Example Use Cases (使用案例)

**English:**
1. **Portfolio Tracking App**: Fetch prices for user's stock portfolio
2. **Financial Dashboard**: Display end-of-day summaries
3. **Algorithmic Trading**: Historical data for backtesting
4. **Research Platform**: Analyze price trends over time

**中文:**
1. **投资组合跟踪应用**: 获取用户股票组合的价格
2. **金融仪表板**: 显示每日收盘摘要
3. **算法交易**: 用于回测的历史数据
4. **研究平台**: 分析价格趋势

---

## References (参考资料)

- Time-Series Databases: TimescaleDB, InfluxDB
- API Design: REST API Best Practices
- Caching: Redis Best Practices
- CDN: CloudFront, Cloudflare Documentation
- Rate Limiting: Token Bucket, Leaky Bucket algorithms
