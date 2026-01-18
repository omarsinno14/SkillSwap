import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PodForm } from "@/components/pod-form";

export default function NewPodPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Create a pod</h1>
          <p className="text-white/60">Build a 4-6 person accountability pod.</p>
        </CardHeader>
        <CardContent>
          <PodForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
