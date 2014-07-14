(function () {
  (function () {
    console.log("req");
  }());
  var def = "def";
  (function (def) {
    console.log(def);
  }(def));
}());