var Deque = require("double-ended-queue");
var Graph = require("./graph");
var parser = require("./module-parser");

function build(loader, main) {
  var graph = new Graph(),
      queue = new Deque();

  function addModuleToGraph(name) {
    var module = graph.nodes[name];

    if (!module) {
      var source = loader.load(name + ".js");
      module = parser.parseSource(source);
      graph.addNode(name, module);
    }

    return module;
  }

  queue.enqueue(main);
  while (queue.length > 0) {
    var current = queue.dequeue(),
        module = addModuleToGraph(current);

    module.deps.forEach(function(dep) {
      addModuleToGraph(dep);
      graph.addEdge(current, dep);
      queue.enqueue(dep);
    });
  }

  return graph;
}

module.exports.build = build;