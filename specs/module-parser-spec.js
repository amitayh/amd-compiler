var assert = require("assert");
var parser = require("../src/module-parser");

describe("module-parser", function() {

  describe("#parseSource()", function() {

    var source, module;

    afterEach(function() {
      source = module = null;
    });
    
    describe("defines", function() {

      it("should parse modules without dependencies", function() {
        source = 'define(function() { return "foo"; });';
        module = parser.parseSource(source);

        var factory = 'function () { return "foo"; }';
        assert.equal(parser.type.define, module.type);
        assert.deepEqual([], module.deps);
        assert.equal(factory, module.factory);
      });

      it("should parse modules with dependencies", function() {
        source = 'define(["modA", "modB"], function(a, b) { return a + b + "c"; });';
        module = parser.parseSource(source);

        var factory = 'function (a, b) { return a + b + "c"; }';
        assert.equal(parser.type.define, module.type);
        assert.deepEqual(["modA", "modB"], module.deps);
        assert.equal(factory, module.factory);
      });

    });

    describe("requires", function() {

      it("should parse modules with dependencies", function() {
        source = 'require(["foo"], function(foo) { console.log(foo, "bar"); });';
        module = parser.parseSource(source);

        var factory = 'function (foo) { console.log(foo, "bar"); }';
        assert.equal(parser.type.require, module.type);
        assert.deepEqual(["foo"], module.deps);
        assert.equal(factory, module.factory);
      });

    });

  });

});