interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
}

import connectDb from '@/lib/db';
import { jsonResponse } from '@/lib/jsonResponse';
import { NextRequest } from 'next/server';
import User, { IUser } from '@/models/usersModel';

// connect to Database
await connectDb();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password }: RegisterRequestBody = await request.json();

    // TODO: implement checks
    if (!username || !email || !password) {
      return jsonResponse({ error: 'All fields are required.' }, 400);
    }

    // TODO: improve username functionality

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return jsonResponse({ error: 'User already exists' }, 400);
    }

    // TODO: Find a way
    const newUser: IUser = await User.create({ username, email, password });
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return jsonResponse(
      { message: 'User registered successfully.', user: userWithoutPassword },
      200,
    );
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// TODO: further optimization
// rate limiter
