import Texture from './Texture.js';

export const spritesData = {};

function loadTransformations(character, transformations) {
	for (let i = 1; i <= transformations; i++) {
		Texture.from(`/assets/sprites/player/${character}_ssj/transfo_${i}.png`);
	}
}

export async function loadSprites() {
	await fetch('/api/sprites')
		.then(response => response.json())
		.then(data => {
			Object.assign(spritesData, data);
		});
	loadTransformations('goku', 10);
	loadTransformations('vegeta', 5);
}
