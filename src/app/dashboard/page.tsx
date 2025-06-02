'use client';

import { useSession, signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Yükleniyor...</p>;
  }

  if (!session) {
    return <p>Giriş yapılmamış.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">Hoş geldin, {session.user?.name || session.user?.email}!</h1>
      <p className="mt-2 text-gray-600">Genel kullanıcı paneline hoş geldiniz.</p>
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
