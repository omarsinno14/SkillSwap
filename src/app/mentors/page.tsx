import Link from "next/link";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MentorForm } from "@/components/mentor-form";

export default async function MentorsPage() {
  const mentors = await prisma.mentorProfile.findMany({
    include: { user: { include: { profile: true } } },
    take: 12
  });

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Micro-mentors</h1>
          {mentors.map((mentor) => (
            <Card key={mentor.id}>
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  {mentor.user.profile?.displayName ?? mentor.user.email}
                </h2>
                <p className="text-sm text-white/60">{mentor.bioAddendum}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {mentor.topics.map((topic) => (
                    <Badge key={topic}>{topic}</Badge>
                  ))}
                </div>
                <Link href={`/mentors/${mentor.userId}`} className="text-sm text-primary">
                  View mentor profile
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Become a mentor</h2>
            <p className="text-sm text-white/60">Share availability and outcomes.</p>
          </CardHeader>
          <CardContent>
            <MentorForm />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
