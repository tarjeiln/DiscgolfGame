// src/lib/cards.ts
import type { Card, ID } from '@models/models';

export const CARDS: Card[] = [
  { id: 'c1', title: 'Bytt grep', description: 'Kast dette hullet med motsatt grep.' },
  { id: 'c2', title: 'Lav bane', description: 'Alle kast skal være under trærne (lav høyde).' },
  { id: 'c3', title: 'Puttemester', description: 'Hvis du putter fra >7m, får du minus 1 kast.' },
  { id: 'c4', title: 'Forehand only', description: 'Bare forehand på dette hullet.' },
  { id: 'c5', title: 'Backhand only', description: 'Bare backhand på dette hullet.' },
  { id: 'c6', title: 'Tynn linje', description: 'Første kast må passere et valgt tre innen 10m.' },
  { id: 'c7', title: 'Safety first', description: 'Ingen OB på første kast – kaster du OB, kast på nytt +1.' },
  { id: 'c8', title: 'Valgfri bonus', description: 'Får du par eller bedre, -1 ekstra.' },
  { id: 'c9', title: 'Under-par press', description: 'Bogey eller verre = +1 ekstra.' },
  { id: 'c10', title: 'Disk-begrensning', description: 'Bruk maks to ulike disker på hullet.' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildDeck() {
  const cards = Object.fromEntries(CARDS.map(c => [c.id, c])) as Record<ID, Card>;
  const deck = shuffle(CARDS.map(c => c.id));
  return { cards, deck };
}
