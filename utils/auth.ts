import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "./db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; 
import { z } from "zod";

export const authOptions: NextAuthOptions= {
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
        }),
        //Credential login
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials){
                const credentialsSchema = z.object({
                    email: z.string().email(),
                    password: z.string().min(8)
                });
                const parsed = credentialsSchema.safeParse(credentials ?? {});
                if (!parsed.success) {
                    console.log("Invalid credentials payload", parsed.error.flatten());
                    throw new Error("Invalid credentials");
                }
                try {
                    const db = await dbConnect();
                    if (!db) {
                        throw new Error("Database connection failed");
                    }
                    const userResults = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
                    
                    if (userResults.length === 0) {
                        console.log("No user found with email:", parsed.data.email);
                        throw new Error("No user found");
                    }

                    const user = userResults[0];
                    const isValid = await bcrypt.compare(
                        parsed.data.password,
                        user.password
                    )
                    if (!isValid) {
                        console.log("Invalid password for user:", parsed.data.email);
                        throw new Error("invalid password");
                    }
                    // console.log("User authenticated successfully:", credentials.email);
                    return{
                        id:user.id,
                        email:user.email,
                    }
                }catch (error) {
                    console.error("Error in Authorizing User:", error)
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("Invalid credentials");
                }
            }
          })

      ],
      callbacks:{
        async jwt({token,user}){
            if(user){
                token.id =user.id;
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log("SignIn callback:", { user, account, profile });
            return true;
        },
        async redirect({ url, baseUrl }) {
            console.log("Redirect callback:", { url, baseUrl });
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
      },
      pages:{
        signIn: "/login",
        error: "/login"
      },
      session:{
        strategy:"jwt",
        maxAge: 30* 24 * 60 * 60, 
        
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV === 'development',
};
