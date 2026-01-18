"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { signUpSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function signUpAction(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = signUpSchema.safeParse({
    email: values.email,
    password: values.password,
    displayName: values.displayName
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const { email, password, displayName } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: { email: ["Email already in use"] } };
  }
  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          displayName: sanitizeText(displayName),
          username: sanitizeText(displayName.toLowerCase().replace(/\s+/g, "")) + Math.floor(Math.random() * 1000),
          timezone: "America/Toronto",
          tags: [],
          skillsOffered: [],
          skillsWanted: [],
          goals: []
        }
      },
      preferences: {
        create: {
          intentPrefs: [],
          tagPrefs: [],
          notificationPrefs: ["messages", "pods", "bookings"]
        }
      }
    }
  });
  return { ok: true, userId: user.id };
}
