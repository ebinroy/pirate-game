// Keyboard state tracker.

var Input = {
  keys: {},

  isDown: function (code) {
    return !!Input.keys[code];
  },

  init: function () {
    var trackedCodes = { ArrowLeft: true, ArrowRight: true, Space: true };

    window.addEventListener('keydown', function (e) {
      Input.keys[e.code] = true;
      if (trackedCodes[e.code]) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', function (e) {
      Input.keys[e.code] = false;
      if (trackedCodes[e.code]) {
        e.preventDefault();
      }
    });
  }
};
