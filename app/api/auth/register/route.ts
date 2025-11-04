import { NextRequest , NextResponse} from "next/server";
import { dbConnect } from "@/utils/db";
import { users, userInsertSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Password strength validation
function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" };
  }
  return { isValid: true };
}

export async function POST(request: NextRequest){
    try {
        const body = await request.json()
        const parsed = userInsertSchema.pick({ email: true, password: true }).safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
        }
        const { email, password } = parsed.data

        // Additional password strength validation beyond length
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json({error: passwordValidation.error},{status:400})
        }

        const db = await dbConnect();
        if (!db) {
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }
        
        // Check for existing user
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if(existingUser.length > 0){
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await db.insert(users).values({ email, password: hashedPassword });
        
        return NextResponse.json({message:"User created successfully"},{status:201})
    } catch (error){
        console.error("Error in Registering User:", error);
        return NextResponse.json({error:"Failed to register user"},{status:500})
    }
}
