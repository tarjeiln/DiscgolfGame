// src/lib/cards.ts
import type { Card, ID } from '@models/models';

export const CARDS: Card[] = [
  { id: 'c1', title: 'Bytt grep', description: 'Kast dette hullet med motsatt grep.' },
  { id: 'c2', title: 'Lav bane', description: 'Alle kast skal være under trærne (lav høyde).' },
  { id: 'c3', title: 'Puttemester', description: 'Hvis du putter fra >7m, får du minus 1 kast.' },
  { id: 'c4', title: 'Forehand only', description: 'Bare forehand på dette hullet.' },
  { id: 'c5', title: 'Backhand only', description: 'Bare backhand på dette hullet.' },
  { id: 'c6', title: 'Tynn linje', description: 'Første kast må passere et valgt tre innen 10m.' },
  { id: 'c7', title: 'Safety first', description: 'Ingen OB på første kast – kaster du OB, kast på nytt.' },
  { id: 'c8', title: 'Valgfri bonus', description: 'Får du par eller bedre, -1 ekstra.' },
  { id: 'c9', title: 'Under-par press', description: 'Bogey eller verre = +1 ekstra.' },
  { id: 'c10', title: 'Disk-begrensning', description: 'Bruk maks to ulike disker på hullet.' },

  { id: 'c11', title: 'Minidisk', description: 'Spill hele hullet med den minste disken du har.' },
  { id: 'c12', title: 'Blind start', description: 'Første kast må gjøres med bind for øynene (medhjelper peker).' },
  { id: 'c13', title: 'Venstre fot', description: 'Alle kast gjøres med venstre fot først i stance (høyre for venstrehendte).' },
  { id: 'c14', title: 'Ingen putter', description: 'Du får ikke bruke putteren din på dette hullet.' },
  { id: 'c15', title: 'Roller only', description: 'Alle kast må være rollers.' },
  { id: 'c16', title: 'Valgfritt tre', description: 'Første kast må passere venstre eller høyre side av et valgt tre.' },
  { id: 'c17', title: 'Stillekast', description: 'Hele flighten må være stille mens du kaster – bryter noen reglen, +1 på dem.' },
  { id: 'c18', title: 'Motsatt tee-rekkefølge', description: 'Den som egentlig skulle kastet sist, starter.' },
  { id: 'c19', title: 'En disk', description: 'Spill hele hullet med kun én valgt disk.' },
  { id: 'c20', title: 'Maks 2 kastetyper', description: 'Velg to kastetyper (f.eks. backhand & putt). Bare disse er lov.' },

  { id: 'c21', title: 'Par eller straff', description: 'Klarer du ikke par, får du +1 ekstra.' },
  { id: 'c22', title: 'Birdie bonus', description: 'Får du birdie, trekk -2 istedenfor -1.' },
  { id: 'c23', title: 'OB-trygg', description: 'OB teller ikke på første kast, men du må legge deg innenfor 30m av kurven.' },
  { id: 'c24', title: 'Hyzer only', description: 'Alle kast skal være hyzer-vinkel.' },
  { id: 'c25', title: 'Anhyzer only', description: 'Alle kast skal være anhyzer-vinkel.' },
  { id: 'c26', title: 'Over hodet', description: 'Første kast må være thumber eller tomahawk.' },
  { id: 'c27', title: 'Hopp-putt tvang', description: 'Alle putter over 5m må gjøres som jump-putt.' },
  { id: 'c28', title: 'Diskbytte', description: 'Velg en disk fra en annen spiller og bruk den på første kast.' },
  { id: 'c29', title: 'Korteste drive', description: 'Den som kaster kortest på utkastet får -1 bonus.' },
  { id: 'c30', title: 'Lengste drive', description: 'Den som kaster lengst på utkastet får +1 ekstra.' },

  { id: 'c31', title: 'Kjedekontroll', description: 'Treffer du kurvkjetting men misser, får du -1.' },
  { id: 'c32', title: 'Rask runde', description: 'Alle må kaste innen 15 sekunder fra turen deres starter.' },
  { id: 'c33', title: 'Strek-linje', description: 'Alle kast må krysse en tenkt linje (bestem før start).' },
  { id: 'c34', title: 'Bag på ryggen', description: 'Spill hele hullet med baggen på ryggen.' },
  { id: 'c35', title: 'Lav putt', description: 'Putt må slippes under midjehøyde.' },
  { id: 'c36', title: 'Høy putt', description: 'Putt må slippes over hodet.' },
  { id: 'c37', title: 'Tilfeldig rekkefølge', description: 'Trekk lodd om rekkefølgen på utkastet.' },
  { id: 'c38', title: 'Snikbonus', description: 'Hvis du treffer kurvkant på drive, -1.' },
  { id: 'c39', title: 'Ingen run-up', description: 'Alle kast må gjøres stående uten tilløp.' },
  { id: 'c40', title: 'Mini-putt', description: 'Siste putt må gjøres med mini-marker (hvis mulig).' },

  { id: 'c41', title: 'Treff tre', description: 'Treffer du et tre på første kast, får du -1.' },
  { id: 'c42', title: 'Unngå trær', description: 'Treffer du tre på første kast, +1.' },
  { id: 'c43', title: 'Rimelig drive', description: 'Alle må bruke den rimeligste disken sin på første kast.' },
  { id: 'c44', title: 'Dyreste disk', description: 'Alle må bruke den dyreste disken sin på første kast.' },
  { id: 'c45', title: 'Felles drive', description: 'Alle kaster samme type kast på første kast (f.eks. backhand hyzer).' },
  { id: 'c46', title: 'Lukke øynene', description: 'Lukk øynene i tilløpet, åpne ved slipp.' },
  { id: 'c47', title: 'Sirkelpress', description: 'Alle kast innenfor 10m må gjøres uten jump-putt.' },
  { id: 'c48', title: 'Langt utslag', description: 'Utkast må starte bak en markert linje 3m ekstra bak tee.' },
  { id: 'c49', title: 'Kort utslag', description: 'Utkast må starte 3m foran tee (hvis trygt).' },
  { id: 'c50', title: 'Venstre hånd', description: 'Spill hele hullet med motsatt hånd.' },

  { id: 'c51', title: 'Disk-lotto', description: 'Velg en tilfeldig disk med lukkede øyne.' },
  { id: 'c52', title: 'Treff kurv', description: 'Treffer du kurvkanten uten å gå i, -1.' },
  { id: 'c53', title: 'OB-bonus', description: 'Alle som unngår OB på hullet får -1.' },
  { id: 'c54', title: 'CTP', description: 'Closest-to-pin på drive får -1.' },
  { id: 'c55', title: 'Siste plass', description: 'Spilleren med dårligst score så langt får -1.' },
  { id: 'c56', title: 'Beste plass', description: 'Spilleren med best score så langt får +1.' },
  { id: 'c57', title: 'Diskbytte putt', description: 'Putt med en annen spillers putter.' },
  { id: 'c58', title: 'Sneak putt', description: 'Hvis du putter fra >10m og setter, -2.' },
  { id: 'c59', title: 'Over kurven', description: 'Første kast må krysse over kurvens høyde (velg punkt).' },
  { id: 'c60', title: 'Under kurven', description: 'Første kast må kastes under en valgt gren.' },

  { id: 'c61', title: 'Gangsti', description: 'Alle kast må starte med en fot på gangstien (eller tenkt linje).' },
  { id: 'c62', title: 'Bag swap', description: 'Bytt bag med en annen spiller på dette hullet.' },
  { id: 'c63', title: 'Disk swap', description: 'Bytt en valgfri disk med en annen spiller.' },
  { id: 'c64', title: 'Høyrisiko', description: 'Får du birdie eller bedre, -2. Hvis ikke, +2.' },
  { id: 'c65', title: 'Ingen par', description: 'Par teller som bogey. Birdie er normalt.' },
  { id: 'c66', title: 'Ingen birdie', description: 'Birdie teller bare som par.' },
  { id: 'c67', title: 'Kast på nytt', description: 'Må kaste første kast to ganger, velg beste.' },
  { id: 'c68', title: 'Dobbel drive', description: 'Alle spillere kaster to drivere, velg verste.' },
  { id: 'c69', title: 'Trekant-putt', description: 'Alle putter må gjøres fra en trekantet stance.' },
  { id: 'c70', title: 'Ingen mini', description: 'Det er ikke lov å markere, spill fra der disken ligger.' },

  { id: 'c71', title: 'Puttekonk', description: 'Hvis du setter en putt >7m, alle andre +1.' },
  { id: 'c72', title: 'Felles bonus', description: 'Klarer hele flighten par eller bedre, alle -1.' },

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
