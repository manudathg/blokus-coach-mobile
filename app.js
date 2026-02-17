const BOARD_SIZE = 14;

const pieces = [
  { id: "I1", name: "I1", cells: [[0, 0]] },
  { id: "I2", name: "I2", cells: [[0, 0], [1, 0]] },
  { id: "I3", name: "I3", cells: [[0, 0], [1, 0], [2, 0]] },
  { id: "V3", name: "V3", cells: [[0, 0], [0, 1], [1, 1]] },
  { id: "I4", name: "I4", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { id: "L4", name: "L4", cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  { id: "O4", name: "O4", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { id: "T4", name: "T4", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { id: "Z4", name: "Z4", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: "F5", name: "F", cells: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]] },
  { id: "I5", name: "I5", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
  { id: "L5", name: "L", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]] },
  { id: "N5", name: "N", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1]] },
  { id: "P5", name: "P", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]] },
  { id: "T5", name: "T", cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]] },
  { id: "U5", name: "U", cells: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
  { id: "V5", name: "V", cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { id: "W5", name: "W", cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]] },
  { id: "X5", name: "X", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
  { id: "Y5", name: "Y", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1]] },
  { id: "Z5", name: "Z", cells: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]] }
];

const playerConfig = {
  1: { name: "Player 1", className: "p1", start: [0, 0] },
  2: { name: "Player 2", className: "p2", start: [BOARD_SIZE - 1, BOARD_SIZE - 1] }
};

const boardEl = document.getElementById("board");
const xTopEl = document.getElementById("x-top");
const xBottomEl = document.getElementById("x-bottom");
const yLeftEl = document.getElementById("y-left");
const yRightEl = document.getElementById("y-right");
const feedbackEl = document.getElementById("feedback");
const turnIndicatorEl = document.getElementById("turn-indicator");
const modeSelectEl = document.getElementById("mode-select");
const player1PanelEl = document.getElementById("player1-panel");
const player2PanelEl = document.getElementById("player2-panel");
const player1TitleEl = document.getElementById("player1-title");
const player1NameEl = document.getElementById("player1-name");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");
const player1RemainingEl = document.getElementById("player1-remaining");
const player2RemainingEl = document.getElementById("player2-remaining");
const player2TitleEl = document.getElementById("player2-title");
const player2NameEl = document.getElementById("player2-name");
const controlsByPlayer = {
  1: {
    pieceSelect: document.getElementById("p1-piece-select"),
    rotateBtn: document.getElementById("p1-rotate-btn"),
    flipBtn: document.getElementById("p1-flip-btn"),
    hintBtn: document.getElementById("p1-hint-btn"),
    passBtn: document.getElementById("p1-pass-btn"),
    piecePreview: document.getElementById("p1-piece-preview"),
    reasoningEl: document.getElementById("p1-reasoning")
  },
  2: {
    pieceSelect: document.getElementById("p2-piece-select"),
    rotateBtn: document.getElementById("p2-rotate-btn"),
    flipBtn: document.getElementById("p2-flip-btn"),
    hintBtn: document.getElementById("p2-hint-btn"),
    passBtn: document.getElementById("p2-pass-btn"),
    piecePreview: document.getElementById("p2-piece-preview"),
    reasoningEl: document.getElementById("p2-reasoning")
  }
};

const game = {
  board: [],
  mode: "hvh",
  currentPlayer: 1,
  hasPlaced: { 1: false, 2: false },
  inventory: { 1: new Set(), 2: new Set() },
  selectedPieceByPlayer: { 1: "I1", 2: "I1" },
  rotationByPlayer: { 1: 0, 2: 0 },
  flippedByPlayer: { 1: false, 2: false },
  preview: null,
  lastMoveCells: [],
  isGameOver: false,
  consecutivePasses: 0,
  aiThinking: false,
  reasoning: { 1: "", 2: "" },
  playerNames: { 1: "Player 1", 2: "Player 2", ai: "AI" },
  theme: "default"
};

const transformsByPiece = new Map();

function key(x, y) {
  return `${x},${y}`;
}

function playerLabel(player) {
  if (game.mode === "ai" && player === 2) {
    return game.playerNames.ai || "AI";
  }
  return game.playerNames[player] || playerConfig[player].name;
}

function isPlayerHuman(player) {
  return game.mode !== "ai" || player === 1;
}

function updateTurnHighlight() {
  player1PanelEl.classList.toggle("active", !game.isGameOver && game.currentPlayer === 1);
  player2PanelEl.classList.toggle("active", !game.isGameOver && game.currentPlayer === 2);
}

function updatePlayerTitles() {
  player1NameEl.value = game.playerNames[1] || "Player 1";
  if (game.mode === "ai") {
    player2NameEl.value = game.playerNames.ai || "AI";
    player2NameEl.disabled = true;
  } else {
    player2NameEl.value = game.playerNames[2] || "Player 2";
    player2NameEl.disabled = false;
  }
}

function setReasoning(player, text) {
  game.reasoning[player] = text;
  controlsByPlayer[player].reasoningEl.textContent = text;
}

function renderCoordinates() {
  xTopEl.innerHTML = "";
  xBottomEl.innerHTML = "";
  yLeftEl.innerHTML = "";
  yRightEl.innerHTML = "";

  for (let i = 1; i <= BOARD_SIZE; i += 1) {
    const xTop = document.createElement("span");
    xTop.textContent = String(i);
    xTopEl.appendChild(xTop);

    const xBottom = document.createElement("span");
    xBottom.textContent = String(i);
    xBottomEl.appendChild(xBottom);

    const yLeft = document.createElement("span");
    yLeft.textContent = String(i);
    yLeftEl.appendChild(yLeft);

    const yRight = document.createElement("span");
    yRight.textContent = String(i);
    yRightEl.appendChild(yRight);
  }
}

function canUsePlayerControls(player) {
  return !game.isGameOver && !game.aiThinking && game.currentPlayer === player && isPlayerHuman(player);
}

function normalizeCells(cells) {
  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));
  const shifted = cells.map((cell) => ({ x: cell.x - minX, y: cell.y - minY }));
  shifted.sort((a, b) => (a.y - b.y) || (a.x - b.x));
  return shifted;
}

function transformCells(baseCells, rotation, flipped) {
  let transformed = baseCells.map(([x, y]) => ({ x, y }));

  if (flipped) {
    transformed = transformed.map((cell) => ({ x: -cell.x, y: cell.y }));
  }

  for (let i = 0; i < rotation; i += 1) {
    transformed = transformed.map((cell) => ({ x: -cell.y, y: cell.x }));
  }

  return normalizeCells(transformed);
}

function getPieceById(pieceId) {
  return pieces.find((piece) => piece.id === pieceId);
}

function precomputeTransforms() {
  for (const piece of pieces) {
    const unique = new Map();
    for (const flip of [false, true]) {
      for (let rotation = 0; rotation < 4; rotation += 1) {
        const cells = transformCells(piece.cells, rotation, flip);
        const signature = cells.map((cell) => `${cell.x}:${cell.y}`).join("|");
        if (!unique.has(signature)) {
          unique.set(signature, cells);
        }
      }
    }
    transformsByPiece.set(piece.id, [...unique.values()]);
  }
}

function makeEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => 0));
}

function inBounds(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function getCurrentShape(player) {
  const pieceId = game.selectedPieceByPlayer[player];
  const piece = getPieceById(pieceId);
  if (!piece) {
    return [];
  }
  return transformCells(piece.cells, game.rotationByPlayer[player], game.flippedByPlayer[player]);
}

function getPlacedCells(anchorX, anchorY, shape) {
  return shape.map((cell) => ({ x: anchorX + cell.x, y: anchorY + cell.y }));
}

function evaluatePlacement(player, anchorX, anchorY, shape) {
  if (shape.length === 0) {
    return { ok: false, reason: "Select a piece first." };
  }

  const occupied = getPlacedCells(anchorX, anchorY, shape);
  const occupiedSet = new Set(occupied.map((cell) => key(cell.x, cell.y)));

  for (const cell of occupied) {
    if (!inBounds(cell.x, cell.y)) {
      return { ok: false, reason: "Piece is out of bounds." };
    }

    if (game.board[cell.y][cell.x] !== 0) {
      return { ok: false, reason: "Pieces cannot overlap." };
    }
  }

  if (!game.hasPlaced[player]) {
    const [sx, sy] = playerConfig[player].start;
    const touchesStart = occupied.some((cell) => cell.x === sx && cell.y === sy);
    if (!touchesStart) {
      return { ok: false, reason: `${playerLabel(player)} first move must cover its starting corner.` };
    }
    return { ok: true, reason: "Valid opening move." };
  }

  let cornerTouch = false;

  for (const cell of occupied) {
    const edgeNeighbors = [
      [cell.x + 1, cell.y],
      [cell.x - 1, cell.y],
      [cell.x, cell.y + 1],
      [cell.x, cell.y - 1]
    ];

    for (const [nx, ny] of edgeNeighbors) {
      if (!inBounds(nx, ny) || occupiedSet.has(key(nx, ny))) {
        continue;
      }

      if (game.board[ny][nx] === player) {
        return { ok: false, reason: "Your own pieces cannot touch edge-to-edge." };
      }
    }

    const cornerNeighbors = [
      [cell.x + 1, cell.y + 1],
      [cell.x + 1, cell.y - 1],
      [cell.x - 1, cell.y + 1],
      [cell.x - 1, cell.y - 1]
    ];

    for (const [nx, ny] of cornerNeighbors) {
      if (!inBounds(nx, ny) || occupiedSet.has(key(nx, ny))) {
        continue;
      }

      if (game.board[ny][nx] === player) {
        cornerTouch = true;
      }
    }
  }

  if (!cornerTouch) {
    return { ok: false, reason: "New pieces must touch your own pieces by corner." };
  }

  return { ok: true, reason: "Legal move." };
}

function renderBoard() {
  const previewSet = new Set((game.preview?.cells ?? []).map((cell) => key(cell.x, cell.y)));
  const lastMoveSet = new Set((game.lastMoveCells ?? []).map((cell) => key(cell.x, cell.y)));

  boardEl.innerHTML = "";
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cellEl = document.createElement("button");
      cellEl.type = "button";
      cellEl.className = "cell";
      cellEl.dataset.x = String(x);
      cellEl.dataset.y = String(y);

      const owner = game.board[y][x];
      if (owner === 1) {
        cellEl.classList.add("p1");
      } else if (owner === 2) {
        cellEl.classList.add("p2");
      }

      if ((x === 0 && y === 0) || (x === BOARD_SIZE - 1 && y === BOARD_SIZE - 1)) {
        cellEl.classList.add("corner");
      }

      if (previewSet.has(key(x, y))) {
        cellEl.classList.add(game.preview?.ok ? "preview-ok" : "preview-bad");
      }
      if (lastMoveSet.has(key(x, y))) {
        cellEl.classList.add("last-move");
      }

      boardEl.appendChild(cellEl);
    }
  }
}

function setFeedback(text, type = "good") {
  feedbackEl.textContent = text;
  feedbackEl.classList.toggle("good", type === "good");
  feedbackEl.classList.toggle("bad", type === "bad");
}

function updateScore() {
  let p1Tiles = 0;
  let p2Tiles = 0;

  for (const row of game.board) {
    for (const cell of row) {
      if (cell === 1) {
        p1Tiles += 1;
      }
      if (cell === 2) {
        p2Tiles += 1;
      }
    }
  }

  player1ScoreEl.textContent = `Tiles: ${p1Tiles} | Pieces left: ${game.inventory[1].size}`;
  player2ScoreEl.textContent = `Tiles: ${p2Tiles} | Pieces left: ${game.inventory[2].size}`;

  return { p1Tiles, p2Tiles };
}

function renderPieceSelect(player) {
  const control = controlsByPlayer[player];
  control.pieceSelect.innerHTML = "";

  const available = pieces.filter((piece) => game.inventory[player].has(piece.id));
  if (available.length === 0) {
    game.selectedPieceByPlayer[player] = "";
    return;
  }

  if (!game.inventory[player].has(game.selectedPieceByPlayer[player])) {
    game.selectedPieceByPlayer[player] = available[0].id;
    game.rotationByPlayer[player] = 0;
    game.flippedByPlayer[player] = false;
  }

  for (const piece of available) {
    const option = document.createElement("option");
    option.value = piece.id;
    option.textContent = `${piece.name} (${piece.cells.length})`;
    control.pieceSelect.appendChild(option);
  }

  control.pieceSelect.value = game.selectedPieceByPlayer[player];
}

function renderPiecePreview(player) {
  const control = controlsByPlayer[player];
  control.piecePreview.innerHTML = "";
  const shape = getCurrentShape(player);
  const shapeSet = new Set(shape.map((cell) => key(cell.x, cell.y)));

  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const tile = document.createElement("div");
      tile.className = "preview-cell";
      if (shapeSet.has(key(x, y))) {
        tile.classList.add("on", playerConfig[player].className);
      }
      control.piecePreview.appendChild(tile);
    }
  }
}

function renderRemainingPieces(player, targetEl) {
  targetEl.innerHTML = "";

  const left = pieces
    .filter((piece) => game.inventory[player].has(piece.id))
    .sort((a, b) => b.cells.length - a.cells.length || a.id.localeCompare(b.id));

  for (const piece of left) {
    const chip = document.createElement("span");
    chip.className = "piece-chip";
    chip.textContent = `${piece.name} (${piece.cells.length})`;
    targetEl.appendChild(chip);
  }
}

function updateTurnLabel() {
  if (game.isGameOver) {
    turnIndicatorEl.textContent = "Game Over 🏁";
    return;
  }
  turnIndicatorEl.textContent = `Turn: ${playerLabel(game.currentPlayer)} 🎯`;
}

function updateControlStates() {
  for (const player of [1, 2]) {
    const control = controlsByPlayer[player];
    const isActivePlayer = game.currentPlayer === player;
    const turnEnabled = !game.isGameOver && !game.aiThinking && isActivePlayer && isPlayerHuman(player);
    const hasPieces = game.inventory[player].size > 0;
    const pieceEnabled = turnEnabled && hasPieces;

    control.pieceSelect.disabled = !pieceEnabled;
    control.rotateBtn.disabled = !pieceEnabled;
    control.flipBtn.disabled = !pieceEnabled;
    control.hintBtn.disabled = !pieceEnabled;
    control.passBtn.disabled = !turnEnabled;
  }
}

function renderReasoning() {
  controlsByPlayer[1].reasoningEl.textContent = game.reasoning[1] || "Pick a piece and have fun!";
  controlsByPlayer[2].reasoningEl.textContent = game.reasoning[2] || "Waiting for a move.";
}

function syncUI() {
  updatePlayerTitles();
  updateTurnLabel();
  renderPieceSelect(1);
  renderPieceSelect(2);
  renderPiecePreview(1);
  renderPiecePreview(2);
  renderRemainingPieces(1, player1RemainingEl);
  renderRemainingPieces(2, player2RemainingEl);
  updateControlStates();
  updateTurnHighlight();
  renderBoard();
  updateScore();
  renderReasoning();
}

function hasAnyLegalMove(player) {
  const remaining = pieces.filter((piece) => game.inventory[player].has(piece.id));

  for (const piece of remaining) {
    const transforms = transformsByPiece.get(piece.id) ?? [];
    for (const shape of transforms) {
      for (let y = 0; y < BOARD_SIZE; y += 1) {
        for (let x = 0; x < BOARD_SIZE; x += 1) {
          if (evaluatePlacement(player, x, y, shape).ok) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function countCornerEntries(player) {
  const corners = new Set();

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (game.board[y][x] !== 0) {
        continue;
      }

      const orth = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ];
      if (orth.some(([nx, ny]) => inBounds(nx, ny) && game.board[ny][nx] === player)) {
        continue;
      }

      const diag = [
        [x + 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x - 1, y - 1]
      ];
      if (diag.some(([nx, ny]) => inBounds(nx, ny) && game.board[ny][nx] === player)) {
        corners.add(key(x, y));
      }
    }
  }

  return corners.size;
}

function withTemporaryMove(player, move, callback) {
  const previousHasPlaced = game.hasPlaced[player];
  const placed = getPlacedCells(move.x, move.y, move.shape);
  for (const cell of placed) {
    game.board[cell.y][cell.x] = player;
  }
  game.inventory[player].delete(move.pieceId);
  game.hasPlaced[player] = true;

  const result = callback();

  game.inventory[player].add(move.pieceId);
  game.hasPlaced[player] = previousHasPlaced;
  for (const cell of placed) {
    game.board[cell.y][cell.x] = 0;
  }
  return result;
}

function scoreMove(player, move) {
  const opponent = player === 1 ? 2 : 1;
  const center = (BOARD_SIZE - 1) / 2;

  return withTemporaryMove(player, move, () => {
    const ownCorners = countCornerEntries(player);
    const oppCorners = countCornerEntries(opponent);
    const centerPull = move.shape.reduce((sum, cell) => {
      const px = move.x + cell.x;
      const py = move.y + cell.y;
      return sum - (Math.abs(px - center) + Math.abs(py - center));
    }, 0);

    let touchOpponentDiagonally = 0;
    for (const cell of getPlacedCells(move.x, move.y, move.shape)) {
      const diag = [
        [cell.x + 1, cell.y + 1],
        [cell.x + 1, cell.y - 1],
        [cell.x - 1, cell.y + 1],
        [cell.x - 1, cell.y - 1]
      ];
      if (diag.some(([nx, ny]) => inBounds(nx, ny) && game.board[ny][nx] === opponent)) {
        touchOpponentDiagonally += 1;
      }
    }

    const area = move.shape.length;
    const score = area * 9 + ownCorners * 4 - oppCorners * 3 + centerPull * 0.35 + touchOpponentDiagonally * 1.6;

    return {
      score,
      ownCorners,
      oppCorners,
      touchOpponentDiagonally,
      centerPull
    };
  });
}

function findBestMove(player) {
  const remaining = pieces.filter((piece) => game.inventory[player].has(piece.id));
  let bestMove = null;

  for (const piece of remaining) {
    for (const flipped of [false, true]) {
      for (let rotation = 0; rotation < 4; rotation += 1) {
        const shape = transformCells(piece.cells, rotation, flipped);

        for (let y = 0; y < BOARD_SIZE; y += 1) {
          for (let x = 0; x < BOARD_SIZE; x += 1) {
            const verdict = evaluatePlacement(player, x, y, shape);
            if (!verdict.ok) {
              continue;
            }

            const move = { pieceId: piece.id, shape, x, y, rotation, flipped };
            const metrics = scoreMove(player, move);
            const candidate = { ...move, metrics };

            if (!bestMove || candidate.metrics.score > bestMove.metrics.score) {
              bestMove = candidate;
            }
          }
        }
      }
    }
  }

  return bestMove;
}

function describeMove(player, move, intent) {
  if (!move) {
    return `${playerLabel(player)} has no legal move right now.`;
  }

  const area = move.shape.length;
  const x = move.x + 1;
  const y = move.y + 1;
  const corners = move.metrics.ownCorners;
  const oppCorners = move.metrics.oppCorners;
  const pressure = move.metrics.touchOpponentDiagonally;

  return `${intent} ${move.pieceId} (${area}) at x:${x}, y:${y}. This opens ${corners} corner options, limits opponent options to about ${oppCorners}, and applies ${pressure > 0 ? "good" : "light"} pressure.`;
}

function applyHumanRecommendation() {
  if (game.mode !== "ai" || game.currentPlayer !== 1 || game.isGameOver) {
    return;
  }

  const best = findBestMove(1);
  if (!best) {
    setReasoning(1, "No legal move available. You can pass this turn.");
    return;
  }

  game.selectedPieceByPlayer[1] = best.pieceId;
  game.rotationByPlayer[1] = best.rotation;
  game.flippedByPlayer[1] = best.flipped;
  game.preview = { cells: getPlacedCells(best.x, best.y, best.shape), ok: true };

  setReasoning(
    1,
    `${describeMove(1, best, "Coach pick:")}`
  );
}

function refreshHumanChoiceReasoning() {
  if (game.mode !== "ai" || game.currentPlayer !== 1 || game.isGameOver) {
    return;
  }

  const best = findBestMove(1);
  const selected = game.selectedPieceByPlayer[1];
  if (!best || !selected) {
    return;
  }

  if (selected === best.pieceId) {
    setReasoning(1, `${describeMove(1, best, "Nice choice!")} This matches the current best recommendation.`);
  } else {
    setReasoning(
      1,
      `You chose ${selected}. Coach top pick is ${best.pieceId} at x:${best.x + 1}, y:${best.y + 1} to keep more corner paths open. Your move can still work, and I will re-optimize after this turn.`
    );
  }
}

function applyMove(player, pieceId, shape, anchorX, anchorY) {
  const placed = getPlacedCells(anchorX, anchorY, shape);
  for (const cell of placed) {
    game.board[cell.y][cell.x] = player;
  }

  game.inventory[player].delete(pieceId);
  game.hasPlaced[player] = true;
  game.lastMoveCells = placed;
  game.preview = null;
}

function finishGame() {
  game.isGameOver = true;
  const { p1Tiles, p2Tiles } = updateScore();

  if (p1Tiles === p2Tiles) {
    setFeedback(`Game over: tie at ${p1Tiles}-${p2Tiles}.`, "good");
  } else {
    const winner = p1Tiles > p2Tiles ? playerLabel(1) : playerLabel(2);
    setFeedback(`Game over: ${winner} wins ${Math.max(p1Tiles, p2Tiles)}-${Math.min(p1Tiles, p2Tiles)}.`, "good");
  }
  setReasoning(1, "Game finished. Great thinking and teamwork! 🏁");
  setReasoning(2, "Game finished. Thanks for playing! 🏁");

  syncUI();
}

function startTurn(player) {
  if (game.isGameOver) {
    return;
  }

  game.currentPlayer = player;

  if (!hasAnyLegalMove(player)) {
    game.consecutivePasses += 1;

    if (game.consecutivePasses >= 2) {
      finishGame();
      return;
    }

    setFeedback(`${playerLabel(player)} has no legal move and passes.`, "bad");
    setReasoning(player, "No legal move this turn, so passing is best.");
    startTurn(player === 1 ? 2 : 1);
    return;
  }

  game.consecutivePasses = 0;
  game.preview = null;
  syncUI();

  const aiTurn = game.mode === "ai" && player === 2;
  if (aiTurn) {
    setReasoning(2, "Scanning the board for the strongest move...");
    runAiTurn();
  } else if (game.mode === "ai" && player === 1) {
    applyHumanRecommendation();
    syncUI();
  } else {
    setReasoning(player, "Pick any legal move. Bigger pieces are usually best early.");
  }
}

function endTurn() {
  const next = game.currentPlayer === 1 ? 2 : 1;
  startTurn(next);
}

function tryPlaceAt(x, y) {
  if (game.isGameOver || game.aiThinking) {
    return;
  }

  if (game.mode === "ai" && game.currentPlayer === 2) {
    return;
  }

  const player = game.currentPlayer;
  const pieceId = game.selectedPieceByPlayer[player];
  const shape = getCurrentShape(player);
  if (!pieceId || shape.length === 0) {
    setFeedback("Select a piece.", "bad");
    return;
  }

  const verdict = evaluatePlacement(player, x, y, shape);
  if (!verdict.ok) {
    setFeedback(verdict.reason, "bad");
    game.preview = { cells: getPlacedCells(x, y, shape), ok: false };
    renderBoard();
    return;
  }

  applyMove(player, pieceId, shape, x, y);
  setFeedback(`${playerLabel(player)} placed ${pieceId}.`, "good");
  if (game.mode === "ai" && player === 1) {
    setReasoning(1, `Played ${pieceId} at x:${x + 1}, y:${y + 1}. Recomputing best plan for your next turn...`);
  } else {
    setReasoning(player, `Great move with ${pieceId}!`);
  }
  syncUI();
  endTurn();
}

function updatePreviewAt(x, y) {
  if (game.isGameOver || game.aiThinking) {
    return;
  }

  if (game.mode === "ai" && game.currentPlayer === 2) {
    game.preview = null;
    renderBoard();
    return;
  }

  const shape = getCurrentShape(game.currentPlayer);
  if (shape.length === 0) {
    game.preview = null;
    renderBoard();
    return;
  }

  const verdict = evaluatePlacement(game.currentPlayer, x, y, shape);
  game.preview = {
    cells: getPlacedCells(x, y, shape),
    ok: verdict.ok
  };
  renderBoard();
}

function runAiTurn() {
  if (game.isGameOver || game.aiThinking) {
    return;
  }

  game.aiThinking = true;
  setFeedback("AI is thinking... 🤔", "good");

  setTimeout(() => {
    const move = findBestMove(2);
    if (!move) {
      game.aiThinking = false;
      game.consecutivePasses += 1;
      if (game.consecutivePasses >= 2) {
        finishGame();
        return;
      }
      setFeedback("AI has no legal moves and passes.", "bad");
      setReasoning(2, "No legal move was available, so passing preserves future flexibility.");
      startTurn(1);
      return;
    }

    const anticipated = withTemporaryMove(2, move, () => findBestMove(1));
    applyMove(2, move.pieceId, move.shape, move.x, move.y);
    setFeedback(`AI placed ${move.pieceId} at x:${move.x + 1}, y:${move.y + 1}.`, "good");
    const anticipationText = anticipated
      ? `I expect you may try ${anticipated.pieceId} near x:${anticipated.x + 1}, y:${anticipated.y + 1}.`
      : "I don't see a strong immediate reply for you.";
    setReasoning(
      2,
      `${describeMove(2, move, "I chose")} ${anticipationText}`
    );
    game.aiThinking = false;
    syncUI();
    endTurn();
  }, 400);
}

function findHint(player) {
  if (!canUsePlayerControls(player)) {
    return;
  }

  const pieceId = game.selectedPieceByPlayer[player];
  const shape = getCurrentShape(player);

  if (!pieceId || shape.length === 0) {
    setFeedback("Select a piece to hint.", "bad");
    return;
  }

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const verdict = evaluatePlacement(player, x, y, shape);
      if (verdict.ok) {
        game.preview = { cells: getPlacedCells(x, y, shape), ok: true };
        setFeedback(`Hint: try x:${x + 1}, y:${y + 1}.`, "good");
        if (game.mode === "ai" && player === 1) {
          setReasoning(1, `Hint targets x:${x + 1}, y:${y + 1} using ${pieceId} to keep your corner chain alive.`);
        }
        renderBoard();
        return;
      }
    }
  }

  setFeedback("No legal move for this piece in this orientation.", "bad");
}

function manualPass(player) {
  if (!canUsePlayerControls(player)) {
    return;
  }

  if (hasAnyLegalMove(player)) {
    setFeedback("You still have a legal move, so pass is not allowed.", "bad");
    return;
  }

  game.consecutivePasses += 1;
  if (game.consecutivePasses >= 2) {
    finishGame();
    return;
  }

  setFeedback(`${playerLabel(player)} passes.`, "bad");
  setReasoning(player, "Passing now. I will look for the next strong chance.");
  startTurn(player === 1 ? 2 : 1);
}

function resetGame() {
  game.mode = modeSelectEl.value;
  game.board = makeEmptyBoard();
  game.currentPlayer = 1;
  game.hasPlaced = { 1: false, 2: false };
  game.inventory = {
    1: new Set(pieces.map((piece) => piece.id)),
    2: new Set(pieces.map((piece) => piece.id))
  };
  game.selectedPieceByPlayer = { 1: "I1", 2: "I1" };
  game.rotationByPlayer = { 1: 0, 2: 0 };
  game.flippedByPlayer = { 1: false, 2: false };
  game.preview = null;
  game.lastMoveCells = [];
  game.isGameOver = false;
  game.consecutivePasses = 0;
  game.aiThinking = false;
  game.reasoning = {
    1: game.mode === "ai" ? "Coach is finding your best opening..." : "Your turn strategy notes will appear here.",
    2: game.mode === "ai" ? "AI reasoning will appear here during its turn." : "Player 2 strategy notes will appear here."
  };

  setFeedback(`New game started. ${playerLabel(1)} begins from top-left corner. 🎉`, "good");
  syncUI();
}

function bindEvents() {
  for (const player of [1, 2]) {
    const control = controlsByPlayer[player];

    control.pieceSelect.addEventListener("change", (event) => {
      if (!canUsePlayerControls(player)) {
        return;
      }

      game.selectedPieceByPlayer[player] = event.target.value;
      game.rotationByPlayer[player] = 0;
      game.flippedByPlayer[player] = false;
      game.preview = null;
      renderPiecePreview(player);
      renderBoard();
      if (player === 1) {
        refreshHumanChoiceReasoning();
      }
    });

    control.rotateBtn.addEventListener("click", () => {
      if (!canUsePlayerControls(player)) {
        return;
      }

      game.rotationByPlayer[player] = (game.rotationByPlayer[player] + 1) % 4;
      game.preview = null;
      renderPiecePreview(player);
      renderBoard();
      if (player === 1) {
        refreshHumanChoiceReasoning();
      }
    });

    control.flipBtn.addEventListener("click", () => {
      if (!canUsePlayerControls(player)) {
        return;
      }

      game.flippedByPlayer[player] = !game.flippedByPlayer[player];
      game.preview = null;
      renderPiecePreview(player);
      renderBoard();
      if (player === 1) {
        refreshHumanChoiceReasoning();
      }
    });

    control.hintBtn.addEventListener("click", () => findHint(player));
    control.passBtn.addEventListener("click", () => manualPass(player));
  }

  document.getElementById("new-game-btn").addEventListener("click", () => {
    resetGame();
    startTurn(1);
  });

  player1NameEl.addEventListener("input", () => {
    game.playerNames[1] = (player1NameEl.value || "").trim() || "Player 1";
    updatePlayerTitles();
    updateTurnLabel();
  });

  player2NameEl.addEventListener("input", () => {
    game.playerNames[2] = (player2NameEl.value || "").trim() || "Player 2";
    if (game.mode !== "ai") {
      updatePlayerTitles();
      updateTurnLabel();
    }
  });

  boardEl.addEventListener("mousemove", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) {
      return;
    }
    updatePreviewAt(Number(cell.dataset.x), Number(cell.dataset.y));
  });

  boardEl.addEventListener("mouseleave", () => {
    game.preview = null;
    renderBoard();
  });

  boardEl.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) {
      return;
    }
    tryPlaceAt(Number(cell.dataset.x), Number(cell.dataset.y));
  });
}

function init() {
  precomputeTransforms();
  renderCoordinates();
  bindEvents();
  game.playerNames[1] = (player1NameEl.value || "").trim() || "Player 1";
  game.playerNames[2] = (player2NameEl.value || "").trim() || "Player 2";
  game.playerNames.ai = "AI";
  resetGame();
  startTurn(1);
}

init();
