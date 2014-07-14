var esprima = require("esprima");
var assert = require("assert");
var parser = require("../src/module-parser");

describe("module-parser", function() {

  describe("#parseSource()", function() {

    var source, module;

    function parseFactory(factory) {
      return esprima.parse("(" + factory + ")").body[0].expression;
    }

    afterEach(function() {
      source = module = null;
    });
    
    describe("defines", function() {

      it("should parse modules without dependencies", function() {
        source = 'define(function() { return "foo"; });';
        module = parser.parseSource(source);

        var factory = parseFactory('function () { return "foo"; }');
        assert.equal(parser.type.define, module.type);
        assert.deepEqual([], module.deps);
        assert.deepEqual(factory, module.factory);
      });

      it("should parse modules with dependencies", function() {
        source = 'define(["modA", "modB"], function(a, b) { return a + b + "c"; });';
        module = parser.parseSource(source);

        var factory = parseFactory('function (a, b) { return a + b + "c"; }');
        assert.equal(parser.type.define, module.type);
        assert.deepEqual(["modA", "modB"], module.deps);
        assert.deepEqual(factory, module.factory);
      });

    });

    describe("requires", function() {

      it("should parse modules with dependencies", function() {
        source = 'require(["foo"], function(foo) { console.log(foo, "bar"); });';
        module = parser.parseSource(source);

        var factory = parseFactory('function (foo) { console.log(foo, "bar"); }');
        assert.equal(parser.type.require, module.type);
        assert.deepEqual(["foo"], module.deps);
        assert.deepEqual(factory, module.factory);
      });

    });

    it("should throw an exception if a module contains both a 'require' and a 'define' decleration", function() {
      source = 'require(function() { console.log("bar"); });\n'
             + 'define({foo: "bar"});';

      assert.throws(function() {
        parser.parseSource(source);
      });
    });

    it("should throw an exception if module doesn't define or require anything", function() {
      source = '{foo: "bar"};';

      assert.throws(function() {
        parser.parseSource(source);
      });
    });

  });

});