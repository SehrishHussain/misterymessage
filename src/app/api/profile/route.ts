import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const user = await UserModel.findOne(
    { email: session.user.email },
    "username name bio image isPublic isAcceptingMessages"
  ).lean();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, user });
}

export async function PATCH(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { name, bio, image, isPublic } = body;

  const updatedUser = await UserModel.findOneAndUpdate(
    { email: session.user.email },
    { name, bio, image, isPublic },
    { new: true }
  ).lean();

  return NextResponse.json({ success: true, user: updatedUser });
}
