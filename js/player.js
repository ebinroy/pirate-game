// Player (soldier) singleton: position, movement, animation, firing, hit state.

var Player = {
  x: 0,
  y: 0,
  width: PLAYER_CONFIG.width,
  height: PLAYER_CONFIG.height,
  vx: 0,
  animFrame: 0,
  animTimer: 0,
  fireTimer: 0,
  invulnTimer: 0,
  hitFlashTimer: 0,

  reset: function () {
    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = CANVAS_HEIGHT - GROUND_MARGIN - this.height;
    this.vx = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.fireTimer = 0;
    this.invulnTimer = 0;
    this.hitFlashTimer = 0;
  },

  update: function (dt) {
    this.vx = 0;
    if (Input.isDown('ArrowLeft')) this.vx -= PLAYER_CONFIG.speed;
    if (Input.isDown('ArrowRight')) this.vx += PLAYER_CONFIG.speed;

    this.x += this.vx * dt;
    this.x = Utils.clamp(this.x, 0, CANVAS_WIDTH - this.width);

    if (this.vx !== 0) {
      this.animTimer += dt;
      if (this.animTimer >= PLAYER_CONFIG.animFrameDuration) {
        this.animTimer = 0;
        this.animFrame = 1 - this.animFrame;
      }
    } else {
      this.animFrame = 0;
      this.animTimer = 0;
    }

    if (this.fireTimer > 0) this.fireTimer -= dt;
    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    if (Input.isDown('Space') && this.fireTimer <= 0) {
      this.fireBullet();
      this.fireTimer = PLAYER_CONFIG.fireCooldown;
    }
  },

  fireBullet: function () {
    var bx = this.x + this.width / 2 - BULLET_CONFIG.width / 2;
    var by = this.y - BULLET_CONFIG.height;
    BulletManager.spawn(bx, by);
  },

  canBeHit: function () {
    return this.invulnTimer <= 0;
  },

  registerHit: function () {
    this.invulnTimer = PLAYER_CONFIG.invulnDuration;
    this.hitFlashTimer = PLAYER_CONFIG.invulnDuration;
  },

  draw: function (ctx) {
    // Blink while invulnerable/hit-flashing so the player gets clear feedback.
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer * 10) % 2 === 0) {
      return;
    }
    var frame = Sprites.SOLDIER_FRAMES[this.animFrame];
    Sprites.drawPixelGrid(ctx, frame, this.x, this.y, PIXEL_SIZE, Sprites.SOLDIER_PALETTE);
  }
};
