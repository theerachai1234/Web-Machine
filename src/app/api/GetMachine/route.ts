// app/api/machines/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
   const client = await clientPromise;
    const db = client.db('ManageMachine');
    const machines = await db.collection('Machines').find({}).toArray();

    return NextResponse.json(machines);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 });
  }
}
