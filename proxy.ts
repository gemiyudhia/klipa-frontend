import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = [
  '/campaigns',
  '/explore',
  '/my-clips',
  '/disputes',
  '/withdrawals',
  '/admin',
];

const ROLE_RESTRICTED: { prefix: string; roles: string[] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
];

const AUTH_ONLY_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isRoleSelected = request.cookies.get('isRoleSelected')?.value;

  if (
    accessToken &&
    isRoleSelected === 'false' &&
    pathname !== '/role-selector'
  ) {
    return NextResponse.redirect(new URL('/role-selector', request.url));
  }

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnlyRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (accessToken && role) {
    const restriction = ROLE_RESTRICTED.find((r) =>
      pathname.startsWith(r.prefix),
    );
    if (restriction && !restriction.roles.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
