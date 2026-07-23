// AABB collision checks between game entities.

var Collision = {
  checkBulletPirateCollisions: function (bulletManager, pirateManager) {
    for (var i = 0; i < bulletManager.bullets.length; i++) {
      var bullet = bulletManager.bullets[i];
      if (!bullet.active) continue;

      for (var j = 0; j < pirateManager.pirates.length; j++) {
        var pirate = pirateManager.pirates[j];
        if (pirate.state !== 'ALIVE') continue;

        if (Utils.rectsIntersect(bullet, pirate)) {
          bullet.active = false;
          pirateManager.killPirate(pirate);
          Game.addScore(pirate.scoreValue);
          break;
        }
      }
    }
  },

  checkPirateSoldierCollisions: function (pirateManager, player) {
    if (!player.canBeHit()) return;

    for (var i = 0; i < pirateManager.pirates.length; i++) {
      var pirate = pirateManager.pirates[i];
      if (pirate.state !== 'ALIVE') continue;

      if (Utils.rectsIntersect(pirate, player)) {
        pirateManager.killPirate(pirate);
        player.registerHit();
        Game.loseLife();
        break;
      }
    }
  },

  checkPirateBottomBoundary: function (pirateManager, player) {
    for (var i = 0; i < pirateManager.pirates.length; i++) {
      var pirate = pirateManager.pirates[i];
      if (pirate.state !== 'ALIVE') continue;

      if (pirate.y + pirate.height >= CANVAS_HEIGHT) {
        pirateManager.killPirate(pirate);
        if (player.canBeHit()) {
          player.registerHit();
          Game.loseLife();
        }
      }
    }
  }
};
