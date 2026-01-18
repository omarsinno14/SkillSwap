import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListingForm } from "@/components/listing-form";

export default function NewListingPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Create a listing</h1>
          <p className="text-white/60">Offer services, swaps, or mentorship.</p>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
