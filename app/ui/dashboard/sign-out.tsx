import { PowerIcon } from "@heroicons/react/24/outline";
import { handleSignOut } from "@/app/lib/actions";

export default function SignOutButton() {
  return (
    <form action={handleSignOut} className="mx-3 mb-4">
      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </form>
  );
}
