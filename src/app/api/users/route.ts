import { NextResponse } from "next/server";
import connectDB  from "@/lib/dbConnect";
import UserModel from "@/model/User";

// GET /api/users → list public profiles
export async function GET() {
  try {
    await connectDB();

    // Find only users who made their profile public
    const users = await UserModel.find(
      { isPublic: true }, // Only show public profiles
      "username name bio image isPublic"
    ).lean();

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No public users found",
        users: [],
      });
    }

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching public users:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching public users",
    });
  }
}

