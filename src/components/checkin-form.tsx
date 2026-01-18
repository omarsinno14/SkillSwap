"use client";

import { useState, useTransition } from "react";
import { createCheckinAction } from "@/server/actions/checkin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CheckinForm({ podId }: { podId: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        formData.append("podId", podId);
        startTransition(async () => {
          const result = await createCheckinAction(formData);
          setStatus(result.ok ? "Check-in saved" : "Unable to save check-in");
        });
      }}
      className="space-y-3"
    >
      <Textarea name="text" placeholder="How did the week go?" />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Submit check-in"}
      </Button>
      {status ? <p className="text-sm text-white/60">{status}</p> : null}
    </form>
  );
}
