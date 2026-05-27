'use client';
import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';

export default function SaveButton({ label = 'Save Changes' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      <Save size={14} /> {pending ? 'Saving…' : label}
    </button>
  );
}
