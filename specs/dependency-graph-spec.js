var assert = require("assert");
var path = require("path");
var dependencyGraph = require("../src/dependency-graph");
var Loader = require("../src/filesystem-loader");

describe("dependency-graph", function() {

  describe("#build()", function() {
    var root = path.resolve(__dirname, "fixtures"),
        loader = new Loader(root),
        graph;

    function resolve() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(root);
      return path.resolve.apply(this, args);
    }

    it("should build dependency graph from main file", function() {
      graph = dependencyGraph.build(loader, "main");

      var expectedAdj = {};
      expectedAdj[resolve("main.js")] = [resolve("modA.js"), resolve("modB.js")];
      expectedAdj[resolve("modA.js")] = [resolve("modC.js"), resolve("modD", "sub1.js")];
      expectedAdj[resolve("modB.js")] = [resolve("modC.js"), resolve("modD", "sub2.js")];
      expectedAdj[resolve("modC.js")] = [resolve("modD", "sub1.js"), resolve("modD", "sub2.js")];
      expectedAdj[resolve("modD", "sub1.js")] = [];
      expectedAdj[resolve("modD", "sub2.js")] = [];

      assert.deepEqual(expectedAdj, graph.adj);
    });

    it("should allow relative paths to be used", function() {
      graph = dependencyGraph.build(loader, "modD/main");

      var expectedAdj = {};
      expectedAdj[resolve("modD", "main.js")] = [resolve("modD", "sub1.js")];
      expectedAdj[resolve("modD", "sub1.js")] = [];

      assert.deepEqual(expectedAdj, graph.adj);
    });
  });

});