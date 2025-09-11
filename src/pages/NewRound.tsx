import { useState } from "react";

type Props = { onCreate: (courseName:string, players:string[], holes:number)=>void; onBack: ()=>void; };

export default function NewRound({ onCreate, onBack }: Props) {
  const [courseName, setCourseName] = useState("Lokal bane");
  const [playersInput, setPlayersInput] = useState("Spiller 1, Spiller 2");
  const [holes, setHoles] = useState(18);

  return (
    <div>
      <h2>Ny runde</h2>

      <label>Bane:
        <input value={courseName} onChange={e=>setCourseName(e.target.value)} />
      </label><br/>

      <label>Spillere (komma):
        <input value={playersInput} onChange={e=>setPlayersInput(e.target.value)} />
      </label><br/>

      <label>Antall hull:
        <input type="number" min={1} max={27} value={holes}
               onChange={e=>setHoles(parseInt(e.target.value||"1"))} />
      </label><br/>

      <div className="row">
        <button onClick={()=>{
          const names = playersInput.split(",").map(s=>s.trim()).filter(Boolean);
          onCreate(courseName, names, holes);
        }}>Start</button>
        <button onClick={onBack}>Tilbake</button>
      </div>
    </div>
  );
}
