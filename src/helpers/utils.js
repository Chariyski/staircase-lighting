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
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

module.exports = {
  delay,
  randomColor
};
