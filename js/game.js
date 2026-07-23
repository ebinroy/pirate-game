// Core orchestrator: state machine, score/lives/level tracking, ties all managers together.

var Game = {
  state: GameState.START_SCREEN,
  score: 0,
  lives: STARTING_LIVES,
  levelIndex: 0,
  levelUpTimer: 0,

  currentLevelConfig: function () {
    return DIFFICULTY_LEVELS[this.levelIndex];
  },

  changeState: function (newState) {
    if (newState === GameState.LEVEL_UP_TRANSITION) {
      this.levelUpTimer = LEVEL_UP_DURATION;
      UI.showLevelUpBanner(this.levelIndex + 1);
    } else if (newState === GameState.GAME_OVER) {
      UI.hideHud();
      UI.showGameOver(this.score);
    }
    this.state = newState;
  },

  startGame: function () {
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.levelIndex = 0;
    this.levelUpTimer = 0;

    Player.reset();
    BulletManager.reset();
    PirateManager.reset();

    UI.updateScore(this.score);
    UI.updateLevel(this.levelIndex + 1);
    UI.updateLives(this.lives);
    UI.hideStartScreen();
    UI.hideGameOver();
    UI.hideLevelUpBanner();
    UI.showHud();

    this.state = GameState.PLAYING;
  },

  restartGame: function () {
    this.startGame();
  },

  addScore: function (points) {
    this.score += points;
    UI.updateScore(this.score);
    this.checkLevelThreshold();
  },

  checkLevelThreshold: function () {
    var cfg = this.currentLevelConfig();
    if (this.score >= cfg.scoreToAdvance && this.levelIndex < DIFFICULTY_LEVELS.length - 1) {
      this.levelIndex++;
      UI.updateLevel(this.levelIndex + 1);
      this.changeState(GameState.LEVEL_UP_TRANSITION);
    }
  },

  loseLife: function () {
    this.lives--;
    UI.updateLives(this.lives);
    this.checkGameOver();
  },

  checkGameOver: function () {
    if (this.lives <= 0) {
      this.changeState(GameState.GAME_OVER);
    }
  },

  update: function (dt) {
    switch (this.state) {
      case GameState.PLAYING:
        Player.update(dt);
        PirateManager.update(dt, this.currentLevelConfig());
        BulletManager.update(dt);
        Collision.checkBulletPirateCollisions(BulletManager, PirateManager);
        Collision.checkPirateSoldierCollisions(PirateManager, Player);
        Collision.checkPirateBottomBoundary(PirateManager, Player);
        break;

      case GameState.LEVEL_UP_TRANSITION:
        this.levelUpTimer -= dt;
        if (this.levelUpTimer <= 0) {
          UI.hideLevelUpBanner();
          this.state = GameState.PLAYING;
        }
        break;

      case GameState.START_SCREEN:
      case GameState.GAME_OVER:
        break;
    }
  },

  render: function (ctx) {
    ctx.fillStyle = '#0b0f1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#1a2338';
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_MARGIN, CANVAS_WIDTH, GROUND_MARGIN);

    if (this.state === GameState.START_SCREEN) return;

    Player.draw(ctx);
    PirateManager.draw(ctx);
    BulletManager.draw(ctx);
  }
};
