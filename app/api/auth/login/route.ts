import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward login request to backend
    const response = await axios.post(`${API_URL}/api/auth/login`, body);
    
    const { token, user } = response.data;
    
    // Create response with user data
    const nextResponse = NextResponse.json({ user }, { status: 200 });
    
    // Set JWT token in httpOnly cookie
    nextResponse.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.error || 'Authentication failed' },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
