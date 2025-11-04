import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

declare global {
    var drizzle: {
        conn: NodePgDatabase<typeof schema> | null;
        promise: Promise<NodePgDatabase<typeof schema>> | null;
    };
}

export {}
