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
exports.registerConnectionHandlers = registerConnectionHandlers;
const redisClient_1 = require("../utils/redis/redisClient");
const matchHandler_1 = require("./matchHandler");
const finalizeHandler_1 = require("./finalizeHandler");
const authHandler_1 = require("./authHandler");
const heartbeatHandler_1 = require("./heartbeatHandler");
function registerConnectionHandlers(io) {
    io.on("connection", (socket) => {
        console.log("socket connected", socket.id);
        socket.on("auth", (payload) => (0, authHandler_1.handleAuth)(socket, payload));
        socket.on("heartbeat", (payload) => (0, heartbeatHandler_1.handleHeartbeat)(socket, payload));
        socket.on("match:request", () => (0, matchHandler_1.handleMatchRequest)(socket));
        socket.on("end:room", (payload) => (0, finalizeHandler_1.handleEndRoom)(socket, payload));
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            const userId = socket.data.userId;
            if (!userId)
                return;
            yield redisClient_1.redis.hset(`user:${userId}`, "status", "offline");
        }));
    });
    redisClient_1.sub.subscribe("pubsub:presence");
    redisClient_1.sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
        if (channel !== "pubsub:presence")
            return;
        // message format: "matched|roomId|u1|u2" or "ended|roomId"
        const parts = String(message).split("|");
        if (parts[0] === "matched") {
            const [, roomId, u1, u2] = parts;
            try {
                // load user hashes from Redis to get socketId and username
                const u1Hash = yield redisClient_1.redis.hgetall(`user:${u1}`);
                const u2Hash = yield redisClient_1.redis.hgetall(`user:${u2}`);
                const u1Name = u1Hash.username || u1Hash.name || u1;
                const u2Name = u2Hash.username || u2Hash.name || u2;
                // if the user is connected to THIS signaling instance, we can emit directly
                if (u1Hash.socketId)
                    io.to(u1Hash.socketId).emit("match:found", { peerId: u2, peerUsername: u2Name, roomId });
                if (u2Hash.socketId)
                    io.to(u2Hash.socketId).emit("match:found", { peerId: u1, peerUsername: u1Name, roomId });
            }
            catch (err) {
                console.error("pubsub matched handler error", err, { roomId, u1, u2 });
            }
        }
        else if (parts[0] === "ended") {
            const [, roomId] = parts;
            // optional: notify participants about room end if you want
            console.log("Room ended published:", roomId);
        }
    }));
}
