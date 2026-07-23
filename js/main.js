// Bootstraps the canvas, wires input/UI, and drives the requestAnimationFrame loop.

var lastTime = 0;

function loop(timestamp, ctx) {
  if (!lastTime) lastTime = timestamp;
  var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  Game.update(dt);
  Game.render(ctx);

  requestAnimationFrame(function (t) { loop(t, ctx); });
}

function init() {
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');

  Input.init();
  UI.cacheElements();
  UI.bindButtons(function () { Game.startGame(); }, function () { Game.restartGame(); });
  UI.showStartScreen();
  UI.hideHud();

  requestAnimationFrame(function (t) { loop(t, ctx); });
}

window.addEventListener('DOMContentLoaded', init);
