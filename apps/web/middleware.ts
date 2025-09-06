import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/signup", "/api/auth", "/api/signup"];

    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(
      (route) => pathname.startsWith(route) || pathname === route
    );

    // Admin routes (add your admin paths here)
    const adminRoutes = ["/admin"];
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If user is not authenticated and trying to access protected route
    if (!token && !isPublicRoute) {
      console.log(
        `Redirecting unauthenticated user from ${pathname} to /login`
      );
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is authenticated and trying to access login/signup pages
    if (token && (pathname === "/login" || pathname === "/signup")) {
      console.log(
        `Redirecting authenticated user from ${pathname} to /dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If authenticated user tries to access root, redirect to dashboard
    if (token && pathname === "/") {
      console.log(`Redirecting authenticated user from root to /dashboard`);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin route protection
    if (isAdminRoute && token?.role !== "admin") {
      console.log(
        `Redirecting non-admin user from ${pathname} to /unauthorized`
      );
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        const publicRoutes = [
          "/",
          "/login",
          "/signup",
          "/api/auth",
          "/api/signup",
        ];
        const isPublicRoute = publicRoutes.some(
          (route) => pathname.startsWith(route) || pathname === route
        );

        if (isPublicRoute) return true;

        // For protected routes, require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
