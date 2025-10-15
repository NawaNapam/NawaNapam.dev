import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage =
          req.nextUrl.pathname.startsWith("/login") ||
          req.nextUrl.pathname.startsWith("/signup");

        // Allow access to auth pages if not logged in
        if (isAuthPage) {
          return true;
        }

        // Require token for protected pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/dashboard",
    // Add other protected routes
  ],
};
