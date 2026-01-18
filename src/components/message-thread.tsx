"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { sendMessageAction } from "@/server/actions/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

let socket: Socket | null = null;

export function MessageThread({ conversationId, initialMessages }: { conversationId: string; initialMessages: string[] }) {
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetch("/api/socket");
    socket = io({ path: "/api/socket" });
    socket.emit("join", conversationId);
    socket.on("message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [conversationId]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className="rounded-md bg-white/5 p-3 text-sm text-white/80">
            {message}
          </div>
        ))}
      </div>
      <form
        action={async (formData) => {
          formData.append("conversationId", conversationId);
          formData.append("body", value);
          const result = await sendMessageAction(formData);
          if (result.ok) {
            socket?.emit("message", { conversationId, message: value });
            setValue("");
          }
        }}
        className="flex gap-2"
      >
        <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Send a message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
