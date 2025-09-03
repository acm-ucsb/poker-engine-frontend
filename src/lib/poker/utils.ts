import type { LogItem } from "./types";

export function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
}

export function addLog(setter: React.Dispatch<React.SetStateAction<LogItem[]>>, text: string) {
  setter(l => [...l, { id: `${Date.now()}-${Math.random()}`, text, ts: Date.now() }]);
}