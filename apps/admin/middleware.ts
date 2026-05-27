import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, SESSION_COOKIE_NAME } from '@luxora/shared/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname === '/login';
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/api/health');

  if (isPublicAsset) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (session && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
};
