import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const tUser = await getUserFromToken(req);

    if (!tUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json({ error: "Provide the page number" }, { status: 400 });
    }

    const Users = await User.find({})
      .sort({ fullname: 1 })
      .skip((+page - 1) * 10)
      .limit(10);

    const userList = Users.map((user: any, index: number) => ({
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      region: user.region,
      teamId: user.teamId,
    }));

    return NextResponse.json(
      { message: "User list fetched successfully", data: userList, totalCount: await User.countDocuments() },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in GET /api/admin/users-list", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}