export function isOutOfScreen(screen, sprite) {
	const halfWidth = sprite.width / 2;
	const halfHeight = sprite.height / 2;

	return (
		sprite.position.x - halfWidth < 0 ||
		sprite.position.x + halfWidth > screen.width ||
		sprite.position.y - halfHeight < 0 ||
		sprite.position.y + halfHeight > screen.height
	);
}

export function areColliding(object1, object2) {
	const bounds1 = object1.getBounds();
	const bounds2 = object2.getBounds();

	return (
		bounds1.x < bounds2.x + bounds2.width &&
		bounds1.x + bounds1.width > bounds2.x &&
		bounds1.y < bounds2.y + bounds2.height &&
		bounds1.y + bounds1.height > bounds2.y
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

export function formatDuration(duration) {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export async function gameIdExists(id) {
	const response = await fetch(`/api/rooms/exists/${id}`);
	return response.ok;
}
