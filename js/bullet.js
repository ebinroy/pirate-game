// Bullet manager: spawn/update/draw/reset for player projectiles.

var BulletManager = {
  bullets: [],

  spawn: function (x, y) {
    this.bullets.push({
      x: x,
      y: y,
      width: BULLET_CONFIG.width,
      height: BULLET_CONFIG.height,
      vy: -PLAYER_CONFIG.bulletSpeed,
      active: true
    });
  },

  update: function (dt) {
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      b.y += b.vy * dt;
      if (b.y + b.height < 0) b.active = false;
    }
    this.bullets = this.bullets.filter(function (b) { return b.active; });
  },

  draw: function (ctx) {
    ctx.fillStyle = '#ffe066';
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }
  },

  reset: function () {
    this.bullets = [];
  }
};
