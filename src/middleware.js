import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";

// Guard the /admin pages (redirect to login). API routes self-verify.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(process.env.ADMIN_SESSION_SECRET, token);
  if (ok) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
