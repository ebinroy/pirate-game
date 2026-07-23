// Pirate manager: spawning, movement, death animation (particle burst), reset.

var PirateManager = {
  pirates: [],
  particles: [],
  spawnTimer: 0,

  reset: function () {
    this.pirates = [];
    this.particles = [];
    this.spawnTimer = 0;
  },

  spawnPirate: function (levelConfig) {
    var laneWidth = CANVAS_WIDTH / LANE_COUNT;
    var lane = Utils.randInt(0, LANE_COUNT - 1);
    var x = lane * laneWidth + (laneWidth - PIRATE_CONFIG.width) / 2;

    this.pirates.push({
      x: x,
      y: -PIRATE_CONFIG.height,
      width: PIRATE_CONFIG.width,
      height: PIRATE_CONFIG.height,
      vy: levelConfig.pirateFallSpeed,
      state: 'ALIVE',
      animFrame: 0,
      animTimer: 0,
      deathTimer: 0,
      scoreValue: levelConfig.pirateScoreValue
    });
  },

  killPirate: function (pirate) {
    if (pirate.state !== 'ALIVE') return;
    pirate.state = 'DYING';
    pirate.deathTimer = EXPLOSION_DURATION;
    this.spawnExplosionParticles(pirate.x + pirate.width / 2, pirate.y + pirate.height / 2);
  },

  spawnExplosionParticles: function (cx, cy) {
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var angle = Utils.randRange(0, Math.PI * 2);
      var speed = Utils.randRange(60, 220);
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: EXPLOSION_DURATION,
        maxLife: EXPLOSION_DURATION,
        color: Math.random() < 0.5 ? '#ff8c42' : '#ffe066'
      });
    }
  },

  update: function (dt, levelConfig) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnPirate(levelConfig);
      var jitter = Utils.randRange(-levelConfig.spawnIntervalJitter, levelConfig.spawnIntervalJitter);
      this.spawnTimer = Math.max(0.2, levelConfig.spawnInterval + jitter);
    }

    for (var i = 0; i < this.pirates.length; i++) {
      var p = this.pirates[i];
      if (p.state === 'ALIVE') {
        p.y += p.vy * dt;
        p.animTimer += dt;
        if (p.animTimer >= PIRATE_CONFIG.animFrameDuration) {
          p.animTimer = 0;
          p.animFrame = 1 - p.animFrame;
        }
      } else if (p.state === 'DYING') {
        p.deathTimer -= dt;
        if (p.deathTimer <= 0) p.state = 'DEAD';
      }
    }
    this.pirates = this.pirates.filter(function (p) { return p.state !== 'DEAD'; });

    for (var j = 0; j < this.particles.length; j++) {
      var particle = this.particles[j];
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    }
    this.particles = this.particles.filter(function (particle) { return particle.life > 0; });
  },

  draw: function (ctx) {
    for (var i = 0; i < this.pirates.length; i++) {
      var p = this.pirates[i];
      if (p.state === 'ALIVE') {
        var frame = Sprites.PIRATE_FRAMES[p.animFrame];
        Sprites.drawPixelGrid(ctx, frame, p.x, p.y, PIXEL_SIZE, Sprites.PIRATE_PALETTE);
      } else if (p.state === 'DYING') {
        // Brief bright flash on the first fraction of the death animation.
        if (p.deathTimer > EXPLOSION_DURATION * 0.7) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        }
      }
    }

    for (var j = 0; j < this.particles.length; j++) {
      var particle = this.particles[j];
      var alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      var size = 4 * alpha + 1;
      ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }
};
