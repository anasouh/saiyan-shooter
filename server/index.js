import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';
import PlayerData from './models/PlayerData.js';
import Directions from './Directions.js';
import History from './History.js';
import { loadSprites, spritesData } from './sprites.js';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;

const history = new History();
const rooms = new Map();

const routesPaths = ['/guide', '/credits', '/scores'];
const redirectPaths = ['/game'];

await loadSprites();

const app = express();
addWebpackMiddleware(app);
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };
const port = process.env.PORT || 8000;

app.use(express.static('client/public'));

routesPaths.forEach(path => {
	app.get(path, (req, res) => {
		res.sendFile('client/public/index.html', fileOptions);
	});
});

redirectPaths.forEach(path => {
	app.get(path, (req, res) => {
		res.redirect('/');
	});
});

httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

app.get('/api/scores', (req, res) => {
	res.json(history.getScores());
});

app.get('/api/sprites', (req, res) => {
	res.json(spritesData);
});

app.get('/api/rooms/exists/:id', (req, res) => {
	res.sendStatus(rooms.has(req.params.id) ? 200 : 404);
});

const io = new IOServer(httpServer);

function newGame(difficulty) {
	const id = Math.random().toString(36).substring(2, 9);
	const game = new Game(1200, 800);
	game.difficulty = difficulty;
	game.id = id;
	game.onEnd = () => {
		history.add(game);
		game.clear();
	};
	game.onTick = () => {
		io.to(id).emit('game', game);
	};
	game.onSFX = sound => {
		io.to(id).emit('sfx', sound);
	};
	rooms.set(id, game);
	return game;
}

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	let game;
	const player = new PlayerData({
		x: 50,
		y: DEFAULT_HEIGHT / 2,
		characterId: 'goku',
		id: socket.id,
	});

	socket.on('join', gameId => {
		socket.leaveAll();
		if (rooms.has(gameId)) {
			socket.join(gameId);
		}
	});

	socket.on('start', username => {
		if (!game)
			if ([...socket.rooms][0] !== socket.id) {
				game = rooms.get([...socket.rooms][0]);
			} else game = newGame(socket.data.difficulty || 'normal');
		socket.join(game.id);
		player.username = username;
		player.reset();
		player.position = { x: 50, y: game.height / 2 };
		if (game.paused) {
			game.start();
		}
		player.invicible();
		game.addPlayer(player);
	});

	socket.on('keydown', key => {
		const direction = Directions.fromKey(key);
		if (direction) player.moving[direction] = true;
	});

	socket.on('keyup', key => {
		const direction = Directions.fromKey(key);
		if (direction) player.moving[direction] = false;
	});

	socket.on('shoot', type => {
		if (game) game.shoot(player, type === 'ulti');
	});

	socket.on('ulti', () => {
		if (game) game.ulti(player);
	});

	socket.on('character', characterId => {
		player.characterId = characterId;
	});

	socket.on('difficulty', difficulty => {
		socket.data.difficulty = difficulty;
	});

	socket.on('leave', () => {
		if (game) {
			console.log(`${player.username} a quitté la partie`);
			game.removePlayer(player);
			if (game.players.length === 0) {
				game.stop();
				game.clear();
				rooms.delete(game.id);
			}
		}
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		socket.listeners('leave')[0]();
	});
});
