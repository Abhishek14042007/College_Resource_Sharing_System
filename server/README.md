# College Resources Sharing System - Backend

This backend stores metadata in MongoDB and saves uploaded files locally in `server/uploads`.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` to your MongoDB connection string.
3. Set `JWT_SECRET` to a strong secret.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/resources`
- `POST /api/resources`
- `PUT /api/resources/:id/like`
- `PUT /api/resources/:id/download`
- `POST /api/resources/:id/comments`
- `PUT /api/resources/:id/save`
- `DELETE /api/resources/:id`
- `GET /api/users/:id`
- `PUT /api/users/profile/update`
- `GET /api/users/saved/resources`
- `GET /api/users/leaderboard/top`

## Local file storage

Uploaded files are served from the `server/uploads` folder using the `/uploads` route.
"