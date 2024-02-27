import * as PIXI from 'pixi.js';

const PATH = '/assets/sprites/';

export const PLAYER_FALLING = Array.from({ length: 5 }, (_, i) =>
	PIXI.Texture.from(PATH + `player/player_falling_${i + 1}.png`)
);
