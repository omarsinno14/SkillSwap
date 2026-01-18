"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { messageSchema } from "@/lib/validators";
import { getRequesterKey, rateLimit, sanitizeText } from "@/lib/security";

export async function sendMessageAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const limiterKey = `${session.user.id}:${getRequesterKey()}`;
  const limit = rateLimit({ key: limiterKey, max: 20, windowMs: 30_000 });
  if (!limit.allowed) {
    return { ok: false, error: "Rate limit exceeded" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = messageSchema.safeParse({
    conversationId: values.conversationId,
    body: values.body
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const member = await prisma.conversationMember.findFirst({
    where: {
      conversationId: parsed.data.conversationId,
      userId: session.user.id
    }
  });
  if (!member) {
    return { ok: false, error: "Forbidden" };
  }
  const message = await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: session.user.id,
      body: sanitizeText(parsed.data.body),
      readReceipts: { [session.user.id]: new Date().toISOString() }
    }
  });
  return { ok: true, messageId: message.id };
}
