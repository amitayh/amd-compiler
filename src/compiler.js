var escodegen = require("escodegen");
var define = require("../src/module-parser").type.define;
var format = {
  indent: {style: "  "},
  quotes: "double"
};

function convertName(name) {
  var valid = name;
  // Trim bad characters from line begining
  valid = valid.replace(/^\W+/g, "");
  // Convert other bad characters to underscores
  valid = valid.replace(/\W+/g, "_");

  return valid;
}

function createIdentifier(name) {
  return {
    type: "Identifier",
    name: convertName(name)
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

function getModuleInit(module) {
  var factory = module.factory, args, init;
  if (factory.type == "FunctionExpression") {
    args = module.deps.map(createIdentifier);
    init = createCallExpression(factory, args);
  } else {
    init = factory;
  }

  return init;
}

function createBodyExpression(nodes) {
  return function(name) {
    var module = nodes[name],
        init = getModuleInit(module),
        expression;

    if (module.type === define) {
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
  };
}

function compile(graph) {
  var sorted = graph.topologicalSort(),
      mapper = createBodyExpression(graph.nodes),
      options = {format: format},
      expression,
      ast;

  expression = createCallExpression({
    type: "FunctionExpression",
    params: [],
    body: {
      type: "BlockStatement",
      body: sorted.map(mapper)
    }
  });

  ast = createExpressionStatement(expression);

  return escodegen.generate(ast, options);
}

module.exports.compile = compile;