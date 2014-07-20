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
      mapper = nameMapper.create(Object.keys(nodes)),
      sorted, mainCall, options, ast;

  function isDefine(name) {
    return nodes[name].type === define;
  }

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
        expression,
        comment;

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

    comment = {type: "Line", value: " Source: " + name};
    expression.leadingComments = [comment];

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
  options = {
    format: format,
    comment: true
  };

  return escodegen.generate(ast, options);
}

module.exports.compile = compile;