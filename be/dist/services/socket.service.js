"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    constructor(server) {
        this._io = null;
        this._io = new socket_io_1.Server(server);
    }
    // for single ton pattern
    static getInstance(server) {
        if (!SocketService.instance && server) {
            SocketService.instance = new SocketService(server);
        }
        if (!SocketService.instance) {
            throw new Error("SocketService not initialized");
        }
        return SocketService.instance;
    }
    initializeSocket() {
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
exports.SocketService = SocketService;
SocketService.instance = null;
