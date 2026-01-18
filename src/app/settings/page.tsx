import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/server/actions/settings";
import { blockUserAction, unblockUserAction } from "@/server/actions/block";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const preferences = session?.user?.id
    ? await prisma.preferences.findUnique({ where: { userId: session.user.id } })
    : null;
  const blocks = session?.user?.id
    ? await prisma.block.findMany({ where: { blockerId: session.user.id }, include: { blocked: true } })
    : [];

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-white/60">Manage notifications, blocks, and account security.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-sm text-white/60">
              {preferences?.notificationPrefs?.join(", ") ?? "Messages, pods, bookings"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Blocked users</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              {blocks.map((block) => (
                <li key={block.id} className="flex items-center justify-between">
                  <span>{block.blocked.email}</span>
                  <form action={unblockUserAction}>
                    <input type="hidden" name="blockedId" value={block.blockedId} />
                    <Button variant="outline" size="sm" type="submit">
                      Unblock
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
            <form action={blockUserAction} className="mt-3 flex gap-2">
              <input
                type="text"
                name="blockedId"
                placeholder="User ID to block"
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
              />
              <Button variant="outline" type="submit">
                Block
              </Button>
            </form>
          </div>
          <form action={deleteAccountAction}>
            <Button variant="outline" type="submit">
              Delete account
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
