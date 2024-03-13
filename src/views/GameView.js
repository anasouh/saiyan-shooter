import Ennemy from '../models/Ennemy.js';
import Menu from '../components/Menu.js';
import Player, { LIFE } from '../models/Player.js';
import Projectile from '../models/Projectile.js';
import Router from '../Router.js';
import { areColliding, isOutOfScreen, playSound } from '../utils.js';
import View from './View.js';
import * as PIXI from 'pixi.js';
import * as SFX from '../consts/sfx.js';
import LifeBar from '../components/LifeBar.js';
import Item from '../models/Item.js';
import UltBar from '../components/UltBar.js';
import Game from '../models/Game.js';

export default class GameView extends View {
	#app;
	#pauseButton;
	#lifeBar;
	#ultBar;
	#score;
	#pauseMenu;
	#gameOverMenu;
	#currentPlayer;
	game;

	/**
	 * Crée une nouvelle vue de jeu.
	 * @param {Game} game Le modèle de jeu à associer à la vue.
	 * @param {HTMLElement} element La balise HTML à associer à la vue.
	 */
	constructor(game, element) {
		super(element);
		this.game = game;
		this.#app = new PIXI.Application({
			background: '#1099bb',
			resizeTo: window,
		});
		this.game.onAddChild = child => this.#app.stage.addChild(child);
		this.game.onRemoveChild = child => this.#app.stage.removeChild(child);
		this.#app.stage.eventMode = 'auto';
		this.#app.ticker.add(() => this.#tickEvent());
		this.#app.ticker.add(() => this.game.generateEnnemy());
		const ath = element.querySelector('.ath');
		this.#pauseButton = ath.querySelector('button#pauseGame');
		this.#pauseButton.addEventListener('click', () => this.togglePause());
		this.#lifeBar = new LifeBar(ath.querySelector('.bar#life'));
		this.#ultBar = new UltBar(ath.querySelector('.bar#ult'));
		this.#score = ath.querySelector('#scoreVal');
		this.#pauseMenu = new Menu(element.querySelector('.menu#pause'));
		this.#pauseMenu.onResume(() => this.togglePause());
		this.#pauseMenu.onMainMenu(() => this.leave());
		this.#gameOverMenu = new Menu(element.querySelector('.menu#gameOver'));
		this.#gameOverMenu.onMainMenu(() => this.leave());
		this.element.appendChild(this.#app.view);
		this.#app.view.onmousemove = event => this.#handleMouseMove(event);
		this.#init();
	}

	#onLifeChange(life) {
		if (life <= 0) {
			this.#currentPlayer.fallAnimation().then(() => {
				this.#app.ticker.stop();
			});
			this.element.classList.add('gameOver');
		}
	}

	/**
	 * Ajoute le joueur contrôlé à la scène.
	 * @param {Player} player
	 */
	set currentPlayer(player) {
		this.#currentPlayer = player;
		this.game.addPlayer(player);
		this.#lifeBar.player = player;
		this.#ultBar.player = player;
		player.onShoot = projectile => {
			this.game.addProjectile(projectile);
		};
		player.addEventListener('lifeChange', life => this.#onLifeChange(life));
		player.addEventListener('scoreChange', score => {
			this.#score.innerText = score;
		});
		this.#app.view.onmousedown = () => player.reload();
	}

	/**
	 * Définit la fonction à appeler lorsqu'un clic est effectué sur la scène.
	 * @param {function} callback
	 */
	set onClick(callback) {
		this.#app.view.onclick = callback;
	}

	/**
	 * Définit la fonction à appeler lorsqu'un clic droit est effectué sur la scène.
	 * @param {function} callback
	 */
	set onContextMenu(callback) {
		this.#app.view.oncontextmenu = callback;
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
		if (this.paused) return;
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
					this.game.removeProjectile(child);
					return;
				}
				if (child.isMoving.left) {
					child.x -= 5;
				}
				if (child.isMoving.right) {
					child.x += 5;
				}
				if (child.isMoving.up) {
					child.y -= 5;
				}
				if (child.isMoving.down) {
					child.y += 5;
				}
			} else if (child instanceof Ennemy) {
				if (areColliding(child, this.#currentPlayer) && child.isAlive) {
					this.game.removeEnnemy(child);
					this.#currentPlayer.decrementLife();
					playSound(SFX.PUNCH_1);
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
			} else if (child instanceof Item) {
				if (child.isExpired) {
					this.game.removeItem(child);
				}
			}
		});

		this.game.projectiles.forEach(projectile => {
			this.game.ennemies.forEach(ennemy => {
				if (areColliding(projectile, ennemy) && ennemy.isAlive) {
					this.game.removeProjectile(projectile);
					this.game.spawnItem(ennemy.position);
					ennemy.explode();
					this.#currentPlayer.incrementScore();
					this.#currentPlayer.incrementNbKill();
				}
			});
		});

		this.game.items.forEach(item => {
			if (areColliding(item, this.#currentPlayer)) {
				item.use(this.#currentPlayer);
				this.game.removeItem(item);
			}
		});
	}

	#clear() {
		this.#app.ticker.remove(this.#tickEvent);
		this.#app.ticker.remove(this.game.generateEnnemy);
		this.#app.stage.removeChildren();
		this.game.clear();
	}

	/**
	 * Initialise le jeu.
	 */
	#init() {
		this.element.classList.remove('gameOver');
		this.#clear();
		const background = PIXI.Sprite.from('/assets/images/background.jpg');
		background.width = this.#app.screen.width;
		background.height = this.#app.screen.height;
		this.#app.stage.addChild(background);
		if (this.#currentPlayer) {
			this.#app.stage.addChild(this.#currentPlayer);
			this.#currentPlayer.reset();
		}
		if (this.game.secondPlayer)
			this.#app.stage.addChild(this.game.secondPlayer);
	}

	/**
	 * Retourne vrai si le jeu est en pause, faux sinon.
	 * @returns {boolean}
	 * @readonly
	 */
	get paused() {
		return !this.#app.ticker.started;
	}

	shootKeyDown() {
		this.#currentPlayer.reload();
	}

	/**
	 * Met en pause le jeu.
	 */
	pause() {
		this.element.classList.add('paused');
		this.#app.ticker.stop();
		this.#app.stage.interactive = false;
	}

	/**
	 * Reprend le jeu.
	 */
	resume() {
		this.element.classList.remove('paused');
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

	leave() {
		this.#clear();
		this.pause();
		Router.navigate('/');
	}
}
