"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActionBar({
  canCheck,
  callAmount,
  minRaise,
  maxRaise,
  onFold,
  onCheckCall,
  onRaise,
}: {
  canCheck: boolean;
  callAmount: number;
  minRaise: number;
  maxRaise: number;
  onFold: () => void;
  onCheckCall: () => void;
  onRaise: (amt: number) => void;
}) {
  const [raiseAmt, setRaiseAmt] = useState(minRaise);
  useEffect(() => setRaiseAmt(Math.max(minRaise, Math.min(maxRaise, raiseAmt))), [minRaise, maxRaise]);

  return (
    <UICard className="bg-slate-900/60 border-white/10">
      <CardHeader>
        <CardTitle className="text-base">Your Action</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onFold} className="flex-1">Fold</Button>
          <Button onClick={onCheckCall} className="flex-1">{canCheck ? "Check" : `Call ${callAmount}`}</Button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={minRaise}
            max={maxRaise}
            value={raiseAmt}
            onChange={(e) => setRaiseAmt(parseInt(e.target.value))}
            className="w-full"
          />
          <Button variant="outline" onClick={() => onRaise(raiseAmt)}>Raise to {raiseAmt}</Button>
        </div>
      </CardContent>
    </UICard>
  );
}