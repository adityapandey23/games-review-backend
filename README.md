# Games Review API 🎮

A RESTful backend API for a Games Review application. Built with modern tools and performance in mind.

## 🚀 Tech Stack

- **Framework**: [Express.js](https://expressjs.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT & `bcryptjs`

## ✨ Features

- **JSON Web Token (JWT) Authentication**: Secure register and login flow.
- **Games Module**: Full CRUD operations for storing games records (`name`, `releaseYear`, `gamingStudio`).
- **Reviews Module**: Authenticated users can leave reviews (1-5 rating & comment) on specific games.
- **Pagination**: Read endpoints support basic `?page=` and `?limit=` query params.

## 📦 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed locally
- Docker Desktop or Docker Compose installed for running the Postgres Database locally

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Variables
Ensure `.env` contains the required properties:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/games_review
PORT=3000
JWT_SECRET=supersecret123
```

### 3. Start PostgreSQL via Docker Setup
Start the local Postgres database with the credentials defined in `.env`:
```bash
bun run db:up
```

### 4. Push Drizzle Schema Setup
Sync your Drizzle schema with the database:
```bash
bun run db:push
```

### 5. Start the Server
Start the development server with hot-reloading:
```bash
bun run dev
```

For production, run:
```bash
bun run start
```

## 📖 API Documentation

An extensive `curl` guide for every endpoint with request/response payloads is documented in [`API_GUIDE.md`](./API_GUIDE.md).

## 🛠 Database Tooling (Drizzle Studio)

To start the visual database explorer and view live data, run:
```bash
bun run db:studio
```
