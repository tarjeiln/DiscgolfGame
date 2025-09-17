import { useEffect, useReducer, useState } from "react";
import { reducer, initialState } from "./state/reducer";
import { loadState, saveState} from "./state/storage";
import Home from '@pages/Home';
import NewRound from '@pages/NewRound';
import InRound from '@pages/InRound';
import Summary from '@pages/Summary';
import type { RoundState } from '@models/models';
import SavedRoundView from "@components/SavedRoundView";


type Screen = "home" | "new" | "in" | "summary" | "saved";


function App() {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved ?? initialState());
  const [screen, setScreen] = useState<Screen>(saved?.currentRound ? "in" : "home");
  const [finishedRound, setFinishedRound] = useState<RoundState | null>(null);
  const [viewSavedId, setViewSavedId] = useState<string | undefined>(undefined);

  useEffect(()=>{ saveState(state); }, [state]);

  return (
    <div>
      {screen==="home" && (
        <Home
          onStart={()=>setScreen("new")}
          savedRounds={state.savedRounds ?? []}
          onOpenSaved={(id) => { setViewSavedId(id); setScreen('saved'); }}
        />
      )}

      {screen==="new" && (
        <NewRound
         onCreate={(name, players, holes, holesPreset, deckInclude, modChance) => {
          dispatch({ type: "NEW_ROUND", payload: {
            courseName: name, players, holes,
            holesPreset,
            defaultPar: 3,
            deckInclude,
            modChance
          }});
          setScreen("in");
        }}
        onBack={() => setScreen("home")}
        />
      )}

      {screen === 'saved' && viewSavedId && (
        <SavedRoundView
          round={(state.savedRounds ?? []).find(r => r.id === viewSavedId)!}
          onBack={() => setScreen('home')}
          onDelete={() => {
            dispatch({ type: 'DELETE_SAVED_ROUND', payload: { roundId: viewSavedId } });
            setScreen('home');
          }}
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
          round={state.currentRound!}
          onLogThrow={(pid) => dispatch({ type: "LOG_THROW", payload: { playerId: pid } })}
          onRemoveThrow={(pid) => dispatch({ type: "REMOVE_THROW", payload: { playerId: pid } })}
          onPrevHole={() => dispatch({ type: "PREV_HOLE" })}
          onNextHole={() => dispatch({ type: "NEXT_HOLE" })}
          onEnd={() => {
            dispatch({ type: 'END_ROUND' });   
            setScreen("home")
          }}
          onHome={() => setScreen("home")}
          onPickCard={(hole, playerId, cardId) => dispatch({ type: "PICK_CARD", payload: { hole, playerId, cardId } })}
        />
      )}
    </div>
  );
}
export default App;
