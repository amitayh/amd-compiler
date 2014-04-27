var assert = require("assert");
var path = require("path");
var dependencyGraph = require("../src/dependency-graph");
var Loader = require("../src/filesystem-loader");
var compiler = require("../src/compiler");

describe("compiler", function() {

  describe("#compile()", function() {

    it("should merge all sources in dependency graph into a compiled source", function() {
      var root = path.resolve(__dirname, "fixtures"),
          loader = new Loader(root),
          graph = dependencyGraph.build(loader, "main");

      var expected = loader.load("compiled.js");
      assert.equal(expected, compiler.compile(graph));
    });

  });

});