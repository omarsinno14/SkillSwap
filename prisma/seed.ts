import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "alex@example.com",
      passwordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Alex Rivera",
          username: "alexrivera",
          bio: "Product designer and early-career mentor.",
          locationCity: "Montreal",
          timezone: "America/Toronto",
          tags: ["design", "startup", "mentorship"],
          skillsOffered: ["UX", "Figma"],
          skillsWanted: ["Growth", "Pitching"],
          goals: ["Build a startup", "Find a pod"]
        }
      },
      preferences: {
        create: {
          intentPrefs: ["SWAP", "POD"],
          tagPrefs: ["design", "startup"],
          notificationPrefs: ["messages", "pods"]
        }
      },
      availability: {
        create: {
          weekly: { summary: "Weeknights after 6pm" }
        }
      },
      mentorProfile: {
        create: {
          topics: ["product", "ux"],
          rate: 45,
          bioAddendum: "I help early career designers break into product roles."
        }
      }
    }
  });

  await prisma.post.createMany({
    data: [
      {
        authorId: user.id,
        intentType: "POD",
        title: "Looking for a Montreal accountability pod",
        body: "Seeking 4-6 people to check in weekly on product goals.",
        tags: ["montreal", "product", "accountability"],
        location: "Montreal",
        schedule: "Weekly on Mondays",
        commitment: "1 hour"
      },
      {
        authorId: user.id,
        intentType: "SWAP",
        title: "Swap UX critiques for marketing help",
        body: "Happy to trade UX feedback for early-stage growth advice.",
        tags: ["ux", "marketing"],
        location: "Remote",
        schedule: "Flexible",
        commitment: "2 sessions"
      }
    ]
  });

  const pod = await prisma.pod.create({
    data: {
      ownerId: user.id,
      name: "Montreal Builders Pod",
      description: "Weekly check-ins for student founders.",
      tags: ["startup", "student", "montreal"],
      maxMembers: 6,
      joinPolicy: "REQUEST",
      schedule: "Weekly on Sundays",
      members: {
        create: {
          userId: user.id,
          role: "owner"
        }
      }
    }
  });

  await prisma.podCheckin.create({
    data: {
      podId: pod.id,
      userId: user.id,
      weekStart: new Date(),
      text: "Shipped onboarding flow and validated user interviews."
    }
  });

  await prisma.listing.createMany({
    data: [
      {
        ownerId: user.id,
        type: "SKILLSWAP",
        title: "Design feedback swap",
        description: "Offering product UI reviews in exchange for growth strategies.",
        tags: ["design", "growth"],
        location: "Remote"
      },
      {
        ownerId: user.id,
        type: "MENTORSHIP",
        title: "Portfolio review session",
        description: "60-minute portfolio review and feedback.",
        tags: ["portfolio", "career"],
        price: 40,
        location: "Montreal"
      }
    ]
  });

  await prisma.conversation.create({
    data: {
      type: "DIRECT",
      members: {
        create: {
          userId: user.id
        }
      },
      messages: {
        create: {
          senderId: user.id,
          body: "Welcome to LinkUp Pods!",
          readReceipts: { [user.id]: new Date().toISOString() }
        }
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
