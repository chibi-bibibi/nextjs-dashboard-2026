import { lusitana } from "@/app/ui/fonts";

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-6 text-2xl`}>Books</h1>
      {children}
    </div>
  );
}
