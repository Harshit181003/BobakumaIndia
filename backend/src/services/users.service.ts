import { pool } from "../db.js";
import { hashPassword } from "../utils/password.js";

export type DbUser = {
  id: number;
  email: string | null;
  password_hash: string | null;
  google_id: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "VENDOR";
  name: string | null;
  avatar_url: string | null;
  is_active: 0 | 1;
};

export async function findUserByEmail(email: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return (rows as DbUser[])[0] ?? null;
}

export async function findUserByGoogleId(googleId: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ? LIMIT 1", [googleId]);
  return (rows as DbUser[])[0] ?? null;
}

export async function findUserById(id: number) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return (rows as DbUser[])[0] ?? null;
}

export async function createUserEmailPassword(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const passwordHash = await hashPassword(input.password);
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, role, name, is_active) VALUES (?, ?, 'CUSTOMER', ?, 1)",
    [input.email, passwordHash, input.name ?? null]
  );
  const insertId = (result as { insertId: number }).insertId;
  return findUserById(insertId);
}

export async function createOrLinkGoogleUser(input: {
  googleId: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}) {
  if (input.email) {
    const existingByEmail = await findUserByEmail(input.email);
    if (existingByEmail) {
      await pool.query("UPDATE users SET google_id=?, name=COALESCE(name, ?), avatar_url=COALESCE(avatar_url, ?) WHERE id=?",
        [input.googleId, input.name ?? null, input.avatarUrl ?? null, existingByEmail.id]
      );
      return findUserById(existingByEmail.id);
    }
  }

  const [result] = await pool.query(
    "INSERT INTO users (email, google_id, role, name, avatar_url, is_active) VALUES (?, ?, 'CUSTOMER', ?, ?, 1)",
    [input.email ?? null, input.googleId, input.name ?? null, input.avatarUrl ?? null]
  );
  const insertId = (result as { insertId: number }).insertId;
  return findUserById(insertId);
}

