import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { socketIoLogic } from "./socketIoLogic.js";
import 'dotenv/config';

const SERVER_PORT = process.env?.SERVER_PORT || 3001;

const app = express();
app.use(cors());
const server = createServer(app);

socketIoLogic(server);

server.listen(SERVER_PORT, () => {
  console.log(`SERVER RUNNING ON ${SERVER_PORT}`);
});
