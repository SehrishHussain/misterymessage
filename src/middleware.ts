import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Define public routes that should be accessible without authentication
    const publicRoutes = ['/sign-in', '/signup', '/verify', '/'];

    // Redirect authenticated users away from public routes to dashboard
    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protect private routes (require authentication)
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow access to public routes and other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/signup',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};