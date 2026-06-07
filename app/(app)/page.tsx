import PageHeader from "@/app/ui/page-header";

export default function HomePage() {
  return (
    <main>
      <PageHeader parent="メイン" title="ホーム" />
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">コンテンツは準備中です。</p>
      </div>
    </main>
  );
}
