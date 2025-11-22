// src/redis/scripts.ts
import fs from "fs";
import path from "path";
import { redis } from "./redisClient";

const scriptsDir = path.join(process.cwd(), "redis", "scripts");

export const scripts: { matchSha?: string; finalizeSha?: string } = {};

export async function loadScripts() {
  const matchLua = fs.readFileSync(path.join(scriptsDir, "match_and_claim.lua"), "utf8");
  const finalizeLua = fs.readFileSync(path.join(scriptsDir, "finalize_room.lua"), "utf8");
  scripts.matchSha = String(await redis.script("LOAD", matchLua));
  scripts.finalizeSha = String(await redis.script("LOAD", finalizeLua));
  console.log("Redis scripts loaded", scripts);
}
