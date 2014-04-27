var assert = require("assert");
var path = require("path");
var Loader = require("../src/filesystem-loader");

describe("FilesystemLoader", function() {

  var root = path.resolve(__dirname, "fixtures"),
      loader;

  beforeEach(function() {
    loader = new Loader(root);
  });

  afterEach(function() {
    loader = null;
  });

  describe("#load()", function() {

    it("should throw an exception if a file is not found", function() {
      assert.throws(function() {
        loader.load("foo.js");
      });
    });

    it("shoult return file content if file exists", function() {
      var expected = 'require(["modA", "modB"], function(a, b) {\n'
                   + '  console.log(a, b);\n'
                   + '});';
      assert.equal(expected, loader.load("main.js"));
    });

    it("shoult support sub directories", function() {
      var expected = 'define(function() {\n'
                   + '  return function(str) {\n'
                   + '    return str + "!";\n'
                   + '  };\n'
                   + '});';
      assert.equal(expected, loader.load("modD/sub1.js"));
    });

  });

});