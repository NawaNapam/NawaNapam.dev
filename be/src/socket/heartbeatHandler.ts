import { Socket } from "socket.io";
import { redis } from "../utils/redis/redisClient";

export async function handleHeartbeat(socket: Socket, payload: any) {
  const userId = socket.data.userId;
  if (!userId) return;

  const now = Date.now();
  await redis.hset(`user:${userId}`, { lastSeen: String(now), socketId: socket.id });

//   const lat = payload?.lat;
//   const lon = payload?.lon;
//   if (lat && lon) {
//     await redis.hset(`user:${userId}`, { lat: String(lat), lon: String(lon) });
//     await redis.geoadd("users:coords", lon, lat, userId);
//   }

  await redis.expire(`user:${userId}`, 30);
//   await redis.zadd(`available_by_time:${socket.data.region}`, now, userId);
}
