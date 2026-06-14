import Link from "next/link";
import PageHeader from "@/app/ui/page-header";
import { BookOpenIcon, UsersIcon, BuildingOfficeIcon, TagIcon } from "@heroicons/react/24/outline";
import { fetchBookSummaryData, fetchMonthlyBookCounts } from "@/app/lib/data.bookshelf";
import BookChart from "@/app/ui/bookshelf/book-chart";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page() {
  const [
    { bookCount, writerCount, publisherCount, tagCount, recentBooks, topWriters, topPublishers, topTags },
    monthlyCounts,
  ] = await Promise.all([fetchBookSummaryData(), fetchMonthlyBookCounts()]);

  const stats = [
    { title: "本棚", value: bookCount, unit: "冊", icon: BookOpenIcon, href: "/book-tools/bookshelf" },
    { title: "著者", value: writerCount, unit: "人", icon: UsersIcon, href: "/book-tools/writers" },
    { title: "出版社", value: publisherCount, unit: "社", icon: BuildingOfficeIcon, href: "/book-tools/publishers" },
    { title: "タグ", value: tagCount, unit: "件", icon: TagIcon, href: "/book-tools/tags" },
  ];

  return (
    <main>
      <PageHeader parent="Books" title="サマリ" className="hidden md:flex" />
      <div className="space-y-5">

        {/* 集計カード */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ title, value, unit, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/50"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{title}</span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {value}
                <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>
              </p>
            </Link>
          ))}
        </div>

        {/* 月別登録グラフ */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">月別登録冊数（過去12ヶ月）</h2>
          <BookChart data={monthlyCounts} />
        </div>

        {/* ランキング */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: "著者", items: topWriters, unit: "冊", href: "/book-tools/writers" },
            { title: "出版社", items: topPublishers, unit: "冊", href: "/book-tools/publishers" },
            { title: "タグ", items: topTags, unit: "冊", href: "/book-tools/tags" },
          ].map(({ title, items, unit, href }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">{title}ランキング</h2>
                <Link href={href} className="text-xs text-primary hover:underline">一覧 →</Link>
              </div>
              {items.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">データがありません</p>
              ) : (
                <ol className="space-y-2">
                  {items.map((item, i) => (
                    <li key={item.name} className="flex items-center gap-3">
                      <span className={`w-5 shrink-0 text-center text-xs font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{item.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.count}{unit}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>

        {/* 最近追加した本 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">最近追加した本</h2>
          {recentBooks.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">まだ登録がありません</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentBooks.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/book-tools/bookshelf/${book.id}`}
                    className="flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                      {book.publisher_name && (
                        <p className="truncate text-xs text-muted-foreground">{book.publisher_name}</p>
                      )}
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-muted-foreground">
                      {fmtDate(book.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Link
              href="/book-tools/bookshelf"
              className="text-xs text-primary hover:underline"
            >
              すべて見る →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
