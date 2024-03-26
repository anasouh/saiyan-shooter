export function isOutOfScreen(screen, sprite) {
	const halfWidth = sprite.width / 2;
	const halfHeight = sprite.height / 2;

	return (
		sprite.x - halfWidth < 0 ||
		sprite.x + halfWidth > screen.width ||
		sprite.y - halfHeight < 0 ||
		sprite.y + halfHeight > screen.height
	);
}

export function areColliding(object1, object2) {
	return (
		object1.x < object2.x + object2.width &&
		object1.x + object1.width > object2.x &&
		object1.y < object2.y + object2.height &&
		object1.y + object1.height > object2.y
	);
}

export function playSound(sound, volume = 0.1) {
	const audio = new Audio(sound);
	audio.volume = volume;
	audio.play();
	return audio;
}

export const getFPS = () =>
	new Promise(resolve =>
		requestAnimationFrame(t1 =>
			requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
		)
	);
