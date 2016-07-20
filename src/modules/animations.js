'use strict';

// TODO 'strip' should be dependency (set and get config object - maybe) not transfer from reference

function changeStairLight(options, callback) {
  var stair = options.stair;
  var strip = options.strip;
  var color = options.color;
  var delay = options.delay || 0;

  setTimeout(function () {
    for (var i = 0; i < stair.length; i++) {
      strip.pixel(stair.from + i).color(color);
    }

    strip.show();

    if (callback) {
      callback();
    }
  }, delay);

}

module.exports = {

  start: function (options) {

    // TODO error handling
    var strip = options.strip;
    var stairs = options.stairs;
    var color = options.color || '#ff00ff';
    var animationType = options.animationType || 'default';
    var direction = options.direction || 'forward';

    stairs.forEach(function (stair, index) {
      changeStairLight({
        strip: strip,
        stair: stair,
        color: color,
        delay: 1000 * index
      }, function () {
        changeStairLight({
          strip: strip,
          stair: stair,
          color: [0, 0, 0],
          delay: 5000
        });
      });
    });
  }
};
