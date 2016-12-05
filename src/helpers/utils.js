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

function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function randomChristmasColors() {
  const christmasColors = ['#ff0000', '#ff7878', '#ffffff', '#74d680', '#378b29', '#4AA7A7', '#93B849', '#50362A', '#DDDDC2'];

  return christmasColors[randomIntBetween(0, christmasColors.length - 1)];
}

module.exports = {
  delay,
  randomColor,
  randomChristmasColors
};
