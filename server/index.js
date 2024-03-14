import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';

const routesPaths = [
	'/guide',
	'/game',
	'/credits',
];

const app = express();
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };
const port = process.env.PORT || 8000;

addWebpackMiddleware(app);

app.use(express.static('client/public'));

routesPaths.forEach(path => {
	app.get(path, (req, res) => {
		res.sendFile('client/public/index.html', fileOptions);
	});
});

httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
