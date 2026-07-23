# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser-based 2D retro arcade shooter ("Soldier vs Pirates"). A soldier at the bottom of the
screen moves left/right and fires bullets upward at pirates descending from the top; 4
score-gated difficulty levels increase pirate speed and spawn rate.

Pure static client-side app, zero build step, zero dependencies. Runs by opening `index.html`
directly in a browser (`file://`) — no dev server, bundler, npm, or package.json exists or is
needed.

## Running / Testing

- Open `index.html` directly (double-click, or `start index.html` on Windows). There is no dev
  server, build command, lint command, or test suite — verification is manual playtesting in the
  browser.
- After editing any `js/*.js` file, sanity-check syntax with `node --check js/<file>.js` before
  reloading the page (fast way to catch typos without a browser).

## Critical constraint: no ES6 modules

All scripts are loaded as plain classic `<script src="...">` tags in `index.html`, never
`import`/`export`. ES6 modules fail under `file://` CORS in Chrome, which would break the
"open directly, no install" requirement. Every file attaches to a global object instead of
exporting (e.g. `Game`, `UI`, `Input`, `PirateManager`, `BulletManager`, `Player`, `Sprites`,
`Collision`, `Utils`). Because of this, **script order in `index.html` matters** — it's the
dependency order:

```
constants.js → utils.js → input.js → sprites.js → player.js → bullet.js → pirate.js
→ collision.js → ui.js → game.js → main.js
```

For the same file:// reason, there is no `fetch()`/JSON loading anywhere — all sprite and
tuning data lives as inline JS literals in `constants.js` / `sprites.js`.

## Architecture

**State machine** (`js/game.js`, states defined in `js/constants.js`): `Game` is the single
orchestrator and source of truth for `score`, `lives`, `levelIndex`, and `state`
(`START_SCREEN → PLAYING ⇄ LEVEL_UP_TRANSITION → GAME_OVER`, restart returns to `PLAYING` via
`Game.startGame()`). `Game.update(dt)` branches on `state` and is the only place that calls into
the entity managers; `Game.render(ctx)` always redraws the whole scene.

**Game loop** (`js/main.js`): single `requestAnimationFrame` loop computing delta-time, clamped
to `0.05`s to avoid a physics spike when a backgrounded tab regains focus. This is the only
`requestAnimationFrame` call in the codebase.

**Entity managers** — each entity type owns a singleton "manager" object holding its own array
and lifecycle logic, rather than a generic ECS:
- `Player` (`js/player.js`) — singleton (only one soldier), reads `Input` directly during its
  own `update(dt)`, including firing (space cooldown lives on `Player.fireTimer`).
- `BulletManager` (`js/bullet.js`) — plain array, filtered each frame for offscreen/inactive.
- `PirateManager` (`js/pirate.js`) — owns both the pirates array and the death-explosion
  particle array. Spawn timing/position (lane-based, `LANE_COUNT` in `constants.js`) and
  fall-speed both come from the current level's entry in `DIFFICULTY_LEVELS`. A pirate's
  lifecycle is `ALIVE → DYING (explosion animation, EXPLOSION_DURATION) → DEAD (removed)`.

**Collision** (`js/collision.js`): plain AABB checks (`Utils.rectsIntersect`) run once per
`PLAYING` tick from `Game.update`, in this order: bullet↔pirate (awards score via
`Game.addScore`), pirate↔soldier, pirate↔bottom-boundary. The latter two call `Player.canBeHit()`
/ `Player.registerHit()` to respect the post-hit invulnerability window
(`PLAYER_CONFIG.invulnDuration`), preventing one overlapping pirate from draining multiple lives
across frames.

**Sprites** (`js/sprites.js`): no image assets. Soldier/pirate frames are hand-authored 2D arrays
of small palette-index integers (`0` = transparent), rendered by the generic
`Sprites.drawPixelGrid(ctx, grid, x, y, pixelSize, palette)`. Pirate death is a separate
procedural effect (white flash + radiating particles), not a sprite frame.

**Difficulty tuning** (`DIFFICULTY_LEVELS` in `js/constants.js`): a 4-entry array (`scoreToAdvance`,
`pirateFallSpeed`, `spawnInterval`, `spawnIntervalJitter`, `pirateScoreValue`). Crossing the
current level's `scoreToAdvance` in `Game.checkLevelThreshold()` bumps `levelIndex` and triggers
`LEVEL_UP_TRANSITION`; only **newly spawned** pirates pick up the new level's stats, so pirates
already in flight don't visibly jump speed mid-fall. Level 4's threshold is `Infinity` (final
level).

**UI** (`js/ui.js`): the only file that touches the DOM. All HUD/score/lives text and the
start/game-over/level-up overlays are plain HTML elements toggled via a `.hidden` CSS class
(`style.css`) — never drawn on the canvas, which is reserved for the game world.

## Explicit non-goals (current version)

- No audio/sound, despite the original feature request mentioning it — an explicit, confirmed
  decision. There's no stub file for it yet; if added later, keep the same non-module,
  self-contained (Web Audio API, no external files) pattern as everything else.
- No build tooling, TypeScript, or external image/font assets.

## Recent Commits

- `ad27628` 2026-07-23 Initial commit: Soldier vs Pirates browser arcade shooter
- `28b1950` 2026-07-23 Add hook to auto-log commits into CLAUDE.md and push to GitHub
