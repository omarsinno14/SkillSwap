import Link from "next/link";
import { Bell, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/60 px-6 py-4 backdrop-blur">
      <Link href="/feed" className="text-lg font-semibold text-white">
        LinkUp Pods
      </Link>
      <div className="hidden max-w-lg flex-1 items-center gap-2 md:flex">
        <Search className="h-4 w-4 text-white/50" />
        <Input placeholder="Search pods, mentors, listings" className="bg-transparent" />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" asChild>
          <Link href="/post/new">Create</Link>
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/messages">
            <MessageCircle className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
