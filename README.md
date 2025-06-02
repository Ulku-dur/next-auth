# 🔐 Next.js 14 + Auth0 + NextAuth.js + TailwindCSS + Role-Based Authentication

Bu proje, **Next.js App Router** ile geliştirilmiş, **Auth0** ve **NextAuth.js** kullanarak kimlik doğrulama ve **rol tabanlı erişim kontrolü (RBAC)** sağlayan bir örnek uygulamadır.

Kullanıcılar, **admin** veya **user** rolüne göre korumalı sayfalara yönlendirilir.

---

## 🚀 Özellikler

- ✅ Next.js 14 App Router mimarisi
- ✅ Auth0 + NextAuth.js ile güvenli kimlik doğrulama
- ✅ Kullanıcı rollerine göre yönlendirme (admin/user)
- ✅ Middleware ile korumalı route erişimi
- ✅ TailwindCSS ile şık ve sade arayüz
- ✅ Token'a özel namespace ile role aktarımı
- ✅ SessionProvider ile oturum yönetimi

---

## ⚙️ Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/Ulku-dur/next-auth.git
cd next-auth
npm install
.env.local dosyasını oluşturun ve içeriğini şu şekilde ayarlayın:
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your_auth0_domain

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_generated_secret
Değerleri Auth0 panelinizden alın. NEXTAUTH_SECRET için şunu çalıştırabilirsiniz:
openssl rand -base64 32
▶️ Projeyi Başlatmak

npm run dev
Ardından http://localhost:3000 adresine gidin.

📁 Önemli Dosya ve Yapılar

✅ middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const roles = token?.['https://dev-ulku-app/roles'];
  const pathname = req.nextUrl.pathname;

  console.log('⛔ ROLE KONTROLÜ:', roles);
  console.log('📍 PATHNAME:', pathname);

  if (pathname.startsWith('/dashboard/admin')) {
    if (!Array.isArray(roles) || !roles.includes('admin')) {
      return NextResponse.redirect(new URL('/denied', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
✅ route.ts (NextAuth config)
import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
✅ Auth0 Post-Login Action (AddUserRoleToToken)
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://dev-ulku-app';

  if (event.authorization) {
    const assignedRoles = event.authorization.roles;
    api.idToken.setCustomClaim(`${namespace}/roles`, assignedRoles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, assignedRoles);
  }
};
Auth0 > Actions > Flows > Login → içine bu Action’ı eklemeyi unutma.
📂 Sayfa Yapısı

/dashboard/admin: Sadece admin rolüne sahip kullanıcılar girebilir
/dashboard/user: Sadece user rolüne sahip kullanıcılar girebilir
/denied: Yetkisiz erişim sayfası
/api/auth/[...nextauth]: Auth0 sağlayıcısı üzerinden login işle
```
