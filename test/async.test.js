var async = require("../");
var assert = require("assert");

function isBrowser() {
    return (typeof process === "undefined") ||
        (process + "" !== "[object process]"); // browserify
}

suite("setImmediate", function () {

  suiteSetup(function (done) {
    setTimeout(done, 500);
  });

  test("basic", function (done) {
    var sync = true;
    async.setImmediate(function () {
      assert(!sync);
      done();
    });
    sync = false;
  });

  test("pass args", function (done) {
    async.setImmediate(function (a, b, c) {
      assert.equal(a, "foo");
      assert.equal(b, "bar");
      assert.equal(c, "baz");
      done();
    }, "foo", "bar", "baz");
  });

  if (!isBrowser()) {

    test("fast deferral (node)", function (done) {
      var start = Date.now();
      async.times(1000, function (i, cb) {
        async.setImmediate(cb);
      }, function () {
        var elapsed = Date.now() - start;
        assert(elapsed < 8, elapsed + " greater than 8ms");
        done();
      });
    });

  } else {

    test("fast deferral (browser)", function (done) {
      /* global performance */
      if (typeof performance === "undefined") {
        console.log("no high resolution timers in this browser");
        return done();
      }
      var start = performance.now();
      async.setImmediate(function () {
        var elapsed = performance.now() - start;
        assert(elapsed < 0.6, elapsed.toPrecision(2) + " above 0.6ms");
        done();
      });
    });
  }



});
