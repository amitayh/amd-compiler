var Deque = require("double-ended-queue");

function Graph() {
  this.nodes = {};
  this.adj = {};
}

Graph.prototype.addNode = function(key, node) {
  this.nodes[key] = node;
  this.adj[key] = [];
};

Graph.prototype.addEdge = function(from, to) {
  this.guardNode(from);
  this.guardNode(to);
  this.adj[from].push(to);
};

Graph.prototype.guardNode = function(key) {
  if (!this.nodes[key]) {
    throw new Error("Invalid node key - '" + key + "'");
  }
};

Graph.prototype.getIndegrees = function() {
  var adj = this.adj,
      indegree = {},
      key;

  function increaseInDegree(adj) {
    indegree[adj]++;
  }

  for (key in adj) {
    indegree[key] = 0;
  }
  for (key in adj) {
    adj[key].forEach(increaseInDegree);
  }

  return indegree;
};

Graph.prototype.topologicalSort = function() {
  var adj = this.adj,
      indegree = this.getIndegrees(),
      queue = new Deque(),
      sorted = [],
      key;

  function handleAdj(adj) {
    if (--indegree[adj] === 0) {
      queue.enqueue(adj);
    }
  }

  // Find roots
  for (key in adj) {
    if (indegree[key] === 0) {
      queue.enqueue(key);
    }
  }

  // Main loop
  while (queue.length > 0) {
    key = queue.dequeue();
    sorted.push(key);
    adj[key].forEach(handleAdj);
  }

  // Search for circles
  for (key in adj) {
    if (indegree[key] !== 0) {
      throw new Error("Circle found - topological sort is not possible");
    }
  }

  return sorted;
};

module.exports = Graph;