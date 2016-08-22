'use strict';

var helpers = require('./helpers/utils');
var five = require('johnny-five');
var pixel = require('./../node_modules/node-pixel/lib/pixel.js');
var staircaseModel = require('./models/staircase');
var opts = {};

opts.port = process.argv[2] || '';

function StaircaseLighting(options) {
  Object.assign(this, staircaseModel, options);

  if (!this.color) {
    this.color = staircaseModel.color;
  }

  if (!this.animationMode) {
    this.animationMode = staircaseModel.animationModes[0];
  }

  if (!this.workMode) {
    this.workMode = staircaseModel.workModes[0];
  }

  this._initBoard();

  // Strip mock for developing without hardware
  // this.strip = {
  //   color: function () {
  //   },
  //   pixel: function () {
  //     return this;
  //   },
  //   show: function () {
  //   },
  //   off: function () {
  //   }
  // };
  //
  // this.setAnimationMode('stairByStair');
  // this.setDirection(!this.getDirection());
  // this._motionSensorHandler();
}

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

StaircaseLighting.prototype.getDirection = function () {
  return this.direction;
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

StaircaseLighting.prototype.getStaircaseDelay = function () {
  return this.staircaseDelay;
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

StaircaseLighting.prototype.setDirection = function (direction) {
  this.direction = direction;

  return this;
};

StaircaseLighting.prototype.setPixelDelay = function (pixelDelay) {
  if (typeof pixelDelay !== 'number') {
    throw new Error('"pixelDelay" should be number');
  }

  this.pixelDelay = pixelDelay;

  return this;
};

StaircaseLighting.prototype.setStairsDelay = function (delay) {
  if (typeof delay !== 'number') {
    throw new Error('"delay" should be number');
  }

  this.stairDelay = delay;

  return this;
};

StaircaseLighting.prototype.setStaircaseDelay = function (delay) {
  if (typeof delay !== 'number') {
    throw new Error('"delay" should be number');
  }

  this.staircaseDelay = delay;

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

  return this;
};

StaircaseLighting.prototype.runWorkMode = function () {
  var workMode = this.getWorkMode();

  if (this[workMode]) {
    this[workMode]();
  } else {
    this.runAnimation();
  }
};

// TODO remove if unneeded
StaircaseLighting.prototype.start = function () {
  this.strip.off();
  this.runWorkMode();
};

// Work modes overwrites

StaircaseLighting.prototype.off = function () {
  var currentStripColor = this.getColor();

  this.setColor('#000000');
  this.runAnimation();
  this.setColor(currentStripColor);
};


// TODO
StaircaseLighting.prototype.auto = function () {
  return;
//   var that = this;
//
//   if (this.getAnimationMode() === 'stairByStair') {
//     this.stairByStair()
//       .then(function (values) {
//         return 'All stairs are turned on';
//       })
//       .then(function (result) {
//         console.log(result);
//
//         return helpers.delay(2000)();
//       })
//       .then(function () {
//         that.setColor('#000000');
//         that.stairByStair('backwards');
//       });
//   } else {
//     this.runAnimation();
//   }
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
  var initialDelay = this.getPixelDelay();
  var stripColor = this.getColor();

  if (pixels === undefined) {
    pixels = this.getAllPixels();
  }

  if (!this.getDirection()) {
    pixels.reverse();
  }

  pixels.forEach(function (element, index) {
    var pixelDelay = initialDelay * index;

    pixelPromises.push(helpers.delay(pixelDelay)(index)
      .then(function () {
        that.strip.pixel(element).color(stripColor);
        that.strip.show();

        console.log(element);
        return element;
      }));
  });

  return Promise.all(pixelPromises);
};

StaircaseLighting.prototype.stairByStair = function () {
  var stripColor = this.getColor();

  var stairsPromises = this._stairByStair(function (stair) {
    var pixels = stair.getPixels();
    var i = 0;

    for (i; i < pixels.length; i++) {
      this.strip.pixel(pixels[i]).color(stripColor);
    }

    this.strip.show();

    return stair;
  }.bind(this));

  stairsPromises.forEach(function (stairPromise) {
    stairPromise.then(function (stair) {
      console.log(stair._position + ' stair');
    });
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

  this.firstFloorMotionSensor = new five.Motion(7);

  this.firstFloorMotionSensor.on('calibrated', function () {
    that._isStaircaseLightedFromMotionSensor = false;
    console.log('First floor motion sensor is calibrated');
  });

  this.firstFloorMotionSensor.on('motionstart', function () {
    if (that.getWorkMode() !== 'auto') {
      return;
    }

    console.log('First floor motion sensor start');
    that._motionSensorHandler();
  });

  // this.firstFloorMotionSensor.on('motionend', function () {);
};

StaircaseLighting.prototype._motionSensorHandler = function (delay) {
  var that = this;
  var timeout = delay || this.getStaircaseDelay();

  if (this._isStaircaseLightedFromMotionSensor !== true) {
    this.runAnimation();
  }

  clearTimeout(this._motionSensorTimeout); // TODO clear the timeout when the workMode is change

  this._isStaircaseLightedFromMotionSensor = true;
  this._motionSensorTimeout = setTimeout(function () {
    that.off();
    that._isStaircaseLightedFromMotionSensor = false;
  }, timeout);
};

StaircaseLighting.prototype._stairByStair = function (callback) {
  var stairs = this.getDirection() ? this.getStairs() : this.getStairs().reverse();
  var initialDelay = this.getStairDelay();
  var stairsPromises = [];

  stairs.forEach(function (stair, index) {
    var stairDelay = initialDelay * index;

    var stairPromise = helpers.delay(stairDelay)()
      .then(function () {
        return callback(stair);
      });

    stairsPromises.push(stairPromise);
  });

  return stairsPromises;
};

module.exports = StaircaseLighting;
