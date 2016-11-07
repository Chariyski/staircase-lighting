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

  _pixelDelay: 100, // TODO check min stable delay

  _stairDelay: 1000,

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
    from: 18
  }, {
    _position: 'fourth',
    length: 10,
    from: 28
  }, {
    _position: 'fifth',
    length: 10,
    from: 38
  }, {
    _position: 'sixth',
    length: 10,
    from: 48
  }, {
    _position: 'seventh',
    length: 10,
    from: 58
  }, {
    _position: 'eight',
    length: 10,
    from: 68
  }, {
    _position: 'night',
    length: 10,
    from: 78
  }, {
    _position: 'tenth',
    length: 10,
    from: 88
  }, {
    _position: 'eleventh',
    length: 10,
    from: 98
  }, {
    _position: 'twelfth',
    length: 10,
    from: 108
  }, {
    _position: 'thirteenth',
    length: 10,
    from: 118
  }, {
    _position: 'fourteenth',
    length: 7,
    from: 125
  }, {
    _position: 'fifteenth',
    length: 10,
    from: 135
  }],

  _stripLength: calculateStripLength(this._stairs),

  _workModes: ['off', 'on']
};

staircaseConfig._stairs.forEach((stair) => {
  stair.getPixels = getPixels.bind(null, stair);
});

module.exports = staircaseConfig;

