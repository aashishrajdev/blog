import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { dbConnect } from "@/utils/db";
import { articles, articleLikes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/article/like  { id }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const id = body?.id;
    if (!id) {
      return NextResponse.json(
        { error: "Article id is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    // ensure article exists
    const [articleRow] = await db
      .select({ likes: articles.likes })
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    if (!articleRow) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // check whether user already liked this article
    const [existing] = await db
      .select()
      .from(articleLikes)
      .where(
        and(
          eq(articleLikes.userId, session.user.id),
          eq(articleLikes.articleId, id)
        )
      )
      .limit(1);

    let newLikes = articleRow.likes || 0;
    let liked = true;

    if (existing) {
      // user already liked -> remove like (toggle off)
      await db.delete(articleLikes).where(eq(articleLikes.id, existing.id));
      newLikes = Math.max(0, newLikes - 1);
      liked = false;
    } else {
      // insert like
      await db
        .insert(articleLikes)
        .values({ userId: session.user.id, articleId: id });
      newLikes = newLikes + 1;
      liked = true;
    }

    await db
      .update(articles)
      .set({ likes: newLikes })
      .where(eq(articles.id, id));

    return NextResponse.json({ id, likes: newLikes, liked });
  } catch (error) {
    console.error("Error liking article:", error);
    return NextResponse.json(
      { error: "Failed to like article" },
      { status: 500 }
    );
  }
}
