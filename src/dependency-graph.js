var path = require("path");
var Deque = require("double-ended-queue");
var Graph = require("./graph");
var parser = require("./module-parser");

function build(loader, main) {
  var graph = new Graph(),
      queue = new Deque(),
      nodes = graph.nodes,
      current,
      mod;

  function resolve(name) {
    var base = current ? path.dirname(current) : null;
    return loader.resolve(name + ".js", base);
  }

  function addModuleToGraph(name) {
    var module = nodes[name], source;
    if (!module) {
      source = loader.load(name);
      module = parser.parseSource(source);
      graph.addNode(name, module);
    }

    return module;
  }

  function handleDep(dep) {
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
    mod = addModuleToGraph(current);
    mod.resolvedDeps = mod.deps.map(resolve);
    mod.resolvedDeps.forEach(handleDep);
  }

  return graph;
}

module.exports.build = build;