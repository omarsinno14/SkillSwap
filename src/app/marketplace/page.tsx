import Link from "next/link";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function MarketplacePage() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <p className="text-white/60">Browse skill swaps and services.</p>
        </div>
        <Button asChild>
          <Link href="/marketplace/new">New listing</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{listing.title}</h2>
                <Badge>{listing.type}</Badge>
              </div>
              <p className="text-sm text-white/60">{listing.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <Button variant="secondary" asChild>
                <Link href={`/marketplace/${listing.id}`}>View listing</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
