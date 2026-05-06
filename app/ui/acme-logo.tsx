import { lusitana } from "@/app/ui/fonts";

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-base-foreground`}
    >
      <p className="text-[28px]">Acme</p>
    </div>
  );
}
