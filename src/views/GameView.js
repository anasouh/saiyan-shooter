import Ennemy from '../components/Ennemy.js';
import Menu from '../components/Menu.js';
import Player from '../components/Player.js';
import Projectile from '../components/Projectile.js';
import Router from '../Router.js';
import { areColliding, isOutOfScreen } from './utils.js';
import View from './View.js';
import * as PIXI from 'pixi.js';

export default class GameView extends View {
	#app;
	#currentPlayer;
	#secondPlayer;
	#pauseButton;
	#athScore;
	#athLife;
	#pauseMenu;
	#gameOverMenu;
	#ennemies = [];
	#projectiles = [];

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
		this.#app.stage.eventMode = 'auto';
		window.onresize = () => this.#resize();
		const ath = element.querySelector('.ath');
		this.#pauseButton = ath.querySelector('button#pauseGame');
		this.#pauseButton.addEventListener('click', () => this.togglePause());
		this.#athScore = ath.querySelector('.playerInfos .score');
		this.#athLife = ath.querySelector('.playerInfos .life');
		this.#pauseMenu = new Menu(element.querySelector('.menu#pause'));
		this.#pauseMenu.onResume(() => this.togglePause());
		this.#pauseMenu.onMainMenu(() => Router.navigate('/'));
		this.#gameOverMenu = new Menu(element.querySelector('.menu#gameOver'));
		this.#gameOverMenu.onMainMenu(() => Router.navigate('/'));
		this.element.appendChild(this.#app.view);
		this.#app.view.onmousemove = event => this.#handleMouseMove(event);
		this.#init();
	}

	#addProjectile(projectile) {
		this.#projectiles.push(projectile);
		this.#app.stage.addChild(projectile);
	}

	#removeProjectile(projectile) {
		this.#projectiles = this.#projectiles.filter(p => p !== projectile);
		this.#app.stage.removeChild(projectile);
	}

	#addEnnemy(ennemy) {
		this.#ennemies.push(ennemy);
		this.#app.stage.addChild(ennemy);
	}

	#removeEnnemy(ennemy) {
		this.#ennemies = this.#ennemies.filter(e => e !== ennemy);
		this.#app.stage.removeChild(ennemy);
	}

	#onLifeChange(life) {
		this.#athLife.innerText = `Vies : ${life}`;
		if (life <= 0) {
			this.#app.ticker.stop();
			this.element.classList.add('gameOver');
			this.#gameOverMenu.show();
		}
	}

	#onScoreChange(score) {
		this.#athScore.innerText = `Score : ${score}`;
	}

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		console.log('set currentPlayer');
		if (this.#currentPlayer) this.#app.stage.removeChild(this.#currentPlayer);
		this.#currentPlayer = player;
		this.#currentPlayer.onShoot = projectile => {
			this.#addProjectile(projectile);
		};
		this.#currentPlayer.onScoreChange = score => this.#onScoreChange(score);
		this.#currentPlayer.onLifeChange = life => this.#onLifeChange(life);
		this.#athLife.innerText = `Vies : ${this.#currentPlayer.getLife()}`;
		this.#athScore.innerText = `Score : ${this.#currentPlayer.getScore()}`;
	}

	/**
	 * Ajoute le joueur secondaire à la scène.
	 * @param {Player} player
	 */
	set secondPlayer(player) {
		if (this.#secondPlayer) this.#app.stage.removeChild(this.#secondPlayer);
		this.#secondPlayer = player;
		this.#app.stage.addChild(this.#secondPlayer);
	}

	/**
	 * Définit la fonction à appeler lorsqu'un clic est effectué sur la scène.
	 * @param {function} callback
	 */
	set onClick(callback) {
		this.#app.view.onclick = callback;
	}

	show() {
		super.show();
		if (this.paused) this.resume();
		this.#init();
	}

	hide() {
		super.hide();
		this.pause();
	}

	#resize() {
		this.#app.renderer.resize(window.innerWidth, window.innerHeight);
	}

	#tickEvent() {
		this.#app.stage.children.forEach(child => {
			if (child instanceof Player) {
				if (child.moving.left) {
					this.movePlayer(child, -5, 0);
				}
				if (child.moving.right) {
					this.movePlayer(child, 5, 0);
				}
				if (child.moving.up) {
					this.movePlayer(child, 0, -5);
				}
				if (child.moving.down) {
					this.movePlayer(child, 0, 5);
				}
			} else if (child instanceof Projectile) {
				if (isOutOfScreen(this.#app.screen, child)) {
					this.#app.stage.removeChild(child);
					return;
				}
				if (child.moving.left) {
					child.x -= 5;
				}
				if (child.moving.right) {
					child.x += 5;
				}
				if (child.moving.up) {
					child.y -= 5;
				}
				if (child.moving.down) {
					child.y += 5;
				}
			} else if (child instanceof Ennemy) {
				if (areColliding(child, this.#currentPlayer)) {
					this.#removeEnnemy(child);
					this.#currentPlayer.decrementLife();
				}
				if (child.moving.left) {
					child.x -= 5;
				}
				if (child.moving.right) {
					child.x += 5;
				}
				if (child.moving.up) {
					child.y -= 5;
				}
				if (child.moving.down) {
					child.y += 5;
				}
			}
		});

		this.#projectiles.forEach(projectile => {
			this.#ennemies.forEach(ennemy => {
				if (areColliding(projectile, ennemy)) {
					this.#removeProjectile(projectile);
					this.#removeEnnemy(ennemy);
					this.#currentPlayer.incrementScore();
				}
			});
		});
	}

	/**
	 * Initialise le jeu.
	 */
	#init() {
		this.element.classList.remove('gameOver');
		this.#app.stage.removeChildren();
		const background = PIXI.Sprite.from('/images/background.jpg');
		background.width = this.#app.screen.width;
		background.height = this.#app.screen.height;
		this.#app.stage.addChild(background);
		if (this.#currentPlayer) this.#app.stage.addChild(this.#currentPlayer);
		if (this.#secondPlayer) this.#app.stage.addChild(this.#secondPlayer);

		this.#app.ticker.add(() => this.#tickEvent());
		this.#app.ticker.add(() => this.#generateEnnemy());
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
		this.#pauseMenu.show();
		this.#app.ticker.stop();
		this.#app.stage.interactive = false;
	}

	/**
	 * Reprend le jeu.
	 */
	resume() {
		this.element.classList.remove('paused');
		this.#pauseMenu.hide();
		this.#app.ticker.start();
		this.#app.stage.interactive = true;
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

	#handleMouseMove(event) {
		const { clientX, clientY } = event;
		this.#currentPlayer.x = clientX;
		this.#currentPlayer.y = clientY;
	}

	#generateEnnemy() {
		if (this.paused) return;
		const random = Math.random();
		if (random < 0.01) {
			const ennemy = new Ennemy();
			ennemy.position.set(
				this.#app.screen.width,
				Math.random() * this.#app.screen.height
			);
			this.#addEnnemy(ennemy);
			ennemy.move('left');
		}
	}
}
