var assert = require("assert");
var mapper = require("../src/mapper");

describe("mapper", function() {

  describe("#create()", function() {
    it("should return the minimal possible module name", function() {
      var list = [
        "foo/bar/baz/mod1",
        "foo/bar/baz/mod2",
        "foo/bar/baz/sub1/main",
        "foo/bar/baz/sub2/main",
        "foo/bar/baz/main"
      ];

      var map = mapper.create(list);
      assert.equal(null, map("fake"));
      assert.equal("mod1", map("foo/bar/baz/mod1"));
      assert.equal("mod2", map("foo/bar/baz/mod2"));
      assert.equal("sub1_main", map("foo/bar/baz/sub1/main"));
      assert.equal("sub2_main", map("foo/bar/baz/sub2/main"));
      assert.equal("baz_main", map("foo/bar/baz/main"));
    });
  });

});