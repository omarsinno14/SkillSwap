"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { listingSchema } from "@/lib/validators";
import { createListingAction } from "@/server/actions/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = listingSchema.extend({
  tags: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function ListingForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    startTransition(async () => {
      const result = await createListingAction(formData);
      setStatus(result.ok ? "Listing created" : "Unable to create listing");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Listing type</label>
        <select
          {...register("type")}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="SKILLSWAP">SkillSwap</option>
          <option value="SERVICE">Service</option>
          <option value="MENTORSHIP">Mentorship</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-white/70">Title</label>
        <Input {...register("title")} placeholder="React tutoring sessions" />
        {errors.title ? <p className="text-xs text-red-400">{errors.title.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Description</label>
        <Textarea {...register("description")} />
        {errors.description ? <p className="text-xs text-red-400">{errors.description.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Tags</label>
        <Input {...register("tags")} placeholder="react,coaching" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Price</label>
          <Input type="number" {...register("price", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="text-sm text-white/70">Swap terms</label>
          <Input {...register("swapTerms")} placeholder="2 sessions for design help" />
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Location</label>
        <Input {...register("location")} placeholder="Remote / Montreal" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Publish listing"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
