import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import mongoose from 'mongoose';
import { User } from 'next-auth';

export async function POST(request: Request) {
  await dbConnect();
  const { messageId, isPublic } = await request.json();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: userId, 'messages._id': messageId },
      { $set: { 'messages.$.isPublic': isPublic } },
      { new: true }
    );

    if (!user) {
      return Response.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Message visibility updated' });
  } catch (error) {
    console.error('Error updating message visibility:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
