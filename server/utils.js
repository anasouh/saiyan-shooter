export function isOutOfScreen(screen, sprite) {
	return (
		sprite.x - sprite.width < 0 ||
		sprite.x + sprite.width > screen.width ||
		sprite.y - sprite.height < 0 ||
		sprite.y + sprite.height > screen.height
	);
}

export function isLeftOfScreen(sprite) {
	return sprite.x + sprite.width < 0;
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
