type Props = { onStart: () => void; onReset: () => void; };
export default function Home({ onStart, onReset }: Props) {
  return (
    <div>
      <h2>Velkommen</h2>
      <p>Start en ny runde eller fortsett lagret.</p>
      <div className="row">
        <button onClick={onStart}>Ny runde</button>
        <button onClick={onReset}>Nullstill lagring</button>
      </div>
    </div>
  );
}
