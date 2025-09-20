import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function getUserFromToken(req: NextRequest) {
  // First try cookie
  let token = req.cookies.get("token")?.value;

  // If no cookie, try Authorization header
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
