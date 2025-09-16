import type { Card, ID } from '@models/models';

/** ThrowStyle */
const CARDS_THROWSTYLE: Card[] = [
  { id: 'c1',  title: 'Bytt grep',        description: 'Kast dette hullet med motsatt grep.', category: 'ThrowStyle' },
  { id: 'c4',  title: 'Forehand only',    description: 'Bare forehand på dette hullet.',      category: 'ThrowStyle' },
  { id: 'c5',  title: 'Backhand only',    description: 'Bare backhand på dette hullet.',      category: 'ThrowStyle' },
  { id: 'c15', title: 'Roller only',      description: 'Alle kast må være rollers.',          category: 'ThrowStyle' },
  { id: 'c20', title: 'Maks 2 kastetyper',description: 'Velg to kastetyper (f.eks. backhand & putt). Bare disse er lov.', category: 'ThrowStyle' },
  { id: 'c24', title: 'Hyzer only',       description: 'Alle kast skal være hyzer-vinkel.',   category: 'ThrowStyle' },
  { id: 'c25', title: 'Anhyzer only',     description: 'Alle kast skal være anhyzer-vinkel.', category: 'ThrowStyle' },
  { id: 'c26', title: 'Over hodet',       description: 'Første kast må være thumber eller tomahawk.', category: 'ThrowStyle' },
  { id: 'c27', title: 'Hopp-putt tvang',  description: 'Alle putter over 5m må gjøres som jump-putt.', category: 'ThrowStyle' },
  { id: 'c39', title: 'Ingen run-up',     description: 'Alle kast må gjøres stående uten tilløp.', category: 'ThrowStyle' },
  { id: 'c45', title: 'Felles drive',     description: 'Alle kaster samme type kast på første kast (f.eks. backhand hyzer).', category: 'ThrowStyle' },
  { id: 'c47', title: 'Sirkelpress',      description: 'Alle kast innenfor 10m må gjøres uten jump-putt.', category: 'ThrowStyle' },
  { id: 'c50', title: 'Venstre hånd',     description: 'Spill hele hullet med motsatt hånd.', category: 'ThrowStyle' },
  { id: 'c35', title: 'Lav putt',         description: 'Putt må slippes under midjehøyde.',   category: 'ThrowStyle' },
  { id: 'c36', title: 'Høy putt',         description: 'Putt må slippes over hodet.',         category: 'ThrowStyle' },
];

/** Scoring */
const CARDS_SCORING: Card[] = [
  { id: 'c3',  title: 'Puttemester',      description: 'Hvis du putter fra >7m, får du minus 1 kast.', category: 'Scoring' },
  { id: 'c8',  title: 'Valgfri bonus',    description: 'Får du par eller bedre, -1 ekstra.',           category: 'Scoring' },
  { id: 'c9',  title: 'Under-par press',  description: 'Bogey eller verre = +1 ekstra.',               category: 'Scoring' },
  { id: 'c21', title: 'Par eller straff', description: 'Klarer du ikke par, får du +1 ekstra.',        category: 'Scoring' },
  { id: 'c22', title: 'Birdie bonus',     description: 'Får du birdie, trekk -2 istedenfor -1.',       category: 'Scoring' },
  { id: 'c29', title: 'Korteste drive',   description: 'Den som kaster kortest på utkastet får -1 bonus.', category: 'Scoring' },
  { id: 'c30', title: 'Lengste drive',    description: 'Den som kaster lengst på utkastet får +1 ekstra.', category: 'Scoring' },
  { id: 'c31', title: 'Kjedekontroll',    description: 'Treffer du kurvkjetting men misser, får du -1.', category: 'Scoring' },
  { id: 'c38', title: 'Snikbonus',        description: 'Hvis du treffer kurvkant på drive, -1.',       category: 'Scoring' },
  { id: 'c41', title: 'Treff tre',        description: 'Treffer du et tre på første kast, får du -1.', category: 'Scoring' },
  { id: 'c42', title: 'Unngå trær',       description: 'Treffer du tre på første kast, +1.',           category: 'Scoring' },
  { id: 'c52', title: 'Treff kurv',       description: 'Treffer du kurvkanten uten å gå i, -1.',       category: 'Scoring' },
  { id: 'c53', title: 'OB-bonus',         description: 'Alle som unngår OB på hullet får -1.',         category: 'Scoring' },
  { id: 'c54', title: 'CTP',              description: 'Closest-to-pin på drive får -1.',              category: 'Scoring' },
  { id: 'c55', title: 'Siste plass',      description: 'Spilleren med dårligst score så langt får -1.', category: 'Scoring' },
  { id: 'c56', title: 'Beste plass',      description: 'Spilleren med best score så langt får +1.',    category: 'Scoring' },
  { id: 'c58', title: 'Sneak putt',       description: 'Hvis du putter fra >10m og setter, -2.',       category: 'Scoring' },
  { id: 'c64', title: 'Høyrisiko',        description: 'Får du birdie eller bedre, -2. Hvis ikke, +2.', category: 'Scoring' },
  { id: 'c65', title: 'Ingen par',        description: 'Par teller som bogey. Birdie er normalt.',     category: 'Scoring' },
  { id: 'c66', title: 'Ingen birdie',     description: 'Birdie teller bare som par.',                  category: 'Scoring' },
  { id: 'c71', title: 'Puttekonk',        description: 'Hvis du setter en putt >7m, alle andre +1.',   category: 'Scoring' },
  { id: 'c72', title: 'Felles bonus',     description: 'Klarer hele flighten par eller bedre, alle -1.', category: 'Scoring' },
];

/** Challenge */
const CARDS_CHALLENGE: Card[] = [
  { id: 'c2',  title: 'Lav bane',         description: 'Alle kast skal være under trærne (lav høyde).', category: 'Challenge' },
  { id: 'c6',  title: 'Tynn linje',       description: 'Første kast må passere et valgt tre innen 10m.', category: 'Challenge' },
  { id: 'c12', title: 'Blind start',      description: 'Første kast må gjøres med bind for øynene (medhjelper peker).', category: 'Challenge' },
  { id: 'c13', title: 'Venstre fot',      description: 'Alle kast gjøres med venstre fot først i stance (høyre for venstrehendte).', category: 'Challenge' },
  { id: 'c16', title: 'Valgfritt tre',    description: 'Første kast må passere venstre eller høyre side av et valgt tre.', category: 'Challenge' },
  { id: 'c23', title: 'OB-trygg',         description: 'OB teller ikke på første kast, men du må legge deg innenfor 30m av kurven.', category: 'Challenge' },
  { id: 'c32', title: 'Rask runde',       description: 'Alle må kaste innen 15 sekunder fra turen deres starter.', category: 'Challenge' },
  { id: 'c33', title: 'Strek-linje',      description: 'Alle kast må krysse en tenkt linje (bestem før start).', category: 'Challenge' },
  { id: 'c34', title: 'Bag på ryggen',    description: 'Spill hele hullet med baggen på ryggen.', category: 'Challenge' },
  { id: 'c48', title: 'Langt utslag',     description: 'Utkast må starte bak en markert linje 3m ekstra bak tee.', category: 'Challenge' },
  { id: 'c49', title: 'Kort utslag',      description: 'Utkast må starte 3m foran tee (hvis trygt).', category: 'Challenge' },
  { id: 'c59', title: 'Over kurven',      description: 'Første kast må krysse over kurvens høyde (velg punkt).', category: 'Challenge' },
  { id: 'c60', title: 'Under kurven',     description: 'Første kast må kastes under en valgt gren.', category: 'Challenge' },
  { id: 'c61', title: 'Gangsti',          description: 'Alle kast må starte med en fot på gangstien (eller tenkt linje).', category: 'Challenge' },
  { id: 'c69', title: 'Trekant-putt',     description: 'Alle putter må gjøres fra en trekantet stance.', category: 'Challenge' },
  { id: 'c46', title: 'Lukke øynene',     description: 'Lukk øynene i tilløpet, åpne ved slipp.', category: 'Challenge' },
];

/** DiscLimit */
const CARDS_DISCLIMIT: Card[] = [
  { id: 'c10', title: 'Disk-begrensning', description: 'Bruk maks to ulike disker på hullet.', category: 'DiscLimit' },
  { id: 'c11', title: 'Minidisk',         description: 'Spill hele hullet med den minste disken du har.', category: 'DiscLimit' },
  { id: 'c14', title: 'Ingen putter',     description: 'Du får ikke bruke putteren din på dette hullet.', category: 'DiscLimit' },
  { id: 'c19', title: 'En disk',          description: 'Spill hele hullet med kun én valgt disk.', category: 'DiscLimit' },
  { id: 'c28', title: 'Diskbytte',        description: 'Velg en disk fra en annen spiller og bruk den på første kast.', category: 'DiscLimit' },
  { id: 'c40', title: 'Mini-putt',        description: 'Siste putt må gjøres med mini-marker (hvis mulig).', category: 'DiscLimit' },
  { id: 'c43', title: 'Rimelig drive',    description: 'Alle må bruke den rimeligste disken sin på første kast.', category: 'DiscLimit' },
  { id: 'c44', title: 'Dyreste disk',     description: 'Alle må bruke den dyreste disken sin på første kast.', category: 'DiscLimit' },
  { id: 'c51', title: 'Disk-lotto',       description: 'Velg en tilfeldig disk med lukkede øyne.', category: 'DiscLimit' },
  { id: 'c57', title: 'Diskbytte putt',   description: 'Putt med en annen spillers putter.', category: 'DiscLimit' },
  { id: 'c62', title: 'Bag swap',         description: 'Bytt bag med en annen spiller på dette hullet.', category: 'DiscLimit' },
  { id: 'c63', title: 'Disk swap',        description: 'Bytt en valgfri disk med en annen spiller.', category: 'DiscLimit' },
  { id: 'c70', title: 'Ingen mini',       description: 'Det er ikke lov å markere, spill fra der disken ligger.', category: 'DiscLimit' },
];

/** Other (rekkefølge/sosial/regler som ikke passer i de andre) */
const CARDS_OTHER: Card[] = [
  { id: 'c17', title: 'Stillekast',           description: 'Hele flighten må være stille mens du kaster – bryter noen reglen, +1 på dem.', category: 'Other' },
  { id: 'c18', title: 'Motsatt tee-rekkefølge', description: 'Den som egentlig skulle kastet sist, starter.', category: 'Other' },
  { id: 'c37', title: 'Tilfeldig rekkefølge', description: 'Trekk lodd om rekkefølgen på utkastet.', category: 'Other' },
  { id: 'c67', title: 'Kast på nytt',         description: 'Må kaste første kast to ganger, velg beste.', category: 'Other' },
  { id: 'c68', title: 'Dobbel drive',         description: 'Alle spillere kaster to drivere, velg verste.', category: 'Other' },
];

/** Samlet liste som før – resten av appen kan fortsatt importere CARDS */
export const CARDS: Card[] = [
  ...CARDS_THROWSTYLE,
  ...CARDS_SCORING,
  ...CARDS_CHALLENGE,
  ...CARDS_DISCLIMIT,
  ...CARDS_OTHER,
];

/** Valgfritt: eksportér grupper også, nyttig i UI/filtre */
export const CARD_GROUPS = {
  ThrowStyle: CARDS_THROWSTYLE,
  Scoring: CARDS_SCORING,
  Challenge: CARDS_CHALLENGE,
  DiscLimit: CARDS_DISCLIMIT,
  Other: CARDS_OTHER,
} as const;

/** Dev-sjekk: varsle i konsollen hvis duplikate ID-er sniker seg inn */
if (import.meta.env.DEV) {
  const ids = CARDS.map(c => c.id);
  const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dups.length) {
    // eslint-disable-next-line no-console
    console.warn('[cards] Duplicate card IDs:', Array.from(new Set(dups)));
  }
}


function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


export function buildDeck(opts?: {
  include?: Card['category'][]; // f.eks. ['ThrowStyle','Scoring']
  minSize?: number;             // f.eks. 72
}) {
  const base = opts?.include?.length
    ? CARDS.filter(c => opts!.include!.includes(c.category))
    : CARDS;

  // bygg id-liste og dupliser til vi når minSize (eller minst én runde av base)
  const target = opts?.minSize ?? base.length;
  const ids: ID[] = [];
  while (ids.length < target) ids.push(...base.map(c => c.id));

  const deck = shuffle(ids.slice(0, target));
  const cards = Object.fromEntries(base.map(c => [c.id, c])) as Record<ID, Card>;
  return { cards, deck };
}

