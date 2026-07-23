// HUD + screen overlay manager. All DOM reads/writes live here.

var UI = {
  el: {},
  levelUpHideHandle: null,

  cacheElements: function () {
    this.el.hud = document.getElementById('hud');
    this.el.score = document.getElementById('score-display');
    this.el.level = document.getElementById('level-display');
    this.el.lives = document.getElementById('lives-display');
    this.el.levelUpBanner = document.getElementById('level-up-banner');
    this.el.newLevelNum = document.getElementById('new-level-num');
    this.el.startScreen = document.getElementById('start-screen');
    this.el.gameOverScreen = document.getElementById('game-over-screen');
    this.el.finalScore = document.getElementById('final-score');
    this.el.startButton = document.getElementById('start-button');
    this.el.restartButton = document.getElementById('restart-button');
  },

  updateScore: function (score) {
    this.el.score.textContent = 'Score: ' + score;
  },

  updateLevel: function (level) {
    this.el.level.textContent = 'Level: ' + level;
  },

  updateLives: function (lives) {
    var hearts = '';
    for (var i = 0; i < STARTING_LIVES; i++) {
      hearts += i < lives ? '♥ ' : '♡ ';
    }
    this.el.lives.textContent = 'Lives: ' + hearts.trim();
  },

  showHud: function () {
    this.el.hud.classList.remove('hidden');
  },

  hideHud: function () {
    this.el.hud.classList.add('hidden');
  },

  showStartScreen: function () {
    this.el.startScreen.classList.remove('hidden');
  },

  hideStartScreen: function () {
    this.el.startScreen.classList.add('hidden');
  },

  showGameOver: function (finalScore) {
    this.el.finalScore.textContent = finalScore;
    this.el.gameOverScreen.classList.remove('hidden');
  },

  hideGameOver: function () {
    this.el.gameOverScreen.classList.add('hidden');
  },

  showLevelUpBanner: function (levelNum) {
    this.el.newLevelNum.textContent = levelNum;
    this.el.levelUpBanner.classList.remove('hidden');
  },

  hideLevelUpBanner: function () {
    this.el.levelUpBanner.classList.add('hidden');
  },

  bindButtons: function (onStart, onRestart) {
    this.el.startButton.addEventListener('click', onStart);
    this.el.restartButton.addEventListener('click', onRestart);
  }
};
