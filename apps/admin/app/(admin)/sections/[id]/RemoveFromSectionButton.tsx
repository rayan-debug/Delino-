'use client';
import { LogOut } from 'lucide-react';

export default function RemoveFromSectionButton({
  id,
  sectionId,
  title,
  action,
}: {
  id: string;
  sectionId: string;
  title: string;
  action: (fd: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="sectionId" value={sectionId} />
      <button
        type="submit"
        className="btn btn-secondary btn-icon"
        title="Remove from this section"
        onClick={(e) => {
          if (!confirm(`Remove "${title}" from this section? The project itself is not deleted.`))
            e.preventDefault();
        }}
      >
        <LogOut size={14} />
      </button>
    </form>
  );
}
