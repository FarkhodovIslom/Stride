import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For protected routes, check if token exists
  // Note: This is a basic check. Full validation happens on the backend
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/profile/:path*"],
};
