# Write Me Live

Write Me Live is a minimal, anonymous, two-person collaborative writing room. Create a room, share its URL, and write together in realtime.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Liveblocks for room authentication, presence, realtime transport, and persistence
- Tiptap with the Liveblocks Yjs collaboration extension
- `nanoid` for anonymous browser IDs and room IDs
- Four editorial themes: Light, Dark, Soft dark, and Sepia

## Local setup

```bash
npm install
cp .env.example .env.local
```

Set `LIVEBLOCKS_SECRET_KEY` in `.env.local` using a secret key from the Liveblocks dashboard, then run `npm run dev` and open <http://localhost:3000>.

## Architecture

The homepage calls `POST /api/rooms`. The server generates an unguessable room ID and creates the Liveblocks room with no default access. The browser is redirected to `/room/[roomId]`.

The homepage or a direct room link first asks for a display name. `POST /api/identity` stores the validated name in the httpOnly `wml_display_name` cookie. The room page only mounts Liveblocks after that step. When Liveblocks requests an access token, `POST /api/liveblocks-auth` reads both the display-name and anonymous-ID cookies, validates the room, checks occupancy, publishes the name as Liveblocks user metadata, and returns a scoped full-access token. The secret key is only read by server code.

Tiptap uses the official Liveblocks Yjs extension, so the collaborative document is owned by the realtime provider rather than mirrored into React state. Liveblocks also supplies the connected-user list and room connection status.

Connected participants appear as compact, individually colored name badges with initials. Colors are assigned from the anonymous participant ID and reused across refreshes and name changes. The current participant’s badge can be selected to change their display name; changing the name reconnects the participant without resetting the shared document.

The theme selector in the homepage and room header switches between Light, Dark, Soft dark, and Sepia without a reload. The choice is stored separately from identity in `localStorage` and a `wml_theme` preference cookie. An inline initialization script applies the saved theme before first paint to avoid a flash of the wrong theme. The writing area uses a serif editorial typeface while application controls use sans-serif text.

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
