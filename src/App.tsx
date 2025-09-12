import { useEffect, useReducer, useState } from "react";
import { reducer, initialState } from "./state/reducer";
import { loadState, saveState, clearState } from "./state/storage";
import Home from "./pages/Home";
import NewRound from "./pages/NewRound";
import InRound from "./pages/InRound";
import Summary from "./pages/Summary";
import type { RoundState } from "./types/models";

type Screen = "home" | "new" | "in" | "summary";


function App() {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved ?? initialState());
  const [screen, setScreen] = useState<Screen>(saved?.currentRound ? "in" : "home");
  const [finishedRound, setFinishedRound] = useState<RoundState | null>(null);

  useEffect(()=>{ saveState(state); }, [state]);

  return (
    <div style={{ padding: 12, maxWidth: 520, margin: "0 auto" }}>
      <h1>Discgolf</h1>

      {screen==="home" && (
        <Home
          onStart={()=>setScreen("new")}
          onReset={()=>{ clearState(); location.reload(); }}
        />
      )}

      {screen==="new" && (
        <NewRound
          onCreate={(course, players, holes)=>{
            setFinishedRound(null);
            dispatch({ type:"NEW_ROUND", payload:{ courseName:course, players, holes, defaultPar:3 } });
            setScreen("in");
          }}
          onBack={()=>setScreen("home")}
        />
      )}

      {screen==="summary" && finishedRound && (
        <Summary
          round={finishedRound}
          onHome={()=>{
            setFinishedRound(null);
            setScreen("home");
          }}
        />
      )}

      {screen==="in" && state.currentRound && (
        <InRound
          round={state.currentRound}
          onLogThrow={(pid)=>dispatch({ type:"LOG_THROW", payload:{ playerId: pid } })}
          onRemoveThrow={(pid) => dispatch({ type: "REMOVE_THROW", payload: { playerId: pid } })}
          onPrevHole={()=>dispatch({ type:"PREV_HOLE" })}
          onNextHole={()=>dispatch({ type:"NEXT_HOLE" })}
          onEnd={()=>{
            if (state.currentRound) setFinishedRound(state.currentRound);
            dispatch({ type:"END_ROUND" });
            setScreen("summary");
          }}
        />
      )}
    </div>
  );
}
export default App;
