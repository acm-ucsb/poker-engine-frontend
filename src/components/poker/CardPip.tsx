"use client";
import React from "react";
import type { Card } from "@/lib/poker/types";

export default function CardPip({ card, hidden = false }: { card: Card; hidden?: boolean }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div className={`w-10 h-14 rounded-md border bg-white/95 shadow flex items-center justify-center text-sm font-semibold ${isRed ? "text-red-600" : "text-slate-900"}`}>
      {hidden ? "🂠" : (
        <span>{card.rank}{card.suit}</span>
      )}
    </div>
  );
}