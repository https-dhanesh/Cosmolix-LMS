import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define paths that do not require an active session
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk', 
  '/verify(.*)',
  '/__clerk(.*)' // Protect the proxy endpoint from throwing auth loops
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/teacher(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(
  async (auth, request) => {
    const { userId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    // 1. Unauthenticated users trying to access private routes
    if (!userId && !isPublicRoute(request)) {
      return (await auth()).redirectToSignIn();
    }

    // 2. Strict Admin Route Guard
    if (isAdminRoute(request) && role !== 'cosmolix_admin') {
      const fallback = role === 'teacher' ? '/teacher' : '/student';
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    // 3. Strict Teacher Route Guard
    if (isTeacherRoute(request) && role !== 'teacher' && role !== 'cosmolix_admin') {
      return NextResponse.redirect(new URL('/student', request.url));
    }

    // 4. Strict Student Route Guard
    if (isStudentRoute(request) && role !== 'student' && role !== 'cosmolix_admin') {
      const fallback = role === 'teacher' ? '/teacher' : '/';
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    return NextResponse.next();
  },
  {
    frontendApiProxy: true,
  }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};