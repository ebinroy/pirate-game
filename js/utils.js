// Small reusable pure-function helpers.

var Utils = {
  rectsIntersect: function (a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
  },

  randRange: function (min, max) {
    return min + Math.random() * (max - min);
  },

  randInt: function (min, max) {
    return Math.floor(Utils.randRange(min, max + 1));
  },

  clamp: function (v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
};
