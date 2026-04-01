import { NextRequest, NextResponse } from "next/server";
import db, { initDb } from "@/app/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    await initDb();
    const { movieId } = await params;
    const result = await db.execute({
      sql: "DELETE FROM favorites WHERE movieId = ?",
      args: [parseInt(movieId)],
    });

    // movieId does not exist
    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    await initDb();
    const { movieId } = await params;
    const body = await request.json();

    await db.execute({
      sql: "UPDATE favorites SET rating = ?, note = ? WHERE movieId = ?",
      args: [body.rating, body.note, parseInt(movieId)],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM favorites WHERE movieId = ?",
      args: [parseInt(movieId)],
    });

    return NextResponse.json(updated.rows[0]);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 },
    );
  }
}
