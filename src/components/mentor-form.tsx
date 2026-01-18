"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mentorProfileSchema } from "@/lib/validators";
import { upsertMentorProfileAction } from "@/server/actions/mentor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = mentorProfileSchema.extend({
  topics: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function MentorForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)));
    startTransition(async () => {
      const result = await upsertMentorProfileAction(formData);
      setStatus(result.ok ? "Mentor profile saved" : "Unable to save profile");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Topics</label>
        <Input {...register("topics")} placeholder="product, ux, marketing" />
        {errors.topics ? <p className="text-xs text-red-400">{errors.topics.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Hourly rate (optional)</label>
        <Input type="number" {...register("rate", { valueAsNumber: true })} />
      </div>
      <div>
        <label className="text-sm text-white/70">Mentor bio</label>
        <Textarea {...register("bioAddendum")} />
        {errors.bioAddendum ? <p className="text-xs text-red-400">{errors.bioAddendum.message}</p> : null}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save mentor profile"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
