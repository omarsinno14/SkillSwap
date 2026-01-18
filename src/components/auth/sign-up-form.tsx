"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result.ok) {
        await signIn("credentials", {
          redirect: true,
          email: values.email,
          password: values.password,
          callbackUrl: "/onboarding"
        });
      } else {
        setStatus("Unable to create account");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Name</label>
        <Input {...register("displayName")} placeholder="Alex Rivera" />
        {errors.displayName ? <p className="text-xs text-red-400">{errors.displayName.message}</p> : null}
      </div>
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
      {status ? <p className="text-xs text-red-400">{status}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
}
