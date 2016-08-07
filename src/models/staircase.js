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

  color: '#ffffff',

  pixelDelay: 30,

  stairDelay: 1000,

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
  }, {
    _position: 'fourth',
    length: 10,
    from: 30,
    getPixels: getPixels
  }, {
    _position: 'fifth',
    length: 10,
    from: 40,
    getPixels: getPixels
  }],

  stripLength: 50,

  workModes: ['off', 'on', 'sensor']
};
