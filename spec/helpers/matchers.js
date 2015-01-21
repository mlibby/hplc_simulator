beforeEach(function () {
  jasmine.addMatchers({
    /* match out to seven decimal places */
    toBeAround: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          var result = {};

          var bigActual = Math.floor(actual * 10e6);
          var bigExpected = Math.floor(expected * 10e6);
          
          result.pass = bigActual === bigExpected;
          
          if(result.pass) {
            result.message = "Expected " + actual + " not to be around " + expected;
          } else {
            result.message = "Expected " + actual + " to be around " + expected;
          }
          
          return result;
        }
      };
    }
  });
});
