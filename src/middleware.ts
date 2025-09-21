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

async function getCurrentRoundStatus() {
  try {
    const response = await fetch(`/api/get-game-stat`);
    const data = await response.json();
    
    const now = Date.now();
    const r1Start = new Date(data.r1StartTime).getTime();
    const r1End = new Date(data.r1EndTime).getTime();
    const r2Start = new Date(data.r2StartTime).getTime();
    const r2End = new Date(data.r2EndTime).getTime();

    if (now < r1Start) {
      return "Not Started";
    } else if (now >= r1Start && now <= r1End) {
      return "Round 1";
    } else if (now > r1End && now < r2Start) {
      return "Half Time";
    } else if (now >= r2Start && now <= r2End) {
      return "Round 2";
    } else {
      return "Finished";
    }
  } catch (err) {
    console.error("Failed to fetch game stats in middleware:", err);
    return "Not Started"; 
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
      if (!path.startsWith("/core-member")) {
        return NextResponse.redirect(new URL("/core-member", request.url));
      }
    } else if (path.startsWith("/core-member")) {
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
      } else {
        const currentRound = await getCurrentRoundStatus();

        if (payload.region === "hell") {
            const allowedPaths = ["/hell-instructions"];
            if (!allowedPaths.includes(path)) {
              return NextResponse.redirect(new URL("/hell-instructions", request.url));
          }
        } else if (payload.region === "earth") {
          if (currentRound === "Round 1" || currentRound === "Round 2") {
            const allowedPaths = ["/instructions"];
            if (!allowedPaths.includes(path)) {
              return NextResponse.redirect(new URL("/instructions", request.url));
            }
          }
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
    "/game/:path*",
    "/puzzle/:path*", 
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