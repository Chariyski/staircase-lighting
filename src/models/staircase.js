'use strict';

function getPixels(stair) {
  const pixels = [];

  for (let i = 0; i < stair.length; i++) {
    pixels.push(stair.from + i);
  }
  return pixels;
}

const staircaseConfig = {
  _animationModes: ['stairByStair', 'pixelByPixel', 'middleToEnd', 'endToMiddle', 'noAnimation'],

  _color: '#ffffff',

  _direction: true, // for now the direction will be true if it is from "start" to "end" of the strip

  _pixelDelay: 100, // TODO check min stable delay

  _stairDelay: 1000,

  _staircaseDelay: 15000,

  _stairs: [{
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

  _stripLength: 50,

  _workModes: ['off', 'on']
};

staircaseConfig._stairs.forEach((stair) => {
  stair.getPixels = getPixels.bind(null, stair);
});

module.exports = staircaseConfig;
