import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '@/lib/s3Client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imageDetails } = await req.json();
    const urls = await Promise.all(
      imageDetails.map(async image => {
        const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: image.name });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 15 * 60 });
        return url;
      }),
    );
    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
