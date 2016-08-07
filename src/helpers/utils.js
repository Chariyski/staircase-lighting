'use strict';

function delay(milliseconds) {
  return function (result) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(result);
      }, milliseconds);
    });
  };
}

module.exports = {
  delay: delay
};
