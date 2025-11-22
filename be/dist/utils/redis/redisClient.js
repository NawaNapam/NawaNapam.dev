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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sub = exports.redis = void 0;
exports.safeEvalSha = safeEvalSha;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    tls: {},
});
exports.sub = new ioredis_1.default({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    tls: {},
});
// small wrapper for safe EVALSHA execution
function safeEvalSha(sha, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield exports.redis.evalsha(sha, 0, ...args);
        }
        catch (err) {
            console.error("[safeEvalSha] Redis error:", err);
            throw err;
        }
    });
}
