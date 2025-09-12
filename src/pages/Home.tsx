type Props = { onStart: () => void; onReset: () => void; };
export default function Home({ onStart, onReset }: Props) {
  return (
    <div>
      <h2>Velkommen</h2>
      <p>Start en ny runde</p>
      <div className="row">
        <button type ="button" onClick={onStart}>Ny runde</button>
        <button type ="button" onClick={onReset}>Nullstill lagring</button>
      </div>
    </div>
  );
}
