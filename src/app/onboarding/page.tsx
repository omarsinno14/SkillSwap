import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Let’s personalize your experience</h1>
          <p className="text-white/60">These details power your feed and matches.</p>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
