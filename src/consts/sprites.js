import * as PIXI from 'pixi.js';

export const SPRITES_PATH = '/assets/sprites/';

export const PLAYER_FALLING = [
	PIXI.Texture.from(SPRITES_PATH + 'player/hit.png'),
	PIXI.Texture.from(SPRITES_PATH + 'player/ko.png'),
];
export const PLAYER_LEFT = PIXI.Texture.from(SPRITES_PATH + 'player/left.png');
export const PLAYER_RIGHT = PIXI.Texture.from(
	SPRITES_PATH + 'player/right.png'
);
export const PLAYER_DOWN = PIXI.Texture.from(SPRITES_PATH + 'player/down.png');
export const PLAYER_UP = PIXI.Texture.from(SPRITES_PATH + 'player/up.png');

export const FREEZER = PIXI.Texture.from(
	SPRITES_PATH + 'ennemy/freezer/freezer.png'
);
export const FREEZER_LEFT = PIXI.Texture.from(
	SPRITES_PATH + 'ennemy/freezer/left.png'
);
export const FREEZER_HIT = PIXI.Texture.from(
	SPRITES_PATH + 'ennemy/freezer/hit.png'
);
export const FREEZER_KO = PIXI.Texture.from(
	SPRITES_PATH + 'ennemy/freezer/ko.png'
);
