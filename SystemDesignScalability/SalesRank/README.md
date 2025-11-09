# SalesRank - Best-Selling Products Ranking System / 畅销产品排名系统

## Problem Description / 问题描述

**English:**
Design a system like Amazon's best-seller ranking that tracks the best-selling products overall and by category in real-time. The system should handle millions of purchases per day, provide up-to-date rankings, support hierarchical categories, and scale to millions of products.

**中文:**
设计一个类似亚马逊畅销商品排名的系统，实时跟踪整体和分类别的最畅销产品。系统应该能够处理每天数百万次购买，提供最新的排名，支持层级分类，并可扩展到数百万产品。

## Requirements Analysis / 需求分析

### Functional Requirements / 功能需求

1. **Sales Tracking / 销售跟踪**
   - Record every product purchase
   - Track sales across multiple time windows (hourly, daily, weekly, monthly)
   - Support both unit sales and revenue-based rankings

2. **Ranking Queries / 排名查询**
   - Get top N products overall
   - Get top N products by category
   - Get product's current rank in category
   - Support hierarchical categories (e.g., Electronics > Computers > Laptops)

3. **Real-time Updates / 实时更新**
   - Rankings update within minutes of purchase
   - Handle high velocity of sales events
   - Consistent rankings across queries

4. **Category Management / 分类管理**
   - Products can belong to multiple categories
   - Support category hierarchy (parent-child relationships)
   - Allow category reconfiguration

### Non-Functional Requirements / 非功能需求

1. **Scalability / 可扩展性**
   - Handle 10M+ products
   - Process 100K+ purchases per second
   - Support 1M+ categories

2. **Performance / 性能**
   - Query latency < 100ms
   - Ranking update latency < 5 minutes
   - High throughput for writes and reads

3. **Availability / 可用性**
   - 99.9% uptime
   - No data loss for sales events
   - Graceful degradation under high load

4. **Accuracy / 准确性**
   - Near real-time rankings
   - Consistent rankings across regions
   - Handle edge cases (ties, new products)

## High-Level Architecture / 高层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Applications                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Website  │  │  Mobile  │  │   Admin  │  │Analytics │       │
│  │          │  │   App    │  │ Dashboard│  │   Tools  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼────────────────────────────────────────────────────────┐
│                      API Gateway / Load Balancer               │
│              (Rate Limiting, Auth, Routing)                    │
└───────┬────────────────────────────────────────────────────────┘
        │
        ├──────────────────┬─────────────────┬───────────────────┐
        │                  │                 │                   │
┌───────▼────────┐ ┌──────▼───────┐ ┌──────▼───────┐ ┌─────▼────┐
│ Sales Ingestion│ │    Ranking   │ │   Category   │ │  Query   │
│    Service     │ │    Service   │ │   Service    │ │ Service  │
│                │ │              │ │              │ │          │
│ • Validate     │ │ • Calculate  │ │ • Manage     │ │ • Get    │
│ • Enrich       │ │   rankings   │ │   hierarchy  │ │   ranks  │
│ • Deduplicate  │ │ • Update     │ │ • Update     │ │ • Search │
└───────┬────────┘ └──────┬───────┘ └──────┬───────┘ └─────┬────┘
        │                  │                 │               │
        ▼                  │                 │               │
┌──────────────────┐       │                 │               │
│  Message Queue   │       │                 │               │
│  (Kafka/Kinesis) │       │                 │               │
│                  │       │                 │               │
│ ┌──────────────┐ │       │                 │               │
│ │Sales Events  │ │       │                 │               │
│ │  Topic       │ │       │                 │               │
│ └──────┬───────┘ │       │                 │               │
└────────┼─────────┘       │                 │               │
         │                 │                 │               │
         ▼                 ▼                 ▼               │
┌────────────────────────────────────────────────────────────┐│
│              Stream Processing Layer                       ││
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │   Flink /    │  │  Aggregation │  │   Scoring    │    ││
│  │    Spark     │  │   Windows    │  │   Engine     │    ││
│  │   Streaming  │  │              │  │              │    ││
│  │              │  │ • Hourly     │  │ • Time decay │    ││
│  │ • Map        │  │ • Daily      │  │ • Velocity   │    ││
│  │ • Reduce     │  │ • Weekly     │  │ • Trending   │    ││
│  │ • Window     │  │ • Monthly    │  │              │    ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    ││
└─────────┼──────────────────┼──────────────────┼────────────┘│
          │                  │                  │             │
          └──────────────────┴──────────────────┘             │
                             ▼                                │
┌─────────────────────────────────────────────────────────────┐│
│                   Storage Layer                             ││
│                                                              ││
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ ││
│  │  OLTP Database   │  │  OLAP Database   │  │  Cache   │ ││
│  │  (PostgreSQL)    │  │  (ClickHouse)    │  │ (Redis)  │ ││
│  │                  │  │                  │  │          │ ││
│  │ • Products       │  │ • Sales history  │  │ • Top N  │ ││
│  │ • Categories     │  │ • Aggregations   │  │   lists  │ ││
│  │ • Metadata       │  │ • Time series    │  │ • Scores │ ││
│  └──────────────────┘  └──────────────────┘  └──────────┘ ││
│                                                              ││
│  ┌──────────────────────────────────────────────────────┐  ││
│  │            Time-Series Database (InfluxDB)           │  ││
│  │  • Sales metrics over time                           │  ││
│  │  • Trending indicators                               │  ││
│  └──────────────────────────────────────────────────────┘  ││
└─────────────────────────────────────────────────────────────┘│
                             │                                 │
┌────────────────────────────▼────────────────────────────────┐│
│                  Analytics & Batch Processing               ││
│  ┌──────────────────┐  ┌──────────────────┐                ││
│  │  MapReduce Jobs  │  │  Data Warehouse  │                ││
│  │  (Hadoop/Spark)  │  │   (Redshift)     │                ││
│  │                  │  │                  │                ││
│  │ • Historical     │  │ • Business       │                ││
│  │   analysis       │  │   intelligence   │                ││
│  │ • Trend detection│  │ • Reports        │                ││
│  └──────────────────┘  └──────────────────┘                ││
└─────────────────────────────────────────────────────────────┘│
                                                                │
                                                                │
                          Monitoring & Logging                  │
                   (Prometheus, Grafana, ELK)                   │
                                                                │
────────────────────────────────────────────────────────────────┘
```

## Database Schema / 数据库模式

### Product Table / 产品表

```sql
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    brand VARCHAR(200),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_brand (brand),
    INDEX idx_active (is_active)
);
```

### Category Table / 分类表

```sql
CREATE TABLE categories (
    category_id BIGINT PRIMARY KEY,
    category_name VARCHAR(200) NOT NULL,
    parent_category_id BIGINT,
    level INT,  -- Hierarchy level (0 = root)
    path VARCHAR(1000),  -- Materialized path: /1/15/234/
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id),
    INDEX idx_parent (parent_category_id),
    INDEX idx_path (path)
);
```

### Product-Category Mapping / 产品分类映射表

```sql
CREATE TABLE product_categories (
    product_id BIGINT,
    category_id BIGINT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_category (category_id),
    INDEX idx_primary (is_primary)
);
```

### Sales Event Table (Raw Events) / 销售事件表

```sql
CREATE TABLE sales_events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    user_id BIGINT,
    quantity INT DEFAULT 1,
    revenue DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    region VARCHAR(50),
    INDEX idx_product_time (product_id, timestamp),
    INDEX idx_timestamp (timestamp)
) PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    -- Partitioned by month for efficient querying
    PARTITION p202401 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01'))
    -- Add more partitions as needed
);
```

### Pre-aggregated Sales Data / 预聚合销售数据

```sql
-- Hourly aggregations
CREATE TABLE sales_hourly (
    product_id BIGINT,
    category_id BIGINT,
    hour_timestamp TIMESTAMP,  -- Beginning of the hour
    total_quantity INT,
    total_revenue DECIMAL(12, 2),
    unique_buyers INT,
    PRIMARY KEY (product_id, category_id, hour_timestamp),
    INDEX idx_category_time (category_id, hour_timestamp),
    INDEX idx_time (hour_timestamp)
);

-- Daily aggregations
CREATE TABLE sales_daily (
    product_id BIGINT,
    category_id BIGINT,
    date DATE,
    total_quantity INT,
    total_revenue DECIMAL(12, 2),
    unique_buyers INT,
    rank_in_category INT,
    rank_overall INT,
    PRIMARY KEY (product_id, category_id, date),
    INDEX idx_category_date (category_id, date),
    INDEX idx_date (date)
);
```

### Sales Rank Cache (Redis) / 销售排名缓存

```javascript
// Redis data structures for fast ranking queries

// Sorted Set for category rankings (score = sales count or revenue)
Key: "rank:category:{categoryId}:{timeWindow}"
Type: Sorted Set (ZSET)
Members: product_id
Score: sales_score (calculated from quantity, revenue, velocity)

Example:
ZADD rank:category:123:daily 1500 prod_001
ZADD rank:category:123:daily 1200 prod_002
ZADD rank:category:123:daily 1100 prod_003

// Get top 10 in category:
ZREVRANGE rank:category:123:daily 0 9 WITHSCORES

// Get product rank:
ZREVRANK rank:category:123:daily prod_001

// Hash for product metadata
Key: "product:{productId}"
Type: Hash
Fields: {
    name: String,
    price: Number,
    categories: Array[categoryId],
    lastUpdated: Timestamp
}

// Hash for real-time sales counts
Key: "sales:realtime:{productId}"
Type: Hash
Fields: {
    hourly: Number,
    daily: Number,
    weekly: Number,
    lastSale: Timestamp
}
```

## API Specifications / API规范

### Sales Ingestion API / 销售录入API

```
POST /api/v1/sales
Description: Record a product sale
Request Body:
{
    "productId": 12345,
    "quantity": 2,
    "revenue": 199.98,
    "userId": 67890,
    "timestamp": "2024-01-15T10:30:00Z",
    "region": "US-WEST"
}
Response:
{
    "success": true,
    "eventId": "evt_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Ranking Query API / 排名查询API

```
GET /api/v1/rankings/category/{categoryId}
Description: Get top products in a category
Query Parameters:
    - limit: Number (default: 100, max: 1000)
    - timeWindow: String (hourly|daily|weekly|monthly)
    - offset: Number (for pagination)
    - sortBy: String (quantity|revenue)

Response:
{
    "categoryId": 123,
    "categoryName": "Laptops",
    "timeWindow": "daily",
    "lastUpdated": "2024-01-15T10:00:00Z",
    "rankings": [
        {
            "rank": 1,
            "productId": 12345,
            "productName": "MacBook Pro",
            "salesCount": 1500,
            "revenue": 2999970.00,
            "trend": "up",  // up, down, stable
            "rankChange": 2  // +2 from previous period
        },
        ...
    ],
    "pagination": {
        "offset": 0,
        "limit": 100,
        "total": 5432
    }
}

GET /api/v1/rankings/overall
Description: Get top products overall (all categories)

GET /api/v1/rankings/product/{productId}
Description: Get a product's rank in all its categories
Response:
{
    "productId": 12345,
    "productName": "MacBook Pro",
    "ranks": [
        {
            "categoryId": 123,
            "categoryName": "Laptops",
            "rank": 1,
            "timeWindow": "daily"
        },
        {
            "categoryId": 100,
            "categoryName": "Electronics",
            "rank": 5,
            "timeWindow": "daily"
        }
    ]
}

GET /api/v1/rankings/trending
Description: Get trending products (fast-rising in rankings)
Response:
{
    "timeWindow": "daily",
    "trendingProducts": [
        {
            "productId": 54321,
            "productName": "New Gadget",
            "rank": 15,
            "previousRank": 150,
            "rankChange": +135,
            "velocityScore": 0.95
        }
    ]
}
```

### Category Management API / 分类管理API

```
GET /api/v1/categories/{categoryId}
Description: Get category details and hierarchy

GET /api/v1/categories/{categoryId}/subcategories
Description: Get all child categories

GET /api/v1/categories/{categoryId}/ancestors
Description: Get category path to root
```

## Key Design Considerations / 关键设计考虑

### 1. Real-Time vs. Pre-Aggregated Data / 实时 vs 预聚合数据

**Lambda Architecture Approach / Lambda架构方法:**

```
                    Incoming Sales Events
                            │
                ┌───────────┴───────────┐
                │                       │
         Speed Layer               Batch Layer
      (Real-time Stream)       (Historical Batch)
                │                       │
        ┌───────┴────────┐      ┌──────┴────────┐
        │  Stream Proc.  │      │  MapReduce    │
        │  (Flink/Spark) │      │  Jobs         │
        │                │      │               │
        │  • Tumbling    │      │  • Daily      │
        │    windows     │      │    aggregation│
        │  • 5-min       │      │  • Weekly     │
        │    updates     │      │    rollups    │
        └───────┬────────┘      └──────┬────────┘
                │                       │
                └───────────┬───────────┘
                            │
                     Serving Layer
                     (Merge results)
                            │
                   ┌────────┴────────┐
                   │  Query Service  │
                   │  (Redis + DB)   │
                   └─────────────────┘
```

**Trade-offs / 权衡:**
- Real-time: Lower latency, higher complexity
- Batch: Higher accuracy, more delay
- Hybrid: Balance of both

### 2. Ranking Algorithm / 排名算法

**Simple Count-Based Ranking / 简单计数排名:**
```
Score = Total Sales in Time Window
Pros: Simple, easy to understand
Cons: Favors older products, no recency
```

**Time-Decayed Ranking / 时间衰减排名:**
```
Score = Σ (sales_count * decay_factor^hours_ago)
decay_factor = 0.95 (configurable)

Example:
- Sale 1 hour ago: weight = 0.95^1 = 0.95
- Sale 24 hours ago: weight = 0.95^24 = 0.29
- Recent sales have higher weight
```

**Velocity-Based Ranking (Trending) / 基于速度的排名:**
```
Velocity = (Recent Sales - Historical Average) / Historical StdDev
Score = Base Score + Velocity Bonus

Identifies fast-rising products
```

**Revenue-Weighted Ranking / 收入加权排名:**
```
Score = Σ (quantity * price * time_decay)
Favors high-value products
```

### 3. Time Windows / 时间窗口

**Tumbling Windows / 翻滚窗口:**
```
[00:00-01:00] [01:00-02:00] [02:00-03:00]
   Window 1      Window 2      Window 3

Non-overlapping, discrete time periods
Easy to compute, but may miss trends at boundaries
```

**Sliding Windows / 滑动窗口:**
```
[00:00-01:00]
  [00:15-01:15]
    [00:30-01:30]
      [00:45-01:45]

Overlapping windows, smoother trends
More computation, continuous updates
```

**Multiple Time Windows / 多时间窗口:**
```
Maintain parallel rankings:
- Hourly: Last 60 minutes
- Daily: Last 24 hours
- Weekly: Last 7 days
- Monthly: Last 30 days
- All-time: Since launch

Users can switch between views
```

### 4. Category Hierarchy Handling / 分类层次处理

**Materialized Path / 物化路径:**
```
Category: Laptops
Path: /Electronics/Computers/Laptops/
category_id: 234, parent_id: 100

Advantages:
- Fast ancestor queries: WHERE path LIKE '/Electronics/%'
- Easy to get full path
- Simple to maintain

Disadvantages:
- Path updates require cascade
- Path length limits
```

**Nested Set Model / 嵌套集模型:**
```
Store left and right bounds for each node
Electronics: left=1, right=20
  Computers: left=2, right=11
    Laptops: left=3, right=6
    Desktops: left=7, right=10

Advantages:
- Fast subtree queries
- No joins for hierarchy

Disadvantages:
- Complex inserts/deletes
- Not intuitive
```

**Closure Table / 闭包表:**
```
Store all ancestor-descendant pairs
ancestor_id | descendant_id | depth
1 (Electronics) | 2 (Computers) | 1
1 (Electronics) | 3 (Laptops) | 2
2 (Computers) | 3 (Laptops) | 1

Advantages:
- Flexible queries
- Easy to maintain

Disadvantages:
- Storage overhead: O(n²)
```

### 5. Handling High Write Throughput / 处理高写入吞吐量

**Event Sourcing / 事件溯源:**
```
1. Write all sales events to append-only log (Kafka)
2. Process events asynchronously
3. Build materialized views from events
4. Can replay events if needed

Benefits:
- Decouples ingestion from processing
- Enables multiple consumers
- Audit trail for all sales
```

**Batch Writes / 批量写入:**
```
1. Buffer sales events in memory (100-1000)
2. Batch write to database
3. Reduces write overhead
4. Trade-off: Slight delay in processing
```

**Write-Optimized Storage / 写优化存储:**
```
Use LSM-tree based databases (Cassandra, RocksDB)
- Optimized for high write throughput
- Sequential writes to log
- Periodic compaction
```

## Scalability Considerations / 可扩展性考虑

### Horizontal Scaling / 水平扩展

**Partition by Category / 按分类分区:**
```
Category 1-1000: Server Pool A
Category 1001-2000: Server Pool B
...

Advantages:
- Category queries hit single partition
- Easy to scale per-category
- Load distribution

Disadvantages:
- Hot categories need special handling
- Overall rankings require aggregation
```

**Partition by Time / 按时间分区:**
```
2024-01-01 to 2024-01-31: Partition P1
2024-02-01 to 2024-02-28: Partition P2

Advantages:
- Easy archival of old data
- Queries usually target recent data
- Old partitions read-only

Disadvantages:
- Long-term queries hit multiple partitions
```

**Partition by Product ID / 按产品ID分区:**
```
Product ID % 100 = Shard Number

Advantages:
- Uniform distribution
- Product queries hit single shard

Disadvantages:
- Category queries hit all shards
- Complex aggregation
```

### Caching Strategy / 缓存策略

**Multi-Level Cache / 多级缓存:**
```
Level 1 (CDN): Top 100 products in major categories
  TTL: 5 minutes
  Hit rate: ~40%

Level 2 (Redis): Top 1000 per category, all active queries
  TTL: 2 minutes
  Hit rate: ~50%

Level 3 (Application): Recent queries
  TTL: 1 minute
  Hit rate: ~80%

Database: Fallback for cache misses
```

**Cache Warming / 缓存预热:**
```
Pre-compute and cache popular queries:
- Top 100 overall
- Top 100 in each major category
- Trending products

Update every 5 minutes via background job
```

### Load Balancing / 负载均衡

```
Read/Write Separation:
- Write to primary database
- Read from replicas (with replication lag tolerance)
- Use read replicas for analytics queries

Geographic Distribution:
- Regional ranking services
- Data replication across regions
- Edge caching for static rankings
```

## Performance Optimization / 性能优化

### 1. Indexing Strategy / 索引策略

```sql
-- Composite index for category + time queries
CREATE INDEX idx_sales_cat_time
ON sales_daily(category_id, date DESC, total_quantity DESC);

-- Covering index for ranking queries
CREATE INDEX idx_rank_covering
ON sales_daily(category_id, date, product_id, total_quantity, total_revenue);

-- Partial index for active products only
CREATE INDEX idx_active_products
ON products(product_id) WHERE is_active = TRUE;
```

### 2. Query Optimization / 查询优化

**Use Pre-aggregated Data / 使用预聚合数据:**
```sql
-- Instead of aggregating raw events:
-- SELECT product_id, SUM(quantity) FROM sales_events
-- WHERE timestamp > NOW() - INTERVAL 1 DAY GROUP BY product_id

-- Use pre-aggregated daily table:
SELECT product_id, total_quantity FROM sales_daily
WHERE date = CURRENT_DATE
ORDER BY total_quantity DESC LIMIT 100;
```

**Limit Result Sets / 限制结果集:**
```sql
-- Always use LIMIT in ranking queries
SELECT * FROM sales_daily
WHERE category_id = 123
ORDER BY total_quantity DESC
LIMIT 100;  -- Don't fetch more than needed
```

### 3. Data Compression / 数据压缩

```
Time-Series Compression:
- Use columnar storage (Parquet) for historical data
- Delta encoding for sequential IDs
- Run-length encoding for repeated values
- Compression ratio: 5-10x
```

## Security Considerations / 安全考虑

### 1. Data Validation / 数据验证

```javascript
// Validate sales events
function validateSaleEvent(event) {
    // Check required fields
    if (!event.productId || !event.quantity || !event.revenue) {
        throw new Error('Missing required fields');
    }

    // Validate product exists
    if (!productExists(event.productId)) {
        throw new Error('Invalid product ID');
    }

    // Check for anomalies
    if (event.quantity > 1000 || event.revenue > 1000000) {
        flagForReview(event);  // Possible fraud
    }

    // Prevent backdating
    if (event.timestamp < Date.now() - 24*60*60*1000) {
        throw new Error('Timestamp too old');
    }
}
```

### 2. Rate Limiting / 速率限制

```
API Rate Limits:
- Sales ingestion: 1000 req/sec per API key
- Ranking queries: 100 req/sec per IP
- Burst allowance: 2x for short periods
- DDoS protection via WAF
```

### 3. Access Control / 访问控制

```
Permissions:
- Public: Read rankings (with rate limits)
- Sellers: Submit sales for their products
- Admins: Full CRUD on products/categories
- Analytics: Read historical data

Authentication:
- API keys for sellers
- OAuth 2.0 for users
- Internal service auth via mutual TLS
```

## Monitoring and Alerting / 监控和告警

### Key Metrics / 关键指标

```
Business Metrics:
- Total sales volume (hourly, daily)
- Top selling products
- Category distribution
- Revenue trends

System Metrics:
- Sales ingestion rate (events/sec)
- Processing lag (time from event to ranking update)
- Query latency (p50, p95, p99)
- Cache hit rate
- Database query time

Data Quality:
- Duplicate event rate
- Invalid event rate
- Missing category mappings
- Ranking consistency checks
```

### Alerts / 告警

```
Critical:
- Sales ingestion pipeline down
- Processing lag > 10 minutes
- Database replication lag > 1 minute
- Cache cluster down

Warning:
- Processing lag > 5 minutes
- Query latency p99 > 1 second
- Cache hit rate < 80%
- High invalid event rate
```

## Trade-offs / 权衡

### Real-time vs. Accuracy / 实时性 vs 准确性

**Real-time (5-min updates) / 实时（5分钟更新）:**
- ✅ Fresh rankings
- ✅ Better user experience
- ❌ Higher system complexity
- ❌ More computational resources

**Batch (hourly updates) / 批处理（每小时更新）:**
- ✅ Simpler architecture
- ✅ More accurate (complete data)
- ❌ Stale rankings
- ❌ Slower to reflect trends

### Ranking Scope / 排名范围

**Top N Only (e.g., top 1000) / 仅前N名:**
- ✅ Fast queries
- ✅ Lower storage
- ❌ Can't show rank for products outside top N

**Complete Rankings / 完整排名:**
- ✅ Show any product's rank
- ✅ More comprehensive
- ❌ More storage
- ❌ Slower updates

### Time Window Granularity / 时间窗口粒度

**Multiple Windows (hourly, daily, weekly) / 多窗口:**
- ✅ More insights
- ✅ Better trend detection
- ❌ More storage (3-4x)
- ❌ More computation

**Single Window (daily only) / 单窗口:**
- ✅ Simpler
- ✅ Lower costs
- ❌ Less flexible
- ❌ Slower to detect trends

## Recommended Technologies / 推荐技术

### Message Queue / 消息队列
- **Apache Kafka**: High throughput, distributed
- **Amazon Kinesis**: Managed service, AWS integration
- **RabbitMQ**: Easier setup, lower scale

### Stream Processing / 流处理
- **Apache Flink**: True streaming, low latency
- **Apache Spark Streaming**: Micro-batching, mature ecosystem
- **Kafka Streams**: Lightweight, embedded

### Databases / 数据库
- **PostgreSQL**: OLTP, relations, ACID
- **ClickHouse**: OLAP, analytics, fast aggregations
- **Cassandra**: Distributed, high write throughput
- **Redis**: Caching, sorted sets for rankings
- **InfluxDB**: Time-series data

### Batch Processing / 批处理
- **Apache Spark**: Large-scale data processing
- **Apache Hadoop**: MapReduce, HDFS

## Conclusion / 结论

**English:**
This sales ranking system design provides real-time visibility into product performance across categories while handling millions of purchases per day. The combination of stream processing for real-time updates, pre-aggregated data for fast queries, and multi-level caching ensures both accuracy and performance at scale.

**中文:**
这个销售排名系统设计在处理每天数百万次购买的同时，提供跨分类的产品表现实时可见性。流处理用于实时更新、预聚合数据用于快速查询、多级缓存相结合，确保了大规模下的准确性和性能。
