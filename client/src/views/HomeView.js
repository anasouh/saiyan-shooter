import Router from '../Router.js';
import DifficultySelect from '../components/DifficultySelect.js';
import View from './View.js';

export default class HomeView extends View {
	#startGameButton;
	#usernameField;
	username;
	#characterButtons;
	#activeCharacter;
	#difficultySelect;
	#gameIdField;
	onCharacterChange = characterId => {};
	onStartPressed = () => {};
	isConfirmed = false;

	constructor(element) {
		super(element);
		this.#startGameButton = element.querySelector('button#startGame');
		this.#startGameButton.addEventListener('click', event =>
			this.#handleStartGame(event)
		);
		this.#usernameField = element.querySelector('input[name="username"]');
		this.#usernameField.value = localStorage.getItem('username') || '';
		this.#usernameField.addEventListener('change', event => {
			this.username = event.currentTarget.value;
			localStorage.setItem('username', this.username);
		});
		this.username = this.#usernameField.value;
		this.#characterButtons = element.querySelectorAll(
			'.characterChoice button'
		);
		this.#activeCharacter = element.querySelector(
			'.characterChoice button.active'
		);
		this.#characterButtons.forEach(button => {
			button.innerHTML = `<img src="/assets/sprites/player/${button.id}/player.png" height="70">`;
			button.addEventListener('click', event => {
				this.#activeCharacter.classList.remove('active');
				this.#activeCharacter = event.currentTarget;
				this.#activeCharacter.classList.add('active');
				this.onCharacterChange(this.characterId);
			});
		});
		this.#difficultySelect = new DifficultySelect(
			element.querySelector('.difficulty')
		);
		this.#gameIdField = element.querySelector('input#gameIdField');
	}

	/**
	 * @param {string} difficulty
	 */
	set difficulty(difficulty) {
		this.#difficultySelect.current = difficulty;
	}

	get difficulty() {
		return this.#difficultySelect.current;
	}

	get gameId() {
		return this.#gameIdField.value;
	}

	/**
	 * @param {Function} callback
	 */
	set onDifficultyClick(callback) {
		this.#difficultySelect.onClick = callback;
	}

	get characterId() {
		return this.#activeCharacter.getAttribute('id');
	}

	#handleStartGame(event) {
		event.preventDefault();
		if (this.#usernameField.value.length === 0) {
			this.#usernameField.classList.add('error');
			return;
		}
		this.#usernameField.classList.remove('error');
		this.onStartPressed();
		Router.navigate('/game');
	}
}
