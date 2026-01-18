import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await prisma.profile.findFirst({
    where: {
      OR: [{ userId: params.id }, { username: params.id }]
    },
    include: { user: { include: { mentorProfile: true } } }
  });
  if (!profile) {
    return notFound();
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
          <p className="text-white/60">{profile.bio || "Member of LinkUp Pods"}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
          <div className="text-sm text-white/50">
            Location: {profile.locationCity ?? "Remote"} · Timezone: {profile.timezone}
          </div>
          {profile.user.mentorProfile ? (
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="text-sm font-semibold">Mentor Topics</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.user.mentorProfile.topics.map((topic) => (
                  <Badge key={topic}>{topic}</Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </AppShell>
  );
}
