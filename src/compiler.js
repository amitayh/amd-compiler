var parser = require("../src/module-parser");
var format = require("util").format;
var indentationLevel = 2;

function stringRepeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++) {
    result += string;
  }

  return result;
}

function indent(source, level) {
  var replacement = "$1" + stringRepeat(" ", level);
  
  return source.replace(/(^|\n)/g, replacement);
}

function compileModule(name, module) {
  var parts = [], compiled;

  if (module.type === parser.type.define) {
    parts.push(format("var %s = ", name));
  }
  parts.push(format("(%s)", module.factory));
  parts.push(format("(%s);", module.deps.join(", ")));

  compiled = parts.join("");

  return indent(compiled, indentationLevel);
}

function compile(graph) {
  var sorted = graph.topologicalSort(),
      nodes = graph.nodes,
      parts = [],
      module,
      node;

  parts.push("(function () {");
  while (node = sorted.pop()) {
    module = nodes[node];
    parts.push(compileModule(node, module));
  }
  parts.push("})();");

  return parts.join("\n\n");
}

module.exports.compile = compile;