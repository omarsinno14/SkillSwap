"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function completeOnboardingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = onboardingSchema.safeParse({
    displayName: values.displayName,
    locationCity: values.locationCity,
    timezone: values.timezone,
    intentPrefs:
      typeof values.intentPrefs === "string"
        ? values.intentPrefs.split(",").map((intent) => intent.trim())
        : [],
    tagPrefs: typeof values.tagPrefs === "string" ? values.tagPrefs.split(",").map((tag) => tag.trim()) : [],
    availability: values.availability,
    privacyLevel: values.privacyLevel
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      displayName: sanitizeText(parsed.data.displayName),
      locationCity: parsed.data.locationCity ? sanitizeText(parsed.data.locationCity) : null,
      timezone: sanitizeText(parsed.data.timezone),
      tags: parsed.data.tagPrefs.map(sanitizeText),
      privacyLevel: parsed.data.privacyLevel
    }
  });

  await prisma.preferences.update({
    where: { userId: session.user.id },
    data: {
      intentPrefs: parsed.data.intentPrefs,
      tagPrefs: parsed.data.tagPrefs.map(sanitizeText),
      onboardingComplete: true
    }
  });

  await prisma.availability.upsert({
    where: { userId: session.user.id },
    update: { weekly: { summary: parsed.data.availability ?? "" } },
    create: { userId: session.user.id, weekly: { summary: parsed.data.availability ?? "" } }
  });

  return { ok: true };
}
