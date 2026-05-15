import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-jwt-key-for-dev");
const protectedRoutes = ["/dashboard", "/invoices", "/customers"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname === "/login";

  // Check token validity
  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, secret);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // Logic 1: Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isValid) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (token) response.cookies.delete("session");
    return response;
  }

  // Logic 2: Redirect authenticated users away from auth routes
  if (isAuthRoute && isValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
