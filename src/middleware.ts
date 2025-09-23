import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getCurrentRound } from "./utils/getRound";

const PUBLIC_PATHS = ["/login", "/signup"];

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
  const path = request.nextUrl.pathname;

  const isPublicPath =
    PUBLIC_PATHS.includes(path) || path.startsWith("/verifyemail");

  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (payload) {
    const role = payload.role;

    if (isPublicPath) {
      if (role === "core_member")
        return path === "/core-member"
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/core-member", request.url));
      if (role === "admin")
        return path === "/admin"
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "admin" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role !== "admin" && path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "core_member") {
      // if (
      //   !payload.core_allocated_station &&
      //   path !== "/core-member/choose-station"
      // ) {
      //   return NextResponse.redirect(
      //     new URL("/core-member/choose-station", request.url)
      //   );
      // }

      if (!path.startsWith("/core-member")) {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }

      if (!payload.core_allocated_station && path !== "/core-member/choose-station") {
        return NextResponse.redirect(
          new URL("/core-member/choose-station", request.url)
        );
      }
    }
    if (role !== "core_member" && path.startsWith("/core-member")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "participant") {
      if (!payload.teamId && path !== "/join-team" && path !== "/create-team") {
        return NextResponse.redirect(new URL("/join-team", request.url));
      }
      if (payload.teamId && !payload.region && path !== "/role-selection") {
        return NextResponse.redirect(new URL("/role-selection", request.url));
      }
      if (payload.region === "hell" && path !== "/hell-instructions") {
        return NextResponse.redirect(
          new URL("/hell-instructions", request.url)
        );
      }
      if (payload.region === "earth") {
      }
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
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
