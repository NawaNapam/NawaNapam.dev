import { Server as SocketIOServer } from "socket.io";
import { Server as httpServer } from "http";

export class SocketService {
  private _io: SocketIOServer | null = null;

  constructor(server: httpServer) {
    this._io = new SocketIOServer(server);
  }

  public initializeSocket(): void {
    const io = this._io;
    if (!io) {
      throw new Error("Socket.io server not initialized");
    }
    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
}
