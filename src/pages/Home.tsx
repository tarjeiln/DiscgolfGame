import styles from './Home.module.css';

type Props = { onStart: () => void; onReset: () => void; };
const APP_NAME = import.meta.env.VITE_APP_NAME ?? "DiscgolfGame";

export default function Home({ onStart, onReset }: Props) {
  return (
    <div className={styles.page}>
      {/* Topplinje kun på forsiden */}
      <div className={styles.masthead}>
        <div className="container">
          <h1 className={styles.mastheadTitle}>{APP_NAME}</h1>
        </div>
      </div>

      {/* Dynamisk bakgrunn (valgfri) */}
      <div className={styles.bg} aria-hidden="true" />

      {/* Kortene under topplinja */}
      <main className="container">
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <h2 className={styles.heroTitle}>Start en ny runde – fort gjort.</h2>
            <p className={styles.subtitle}>Legg til spillere og sett antall hull.</p>
            <div className={styles.actions}>
              <button type="button" onClick={onStart}>Ny runde</button>
              <button type="button" className="btn-secondary" onClick={onReset}>Nullstill lagring</button>
            </div>
          </section>

          <section className={styles.tips}>
            <strong>Tips:</strong> Du kan legge til så mange spillere du vil på neste side.
          </section>
        </div>
      </main>
    </div>
  );
}
