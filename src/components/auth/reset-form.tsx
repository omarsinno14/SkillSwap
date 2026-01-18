"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordAction } from "@/server/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function ResetForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      setStatus(result.ok ? "Password updated. Sign in again." : "Unable to reset password.");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <Input {...register("email")} placeholder="you@example.com" />
        {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">New password</label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-red-400">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset password"}
      </Button>
      {status ? <p className="text-xs text-white/60">{status}</p> : null}
    </form>
  );
}
