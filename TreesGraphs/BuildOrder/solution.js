// 4.7 Build Order - Topological sort for project dependencies
// Kolejność budowania - Sortowanie topologiczne dla zależności projektów

/**
 * Build order using DFS (Topological Sort)
 * O(P + D) time where P = projects, D = dependencies
 */
function findBuildOrder(projects, dependencies) {
  const graph = buildGraph(projects, dependencies);
  return orderProjects(graph);
}

function buildGraph(projects, dependencies) {
  const graph = {};

  // Initialize all projects
  for (const project of projects) {
    graph[project] = { children: [], dependencies: 0 };
  }

  // Add edges
  for (const [first, second] of dependencies) {
    graph[first].children.push(second);
    graph[second].dependencies++;
  }

  return graph;
}

function orderProjects(graph) {
  const order = [];
  const queue = [];

  // Find projects with no dependencies
  for (const project in graph) {
    if (graph[project].dependencies === 0) {
      queue.push(project);
    }
  }

  // Process projects
  while (queue.length > 0) {
    const project = queue.shift();
    order.push(project);

    // Reduce dependencies for children
    for (const child of graph[project].children) {
      graph[child].dependencies--;
      if (graph[child].dependencies === 0) {
        queue.push(child);
      }
    }
  }

  // Check for cycles
  if (order.length !== Object.keys(graph).length) {
    throw new Error('Cycle detected - no valid build order');
  }

  return order;
}

// Tests
console.log('='.repeat(70));
console.log('4.7 BUILD ORDER');
console.log('='.repeat(70));

const projects = ['a', 'b', 'c', 'd', 'e', 'f'];
const dependencies = [
  ['a', 'd'],
  ['f', 'b'],
  ['b', 'd'],
  ['f', 'a'],
  ['d', 'c']
];

console.log('Projects:', projects.join(', '));
console.log('Dependencies:', dependencies.map(d => `(${d[0]},${d[1]})`).join(', '));
console.log();

const order = findBuildOrder(projects, dependencies);
console.log('Build order:', order.join(' -> '));
console.log('Expected: f, e, a, b, d, c (or similar valid order)');

// Test with cycle
console.log('\nTest with cycle:');
try {
  const cycleDeps = [['a', 'b'], ['b', 'c'], ['c', 'a']];
  findBuildOrder(['a', 'b', 'c'], cycleDeps);
  console.log('ERROR: Should have detected cycle');
} catch (e) {
  console.log(`✓ Correctly detected: ${e.message}`);
}

console.log('\nComplexity: O(P + D) time, O(P) space');
console.log('='.repeat(70));
