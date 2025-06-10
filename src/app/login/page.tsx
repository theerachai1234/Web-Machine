'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      localStorage.setItem('loggedIn', 'true');
      router.push('/'); // เข้าหน้าหลัก
    } else {
      const data = await res.json();
      setError(data.message || 'เข้าสู่ระบบล้มเหลว');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eae5e2]">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-[#543b30]">เข้าสู่ระบบ</h2>
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-[#543b30] text-white px-4 py-2 rounded w-full"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}
