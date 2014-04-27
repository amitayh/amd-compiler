(function () {

  var modD_sub2 = (function () {
    return function(str) {
      return str + "?";
    };
  })();

  var modD_sub1 = (function () {
    return function(str) {
      return str + "!";
    };
  })();

  var modC = (function (d1, d2) {
    return d1("C") + d2("C");
  })(modD_sub1, modD_sub2);

  var modB = (function (c, d2) {
    return d2("B") + c;
  })(modC, modD_sub2);

  var modA = (function (c, d1) {
    return d1("A") + c;
  })(modC, modD_sub1);

  (function (a, b) {
    console.log(a, b);
  })(modA, modB);

})();