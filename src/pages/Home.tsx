import styles from './Home.module.css';
import { scoreboard, coursePar } from '@lib/stats';
import type { SavedRound } from '@models/models';
import logolight from '@assets/logoLight.svg';
import logodark from '@assets/logoDark.svg';

type Props = {
  onStart: () => void;
  savedRounds: SavedRound[];
  onOpenSaved: (id: string) => void;   // ⬅️ NY
};

/*const APP_NAME = import.meta.env.VITE_APP_NAME ?? "";*/

export default function Home({ onStart, savedRounds, onOpenSaved }: Props) {
  const fmtDate = (t: number) =>
    new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  const sign = (n: number) => (n === 0 ? 'E' : n > 0 ? `+${n}` : `${n}`);

  return (
    <div className={styles.page}>
      <div className="bg" />
      <div className={styles.masthead}>
        <div className="container">
          <picture>
            <source srcSet={logodark} media="(prefers-color-scheme: dark)" />
            <img src={logolight} alt="Mando Madness" className={styles.logo} />
          </picture>
        </div>
      </div>

      <div className={styles.bg} aria-hidden="true" />

      <main className="container">
        <div className={styles.wrap}>
          {/* Kort 1: Hero */}
          <section className={styles.hero}>
            <h2 className={styles.heroTitle}>Start en ny runde</h2>
            <p className={styles.subtitle}>Legg til spillere og velg bane.</p>
            <div className={styles.actions}>
              <button type="button" onClick={onStart}>Ny runde</button>
            </div>
          </section>

          {/* Kort 2: Tips */}
          <section className={styles.tips}>
            <strong>Tips:</strong> Du kan legge til så mange spillere du vil på neste side.
          </section>

          {/* Kort 3: Mine runder */}
          <section className={styles.tips}>
            <h3 style={{ marginTop: 0 }}>Mine runder</h3>

            {(!savedRounds || savedRounds.length === 0) && (
              <p style={{ color: 'var(--muted)', margin: 0 }}>
                Ingen lagrede runder ennå.
              </p>
            )}

            {!!savedRounds?.length && (
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'grid', gap: 10
              }}>
                {savedRounds.map(r => {
                  const rows = scoreboard(r);
                  const par = coursePar(r);
                  const when = r.endedAt ?? r.updatedAt ?? r.createdAt;
                  const playersLine = rows
                    .map(x => `${x.name}: ${x.strokes} (${sign(x.toPar)})`)
                    .join(' · ');

                  return (
                    <li key={r.id}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          background: 'var(--surface)',
                          padding: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => onOpenSaved(r.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                        <strong>{r.courseName ?? 'Ukjent bane'}</strong>
                        <span style={{ color: 'var(--muted)' }}>{fmtDate(when)}</span>
                      </div>
                      <div style={{ color: 'var(--muted)' }}>
                        {r.holes.length} hull (Par {par})
                      </div>
                      <div style={{ marginTop: 6 }}>
                        {playersLine}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
