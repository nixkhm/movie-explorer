import Database from "better-sqlite3";
import path from "path";

const db = new Database(
  process.env.NODE_ENV === "production"
    ? "/tmp/favorites.db"
    : path.join(process.cwd(), "favorites.db")
);

db.exec(
  `CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieId INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        posterPath TEXT,
        releaseDate TEXT,
        overview TEXT,
        rating INTEGER DEFAULT 0,
        note TEXT DEFAULT '',
        addedAt TEXT DEFAULT (datetime('now'))
    )`,
);

export default db;
