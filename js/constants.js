// Global configuration namespace. Data only, no logic.

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var GROUND_MARGIN = 20;
var PIXEL_SIZE = 3;
var LANE_COUNT = 6;

var GameState = {
  START_SCREEN: 'START_SCREEN',
  PLAYING: 'PLAYING',
  LEVEL_UP_TRANSITION: 'LEVEL_UP_TRANSITION',
  GAME_OVER: 'GAME_OVER'
};

var STARTING_LIVES = 3;

var PLAYER_CONFIG = {
  width: 36,
  height: 48,
  speed: 220,
  fireCooldown: 0.25,
  bulletSpeed: 480,
  invulnDuration: 0.8,
  animFrameDuration: 0.15
};

var BULLET_CONFIG = {
  width: 4,
  height: 12
};

var PIRATE_CONFIG = {
  width: 36,
  height: 48,
  animFrameDuration: 0.2
};

var EXPLOSION_DURATION = 0.4;
var PARTICLE_COUNT = 12;
var LEVEL_UP_DURATION = 1.5;

// Score to advance = the score you need to reach to move OUT of that level.
// Level 4 has no further threshold (Infinity = final level).
var DIFFICULTY_LEVELS = [
  { level: 1, scoreToAdvance: 1000, pirateFallSpeed: 70, spawnInterval: 1.40, spawnIntervalJitter: 0.30, pirateScoreValue: 100 },
  { level: 2, scoreToAdvance: 3000, pirateFallSpeed: 100, spawnInterval: 1.10, spawnIntervalJitter: 0.30, pirateScoreValue: 120 },
  { level: 3, scoreToAdvance: 6000, pirateFallSpeed: 135, spawnInterval: 0.85, spawnIntervalJitter: 0.25, pirateScoreValue: 150 },
  { level: 4, scoreToAdvance: Infinity, pirateFallSpeed: 175, spawnInterval: 0.65, spawnIntervalJitter: 0.20, pirateScoreValue: 200 }
];
