import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/signup", "/verifyemail"];

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; //return decoded payload
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.includes(path);

  const token = request.cookies.get("token")?.value || "";
  const payload = token ? await verifyToken(token) : null;

  //debug logging for role-selection issues
  if (path === "/role-selection") {
    console.log("role-selection access attempt:", {
      path,
      hasToken: !!token,
      payload: payload
        ? {
            role: payload.role,
            teamId: payload.teamId,
            id: payload.id,
          }
        : null,
    });
  }

  //if user is logged in
  if (payload) {
    //and tries to access a public path, redirect them to their dashboard
    if (isPublicPath) {
      if (payload.role === "core_member") {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    //role-based access control for core_member
    if (payload.role === "core_member") {
      //if a core_member is not on a core-member path, redirect them
      if (!path.startsWith("/core-member")) {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }
    } else {
      //if any other logged-in user tries to access a core-member path, redirect them
      if (path.startsWith("/core-member")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    //special flow for participants
    if (payload.role === "participant") {
      if (!payload.teamId) {
        const allowedPaths = ["/join-team", "/create-team"];
        if (!allowedPaths.includes(path)) {
          return NextResponse.redirect(new URL("/join-team", request.url));
        }
      }
      else if (!payload.region) {
        if (path !== "/role-selection") {
          return NextResponse.redirect(new URL("/role-selection", request.url));
        }
      }
      if (payload.region === "hell") {
        const allowedPaths = ["/hell-instructions"];
        if (!allowedPaths.includes(path)) {
          return NextResponse.redirect(
            new URL("/hell-instructions", request.url)
          );
        }
      }
    }
  }

  //if user is not logged in and tries to access a private path, redirect to login
  if (!payload && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
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
    "/verifyemail",
    "/join-team",
    "/create-team",
    "/role-selection",
    "/core-member",
    "/core-member/:path*",
    "/hell-instructions",
  ],
};
