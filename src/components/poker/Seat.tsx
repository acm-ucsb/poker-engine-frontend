"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import type { PlayerSeat } from "@/lib/poker/types";
import { initials } from "@/lib/poker/utils";
import CardPip from "./CardPip";
import { randCard } from "@/lib/poker/mock";

export default function Seat({ seat, isButton, isActing, onSit }: { seat: PlayerSeat; isButton: boolean; isActing: boolean; onSit: () => void }) {
  const hidden = !seat.isHero; // demo: only show hero hole cards
  const empty = !seat.name;
  return (
    <div className={`min-w-[140px] ${isActing ? "ring-2 ring-emerald-400/70 rounded-xl" : ""}`}>
      <div className={`text-xs mb-1 flex items-center gap-2 justify-center ${seat.folded ? "opacity-50" : ""}`}>
        {empty ? (
          <Button size="sm" variant="outline" onClick={onSit}>Sit here</Button>
        ) : (
          <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-white/10 flex items-center gap-2">
            <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-white/80 text-slate-900 text-[10px] font-bold">{initials(seat.name)}</span>
            {seat.name}
          </span>
        )}
        {isButton && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/90 text-black font-semibold">D</span>}
        {isActing && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/90 text-black font-semibold">ACT</span>}
      </div>
      <div className="flex items-center justify-center gap-1">
        {empty ? (
          <div className="text-[11px] opacity-70">Empty seat</div>
        ) : seat.cards ? (
          <>
            <CardPip card={seat.cards?.[0] ?? randCard()} hidden={hidden} />
            <CardPip card={seat.cards?.[1] ?? randCard()} hidden={hidden} />
          </>
        ) : (
          <div className="text-[11px] text-center mt-1 opacity-80">No cards</div>
        )}
      </div>
      {!empty && (
        <div className="text-[11px] text-center mt-1 opacity-80">{seat.chips} chips {seat.bet ? `· bet ${seat.bet}` : ""}</div>
      )}
    </div>
  );
}