import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    
    return NextResponse.json({
      tokenData: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        core_allocated_station: decoded.core_allocated_station || "NOT SET"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token", details: error });
  }
}