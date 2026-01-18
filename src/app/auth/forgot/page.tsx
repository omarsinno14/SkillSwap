import Link from "next/link";
import { ForgotForm } from "@/components/auth/forgot-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="text-white/60">We will email a reset notice if the account exists.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotForm />
          <Link href="/auth/sign-in" className="text-xs text-white/60 hover:text-white">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
