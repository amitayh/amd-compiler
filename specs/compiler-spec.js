var assert = require("assert");
var path = require("path");
var dependencyGraph = require("../src/dependency-graph");
var Loader = require("../src/filesystem-loader");
var compiler = require("../src/compiler");
var LoaderStub = require("./stubs/loader");

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

    it("should throw an exception if a 'require' dependency is not last", function() {
      loader = new LoaderStub();
      loader.addFile("main.js", 'require(["modA", "modB", "modC"], function(a, b, c) {});');
      loader.addFile("modA.js", 'define("modA");');
      loader.addFile("modB.js", 'require(["modC"], function(c) {});');
      loader.addFile("modC.js", 'define("modC");');

      var graph = dependencyGraph.build(loader, "main");
      assert.throws(function() {
        compiler.compile(graph);
      });
    });

  });

});