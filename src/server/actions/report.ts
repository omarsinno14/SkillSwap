"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { reportSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function createReportAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = reportSchema.safeParse({
    targetType: values.targetType,
    targetId: values.targetId,
    reason: values.reason
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: sanitizeText(parsed.data.reason)
    }
  });
  return { ok: true };
}
