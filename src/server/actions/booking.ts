"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { bookingSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function createBookingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = bookingSchema.safeParse({
    mentorId: values.mentorId,
    proposedTimes: typeof values.proposedTimes === "string" ? values.proposedTimes.split(",").map((time) => time.trim()) : [],
    message: values.message
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.bookingRequest.create({
    data: {
      mentorId: parsed.data.mentorId,
      requesterId: session.user.id,
      proposedTimes: parsed.data.proposedTimes,
      status: "PENDING"
    }
  });
  await prisma.notification.create({
    data: {
      userId: parsed.data.mentorId,
      type: "BOOKING",
      data: { message: sanitizeText(parsed.data.message) }
    }
  });
  revalidatePath("/mentors");
  return { ok: true };
}
