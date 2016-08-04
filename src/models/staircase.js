'use strict';
var getPixels = function () {
  var pixels = [];
  for (var i = 0; i < this.length; i++) {
    pixels.push(this.from + i);
  }
  return pixels;
};

module.exports = {
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

  workModes: ['off', 'on', 'sensor'],

  animationModes: ['none', 'stairByStair']
};
