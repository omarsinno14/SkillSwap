import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ title: { contains: query, mode: "insensitive" } }, { body: { contains: query, mode: "insensitive" } }]
    },
    take: 5
  });
  const listings = await prisma.listing.findMany({
    where: { title: { contains: query, mode: "insensitive" } },
    take: 5
  });

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Search results</h1>
          <p className="text-white/60">Showing results for "{query}"</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Posts</h2>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              {posts.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Listings</h2>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              {listings.map((listing) => (
                <li key={listing.id}>{listing.title}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
