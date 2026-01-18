"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";

export async function getMatchesAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  const candidates = await prisma.post.findMany({
    where: { status: "ACTIVE" },
    include: { author: { include: { profile: true } } },
    take: 20
  });

  const results = candidates.map((post) => {
    const score = calculateMatchScore({
      userTags: profile?.tags ?? [],
      candidateTags: post.tags,
      intent: post.intentType,
      candidateIntent: post.intentType,
      commitmentMatch: true,
      scheduleOverlap: 0.6
    });
    return { post, score };
  });

  const topMatches = results.sort((a, b) => b.score.score - a.score.score).slice(0, 5);

  await prisma.matchLog.createMany({
    data: topMatches.map((match) => ({
      userId: session.user.id,
      postId: match.post.id,
      score: match.score.score,
      reasons: match.score.reasons
    }))
  });

  return { ok: true, matches: topMatches };
}
