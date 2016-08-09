'use strict';

var getPixels = function (stair) {
  var pixels = [];
  var i = 0;

  for (i; i < stair.length; i++) {
    pixels.push(stair.from + i);
  }
  return pixels;
};

var staircaseConfig = {
  animationModes: ['stairByStair', 'pixelByPixel', 'noAnimation'],

  color: '#ffffff',

  direction: true, // for now the direction will be true if it is from "start" to "end" of the strip

  pixelDelay: 50,

  stairDelay: 1000,

  staircaseDelay: 15000,

  stairs: [{
    _position: 'first',
    length: 10,
    from: 0
  }, {
    _position: 'second',
    length: 10,
    from: 10
  }, {
    _position: 'third',
    length: 10,
    from: 20
  }, {
    _position: 'fourth',
    length: 10,
    from: 30
  }, {
    _position: 'fifth',
    length: 10,
    from: 40
  }],

  stripLength: 50,

  workModes: ['auto', 'off', 'on']
};

staircaseConfig.stairs.forEach(function (stair) {
  stair.getPixels = getPixels.bind(null, stair);
});

module.exports = staircaseConfig;
