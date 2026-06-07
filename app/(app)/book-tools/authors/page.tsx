import PageHeader from "@/app/ui/page-header";

export default function Page() {
  return (
    <main>
      <PageHeader parent="Books" title="著者" />
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">コンテンツは準備中です。</p>
      </div>
    </main>
  );
}
