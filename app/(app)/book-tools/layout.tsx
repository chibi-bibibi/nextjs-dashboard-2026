import { lusitana } from "@/app/ui/fonts";
import BooksTabs from "@/app/ui/dashboard/books-tabs";

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <BooksTabs />
      {children}
    </div>
  );
}
