import type { RoundState, Player, ID } from '@models/models';
import styles from './InRound.module.css';
import PlayerRow from '@components/common/PlayerRow';
import HoleNav from '@components/common/HoleNav';


type Props = {
  round: RoundState;
  onLogThrow: (playerId: ID) => void;
  onRemoveThrow: (playerId: ID) => void;
  onPrevHole: () => void;
  onNextHole: () => void;
  onEnd: () => void;
  onHome?: () => void;
  onPickCard: (hole: number, playerId: ID, cardId: ID) => void;
};

export default function InRound({ round, onLogThrow, onRemoveThrow, onPrevHole, onNextHole, onEnd, onHome, onPickCard }: Props) {
  const currentHole = round.currentHole;

  const teeIds: ID[] = (round.teeOrder?.length ? round.teeOrder : round.players.map(p => p.id));
  const orderedPlayers: Player[] = teeIds
    .map(id => round.players.find(p => p.id === id) ?? null)
    .filter((p): p is Player => p !== null);

  const strokesOnHole = (playerId: ID) =>
    round.throwLog.filter(ev => ev.playerId === playerId && ev.hole === currentHole).length;

  const totalStrokes = (playerId: ID) =>
    round.throwLog.filter(ev => ev.playerId === playerId).length;

  const parForPlayedHoles = (playerId: ID) => {
    const played = new Set<number>();
    for (const ev of round.throwLog) {
      if (ev.playerId === playerId) played.add(ev.hole);
    }
    let sum = 0;
    played.forEach(h => { sum += round.holes[h - 1]?.par ?? 3; });
    return sum;
  };

  const formatToPar = (delta: number) => delta === 0 ? "E" : (delta > 0 ? `+${delta}` : `${delta}`);

  const handlePlus = (playerId: ID) => {
    const count = strokesOnHole(playerId);
    if (count === 0) {
      const par = round.holes[currentHole - 1]?.par ?? 3;
      for (let i = 0; i < par; i++) onLogThrow(playerId); // legg inn 'par' kast på første trykk
    } else {
      onLogThrow(playerId); // vanlig +1
    }
  };

  const isFirst = currentHole === 1;
  const isLast  = currentHole === round.holes.length;

  const hc = round.holeCards?.[currentHole];
  const cards = round.cards ?? {};

  // teller kast for en spiller på et hull
  function holeStrokes(round: RoundState, hole: number, playerId: ID): number {
    return round.throwLog.filter(ev => ev.playerId === playerId && ev.hole === hole).length;
  }

  // (kast - par) for et spesifikt hull. Hvis spilleren mangler kast (edge case), behandle som "ingen data" = 0.
  function holeDelta(round: RoundState, hole: number, playerId: ID): number {
    const strokes = holeStrokes(round, hole, playerId);
    if (strokes === 0) return 0; // ingen data → ikke bruk til å avgjøre
    const par = round.holes[hole - 1]?.par ?? 3;
    return strokes - par; // høyere = dårligere
  }

  // Sammenlign to spillere ved å gå bakover hull for hull til forskjell finnes.
  // Returnerer >0 hvis b er bedre enn a (a skal først), <0 hvis a er bedre enn b, 0 hvis helt likt tilbake til start.
  function compareBacktrack(round: RoundState, currentHole: number, aId: ID, bId: ID): number {
    for (let h = currentHole - 1; h >= 1; h--) {
      const da = holeDelta(round, h, aId);
      const db = holeDelta(round, h, bId);
      if (da !== db) {
        // dårligst først → høyere delta (da/db) skal komme FØRST
        return db - da;
      }
    }
    return 0; // helt likt tilbake til starten
  }


    // hvem sin tur på hull >= 2 (beregn rekkefølge dynamisk m/ tie-break)
  const teeIndex = new Map(teeIds.map((id, idx) => [id, idx]));

  const sortedPickOrder = [...orderedPlayers].sort((a, b) => {
    // 1) “Worst so far” → flest totale kast først
    const ta = totalStrokes(a.id);
    const tb = totalStrokes(b.id);
    if (ta !== tb) return tb - ta;

    // 2) Tie-break: gå bakover hull for hull til vi finner hvem som gjorde det dårligst sist
    const back = compareBacktrack(round, currentHole, a.id, b.id);
    if (back !== 0) return back;

    // 3) Helt likt tilbake til start → bruk rekkefølgen ved rundestart (teeOrder)
    return (teeIndex.get(a.id) ?? 0) - (teeIndex.get(b.id) ?? 0);
  });

  const alreadyPickedIds = new Set(Object.keys(hc?.picks ?? {}));
  const nextPicker = sortedPickOrder.find(p => !alreadyPickedIds.has(p.id));
  const currentPickerId = nextPicker?.id;
  const currentPickerName = nextPicker?.name;




  return (
    <main className="container">
      <div className="stack">
        <h2>{round.courseName ?? "Runde"} – Hull {currentHole}/{round.holes.length}</h2>
        <p style={{ marginTop: 6, marginBottom: 8 }}>
          <span className={styles.parBadge}>Hull {currentHole}: Par {round.holes[currentHole - 1]?.par ?? 3}</span>
        </p>

        {/* KORT-SEKSJON */}
        {hc && (
          <section>
            {currentHole === 1 && hc.sharedCardId && (
              <div className={styles.cards}>
                <article className={styles.card}>
                  <h3 className={styles.cardTitle}>{cards[hc.sharedCardId]?.title ?? 'Kort'}</h3>
                  <p className={styles.cardDesc}>{cards[hc.sharedCardId]?.description}</p>
                  <small>Gjelder alle spillere på hull 1.</small>
                </article>
              </div>
            )}

            {currentHole > 1 && hc.options && (
              <div className="stack">
                {!hc.finalized && currentPickerName && (
                  <p><strong> {currentPickerName}</strong> velger kort først.</p>
                )}
                <div className={styles.cards}>
                  {hc.options.map(cid => {
                    const c = cards[cid];
                    const pickedBy = Object.entries(hc.picks).find(([, id]) => id === cid)?.[0];
                    const pickedName = pickedBy ? round.players.find(p => p.id === pickedBy)?.name : undefined;

                    return (
                      <article key={cid} className={styles.card}>
                        <h3 className={styles.cardTitle}>{c?.title ?? 'Kort'}</h3>
                        <p className={styles.cardDesc}>{c?.description}</p>

                        {pickedName ? (
                          <div className={styles.picked}>Valgt av {pickedName}</div>
                        ) : (
                          !hc.finalized && currentPickerId && (
                            <button
                              type="button"
                              onClick={() => onPickCard(currentHole, currentPickerId, cid)}
                            >
                              Velg dette kortet
                            </button>
                          )
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* SPILLERLISTE */}
        <div className={styles.list}>
          {orderedPlayers.map((p, idx) => {
            const count = strokesOnHole(p.id);
            const total = totalStrokes(p.id);
            const delta = total - parForPlayedHoles(p.id);
            const meta = `Totalt: ${total} (${formatToPar(delta)})`;

            return (
              <PlayerRow
                key={p.id}
                index={idx + 1}
                name={p.name}
                count={count}
                onMinus={() => onRemoveThrow(p.id)}
                onPlus={() => handlePlus(p.id)}
                meta={meta}
              />
            );
          })}
        </div>

        <HoleNav
          isFirst={isFirst}
          isLast={isLast}
          onPrev={onPrevHole}
          onNext={onNextHole}
          onEnd={onEnd}
          onHome={onHome}
        />
      </div>
    </main>
  );
}