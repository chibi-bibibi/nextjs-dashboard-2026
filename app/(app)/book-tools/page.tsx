import PageHeader from "@/app/ui/page-header";
import { EyeIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const stats = [
  { title: "気になる", value: "36冊", icon: EyeIcon },
  { title: "登録", value: "36冊", icon: BookmarkIcon },
];

export default function Page() {
  return (
    <main>
      <PageHeader parent="Books" title="サマリ" className="hidden md:flex" />
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, value, icon: Icon }) => (
            <div key={title} className="rounded-xl bg-muted p-2 shadow-sm">
              <div className="flex p-4">
                <Icon className="h-5 w-5 text-foreground" />
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
              </div>
              <p
                className={`${lusitana.className} truncate rounded-xl bg-card px-4 py-8 text-center text-2xl`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
