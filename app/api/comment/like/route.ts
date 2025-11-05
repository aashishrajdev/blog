import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const commentId = body?.id || null;
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment id is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const newLikes = (Number(comment.likes ?? 0) || 0) + 1;
    const [updated] = await db
      .update(comments)
      .set({ likes: newLikes })
      .where(eq(comments.id, commentId))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error liking comment:", err);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
}
