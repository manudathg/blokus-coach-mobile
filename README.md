# blockus-mentor

Interactive Blokus learning app with full 2-player gameplay using all 21 official Blokus pieces.

## What is included

- All 21 pieces for each player (`1 mono`, `1 domino`, `2 trominoes`, `5 tetrominoes`, `12 pentominoes`)
- Persistent placement on a 14x14 board
- Rule enforcement:
  - first move must cover each player's starting corner
  - later moves must corner-touch own tiles
  - own tiles cannot edge-touch
- Two modes:
  - Human vs Human
  - Human vs AI (simple legal-move AI)
- Rotate/flip controls, move hints, pass handling, endgame scoring

## Run locally

```bash
cd /Users/manu/Documents/blokus-coach
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Notes

- In AI mode, click `New Game` after changing mode to restart with AI enabled.
- AI currently chooses a legal move greedily (largest available piece first).
