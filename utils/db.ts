import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const DATABASE_URL = process.env.DATABASE_URL!;
if (!DATABASE_URL) {
    throw new Error('please define the DATABASE_URL environment variable inside .env.local');
}

let cached = global.drizzle;

if (!cached) {
    cached = global.drizzle = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const pool = new Pool({
            connectionString: DATABASE_URL,
            max: 10,
            ssl: DATABASE_URL.includes('supabase') || DATABASE_URL.includes('neon') 
                ? { rejectUnauthorized: false } 
                : undefined,
        });

        cached.promise = Promise.resolve(drizzle(pool, { schema }));
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
