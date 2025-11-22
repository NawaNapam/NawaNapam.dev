// test/twoClientsFullFlow.js
const io = require("socket.io-client");
const SIGNALING = process.env.SIGNALING || "http://localhost:8080";
const TIMEOUT = Number(process.env.TEST_TIMEOUT || 10000);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function makeClient(userId, username) {
  const s = io(SIGNALING, { transports: ["websocket"] });
  const state = { userId, username, socketId: null, authed: false, match: null, ended: false };

  s.on("connect", () => {
    state.socketId = s.id;
    console.log(`[connect] ${userId} (${s.id})`);
    s.emit("auth", { userId, username });
  });

  s.on("auth:ok", () => {
    state.authed = true;
    console.log(`[auth:ok] ${userId}`);
  });

  s.on("match:found", (data) => {
    state.match = data; // { peerId, peerUsername?, roomId }
    console.log(`[match:found] ${userId} ->`, data);
  });

  s.on("match:queued", () => console.log(`[match:queued] ${userId}`));
  s.on("match:error", (e) => console.log(`[match:error] ${userId}`, e));
  s.on("end:ok", () => { state.ended = true; console.log(`[end:ok] ${userId}`); });
  s.on("end:error", (e) => console.log(`[end:error] ${userId}`, e));

  s.on("disconnect", (r) => console.log(`[disconnect] ${userId} reason=${r}`));

  return { socket: s, state };
}

function waitFor(predicate, label, timeoutMs = TIMEOUT) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function tick() {
      if (predicate()) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error(`Timeout: ${label}`));
      setTimeout(tick, 25);
    })();
  });
}

(async () => {
  const a = makeClient("U_test_1", "Alice");
  const b = makeClient("U_test_2", "Bob");

  try {
    // 1) both authed
    await waitFor(() => a.state.authed && b.state.authed, "auth both");

    // small settle delay
    await wait(200);

    // 2) request match from both
    console.log("[test] requesting match");
    a.socket.emit("match:request");
    await wait(150);
    b.socket.emit("match:request");

    // 3) wait for both to get match:found
    await waitFor(() => a.state.match && b.state.match, "both matched");

    // sanity checks
    const roomIdA = a.state.match.roomId;
    const roomIdB = b.state.match.roomId;
    const peerA = a.state.match.peerId;
    const peerB = b.state.match.peerId;

    if (!roomIdA || roomIdA !== roomIdB) {
      throw new Error(`RoomId mismatch: A=${roomIdA} B=${roomIdB}`);
    }
    if (peerA !== b.state.userId || peerB !== a.state.userId) {
      throw new Error(`Peer mismatch: A.peer=${peerA} B.peer=${peerB}`);
    }

    console.log(`[test] matched in room ${roomIdA}. Ending room...`);

    // 4) end the room from one side
    a.socket.emit("end:room", { roomId: roomIdA });

    // 5) wait for end:ok from at least one side (the caller)
    await waitFor(() => a.state.ended, "end:ok from A");

    console.log("[test] SUCCESS ✅");
    a.socket.disconnect();
    b.socket.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[test] FAILED ❌", err.message || err);
    try { a.socket.disconnect(); } catch {}
    try { b.socket.disconnect(); } catch {}
    process.exit(1);
  }
})();
