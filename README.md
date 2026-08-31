# Write Me Live

Write Me Live is a lightweight, anonymous, two-person collaborative writing room. Create a room, choose a display name, share the room URL, and write together in real time.

## Features

- Anonymous room creation with unguessable room IDs
- Two-person collaborative Tiptap editor powered by Liveblocks and Yjs
- Live participant presence with initials, names, and unique accent colors
- Inline display-name editing without clearing the shared document
- Copyable room link with temporary confirmation feedback
- Dark and Soft dark themes
- Smooth theme transitions with persisted theme preference
- Responsive desktop and mobile layout
- No account or application database required

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Liveblocks client, React, Node, and Tiptap integrations
- Tiptap StarterKit with formatting extensions disabled
- `nanoid` for anonymous IDs and room IDs

## Local setup

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env.local
```

Add a Liveblocks secret key from the Liveblocks dashboard to `.env.local`:

```env
LIVEBLOCKS_SECRET_KEY="sk_dev_or_sk_prod_your_key"
```

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>.

Never commit `.env.local`. Environment files are ignored by Git, and the Liveblocks secret is used only by server-side code.

## User flow

1. Enter a display name on the homepage.
2. Select **Create Room**.
3. The server creates a Liveblocks room and redirects to `/room/[roomId]`.
4. Liveblocks authenticates the browser using its anonymous httpOnly identity cookie.
5. The name is published as Liveblocks user metadata and appears to other participants.
6. Use **Copy link** to share the room.
7. A second participant enters a name and joins using the shared URL.

When a room URL is opened directly without a saved display name, the app asks for a name before mounting the Liveblocks room provider. The current participant can click their name badge to rename themselves. Renaming reconnects the participant metadata but does not reset the shared document.

## Architecture

The homepage calls `POST /api/rooms`. The server generates a random room ID and creates the Liveblocks room with no default access permissions.

The room route validates the room ID using the shared `isValidRoomId` helper. Before realtime connection, the app ensures a display name exists through `POST /api/identity`, which stores the validated name in the httpOnly `wml_display_name` cookie.

When Liveblocks requests a token, `POST /api/liveblocks-auth`:

- Validates the requested room ID.
- Confirms that the Liveblocks room exists.
- Reads or creates the browser’s `wml_anon_id` cookie.
- Reads the display name.
- Checks the active-user limit.
- Publishes `{ name, color }` as Liveblocks user metadata.
- Grants full access only to the requested room.

The Liveblocks secret key is never sent to the browser. The editor uses Liveblocks’ official Yjs-backed Tiptap extension, so document synchronization and persistence are owned by Liveblocks rather than mirrored into React state.

## Presence and colors

The room header shows the current user and connected co-writer as compact badges with initials. Each participant receives a distinct teal or terracotta accent color for their badge and collaborative cursor. Colors are assigned from the anonymous participant ID and reused on reconnect when possible.

The connection indicator reflects the Liveblocks connection state: connecting, connected, reconnecting, or connection lost. A temporary connection failure does not clear local editor content.

## Themes

The app supports:

- **Dark**: near-black green-tinted background
- **Soft dark**: warmer, lighter charcoal background

The theme menu is available on the homepage and in the room header. Changing themes does not reload the page. The preference is stored separately from user identity in `localStorage` and the `wml_theme` cookie. An inline initialization script applies the saved theme before first paint to avoid a flash of the wrong theme, and switching uses a short smooth transition.

The writing area uses a serif editorial font. Interface controls use a sans-serif font. Theme tokens are centralized in `app/globals.css` and status/text colors are selected for accessible contrast.

## Two-person limit

Rooms support up to two unique active anonymous users. A reconnecting user is allowed back in. A third anonymous browser receives a friendly `ROOM_FULL` response, while the existing participants remain connected.

This limit is best-effort: the active-user lookup and authorization request are separate operations, so a small race window exists. There is no transactional occupancy service or rate-limiting infrastructure.

## API routes

| Route | Method | Purpose |
|---|---:|---|
| `/api/rooms` | `POST` | Creates a room and returns `{ roomId }` |
| `/api/identity` | `POST` | Validates and stores `{ name }` in the display-name cookie |
| `/api/liveblocks-auth` | `POST` | Validates access, occupancy, identity, and returns the Liveblocks token |

Client-safe errors include `INVALID_ROOM_ID`, `INVALID_NAME`, `NAME_REQUIRED`, `ROOM_NOT_FOUND`, `ROOM_FULL`, and `SERVER_CONFIG_ERROR`.

## Verification

Run the automated checks:

```bash
npm run lint
npm run build
```

Manual verification should cover room creation, named joining, two-way typing, simultaneous editing, deletion, plain-text paste, undo/redo, refresh reconvergence, presence updates, reconnects, third-user rejection, copy-link behavior, invalid/nonexistent rooms, both themes, and desktop/mobile layouts.
