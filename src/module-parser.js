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
  var deps = [];
  if (args[0].type == "ArrayExpression") {
    deps = args[0].elements.map(getValue);
  }

  return deps;
}

function getModuleFactory(args) {
  var factory = args[0];
  if (factory.type == "ArrayExpression") {
    factory = args[1];
  }

  return factory;
}

function parseSource(source) {
  var program = esprima.parse(source),
      body = program.body,
      callExpression,
      calleeName,
      args;

  if (body.length != 1) {
    throw new Error("Ambiguous module type");
  }

  callExpression = body[0].expression;
  calleeName = callExpression.callee.name;
  args = callExpression.arguments;

  return {
    type: getModuleType(calleeName),
    deps: getModuleDeps(args),
    factory: getModuleFactory(args)
  };
}

module.exports.type = type;
module.exports.parseSource = parseSource;