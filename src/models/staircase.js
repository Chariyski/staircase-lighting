'use strict';

function getPixels(stair) {
  const pixels = [];

  for (let i = 0; i < stair.length; i++) {
    pixels.push(stair.from + i);
  }
  return pixels;
}

function calculateStripLength(stairs) {
  if (!stairs) {
    return 0;
  }
  return stairs.reduce(function(previousValue, currentValue) {
    return previousValue.length + currentValue.length;
  }, stairs[0]);
}

const staircaseConfig = {
  _animationModes: ['stairByStair', 'pixelByPixel', 'noAnimation'],

  _color: '#ffffff',

  _direction: true, // for now the direction will be true if it is from "start" to "end" of the strip

  _pixelDelay: 50, // TODO check min stable delay

  _stairDelay: 500,

  _staircaseDelay: 15000,

  _stairs: [{
    _position: 'first',
    length: 8,
    from: 0
  }, {
    _position: 'second',
    length: 8,
    from: 8
  }, {
    _position: 'third',
    length: 10,
    from: 16
  }, {
    _position: 'fourth',
    length: 10,
    from: 26
  }, {
    _position: 'fifth',
    length: 10,
    from: 36
  }, {
    _position: 'sixth',
    length: 10,
    from: 46
  }, {
    _position: 'seventh',
    length: 10,
    from: 56
  }, {
    _position: 'eight',
    length: 10,
    from: 66
  }, {
    _position: 'night',
    length: 10,
    from: 76
  }, {
    _position: 'tenth',
    length: 10,
    from: 86
  }, {
    _position: 'eleventh',
    length: 10,
    from: 96
  }, {
    _position: 'twelfth',
    length: 10,
    from: 106
  }, {
    _position: 'thirteenth',
    length: 10,
    from: 116
  }, {
    _position: 'fourteenth',
    length: 7,
    from: 126
  }, {
    _position: 'fifteenth',
    length: 10,
    from: 133
  }],

  _stripLength: 143,

  _workModes: ['off', 'on']
};

staircaseConfig._stairs.forEach((stair) => {
  stair.getPixels = getPixels.bind(null, stair);
});

module.exports = staircaseConfig;

