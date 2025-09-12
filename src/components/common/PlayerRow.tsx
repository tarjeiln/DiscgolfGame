import styles from "./PlayerRow.module.css";

type Props = {
  index: number;            // 1-basert rekkefølgenummer
  name: string;
  count: number;            // kast på gjeldende hull
  total?: number;            // totalt antall kast i runden (valgfri)
  onPlus: () => void;
  onMinus: () => void;
};

export default function PlayerRow({ index, name, count, total,  onPlus, onMinus }: Props) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>#{index} {name}</span>
        {typeof total === 'number' && <span className={styles.total}> {total}</span>}
      <div className={styles.counter}>
        <button className={styles.minus} onClick={onMinus} disabled={count === 0}>−</button>
        <span className={styles.count}>{count}</span>
        <button className={styles.plus} onClick={onPlus}>+</button>
      </div>
    </div>
  );
}
