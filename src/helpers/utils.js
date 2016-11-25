'use strict';

function delay(milliseconds) {
  return function (result) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(result);
      }, milliseconds);
    });
  };
}

function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);;
}

module.exports = {
  delay,
  randomColor
};
