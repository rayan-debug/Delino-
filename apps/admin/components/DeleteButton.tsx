'use client';
import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ confirmText = 'Delete this item?' }: { confirmText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-danger btn-icon"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}
