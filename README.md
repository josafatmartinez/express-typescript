# Express TypeScript API

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/ts-5.x-3178c6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/express-5-black?logo=express&logoColor=white)
![DB](https://img.shields.io/badge/db-sqlite%20%7C%20postgres-blue)

Minimal REST API boilerplate built with Express 5 + TypeScript. Includes health check, users CRUD, request validation (Zod), logging (Pino), Swagger UI, and Kysely with pluggable backends (SQLite by default, Postgres via env).

## Quick start

```bash
npm install
npm run dev            # hot reload (tsx + nodemon)
npm run build          # builds + obfuscates dist/server.js
npm run start          # runs built server
npm run lint           # eslint
npm run format         # prettier
```

API base: `/api` • Docs: `GET /api/docs`.

## Environment

Copy `.env.example` to `.env` and adjust:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*
# For Postgres (optional, see below)
POSTGRES_URL=postgres://user:password@localhost:5432/mydb
```

## Database selection (SQLite ↔ Postgres)

| Mode     | How to enable                   | Notes                                           |
| -------- | ------------------------------- | ----------------------------------------------- |
| SQLite   | No `POSTGRES_URL` set (default) | File at `data/app.db`, WAL + busy_timeout set   |
| Postgres | Set `POSTGRES_URL` in `.env`    | Uses `pg` + `PostgresDialect`; same Kysely APIs |

`migrate()` adapts the `id` column per dialect (SQLite autoincrement vs Postgres serial) and keeps UUID + unique email.

## Running Postgres in Docker (example)

```bash
docker run -d --name pg \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=appdb \
  -p 5432:5432 \
  postgres:15
```

Then set `POSTGRES_URL=postgres://app:secret@localhost:5432/appdb` and start the app. If you already have a container named `pg`, reuse (`docker start pg`) or remove/rename it.

## Routes (main)

- `GET /api/v1/health` – health check.
- Users (`/api/v1/users`): list, get (by id or uuid), create, update, delete. Request validation via Zod; UUID generated on create.
- Swagger UI at `/api/docs`; spec in `src/config/openapi.ts`.

## Project structure (visual map)

- `src/app.ts` – Express setup (helmet, compression, cors, pino-http).
- `src/server.ts` – boot + migrate before listen.
- `src/routes` – health and users endpoints.
- `src/repositories/users.ts` – Kysely queries.
- `src/db` – clients (SQLite/Postgres), migrate, types.
- `src/config` – env parsing (Zod), API prefix/version, OpenAPI spec.
- `src/middlewares` – not-found and error handler (maps Zod errors).

## Git hooks

Husky + lint-staged enforce prettier/eslint on commit and lint on push (installed via `npm install`, `prepare` script).

## Notes

- Build uses tsup (CJS, minify) plus javascript-obfuscator; sourcemaps are not emitted.
- Adjust `POSTGRES_URL`/`data/` handling as needed for your deployment.
