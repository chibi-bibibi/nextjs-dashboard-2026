import {
  PlayCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
  実施中: PlayCircleIcon,
  完了: CheckCircleIcon,
  超過: ExclamationCircleIcon,
  未着手: MinusCircleIcon,
};

const stats: { title: keyof typeof iconMap; value: string }[] = [
  { title: "実施中", value: "3件" },
  { title: "完了", value: "12件" },
  { title: "超過", value: "1件" },
  { title: "未着手", value: "5件" },
];

export default function TodosCard() {
  return (
    <>
      {stats.map(({ title, value }) => {
        const Icon = iconMap[title];
        return (
          <div key={title} className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
              <Icon className="h-5 w-5 text-gray-700" />
              <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p
              className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
              {value}
            </p>
          </div>
        );
      })}
    </>
  );
}
