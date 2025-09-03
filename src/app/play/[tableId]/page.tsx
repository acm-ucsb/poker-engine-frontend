"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import CommunityCards from "@/components/poker/CommunityCards";
import PotStrip from "@/components/poker/PotStrip";
import Seat from "@/components/poker/Seat";
import ActionBar from "@/components/poker/ActionBar";
import DealerToolbar from "@/components/poker/DealerToolbar";
import ChatPanel from "@/components/poker/ChatPanel";
import HandLogPanel from "@/components/poker/HandLogPanel";
import { dealNCards, mockInitialState, randCard } from "@/lib/poker/mock";
import type { ChatMsg, LogItem, PlayerSeat, Street, TableState } from "@/lib/poker/types";
import { addLog } from "@/lib/poker/utils";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SEAT_POSITIONS = [
  { top: "10%", left: "50%", transform: "translate(-50%, -50%)" }, // top center
  { top: "25%", left: "85%", transform: "translate(-50%, -50%)" }, // top-right
  { top: "65%", left: "90%", transform: "translate(-50%, -50%)" }, // right
  { top: "90%", left: "50%", transform: "translate(-50%, -50%)" }, // bottom center
  { top: "65%", left: "10%", transform: "translate(-50%, -50%)" }, // left
  { top: "25%", left: "15%", transform: "translate(-50%, -50%)" }, // top-left
];

export default function PokerTablePage() {
  const params = useSearchParams();
  const tableId = params.get("tableId") ?? "demo-table"; // in real app use dynamic route /play/[tableId]

  const [state, setState] = useState<TableState | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [log, setLog] = useState<LogItem[]>([]);

  // Initialize state on first render
  React.useEffect(() => {
    if (!state) {
      setState(mockInitialState(tableId, "You"));
    }
  }, [tableId, state]);

  // Early return if state not loaded yet
  if (!state) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading table...</div>
      </div>
    );
  }

  const bets = state.seats.map(s => s.bet ?? 0);
  const heroIndex = Math.max(0, state.seats.findIndex(s => s.isHero));

  const setSeats = (updater: (seats: PlayerSeat[]) => PlayerSeat[]) => 
    setState((s) => s ? ({ ...s, seats: updater([...s.seats]) }) : s);

  const handleFold = () => {
    setSeats((seats) => {
      seats[heroIndex] = { ...seats[heroIndex], folded: true };
      return seats;
    });
    addLog(setLog, `${state.seats[heroIndex].name || "You"} folded`);
  };

  const handleCheckCall = () => {
    const maxBet = Math.max(...bets);
    const toCall = Math.max(0, maxBet - (state.seats[heroIndex].bet ?? 0));
    if (toCall === 0) { addLog(setLog, `${state.seats[heroIndex].name || "You"} checked`); return; }
    setState((s) => {
      if (!s) return s;
      const seats = [...s.seats];
      const hero = { ...seats[heroIndex] };
      hero.chips -= toCall;
      hero.bet = (hero.bet ?? 0) + toCall;
      seats[heroIndex] = hero;
      return { ...s, seats, pot: s.pot + toCall };
    });
    addLog(setLog, `${state.seats[heroIndex].name || "You"} called ${toCall}`);
  };

  const handleRaise = (amt: number) => {
    const heroBet = state.seats[heroIndex].bet ?? 0;
    const toPutIn = Math.max(0, amt - heroBet);
    setState((s) => {
      if (!s) return s;
      const seats = [...s.seats];
      const hero = { ...seats[heroIndex] };
      hero.chips = Math.max(0, hero.chips - toPutIn);
      hero.bet = amt;
      seats[heroIndex] = hero;
      return { ...s, seats, minRaise: Math.max(s.minRaise, amt + s.bigBlind), pot: s.pot + toPutIn };
    });
    addLog(setLog, `${state.seats[heroIndex].name || "You"} raised to ${amt}`);
  };

  const sitHere = (i: number) => {
    setSeats((seats) => {
      const prevHero = seats.findIndex(s => s.isHero);
      if (prevHero >= 0) seats[prevHero] = { ...seats[prevHero], isHero: false };
      seats[i] = { ...seats[i], name: seats[i].name || "You", isHero: true, cards: [randCard(), randCard()], folded: false };
      return seats;
    });
    addLog(setLog, `You sat in Seat ${i+1}`);
  };

  // Dealer toolbar helpers (demo only)
  const dealFlop = () => { setState((s) => s ? ({ ...s, community: dealNCards(3), street: "flop" }) : s); addLog(setLog, "Dealt the Flop"); };
  const dealTurn = () => { setState((s) => s ? ({ ...s, community: s.community.length >= 3 ? [...s.community, randCard()] : s.community, street: "turn" }) : s); addLog(setLog, "Dealt the Turn"); };
  const dealRiver = () => { setState((s) => s ? ({ ...s, community: s.community.length >= 4 ? [...s.community, randCard()] : s.community, street: "river" }) : s); addLog(setLog, "Dealt the River"); };
  const nextStreet = () => {
    const order: Street[] = ["preflop","flop","turn","river","showdown"];
    const idx = order.indexOf(state.street);
    const next = order[Math.min(order.length-1, idx+1)] as Street;
    setState((s) => s ? ({ ...s, street: next }) : s);
    addLog(setLog, `Street → ${next}`);
  };
  const resetHand = () => {
    setState((s) => s ? ({
      ...s,
      handNumber: s.handNumber + 1,
      street: "preflop",
      community: [],
      pot: 0,
      minRaise: s.bigBlind * 2,
      seats: s.seats.map(se => ({ ...se, bet: 0, folded: false, cards: se.name ? [randCard(), randCard()] : undefined })),
    }) : s);
    addLog(setLog, "New hand started");
  };
  const rotateDealer = () => setState((s) => s ? ({ ...s, dealerButtonIndex: (s.dealerButtonIndex + 1) % s.seats.length }) : s);
  const actingPrev = () => setState((s) => s ? ({ ...s, actingSeatIndex: (s.actingSeatIndex - 1 + s.seats.length) % s.seats.length }) : s);
  const actingNext = () => setState((s) => s ? ({ ...s, actingSeatIndex: (s.actingSeatIndex + 1) % s.seats.length }) : s);
  const postBlinds = () => {
    setState((s) => {
      if (!s) return s;
      const seats = [...s.seats];
      const sbIdx = (s.dealerButtonIndex + 1) % seats.length;
      const bbIdx = (s.dealerButtonIndex + 2) % seats.length;
      seats[sbIdx] = { ...seats[sbIdx], bet: (seats[sbIdx].bet ?? 0) + s.smallBlind, chips: seats[sbIdx].chips - s.smallBlind };
      seats[bbIdx] = { ...seats[bbIdx], bet: (seats[bbIdx].bet ?? 0) + s.bigBlind, chips: seats[bbIdx].chips - s.bigBlind };
      return { ...s, seats, pot: s.pot + s.smallBlind + s.bigBlind };
    });
    addLog(setLog, "Posted blinds");
  };
  const clearBets = () => { setState((s) => s ? ({ ...s, seats: s.seats.map(se => ({ ...se, bet: 0 })), pot: 0 }) : s); addLog(setLog, "Cleared bets"); };
  const newHoleCards = () => { setState((s) => s ? ({ ...s, seats: s.seats.map(se => ({ ...se, cards: se.name ? [randCard(), randCard()] : undefined })) }) : s); addLog(setLog, "Dealt new hole cards"); };

  const maxBet = Math.max(...bets);
  const heroBet = state.seats[heroIndex]?.bet ?? 0;
  const callAmount = Math.max(0, maxBet - heroBet);
  const canCheck = callAmount === 0;

  const onSendChat = (text: string) => setChat((c) => [...c, { id: `${Date.now()}-${Math.random()}`, name: state.seats[heroIndex].name || "You", text, ts: Date.now() }]);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Table: {state.tableId}</h1>
            <div className="text-xs md:text-sm opacity-80">Hand #{state.handNumber} · Blinds {state.smallBlind}/{state.bigBlind} · Street: {state.street}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3">
          <div className="relative w-full aspect-[16/9] rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-950/70 to-slate-950/80 shadow-inner overflow-hidden">
            <div className="absolute inset-6 rounded-[999px] border border-white/10 bg-emerald-800/40" />

            <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <PotStrip pot={state.pot} bets={bets} />
              <CommunityCards cards={state.community} />
            </div>

            {state.seats.map((seat, i) => {
              const pos = SEAT_POSITIONS[i % SEAT_POSITIONS.length];
              const isButton = i === state.dealerButtonIndex;
              const isActing = i === state.actingSeatIndex;
              return (
                <div key={seat.id} className="absolute" style={pos}>
                  <Seat seat={seat} isButton={isButton} isActing={isActing} onSit={() => sitHere(i)} />
                </div>
              );
            })}
          </div>

          <div className="min-h-0">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="log">Hand Log</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-2 h-[calc(100%-2.5rem)]">
                <UICard className="h-[520px] bg-slate-900/60 border-white/10">
                  <CardHeader><CardTitle className="text-base">Table Chat</CardTitle></CardHeader>
                  <CardContent className="h-[440px] flex flex-col">
                    <ChatPanel chat={chat} onSend={onSendChat} />
                  </CardContent>
                </UICard>
              </TabsContent>
              <TabsContent value="log" className="mt-2 h-[calc(100%-2.5rem)]">
                <UICard className="h-[520px] bg-slate-900/60 border-white/10">
                  <CardHeader><CardTitle className="text-base">Hand Log</CardTitle></CardHeader>
                  <CardContent className="h-[440px]">
                    <HandLogPanel log={log} />
                  </CardContent>
                </UICard>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <DealerToolbar
            onDealFlop={dealFlop}
            onDealTurn={dealTurn}
            onDealRiver={dealRiver}
            onNextStreet={nextStreet}
            onReset={resetHand}
            onRotateDealer={rotateDealer}
            onActingPrev={actingPrev}
            onActingNext={actingNext}
            onPostBlinds={postBlinds}
            onClearBets={clearBets}
            onNewHoleCards={newHoleCards}
          />

          <div>
            <ActionBar
              canCheck={canCheck}
              callAmount={callAmount}
              minRaise={Math.max(state.minRaise, Math.max(...bets) + state.bigBlind)}
              maxRaise={(state.seats[heroIndex]?.chips ?? 0) + heroBet}
              onFold={handleFold}
              onCheckCall={handleCheckCall}
              onRaise={handleRaise}
            />
            <div className="text-xs opacity-70 mt-2 text-center">Demo only — local state, no server. Just UI/UX.</div>
          </div>
        </div>
      </div>
    </div>
  );
}