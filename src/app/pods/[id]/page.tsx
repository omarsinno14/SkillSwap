import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckinForm } from "@/components/checkin-form";

export default async function PodDetailPage({ params }: { params: { id: string } }) {
  const pod = await prisma.pod.findUnique({
    where: { id: params.id },
    include: { members: { include: { user: { include: { profile: true } } } }, checkins: true }
  });
  if (!pod) {
    return notFound();
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{pod.name}</h1>
            <Badge>{pod.joinPolicy}</Badge>
          </div>
          <p className="text-white/60">{pod.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {pod.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold">Members</h3>
            <ul className="mt-2 space-y-1 text-sm text-white/70">
              {pod.members.map((member) => (
                <li key={member.id}>
                  {member.user.profile?.displayName ?? member.user.email} · streak {member.streak}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Weekly check-in</h3>
            <CheckinForm podId={pod.id} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Recent check-ins</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              {pod.checkins.map((checkin) => (
                <li key={checkin.id}>{checkin.text}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
