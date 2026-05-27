import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk', 
  '/verify(.*)',
  '/__clerk(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/teacher(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (!userId && !isPublicRoute(request)) {
    return (await auth()).redirectToSignIn();
  }

  if (isAdminRoute(request) && role !== 'cosmolix_admin') {
    const fallback = role === 'teacher' ? '/teacher' : '/student';
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  if (isTeacherRoute(request) && role !== 'teacher' && role !== 'cosmolix_admin') {
    return NextResponse.redirect(new URL('/student', request.url));
  }

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
    '/__clerk/(.*)',
  ],
};