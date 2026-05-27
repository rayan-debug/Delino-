'use client';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button type="submit" className="flex items-center gap-2 hover:text-[color:var(--c-accent)]">
        <LogOut size={14} /> Sign out
      </button>
    </form>
  );
}
