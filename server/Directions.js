export default class Directions {
	static fromKey(key) {
		switch (key) {
			case 'ARROWUP':
			case 'Z':
				return 'up';
			case 'ARROWDOWN':
			case 'S':
				return 'down';
			case 'ARROWLEFT':
			case 'Q':
				return 'left';
			case 'ARROWRIGHT':
			case 'D':
				return 'right';
		}
	}
}
