// src/socket/authHandler.ts
import { Socket } from "socket.io";
import { redis } from "../utils/redis/redisClient";

export async function handleAuth(socket: Socket, payload: any) {
  const { userId, username } = payload || {};
  if (!userId) {
    socket.emit("auth:error", "userId required");
    return;
  }

  socket.data.userId = userId;
  socket.data.username = username ?? "";

  const now = Date.now();

  await redis.hset(`user:${userId}`, {
    status: "available",
    socketId: socket.id,
    lastSeen: String(now),
    username: username ?? "",
  });

  // lobal availability pools
  await redis.sadd("available", userId);
  await redis.zadd("available_by_time", now, userId);

  // presence TTL
  await redis.expire(`user:${userId}`, 30);

  socket.emit("auth:ok");
}
