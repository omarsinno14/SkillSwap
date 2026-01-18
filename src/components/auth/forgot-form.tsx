"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requestPasswordResetAction } from "@/server/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof schema>;

export function ForgotForm() {
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
    startTransition(async () => {
      await requestPasswordResetAction(formData);
      setStatus("Check your email for reset instructions (if the account exists).");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <Input {...register("email")} placeholder="you@example.com" />
        {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
      {status ? <p className="text-xs text-white/60">{status}</p> : null}
    </form>
  );
}
