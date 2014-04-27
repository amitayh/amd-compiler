(function () {

  var modC = (function () { return "C"; })();

  var modB = (function (c) {
    return "B" + c;
  })(modC);

  var modA = (function (c) {
    return "A" + c;
  })(modC);

  (function (a, b) {
    console.log(a, b);
  })(modA, modB);

})();