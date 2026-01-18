import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-black via-[#12091D] to-black p-10">
        <h1 className="text-4xl font-semibold">Welcome back to LinkUp Pods</h1>
        <p className="text-white/70">Jump into the community feed or continue your pod streaks.</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/feed">Go to Feed</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/pods">View Pods</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-black via-[#12091D] to-black p-10 text-center">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">LinkUp Pods</p>
        <h1 className="text-5xl font-semibold">Find your people to level up.</h1>
        <p className="text-white/70">
          A social marketplace and accountability network for swaps, mentoring, pods, and micro-mentors.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/auth/sign-up">Create account</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
