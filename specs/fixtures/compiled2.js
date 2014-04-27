(function () {

  (function () {
    console.log("req");
  })();

  var def = (function () {
    return "def";
  })();

  (function (def) {
    console.log(def);
  })(def);

})();