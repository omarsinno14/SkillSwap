import { IntentType } from "@prisma/client";

export type MatchInput = {
  userTags: string[];
  candidateTags: string[];
  distanceKm?: number | null;
  scheduleOverlap?: number;
  intent: IntentType;
  candidateIntent: IntentType;
  commitmentMatch?: boolean;
};

export function calculateMatchScore(input: MatchInput) {
  const tagOverlap = input.userTags.filter((tag) => input.candidateTags.includes(tag)).length;
  const tagScore = Math.min(tagOverlap / Math.max(input.userTags.length, 1), 1) * 40;
  const distanceScore = input.distanceKm ? Math.max(0, 1 - input.distanceKm / 50) * 15 : 5;
  const scheduleScore = (input.scheduleOverlap ?? 0) * 20;
  const intentScore = input.intent === input.candidateIntent ? 15 : 5;
  const commitmentScore = input.commitmentMatch ? 10 : 0;
  const score = tagScore + distanceScore + scheduleScore + intentScore + commitmentScore;

  const reasons = [
    tagOverlap > 0 ? `${tagOverlap} shared tags` : "New tags to explore",
    input.distanceKm ? `~${Math.round(input.distanceKm)}km away` : "Remote friendly",
    input.scheduleOverlap ? "Schedules align" : "Flexible timing",
    input.intent === input.candidateIntent ? "Same intent" : "Complementary intent",
    input.commitmentMatch ? "Commitment aligned" : ""
  ].filter(Boolean);

  return { score: Math.round(score), reasons };
}
