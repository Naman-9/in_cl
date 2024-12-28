import connectDb from '@/lib/db';
import { jsonResponse } from '@/lib/jsonResponse';
import { NextRequest } from 'next/server';
import User, { IUser } from '@/models/usersModel';
import jwt from 'jsonwebtoken';

interface LoginRequestBody {
  identifier: string;
  password: string;
}

// connect to database
await connectDb();
export async function POST(request: NextRequest) {
  try {
    const { identifier, password }: LoginRequestBody = await request.json();

    // identifier -> can be username or email
    if (!identifier || !password) {
      return jsonResponse({ error: 'Enter both the fields.' }, 400);
    }

    // find user in database with email or username
    const user: IUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('-password');

    if (!user) {
      return jsonResponse({ error: 'Invalid Credentials.' }, 401);
    }

    // verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return jsonResponse({ error: 'Invalid Credentials.' }, 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    );

    const response = jsonResponse(
      {
        message: 'Login Successful.',
        user: { id: user._id, email: user.email, username: user.username },
      },
      200,
    );

    // set token as HTTP-only cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // return user details and token
    return response;
  } catch (error) {
    
    jsonResponse({ error: error.message }, 500);
  }
}
