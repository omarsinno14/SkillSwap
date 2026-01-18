import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  const conversations = session?.user?.id
    ? await prisma.conversationMember.findMany({
        where: { userId: session.user.id },
        include: { conversation: { include: { messages: { take: 1, orderBy: { createdAt: "desc" } } } } }
      })
    : [];

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="text-white/60">Direct chats and pod conversations.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {conversations.map((member) => (
            <Link
              key={member.conversationId}
              href={`/messages/${member.conversationId}`}
              className="block rounded-md border border-white/10 p-4 text-sm text-white/70 hover:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <span>Conversation {member.conversationId.slice(0, 6)}</span>
                <span className="text-xs text-white/40">
                  {member.conversation.messages[0]?.body ?? "No messages yet"}
                </span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
