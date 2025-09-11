import type { AppState } from "../types/models";

const KEY = "discgolf-app-state";

export function saveState(state: AppState) {
  try {
    const s = JSON.stringify(state);
    localStorage.setItem(KEY, s);
  } catch (e) {
    console.error("saveState error", e);
  }
}

export function loadState(): AppState | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as AppState;
    // enkel versjonssjekk – juster ved behov når du endrer struktur
    if (typeof parsed?.version !== "number") return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}
