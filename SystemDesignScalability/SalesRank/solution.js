/**
 * Sales Rank - Best-Selling Products Ranking System
 * 销售排名 - 畅销产品排名系统
 *
 * Features:
 * - Real-time sales tracking
 * - Time-windowed aggregations
 * - Category hierarchy support
 * - Multiple ranking algorithms
 * - Stream processing simulation
 */

// ============================================================================
// 1. Category Hierarchy Management / 分类层次管理
// ============================================================================

class CategoryTree {
  constructor() {
    this.categories = new Map(); // categoryId -> Category
    this.rootCategories = [];
  }

  /**
   * Add a category to the tree
   */
  addCategory(categoryId, name, parentId = null) {
    const category = {
      categoryId,
      name,
      parentId,
      children: [],
      path: this._buildPath(parentId, categoryId),
      level: this._calculateLevel(parentId)
    };

    this.categories.set(categoryId, category);

    if (parentId === null) {
      this.rootCategories.push(category);
    } else {
      const parent = this.categories.get(parentId);
      if (parent) {
        parent.children.push(category);
      }
    }

    return category;
  }

  /**
   * Get all ancestor categories (bottom-up)
   */
  getAncestors(categoryId) {
    const ancestors = [];
    let current = this.categories.get(categoryId);

    while (current && current.parentId !== null) {
      current = this.categories.get(current.parentId);
      if (current) {
        ancestors.push(current);
      }
    }

    return ancestors;
  }

  /**
   * Get all descendant categories (top-down)
   */
  getDescendants(categoryId) {
    const descendants = [];
    const category = this.categories.get(categoryId);

    if (!category) return descendants;

    const queue = [...category.children];

    while (queue.length > 0) {
      const current = queue.shift();
      descendants.push(current);
      queue.push(...current.children);
    }

    return descendants;
  }

  /**
   * Get category path as string
   */
  getCategoryPath(categoryId) {
    const ancestors = this.getAncestors(categoryId).reverse();
    const current = this.categories.get(categoryId);

    const path = [...ancestors, current].map(cat => cat.name).join(' > ');
    return path;
  }

  _buildPath(parentId, categoryId) {
    if (parentId === null) {
      return `/${categoryId}/`;
    }

    const parent = this.categories.get(parentId);
    return `${parent.path}${categoryId}/`;
  }

  _calculateLevel(parentId) {
    if (parentId === null) return 0;
    const parent = this.categories.get(parentId);
    return parent.level + 1;
  }
}

// ============================================================================
// 2. Sales Event Processing / 销售事件处理
// ============================================================================

class SalesEvent {
  constructor(productId, categoryIds, quantity, revenue, timestamp = Date.now()) {
    this.eventId = this._generateEventId();
    this.productId = productId;
    this.categoryIds = categoryIds; // Product can be in multiple categories
    this.quantity = quantity;
    this.revenue = revenue;
    this.timestamp = timestamp;
  }

  _generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class SalesEventProcessor {
  constructor() {
    this.eventBuffer = [];
    this.batchSize = 100;
    this.processingInterval = null;
  }

  /**
   * Ingest a sales event
   */
  ingest(event) {
    // Validate event
    if (!this._validateEvent(event)) {
      throw new Error('Invalid sales event');
    }

    // Add to buffer
    this.eventBuffer.push(event);

    // Process if buffer is full
    if (this.eventBuffer.length >= this.batchSize) {
      this._processBatch();
    }

    return event.eventId;
  }

  /**
   * Start automatic batch processing
   */
  startProcessing(callback, intervalMs = 5000) {
    this.processingInterval = setInterval(() => {
      if (this.eventBuffer.length > 0) {
        const batch = this._processBatch();
        callback(batch);
      }
    }, intervalMs);
  }

  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
  }

  _validateEvent(event) {
    return (
      event.productId &&
      event.categoryIds &&
      event.categoryIds.length > 0 &&
      event.quantity > 0 &&
      event.revenue >= 0 &&
      event.timestamp <= Date.now()
    );
  }

  _processBatch() {
    const batch = this.eventBuffer.splice(0, this.batchSize);
    return batch;
  }
}

// ============================================================================
// 3. Time-Windowed Aggregation / 时间窗口聚合
// ============================================================================

class TimeWindow {
  constructor(type, duration) {
    this.type = type; // 'hourly', 'daily', 'weekly', 'monthly'
    this.duration = duration; // in milliseconds
  }

  getCurrentWindow(timestamp = Date.now()) {
    const windowStart = Math.floor(timestamp / this.duration) * this.duration;
    return {
      start: windowStart,
      end: windowStart + this.duration,
      type: this.type
    };
  }

  getWindowKey(timestamp = Date.now()) {
    const window = this.getCurrentWindow(timestamp);
    return `${this.type}_${window.start}`;
  }
}

class SalesAggregator {
  constructor() {
    this.windows = {
      hourly: new TimeWindow('hourly', 60 * 60 * 1000), // 1 hour
      daily: new TimeWindow('daily', 24 * 60 * 60 * 1000), // 1 day
      weekly: new TimeWindow('weekly', 7 * 24 * 60 * 60 * 1000), // 1 week
      monthly: new TimeWindow('monthly', 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    // Store aggregations: windowKey -> productId -> categoryId -> stats
    this.aggregations = new Map();
  }

  /**
   * Process a batch of sales events
   */
  processBatch(events) {
    for (const event of events) {
      this._processEvent(event);
    }
  }

  /**
   * Get aggregated sales for a product in a category
   */
  getSales(productId, categoryId, windowType = 'daily') {
    const window = this.windows[windowType];
    const windowKey = window.getWindowKey();

    const productAggs = this.aggregations.get(windowKey)?.get(productId);
    if (!productAggs) {
      return { quantity: 0, revenue: 0, buyers: new Set() };
    }

    return productAggs.get(categoryId) || { quantity: 0, revenue: 0, buyers: new Set() };
  }

  /**
   * Get all products in a category for ranking
   */
  getCategorySales(categoryId, windowType = 'daily') {
    const window = this.windows[windowType];
    const windowKey = window.getWindowKey();

    const windowData = this.aggregations.get(windowKey);
    if (!windowData) return [];

    const results = [];

    for (const [productId, categoryMap] of windowData.entries()) {
      const sales = categoryMap.get(categoryId);
      if (sales) {
        results.push({
          productId,
          quantity: sales.quantity,
          revenue: sales.revenue,
          uniqueBuyers: sales.buyers.size
        });
      }
    }

    return results;
  }

  /**
   * Clear old windows to free memory
   */
  clearOldWindows(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    const keysToDelete = [];

    for (const key of this.aggregations.keys()) {
      const timestamp = parseInt(key.split('_')[1]);
      if (timestamp < cutoff) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.aggregations.delete(key);
    }

    return keysToDelete.length;
  }

  _processEvent(event) {
    for (const windowType of Object.keys(this.windows)) {
      const window = this.windows[windowType];
      const windowKey = window.getWindowKey(event.timestamp);

      // Get or create window data
      if (!this.aggregations.has(windowKey)) {
        this.aggregations.set(windowKey, new Map());
      }

      const windowData = this.aggregations.get(windowKey);

      // Get or create product data
      if (!windowData.has(event.productId)) {
        windowData.set(event.productId, new Map());
      }

      const productData = windowData.get(event.productId);

      // Aggregate for each category
      for (const categoryId of event.categoryIds) {
        if (!productData.has(categoryId)) {
          productData.set(categoryId, {
            quantity: 0,
            revenue: 0,
            buyers: new Set()
          });
        }

        const categoryData = productData.get(categoryId);
        categoryData.quantity += event.quantity;
        categoryData.revenue += event.revenue;
        // Note: In real system, would track actual user IDs
      }
    }
  }
}

// ============================================================================
// 4. Ranking Algorithms / 排名算法
// ============================================================================

class RankingAlgorithm {
  /**
   * Simple quantity-based ranking
   */
  static simpleRank(salesData) {
    return salesData
      .map(item => ({
        ...item,
        score: item.quantity
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  /**
   * Revenue-based ranking
   */
  static revenueRank(salesData) {
    return salesData
      .map(item => ({
        ...item,
        score: item.revenue
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  /**
   * Time-decayed ranking (recent sales weighted more)
   */
  static timeDecayedRank(salesDataWithTime, decayFactor = 0.95) {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;

    return salesDataWithTime
      .map(item => {
        const hoursSinceLastSale = (now - item.lastSaleTime) / hourInMs;
        const decayWeight = Math.pow(decayFactor, hoursSinceLastSale);
        const score = item.quantity * decayWeight;

        return { ...item, score, decayWeight };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  /**
   * Velocity-based ranking (trending detection)
   */
  static velocityRank(currentSales, historicalSales) {
    return currentSales
      .map(item => {
        const historical = historicalSales.find(h => h.productId === item.productId);
        const historicalQty = historical ? historical.quantity : 0;
        const velocity = historicalQty > 0
          ? (item.quantity - historicalQty) / historicalQty
          : item.quantity;

        return {
          ...item,
          velocity,
          score: item.quantity * (1 + velocity * 0.5) // Boost by velocity
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  /**
   * Composite ranking (multiple factors)
   */
  static compositeRank(salesData, weights = { quantity: 0.5, revenue: 0.3, buyers: 0.2 }) {
    // Normalize each metric
    const maxQuantity = Math.max(...salesData.map(s => s.quantity), 1);
    const maxRevenue = Math.max(...salesData.map(s => s.revenue), 1);
    const maxBuyers = Math.max(...salesData.map(s => s.uniqueBuyers), 1);

    return salesData
      .map(item => {
        const normalizedQuantity = item.quantity / maxQuantity;
        const normalizedRevenue = item.revenue / maxRevenue;
        const normalizedBuyers = item.uniqueBuyers / maxBuyers;

        const score =
          normalizedQuantity * weights.quantity +
          normalizedRevenue * weights.revenue +
          normalizedBuyers * weights.buyers;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }
}

// ============================================================================
// 5. Ranking Service / 排名服务
// ============================================================================

class RankingService {
  constructor(categoryTree, aggregator) {
    this.categoryTree = categoryTree;
    this.aggregator = aggregator;
    this.rankingCache = new Map(); // Cache computed rankings
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get top N products in a category
   */
  getTopProducts(categoryId, options = {}) {
    const {
      limit = 100,
      windowType = 'daily',
      algorithm = 'simple',
      includeDescendants = false
    } = options;

    const cacheKey = `${categoryId}_${windowType}_${algorithm}_${includeDescendants}`;

    // Check cache
    const cached = this.rankingCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data.slice(0, limit);
    }

    // Get sales data
    let salesData = this.aggregator.getCategorySales(categoryId, windowType);

    // Include descendant categories if requested
    if (includeDescendants) {
      const descendants = this.categoryTree.getDescendants(categoryId);
      for (const descendant of descendants) {
        const descendantSales = this.aggregator.getCategorySales(descendant.categoryId, windowType);
        salesData = this._mergeSalesData(salesData, descendantSales);
      }
    }

    // Apply ranking algorithm
    let ranked;
    switch (algorithm) {
      case 'revenue':
        ranked = RankingAlgorithm.revenueRank(salesData);
        break;
      case 'composite':
        ranked = RankingAlgorithm.compositeRank(salesData);
        break;
      default:
        ranked = RankingAlgorithm.simpleRank(salesData);
    }

    // Cache the result
    this.rankingCache.set(cacheKey, {
      data: ranked,
      timestamp: Date.now()
    });

    return ranked.slice(0, limit);
  }

  /**
   * Get a product's rank in a category
   */
  getProductRank(productId, categoryId, windowType = 'daily') {
    const rankings = this.getTopProducts(categoryId, { windowType, limit: 10000 });
    const productRanking = rankings.find(r => r.productId === productId);

    return productRanking || { rank: null, message: 'Product not in rankings' };
  }

  /**
   * Get a product's ranks in all its categories
   */
  getProductRanksAllCategories(productId, categoryIds, windowType = 'daily') {
    const ranks = [];

    for (const categoryId of categoryIds) {
      const ranking = this.getProductRank(productId, categoryId, windowType);
      const category = this.categoryTree.categories.get(categoryId);

      ranks.push({
        categoryId,
        categoryName: category ? category.name : 'Unknown',
        ...ranking
      });
    }

    return ranks;
  }

  /**
   * Get trending products (fast risers)
   */
  getTrending(categoryId, windowType = 'daily') {
    const currentSales = this.aggregator.getCategorySales(categoryId, windowType);

    // Get previous window sales for comparison
    const previousWindowType = this._getPreviousWindowType(windowType);
    const previousSales = this.aggregator.getCategorySales(categoryId, previousWindowType);

    const trending = RankingAlgorithm.velocityRank(currentSales, previousSales);

    // Filter for positive velocity only
    return trending
      .filter(item => item.velocity > 0.2) // At least 20% growth
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 50); // Top 50 trending
  }

  /**
   * Clear ranking cache
   */
  clearCache() {
    this.rankingCache.clear();
  }

  _mergeSalesData(data1, data2) {
    const merged = new Map();

    // Add data1
    for (const item of data1) {
      merged.set(item.productId, { ...item });
    }

    // Merge data2
    for (const item of data2) {
      if (merged.has(item.productId)) {
        const existing = merged.get(item.productId);
        existing.quantity += item.quantity;
        existing.revenue += item.revenue;
        existing.uniqueBuyers += item.uniqueBuyers;
      } else {
        merged.set(item.productId, { ...item });
      }
    }

    return Array.from(merged.values());
  }

  _getPreviousWindowType(windowType) {
    // Simplified: just return same type for demo
    return windowType;
  }
}

// ============================================================================
// 6. Product Catalog / 产品目录
// ============================================================================

class ProductCatalog {
  constructor() {
    this.products = new Map(); // productId -> Product
    this.productCategories = new Map(); // productId -> [categoryIds]
  }

  addProduct(productId, name, price, categoryIds) {
    const product = {
      productId,
      name,
      price,
      createdAt: Date.now()
    };

    this.products.set(productId, product);
    this.productCategories.set(productId, categoryIds);

    return product;
  }

  getProduct(productId) {
    return this.products.get(productId);
  }

  getProductCategories(productId) {
    return this.productCategories.get(productId) || [];
  }

  getProductsInCategory(categoryId) {
    const products = [];

    for (const [productId, categoryIds] of this.productCategories.entries()) {
      if (categoryIds.includes(categoryId)) {
        products.push(this.products.get(productId));
      }
    }

    return products;
  }
}

// ============================================================================
// 7. Complete Sales Ranking System / 完整销售排名系统
// ============================================================================

class SalesRankingSystem {
  constructor() {
    this.categoryTree = new CategoryTree();
    this.productCatalog = new ProductCatalog();
    this.eventProcessor = new SalesEventProcessor();
    this.aggregator = new SalesAggregator();
    this.rankingService = new RankingService(this.categoryTree, this.aggregator);

    // Start automatic event processing
    this.eventProcessor.startProcessing(
      (batch) => this.aggregator.processBatch(batch),
      5000 // Process every 5 seconds
    );
  }

  /**
   * Record a sale
   */
  recordSale(productId, quantity, userId = null) {
    const product = this.productCatalog.getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const categoryIds = this.productCatalog.getProductCategories(productId);
    const revenue = product.price * quantity;

    const event = new SalesEvent(productId, categoryIds, quantity, revenue);
    return this.eventProcessor.ingest(event);
  }

  /**
   * Get rankings
   */
  getRankings(categoryId, options) {
    return this.rankingService.getTopProducts(categoryId, options);
  }

  /**
   * Get product rank
   */
  getProductRank(productId, categoryId, windowType) {
    return this.rankingService.getProductRank(productId, categoryId, windowType);
  }

  /**
   * Get trending products
   */
  getTrending(categoryId, windowType) {
    return this.rankingService.getTrending(categoryId, windowType);
  }

  /**
   * Cleanup
   */
  shutdown() {
    this.eventProcessor.stopProcessing();
  }
}

// ============================================================================
// 8. Example Usage and Tests / 示例用法和测试
// ============================================================================

async function demonstrateSalesRanking() {
  console.log('='.repeat(70));
  console.log('Sales Ranking System Demonstration');
  console.log('销售排名系统演示');
  console.log('='.repeat(70));

  // Create system
  const system = new SalesRankingSystem();

  // Set up category hierarchy
  console.log('\n1. Setting up category hierarchy...');
  const electronics = system.categoryTree.addCategory(1, 'Electronics');
  const computers = system.categoryTree.addCategory(2, 'Computers', 1);
  const laptops = system.categoryTree.addCategory(3, 'Laptops', 2);
  const desktops = system.categoryTree.addCategory(4, 'Desktops', 2);
  const phones = system.categoryTree.addCategory(5, 'Phones', 1);

  console.log('✓ Created category hierarchy:');
  console.log('  - Electronics');
  console.log('    - Computers');
  console.log('      - Laptops');
  console.log('      - Desktops');
  console.log('    - Phones');

  // Add products
  console.log('\n2. Adding products...');
  system.productCatalog.addProduct(101, 'MacBook Pro', 2499, [3]);
  system.productCatalog.addProduct(102, 'Dell XPS', 1899, [3]);
  system.productCatalog.addProduct(103, 'ThinkPad', 1299, [3]);
  system.productCatalog.addProduct(104, 'Gaming Desktop', 1999, [4]);
  system.productCatalog.addProduct(105, 'iPhone 15', 999, [5]);
  system.productCatalog.addProduct(106, 'Samsung Galaxy', 899, [5]);

  console.log('✓ Added 6 products');

  // Simulate sales
  console.log('\n3. Simulating sales...');
  const salesSimulation = [
    { productId: 101, quantity: 15 },
    { productId: 102, quantity: 12 },
    { productId: 103, quantity: 8 },
    { productId: 101, quantity: 5 },
    { productId: 105, quantity: 25 },
    { productId: 106, quantity: 18 },
    { productId: 104, quantity: 6 },
    { productId: 102, quantity: 7 },
    { productId: 105, quantity: 10 },
    { productId: 101, quantity: 8 }
  ];

  for (const sale of salesSimulation) {
    system.recordSale(sale.productId, sale.quantity);
  }

  console.log(`✓ Recorded ${salesSimulation.length} sales`);

  // Wait for processing
  console.log('\n4. Waiting for event processing...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Get rankings
  console.log('\n5. Rankings for Laptops category:');
  const laptopRankings = system.getRankings(3, { limit: 10 });
  console.table(
    laptopRankings.map(r => ({
      Rank: r.rank,
      ProductID: r.productId,
      Quantity: r.quantity,
      Revenue: `$${r.revenue.toFixed(2)}`,
      Score: r.score.toFixed(2)
    }))
  );

  console.log('\n6. Rankings for Phones category:');
  const phoneRankings = system.getRankings(5, { limit: 10 });
  console.table(
    phoneRankings.map(r => ({
      Rank: r.rank,
      ProductID: r.productId,
      Quantity: r.quantity,
      Revenue: `$${r.revenue.toFixed(2)}`,
      Score: r.score.toFixed(2)
    }))
  );

  // Get specific product rank
  console.log('\n7. MacBook Pro (101) rank in Laptops:');
  const macbookRank = system.getProductRank(101, 3);
  console.log(`  Rank: #${macbookRank.rank}`);
  console.log(`  Quantity: ${macbookRank.quantity}`);
  console.log(`  Revenue: $${macbookRank.revenue.toFixed(2)}`);

  // Get rankings with descendants
  console.log('\n8. Overall Computer category rankings (including subcategories):');
  const computerRankings = system.getRankings(2, {
    limit: 10,
    includeDescendants: true
  });
  console.table(
    computerRankings.map(r => ({
      Rank: r.rank,
      ProductID: r.productId,
      Quantity: r.quantity,
      Revenue: `$${r.revenue.toFixed(2)}`
    }))
  );

  // Test revenue-based ranking
  console.log('\n9. Revenue-based rankings for Laptops:');
  const revenueRankings = system.getRankings(3, {
    limit: 10,
    algorithm: 'revenue'
  });
  console.table(
    revenueRankings.map(r => ({
      Rank: r.rank,
      ProductID: r.productId,
      Revenue: `$${r.revenue.toFixed(2)}`,
      Score: r.score.toFixed(2)
    }))
  );

  // Test composite ranking
  console.log('\n10. Composite rankings for Laptops:');
  const compositeRankings = system.getRankings(3, {
    limit: 10,
    algorithm: 'composite'
  });
  console.table(
    compositeRankings.map(r => ({
      Rank: r.rank,
      ProductID: r.productId,
      Quantity: r.quantity,
      Revenue: `$${r.revenue.toFixed(2)}`,
      Score: r.score.toFixed(4)
    }))
  );

  // Category path
  console.log('\n11. Category paths:');
  console.log('  Laptops:', system.categoryTree.getCategoryPath(3));
  console.log('  Phones:', system.categoryTree.getCategoryPath(5));

  console.log('\n' + '='.repeat(70));
  console.log('Demonstration complete!');
  console.log('='.repeat(70));

  // Cleanup
  system.shutdown();
}

// Run demonstration
if (require.main === module) {
  demonstrateSalesRanking().catch(console.error);
}

// Export for use in other modules
module.exports = {
  CategoryTree,
  SalesEvent,
  SalesEventProcessor,
  TimeWindow,
  SalesAggregator,
  RankingAlgorithm,
  RankingService,
  ProductCatalog,
  SalesRankingSystem
};
