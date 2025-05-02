'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('loggedIn', 'true');
      router.push('/'); // redirect ไปหน้าเครื่องจักร
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
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
