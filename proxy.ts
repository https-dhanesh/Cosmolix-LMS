import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/api/webhooks/clerk', 
  '/verify(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/teacher(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const currentUrl = new URL(request.url);

  // 1. Kick unauthenticated users out of private routes
  if (!userId && !isPublicRoute(request)) {
    return (await auth()).redirectToSignIn();
  }

  // 2. ROOT & SIGN-IN REDIRECT: Push logged-in users to their respective panels
  if (userId && (currentUrl.pathname === '/' || currentUrl.pathname.startsWith('/sign-in'))) {
    if (role === 'cosmolix_admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (role === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', request.url));
    }
    if (role === 'student') {
      return NextResponse.redirect(new URL('/student', request.url));
    }
  }

  // 3. Admin Route protection
  if (isAdminRoute(request) && role !== 'cosmolix_admin') {
    const fallback = role === 'teacher' ? '/teacher' : '/student';
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  // 4. Teacher Route protection
  if (isTeacherRoute(request) && role !== 'teacher' && role !== 'cosmolix_admin') {
    return NextResponse.redirect(new URL('/student', request.url));
  }

  // 5. Student Route protection
  if (isStudentRoute(request) && role !== 'student' && role !== 'cosmolix_admin') {
    const fallback = role === 'teacher' ? '/teacher' : '/';
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};