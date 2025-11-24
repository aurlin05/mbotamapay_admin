import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// export async function GET(request: NextRequest) {
//   try {
//     const token = request.cookies.get('auth-token')?.value;
    
//     if (!token) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }
    
//     // Forward request to backend with token
//     const response = await axios.get(`${API_URL}/api/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
    
//     return NextResponse.json(response.data, { status: 200 });
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return NextResponse.json(
//         { error: error.response.data.error || 'Failed to get user' },
//         { status: error.response.status }
//       );
//     }
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  // 🔒 Mock démo : user factice
  return NextResponse.json({
    id: '1',
    email: 'admin@mbotamapay.com',
    name: 'Admin',
  });
}
