-- finalize_room.lua
-- ARGV:
-- 1 = roomId
-- 2 = nowTs (string, optional)

local roomKey = "room:" .. ARGV[1]
local now = ARGV[2] or tostring(redis.call("TIME")[1] * 1000)
local nowTs = tonumber(now) or (tonumber(redis.call("TIME")[1]) * 1000)

-- Load the room
local room = redis.call("HGETALL", roomKey)
if not room or #room == 0 then
  return cjson.encode({ ok = false, err = "NO_ROOM" })
end

local rmap = {}
for i=1,#room,2 do rmap[room[i]] = room[i+1] end

local participantsCsv = rmap["participants"] or ""
local startedAt = rmap["startedAt"] or ""
local state = rmap["state"] or "unknown"

local parts_meta = {}
local participants_array = {}

for id in string.gmatch(participantsCsv, "([^,]+)") do
  table.insert(participants_array, id)
end

-- Process all participants
for i=1,#participants_array do
  local id = participants_array[i]

  -- Fetch user hash (to return metadata)
  local uh = redis.call("HGETALL", "user:" .. id)
  local umap = {}
  for j=1,#uh,2 do umap[uh[j]] = uh[j+1] end

  local lastSeen = umap["lastSeen"] or ""
  local socketId = umap["socketId"] or ""

  table.insert(parts_meta, {
    userId = id,
    lastSeen = lastSeen,
    socketId = socketId
  })

  -- Do NOT requeue. Mark a neutral post-call state.
  -- Clear with/currentRoom so UI knows they're free, but not searching.
  redis.call("HSET", "user:"..id,
    "status", "notupforsearch",
    "with", "",
    "currentRoom", ""
  )

  -- IMPORTANT: Do NOT re-add to availability pools.
  -- (No SADD available / ZADD available_by_time here)

  -- Optional: keep a small TTL to auto-clean dead sessions
  redis.call("EXPIRE", "user:"..id, 90)
end

-- Build final payload
local result = {
  ok = true,
  roomId = ARGV[1],
  participants = participants_array,
  startedAt = startedAt,
  state = state,
  finalizedAt = now,
  partsMeta = parts_meta
}
local payload = cjson.encode(result)

-- Enqueue to stream for persistence
redis.call("XADD", "stream:ended_rooms", "*", "room", payload)

-- Delete ephemeral room key
redis.call("DEL", roomKey)

-- Publish end event
redis.call("PUBLISH", "pubsub:presence", "ended|" .. ARGV[1])

return payload
