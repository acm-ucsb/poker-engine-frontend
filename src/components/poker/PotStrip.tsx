"use client";
import React from "react";

export default function PotStrip({ pot, bets }: { pot: number; bets: number[] }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="px-3 py-1 rounded-full bg-black/50 border border-white/10 text-sm">Pot: {pot}</div>
      <div className="flex gap-2 text-[11px] opacity-80">
        {bets.map((b, i) => (
          <span key={i}>{b ? `P${i+1}: ${b}` : null}</span>
        ))}
      </div>
    </div>
  );
}
