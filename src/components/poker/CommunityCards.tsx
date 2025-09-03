"use client";
import React from "react";
import { motion } from "framer-motion";
import CardPip from "./CardPip";
import type { Card } from "@/lib/poker/types";

export default function CommunityCards({ cards }: { cards: Card[] }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
          {cards[i] ? <CardPip card={cards[i]} /> : <div className="w-10 h-14 rounded-md border border-dashed border-white/40" />}
        </motion.div>
      ))}
    </div>
  );
}