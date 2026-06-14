import PageHeader from "@/app/ui/page-header";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <main>
      <PageHeader parent="Travel" title="サマリ" className="hidden md:flex" />
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-24 text-center">
        <GlobeAltIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">TRAVEL — 準備中</p>
      </div>
    </main>
  );
}
