Here are all 13 phases as standalone prompts. Paste them one at a time, in order, and let each one finish (and pass its build/test gate) before pasting the next.

**Phase 1 — Project Foundation**
```
Set up the "Write Me Live" project foundation.

Create a Next.js 16 TypeScript project using the App Router, with Tailwind CSS and ESLint configured. Build a minimal homepage at app/page.tsx with:
- Project name "Write Me Live"
- One-line description: "Write together. Instantly."
- A "Create Room" button (no functionality yet, just the UI)
- Text: "No account needed."

No navbar, no footer, no marketing sections. Keep it extremely simple — centered, minimal, neutral styling.

Verify `npm run build` passes with no errors before finishing. Report the files created.
```

**Phase 2 — Liveblocks Foundation**
```
Add Liveblocks and Tiptap dependencies to the project:
@liveblocks/client, @liveblocks/react, @liveblocks/react-ui, @liveblocks/react-tiptap,
@liveblocks/node, @tiptap/react, @tiptap/starter-kit, nanoid

Use current mutually compatible versions.

Create:
- liveblocks.config.ts (client-side Liveblocks config)
- lib/liveblocks-server.ts (server-side Liveblocks client using LIVEBLOCKS_SECRET_KEY)
- .env.example containing LIVEBLOCKS_SECRET_KEY=

Verify the server-side Liveblocks client initializes without errors. Do not build the editor yet. Confirm .env.local is gitignored.
```

**Phase 3 — Anonymous Identity**
```
Implement anonymous browser identity for "Write Me Live".

Create lib/anonymous-user.ts that:
- Checks for a site-wide httpOnly cookie (e.g. wml_anon_id)
- If missing, generates one with nanoid() and sets it as httpOnly, secure, sameSite=lax, path=/
- If present, reuses it
- Provides a helper to read this ID in server route handlers

Requirements:
- The same browser must retain the same anonymous ID across refreshes
- Must not regenerate a new ID on every render or request
- No signing/JWT needed — this is not for security-critical auth, just occupancy tracking
- Must be usable from Next.js 16 API routes (note: middleware is now proxy.ts in Next 16, not middleware.ts — use the current pattern)

Test that refreshing the page in the same browser keeps the same ID, and a different browser gets a different ID.
```

**Phase 4 — Room Creation**
```
Implement room creation for "Write Me Live".

Create lib/room-id.ts:
- generateRoomId(): returns a URL-safe nanoid, minimum 12 characters
- isValidRoomId(id): validates against allowed characters (A-Z a-z 0-9 - _), min length 10, max length 64 — this must be the single source of truth for room ID validation used everywhere else in the app

Create app/api/rooms/route.ts (POST):
1. Generate a secure room ID (never trust a client-supplied ID here)
2. Call liveblocks.createRoom(roomId, { defaultAccesses: [] }) using the server client from Phase 2
3. Return { roomId } as JSON

Wire up the homepage's "Create Room" button to:
1. POST to /api/rooms
2. router.push(`/room/${roomId}`)

The /room/[roomId] page can just render a placeholder for now ("Room: {roomId}"). Verify the full flow: click Create Room → redirected to a real room URL with a real Liveblocks room created.
```

**Phase 5 — Room Authentication**
```
Implement Liveblocks authentication for "Write Me Live".

Create app/api/liveblocks-auth/route.ts (POST) that:
1. Reads/creates the anonymous ID from the cookie (lib/anonymous-user.ts)
2. Validates the requested roomId format using lib/room-id.ts — reject malformed IDs immediately with a clear error
3. Checks the room exists via liveblocks.getRoom(roomId) — if not found, return a clear ROOM_NOT_FOUND response
4. Authorizes the session: liveblocks.prepareSession(anonId) → allow(roomId, session.FULL_ACCESS) → authorize(), and return that result

Do NOT implement the two-user cap yet — just get authentication working for any number of users first.

Confirm LIVEBLOCKS_SECRET_KEY never appears in any client-side code or network response body sent to the browser. Test that a valid room + valid cookie returns a working Liveblocks auth token.
```

**Phase 6 — Collaborative Editor**
```
Build the core collaborative editor for "Write Me Live".

In app/room/[roomId]/:
- room-client.tsx ("use client"): wraps children in Liveblocks' RoomProvider, pointing at /api/liveblocks-auth, using the roomId from the URL
- editor.tsx ("use client"): a Tiptap editor using @liveblocks/react-tiptap's official collaborative extension bound to Yjs, configured with StarterKit but with headings, bold, italic, and other rich-text marks disabled at the extension level (not just hidden via CSS)

Visual requirements:
- No toolbar, no formatting buttons, no slash commands
- Looks like one large plain text box: centered, max-width ~900px, padding, subtle border, rounded corners, comfortable line height
- Placeholder text "Start writing..." when empty

Do NOT use useState to mirror document content, and do NOT write any useEffect that sets editor content from local state — let the Liveblocks/Tiptap collaboration provider own the document entirely.

Test: open the same room URL in two separate browser windows. Typing in one must appear in the other without refreshing.
```

**Phase 7 — Simultaneous Editing (heaviest testing phase)**
```
Harden and verify simultaneous editing for "Write Me Live" using the editor built in Phase 6.

Do not add new features in this phase — focus entirely on correctness. Test and fix any issues with two browser windows on the same room:

1. Type at the beginning of the doc in window A while typing at the end in window B simultaneously — verify no text is lost or duplicated
2. Type quickly (a full paragraph) in one window — verify no dropped or reordered characters in the other
3. Select and delete a chunk of text in A — verify B reflects the same deletion
4. Paste a paragraph of plain text in A — verify it appears correctly, with no rich formatting leaking in, in B
5. Test undo/redo in one window while the other window is also editing — verify no corruption
6. Refresh window A mid-session — verify content is preserved and A reconverges with B

Fix any synchronization bugs found. Do not proceed to Phase 8 until all of the above pass cleanly.
```

**Phase 8 — Presence**
```
Add presence indicators to "Write Me Live".

Create components/connection-status.tsx and app/room/[roomId]/presence.tsx:
- Use Liveblocks' useOthers()/useSelf() hooks for a live count — never hardcode or fake this
- Display "{count} / 2 connected" in the room page
- Display connection status derived directly from Liveblocks' connection state:
  - connecting → "● Connecting…"
  - connected → "● Connected" (green)
  - reconnecting → "● Reconnecting…" (amber)
  - disconnected/error → "● Connection lost" (red) — do NOT clear local editor content when this happens

Test: open two browsers — both should show "2 / 2 connected". Close one — the other should update to "1 / 2 connected" within a reasonable delay.
```

**Phase 9 — Two-Person Limit**
```
Implement the best-effort two-user room cap for "Write Me Live" in app/api/liveblocks-auth/route.ts (built in Phase 5).

Logic:
1. Get the requesting anonymous ID from the cookie
2. Call liveblocks.getActiveUsers(roomId) to get currently connected user IDs
3. If the requesting anonId is already in that active list → allow (this is a reconnect/refresh of an existing participant)
4. Else if the count of unique active users is less than 2 → allow
5. Else → return a clear ROOM_FULL response (do not throw a generic 500)

On the room page, handle the ROOM_FULL response by showing:
"This room is full. Write Me Live rooms support up to 2 people."

Test:
- Connect A and B to a room (both should reach 2/2)
- Attempt to join as a third anonymous user (new browser/incognito) → should see the room-full message, and A/B's connections must be unaffected
- Refresh A → A should reconnect normally, not get locked out as a "third" user

Note in a code comment that this is a best-effort check with a small race window (no transactional coordination service), matching the documented V1 limitation.
```

**Phase 10 — Share Link**
```
Implement the copy-link feature for "Write Me Live".

Create components/copy-room-link.tsx:
- A "Copy link" button on the room page that copies the current room's full URL to the clipboard using the browser Clipboard API
- On success, show temporary "Copied!" feedback (e.g. for ~2 seconds) then revert to "Copy link"
- No external sharing service — just clipboard copy

Ensure it's keyboard accessible and has a visible focus state. Test on both desktop and mobile that the copy actually works and the URL is correct.
```

**Phase 11 — Error Handling**
```
Implement clean error states for "Write Me Live":

1. Room not found — valid-format room ID that doesn't exist in Liveblocks → friendly message + "Create a new room" button
2. Room full — from Phase 9 → "This room is full..." message
3. Invalid room ID — malformed URL (e.g. /room/%invalid) → rejected safely server-side, friendly error shown, no crash
4. Connection failed — Liveblocks connection error → clear message, no raw stack trace
5. Missing server configuration (e.g. LIVEBLOCKS_SECRET_KEY not set) → generic "server configuration error" message, never expose the actual missing variable name or any secret value to the client

Create app/room/[roomId]/room-error.tsx to render these states consistently. Verify none of these paths leak stack traces, secret keys, or internal error details to the browser in production mode.
```

**Phase 12 — Responsive Styling**
```
Polish the visual design of "Write Me Live". Keep it minimal — do not add gradients, heavy animations, or visual complexity.

Desktop:
- Editor centered, max-width ~900px, comfortable padding, subtle gray border, rounded corners, readable font, good line height, visible focus state

Mobile:
- Editor nearly full width, no horizontal overflow
- Editor/input text at least 16px to prevent iOS zoom-on-focus
- Touch text selection works normally
- Tap targets (Create Room, Copy link) are comfortably sized

Verify connection status colors: green (connected), amber (reconnecting), red (error/full/not-found).

Test in both a desktop browser viewport and a mobile viewport (or real device) — confirm no layout breakage in either.
```

**Phase 13 — Production Verification**
```
Run final production verification for "Write Me Live":

1. npm run lint — must pass, no @ts-ignore/eslint-disable/any without a documented justification
2. npm run build — must pass with no TypeScript errors
3. Manually verify the full checklist:
   - Homepage loads and Create Room works
   - Room IDs are random/unguessable
   - Two browsers can join and reach 2/2 connected
   - Typing syncs both directions without refresh
   - Simultaneous editing converges with no lost text
   - Deletions and paste sync correctly
   - Refresh preserves document content
   - Disconnect/reconnect converges correctly
   - Third user gets ROOM_FULL without disrupting the first two
   - Copy link works
   - Invalid and nonexistent room IDs are handled gracefully
   - Mobile layout works
   - LIVEBLOCKS_SECRET_KEY never appears client-side or in logs
   - No always-running Node server or custom WebSocket server is required for deployment

Write the final README.md covering: what it is, tech stack, architecture, local setup, environment variables, how realtime collaboration works, the two-user limit and its documented race-condition caveat, Vercel deployment steps, Netlify compatibility notes, testing steps, and known V1 limitations (no DB, no auth, best-effort occupancy check, no rate-limiting infrastructure).

Do not describe the project as complete if any checklist item fails — fix it first, then report final status.
```