(function () {
  // Source: ROOT/modD/sub2.js
  var sub2 = function () {
      return function (str) {
        return str + "?";
      };
    }();
  // Source: ROOT/modD/sub1.js
  var sub1 = function () {
      return function (str) {
        return str + "!";
      };
    }();
  // Source: ROOT/modC.js
  var modC = function (d1, d2) {
      return d1("C") + d2("C");
    }(sub1, sub2);
  // Source: ROOT/modB.js
  var modB = function (c, d2) {
      return d2("B") + c;
    }(modC, sub2);
  // Source: ROOT/modA.js
  var modA = function (c, d1) {
      return d1("A") + c;
    }(modC, sub1);
  // Source: ROOT/main.js
  (function (a, b) {
    console.log(a, b);
  }(modA, modB));
}());