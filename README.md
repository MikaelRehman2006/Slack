# Slack Clone

A real-time messaging application built with modern technologies.

## Architecture

- **Frontend**: Next.js (TypeScript)
- **Backend API**: Node.js (TypeScript, Fastify) → persists messages to Postgres and publishes events to Redis
- **WebSocket Gateway**: Go → fans out "new message" events from Redis to connected clients
- **Infrastructure**: Docker Compose for Postgres + Redis

## Quick Start

1. **Install dependencies:**

   ```bash
   npm run install:all
   ```

2. **Start infrastructure:**

   ```bash
   npm run docker:up
   ```

3. **Start all services:**
   ```bash
   npm run dev
   ```

## Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- WebSocket Gateway: ws://localhost:8080
- Postgres: localhost:5432
- Redis: localhost:6379

## Development

- `npm run dev` - Start all services
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run dev:websocket` - Start only WebSocket gateway
- `npm run docker:up` - Start infrastructure
- `npm run docker:down` - Stop infrastructure
