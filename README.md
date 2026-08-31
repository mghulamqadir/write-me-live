# Write Me Live

Write Me Live is a minimal, anonymous, two-person collaborative writing room. Create a room, share its URL, and write together in realtime.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Liveblocks for room authentication, presence, realtime transport, and persistence
- Tiptap with the Liveblocks Yjs collaboration extension
- `nanoid` for anonymous browser IDs and room IDs

## Local setup

```bash
npm install
cp .env.example .env.local
```

Set `LIVEBLOCKS_SECRET_KEY` in `.env.local` using a secret key from the Liveblocks dashboard, then run `npm run dev` and open <http://localhost:3000>.

## Architecture

The homepage calls `POST /api/rooms`. The server generates an unguessable room ID and creates the Liveblocks room with no default access. The browser is redirected to `/room/[roomId]`.

The room page mounts a Liveblocks `RoomProvider`. When Liveblocks requests an access token, `POST /api/liveblocks-auth` reads the httpOnly `wml_anon_id` cookie, validates the room, checks occupancy, and returns a scoped full-access token. The secret key is only read by server code.

Tiptap uses the official Liveblocks Yjs extension, so the collaborative document is owned by the realtime provider rather than mirrored into React state. Liveblocks also supplies the connected-user list and room connection status.

## Two-user limit

Rooms support up to two unique active anonymous users. A reconnecting user is allowed back in, while a new user receives `ROOM_FULL` and a friendly full-room message.

This is a best-effort V1 check: active-user inspection and token authorization are separate operations, so a small race window exists. There is no transactional occupancy service.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Add `LIVEBLOCKS_SECRET_KEY` to the project environment variables.
3. Deploy with the default Next.js build settings.

No always-running Node server or custom WebSocket server is required; Liveblocks provides the realtime infrastructure.

### Netlify

Deploy as a Next.js application using Netlify’s Next.js runtime and configure `LIVEBLOCKS_SECRET_KEY` in site environment variables. Confirm the runtime supports Next.js 16 App Router route handlers and preserves httpOnly cookies on serverless responses. Liveblocks connections run through Liveblocks rather than Netlify.

## Testing

```bash
npm run lint
npm run build
```

Manually create a room, open it in two browsers, test two-way typing, simultaneous edits, deletion, plain-text paste, undo/redo, refresh reconvergence, presence, reconnects, copy-link behavior, invalid/nonexistent rooms, and the third-user full-room state. Test desktop and mobile viewports.

## Known V1 limitations

- No user accounts or durable application database
- Anonymous identity is for occupancy tracking, not security-critical authentication
- Occupancy enforcement is best-effort and has a small race window
- No rate-limiting infrastructure
- No custom realtime server; Liveblocks is required for collaboration
