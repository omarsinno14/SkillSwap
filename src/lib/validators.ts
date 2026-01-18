import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2)
});

export const postSchema = z.object({
  intentType: z.enum(["SWAP", "MENTOR", "POD", "REQUEST"]),
  title: z.string().min(3),
  body: z.string().min(10),
  tags: z.array(z.string()).min(1),
  location: z.string().optional(),
  schedule: z.string().optional(),
  commitment: z.string().optional(),
  imageUrl: z.string().url().optional()
});

export const podSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1),
  maxMembers: z.number().min(4).max(6),
  joinPolicy: z.enum(["OPEN", "REQUEST"]).default("REQUEST"),
  schedule: z.string().optional()
});

export const listingSchema = z.object({
  type: z.enum(["SKILLSWAP", "SERVICE", "MENTORSHIP"]),
  title: z.string().min(3),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1),
  price: z.number().optional(),
  swapTerms: z.string().optional(),
  location: z.string().optional()
});

export const mentorProfileSchema = z.object({
  topics: z.array(z.string()).min(1),
  rate: z.number().optional(),
  bioAddendum: z.string().min(10)
});

export const bookingSchema = z.object({
  mentorId: z.string().uuid(),
  proposedTimes: z.array(z.string()).min(1),
  message: z.string().min(5)
});

export const messageSchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1).max(2000)
});

export const reportSchema = z.object({
  targetType: z.enum(["USER", "POST", "MESSAGE", "POD", "LISTING"]),
  targetId: z.string(),
  reason: z.string().min(5)
});

export const onboardingSchema = z.object({
  displayName: z.string().min(2),
  locationCity: z.string().optional(),
  timezone: z.string(),
  intentPrefs: z.array(z.enum(["SWAP", "MENTOR", "POD", "REQUEST"])),
  tagPrefs: z.array(z.string()),
  availability: z.string().optional(),
  privacyLevel: z.enum(["public", "limited"]).default("public")
});
