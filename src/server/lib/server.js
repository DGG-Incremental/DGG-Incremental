import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { buildSyncWss } from "./syncWss";
import { createServer } from "http";
import apiRouter from './routes/router'

const app = express();
const server = createServer(app)
const port = process.env.PORT || 3000;

// DB connection
createConnection();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', apiRouter)

if (process.env.NODE_ENV === "production") {
	// Serve static files from the React app
	app.use(express.static(path.join(__dirname, '../../../dist/client')));
}


buildSyncWss({
	server,
	path: '/wss/sync'	
})

export default server.listen(port, () =>
	console.log(`DGG Clicker API Server listening on port ${port}!`)
);
