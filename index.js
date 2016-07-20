var five = require('johnny-five');
var pixel = require('./node_modules/node-pixel/lib/pixel.js');
var animations = require('./src/modules/animations');

var opts = {};
opts.port = process.argv[2] || '';

var board = new five.Board(opts);
var strip = null;
var stairs = [
  {_position: 'first', length: 10, from: 0},
  {_position: 'second', length: 10, from: 10},
  {_position: 'third', length: 10, from: 20}
];


var staircaseLight = {
  init: function () {

    board.on('ready', function () {
      console.log('Board ready, lets add light');

      strip = new pixel.Strip({
        data: 6,
        length: 30,
        color_order: pixel.COLOR_ORDER.BRG,
        board: this,
        controller: 'FIRMATA'
      });

      strip.on('ready', function () {
        console.log('Strip ready, let\'s go');

        animations.start({ // TODO better name than animation
          strip: strip,
          stairs: stairs,
          animationType: 'default',
          direction: 'forward'
        });
      });

      this.on('exit', function () {
        // TODO ??? ?
        console.log(strip.prototype);
        strip.off();
        strip.show();
      });
    });
  },

  animate: function (object) {
    if(object === undefined){
      object = {};
    }

    animations.start({ // TODO better name than animation
      strip: strip,
      stairs: stairs,
      color: object.color || '#ff00ff',
      animationType: 'default',
      direction: 'forward'
    });
  }
};

module.exports = staircaseLight;
