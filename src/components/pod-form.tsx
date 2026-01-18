"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { podSchema } from "@/lib/validators";
import { createPodAction } from "@/server/actions/pod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = podSchema.extend({
  tags: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function PodForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      joinPolicy: "REQUEST",
      maxMembers: 4
    }
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    startTransition(async () => {
      const result = await createPodAction(formData);
      setStatus(result.ok ? "Pod created" : "Unable to create pod");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Pod name</label>
        <Input {...register("name")} placeholder="Montreal Growth Crew" />
        {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Purpose</label>
        <Textarea {...register("description")} placeholder="Weekly accountability for projects." />
        {errors.description ? <p className="text-xs text-red-400">{errors.description.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Tags</label>
        <Input {...register("tags")} placeholder="startup,fitness,design" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Max members</label>
          <Input type="number" {...register("maxMembers", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="text-sm text-white/70">Join policy</label>
          <select
            {...register("joinPolicy")}
            className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <option value="REQUEST">Request to join</option>
            <option value="OPEN">Open join</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Schedule</label>
        <Input {...register("schedule")} placeholder="Weekly check-in on Mondays" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Create pod"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
