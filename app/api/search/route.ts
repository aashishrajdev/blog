import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import { articles } from "@/db/schema";
import { sql } from "drizzle-orm";

// GET /api/search?q=term
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q || q.length < 1) {
      return NextResponse.json([]);
    }

    const db = await dbConnect();

    const pattern = `%${q.toLowerCase()}%`;

    const results = await db
      .select()
      .from(articles)
      .where(
        sql`lower(${articles.title}) LIKE ${pattern} OR lower(${articles.content}) LIKE ${pattern}`
      )
      .orderBy(sql`created_at DESC`);

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
