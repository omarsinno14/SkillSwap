"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function suspendUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false, error: "Forbidden" };
  }
  const userId = String(formData.get("userId"));
  await prisma.user.update({ where: { id: userId }, data: { status: "SUSPENDED" } });
  await prisma.adminAction.create({
    data: { actorId: session.user.id, actionType: "SUSPEND_USER", meta: { userId } }
  });
  return { ok: true };
}

export async function banUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false, error: "Forbidden" };
  }
  const userId = String(formData.get("userId"));
  await prisma.user.update({ where: { id: userId }, data: { status: "BANNED" } });
  await prisma.adminAction.create({
    data: { actorId: session.user.id, actionType: "BAN_USER", meta: { userId } }
  });
  return { ok: true };
}

export async function deletePostAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false, error: "Forbidden" };
  }
  const postId = String(formData.get("postId"));
  await prisma.post.update({ where: { id: postId }, data: { status: "REMOVED" } });
  await prisma.adminAction.create({
    data: { actorId: session.user.id, actionType: "DELETE_POST", meta: { postId } }
  });
  return { ok: true };
}

export async function deleteListingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return { ok: false, error: "Forbidden" };
  }
  const listingId = String(formData.get("listingId"));
  await prisma.listing.update({ where: { id: listingId }, data: { status: "REMOVED" } });
  await prisma.adminAction.create({
    data: { actorId: session.user.id, actionType: "DELETE_LISTING", meta: { listingId } }
  });
  return { ok: true };
}
