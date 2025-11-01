import MessageCard from '@/components/MessageCard';
import { supabase } from '@/lib/supabase';

type Row = {
  id: string;
  from_email: string;
  subject: string;
  received_at: string;
  label: string;
  priority: number;
};

export default async function Page() {
  const { data, error } = await supabase
    .from('messages_view')
    .select('*');

  if (error) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Inbox Autopilot — Queue</h1>
        <div className="text-red-600">Ошибка: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inbox Autopilot — Queue</h1>
      <ul className="space-y-3">
        {data && data.length ? data.map((m: Row) => (
          <MessageCard key={m.id} row={m} />
        )) : <div>Нет писем</div>}
      </ul>
    </main>
  );
}
