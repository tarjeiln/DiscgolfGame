import { useEffect, useReducer, useState } from "react";
import "./App.css";
import { reducer, initialState } from "./state/reducer";
import { loadState, saveState, clearState } from "./state/storage";
import Home from "./pages/Home";
import NewRound from "./pages/NewRound";
import InRound from "./pages/InRound";

type Screen = "home" | "new" | "in";

function App() {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved ?? initialState());
  const [screen, setScreen] = useState<Screen>(saved?.currentRound ? "in" : "home");

  useEffect(()=>{ saveState(state); }, [state]);

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <h1>Discgolf (lokal MVP)</h1>

      {screen==="home" && (
        <Home
          onStart={()=>setScreen("new")}
          onReset={()=>{ clearState(); location.reload(); }}
        />
      )}

      {screen==="new" && (
        <NewRound
          onCreate={(course, players, holes)=>{
            dispatch({ type:"NEW_ROUND", payload:{ courseName:course, players, holes, defaultPar:3 } });
            setScreen("in");
          }}
          onBack={()=>setScreen("home")}
        />
      )}

      {screen==="in" && state.currentRound && (
        <InRound
          round={state.currentRound}
          onLogThrow={(pid)=>dispatch({ type:"LOG_THROW", payload:{ playerId: pid } })}
          onNextHole={()=>dispatch({ type:"NEXT_HOLE" })}
          onEnd={()=>{ dispatch({ type:"END_ROUND" }); setScreen("home"); }}
          onUndo={()=>dispatch({ type:"UNDO" })}
        />
      )}
    </div>
  );
}
export default App;
