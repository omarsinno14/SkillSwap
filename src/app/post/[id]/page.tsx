import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: { include: { profile: true } } }
  });
  if (!post) {
    return notFound();
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">
                {post.author.profile?.displayName ?? post.author.email}
              </p>
              <h1 className="text-2xl font-semibold">{post.title}</h1>
            </div>
            <Badge>{post.intentType}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/70">{post.body}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
          <div className="text-sm text-white/50">
            Commitment: {post.commitment ?? "Flexible"} · Schedule: {post.schedule ?? "Open"}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
