"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { mentorProfileSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function upsertMentorProfileAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = mentorProfileSchema.safeParse({
    topics: typeof values.topics === "string" ? values.topics.split(",").map((topic) => topic.trim()) : [],
    rate: values.rate ? Number(values.rate) : undefined,
    bioAddendum: values.bioAddendum
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.mentorProfile.upsert({
    where: { userId: session.user.id },
    update: {
      topics: parsed.data.topics.map(sanitizeText),
      rate: parsed.data.rate,
      bioAddendum: sanitizeText(parsed.data.bioAddendum)
    },
    create: {
      userId: session.user.id,
      topics: parsed.data.topics.map(sanitizeText),
      rate: parsed.data.rate,
      bioAddendum: sanitizeText(parsed.data.bioAddendum)
    }
  });
  revalidatePath("/mentors");
  return { ok: true };
}
