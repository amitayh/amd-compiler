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

function compile(graph) {
  var nodes = graph.nodes,
      sorted, mainCall, options, ast;

  function isDefine(name) {
    return nodes[name].type === define;
  }

  function getModuleInit(name) {
    var module = nodes[name],
        factory = module.factory,
        args, init;

    if (factory.type == "FunctionExpression") {
      args = module.deps.filter(isDefine).map(createIdentifier);
      init = createCallExpression(factory, args);
    } else {
      init = factory;
    }

    return init;
  }

  function mapper(name) {
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
      body: sorted.map(mapper)
    }
  });
  ast = createExpressionStatement(mainCall);
  options = {format: format};

  return escodegen.generate(ast, options);
}

module.exports.compile = compile;