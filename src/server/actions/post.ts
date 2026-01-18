"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { postSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/security";

export async function createPostAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const values = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse({
    intentType: values.intentType,
    title: values.title,
    body: values.body,
    tags: typeof values.tags === "string" ? values.tags.split(",").map((tag) => tag.trim()) : [],
    location: values.location,
    schedule: values.schedule,
    commitment: values.commitment,
    imageUrl: values.imageUrl
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      intentType: parsed.data.intentType,
      title: sanitizeText(parsed.data.title),
      body: sanitizeText(parsed.data.body),
      tags: parsed.data.tags.map(sanitizeText),
      location: parsed.data.location ? sanitizeText(parsed.data.location) : null,
      schedule: parsed.data.schedule ? sanitizeText(parsed.data.schedule) : null,
      commitment: parsed.data.commitment ? sanitizeText(parsed.data.commitment) : null,
      imageUrl: parsed.data.imageUrl ?? null
    }
  });
  revalidatePath("/feed");
  return { ok: true, postId: post.id };
}
