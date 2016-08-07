'use strict';

var getPixels = function (stair) {
  var pixels = [];
  var i = 0;

  for (i; i < stair.length; i++) {
    pixels.push(stair.from + i);
  }
  return pixels;
};

var animationModes = ['stairByStair', 'pixelByPixel', 'noAnimation'];
var staircaseConfig = {
  animationMode: animationModes[0],

  animationModes: animationModes,

  color: '#ffffff',

  pixelDelay: 30,

  stairDelay: 1000,

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

  workModes: ['off', 'on', 'auto']
};

staircaseConfig.stairs.forEach(function (stair) {
  stair.getPixels = getPixels.bind(null, stair);
});

module.exports = staircaseConfig;
