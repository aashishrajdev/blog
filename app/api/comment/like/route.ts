import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { dbConnect } from "@/utils/db";
import { comments, commentLikes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/comment/like  { id }
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
        { error: "Comment id is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    const [row] = await db
      .select({ likes: comments.likes })
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1);
    if (!row) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // check if user already liked the comment
    const [existing] = await db
      .select()
      .from(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, session.user.id),
          eq(commentLikes.commentId, id)
        )
      )
      .limit(1);

    let newLikes = row.likes || 0;
    let liked = true;

    if (existing) {
      // remove like
      await db.delete(commentLikes).where(eq(commentLikes.id, existing.id));
      newLikes = Math.max(0, newLikes - 1);
      liked = false;
    } else {
      // add like
      await db
        .insert(commentLikes)
        .values({ userId: session.user.id, commentId: id });
      newLikes = newLikes + 1;
      liked = true;
    }

    await db
      .update(comments)
      .set({ likes: newLikes })
      .where(eq(comments.id, id));

    return NextResponse.json({ id, likes: newLikes, liked });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
}
