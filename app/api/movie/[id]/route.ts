import { NextRequest, NextResponse } from "next/server";
import { details } from "@/app/lib/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await details(id);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }
}
