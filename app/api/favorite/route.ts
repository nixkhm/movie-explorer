import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    const response = db
      .prepare("SELECT * FROM favorites ORDER BY addedAt DESC")
      .all();
    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT INTO favorites (movieId, title, posterPath, releaseDate, overview, rating, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.movieId,
      body.title,
      body.posterPath || null,
      body.releaseDate || null,
      body.overview,
      body.rating || 0,
      body.note || "",
    );

    const favorite = db
      .prepare("SELECT * FROM favorites WHERE id = ?")
      .get(result.lastInsertRowid);
    return NextResponse.json(favorite);
  } catch (e: any) {
    // movie already favorited
    if (e?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "Movie is already in favorites" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 },
    );
  }
}
