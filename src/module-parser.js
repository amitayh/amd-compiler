var type = {define: 1, require: 2};

function createAmdFunction(module, type) {
  return function(deps, factory) {
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

  return module;
}

module.exports.type = type;
module.exports.parseSource = parseSource;