import * as PIXI from 'pixi.js';

export const SPRITES_PATH = '/assets/sprites/';


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

export const SENZU_BEAN = PIXI.Texture.from(SPRITES_PATH + 'items/senzu.png');
