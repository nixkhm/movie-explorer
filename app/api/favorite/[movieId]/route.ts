import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;
    const result = db
      .prepare("DELETE FROM favorites WHERE movieId = ?")
      .run(parseInt(movieId));

    // movieId does not exist
    if (result.changes === 0) {
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
    const { movieId } = await params;
    const body = await request.json();

    db.prepare(
      "UPDATE favorites SET rating = ?, note = ? WHERE movieId = ?",
    ).run(body.rating, body.note, parseInt(movieId));

    const updated = db
      .prepare("SELECT * FROM favorites WHERE movieId = ?")
      .get(parseInt(movieId));

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 },
    );
  }
}
