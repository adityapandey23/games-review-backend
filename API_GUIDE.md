# Games Review API Guide

## Base URL
All endpoints are relative to `http://localhost:3000` when running locally.

## Authentication
Protected routes require a JWT token to be sent in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Auth Module

### Register a User
Create a new user account.

- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Auth Required:** No

**Request Body:**
```json
{
  "email": "someplayer@example.com",
  "password": "supersecurepassword"
}
```

**Example Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"someplayer@example.com", "password":"supersecurepassword"}'
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "someplayer@example.com"
  }
}
```

### Login
Log in to receive an authentication token.

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Auth Required:** No

**Request Body:**
```json
{
  "email": "someplayer@example.com",
  "password": "supersecurepassword"
}
```

**Example Curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"someplayer@example.com", "password":"supersecurepassword"}'
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhb..."
}
```

---

## 2. Games Module

### Get All Games (Paginated)
Fetch a list of all games.

- **Method:** `GET`
- **Endpoint:** `/api/games`
- **Auth Required:** No
- **Query Params (Optional):** 
  - `page` (default 1)
  - `limit` (default 10)

**Example Curl:**
```bash
curl -X GET "http://localhost:3000/api/games?page=1&limit=5"
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "The Witcher 3",
      "releaseYear": 2015,
      "gamingStudio": "CD Projekt Red",
      "createdAt": "2023-10-25T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 5
}
```

### Get a Single Game
Fetch details of a single game.

- **Method:** `GET`
- **Endpoint:** `/api/games/:gameId`
- **Auth Required:** No

**Example Curl:**
```bash
curl -X GET http://localhost:3000/api/games/123e4567-e89b-12d3-a456-426614174000
```

### Create a Game
Add a new game to the database.

- **Method:** `POST`
- **Endpoint:** `/api/games`
- **Auth Required:** Yes 

**Request Body:**
```json
{
  "name": "Skyrim",
  "releaseYear": 2011,
  "gamingStudio": "Bethesda"
}
```

**Example Curl:**
```bash
curl -X POST http://localhost:3000/api/games \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Skyrim", "releaseYear":2011, "gamingStudio":"Bethesda"}'
```

### Update a Game
Modify an existing game.

- **Method:** `PATCH`
- **Endpoint:** `/api/games/:gameId`
- **Auth Required:** Yes

**Request Body (Partial):**
```json
{
  "releaseYear": 2012
}
```

**Example Curl:**
```bash
curl -X PATCH http://localhost:3000/api/games/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"releaseYear": 2012}'
```

### Delete a Game
Remove a game.

- **Method:** `DELETE`
- **Endpoint:** `/api/games/:gameId`
- **Auth Required:** Yes

**Example Curl:**
```bash
curl -X DELETE http://localhost:3000/api/games/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <your_token>"
```

---

## 3. Reviews Module

### Get Reviews for a Game
Fetch all reviews left for a specific game.

- **Method:** `GET`
- **Endpoint:** `/api/games/review/:gameId`
- **Auth Required:** No

**Example Curl:**
```bash
curl -X GET http://localhost:3000/api/games/review/123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "gameId": "uuid",
      "userId": "uuid",
      "rating": 5,
      "comment": "Absolutely phenomenal!",
      "createdAt": "2023-10-25T12:00:00Z"
    }
  ]
}
```

### Post a Review
Create a review for a game, connected to the currently authenticated user.

- **Method:** `POST`
- **Endpoint:** `/api/games/review/:gameId`
- **Auth Required:** Yes

**Request Body:**
- `rating`: A number between 1 and 5.
- `comment`: Optional string.

```json
{
  "rating": 5,
  "comment": "Amazing graphics and storytelling."
}
```

**Example Curl:**
```bash
curl -X POST http://localhost:3000/api/games/review/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Amazing graphics and storytelling."}'
```
