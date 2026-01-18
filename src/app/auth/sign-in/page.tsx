import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-white/60">Sign in to continue to LinkUp Pods.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <Link href="/auth/forgot" className="text-xs text-white/60 hover:text-white">
            Forgot password?
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
