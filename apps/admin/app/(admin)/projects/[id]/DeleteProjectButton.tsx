'use client';
import { Trash2 } from 'lucide-react';

export default function DeleteProjectButton({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action: (fd: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="btn btn-danger"
        onClick={(e) => {
          if (!confirm(`Delete "${title}"? This cannot be undone.`)) e.preventDefault();
        }}
      >
        <Trash2 size={14} /> Delete
      </button>
    </form>
  );
}
