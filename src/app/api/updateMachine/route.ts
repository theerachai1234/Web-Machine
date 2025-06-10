import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // ตรวจสอบว่า field ที่จำเป็นมีไหม
    if (!data.name) {
      return NextResponse.json({ error: 'Missing machine name' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ManageMachine');

    // อัปเดตข้อมูลตามชื่อเครื่อง (กรณี name เป็น unique key)
    const result = await db.collection('Machines').updateOne(
      { name: data.name }, // filter
      {
        $set: {
          lastChecked: data.lastChecked,
          waitmanage: data.waitmanage,
          typeCheck: data.typeCheck,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Machine updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('UpdateMachine API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
