import { Server as SocketIOServer } from "socket.io";
import { Server as httpServer } from "http";

export class SocketService {
  private static instance: SocketService | null = null;
  private _io: SocketIOServer | null = null;

  private constructor(server: httpServer) {
    this._io = new SocketIOServer(server);
  }

  // for single ton pattern
  public static getInstance(server?: httpServer): SocketService {
    if (!SocketService.instance && server) {
      SocketService.instance = new SocketService(server);
    }
    if (!SocketService.instance) {
      throw new Error("SocketService not initialized");
    }
    return SocketService.instance;
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
