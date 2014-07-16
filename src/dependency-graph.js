var path = require("path");
var Deque = require("double-ended-queue");
var Graph = require("./graph");
var parser = require("./module-parser");

function build(loader, main) {
  var graph = new Graph(),
      queue = new Deque(),
      nodes = graph.nodes,
      current;

  function resolve(name) {
    var base = current ? path.dirname(current) : null;
    return loader.resolve(name + ".js", base);
  }

  function addModuleToGraph(name) {
    var source, module;
    if (!nodes[name]) {
      source = loader.load(name);
      module = parser.parseSource(source);
      graph.addNode(name, module);
    }
  }

  function handleDep(dep) {
    dep = resolve(dep);
    if (!nodes[dep]) {
      addModuleToGraph(dep);
      queue.enqueue(dep);
    }
    graph.addEdge(current, dep);
  }

  main = resolve(main);
  queue.enqueue(main);
  while (queue.length > 0) {
    current = queue.dequeue();
    addModuleToGraph(current);
    nodes[current].deps.forEach(handleDep);
  }

  return graph;
}

module.exports.build = build;