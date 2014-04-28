var Deque = require("double-ended-queue");
var Graph = require("./graph");
var parser = require("./module-parser");

function build(loader, main) {
  var graph = new Graph(),
      queue = new Deque(),
      nodes = graph.nodes,
      current;

  function addModuleToGraph(name) {
    var source, module;
    if (!nodes[name]) {
      source = loader.load(name + ".js");
      module = parser.parseSource(source);
      graph.addNode(name, module);
    }
  }

  function handleDep(dep) {
    if (!nodes[dep]) {
      addModuleToGraph(dep);
      queue.enqueue(dep);
    }
    graph.addEdge(current, dep);
  }

  queue.enqueue(main);
  while (queue.length > 0) {
    current = queue.dequeue();
    addModuleToGraph(current);
    nodes[current].deps.forEach(handleDep);
  }

  return graph;
}

module.exports.build = build;