import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: 'MongoDB Connected!' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ success: false, error: 'Connection failed' }, { status: 500 });
  }
}
