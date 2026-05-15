# Next.js Login + Register + Dashboard (XAMPP MySQL)

This project now includes:

- User registration
- User login
- Protected dashboard
- Session cookie auth (JWT in HTTP-only cookie)
- MySQL database integration for XAMPP

## 1) Start XAMPP

From XAMPP Control Panel, start:

- Apache
- MySQL

## 2) Create the Database

Open phpMyAdmin (usually http://localhost/phpmyadmin), then run the SQL in [database/schema.sql](database/schema.sql).

This creates:

- Database: `kunohap_auth`
- Table: `users`

## 3) Configure Environment Variables

Copy [.env.example](.env.example) to `.env.local`, then update values if needed:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kunohap_auth
JWT_SECRET=replace-with-a-long-random-secret
```

For `JWT_SECRET`, use a long random value (at least 16 characters).

## 4) Install Dependencies

```bash
npm install
```

## 5) Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Routes

- `/` -> Login page
- `/register` -> Registration page
- `/dashboard` -> Protected dashboard page

Auth APIs:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Security Notes

- Passwords are hashed with `bcryptjs`.
- Session token is stored in an HTTP-only cookie.
- Dashboard checks and verifies the session before loading user data.
