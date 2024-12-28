import connectDb from '@/lib/db';
import { jsonResponse } from '@/lib/jsonResponse';
import Post from '@/models/postModel';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface postRequestBody {
  image: string[];
  caption?: string;
  tags?: string[];
}

//  connect to Db
await connectDb();

export async function POST(request: NextRequest) {
  try {
    const { image, caption, tags }: postRequestBody = await request.json();

    if (!image || image.length === 0) {
      return jsonResponse({ error: 'Image is required.' }, 400);
    }
    const authToken = request.cookies.get('authToken')?.value; // Extract Token
    if (!authToken) {
      return jsonResponse({ error: 'Unauthorized.' }, 401);
    }

    // verify token and decode
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET!);

    // Ensure decodedToken is an object with the expected structure
    if (typeof decodedToken === 'string' || !('id' in decodedToken)) {
      return jsonResponse({ error: 'Invalid token.' }, 401);
    }
   

    const newPost = await Post.create({
      image,
      caption,
      tags,
      author: decodedToken.id,
    });

    return jsonResponse({ message: 'Post uploaded successfully.', post: newPost }, 200);
  } catch (error) {
    const posterror = error as Error;
    return jsonResponse({ error: posterror.message }, 500);
  }
};

export async function GET(request: NextRequest) {

}
