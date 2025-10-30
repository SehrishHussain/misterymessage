import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // 1️⃣ Check if username already exists
    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // 2️⃣ Check if email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: 'User already exists with this email.',
        },
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new verified user directly (no verification code)
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: true, // ✅ directly mark as verified
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();

    // 5️⃣ Success response
    return Response.json(
      {
        success: true,
        message: 'User registered successfully. You can now sign in.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user. Please try again later.',
      },
      { status: 500 }
    );
  }
}
