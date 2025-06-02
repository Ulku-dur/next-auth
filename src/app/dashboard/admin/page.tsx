'use client';

import { useSession, signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Yükleniyor...</p>;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🛠️ Admin Paneli</h1>
      <p>
        Hoş geldin, <strong>{session.user?.name || session.user?.email}</strong>!
      </p>
      <p>Email: {session.user?.email}</p>
      <p>Yetkili Roller: {(session?.user as any)?.roles?.join(', ')}</p>

      <button
        onClick={() => signOut()}
        style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px 20px', marginTop: '1rem' }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}
