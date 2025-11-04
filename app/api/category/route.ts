import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { dbConnect } from "@/utils/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET all categories
export async function GET() {
  try {
    const db = await dbConnect();
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new category (requires authentication)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    // Check if category name already exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Get user ID from session (you might need to adjust this based on your auth setup)
    const userId = (session.user as { id?: string }).id || session.user.email;

    const newCategory = await db
      .insert(categories)
      .values({
        name,
        color,
        isPredefined: "false",
        createdById: userId,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category (only creator or admin can delete custom categories)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    // Get the category to check ownership
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Don't allow deletion of predefined categories
    if (category[0].isPredefined === "true") {
      return NextResponse.json(
        { error: "Cannot delete predefined categories" },
        { status: 403 }
      );
    }

    // Check if user owns this category
    const userId = (session.user as { id?: string }).id || session.user.email;
    if (category[0].createdById !== userId) {
      return NextResponse.json(
        { error: "You can only delete categories you created" },
        { status: 403 }
      );
    }

    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
