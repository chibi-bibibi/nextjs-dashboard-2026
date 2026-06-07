import PageHeader from "@/app/ui/page-header";
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/outline";

const mockLogs = [
  {
    id: 1,
    title: "リーダブルコード",
    author: "Dustin Boswell",
    status: "読了",
    startDate: "2026-05-01",
    endDate: "2026-05-20",
    rating: 5,
  },
  {
    id: 2,
    title: "Clean Architecture",
    author: "Robert C. Martin",
    status: "読書中",
    startDate: "2026-05-25",
    endDate: null,
    rating: null,
  },
  {
    id: 3,
    title: "ドメイン駆動設計",
    author: "Eric Evans",
    status: "積読",
    startDate: null,
    endDate: null,
    rating: null,
  },
  {
    id: 4,
    title: "プログラマー脳",
    author: "Felienne Hermans",
    status: "読了",
    startDate: "2026-04-10",
    endDate: "2026-04-30",
    rating: 4,
  },
  {
    id: 5,
    title: "SQLアンチパターン",
    author: "Bill Karwin",
    status: "中断",
    startDate: "2026-03-01",
    endDate: null,
    rating: null,
  },
];

const statusConfig: Record<
  string,
  { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string }
> = {
  読了: { icon: CheckCircleIcon, color: "text-green-500" },
  読書中: { icon: BookOpenIcon, color: "text-blue-500" },
  積読: { icon: ClockIcon, color: "text-yellow-500" },
  中断: { icon: PauseCircleIcon, color: "text-muted-foreground" },
};

export default function Page() {
  return (
    <main>
      <PageHeader parent="Books" title="読書録"  className="hidden md:flex" />
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">タイトル</th>
                <th className="pb-3 pr-4 font-medium">作者</th>
                <th className="pb-3 pr-4 font-medium">ステータス</th>
                <th className="pb-3 pr-4 font-medium">開始日</th>
                <th className="pb-3 pr-4 font-medium">終了日</th>
                <th className="pb-3 font-medium">評価</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockLogs.map((log) => {
                const config = statusConfig[log.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {log.title}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {log.author}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`flex items-center gap-1.5 ${config.color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {log.startDate ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {log.endDate ?? "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {log.rating ? "★".repeat(log.rating) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
