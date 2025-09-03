import type { Card, Rank, Suit, TableState, PlayerSeat } from "./types";

export const RANKS: Rank[] = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];
export const SUITS: Suit[] = ["♠","♥","♦","♣"];
export const rand = (n: number) => Math.floor(Math.random()*n);
export const randCard = (): Card => ({ rank: RANKS[rand(RANKS.length)], suit: SUITS[rand(SUITS.length)] });
export const dealNCards = (n: number): Card[] => Array.from({ length: n }, randCard);

export function mockInitialState(tableId: string, heroName = "You"): TableState {
  const seats: PlayerSeat[] = Array.from({ length: 6 }).map((_, i) => ({
    id: `p${i+1}`,
    name: i === 0 ? heroName : i < 4 ? `Player ${i+1}` : undefined, // last two seats empty
    chips: 1000,
    isHero: i === 0,
    bet: 0,
    cards: [randCard(), randCard()],
  }));
  return {
    handNumber: 1,
    tableId,
    bigBlind: 20,
    smallBlind: 10,
    dealerButtonIndex: 3,
    street: "preflop",
    community: [],
    pot: 0,
    minRaise: 40,
    seats,
    actingSeatIndex: 0,
  };
}