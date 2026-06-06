import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-2 leading-none text-foreground`}
    >
      <Image
        src="/main-logo.png"
        loading="eager"
        alt="Logo"
        width={48}
        height={32}
        className="shrink-0"
      />
      <p className="text-[28px] whitespace-nowrap">pf-ToolBox</p>
    </div>
  );
}
