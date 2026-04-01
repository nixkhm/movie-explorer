import { NextRequest, NextResponse } from "next/server";
import db, { initDb } from "@/app/lib/db";

export async function GET() {
  try {
    await initDb();
    const response = await db.execute(
      "SELECT * FROM favorites ORDER BY addedAt DESC",
    );
    return NextResponse.json(response.rows);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const result = await db.execute({
      sql: `INSERT INTO favorites (movieId, title, posterPath, releaseDate, overview, rating, note)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.movieId,
        body.title,
        body.posterPath || null,
        body.releaseDate || null,
        body.overview,
        body.rating || 0,
        body.note || "",
      ],
    });

    const favorite = await db.execute({
      sql: "SELECT * FROM favorites WHERE id = ?",
      args: [Number(result.lastInsertRowid)],
    });

    return NextResponse.json(favorite.rows[0]);
  } catch (e: any) {
    // movie already favorited
    if (e?.message?.includes("UNIQUE")) {
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
