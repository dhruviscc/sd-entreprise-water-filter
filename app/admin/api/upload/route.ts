import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    return (error as any).message || JSON.stringify(error);
  }
  return String(error);
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof (file as any).arrayBuffer !== 'function' || typeof (file as any).name !== 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = (file as any).name as string;
    const fileType = (file as any).type as string;
    if (!fileType?.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await (file as any).arrayBuffer());
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image size must be less than 4MB' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const extension = path.extname(fileName) || '.jpg';
    const safeName = path.basename(fileName, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const timestamp = Date.now();
    const filename = `${safeName}-${timestamp}${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
