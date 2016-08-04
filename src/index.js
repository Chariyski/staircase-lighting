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

  this._initBoard();

  // Strip mock for developing without hardware
  // this.strip = {
  //   color: function () {},
  //   pixel: function () {
  //     return this;
  //   },
  //   show: function () {},
  //   off: function () {},
  // };
}

StaircaseLighting.getModel = function () {
  return Object.assign({}, staircaseModel);
};

StaircaseLighting.prototype.getAllPixels = function () {
  var stairs = this.getStairs();

  pixels = stairs.map(function (stair) {
    return stair.getPixels();
  }).reduce(function (previousValue, currentValue) {
    return previousValue.concat(currentValue);
  }, []);

  return pixels;
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
    console.error('"animationMode" should be string');
    return;
  }

  this.animationMode = animationMode;

  return this;
};

StaircaseLighting.prototype.setColor = function (color) {
  if (typeof color !== 'string') {
    console.error('"color" should be string');
    return;
  }

  this.color = color;

  return this;
};

StaircaseLighting.prototype.setPixelDelay = function (pixelDelay) {
  if (typeof pixelDelay !== 'number') {
    console.error('"pixelDelay" should be number');
    return;
  }

  this.pixelDelay = pixelDelay;

  return this;
};

StaircaseLighting.prototype.setStairsDelay = function (stairDelay) {
  if (typeof stairDelay !== 'number') {
    console.error('"stairDelay" should be number');
    return;
  }

  this.stairDelay = stairDelay;

  return this;
};

StaircaseLighting.prototype.setWorkMode = function (workMode) {
  if (typeof workMode !== 'string') {
    console.error('"workMode" should be string');
    return;
  }

  this.workMode = workMode;

  return this;
};

// Methods

StaircaseLighting.prototype.runAnimation = function () {
  this[this.getAnimationMode()]();
};

StaircaseLighting.prototype.start = function () {
  var workModeOverwrite = this[this.getWorkMode()];
  this.strip.off();

  if (workModeOverwrite) {
    workModeOverwrite();
  } else {
    this.runAnimation();
  }
};

// Work modes overwriters

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

StaircaseLighting.prototype.pixelByPixel = function (pixels) {
  var that = this;
  var pixelPromises = [];
  var initialDelay = that.getPixelDelay();

  if (pixels === undefined) {
    pixels = this.getAllPixels();
  }

  pixels.forEach(function (element, index) {
    var pixelDelay = initialDelay * index;

    pixelPromises.push(delay(pixelDelay)(index)
      .then(function (index) {
        that.strip.pixel(element).color(that.getColor()); // TODO check if color() is chainable.
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
      .then(function (index) {
        var pixels = stair.getPixels();

        for (var i = 0; i < pixels.length; i++) {
          that.strip.pixel(pixels[i]).color(that.getColor());
        }

        that.strip.show();

        return stair.getPixels();

      }).then(function (values) {
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
  });

  this.board.on('exit', function () {
    // TODO ???
    that.strip.off();
  });
};

StaircaseLighting.prototype._initStrip = function () {
  var that = this;

  this.strip = new pixel.Strip({
    data: 6,
    length: 30, // TODO
    color_order: pixel.COLOR_ORDER.BRG,
    board: that.board,
    controller: 'FIRMATA'
  });

  this.strip.on('ready', function () {
    this.color('#000000');
    this.show();
    console.log('Strip ready, let\'s go');
  });
};

module.exports = StaircaseLighting;
