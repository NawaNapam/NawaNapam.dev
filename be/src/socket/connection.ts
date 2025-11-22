// src/socket/connection.ts
import { Socket, Server } from "socket.io";
import { sub, redis } from "../utils/redis/redisClient";
import { handleMatchRequest } from "./matchHandler";
import { handleEndRoom } from "./finalizeHandler";
import { handleAuth } from "./authHandler";
import { handleHeartbeat } from "./heartbeatHandler";

export function registerConnectionHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("socket connected", socket.id);

    socket.on("auth", (payload) => handleAuth(socket, payload));
    socket.on("heartbeat", (payload) => handleHeartbeat(socket, payload));
    socket.on("match:request", () => handleMatchRequest(socket));
    socket.on("end:room", (payload) => handleEndRoom(socket, payload));

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (!userId) return;
      await redis.hset(`user:${userId}`, "status", "offline");
    });
  });

  sub.subscribe("pubsub:presence");
  sub.on("message", async (channel, message) => {
  if (channel !== "pubsub:presence") return;

  // message format: "matched|roomId|u1|u2" or "ended|roomId"
  const parts = String(message).split("|");

  if (parts[0] === "matched") {
    const [, roomId, u1, u2] = parts;

    try {
      // load user hashes from Redis to get socketId and username
      const u1Hash = await redis.hgetall(`user:${u1}`);
      const u2Hash = await redis.hgetall(`user:${u2}`);

      const u1Name = u1Hash.username || u1Hash.name || u1;
      const u2Name = u2Hash.username || u2Hash.name || u2;

      // if the user is connected to THIS signaling instance, we can emit directly
      if (u1Hash.socketId) io.to(u1Hash.socketId).emit("match:found", { peerId: u2, peerUsername: u2Name, roomId });
      if (u2Hash.socketId) io.to(u2Hash.socketId).emit("match:found", { peerId: u1, peerUsername: u1Name, roomId });

    } catch (err) {
      console.error("pubsub matched handler error", err, { roomId, u1, u2 });
    }

  } else if (parts[0] === "ended") {
    const [, roomId] = parts;
    // optional: notify participants about room end if you want
    console.log("Room ended published:", roomId);
  }

});
}
