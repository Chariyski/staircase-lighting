'use strict';
var getPixels = function () {
  var pixels = [];
  for (var i = 0; i < this.length; i++) {
    pixels.push(this.from + i);
  }
  return pixels;
};

module.exports = {
  animationModes: ['noAnimation', 'stairByStair', 'pixelByPixel'],

  pixelDelay: 50,

  stairDelay:2000,

  stairs: [{
    _position: 'first',
    length: 10,
    from: 0,
    getPixels: getPixels
  }, {
    _position: 'second',
    length: 10,
    from: 10,
    getPixels: getPixels
  }, {
    _position: 'third',
    length: 10,
    from: 20,
    getPixels: getPixels
  }],

  workModes: ['off', 'on', 'sensor']
};
