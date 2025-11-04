const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL.includes("supabase") ||
    process.env.DATABASE_URL.includes("neon")
      ? { rejectUnauthorized: false }
      : undefined,
});

const predefinedCategories = [
  { name: "Technology", color: "#0070f3" }, // Blue
  { name: "Design", color: "#7928ca" }, // Purple
  { name: "Business", color: "#f5a623" }, // Orange
  { name: "Lifestyle", color: "#50e3c2" }, // Teal
  { name: "Travel", color: "#ff6b6b" }, // Red
  { name: "Food", color: "#4ecdc4" }, // Cyan
  { name: "Health", color: "#95e1d3" }, // Mint
  { name: "Sports", color: "#f38181" }, // Pink
  { name: "Education", color: "#aa96da" }, // Lavender
  { name: "Entertainment", color: "#fcbad3" }, // Light Pink
];

async function seedCategories() {
  const client = await pool.connect();
  try {
    console.log("🌱 Seeding predefined categories...");

    for (const category of predefinedCategories) {
      // Check if category already exists
      const checkResult = await client.query(
        "SELECT id FROM categories WHERE name = $1",
        [category.name]
      );

      if (checkResult.rows.length === 0) {
        await client.query(
          `INSERT INTO categories (id, name, color, is_predefined, created_by_id, created_at) 
           VALUES (gen_random_uuid(), $1, $2, 'true', NULL, NOW())`,
          [category.name, category.color]
        );
        console.log(
          `✅ Created category: ${category.name} (${category.color})`
        );
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }

    console.log("✨ Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCategories().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
