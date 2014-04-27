var assert = require("assert");
var Graph = require("../src/graph");

describe("Graph", function() {

  var graph;

  beforeEach(function() {
    graph = new Graph();
  });

  afterEach(function() {
    graph = null;
  });

  it("should contain no nodes when instantiated", function() {
    assert.deepEqual({}, graph.nodes);
    assert.deepEqual({}, graph.adj);
  });

  describe("#addNode()", function() {
    it("should add node with empty adjacencies list", function() {
      graph.addNode("1", "node1");

      var expectedNodes = {1: "node1"};
      var expectedAdj = {1: []};
      assert.deepEqual(expectedNodes, graph.nodes);
      assert.deepEqual(expectedAdj, graph.adj);
    });
  });

  describe("#addEdge()", function() {
    it("should add an edge between two existing nodes", function() {
      graph.addNode("1", "node1");
      graph.addNode("2", "node2");
      graph.addEdge("1", "2");

      var expectedAdj = {"1": ["2"], "2": []};
      assert.deepEqual(expectedAdj, graph.adj);
    });

    it("should throw an exception when using invalid nodes", function() {
      graph.addNode("1", "node1");
      assert.throws(function() {
        graph.addEdge("1", "2");
      });
      assert.throws(function() {
        graph.addEdge("2", "1");
      });
    });
  });

  describe("#containsNode()", function() {
    it("should return false for missing node keys", function() {
      assert.equal(false, graph.containsNode("1"));
    });
    it("should return true for existing node keys", function() {
      graph.addNode("1", "node1");
      assert.equal(true, graph.containsNode("1"));
    });
  });

  describe("#getIndegrees()", function() {
    it("should return nodes' in-degrees", function() {
      var expected;

      graph.addNode("1", "node1");
      graph.addNode("2", "node2");
      graph.addNode("3", "node3");

      expected = {"1": 0, "2": 0, "3": 0};
      assert.deepEqual(expected, graph.getIndegrees());

      graph.addEdge("1", "2");
      graph.addEdge("1", "3");
      graph.addEdge("2", "3");

      expected = {"1": 0, "2": 1, "3": 2};
      assert.deepEqual(expected, graph.getIndegrees());
    });
  });

  describe("#topologicalSort()", function() {
    it("should return node keys in topological order", function() {
      graph.addNode("1", "node1");
      graph.addNode("2", "node2");
      graph.addNode("3", "node3");
      graph.addNode("4", "node4");
      graph.addEdge("1", "4");
      graph.addEdge("2", "4");
      graph.addEdge("4", "3");

      var expected = ["1", "2", "4", "3"];
      assert.deepEqual(expected, graph.topologicalSort());
    });
    it("should throw an exception if a circle is found", function() {
      graph.addNode("1", "node1");
      graph.addNode("2", "node2");
      graph.addNode("3", "node3");
      graph.addEdge("1", "2");
      graph.addEdge("2", "3");
      graph.addEdge("3", "1");

      assert.throws(function() {
        graph.topologicalSort();
      });
    });
  });

});