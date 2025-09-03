export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "A" | "K" | "Q" | "J" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export interface Card { rank: Rank; suit: Suit }
export type Street = "preflop" | "flop" | "turn" | "river" | "showdown";
export interface PlayerSeat {
  id: string;
  name?: string; // undefined => empty seat
  chips: number;
  isHero?: boolean; // the human on this device
  folded?: boolean;
  sittingOut?: boolean;
  bet?: number; // amount currently committed this street
  cards?: [Card, Card]; // only visible to that player; server should filter per-user in real app
}
export interface TableState {
  handNumber: number;
  tableId: string;
  bigBlind: number;
  smallBlind: number;
  dealerButtonIndex: number; // index in seats array
  street: Street;
  community: Card[];
  pot: number;
  minRaise: number;
  seats: PlayerSeat[]; // clockwise ordering
  actingSeatIndex: number; // whose turn it is
}
export interface ChatMsg { id: string; name: string; text: string; ts: number }
export interface LogItem { id: string; text: string; ts: number }