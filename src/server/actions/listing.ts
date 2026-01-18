"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function createListingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = listingSchema.safeParse({
    type: values.type,
    title: values.title,
    description: values.description,
    tags: typeof values.tags === "string" ? values.tags.split(",").map((tag) => tag.trim()) : [],
    price: values.price ? Number(values.price) : undefined,
    swapTerms: values.swapTerms,
    location: values.location
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const listing = await prisma.listing.create({
    data: {
      ownerId: session.user.id,
      type: parsed.data.type,
      title: sanitizeText(parsed.data.title),
      description: sanitizeText(parsed.data.description),
      tags: parsed.data.tags.map(sanitizeText),
      price: parsed.data.price,
      swapTerms: parsed.data.swapTerms ? sanitizeText(parsed.data.swapTerms) : null,
      location: parsed.data.location ? sanitizeText(parsed.data.location) : null
    }
  });
  revalidatePath("/marketplace");
  return { ok: true, listingId: listing.id };
}
