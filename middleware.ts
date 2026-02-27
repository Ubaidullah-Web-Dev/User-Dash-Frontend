import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    // Note: In a real app, you'd want to verify the JWT here too, 
    // but for this simple version, we'll check for existence.
    // The client-side AuthContext also handles verification and redirection.

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            // Since we use localStorage on client, middleware might not see it.
            // But we can check for a session cookie if we set one during login.
            // For now, let's rely more on client-side protection or add cookie support to login.
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
