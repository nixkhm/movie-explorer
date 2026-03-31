import { NextRequest, NextResponse } from "next/server";
import { search } from "@/app/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query)
    return NextResponse.json({ error: "Query is Required" }, { status: 400 });

  try {
    const data = await search(query);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 },
    );
  }
}
