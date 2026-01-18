import Link from "next/link";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function FeedPage() {
  const posts = await prisma.post.findMany({
    where: { status: "ACTIVE" },
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return (
    <AppShell
      rightRail={
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-white">Trending tags</h3>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["fitness", "react", "ux", "marketing", "language"].map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </CardContent>
        </Card>
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Looking For</h1>
          <p className="text-white/60">Swap, mentor, pod, and request posts from the community.</p>
        </div>
        <Button asChild>
          <Link href="/post/new">Create post</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">
                    {post.author.profile?.displayName ?? post.author.email}
                  </p>
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                </div>
                <Badge>{post.intentType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white/70">{post.body}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <Button variant="secondary" asChild>
                <Link href={`/post/${post.id}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
