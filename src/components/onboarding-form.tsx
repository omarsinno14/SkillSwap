"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onboardingSchema } from "@/lib/validators";
import { completeOnboardingAction } from "@/server/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = onboardingSchema.extend({
  intentPrefs: z.string().min(1),
  tagPrefs: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { timezone: "America/Toronto" }
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append("displayName", values.displayName);
    formData.append("locationCity", values.locationCity ?? "");
    formData.append("timezone", values.timezone);
    formData.append("intentPrefs", values.intentPrefs);
    formData.append("tagPrefs", values.tagPrefs ?? "");
    formData.append("availability", values.availability ?? "");
    formData.append("privacyLevel", values.privacyLevel);
    startTransition(async () => {
      const result = await completeOnboardingAction(formData);
      setStatus(result.ok ? "Onboarding complete" : "Please check your inputs");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Display name</label>
        <Input {...register("displayName")} placeholder="Alex Rivera" />
        {errors.displayName ? <p className="text-xs text-red-400">{errors.displayName.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Location (city)</label>
        <Input {...register("locationCity")} placeholder="Montreal" />
      </div>
      <div>
        <label className="text-sm text-white/70">Time zone</label>
        <Input {...register("timezone")} placeholder="America/Toronto" />
        {errors.timezone ? <p className="text-xs text-red-400">{errors.timezone.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Looking for intents</label>
        <Input {...register("intentPrefs")} placeholder="SWAP,MENTOR,POD" />
      </div>
      <div>
        <label className="text-sm text-white/70">Tags</label>
        <Input {...register("tagPrefs")} placeholder="fitness,react,business" />
      </div>
      <div>
        <label className="text-sm text-white/70">Availability</label>
        <Textarea {...register("availability")} placeholder="Weeknights 6-9pm, weekends mornings" />
      </div>
      <div>
        <label className="text-sm text-white/70">Privacy</label>
        <select
          {...register("privacyLevel")}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="public">Public profile</option>
          <option value="limited">Limited</option>
        </select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Complete onboarding"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
