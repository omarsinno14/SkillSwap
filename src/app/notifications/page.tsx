import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const notifications = session?.user?.id
    ? await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20
      })
    : [];

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-white/60">Stay on top of new messages and requests.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-md border border-white/10 p-4 text-sm text-white/70">
              {notification.type}: {JSON.stringify(notification.data)}
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
