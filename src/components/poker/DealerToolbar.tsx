"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DealerToolbar({ onDealFlop, onDealTurn, onDealRiver, onNextStreet, onReset, onRotateDealer, onActingPrev, onActingNext, onPostBlinds, onClearBets, onNewHoleCards }: any) {
  return (
    <UICard className="bg-slate-900/60 border-white/10">
      <CardHeader>
        <CardTitle className="text-sm">Dealer (demo)</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        <Button variant="outline" onClick={onDealFlop}>Deal Flop</Button>
        <Button variant="outline" onClick={onDealTurn}>Deal Turn</Button>
        <Button variant="outline" onClick={onDealRiver}>Deal River</Button>
        <Button variant="secondary" onClick={onNextStreet}>Next Street</Button>
        <Button variant="outline" onClick={onRotateDealer}>Rotate Dealer</Button>
        <Button variant="outline" onClick={onActingPrev}>Acting -</Button>
        <Button variant="outline" onClick={onActingNext}>Acting +</Button>
        <Button variant="outline" onClick={onPostBlinds}>Post Blinds</Button>
        <Button variant="outline" onClick={onClearBets}>Clear Bets</Button>
        <Button variant="destructive" onClick={onReset}>Reset Hand</Button>
        <Button variant="outline" onClick={onNewHoleCards}>New Hole Cards</Button>
      </CardContent>
    </UICard>
  );
}