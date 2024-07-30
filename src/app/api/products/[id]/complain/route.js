import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const productsCollection = await db.collection('products');
    const { id } = params;
    const data = await req.json();

    await productsCollection.updateOne({ _id: new ObjectId(id) }, { $push: { complain: data } });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}