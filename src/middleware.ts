import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/signup", "/verifyemail"];

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
  const isPublicPath = PUBLIC_PATHS.some((p) => path.startsWith(p));

  const token = request.cookies.get("token")?.value || "";
  const payload = token ? await verifyToken(token) : null;

  if (payload) {
    const role = payload.role;

    if (isPublicPath) {
      if (role === "core_member") {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "admin") {
      if (!path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } else if (path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "core_member") {
      if (!payload.core_allocated_station) {
        if (path !== "/chooseStation") {
          return NextResponse.redirect(new URL("/chooseStation", request.url));
        }
      } else if (!path.startsWith("/core-member")) {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }
    } else if (path.startsWith("/core-member") || path === "/chooseStation") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "participant") {
      if (!payload.teamId) {
        const allowedPaths = ["/join-team", "/create-team"];
        if (!allowedPaths.includes(path)) {
          return NextResponse.redirect(new URL("/join-team", request.url));
        }
      } else if (!payload.region) {
        if (path !== "/role-selection") {
          return NextResponse.redirect(new URL("/role-selection", request.url));
        }
      } else if (payload.region === "hell") {
        const allowedPaths = ["/hell-instructions"];
        if (!allowedPaths.includes(path)) {
          return NextResponse.redirect(new URL("/hell-instructions", request.url));
        }
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
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail/:path*", 
    "/join-team",
    "/create-team",
    "/role-selection",
    "/chooseStation",
    "/core-member",
    "/core-member/:path*",
    "/admin/:path*",
    "/hell-instructions",
  ],
};
