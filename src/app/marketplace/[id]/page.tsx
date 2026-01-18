import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return notFound();
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{listing.title}</h1>
            <Badge>{listing.type}</Badge>
          </div>
          <p className="text-white/60">{listing.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="text-sm text-white/60">
            {listing.price ? `Price: $${listing.price}` : "Open to swaps"} · {listing.location ?? "Remote"}
          </div>
          <Button>Contact seller</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
