import { NextRequest, NextResponse } from 'next/server';

const AUTH_ONLY_ROUTES = ['/sign-in', '/sign-up'];

const PROTECTED_PREFIXES = [
  '/campaigns',
  '/explore',
  '/my-clips',
  '/disputes',
  '/withdrawals',
  '/admin',
  '/dashboard',
  '/profile',
  '/submit-clip',
];

const ROLE_RESTRICTED: { prefix: string; roles: string[] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
];

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString(),
    );

    if (!payload.exp) return true;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const isRoleSelected = request.cookies.get('isRoleSelected')?.value;

  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  let newTokens: { access_token: string; refresh_token: string } | null = null;

  if ((!accessToken || isTokenExpired(accessToken)) && refreshToken) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          cache: 'no-store',
        },
      );

      if (refreshResponse.ok) {
        newTokens = await refreshResponse.json();
        accessToken = newTokens?.access_token;
      }
    } catch {}
  }

  const isAuthenticated = Boolean(accessToken && !isTokenExpired(accessToken));

  if (isAuthOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuthenticated &&
    isRoleSelected === 'false' &&
    pathname !== '/role-selector'
  ) {
    return NextResponse.redirect(new URL('/role-selector', request.url));
  }

  if (isAuthenticated && role) {
    const restriction = ROLE_RESTRICTED.find((r) =>
      pathname.startsWith(r.prefix),
    );
    if (restriction && !restriction.roles.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const response = NextResponse.next();

  if (newTokens) {
    response.cookies.set({
      name: 'accessToken',
      value: newTokens.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    response.cookies.set({
      name: 'refreshToken',
      value: newTokens.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
