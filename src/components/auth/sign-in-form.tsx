"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
      callbackUrl: "/feed"
    });
    if (result?.error) {
      setError("Invalid credentials");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <Input {...register("email")} placeholder="you@example.com" />
        {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Password</label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-red-400">{errors.password.message}</p> : null}
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full">Sign in</Button>
      <Button type="button" variant="secondary" className="w-full" onClick={() => signIn("google")}>Sign in with Google</Button>
    </form>
  );
}
