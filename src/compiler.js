var define = require("../src/module-parser").type.define;
var util = require("util");
var format = util.format;
var inspect = util.inspect;
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

function convertName(name) {
  var valid = name;
  // Trim bad characters from line begining
  valid = valid.replace(/^\W+/g, "");
  // Convert other bad characters to underscored
  valid = valid.replace(/\W+/g, "_");

  return valid;
}

function getFactoryArgs(nodes, deps) {
  var factoryArgs = [],
      hasRequire = false;

  deps.forEach(function(dep) {
    if (nodes[dep].type === define) {
      if (hasRequire) {
        throw new Error("Invalid dependencies order - all 'requires' must be last");
      } else {
        factoryArgs.push(convertName(dep));
      }
    } else {
      hasRequire = true;
    }
  });

  return factoryArgs;
}

function compileModule(graph, name) {
  var nodes = graph.nodes,
      module = nodes[name],
      factory = module.factory,
      compiled = "",
      factoryArgs;

  if (module.type === define) {
    compiled += format("var %s = ", convertName(name));
  }
  if (factory instanceof Function) {
    factoryArgs = getFactoryArgs(nodes, module.deps);
    compiled += format("(%s)(%s);", factory, factoryArgs.join(", "));
  } else {
    compiled += format("%s;", inspect(factory));
  }

  return indent(compiled, indentationLevel);
}

function compile(graph) {
  var sorted = graph.topologicalSort(),
      parts = [],
      node;

  parts.push("(function () {");
  while (sorted.length > 0) {
    node = sorted.pop();
    parts.push(compileModule(graph, node));
  }
  parts.push("})();");

  return parts.join("\n\n");
}

module.exports.compile = compile;