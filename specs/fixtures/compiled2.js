(function () {
  // Source: ROOT/req.js
  (function () {
    console.log("req");
  }());
  // Source: ROOT/def.js
  var def = { name: "def" };
  // Source: ROOT/main2.js
  (function (def) {
    console.log(def);
  }(def));
}());