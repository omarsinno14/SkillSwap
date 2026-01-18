"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bookingSchema } from "@/lib/validators";
import { createBookingAction } from "@/server/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = bookingSchema.extend({
  proposedTimes: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function BookingForm({ mentorId }: { mentorId: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append("mentorId", mentorId);
    formData.append("proposedTimes", values.proposedTimes);
    formData.append("message", values.message);
    startTransition(async () => {
      const result = await createBookingAction(formData);
      setStatus(result.ok ? "Request sent" : "Unable to send request");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Proposed times</label>
        <Input {...register("proposedTimes")} placeholder="Tue 6pm, Thu 7pm" />
        {errors.proposedTimes ? <p className="text-xs text-red-400">{errors.proposedTimes.message}</p> : null}
      </div>
      <div>
        <label className="text-sm text-white/70">Message</label>
        <Textarea {...register("message")} placeholder="What you want to focus on" />
        {errors.message ? <p className="text-xs text-red-400">{errors.message.message}</p> : null}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Request session"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
