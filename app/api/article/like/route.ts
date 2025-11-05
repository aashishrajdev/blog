import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const articleId = body?.id || null;
    if (!articleId) {
      return NextResponse.json(
        { error: "Article id is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const newLikes = (Number(article.likes ?? 0) || 0) + 1;
    const [updated] = await db
      .update(articles)
      .set({ likes: newLikes })
      .where(eq(articles.id, articleId))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error liking article:", err);
    return NextResponse.json(
      { error: "Failed to like article" },
      { status: 500 }
    );
  }
}
