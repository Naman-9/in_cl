import { jsonResponse } from '@/lib/jsonResponse';

export async function POST() {
  try {
    const response = jsonResponse(
      {
        message: 'Logout Successful.',
      },
      200,
    );

    // set token as HTTP-only cookie
    response.cookies.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error.message);
    return jsonResponse({ error: 'Logout failed. Please try again later.' }, 500);
  }
}
