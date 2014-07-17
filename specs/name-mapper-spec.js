var assert = require("assert");
var nameMapper = require("../src/name-mapper");

describe("name-mapper", function() {

  describe("#create()", function() {
    it("should return the minimal possible module name", function() {
      var names = [
        "foo/bar/baz/mod1.js",
        "foo/bar/baz/mod2.js",
        "foo/bar/baz/sub1/main.js",
        "foo/bar/baz/sub2/main.js",
        "foo/bar/baz/main.js"
      ];

      var mapper = nameMapper.create(names);
      assert.equal(null, mapper("fake.js"));
      assert.equal("mod1", mapper("foo/bar/baz/mod1.js"));
      assert.equal("mod2", mapper("foo/bar/baz/mod2.js"));
      assert.equal("sub1_main", mapper("foo/bar/baz/sub1/main.js"));
      assert.equal("sub2_main", mapper("foo/bar/baz/sub2/main.js"));
      assert.equal("baz_main", mapper("foo/bar/baz/main.js"));
    });
  });

});