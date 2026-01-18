import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking-form";

export default async function MentorDetailPage({ params }: { params: { id: string } }) {
  const mentor = await prisma.mentorProfile.findFirst({
    where: { userId: params.id },
    include: { user: { include: { profile: true } } }
  });
  if (!mentor) {
    return notFound();
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">
              {mentor.user.profile?.displayName ?? mentor.user.email}
            </h1>
            <p className="text-white/60">{mentor.bioAddendum}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {mentor.topics.map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
            <p className="text-sm text-white/60">
              Rate: {mentor.rate ? `$${mentor.rate}/hr` : "Open to swaps"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Book a session</h2>
            <p className="text-white/60">Request a time window and share your goals.</p>
          </CardHeader>
          <CardContent>
            <BookingForm mentorId={mentor.userId} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
