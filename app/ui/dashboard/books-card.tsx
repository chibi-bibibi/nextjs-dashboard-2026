import {
  EyeIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
  気になる: EyeIcon,
  登録: BookmarkIcon,
};

const stats: { title: keyof typeof iconMap; value: string }[] = [
  { title: "気になる", value: "36冊" },
  { title: "登録", value: "36冊" },
];

export default function BooksCard() {
  return (
    <>
      {stats.map(({ title, value }) => {
        const Icon = iconMap[title];
        return (
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
        );
      })}
    </>
  );
}
