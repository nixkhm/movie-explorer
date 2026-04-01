import { createClient } from "@libsql/client";

const db = createClient(
  process.env.NODE_ENV === "production"
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:favorites.db",
      },
);

export async function initDb() {
  await db.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieId INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        posterPath TEXT,
        releaseDate TEXT,
        overview TEXT,
        rating INTEGER DEFAULT 0,
        note TEXT DEFAULT '',
        addedAt TEXT DEFAULT (datetime('now'))
      )
    `);
}

export default db;
