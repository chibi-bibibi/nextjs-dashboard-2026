import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteBook } from '@/app/lib/actions.bookshelf';

export function CreateBook() {
  return (
    <Link
      href="/book-tools/bookshelf/create"
      className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      <span className="hidden md:block">追加</span>
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function CreateBookFab() {
  return (
    <Link
      href="/book-tools/bookshelf/create"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      aria-label="書籍を追加"
    >
      <PlusIcon className="h-6 w-6" />
    </Link>
  );
}

export function CreateFab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      aria-label={label}
    >
      <PlusIcon className="h-6 w-6" />
    </Link>
  );
}

export function UpdateBook({ id }: { id: string }) {
  return (
    <Link
      href={`/book-tools/bookshelf/${id}/edit`}
      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/30"
    >
      <PencilIcon className="w-4 stroke-2" />
    </Link>
  );
}

export function DeleteBook({ id }: { id: string }) {
  const deleteBookWithId = deleteBook.bind(null, id);
  return (
    <form action={deleteBookWithId}>
      <button
        type="submit"
        className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <span className="sr-only">削除</span>
        <TrashIcon className="w-4 stroke-2" />
      </button>
    </form>
  );
}
