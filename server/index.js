import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { expressRouting } from "./expressRouting.js";
import { socketIoLogic } from "./socketIoLogic.js";

const app = express();
app.use(cors());
const server = createServer(app);

expressRouting(app);
socketIoLogic(server);

server.listen(3001, () => {
  console.log("SERVER RUNNING ON 3001");
});
