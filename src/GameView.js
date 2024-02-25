import Player from './Player.js';
import Router from './Router.js';
import View from './View.js';
import * as PIXI from 'pixi.js';

export default class GameView extends View {
	#app;
	#pauseButton;
	#menuButton;
	#players = [];

	/**
	 * Crée une nouvelle vue de jeu.
	 * @param {HTMLElement} element La balise HTML à associer à la vue.
	 */
	constructor(element) {
		super(element);
		this.#app = new PIXI.Application({
			background: '#1099bb',
			resizeTo: window,
		});
		this.#pauseButton = element.querySelector('button#pauseGame');
		this.#pauseButton.addEventListener('click', () => this.togglePause());
		this.#menuButton = element.querySelector('button#mainMenu');
		this.#menuButton.addEventListener('click', () => Router.navigate('/'));
		this.element.appendChild(this.#app.view);
		this.#init();
	}

	show() {
		super.show();
		if (this.paused) this.resume();
	}

	hide() {
		super.hide();
		this.pause();
	}

	#randomSprite() {
		const sprites = [
			'https://risibank.fr/cache/medias/0/22/2266/226637/thumb.png',
			'https://risibank.fr/cache/medias/0/13/1366/136617/thumb.png',
			'https://risibank.fr/cache/medias/0/13/1366/136618/thumb.png',
			'https://risibank.fr/cache/medias/0/13/1366/136620/thumb.png',
		];
		return sprites[Math.floor(Math.random() * sprites.length)];
	}

	/**
	 * Initialise le jeu.
	 */
	#init() {
		// holder to store the aliens
		this.#app.stage.removeChildren();
		const aliens = [];

		const totalDudes = 50;

		for (let i = 0; i < totalDudes; i++) {
			// create a new Sprite that uses the image name that we just generated as its source
			const dude = PIXI.Sprite.from(this.#randomSprite());

			// set the anchor point so the texture is centered on the sprite
			dude.anchor.set(0.5);

			// set a random scale for the dude - no point them all being the same size!
			dude.scale.set(0.8 + Math.random() * 0.3);

			// finally lets set the dude to be at a random position..
			dude.x = Math.random() * this.#app.screen.width;
			dude.y = Math.random() * this.#app.screen.height;

			dude.tint = Math.random() * 0xffffff;

			// create some extra properties that will control movement :
			// create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
			dude.direction = Math.random() * Math.PI * 2;

			// this number will be used to modify the direction of the dude over time
			dude.turningSpeed = Math.random() - 0.8;

			// create a random speed for the dude between 2 - 4
			dude.speed = 2 + Math.random() * 2;

			// finally we push the dude into the aliens array so it it can be easily accessed later
			aliens.push(dude);

			this.#app.stage.addChild(dude);
		}

		// create a bounding box for the little dudes
		const dudeBoundsPadding = 100;
		const dudeBounds = new PIXI.Rectangle(
			-dudeBoundsPadding,
			-dudeBoundsPadding,
			this.#app.screen.width + dudeBoundsPadding * 2,
			this.#app.screen.height + dudeBoundsPadding * 2
		);

		this.#app.ticker.add(() => {
			// iterate through the dudes and update their position
			for (let i = 0; i < aliens.length; i++) {
				const dude = aliens[i];

				dude.direction += dude.turningSpeed * 0.01;
				dude.x += Math.sin(dude.direction) * dude.speed;
				dude.y += Math.cos(dude.direction) * dude.speed;
				dude.rotation = -dude.direction - Math.PI / 2;

				// wrap the dudes by testing their bounds...
				if (dude.x < dudeBounds.x) {
					dude.x += dudeBounds.width;
				} else if (dude.x > dudeBounds.x + dudeBounds.width) {
					dude.x -= dudeBounds.width;
				}

				if (dude.y < dudeBounds.y) {
					dude.y += dudeBounds.height;
				} else if (dude.y > dudeBounds.y + dudeBounds.height) {
					dude.y -= dudeBounds.height;
				}
			}

			this.#players.forEach(player => {
				if (player.keyPressed.ArrowLeft) {
					this.movePlayer(player, -5, 0);
				}
				if (player.keyPressed.ArrowRight) {
					this.movePlayer(player, 5, 0);
				}
				if (player.keyPressed.ArrowUp) {
					this.movePlayer(player, 0, -5);
				}
				if (player.keyPressed.ArrowDown) {
					this.movePlayer(player, 0, 5);
				}
			});
		});
	}

	/**
	 * Retourne vrai si le jeu est en pause, faux sinon.
	 * @returns {boolean}
	 * @readonly
	 */
	get paused() {
		return !this.#app.ticker.started;
	}

	/**
	 * Met en pause le jeu.
	 */
	pause() {
		this.element.classList.add('paused');
		this.#app.ticker.stop();
	}

	/**
	 * Reprend le jeu.
	 */
	resume() {
		this.element.classList.remove('paused');
		this.#app.ticker.start();
	}

	/**
	 * Met en pause ou reprend le jeu, selon l'état actuel du jeu.
	 */
	togglePause() {
		if (this.#app.ticker.started) {
			this.pause();
			this.#pauseButton.innerText = 'Reprendre';
		} else {
			this.resume();
			this.#pauseButton.innerText = 'Pause';
		}
	}

	/**
	 * Ajoute un joueur à la scène.
	 * @param {Player} player
	 */
	addPlayer(player) {
		this.#players.push(player);
		player.anchor.set(0.5);
		player.x = this.#app.screen.width / 2;
		player.y = this.#app.screen.height / 2;
		player.scale.set(0.5);
		this.#app.stage.addChild(player);
	}

	/**
	 * Supprime un joueur de la scène.
	 * @param {Player} player
	 */
	removePlayer(player) {
		this.#players = this.#players.filter(p => p !== player);
		this.#app.stage.removeChild(player);
	}

	/**
	 * Déplace le joueur dans la scène, en vérifiant que le joueur ne
	 * dépasse pas les bords de la scène.
	 * @param {Player} player
	 * @param {number} x
	 * @param {number} y
	 */
	movePlayer(player, x, y) {
		const playerHalfWidth = player.width / 2;
		const playerHalfHeight = player.height / 2;

		let newX = player.position.x + x;
		let newY = player.position.y + y;

		if (
			newX - playerHalfWidth > 0 &&
			newX + playerHalfWidth < this.#app.screen.width
		) {
			player.position.x = newX;
		} else {
			if (newX - playerHalfWidth <= 0) {
				player.position.x = playerHalfWidth;
			} else {
				player.position.x = this.#app.screen.width - playerHalfWidth;
			}
		}

		if (
			newY - playerHalfHeight > 0 &&
			newY + playerHalfHeight < this.#app.screen.height
		) {
			player.position.y = newY;
		} else {
			if (newY - playerHalfHeight <= 0) {
				player.position.y = playerHalfHeight;
			} else {
				player.position.y = this.#app.screen.height - playerHalfHeight;
			}
		}
	}
}
