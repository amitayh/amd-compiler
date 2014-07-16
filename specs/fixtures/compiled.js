(function () {
  var sub2 = function () {
      return function (str) {
        return str + "?";
      };
    }();
  var sub1 = function () {
      return function (str) {
        return str + "!";
      };
    }();
  var modC = function (d1, d2) {
      return d1("C") + d2("C");
    }(sub1, sub2);
  var modB = function (c, d2) {
      return d2("B") + c;
    }(modC, sub2);
  var modA = function (c, d1) {
      return d1("A") + c;
    }(modC, sub1);
  (function (a, b) {
    console.log(a, b);
  }(modA, modB));
}());