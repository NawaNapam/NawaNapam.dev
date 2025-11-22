// src/socket/finalizeHandler.ts
import { Socket } from "socket.io";
import { redis } from "../utils/redis/redisClient";
import { scripts } from "../utils/redis/scripts";

export async function handleEndRoom(socket: Socket, payload: any) {
  const roomId = payload?.roomId;
  if (!roomId) return socket.emit("end:error", "roomId required");

  try {
    // Run the finalize_room.lua script (it XADDs to stream:ended_rooms, deletes the room, publishes event)
    const raw = await redis.evalsha(scripts.finalizeSha!, 0, roomId, String(Date.now()));
    // script returns a JSON string payload (see finalize_room.lua)
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

    if (!parsed || !parsed.ok) {
      // script indicated failure, forward the error to client
      const errMsg = parsed?.err || "no-room";
      return socket.emit("end:error", errMsg);
    }

    // Inform the socket that finalization succeeded and include useful data
    socket.emit("end:ok", {
      roomId: parsed.roomId,
      participants: parsed.participants || [],
      partsMeta: parsed.partsMeta || {},
      startedAt: parsed.startedAt ?? null,
      finalizedAt: parsed.finalizedAt ?? null,
      state: parsed.state ?? null,
    });
  } catch (err: any) {
    console.error("finalize error", err);
    try {
      await redis.lpush(
        "persist:retry",
        JSON.stringify({
          roomId,
          error: String(err?.message ?? err),
          at: Date.now(),
        })
      );
    } catch (pushErr) {
      console.error("failed to push persist:retry", pushErr);
    }

    socket.emit("end:error", String(err?.message ?? err));
  }
}
