"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMsg } from "@/lib/poker/types";

export default function ChatPanel({ chat, onSend }: { chat: ChatMsg[]; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [chat.length]);

  return (
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {chat.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="opacity-70 mr-2">[{new Date(m.ts).toLocaleTimeString()}]</span>
            <span className="font-semibold mr-2">{m.name}:</span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(""); } }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}