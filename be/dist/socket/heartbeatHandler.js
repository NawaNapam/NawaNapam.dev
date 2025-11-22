"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHeartbeat = handleHeartbeat;
const redisClient_1 = require("../utils/redis/redisClient");
function handleHeartbeat(socket, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = socket.data.userId;
        if (!userId)
            return;
        const now = Date.now();
        yield redisClient_1.redis.hset(`user:${userId}`, { lastSeen: String(now), socketId: socket.id });
        //   const lat = payload?.lat;
        //   const lon = payload?.lon;
        //   if (lat && lon) {
        //     await redis.hset(`user:${userId}`, { lat: String(lat), lon: String(lon) });
        //     await redis.geoadd("users:coords", lon, lat, userId);
        //   }
        yield redisClient_1.redis.expire(`user:${userId}`, 30);
        //   await redis.zadd(`available_by_time:${socket.data.region}`, now, userId);
    });
}
