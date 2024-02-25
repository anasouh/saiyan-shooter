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
