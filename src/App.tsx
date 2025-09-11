import { useEffect, useReducer, useState } from "react";
import "./App.css";
import { reducer, initialState } from "./state/reducer";
import type { AppState } from "./types/models";
import { loadState, saveState, clearState } from "./state/storage";

function App() {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved ?? initialState());
  const [playersInput, setPlayersInput] = useState("Spiller 1, Spiller 2");
  const [holesInput, setHolesInput] = useState(18);
  const [courseName, setCourseName] = useState("Lokal bane");

  // autosave
  useEffect(() => {
    saveState(state as AppState);
  }, [state]);

  const startRound = () => {
    const names = playersInput.split(",").map(s => s.trim()).filter(Boolean);
    dispatch({ type: "NEW_ROUND", payload: { courseName, players: names, holes: holesInput, defaultPar: 3 } });
  };

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <h1>Discgolf (lokal MVP)</h1>

      {!state.currentRound && (
        <div>
          <h2>Ny runde</h2>
          <label>
            Bane:
            <input value={courseName} onChange={e => setCourseName(e.target.value)} />
          </label>
          <br />
          <label>
            Spillere (komma-separert):
            <input value={playersInput} onChange={e => setPlayersInput(e.target.value)} />
          </label>
          <br />
          <label>
            Antall hull:
            <input type="number" min={1} max={27} value={holesInput} onChange={e => setHolesInput(parseInt(e.target.value || "1"))} />
          </label>
          <br />
          <button onClick={startRound}>Start runde</button>
          <button style={{ marginLeft: 8 }} onClick={() => { clearState(); location.reload(); }}>Nullstill lagring</button>
        </div>
      )}

      {state.currentRound && (
        <div>
          <h2>{state.currentRound.courseName} – Hull {state.currentRound.currentHole}/{state.currentRound.holes.length}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {state.currentRound.players.map(p => (
              <button key={p.id} onClick={() => dispatch({ type: "LOG_THROW", payload: { playerId: p.id } })}>
                Kast logget: {p.name}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => dispatch({ type: "NEXT_HOLE" })}>Neste hull</button>
            <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: "END_ROUND" })}>Avslutt runde</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Logg</h3>
            <ul>
              {state.currentRound.throwLog.slice().reverse().map(ev => (
                <li key={ev.id}>
                  Hole {ev.hole} – {state.currentRound?.players.find(p => p.id === ev.playerId)?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
