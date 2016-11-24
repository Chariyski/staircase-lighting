'use strict';

function getPixels(stair) {
  const pixels = [];

  for (let i = 0; i < stair.length; i++) {
    pixels.push(stair.from + i);
  }
  return pixels;
}

function getStripLength(stairs) {
  if (!stairs) {
    return 0;
  }

  return stairs.map((element) => {
    return element.length;
  }).reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  }, 0);
}

const staircaseConfig = {
  _animationMode: ['noAnimation'],

  _animationModes: ['christmas', 'endToMiddle', 'middleToEnd', 'noAnimation', 'pixelByPixel', 'stairByStair'],

  _color: '#ffffff',

  _direction: 'bottomToTop',

  _directions: ['bottomToTop', 'topToBottom'],

  /*
   Each neopixels is 10bytes in terms of message handling etc so 10 x ~150 = ~1500 bytes = ~12000bps.
   The max amount per second is 57600 bps.
   */
  /*
   Each neopixels in the strip requires approximately 0.1ms to take the colour.
   The minimum refresh time per cycle is about 15ms for 150 pixels.
   */
  _pixelDelay: 50,

  _stairDelay: 500,

  _staircaseDelay: 15000, // TODO remove

  _stairs: [{
    _position: 'first',
    length: 8
  }, {
    _position: 'second',
    length: 8
  }, {
    _position: 'third',
    length: 10
  }, {
    _position: 'fourth',
    length: 10
  }, {
    _position: 'fifth',
    length: 10
  }, {
    _position: 'sixth',
    length: 10
  }, {
    _position: 'seventh',
    length: 10
  }, {
    _position: 'eight',
    length: 10
  }, {
    _position: 'night',
    length: 10
  }, {
    _position: 'tenth',
    length: 10
  }, {
    _position: 'eleventh',
    length: 10
  }, {
    _position: 'twelfth',
    length: 10
  }, {
    _position: 'thirteenth',
    length: 10
  }, {
    _position: 'fourteenth',
    length: 7
  }, {
    _position: 'fifteenth',
    length: 10
  }],

  _workMode: ['off'],

  _workModes: ['off', 'on']
};

staircaseConfig._stairs.forEach((stair, index, stairs) => {
  stair.getPixels = getPixels.bind(null, stair);

  if (stairs[index - 1]) {
    stair.from = stairs[index - 1].length + stairs[index - 1].from;
  } else {
    stair.from = 0;
  }
});

staircaseConfig._stripLength = getStripLength(staircaseConfig._stairs);

module.exports = staircaseConfig;

