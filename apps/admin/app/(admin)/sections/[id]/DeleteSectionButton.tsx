'use client';
import { Trash2 } from 'lucide-react';

export default function DeleteSectionButton({
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
          if (
            !confirm(
              `Delete the section "${title}"?\n\nIts projects are kept — they just stop being grouped under this section.`
            )
          )
            e.preventDefault();
        }}
      >
        <Trash2 size={14} /> Delete Section
      </button>
    </form>
  );
}
