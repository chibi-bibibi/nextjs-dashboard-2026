import { lusitana } from "@/app/ui/fonts";
import BooksTabs from "@/app/ui/dashboard/books-tabs";

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>Books</h1>
      <BooksTabs />
      {children}
    </div>
  );
}
