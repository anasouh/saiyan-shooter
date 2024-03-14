import express from 'express';
import http from 'http';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';

const app = express();
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };

addWebpackMiddleware(app);

app.use(express.static('client/public'));

httpServer.listen(process.env.PORT, () => {
	console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
