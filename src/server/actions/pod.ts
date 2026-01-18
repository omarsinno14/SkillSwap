"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { podSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function createPodAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = podSchema.safeParse({
    name: values.name,
    description: values.description,
    tags: typeof values.tags === "string" ? values.tags.split(",").map((tag) => tag.trim()) : [],
    maxMembers: Number(values.maxMembers),
    joinPolicy: values.joinPolicy,
    schedule: values.schedule
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const pod = await prisma.pod.create({
    data: {
      ownerId: session.user.id,
      name: sanitizeText(parsed.data.name),
      description: sanitizeText(parsed.data.description),
      tags: parsed.data.tags.map(sanitizeText),
      maxMembers: parsed.data.maxMembers,
      joinPolicy: parsed.data.joinPolicy,
      schedule: parsed.data.schedule ? sanitizeText(parsed.data.schedule) : null,
      members: {
        create: {
          userId: session.user.id,
          role: "owner"
        }
      }
    }
  });
  revalidatePath("/pods");
  return { ok: true, podId: pod.id };
}
