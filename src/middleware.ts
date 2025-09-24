import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/signup"];

function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); 
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS") {
    return withCORS(new NextResponse(null, { status: 204 }));
  }

  const isPublicPath =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/verifyemail");

  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (payload) {
    const role = payload.role;

    if (isPublicPath) {
      if (role === "core_member") {
        return withCORS(
          pathname === "/core-member"
            ? NextResponse.next()
            : NextResponse.redirect(new URL("/core-member", request.url))
        );
      }
      if (role === "admin") {
        return withCORS(
          pathname === "/admin"
            ? NextResponse.next()
            : NextResponse.redirect(new URL("/admin", request.url))
        );
      }
      return withCORS(
        NextResponse.redirect(new URL("/", request.url))
      );
    }

    if (role === "admin" && !pathname.startsWith("/admin")) {
      return withCORS(NextResponse.redirect(new URL("/admin", request.url)));
    }
    if (role !== "admin" && pathname.startsWith("/admin")) {
      return withCORS(NextResponse.redirect(new URL("/", request.url)));
    }

    if (role === "core_member") {

      if (!pathname.startsWith("/core-member")) {
        return withCORS(NextResponse.redirect(new URL("/core-member", request.url)));
      }
      if (
        !payload.core_allocated_station &&
        pathname !== "/core-member/choose-station"
      ) {
        return withCORS(
          NextResponse.redirect(new URL("/core-member/choose-station", request.url))
        );
      }
    }
    if (role !== "core_member" && pathname.startsWith("/core-member")) {
      return withCORS(NextResponse.redirect(new URL("/", request.url)));
    }

    if (role === "participant") {
      if (
        !payload.teamId &&
        pathname !== "/join-team" &&
        pathname !== "/create-team"
      ) {
        return withCORS(NextResponse.redirect(new URL("/join-team", request.url)));
      }
      if (
        payload.teamId &&
        !payload.region &&
        pathname !== "/role-selection"
      ) {
        return withCORS(NextResponse.redirect(new URL("/role-selection", request.url)));
      }
      if (
        payload.region === "hell" &&
        pathname !== "/hell-instructions"
      ) {
        return withCORS(
          NextResponse.redirect(new URL("/hell-instructions", request.url))
        );
      }
    }
  }
  else if (!isPublicPath) {
    return withCORS(NextResponse.redirect(new URL("/login", request.url)));
  }

  return withCORS(NextResponse.next());
}

export const config = {
  matcher: [
    "/",
    "/leaderboard/:path*",
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail/:path*",
    "/join-team",
    "/create-team",
    "/role-selection",
    "/core-member",
    "/core-member/:path*",
    "/admin/:path*",
    "/hell-instructions",
    "/instructions",
  ],
};
