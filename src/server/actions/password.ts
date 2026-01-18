"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return { ok: false, error: "Email required" };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: true };
  }
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "REPORT",
      data: { message: "Password reset requested" }
    }
  });
  return { ok: true };
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { ok: false, error: "Invalid request" };
  }
  const user = await prisma.user.findUnique({ where: { email: sanitizeText(email) } });
  if (!user) {
    return { ok: false, error: "User not found" };
  }
  const passwordHash = await hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { ok: true };
}
