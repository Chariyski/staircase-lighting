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
  if (!options) {
    options = {};
  }

  this.stairs = staircaseModel.stairs;
  this.color = options.color || '#ffffff';
  this.workMode = options.workMode || staircaseModel.workModes[0];
  this.animationMode = options.animationMode || staircaseModel.animationModes[0];
  this._initBoard();

}

StaircaseLighting.getModel = function () {
  return staircaseModel;
};

StaircaseLighting.prototype.getAnimationMode = function () {
  return this.animationMode;
};

StaircaseLighting.prototype.getAnimationModes = function () {
  return staircaseModel.animationModes;
};

StaircaseLighting.prototype.getColor = function () {
  return this.color;
};

StaircaseLighting.prototype.getWorkMode = function () {
  return this.workMode;
};

StaircaseLighting.prototype.getWorkModes = function () {
  return staircaseModel.workModes;
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

StaircaseLighting.prototype.setWorkMode = function (workMode) {
  if (typeof workMode !== 'string') {
    console.error('"workMode" should be string');
    return;
  }

  this.workMode = workMode;

  return this;
};

// Animation modes

// TODO decouple from stair - there should be fromPixel and toPixel parameters
StaircaseLighting.prototype.pixelByPixel = function (stair, pixelD, direction) {
  var pixelDelay = pixelD === undefined ? 0 : pixelD;
  var pixelPromises = [];
  var pixels = stair.getPixels();
  var that = this;

  if (direction !== undefined) { // TODO
    pixels.reverse();
  }

  pixels.forEach(function (element, index) {
    pixelPromises.push(delay(pixelDelay * index)(index)
      .then(function (index) {
        console.log(stair._position + ' - ' + element);
        that.strip.pixel(element).color(that.getColor());
        that.strip.show();

        return stair._position + ' - ' + element;
      }));
  });

  return Promise.all(pixelPromises);
};

StaircaseLighting.prototype.stairByStair = function (direction) {
  // TODO https://github.com/ajfisher/node-pixel/issues/41#issuecomment-154572775

  var stairDelay = 2000; // TODO remove magic numbers after finishing with the prototype
  var that = this;
  var stairs = this.stairs.slice(); // TODO check if all functions are pure !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  var stairsPromises = [];

  if (direction !== undefined) { // TODO
    stairs.reverse();
  }

  stairs.forEach(function (stair, index) {
    var stairPromise;

    stairPromise = delay(stairDelay * index)(index)
      .then(function (index) {
        var pixelDelay = (stairDelay / stair.length);
        var pixels = stair.getPixels();

        if (that.getAnimationMode() === 'none') {
          for (var i = 0; i < pixels.length; i++) {
            that.strip.pixel(pixels[i]).color(that.getColor());
          }

          that.strip.show();

          return 'TODO';
        } else {
          return that.pixelByPixel(stair, pixelDelay / 2, direction); //TODO remove magic numbers
        }

      }).then(function (values) {
        console.log(values);
        return values;
      });
    stairsPromises.push(stairPromise);
  });

  return Promise.all(stairsPromises);
};

// Work modes

StaircaseLighting.prototype.on = function () {
  if (this.getAnimationMode() === 'none') {
    this.strip.color(this.getColor());
    this.strip.show();
  } else {
    this.runAnimation();
  }
};

StaircaseLighting.prototype.off = function () {
  var that = this;
  setTimeout(function () {
    that.strip.color('#000000');
    that.strip.show();
  }, 100); // TODO check why the strip need this delay
};

StaircaseLighting.prototype.sensor = function () {
  var that = this;

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
      that.stairByStair(true);
    });
};

// Methods

StaircaseLighting.prototype.runAnimation = function () {
  this[this.getAnimationMode()]();
};

StaircaseLighting.prototype.start = function () {
  this.strip.off();

  console.log('this.getWorkMode()', this.getWorkMode());
  this[this.getWorkMode()]();
};

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
