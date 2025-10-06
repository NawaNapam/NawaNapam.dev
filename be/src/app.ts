import express from "express";
import cors from "cors";
import http from "http";
import { SocketService } from "./services/socket.service";
import "dotenv/config";

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT;

export async function initBE() {
  app.use(express.json());
  app.use(cors());

  const socketService = SocketService.getInstance(httpServer);
  socketService.initializeSocket();

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
