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
exports.handleMatchRequest = handleMatchRequest;
const redisClient_1 = require("../utils/redis/redisClient");
const scripts_1 = require("../utils/redis/scripts");
const STALE_MS = Number(process.env.STALE_MS || 30000);
function handleMatchRequest(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = socket.data.userId;
        if (!userId)
            return socket.emit("match:error", "not-authenticated");
        const roomId = `r:${userId}:${Date.now()}`;
        const now = Date.now();
        try {
            // Optional: if user is already matched/in-room, ignore
            const u = yield redisClient_1.redis.hgetall(`user:${userId}`);
            if (u && (u.status === "matched" || (u.currentRoom && u.currentRoom !== ""))) {
                return socket.emit("match:error", "already-in-room");
            }
            // ensure requester is in global pools (defensive)
            yield redisClient_1.redis.sadd("available", userId);
            yield redisClient_1.redis.zadd("available_by_time", now, userId);
            // ARGV: requesterId, nowTs(ms), staleMs, roomId
            const raw = yield redisClient_1.redis.evalsha(scripts_1.scripts.matchSha, 0, userId, String(now), String(STALE_MS), roomId);
            // ---- normalize response ----
            let parsed = null;
            if (typeof raw === "string") {
                // Try JSON first
                if (raw.startsWith("{")) {
                    try {
                        parsed = JSON.parse(raw);
                    }
                    catch ( /* fallthrough */_a) { /* fallthrough */ }
                }
            }
            else if (raw && typeof raw === "object") {
                parsed = raw; // some redis clients return tables/objects
            }
            if (parsed) {
                if (parsed.ok) {
                    const peerId = parsed.candidate;
                    const rid = parsed.roomId || roomId;
                    return socket.emit("match:found", { peerId, roomId: rid });
                }
                // Non-fatal: keep searching
                const errCode = String(parsed.err || "").toUpperCase();
                if (errCode === "NO_PEER" || errCode === "STALE_PEER" || errCode === "NOT_AVAILABLE") {
                    return socket.emit("match:queued");
                }
                // Anything else -> hard error
                return socket.emit("match:error", errCode || "match_failed");
            }
            // Legacy fallback: treat raw string as peerId ONLY if it looks like an ID (not JSON)
            if (typeof raw === "string" && raw && raw[0] !== "{" && /^[A-Za-z0-9:_-]{3,128}$/.test(raw)) {
                return socket.emit("match:found", { peerId: raw, roomId });
            }
            // Default graceful path: queue
            return socket.emit("match:queued");
        }
        catch (e) {
            const msg = String((e === null || e === void 0 ? void 0 : e.message) || e);
            // Common pattern: treat NO_PEER as queued
            if (msg.includes("NO_PEER")) {
                return socket.emit("match:queued");
            }
            console.error("[match] error", e);
            return socket.emit("match:error", msg);
        }
    });
}
