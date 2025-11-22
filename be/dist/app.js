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
exports.initBE = initBE;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const socket_io_1 = require("socket.io");
const scripts_1 = require("./utils/redis/scripts");
const connection_1 = require("./socket/connection");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const PORT = process.env.PORT;
function initBE() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        const io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
        function start() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, scripts_1.loadScripts)();
                (0, connection_1.registerConnectionHandlers)(io);
                httpServer.listen(PORT, () => console.log("signaling server running on", PORT));
            });
        }
        start().catch((e) => {
            console.error("Failed to start signaling server:", e);
            process.exit(1);
        });
    });
}
