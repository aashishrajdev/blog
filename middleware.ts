import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname.toLowerCase();
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/error"
        ) {
          return true;
        }
        if (
          pathname === "/" ||
          pathname.startsWith("/article/") ||
          pathname.startsWith("/api/article") ||
          pathname.startsWith("/api/comment") ||
          pathname.startsWith("/api/category") ||
          pathname.startsWith("/api/imageKit-auth")
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /* 
        Match all paths except for the following:
        - _next/static and _next/image: Next.js static files    
        - favicon.ico: The favicon file
        - public: The public directory
        - API routes: These are typically prefixed with /api
        - Auth routes: These are typically prefixed with /auth
        - Login and Register pages: These are typically at /login and /register
        - Error page: Typically at /error
        */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
