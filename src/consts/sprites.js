import * as PIXI from 'pixi.js';

export const SPRITES_PATH = '/assets/sprites/';

export const PLAYER_FALLING = [
	PIXI.Texture.from(SPRITES_PATH + 'player/hit.png'),
	PIXI.Texture.from(SPRITES_PATH + 'player/ko.png'),
];
