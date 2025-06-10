import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Missing machine name' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ManageMachine');

    const result = await db.collection('Machines').deleteOne({ name });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'ไม่พบเครื่องจักรที่ต้องการลบ' }, { status: 404 });
    }

    return NextResponse.json({ message: 'ลบเครื่องจักรเรียบร้อยแล้ว' }, { status: 200 });
  } catch (error) {
    console.error('DeleteMachine API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
