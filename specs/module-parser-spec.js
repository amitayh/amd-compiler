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
        assert.equal(factory, module.factory.toString());
      });

      it("should parse modules with dependencies", function() {
        source = 'define(["modA", "modB"], function(a, b) { return a + b + "c"; });';
        module = parser.parseSource(source);

        var factory = 'function (a, b) { return a + b + "c"; }';
        assert.equal(parser.type.define, module.type);
        assert.deepEqual(["modA", "modB"], module.deps);
        assert.equal(factory, module.factory.toString());
      });

    });

    describe("requires", function() {

      it("should parse modules with dependencies", function() {
        source = 'require(["foo"], function(foo) { console.log(foo, "bar"); });';
        module = parser.parseSource(source);

        var factory = 'function (foo) { console.log(foo, "bar"); }';
        assert.equal(parser.type.require, module.type);
        assert.deepEqual(["foo"], module.deps);
        assert.equal(factory, module.factory.toString());
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