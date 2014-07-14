(function () {
  (function () {
    console.log("req");
  }());
  var def = { name: "def" };
  (function (def) {
    console.log(def);
  }(def));
}());