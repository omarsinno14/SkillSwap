"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function blockUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const blockedId = String(formData.get("blockedId"));
  await prisma.block.create({
    data: {
      blockerId: session.user.id,
      blockedId
    }
  });
  return { ok: true };
}

export async function unblockUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const blockedId = String(formData.get("blockedId"));
  await prisma.block.delete({
    where: { blockerId_blockedId: { blockerId: session.user.id, blockedId } }
  });
  return { ok: true };
}
