type Props = {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onEnd:  () => void; // vises kun på siste hull
};

export default function HoleNav({ isFirst, isLast, onPrev, onNext, onEnd }: Props) {
  return (
    <div className="row" style={{ marginTop: 12 }}>
      <button onClick={onPrev} disabled={isFirst}>Forrige hull</button>
      <button onClick={onNext} disabled={isLast}>Neste hull</button>
      {isLast && <button onClick={onEnd}>Ferdig med runden</button>}
    </div>
  );
}
