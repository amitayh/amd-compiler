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

  describe("#resolve()", function() {

    it("should return 'undefined' if file is not resolved", function() {
      assert.equal(undefined, loader.resolve("foo.js"));
    });

    it("should resolve relative paths", function() {
      var base = path.resolve(root, "modD");
      var expected = path.resolve(root, "main.js");
      assert.equal(expected, loader.resolve("../main.js", base));
    });

    it("should resolve absolute paths", function() {
      var expected = path.resolve(root, "main.js");
      assert.equal(expected, loader.resolve(expected));
    });

    it("should resolve full file path", function() {
      var expected = path.resolve(root, "main.js");
      assert.equal(expected, loader.resolve("main.js"));
    });

    it("should search multiple paths", function() {
      var firstPath = path.resolve(root, "modD"), expected;
      loader = new Loader([firstPath, root]);

      expected = path.resolve(firstPath, "main.js");
      assert.equal(expected, loader.resolve("main.js"));

      expected = path.resolve(root, "def.js");
      assert.equal(expected, loader.resolve("def.js"));
    });

  });

  describe("#load()", function() {

    it("should throw an exception if a file is not found", function() {
      assert.throws(function() {
        loader.load("foo.js");
      });
    });

    it("shoult return file content if exists", function() {
      var file = loader.resolve("main.js");

      var expected = 'require(["modA", "modB"], function(a, b) {\n'
                   + '  console.log(a, b);\n'
                   + '});';
      assert.equal(expected, loader.load(file));
    });

  });

});