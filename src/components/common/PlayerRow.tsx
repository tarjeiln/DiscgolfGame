import styles from "./PlayerRow.module.css";
import type { ReactNode } from "react";

type Props = {
  index: number;            // 1-basert rekkefølgenummer
  name: string;
  count: number;            // kast på gjeldende hull
  total?: number;            // totalt antall kast i runden (valgfri)
  onPlus: () => void;
  onMinus: () => void;
  meta?: ReactNode;
};

export default function PlayerRow({ index, name, count, onPlus, onMinus, meta }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <span className={styles.name}>#{index} {name}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>

      <div className={styles.counter}>
        <button className={styles.minus} onClick={onMinus} disabled={count === 0}>−</button>
        <span className={styles.count}>{count}</span>
        <button className={styles.plus} onClick={onPlus}>+</button>
      </div>
    </div>
  );
}