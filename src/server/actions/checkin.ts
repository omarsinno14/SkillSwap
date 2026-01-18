"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

export async function createCheckinAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const podId = formData.get("podId");
  const text = formData.get("text");
  if (typeof podId !== "string" || typeof text !== "string") {
    return { ok: false, error: "Invalid request" };
  }
  await prisma.podCheckin.create({
    data: {
      podId,
      userId: session.user.id,
      weekStart: new Date(),
      text: sanitizeText(text)
    }
  });
  await prisma.podMember.update({
    where: { podId_userId: { podId, userId: session.user.id } },
    data: { streak: { increment: 1 }, lastCheckinAt: new Date() }
  });
  return { ok: true };
}
