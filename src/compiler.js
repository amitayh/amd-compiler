var define = require("../src/module-parser").type.define;
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

function convertToValidName(name) {
  var valid = name;
  // Trim bad characters from line begining
  valid = valid.replace(/^\W+/g, "");
  // Convert other bad characters to underscored
  valid = valid.replace(/\W+/g, "_");

  return valid;
}

function compileModule(graph, name) {
  var nodes = graph.nodes,
      module = nodes[name],
      parts = [],
      factoryArgs,
      compiled;

  function isDefine(dep) {
    return nodes[dep].type === define;
  }

  if (module.type === define) {
    parts.push(format("var %s = ", convertToValidName(name)));
  }
  parts.push(format("(%s)", module.factory));
  factoryArgs = module.deps.filter(isDefine).map(convertToValidName);
  parts.push(format("(%s);", factoryArgs.join(", ")));

  compiled = parts.join("");

  return indent(compiled, indentationLevel);
}

function compile(graph) {
  var sorted = graph.topologicalSort(),
      nodes = graph.nodes,
      parts = [],
      node;

  parts.push("(function () {");
  while (node = sorted.pop()) {
    parts.push(compileModule(graph, node));
  }
  parts.push("})();");

  return parts.join("\n\n");
}

module.exports.compile = compile;