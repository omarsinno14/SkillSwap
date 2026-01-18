import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageThread } from "@/components/message-thread";

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });
  if (!conversation) {
    return notFound();
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Conversation</h1>
          <p className="text-white/60">Real-time messaging powered by Socket.io.</p>
        </CardHeader>
        <CardContent>
          <MessageThread
            conversationId={conversation.id}
            initialMessages={conversation.messages.map((message) => message.body)}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
