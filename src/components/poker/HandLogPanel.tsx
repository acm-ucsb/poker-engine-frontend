"use client";
import React from "react";
import type { LogItem } from "@/lib/poker/types";

export default function HandLogPanel({ log }: { log: LogItem[] }) {
  return (
    <div className="h-full overflow-y-auto pr-1 space-y-2">
      {log.length === 0 && <div className="text-sm opacity-60">Actions will appear here.</div>}
      {log.map((l) => (
        <div key={l.id} className="text-sm opacity-90">
          <span className="opacity-60 mr-2">[{new Date(l.ts).toLocaleTimeString()}]</span>
          {l.text}
        </div>
      ))}
    </div>
  );
}