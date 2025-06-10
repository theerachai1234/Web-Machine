// app/api/login/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบ' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('ManageMachine');
    const users = db.collection('Users');
    const user = await users.findOne({ username });
    
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านผิด' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
  }  catch (error) {
    if (error instanceof Error) {
      // ตอนนี้ TypeScript รู้ว่า `error` เป็น `Error` แล้ว
      console.error(error.message); // สามารถใช้ error.message ได้
    } else {
      // ถ้า `error` ไม่ใช่ `Error`
      console.error('Unknown error occurred');
    }
  }
}
