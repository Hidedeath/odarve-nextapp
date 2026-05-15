import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { getDbPool } from "@/lib/db";

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

type PublicUserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export async function createUser(params: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<number> {
  const pool = getDbPool();

  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [params.name, params.email, params.passwordHash],
  );

  return result.insertId;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const pool = getDbPool();

  const [rows] = await pool.execute<UserRow[]>(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  return rows[0] ?? null;
}

export async function getUserById(id: number): Promise<PublicUser | null> {
  const pool = getDbPool();

  const [rows] = await pool.execute<PublicUserRow[]>(
    "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
    [id],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}
