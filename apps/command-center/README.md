# Aipify Command Center (Desktop)

macOS Phase 1 desktop client — **Tauri** (preferred over Electron for lower memory and smaller footprint).

## Prerequisites

- [Rust](https://rustup.rs/)
- macOS (Phase 1)
- Aipify web app running (default `http://localhost:3001`)
- Business or Enterprise plan for desktop pairing

## Pairing

1. Sign in to the web app.
2. Open `/app/command-center/connect`.
3. Generate a desktop session token (shown once).
4. Paste the token into the desktop app settings.

## Development

```bash
cd apps/command-center
npm install
npm run tauri:dev
```

## Architecture

The desktop client **does not** contain business logic. It consumes:

- `GET /api/desktop/command-center`
- `POST /api/desktop/quick-action`
- `POST /api/desktop/sessions/revoke`

All intelligence originates from **Aipify Core**.

## Roadmap

| Phase | OS |
|-------|-----|
| 1 | macOS (menu bar / tray) |
| 2 | Windows |
| 3 | Linux |
