import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  console.log("Session user:", session?.user);

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    // Fetch only the logged-in user's messages
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const allMessages = user[0].messages || [];

    // Separate public and private messages
    const publicMessages = allMessages.filter((msg: any) => msg.isPublic);
    const privateMessages = allMessages.filter((msg: any) => !msg.isPublic);

    return Response.json(
      {
        success: true,
        publicMessages,
        privateMessages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
