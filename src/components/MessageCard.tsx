'use client';
import { useState } from 'react';

type Row = { id:string; from_email:string; subject:string; label:string; priority:number };

export default function MessageCard({ row }: { row: Row }) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  async function genDraft() {
    try {
      setLoading(true);
      const res = await fetch(`/api/draft?id=${row.id}`);
      const data = await res.json();
      if (res.ok) setDraft(data.draft);
      else setDraft(`Error: ${data.error ?? 'unknown'}`);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (draft) await navigator.clipboard.writeText(draft);
  }

  return (
    <li className="border rounded-xl p-4">
      <div className="text-sm opacity-70">{row.from_email}</div>
      <div className="font-medium">{row.subject}</div>
      <div className="text-xs mt-1">
        <b>Label:</b> {row.label} &nbsp;|&nbsp; <b>Priority:</b> {row.priority}
      </div>

      <div className="mt-3 flex gap-8 items-center">
        <button
          onClick={genDraft}
          disabled={loading}
          className="px-3 py-1 rounded border"
        >
          {loading ? 'Generating…' : 'Generate draft'}
        </button>
        {draft && (
          <button onClick={copy} className="px-3 py-1 rounded border">Copy</button>
        )}
      </div>

      {draft && (
        <textarea
          className="mt-3 w-full h-40 p-2 border rounded"
          readOnly
          value={draft}
        />
      )}
    </li>
  );
}
