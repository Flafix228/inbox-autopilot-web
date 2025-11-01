import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  // Читаем из ПУБЛИЧНОЙ вьюхи, чтобы не зависеть от схемы app
  const { data: msg, error } = await supabase
    .from('messages_for_draft')
    .select('from_email, subject, body_text')
    .eq('id', id)
    .single();

  if (error || !msg) {
    return NextResponse.json({ error: error?.message ?? 'not found' }, { status: 404 });
  }

  const draft =
`Subject: Re: ${msg.subject}

Hi ${msg.from_email.split('@')[0]},

Thanks for reaching out. I’d love to understand your goals and timeline.
Quick checks:
• Budget range?
• Desired start date?
• Main channel/service you need?

If useful, I can jump on a 20-min call:
• Tue 11:00–11:20
• Wed 15:30–15:50
• Thu 10:00–10:20 (EET)

Best,
Inbox Autopilot`;

  return NextResponse.json({ draft });
}
