var esprima = require("esprima");

var type = {define: 1, require: 2};

function getModuleType(name) {
  if (type[name] === undefined) {
    throw new Error("Invalid module - must call require() or define()");
  }
  return type[name];
}

function getValue(element) {
  return element.value;
}

function getModuleDeps(args) {
  if (args[0].type == "ArrayExpression") {
    return args[0].elements.map(getValue);
  } else {
    return [];
  }
}

function getModuleFactory(args) {
  if (args[0].type == "ArrayExpression") {
    return args[1];
  } else {
    return args[0];
  }
}

function parseSource(source) {
  var program = esprima.parse(source),
      body = program.body;

  if (body.length != 1) {
    throw new Error("Ambiguous module type");
  }

  var call = body[0].expression,
      calleeName = call.callee.name,
      args = call.arguments;

  return {
    type: getModuleType(calleeName),
    deps: getModuleDeps(args),
    factory: getModuleFactory(args)
  };
}

module.exports.type = type;
module.exports.parseSource = parseSource;