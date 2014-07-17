var path = require("path");
var escodegen = require("escodegen");
var nameMapper = require("../src/name-mapper");
var parser = require("../src/module-parser");
var format = {
  indent: {style: "  "},
  quotes: "double"
};

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

  var mapper = nameMapper.create(Object.keys(nodes));
  function createIdentifier(name) {
    return {
      type: "Identifier",
      name: mapper(name)
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