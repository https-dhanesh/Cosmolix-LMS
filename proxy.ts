import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk', 
  '/verify(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isTeacherRoute = createRouteMatcher(['/teacher(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  
  console.log("Current User Role:", role);

  if (!userId && !isPublicRoute(request)) {
    return (await auth()).redirectToSignIn();
  }

  if (isAdminRoute(request) && role !== 'cosmolix_admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isTeacherRoute(request) && role !== 'teacher' && role !== 'cosmolix_admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isStudentRoute(request) && role !== 'student' && role !== 'cosmolix_admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};