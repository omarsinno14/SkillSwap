"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postSchema } from "@/lib/validators";
import { createPostAction } from "@/server/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = postSchema.extend({
  tags: z.string().min(1, "Add at least one tag")
});

type FormValues = z.infer<typeof schema>;

export function PostForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      intentType: "SWAP",
      tags: "",
      title: "",
      body: ""
    }
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });
    startTransition(async () => {
      const result = await createPostAction(formData);
      setStatus(result.ok ? "Post created" : "Failed to create post");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Intent Type</label>
        <select
          {...register("intentType")}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="SWAP">Swap</option>
          <option value="MENTOR">Mentor</option>
          <option value="POD">Pod</option>
          <option value="REQUEST">Request</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-white/70">Title</label>
        <Input {...register("title")} placeholder="Looking for a UI/UX accountability partner" />
        {errors.title ? <p className="text-xs text-red-400">{errors.title.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Description</label>
        <Textarea {...register("body")} placeholder="Share what you need and how you can help." />
        {errors.body ? <p className="text-xs text-red-400">{errors.body.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Tags (comma separated)</label>
        <Input {...register("tags")} placeholder="design, accountability, montreal" />
        {errors.tags ? <p className="text-xs text-red-400">{errors.tags.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Location</label>
          <Input {...register("location")} placeholder="Montreal" />
        </div>
        <div>
          <label className="text-sm text-white/70">Schedule</label>
          <Input {...register("schedule")} placeholder="Evenings, weekly" />
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Commitment</label>
        <Input {...register("commitment")} placeholder="2 sessions / week" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Publish"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
