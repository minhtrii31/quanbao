# Quan Bao Web Platform

Quan Bao is a production-ready construction company web platform with a public marketing site, service/pricing pages, project and news publishing, contact intake, media uploads, and a protected admin CMS.

The repository contains two independent npm projects:

- `client/`: Next.js frontend for public pages, login, and admin UI.
- `server/`: Express/MongoDB API for CMS data, authentication, uploads, settings, and admin operations.

## Tech Stack

- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Radix/shadcn-style UI, Tiptap, Axios
- **Backend:** Node.js, Express 4, MongoDB/Mongoose 8, JWT, HTTP-only cookies, Cloudinary, Multer, Helmet, CORS, express-rate-limit
- **Production checks:** ESLint, Next production build, Node test runner, npm audit

## Repository Structure

```text
.
├── client/
│   ├── app/                Public, login, and admin routes
│   ├── components/         Shared, public, admin, editor, and UI components
│   ├── context/            Auth provider
│   ├── hooks/              Client hooks
│   ├── lib/                API clients and content utilities
│   ├── public/             Static assets
│   └── types/              Shared TypeScript API types
├── server/
│   ├── config/             Environment, database, and Cloudinary config
│   ├── controllers/        Route handlers
│   ├── middleware/         Auth, CSRF, rate limits, logging, and errors
│   ├── models/             Mongoose models
│   ├── routes/             API route definitions
│   ├── scripts/            Maintenance scripts
│   ├── seeders/            Seed helpers
│   ├── utils/              Shared backend utilities
│   └── validation/         Request/CMS validation schemas
├── LICENSE
└── README.md
```

Internal handoff docs, AI workflow notes, local E2E specs, generated reports, environment files, build output, uploads, and dependency folders are intentionally excluded from the public production repository.

## Local Setup

Install dependencies separately:

```bash
cd server
npm install
cp .env.example .env
```

```bash
cd client
npm install
cp .env.example .env.local
```

Start MongoDB locally or set `MONGODB_URI` in `server/.env`, then run the services in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- API health: `http://localhost:5000/health`
- API readiness: `http://localhost:5000/ready`

## Environment

Never commit real `.env`, `.env.local`, `.env.e2e`, credentials, private keys, certificates, database dumps, uploaded files, or generated build output.

Server variables are documented in `server/.env.example`.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV`, `PORT` | Runtime environment and API port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Admin JWT signing secret; required in production |
| `CLIENT_URL` | Exact frontend origin for CORS, CSRF checks, and CSP |
| `API_PUBLIC_URL`, `API_URL` | Public API origin and optional API base URL |
| `CLOUDINARY_ENABLED`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary upload configuration |
| `JSON_BODY_LIMIT`, `URLENCODED_BODY_LIMIT` | Optional request body limits |
| `DISABLE_DB_CONNECT`, `ALLOW_AUTH_HEADER` | Local/test toggles |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Admin seeding values |
| `CMS_ALLOWED_IMAGE_HOSTS`, `CMS_ALLOWED_LINK_HOSTS` | CMS image/link allowlists |

Client variables are documented in `client/.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin for metadata, canonical URLs, robots, and sitemap |
| `NEXT_PUBLIC_API_URL` | Browser API base URL, ending in `/api` |
| `NEXT_PUBLIC_CMS_ALLOWED_IMAGE_HOSTS` | Extra approved image hosts for CMS content |

## Commands

Run commands from the relevant project directory.

### Frontend

```bash
cd client
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
cd server
npm run dev
npm start
npm test
node seed.js
```

## Production Configuration

Use exact HTTPS origins in production:

- `CLIENT_URL=https://www.example.com`
- `API_PUBLIC_URL=https://api.example.com`
- `NEXT_PUBLIC_SITE_URL=https://www.example.com`
- `NEXT_PUBLIC_API_URL=https://api.example.com/api`

Production requirements:

- `NODE_ENV=production`
- Strong `JWT_SECRET` with at least 32 characters
- Production MongoDB connection in `MONGODB_URI`
- Cloudinary credentials unless uploads are explicitly disabled with `CLOUDINARY_ENABLED=false`
- Exact frontend/API origins with no trailing slash, path, query, or hash
- `CLIENT_URL` must match the deployed frontend origin
- `NEXT_PUBLIC_API_URL` must be the deployed API origin plus `/api`

## Production Checklist

Before publishing or deploying:

```bash
cd server
npm install
npm test
npm audit --audit-level=moderate
```

```bash
cd client
npm install
npm run lint
NEXT_PUBLIC_API_URL=https://api.example.com/api NEXT_PUBLIC_SITE_URL=https://www.example.com npm run build
npm audit --audit-level=moderate
```

Replace the example production URLs with your real deployed domains. The client build intentionally rejects local/HTTP API URLs in production mode.

After deployment, verify:

- `/health` returns API liveness
- `/ready` returns readiness with MongoDB and production env checks
- `/robots.txt` and `/sitemap.xml` use the correct public site URL
- Public pages, service detail pages, project detail pages, and news detail pages load
- Login, admin dashboard, CMS CRUD, contact management, media uploads, and logout work
- Browser requests send credentials correctly between the frontend and API domains
- Cloudinary uploads and image rendering work in production

## Security Notes

- Admin auth uses HTTP-only cookies and short-lived JWTs.
- Production auth cookies use `SameSite=None; Secure` for split frontend/API deployments.
- Cookie-authenticated unsafe admin/upload/logout requests are protected by strict `Origin`/`Referer` validation.
- Admin routes require authenticated users with the `admin` role.
- Public endpoints only expose published CMS records.
- Login, contact, admin mutations, and uploads are rate-limited.
- API middleware includes Helmet, CORS, request body limits, structured request logging, upload validation, and centralized error handling.
- Uploads validate server-detected JPEG, PNG, GIF, and WebP signatures before Cloudinary storage.
- Rich CMS content is sanitized before persistence.

## GitHub Publishing Safety

The root `.gitignore`, `client/.gitignore`, and `server/.gitignore` are configured to exclude local-only and sensitive files, including:

- `.env`, `.env.*`, `.env.local`, `.env.e2e`
- `node_modules`, `.next`, build output, caches, coverage, reports, and logs
- uploaded/generated media
- certificates, private keys, service account files, and credential JSON files
- internal docs, AI workflow notes, and local test-only assets

Before the first push:

```bash
git init
git add .
git status --short
```

Review the staged list carefully. Do not push if any real secret, credential, upload, generated artifact, private internal document, or local environment file appears in the staged output.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
