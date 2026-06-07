import NavDrawer from "@/app/ui/dashboard/nav-drawer";
import { auth } from "@/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <div className="bg-background flex h-screen flex-col md:flex-row md:overflow-hidden">
      <NavDrawer user={user} />
      <div className="grow bg-background overflow-y-auto p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
