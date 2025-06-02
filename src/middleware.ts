import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const roles = token?.['https://dev-ulku-app/roles'];
  const pathname = req.nextUrl.pathname;

  console.log('⛔ ROLE KONTROLÜ:', roles);
  console.log('📍 PATHNAME:', pathname);

  // Admin paneline sadece admin girebilir
  if (pathname.startsWith('/dashboard/admin')) {
    if (!Array.isArray(roles) || !roles.includes('admin')) {
      console.log('🚫 Admin paneline yetkisiz giriş');
      return NextResponse.redirect(new URL('/denied', req.url));
    }
  }

  // Kullanıcı paneline sadece user girebilir
  if (pathname.startsWith('/dashboard/user')) {
    if (!Array.isArray(roles) || !roles.includes('user')) {
      console.log('🚫 Kullanıcı paneline yetkisiz giriş');
      return NextResponse.redirect(new URL('/denied', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
