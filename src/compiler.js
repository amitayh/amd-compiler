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
        factoryArgs.push({
          type: "Identifier",
          name: convertName(dep)
        });
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
      expression,
      statement;

  if (factory.type == "FunctionExpression") {
    expression = {
      type: "CallExpression",
      callee: factory,
      arguments: getFactoryArgs(nodes, module.deps)
    };
  } else {
    expression = factory;
  }

  if (module.type === define) {
    statement = {
      type: "VariableDeclaration",
      declarations: [{
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
          name: convertName(name)
        },
        init: expression
      }],
      kind: "var"
    };
  } else {
    statement = {
      type: "ExpressionStatement",
      expression: expression
    };
  }

  return statement;
}

function compile(graph) {
  var sorted = graph.topologicalSort(),
      options = {format: format},
      body = [],
      ast;

  while (sorted.length > 0) {
    node = sorted.pop();
    body.push(compileModule(graph, node));
  }

  ast = {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "FunctionExpression",
        params: [],
        body: {
          type: "BlockStatement",
          body: body
        }
      },
      arguments: []
    }
  };

  return escodegen.generate(ast, options);
}

module.exports.compile = compile;