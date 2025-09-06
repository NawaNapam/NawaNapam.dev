import express from "express";
import cors from "cors";
import http from "http";
import { SocketService } from "./services/socket.service";

const app = express();
const httpServer = http.createServer(app);

export async function initServer() {
  app.use(express.json());
  app.use(cors());

  const socketService = new SocketService(httpServer);
  socketService.initializeSocket();

  httpServer.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
  });
}
