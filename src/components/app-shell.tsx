import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";

export function AppShell({ children, rightRail }: { children: ReactNode; rightRail?: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-[#0B0B0F] p-6">
          <div className="mx-auto flex max-w-6xl gap-6">
            <div className="flex-1 space-y-6">{children}</div>
            {rightRail ? (
              <aside className="hidden w-72 shrink-0 space-y-4 lg:block">{rightRail}</aside>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
