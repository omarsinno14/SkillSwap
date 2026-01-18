import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-white/60">Join the accountability network in minutes.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
          <Link href="/auth/sign-in" className="text-xs text-white/60 hover:text-white">
            Already have an account? Sign in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
