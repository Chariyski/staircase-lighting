'use strict';

const helpers = require('./helpers/utils');
const five = require('johnny-five');
const pixel = require('./../node_modules/node-pixel/lib/pixel.js');
const staircaseModel = require('./models/staircase');
const opts = {};

opts.port = process.argv[2] || '';

class StaircaseLighting {
  constructor(options) {
    Object.assign(this, staircaseModel, options);

    this._initBoard();

    // Strip mock for developing without hardware
    // this.strip = {
    //   color() {
    //   },
    //   pixel() {
    //     return this;
    //   },
    //   show() {
    //   },
    //   off() {
    //   }
    // };
    // this.direction = !this.direction;
  }

  get allPixels() {
    return this._stairs
      .map((stair) => {
        return stair.getPixels();
      })
      .reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      }, []);
  }

  get animationMode() {
    return this._animationMode;
  }

  set animationMode(animationMode) {
    if (typeof animationMode !== 'string') {
      throw new Error('"animationMode" should be string');
    }

    this._animationMode = animationMode;

    return this;
  }

  get animationModes() {
    return this._animationModes.slice();
  }

  get color() {
    return this._color;
  }

  set color(color) {
    if (typeof color !== 'string') {
      throw new Error('"color" should be string');
    }

    this._color = color;

    return this;
  }

  get direction() {
    return this._direction;
  }

  set direction(direction) {
    this._direction = direction;

    return this;
  }

  get pixelDelay() {
    return this._pixelDelay;
  }

  set pixelDelay(pixelDelay) {
    if (typeof pixelDelay !== 'number') {
      throw new Error('"pixelDelay" should be number');
    }

    this._pixelDelay = pixelDelay;

    return this;
  }

  get stairs() {
    return this._stairs.slice();
  }

  get stairDelay() {
    return this._stairDelay;
  }

  set stairDelay(delay) {
    if (typeof delay !== 'number') {
      throw new Error('"delay" should be number');
    }

    this._stairDelay = delay;

    return this;
  }

  get staircaseDelay() {
    return this._staircaseDelay;
  }

  set staircaseDelay(delay) {
    if (typeof delay !== 'number') {
      throw new Error('"delay" should be number');
    }

    this._staircaseDelay = delay;

    return this;
  }

  get workMode() {
    return this._workMode;
  }

  set workMode(workMode) {
    if (typeof workMode !== 'string') {
      throw new Error('"workMode" should be string');
    }

    this._workMode = workMode;

    return this;
  }

  get workModes() {
    return this._workModes.slice();
  }

  /*
   Methods
   */

  runAnimation() {
    this[this.animationMode]();

    return this;
  }

  runWorkMode() {
    const workMode = this.workMode;

    if (this[workMode]) {
      this[workMode]();
    } else {
      this.runAnimation();
    }
  }

  start() {
    this.strip.off();
    this.runWorkMode();
  }

  // Work modes overwrites

  off() {
    const currentStripColor = this.color;

    this.color = '#000000';
    this.runAnimation();
    this.color = currentStripColor;
  }

  // Animation modes

  noAnimation() {
    this.strip.color(this.color);
    this.strip.show();
  }

  pixelByPixel(pixelArray) {
    const pixelPromises = [];
    const initialDelay = this.pixelDelay;
    const stripColor = this.color;
    let pixels = pixelArray;

    if (pixels === undefined) {
      pixels = this.allPixels;
    }

    if (!this.direction) {
      pixels.reverse();
    }

    pixels.forEach((element, index) => {
      const pixelDelay = initialDelay * index;

      pixelPromises.push(helpers.delay(pixelDelay)(index)
        .then(() => {
          this.strip.pixel(element).color(stripColor);
          this.strip.show();

          console.log(element);
          return element;
        }));
    });

    return Promise.all(pixelPromises);
  }

  stairByStair() {
    const stripColor = this.color;

    const stairsPromises = this._stairByStair((stair) => {
      const pixels = stair.getPixels();

      for (let i = 0; i < pixels.length; i++) {
        this.strip.pixel(pixels[i]).color(stripColor);
      }

      this.strip.show();

      return stair;
    });

    stairsPromises.forEach((stairPromise) => {
      stairPromise.then((stair) => {
        console.log(`${stair._position} stair`);
      });
    });

    return Promise.all(stairsPromises);
  }

  /*
   Private
   */

  _initBoard() {
    this.board = new five.Board(opts);

    this.board.on('ready', () => {
      console.log('Board ready, lets add light');
      this._initStrip();
    });
  }

  _initStrip() {
    const that = this;

    this.strip = new pixel.Strip({
      data: 6,
      length: staircaseModel._stripLength,
      color_order: pixel.COLOR_ORDER.BRG,
      board: that.board,
      controller: 'FIRMATA'
    });

    this.strip.on('ready', () => {
      this.strip.color('#000000');
      this.strip.show();
      console.log('Strip ready, let\'s go');
    });
  }

  _stairByStair(callback) {
    const stairs = this.direction ? this.stairs : this.stairs.reverse();
    const initialDelay = this.stairDelay;
    const stairsPromises = [];

    stairs.forEach((stair, index) => {
      const stairDelay = initialDelay * index;

      const stairPromise = helpers.delay(stairDelay)()
        .then(() => {
          return callback(stair);
        });

      stairsPromises.push(stairPromise);
    });

    return stairsPromises;
  }
}

module.exports = StaircaseLighting;
