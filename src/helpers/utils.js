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

module.exports = {
  delay
};
