En liten React + TypeScript-app som gjør discgolf til et spill med kort-utfordringer, enkel scoreføring og lagring av runder lokalt.

# Kom igang

## 1) Installer
npm i

## 2) Start dev
npm run dev


# Hovedfunksjoner

Ny runde: dynamisk liste med spillere, antall hull, og mulighet til å hente par per hull fra Disc Golf Metrix.

Kortspill i runden:

Hull 1: ett felles kort for alle.

Hull 2+: vises like mange kort som spillere – dårligst til nå velger først.

Scoreføring:

Tydelig par per hull.

Første trykk på + hopper rett til par (deretter justerer du opp/ned).

Hver spiller viser Totalscore og til par: Totalt: N (E/±M).

Navigasjon i runde: forrige/neste hull, avslutt runde.

Lagring:

Ferdige runder lagres i Mine runder (forsiden) med bane, dato, hull/par, spillere og score.



# Struktur
src/
  components/
    common/
      FormField.tsx
      FormFieldGroup.tsx
      HoleNav.tsx
      PlayerRow.tsx
    Home.tsx
    InRound.tsx
    NewRound.tsx
    SavedRoundView.tsx
    Summary.tsx
  lib/
    cards.ts          # kortstokk + shuffle
    metrix.ts         # Disc Golf Metrix-klient + smart søk
    stats.ts          # scoreboard(), coursePar()
    id.ts             # rid()
    storage.ts        # saveState/loadState
  models.ts           # typer (RoundState, SavedRound m.fl.)
  reducer.ts          # app-state + actions
  main.tsx, App.tsx
  global.css
Path-aliaser (brukes i import): @lib/*, @models/*, @components/*.

# Viktige konsepter

State & actions (reducer.ts)

NEW_ROUND, LOG_THROW, REMOVE_THROW, NEXT_HOLE, PREV_HOLE,

PICK_CARD (valg av kort på hull ≥ 2),

END_ROUND (flytter runden til savedRounds),

DELETE_SAVED_ROUND (fjerner en lagret runde).

Runde (RoundState): spillere, hull (med par), kastlogg, kort-info per hull.

Lagret runde (SavedRound): RoundState + endedAt.

Lagring: lokal lagring i localStorage (discgolf-app-state).

# Kort-logikk (MVP)

Deck bygges fra lib/cards.ts.

Hull 1: trekk 1 kort → alle får samme.

Hull 2+: trekk N kort (N=spillere) → vises som “bord”. Refrens: holeCards.

Pick order: beregnes fra “dårligst så langt” (flest kast), tiebreak på tee-rekkefølge.

# Metrix-integrasjon (par per hull)

Søk etter baner/layouts (smart søk med wildcards, ranking).

Ekspander parent-baner for å se layouts.

Fallback: lim inn Metrix-URL/ID → henter layout direkte.

# UI-detaljer

Forside: masthead + dynamisk bakgrunn, hero-kort, tips-kort, Mine runder-kort.

InRound: spiller-rader med PlayerRow (nå med “meta”-linje for totalscore), kort-seksjon, HoleNav.

NewRound: FormField, dynamiske spiller-felt, Metrix-søk med scrollbare “chips”.

Utilities i CSS: .container, .stack, .panel, .chips, .chip, .scroll.

# Feilsøk – Metrix

Ingen treff i dev? Sjekk at proxy er satt og at BASE='/metrix/api.php'.

Finner ikke spesifikk layout i søk? Bruk Lim inn URL/ID i NewRound.

Få nyere først: Sorter “Nyeste” i UI (bruker ID som proxy for alder).