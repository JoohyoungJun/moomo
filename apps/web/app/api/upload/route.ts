import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

const BUCKET = 'moomo-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: '파일이 없습니다.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: '이미지 파일만 업로드 할 수 있습니다.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 },
      );
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const supabase = createSupabaseAdmin();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { message: uploadError.message },
        { status: 500 },
      );
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ message: '업로드 실패' }, { status: 500 });
  }
}
