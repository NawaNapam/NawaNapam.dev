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
exports.scripts = void 0;
exports.loadScripts = loadScripts;
// src/redis/scripts.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const redisClient_1 = require("./redisClient");
const scriptsDir = path_1.default.join(process.cwd(), "redis", "scripts");
exports.scripts = {};
function loadScripts() {
    return __awaiter(this, void 0, void 0, function* () {
        const matchLua = fs_1.default.readFileSync(path_1.default.join(scriptsDir, "match_and_claim.lua"), "utf8");
        const finalizeLua = fs_1.default.readFileSync(path_1.default.join(scriptsDir, "finalize_room.lua"), "utf8");
        exports.scripts.matchSha = String(yield redisClient_1.redis.script("LOAD", matchLua));
        exports.scripts.finalizeSha = String(yield redisClient_1.redis.script("LOAD", finalizeLua));
        console.log("Redis scripts loaded", exports.scripts);
    });
}
