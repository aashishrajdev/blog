import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { dbConnect } from "@/utils/db";
import { articles, articleInsertSchema } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET all articles
export async function GET() {
  try {
    const db = await dbConnect();
    const allArticles = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST create new article
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to create an article" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const db = await dbConnect();

    const validatedData = articleInsertSchema.parse({
      ...body,
      authorId: session.user.id || crypto.randomUUID(),
      authorName: session.user.name || null,
      authorEmail: session.user.email,
    });

    const [newArticle] = await db
      .insert(articles)
      .values(validatedData)
      .returning();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid article data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

// DELETE article
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to delete an article" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    // Check if user owns the article
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only delete your own articles" },
        { status: 403 }
      );
    }

    await db.delete(articles).where(eq(articles.id, articleId));

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
