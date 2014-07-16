var path = require("path");
var escodegen = require("escodegen");
var parser = require("../src/module-parser");
var format = {
  indent: {style: "  "},
  quotes: "double"
};

function contains(obj, value) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === value) {
        return true;
      }
    }
  }

  return false;
}

function createNameMapper() {
  var map = {};
  return function(name) {
    var identifier = map[name], parts;
    if (!identifier) {
      parts = name.replace(/\.js$/, "").split(path.sep);
      identifier = parts.pop();
      while (contains(map, identifier)) {
        identifier = parts.pop() + "_" + identifier;
      }
      map[name] = identifier;
    }

    return identifier;
  };
}

function createCallExpression(callee, args) {
  return {
    type: "CallExpression",
    callee: callee,
    arguments: args || []
  };
}

function createExpressionStatement(expression) {
  return {
    type: "ExpressionStatement",
    expression: expression
  };
}

function compile(graph) {
  var nodes = graph.nodes,
      define = parser.type.define,
      sorted, mainCall, options, ast;

  function isDefine(name) {
    return nodes[name].type === define;
  }

  var nameMapper = createNameMapper();
  function createIdentifier(name) {
    return {
      type: "Identifier",
      name: nameMapper(name)
    };
  }

  function getModuleInit(name) {
    var module = nodes[name],
        factory = module.factory,
        args, init;

    if (factory.type == "FunctionExpression") {
      args = module.resolvedDeps.filter(isDefine).map(createIdentifier);
      init = createCallExpression(factory, args);
    } else {
      init = factory;
    }

    return init;
  }

  function moduleToExpressionMapper(name) {
    var init = getModuleInit(name),
        expression;

    if (isDefine(name)) {
      expression = {
        type: "VariableDeclaration",
        declarations: [{
          type: "VariableDeclarator",
          id: createIdentifier(name),
          init: init
        }],
        kind: "var"
      };
    } else {
      expression = createExpressionStatement(init);
    }

    return expression;
  }

  sorted = graph.topologicalSort();
  mainCall = createCallExpression({
    type: "FunctionExpression",
    params: [],
    body: {
      type: "BlockStatement",
      body: sorted.map(moduleToExpressionMapper)
    }
  });
  ast = createExpressionStatement(mainCall);
  options = {format: format};

  return escodegen.generate(ast, options);
}

module.exports.compile = compile;