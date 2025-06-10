import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!data.name || !data.lastChecked || !data.waitmanage || !data.typeCheck) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ManageMachine');

    await db.collection('Machines').insertOne(data);

    return NextResponse.json({ message: 'Machine added successfully' }, { status: 201 });
  } catch (error) {
    console.error('AddMachine API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
