var assert = require("assert");
var path = require("path");
var dependencyGraph = require("../src/dependency-graph");
var Loader = require("../src/filesystem-loader");

describe("dependency-graph", function() {

  describe("#build()", function() {
    it("should build dependency graph from main file", function() {
      var root = path.resolve(__dirname, "fixtures"),
          loader = new Loader(root),
          graph = dependencyGraph.build(loader, "main");

      var expectedAdj = {
        "main": ["modA", "modB"],
        "modA": ["modC", "./modD/sub1"],
        "modB": ["modC", "./modD/sub2"],
        "modC": ["./modD/sub1", "./modD/sub2"],
        "./modD/sub1": [],
        "./modD/sub2": []
      };

      assert.deepEqual(expectedAdj, graph.adj);
    });
  });

});