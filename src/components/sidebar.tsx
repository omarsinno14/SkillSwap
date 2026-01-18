import Link from "next/link";
import { Home, Users, Sparkles, Store, GraduationCap, Settings } from "lucide-react";

const items = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/pods", label: "Pods", icon: Users },
  { href: "/matches", label: "Matches", icon: Sparkles },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/mentors", label: "Mentors", icon: GraduationCap },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 flex-col gap-2 border-r border-white/10 bg-black/40 px-4 py-6 md:flex">
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">Navigate</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
