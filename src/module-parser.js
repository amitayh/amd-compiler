var type = {define: 1, require: 2};

function createAmdFunction(module, type) {
  return function(deps, factory) {
    if (module.type !== undefined) {
      throw new Error("Ambiguous module type");
    }
    if (factory === undefined) {
      factory = deps;
      deps = [];
    }
    module.type = type;
    module.deps = deps;
    module.factory = factory;
  };
}

function parseSource(source) {
  var module = {},
      define = createAmdFunction(module, type.define),
      require = createAmdFunction(module, type.require);

  eval(source);

  if (module.type === undefined) {
    throw new Error("Invalid module - must call require() or define()");
  }

  return module;
}

module.exports.type = type;
module.exports.parseSource = parseSource;