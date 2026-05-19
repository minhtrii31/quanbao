# Quân Bảo Client

Next.js frontend for the Quân Bảo site and admin dashboard.

## Local Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

Required env:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

On this machine, port `5000` is occupied by macOS `ControlCenter`, so `.env.local` uses:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

The backend must run on the same port configured by `NEXT_PUBLIC_API_URL`.

## Checks

```bash
npm run lint
npm run build
```

Admin seed credentials for local development:

```text
Email: admin@quanbao.com
Password: Admin123
```

Fonts use local system fallbacks so local builds do not depend on Google Fonts network access.
