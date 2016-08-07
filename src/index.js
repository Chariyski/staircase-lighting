'use strict';

var five = require('johnny-five');
var pixel = require('./../node_modules/node-pixel/lib/pixel.js');
var staircaseModel = require('./models/staircase');
var opts = {};

opts.port = process.argv[2] || '';

// TODO
function delay(milliseconds) {
  return function (result) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(result);
      }, milliseconds);
    });
  };
}

function StaircaseLighting(options) {
  Object.assign(this, staircaseModel, options);

  // this._initBoard();

  // Strip mock for developing without hardware
  this.strip = {
    color: function () {
    },
    pixel: function () {
      return this;
    },
    show: function () {
    },
    off: function () {
    }
  };
}

StaircaseLighting.getModel = function () {
  return Object.assign({}, staircaseModel);
};

StaircaseLighting.prototype.getAllPixels = function () {
  var stairs = this.getStairs();

  return stairs.map(function (stair) {
    return stair.getPixels();
  }).reduce(function (previousValue, currentValue) {
    return previousValue.concat(currentValue);
  }, []);
};

StaircaseLighting.prototype.getAnimationMode = function () {
  return this.animationMode;
};

StaircaseLighting.prototype.getAnimationModes = function () {
  return this.animationModes.slice();
};

StaircaseLighting.prototype.getColor = function () {
  return this.color;
};

StaircaseLighting.prototype.getPixelDelay = function () {
  return this.pixelDelay;
};

StaircaseLighting.prototype.getStairs = function () {
  return this.stairs.slice();
};

StaircaseLighting.prototype.getStairDelay = function () {
  return this.stairDelay;
};

StaircaseLighting.prototype.getWorkMode = function () {
  return this.workMode;
};

StaircaseLighting.prototype.getWorkModes = function () {
  return this.workModes.slice();
};

StaircaseLighting.prototype.setAnimationMode = function (animationMode) {
  if (typeof animationMode !== 'string') {
    throw new Error('"animationMode" should be string');
  }

  this.animationMode = animationMode;

  return this;
};

StaircaseLighting.prototype.setColor = function (color) {
  if (typeof color !== 'string') {
    throw new Error('"color" should be string');
  }

  this.color = color;

  return this;
};

StaircaseLighting.prototype.setPixelDelay = function (pixelDelay) {
  if (typeof pixelDelay !== 'number') {
    throw new Error('"pixelDelay" should be number');
  }

  this.pixelDelay = pixelDelay;

  return this;
};

StaircaseLighting.prototype.setStairsDelay = function (stairDelay) {
  if (typeof stairDelay !== 'number') {
    throw new Error('"stairDelay" should be number');
  }

  this.stairDelay = stairDelay;

  return this;
};

StaircaseLighting.prototype.setWorkMode = function (workMode) {
  if (typeof workMode !== 'string') {
    throw new Error('"workMode" should be string');
  }

  this.workMode = workMode;

  return this;
};

// Methods

StaircaseLighting.prototype.runAnimation = function () {
  this[this.getAnimationMode()]();
};

StaircaseLighting.prototype.start = function () {
  var workMode = this.getWorkMode();

  this.strip.off();

  if (this[workMode]) {
    this[workMode]();
  } else {
    this.runAnimation();
  }
};

// Work modes overwrites

StaircaseLighting.prototype.off = function () {
  var that = this;

  setTimeout(function () {
    that.strip.color('#000000');
    that.strip.show();
  }, 100); // TODO check why the strip need this delay
};

StaircaseLighting.prototype.sensor = function () {
  var that = this;

  if (this.getAnimationMode() === 'stairByStair') {
    this.stairByStair()
      .then(function (values) {
        console.log('All stairs are lighted');
        return 'All stairs are lighted';
      })
      .then(function (result) {
        return delay(2000)('index');
      })
      .then(function () {
        that.setColor('#000000');
        that.stairByStair('backwards');
      });
  } else {
    this.runAnimation();
  }
};

// Animation modes

StaircaseLighting.prototype.noAnimation = function () {
  this.strip.color(this.getColor());
  this.strip.show();
};

StaircaseLighting.prototype.pixelByPixel = function (pixelArray) {
  var that = this;
  var pixels = pixelArray;
  var pixelPromises = [];
  var initialDelay = that.getPixelDelay();

  if (pixels === undefined) {
    pixels = this.getAllPixels();
  }

  pixels.forEach(function (element, index) {
    var pixelDelay = initialDelay * index;

    pixelPromises.push(delay(pixelDelay)(index)
      .then(function () {
        that.strip.pixel(element).color(that.getColor());
        that.strip.show();

        console.log(element);
        return element;
      }));
  });

  return Promise.all(pixelPromises);
};

StaircaseLighting.prototype.stairByStair = function (direction) {
  var that = this;
  var stairs = direction === 'backwards' ? this.getStairs().reverse() : this.getStairs();
  var initialDelay = that.getStairDelay();
  var stairsPromises = [];

  stairs.forEach(function (stair, index) {
    var stairDelay = initialDelay * index;

    var stairPromise = delay(stairDelay)(index)
      .then(function () {
        var pixels = stair.getPixels();
        var i = 0;

        for (i; i < pixels.length; i++) {
          that.strip.pixel(pixels[i]).color(that.getColor());
        }

        that.strip.show();

        return stair.getPixels();
      })
      .then(function (values) {
        console.log(values);
        return values;
      });

    stairsPromises.push(stairPromise);
  });

  return Promise.all(stairsPromises);
};

// Private

StaircaseLighting.prototype._initBoard = function () {
  var that = this;

  this.board = new five.Board(opts);

  this.board.on('ready', function () {
    console.log('Board ready, lets add light');
    that._initStrip();
    that._initFirstFloorMotionSensor();
  });

  this.board.on('exit', function () {
    that.strip.off(); // TODO ???
  });
};

StaircaseLighting.prototype._initStrip = function () {
  var that = this;

  this.strip = new pixel.Strip({
    data: 6,
    length: staircaseModel.stripLength,
    color_order: pixel.COLOR_ORDER.BRG,
    board: that.board,
    controller: 'FIRMATA'
  });

  this.strip.on('ready', function () {
    that.strip.color('#000000');
    that.strip.show();
    console.log('Strip ready, let\'s go');
  });
};

StaircaseLighting.prototype._initFirstFloorMotionSensor = function () {
  var that = this;
  var motion = new five.Motion(7);

  motion.on('calibrated', function () {
    console.log('First floor motion sensor is calibrated');
  });

  motion.on('motionstart', function () {
    console.log('First floor motion sensor start');
    that.stairByStair();
  });

  motion.on('motionend', function () {
    console.log('First floor motion sensor end');
    that.off();
  });
};

module.exports = StaircaseLighting;
