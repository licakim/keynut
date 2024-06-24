import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { state } = await req.json();

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: { state: state === 1 ? 0 : 1 } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
