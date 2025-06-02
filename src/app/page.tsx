'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-center mt-10 text-gray-500">Yükleniyor...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      {session ? (
        <>
          <h1 className="text-2xl font-bold">Hoş geldin, {session.user?.name || session.user?.email}!</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl text-red-600">Giriş yapılmadı.</h1>
          <button
            onClick={() => signIn('auth0', { callbackUrl: '/dashboard' })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Giriş Yap
          </button>
        </>
      )}
    </main>
  );
}
