import Link from "next/link";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PodsPage() {
  const pods = await prisma.pod.findMany({
    where: { status: "ACTIVE" },
    include: { members: true },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pods</h1>
          <p className="text-white/60">Accountability groups with weekly check-ins.</p>
        </div>
        <Button asChild>
          <Link href="/pods/new">Create pod</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {pods.map((pod) => (
          <Card key={pod.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{pod.name}</h2>
                <Badge>{pod.joinPolicy}</Badge>
              </div>
              <p className="text-sm text-white/60">{pod.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {pod.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <p className="text-sm text-white/50">
                {pod.members.length} / {pod.maxMembers} members
              </p>
              <Button variant="secondary" asChild>
                <Link href={`/pods/${pod.id}`}>View pod</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
