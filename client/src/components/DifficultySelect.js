export default class DifficultySelect {
	#current;
	element;
	#easy;
	#normal;
	#hard;
	onClick = difficulty => {};

	constructor(element) {
		this.element = element;
		this.#easy = element.querySelector('#easy');
		this.#normal = element.querySelector('#normal');
		this.#hard = element.querySelector('#hard');
		[this.#easy, this.#normal, this.#hard].forEach(button => {
			button.addEventListener('click', event => {
				this.onClick(event.currentTarget.id);
				this.current = event.currentTarget.id;
			});
		});
		this.current = 'easy';
	}

	/**
	 * @param {string} difficulty
	 */
	set current(difficulty) {
		if (this.#current !== difficulty) {
			this.#current = difficulty;
			this.update();
		}
	}

	update() {
		this.#easy.classList.toggle('active', this.#current === 'easy');
		this.#normal.classList.toggle('active', this.#current === 'normal');
		this.#hard.classList.toggle('active', this.#current === 'hard');
	}
}
