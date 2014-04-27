var assert = require("assert");
var path = require("path");
var dependencyGraph = require("../src/dependency-graph");
var Loader = require("../src/filesystem-loader");
var compiler = require("../src/compiler");

describe("compiler", function() {

  describe("#compile()", function() {

    var root = path.resolve(__dirname, "fixtures"),
        loader = new Loader(root);

    it("should merge all sources in dependency graph into a compiled source", function() {
      var graph = dependencyGraph.build(loader, "main");

      var expected = loader.load("compiled.js");
      assert.equal(expected, compiler.compile(graph));
    });

    it("should allow require a require", function() {
      var graph = dependencyGraph.build(loader, "main2");

      var expected = loader.load("compiled2.js");
      assert.equal(expected, compiler.compile(graph));
    });

  });

});