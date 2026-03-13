const BOARD_SIZE = 14;
const REVIEW_STATE_KEY = "bpc_review_state_v1";
const METRICS_STATE_KEY = "bpc_metrics_state_v1";
const APP_STORE_REVIEW_URL = "itms-apps://itunes.apple.com/app/id6759510502?action=write-review";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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
const workspaceEl = document.getElementById("workspace");
const xTopEl = document.getElementById("x-top");
const xBottomEl = document.getElementById("x-bottom");
const yLeftEl = document.getElementById("y-left");
const yRightEl = document.getElementById("y-right");
const player1InlineRemainingEl = document.getElementById("player1-inline-remaining");
const player2InlineRemainingEl = document.getElementById("player2-inline-remaining");
const player1InlineCountEl = document.getElementById("player1-inline-count");
const player2InlineCountEl = document.getElementById("player2-inline-count");
const topPiecesTitleEl = document.getElementById("top-pieces-title");
const bottomPiecesTitleEl = document.getElementById("bottom-pieces-title");
const viewBoardBtnEl = document.getElementById("view-board-btn");
const viewP1BtnEl = document.getElementById("view-p1-btn");
const viewP2BtnEl = document.getElementById("view-p2-btn");
const stageRotateBtnEl = document.getElementById("stage-rotate-btn");
const stageFlipBtnEl = document.getElementById("stage-flip-btn");
const stageHintBtnEl = document.getElementById("stage-hint-btn");
const stagePassBtnEl = document.getElementById("stage-pass-btn");
const stagePlayBtnEl = document.getElementById("stage-play-btn");
const reasoningHumanTitleEl = document.getElementById("reasoning-human-title");
const reasoningAiTitleEl = document.getElementById("reasoning-ai-title");
const reasoningHumanMobileEl = document.getElementById("reasoning-human-mobile");
const reasoningAiMobileEl = document.getElementById("reasoning-ai-mobile");
const reasoningGridMobileEl = document.querySelector(".reasoning-grid-mobile");
const piecesReferenceEl = document.getElementById("pieces-reference");
const metricDeadClickRateEl = document.getElementById("metric-dead-click-rate");
const metricInvalidPerGameEl = document.getElementById("metric-invalid-per-game");
const metricCrashFreeEl = document.getElementById("metric-crash-free");
const metricInstallFirstEl = document.getElementById("metric-install-first");
const feedbackEl = document.getElementById("feedback");
const turnIndicatorEl = document.getElementById("turn-indicator");
const modeSelectEl = document.getElementById("mode-select");
const difficultySelectEl = document.getElementById("difficulty-select");
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
  difficulty: "medium",
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
  aiTurnTimer: null,
  modeChangeToken: 0,
  reasoning: { 1: "", 2: "" },
  playerNames: { 1: "Player 1", 2: "Player 2", ai: "AI" },
  theme: "default",
  mobileView: "board",
  pendingAnchorByPlayer: { 1: null, 2: null },
  hadErrorThisGame: false
};

const transformsByPiece = new Map();

function key(x, y) {
  return `${x},${y}`;
}

function loadMetricsState() {
  try {
    const raw = localStorage.getItem(METRICS_STATE_KEY);
    if (!raw) {
      return {
        installAt: Date.now(),
        sessionCounter: 0,
        currentSessionId: 0,
        totalDeadClicks: 0,
        totalInvalidAttempts: 0,
        totalCompletedGames: 0,
        invalidAttemptsCurrentGame: 0,
        firstGameCompletedAt: 0,
        events: []
      };
    }
    const parsed = JSON.parse(raw);
    return {
      installAt: Number(parsed.installAt || Date.now()),
      sessionCounter: Number(parsed.sessionCounter || 0),
      currentSessionId: Number(parsed.currentSessionId || 0),
      totalDeadClicks: Number(parsed.totalDeadClicks || 0),
      totalInvalidAttempts: Number(parsed.totalInvalidAttempts || 0),
      totalCompletedGames: Number(parsed.totalCompletedGames || 0),
      invalidAttemptsCurrentGame: Number(parsed.invalidAttemptsCurrentGame || 0),
      firstGameCompletedAt: Number(parsed.firstGameCompletedAt || 0),
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return {
      installAt: Date.now(),
      sessionCounter: 0,
      currentSessionId: 0,
      totalDeadClicks: 0,
      totalInvalidAttempts: 0,
      totalCompletedGames: 0,
      invalidAttemptsCurrentGame: 0,
      firstGameCompletedAt: 0,
      events: []
    };
  }
}

function saveMetricsState(state) {
  try {
    localStorage.setItem(METRICS_STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures.
  }
}

function logEvent(type, data = {}) {
  const metrics = loadMetricsState();
  metrics.events.push({
    ts: Date.now(),
    sessionId: metrics.currentSessionId,
    type,
    ...data
  });
  if (metrics.events.length > 500) {
    metrics.events = metrics.events.slice(-500);
  }
  saveMetricsState(metrics);
}

function incrementDeadClicks(reason) {
  const metrics = loadMetricsState();
  metrics.totalDeadClicks += 1;
  saveMetricsState(metrics);
  logEvent("dead_click", { reason });
}

function incrementInvalidAttempts(reason) {
  const metrics = loadMetricsState();
  metrics.totalInvalidAttempts += 1;
  metrics.invalidAttemptsCurrentGame += 1;
  saveMetricsState(metrics);
  logEvent("invalid_attempt", { reason });
}

function completeGameMetrics(winnerPlayer) {
  const metrics = loadMetricsState();
  metrics.totalCompletedGames += 1;
  if (!metrics.firstGameCompletedAt) {
    metrics.firstGameCompletedAt = Date.now();
  }
  const invalidThisGame = metrics.invalidAttemptsCurrentGame;
  metrics.invalidAttemptsCurrentGame = 0;
  saveMetricsState(metrics);
  logEvent("game_complete", { winnerPlayer, invalidAttempts: invalidThisGame });
}

function resetCurrentGameMetrics() {
  const metrics = loadMetricsState();
  metrics.invalidAttemptsCurrentGame = 0;
  saveMetricsState(metrics);
}

function renderMetricsDashboard() {
  if (!metricDeadClickRateEl || !metricInvalidPerGameEl || !metricCrashFreeEl || !metricInstallFirstEl) {
    return;
  }

  const review = loadReviewState();
  const metrics = loadMetricsState();

  const sessions = Math.max(0, review.sessions);
  const deadClickRate = sessions > 0 ? metrics.totalDeadClicks / sessions : 0;
  const invalidPerGame = metrics.totalCompletedGames > 0
    ? metrics.totalInvalidAttempts / metrics.totalCompletedGames
    : 0;
  const crashTotal = review.sessionOutcomes.length;
  const crashFree = crashTotal > 0
    ? (review.sessionOutcomes.filter((entry) => entry === "clean").length / crashTotal) * 100
    : 100;
  const installToFirstCompletion = metrics.firstGameCompletedAt ? 100 : 0;

  metricDeadClickRateEl.textContent = deadClickRate.toFixed(2);
  metricInvalidPerGameEl.textContent = invalidPerGame.toFixed(2);
  metricCrashFreeEl.textContent = `${crashFree.toFixed(0)}%`;
  metricInstallFirstEl.textContent = `${installToFirstCompletion}%`;
}

function loadReviewState() {
  try {
    const raw = localStorage.getItem(REVIEW_STATE_KEY);
    if (!raw) {
      return {
        sessions: 0,
        completedGames: 0,
        lastPromptAt: 0,
        sessionActive: false,
        sessionOutcomes: []
      };
    }
    const parsed = JSON.parse(raw);
    return {
      sessions: Number(parsed.sessions || 0),
      completedGames: Number(parsed.completedGames || 0),
      lastPromptAt: Number(parsed.lastPromptAt || 0),
      sessionActive: Boolean(parsed.sessionActive),
      sessionOutcomes: Array.isArray(parsed.sessionOutcomes) ? parsed.sessionOutcomes : []
    };
  } catch {
    return {
      sessions: 0,
      completedGames: 0,
      lastPromptAt: 0,
      sessionActive: false,
      sessionOutcomes: []
    };
  }
}

function saveReviewState(state) {
  try {
    localStorage.setItem(REVIEW_STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors to keep gameplay unaffected.
  }
}

function markSessionClosed(clean) {
  const state = loadReviewState();
  if (!state.sessionActive) {
    return;
  }
  state.sessionActive = false;
  state.sessionOutcomes.push(clean ? "clean" : "crash");
  if (state.sessionOutcomes.length > 12) {
    state.sessionOutcomes = state.sessionOutcomes.slice(-12);
  }
  saveReviewState(state);
  logEvent("session_end", { clean });
}

function startSessionTracking() {
  const state = loadReviewState();
  if (state.sessionActive) {
    state.sessionOutcomes.push("crash");
  }
  if (state.sessionOutcomes.length > 12) {
    state.sessionOutcomes = state.sessionOutcomes.slice(-12);
  }
  state.sessions += 1;
  state.sessionActive = true;
  saveReviewState(state);

  const metrics = loadMetricsState();
  metrics.sessionCounter += 1;
  metrics.currentSessionId = metrics.sessionCounter;
  if (!metrics.installAt) {
    metrics.installAt = Date.now();
  }
  saveMetricsState(metrics);
  logEvent("session_start", { session: metrics.currentSessionId });
  renderMetricsDashboard();

  window.addEventListener("beforeunload", () => markSessionClosed(true));
  window.addEventListener("pagehide", () => markSessionClosed(true));
}

function incrementCompletedGames() {
  const state = loadReviewState();
  state.completedGames += 1;
  saveReviewState(state);
  renderMetricsDashboard();
}

function hasNoCrashesInLastThreeSessions(state) {
  const lastThree = state.sessionOutcomes.slice(-3);
  return lastThree.length === 3 && lastThree.every((entry) => entry === "clean");
}

async function tryNativeReviewPrompt() {
  const plugins = window.Capacitor?.Plugins ?? {};
  const candidates = ["AppReview", "InAppReview", "StoreReview", "RateApp"];

  for (const name of candidates) {
    const plugin = plugins[name];
    if (plugin && typeof plugin.requestReview === "function") {
      await plugin.requestReview();
      return true;
    }
  }
  return false;
}

async function maybeAskForRating(winnerPlayer) {
  if (game.hadErrorThisGame || !winnerPlayer) {
    return;
  }
  if (game.mode === "ai" && winnerPlayer !== 2) {
    return;
  }

  const state = loadReviewState();
  if (state.sessions < 3 || state.completedGames < 2) {
    return;
  }
  if (!hasNoCrashesInLastThreeSessions(state)) {
    return;
  }
  if (state.lastPromptAt && Date.now() - state.lastPromptAt < THIRTY_DAYS_MS) {
    return;
  }

  const shouldPrompt = window.confirm("Enjoying Block Puzzle Coach? Please rate us on the App Store.");
  state.lastPromptAt = Date.now();
  saveReviewState(state);
  if (!shouldPrompt) {
    return;
  }

  const nativePromptShown = await tryNativeReviewPrompt();
  if (!nativePromptShown) {
    window.location.href = APP_STORE_REVIEW_URL;
  }
}

function playerLabel(player) {
  if (game.mode === "ai") {
    return player === 1 ? "AI" : "Human";
  }
  return game.playerNames[player] || playerConfig[player].name;
}

function isPlayerHuman(player) {
  return game.mode !== "ai" || player === 2;
}

function updateTurnHighlight() {
  player1PanelEl.classList.toggle("active", !game.isGameOver && game.currentPlayer === 1);
  player2PanelEl.classList.toggle("active", !game.isGameOver && game.currentPlayer === 2);
}

function updatePlayerTitles() {
  if (game.mode === "ai") {
    game.playerNames.ai = "AI";
    game.playerNames[1] = "AI";
    game.playerNames[2] = "Human";
    player1NameEl.value = "AI";
    player1NameEl.disabled = true;
    player2NameEl.value = "Human";
    player2NameEl.disabled = true;
  } else {
    player1NameEl.value = game.playerNames[1] || "Player 1";
    player1NameEl.disabled = false;
    player2NameEl.value = game.playerNames[2] || "Player 2";
    player2NameEl.disabled = false;
  }
}

function setReasoning(player, text) {
  game.reasoning[player] = text;
  controlsByPlayer[player].reasoningEl.textContent = text;
}

function renderCoordinates() {
  if (xTopEl) {
    xTopEl.innerHTML = "";
  }
  if (xBottomEl) {
    xBottomEl.innerHTML = "";
  }
  if (yLeftEl) {
    yLeftEl.innerHTML = "";
  }
  if (yRightEl) {
    yRightEl.innerHTML = "";
  }

  for (let i = 1; i <= BOARD_SIZE; i += 1) {
    const xTop = document.createElement("span");
    xTop.textContent = String(i);
    if (xTopEl) {
      xTopEl.appendChild(xTop);
    }

    const xBottom = document.createElement("span");
    xBottom.textContent = String(i);
    if (xBottomEl) {
      xBottomEl.appendChild(xBottom);
    }

    const yLeft = document.createElement("span");
    yLeft.textContent = String(i);
    if (yLeftEl) {
      yLeftEl.appendChild(yLeft);
    }

    const yRight = document.createElement("span");
    yRight.textContent = String(i);
    if (yRightEl) {
      yRightEl.appendChild(yRight);
    }
  }
}

function canUsePlayerControls(player) {
  return !game.isGameOver && !game.aiThinking && game.currentPlayer === player && isPlayerHuman(player);
}

function isCompactLayout() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function setMobileView(view) {
  game.mobileView = view;
  workspaceEl.classList.remove("mobile-view-p1", "mobile-view-p2");
  if (view === "p1") {
    workspaceEl.classList.add("mobile-view-p1");
  }
  if (view === "p2") {
    workspaceEl.classList.add("mobile-view-p2");
  }

  if (viewBoardBtnEl && viewP1BtnEl && viewP2BtnEl) {
    viewBoardBtnEl.classList.toggle("active", view === "board");
    viewP1BtnEl.classList.toggle("active", view === "p1");
    viewP2BtnEl.classList.toggle("active", view === "p2");
  }
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
        cellEl.classList.add(game.currentPlayer === 1 ? "preview-p1" : "preview-p2");
        if (game.preview?.kind === "suggested") {
          cellEl.classList.add("preview-suggested");
        }
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
  if (type === "bad") {
    const invalidMovePatterns = [
      /out of bounds/i,
      /cannot overlap/i,
      /must cover/i,
      /must touch/i,
      /cannot touch edge-to-edge/i,
      /select a piece/i,
      /pass is not allowed/i,
      /no legal move for this piece/i
    ];
    if (invalidMovePatterns.some((pattern) => pattern.test(text))) {
      game.hadErrorThisGame = true;
      incrementInvalidAttempts(text);
    }
  }
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

function renderInlineRemainingPieces(player, targetEl) {
  if (!targetEl) {
    return;
  }
  targetEl.innerHTML = "";

  const ordered = [...pieces].sort((a, b) => b.cells.length - a.cells.length || a.id.localeCompare(b.id));

  for (const piece of ordered) {
    const available = game.inventory[player].has(piece.id);
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `piece-pill ${playerConfig[player].className}`;
    pill.dataset.player = String(player);
    pill.dataset.pieceId = piece.id;
    pill.title = `${piece.id} (${piece.cells.length})`;
    pill.setAttribute("aria-label", `${piece.id} (${piece.cells.length})`);

    const shapeEl = document.createElement("span");
    shapeEl.className = "piece-shape";
    const normalized = normalizeCells(piece.cells.map(([x, y]) => ({ x, y })));
    const shapeSet = new Set(normalized.map((cell) => key(cell.x, cell.y)));
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        const dot = document.createElement("span");
        dot.className = "piece-dot";
        if (shapeSet.has(key(x, y))) {
          dot.classList.add("on");
        }
        shapeEl.appendChild(dot);
      }
    }
    pill.appendChild(shapeEl);

    if (available && game.selectedPieceByPlayer[player] === piece.id) {
      pill.classList.add("selected");
    }
    if (!available) {
      pill.classList.add("used");
    }
    pill.disabled = !available || !canUsePlayerControls(player);
    pill.draggable = false;
    targetEl.appendChild(pill);
  }
}

function renderPiecesReference() {
  if (!piecesReferenceEl) {
    return;
  }
  piecesReferenceEl.innerHTML = "";

  const ordered = [...pieces].sort((a, b) => b.cells.length - a.cells.length || a.id.localeCompare(b.id));
  for (const piece of ordered) {
    const card = document.createElement("article");
    card.className = "piece-ref-card";

    const shapeEl = document.createElement("span");
    shapeEl.className = "piece-shape";
    const normalized = normalizeCells(piece.cells.map(([x, y]) => ({ x, y })));
    const shapeSet = new Set(normalized.map((cell) => key(cell.x, cell.y)));
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        const dot = document.createElement("span");
        dot.className = "piece-dot";
        if (shapeSet.has(key(x, y))) {
          dot.classList.add("on");
        }
        shapeEl.appendChild(dot);
      }
    }

    const label = document.createElement("span");
    label.className = "piece-ref-label";
    label.textContent = `${piece.id} (${piece.cells.length})`;

    card.appendChild(shapeEl);
    card.appendChild(label);
    piecesReferenceEl.appendChild(card);
  }
}

function updateTurnLabel() {
  if (!turnIndicatorEl) {
    return;
  }
  if (game.isGameOver) {
    turnIndicatorEl.textContent = "Game Over 🏁";
    return;
  }
  turnIndicatorEl.textContent = `Turn: ${playerLabel(game.currentPlayer)} 🎯`;
}

function getInlineDisplayPlayers() {
  return game.mode === "ai" ? { top: 1, bottom: 2 } : { top: 1, bottom: 2 };
}

function inlinePiecesLabel(player) {
  if (game.mode === "ai") {
    return player === 1 ? "🤖 AI Pieces" : "💙 Human Pieces";
  }
  return player === 1 ? "🧡 Player 1 Pieces" : "💙 Player 2 Pieces";
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

  if (stageFlipBtnEl && stageRotateBtnEl && stageHintBtnEl && stagePassBtnEl && stagePlayBtnEl) {
    const player = game.currentPlayer;
    const enabled = canUsePlayerControls(player) && game.inventory[player].size > 0;
    const pending = game.pendingAnchorByPlayer[player];
    const canPlay = enabled && pending && pending.ok;

    stageFlipBtnEl.disabled = !enabled;
    stageRotateBtnEl.disabled = !enabled;
    stageHintBtnEl.disabled = !enabled;
    stagePassBtnEl.disabled = !canUsePlayerControls(player);
    stagePlayBtnEl.disabled = !canPlay;
  }
}

function clearPendingPlacement(player) {
  game.pendingAnchorByPlayer[player] = null;
  if (game.currentPlayer === player) {
    game.preview = null;
  }
}

function setPendingPlacement(player, x, y, shape, kind = "manual") {
  const verdict = evaluatePlacement(player, x, y, shape);
  const cells = getPlacedCells(x, y, shape);
  game.pendingAnchorByPlayer[player] = { x, y, ok: verdict.ok, reason: verdict.reason, cells, kind };
  if (game.currentPlayer === player) {
    game.preview = { cells, ok: verdict.ok, kind };
  }
}

function refreshPendingPlacement(player) {
  const pending = game.pendingAnchorByPlayer[player];
  const shape = getCurrentShape(player);
  if (!pending || shape.length === 0) {
    clearPendingPlacement(player);
    return;
  }
  setPendingPlacement(player, pending.x, pending.y, shape, pending.kind || "manual");
}

function findAutoPreviewAnchor(player, shape) {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const verdict = evaluatePlacement(player, x, y, shape);
      if (verdict.ok) {
        return { x, y, legal: true };
      }
    }
  }

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (game.board[y][x] === 0) {
        return { x, y, legal: false, reason: "No legal spot for this piece yet. Preview moved to an open slot." };
      }
    }
  }

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (game.board[y][x] !== 0) {
        return { x, y, legal: false, reason: "No open slots remain. Preview moved to an occupied slot." };
      }
    }
  }

  return { x: 0, y: 0, legal: false, reason: "Board is unavailable for placement preview." };
}

function autoPreviewSelectedPiece(player) {
  const pieceId = game.selectedPieceByPlayer[player];
  const shape = getCurrentShape(player);
  if (!pieceId || shape.length === 0) {
    clearPendingPlacement(player);
    return;
  }

  const target = findAutoPreviewAnchor(player, shape);
  setPendingPlacement(player, target.x, target.y, shape);
  if (target.legal) {
    setFeedback(`Preview at x:${target.x + 1}, y:${target.y + 1}. Tap again here or press Play Piece.`, "good");
  } else {
    setFeedback(target.reason, "bad");
  }
}

function renderReasoning() {
  const p1Text = game.reasoning[1] || "Waiting for a move.";
  const p2Text = game.reasoning[2] || "Pick a piece and have fun!";

  controlsByPlayer[1].reasoningEl.textContent = p1Text;
  controlsByPlayer[2].reasoningEl.textContent = p2Text;

  if (reasoningHumanTitleEl) {
    reasoningHumanTitleEl.textContent = game.mode === "ai" ? "Human Suggestion 🧡" : "Player 1 Suggestion 🧡";
  }
  if (reasoningAiTitleEl) {
    reasoningAiTitleEl.textContent = game.mode === "ai" ? "AI Thinking 🤖" : "Player 2 Suggestion 💙";
  }

  if (reasoningHumanMobileEl) {
    reasoningHumanMobileEl.textContent = game.mode === "ai" ? p2Text : p1Text;
  }
  if (reasoningAiMobileEl) {
    reasoningAiMobileEl.textContent = game.mode === "ai" ? p1Text : p2Text;
  }
}

function syncUI() {
  if (!isCompactLayout() && game.mobileView !== "board") {
    setMobileView("board");
  }
  updatePlayerTitles();
  updateTurnLabel();
  renderPieceSelect(1);
  renderPieceSelect(2);
  renderPiecePreview(1);
  renderPiecePreview(2);
  renderRemainingPieces(1, player1RemainingEl);
  renderRemainingPieces(2, player2RemainingEl);
  const order = getInlineDisplayPlayers();
  renderInlineRemainingPieces(order.top, player1InlineRemainingEl);
  renderInlineRemainingPieces(order.bottom, player2InlineRemainingEl);
  if (topPiecesTitleEl) {
    topPiecesTitleEl.textContent = inlinePiecesLabel(order.top);
  }
  if (bottomPiecesTitleEl) {
    bottomPiecesTitleEl.textContent = inlinePiecesLabel(order.bottom);
  }
  if (player1InlineCountEl) {
    player1InlineCountEl.textContent = `${game.inventory[order.top].size}/21 left`;
  }
  if (player2InlineCountEl) {
    player2InlineCountEl.textContent = `${game.inventory[order.bottom].size}/21 left`;
  }
  if (difficultySelectEl) {
    difficultySelectEl.value = game.difficulty;
    difficultySelectEl.disabled = game.mode !== "ai";
  }
  updateControlStates();
  updateTurnHighlight();
  renderBoard();
  updateScore();
  renderReasoning();
  if (reasoningGridMobileEl) {
    reasoningGridMobileEl.classList.toggle("ai-mode", game.mode === "ai");
  }
  renderMetricsDashboard();
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

function collectLegalMoves(player) {
  const remaining = pieces.filter((piece) => game.inventory[player].has(piece.id));
  const moves = [];

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
            moves.push({ ...move, metrics });
          }
        }
      }
    }
  }

  moves.sort((a, b) => b.metrics.score - a.metrics.score);
  return moves;
}

function algorithmLabelForDifficulty(level) {
  if (level === "easy") {
    return "stochastic legal-move sampler";
  }
  if (level === "hard") {
    return "two-ply minimax with heuristic evaluation";
  }
  return "one-ply heuristic search with corner-mobility scoring";
}

function findBestMove(player) {
  const moves = collectLegalMoves(player);
  return moves[0] ?? null;
}

function chooseMoveForDifficulty(player, difficulty) {
  const moves = collectLegalMoves(player);
  if (moves.length === 0) {
    return null;
  }

  if (difficulty === "easy") {
    const poolSize = Math.min(8, moves.length);
    return moves[Math.floor(Math.random() * poolSize)];
  }

  if (difficulty === "hard") {
    const opponent = player === 1 ? 2 : 1;
    const pool = moves.slice(0, Math.min(12, moves.length));
    let best = null;

    for (const move of pool) {
      const hardScore = withTemporaryMove(player, move, () => {
        const oppBest = findBestMove(opponent);
        const oppPressure = oppBest ? oppBest.metrics.score : 0;
        const ownCorners = countCornerEntries(player);
        return move.metrics.score - oppPressure * 0.65 + ownCorners * 0.75;
      });
      if (!best || hardScore > best.hardScore) {
        best = { ...move, hardScore };
      }
    }
    return best ?? moves[0];
  }

  return moves[0];
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
  if (game.mode !== "ai" || game.currentPlayer !== 2 || game.isGameOver) {
    return;
  }

  const best = chooseMoveForDifficulty(2, game.difficulty);
  if (!best) {
    setReasoning(2, "No legal move available. You can pass this turn.");
    return;
  }

  game.selectedPieceByPlayer[2] = best.pieceId;
  game.rotationByPlayer[2] = best.rotation;
  game.flippedByPlayer[2] = best.flipped;
  setPendingPlacement(2, best.x, best.y, best.shape, "suggested");

  setReasoning(
    2,
    `${describeMove(2, best, "Coach pick:")} Algorithm: ${algorithmLabelForDifficulty(game.difficulty)} (${game.difficulty}).`
  );
}

function refreshHumanChoiceReasoning() {
  if (game.mode !== "ai" || game.currentPlayer !== 2 || game.isGameOver) {
    return;
  }

  const best = chooseMoveForDifficulty(2, game.difficulty);
  const selected = game.selectedPieceByPlayer[2];
  if (!best || !selected) {
    return;
  }

  if (selected === best.pieceId) {
    setReasoning(2, `${describeMove(2, best, "Nice choice!")} This matches the current best recommendation. Algorithm: ${algorithmLabelForDifficulty(game.difficulty)} (${game.difficulty}).`);
  } else {
    setReasoning(
      2,
      `You chose ${selected}. Coach top pick is ${best.pieceId} at x:${best.x + 1}, y:${best.y + 1} to keep more corner paths open. Your move can still work, and I will re-optimize after this turn. Algorithm: ${algorithmLabelForDifficulty(game.difficulty)} (${game.difficulty}).`
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
  if (game.aiTurnTimer) {
    clearTimeout(game.aiTurnTimer);
    game.aiTurnTimer = null;
  }
  game.isGameOver = true;
  const { p1Tiles, p2Tiles } = updateScore();

  let winnerPlayer = null;
  if (p1Tiles === p2Tiles) {
    setFeedback(`Game over: tie at ${p1Tiles}-${p2Tiles}.`, "good");
  } else {
    winnerPlayer = p1Tiles > p2Tiles ? 1 : 2;
    const winner = playerLabel(winnerPlayer);
    setFeedback(`Game over: ${winner} wins ${Math.max(p1Tiles, p2Tiles)}-${Math.min(p1Tiles, p2Tiles)}.`, "good");
  }
  setReasoning(1, "Game finished. Great thinking and teamwork! 🏁");
  setReasoning(2, "Game finished. Thanks for playing! 🏁");
  incrementCompletedGames();
  completeGameMetrics(winnerPlayer);
  void maybeAskForRating(winnerPlayer);

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
  clearPendingPlacement(player);
  syncUI();

  const aiTurn = game.mode === "ai" && player === 1;
  if (aiTurn) {
    setReasoning(1, "Scanning the board for the strongest move...");
    runAiTurn();
  } else if (game.mode === "ai" && player === 2) {
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
    incrementDeadClicks("game_busy_or_over");
    return;
  }

  if (game.mode === "ai" && game.currentPlayer === 1) {
    incrementDeadClicks("ai_turn");
    return;
  }

  const player = game.currentPlayer;
  const pieceId = game.selectedPieceByPlayer[player];
  const shape = getCurrentShape(player);
  if (!pieceId || shape.length === 0) {
    incrementDeadClicks("no_piece_selected");
    setFeedback("Select a piece.", "bad");
    return;
  }

  const resolved = isCompactLayout()
    ? resolveAnchorForTap(player, x, y, shape)
    : { x, y, verdict: evaluatePlacement(player, x, y, shape) };
  const { x: anchorX, y: anchorY, verdict } = resolved;
  const pending = game.pendingAnchorByPlayer[player];

  if (pending && pending.ok && pending.x === anchorX && pending.y === anchorY && verdict.ok) {
    playPendingMove(player);
    return;
  }

  setPendingPlacement(player, anchorX, anchorY, shape);
  if (!verdict.ok) {
    incrementDeadClicks("invalid_preview");
    setFeedback(verdict.reason, "bad");
  } else {
    setFeedback(`Preview at x:${anchorX + 1}, y:${anchorY + 1}. Tap again here or press Play Piece.`, "good");
  }
  syncUI();
}

function playPendingMove(player) {
  if (!canUsePlayerControls(player)) {
    return;
  }
  const pending = game.pendingAnchorByPlayer[player];
  const pieceId = game.selectedPieceByPlayer[player];
  const shape = getCurrentShape(player);
  if (!pending || !pieceId || shape.length === 0) {
    setFeedback("Select a piece and place it on the board first.", "bad");
    return;
  }
  if (!pending.ok) {
    setFeedback(pending.reason, "bad");
    return;
  }

  applyMove(player, pieceId, shape, pending.x, pending.y);
  clearPendingPlacement(player);
  setFeedback(`${playerLabel(player)} placed ${pieceId}.`, "good");
  if (game.mode === "ai" && player === 2) {
    setReasoning(2, `Played ${pieceId} at x:${pending.x + 1}, y:${pending.y + 1}. Recomputing best plan for your next turn...`);
  } else {
    setReasoning(player, `Great move with ${pieceId}!`);
  }
  syncUI();
  endTurn();
}

function blurActiveInput() {
  const active = document.activeElement;
  if (!active) {
    return;
  }

  const isEditable =
    active.tagName === "INPUT" ||
    active.tagName === "TEXTAREA" ||
    active.tagName === "SELECT" ||
    active.isContentEditable;

  if (isEditable && typeof active.blur === "function") {
    active.blur();
  }
}

function placeFromBoardEvent(x, y) {
  blurActiveInput();
  tryPlaceAt(x, y);
}

function resolveAnchorForTap(player, tapX, tapY, shape) {
  let best = null;
  const checked = new Set();

  for (const cell of shape) {
    const anchorX = tapX - cell.x;
    const anchorY = tapY - cell.y;
    const k = key(anchorX, anchorY);
    if (checked.has(k)) {
      continue;
    }
    checked.add(k);

    const verdict = evaluatePlacement(player, anchorX, anchorY, shape);
    if (!verdict.ok) {
      continue;
    }

    // Prefer anchors where the tapped square maps to a piece cell near the top-left of the piece.
    const rank = Math.abs(cell.x) + Math.abs(cell.y);
    if (!best || rank < best.rank) {
      best = { x: anchorX, y: anchorY, verdict, rank };
    }
  }

  if (best) {
    return { x: best.x, y: best.y, verdict: best.verdict };
  }

  return { x: tapX, y: tapY, verdict: evaluatePlacement(player, tapX, tapY, shape) };
}

function runAiTurn() {
  if (game.isGameOver || game.aiThinking) {
    return;
  }

  game.aiThinking = true;
  setFeedback(`AI is thinking... (${game.difficulty}) 🤔`, "good");

  if (game.aiTurnTimer) {
    clearTimeout(game.aiTurnTimer);
    game.aiTurnTimer = null;
  }
  game.aiTurnTimer = setTimeout(() => {
    game.aiTurnTimer = null;
    const move = chooseMoveForDifficulty(1, game.difficulty);
    if (!move) {
      game.aiThinking = false;
      game.consecutivePasses += 1;
      if (game.consecutivePasses >= 2) {
        finishGame();
        return;
      }
      setFeedback("AI has no legal moves and passes.", "bad");
      setReasoning(1, "No legal move was available, so passing preserves future flexibility.");
      startTurn(2);
      return;
    }

    const anticipated = withTemporaryMove(1, move, () => chooseMoveForDifficulty(2, game.difficulty));
    applyMove(1, move.pieceId, move.shape, move.x, move.y);
    setFeedback(`AI placed ${move.pieceId} at x:${move.x + 1}, y:${move.y + 1}.`, "good");
    const anticipationText = anticipated
      ? `I expect you may try ${anticipated.pieceId} near x:${anticipated.x + 1}, y:${anticipated.y + 1}.`
      : "I don't see a strong immediate reply for you.";
    setReasoning(
      1,
      `${describeMove(1, move, "I chose")} ${anticipationText} Algorithm: ${algorithmLabelForDifficulty(game.difficulty)} (${game.difficulty}).`
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
        setPendingPlacement(player, x, y, shape);
        setFeedback(`Hint: try x:${x + 1}, y:${y + 1}.`, "good");
        if (game.mode === "ai" && player === 2) {
          setReasoning(2, `Hint targets x:${x + 1}, y:${y + 1} using ${pieceId} to keep your corner chain alive.`);
        }
        syncUI();
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
  if (game.aiTurnTimer) {
    clearTimeout(game.aiTurnTimer);
    game.aiTurnTimer = null;
  }
  game.mode = modeSelectEl.value;
  game.difficulty = difficultySelectEl ? difficultySelectEl.value : "medium";
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
  game.pendingAnchorByPlayer = { 1: null, 2: null };
  game.isGameOver = false;
  game.consecutivePasses = 0;
  game.aiThinking = false;
  game.hadErrorThisGame = false;
  resetCurrentGameMetrics();
  logEvent("game_start", { mode: game.mode, difficulty: game.difficulty });
  game.reasoning = {
    1: game.mode === "ai" ? "AI reasoning will appear here during its turn." : "Player 1 strategy notes will appear here.",
    2: game.mode === "ai" ? "Coach is finding your best opening..." : "Player 2 strategy notes will appear here."
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
      autoPreviewSelectedPiece(player);
      syncUI();
      if (player === 2) {
        refreshHumanChoiceReasoning();
      }
    });

    control.rotateBtn.addEventListener("click", () => {
      if (!canUsePlayerControls(player)) {
        return;
      }

      game.rotationByPlayer[player] = (game.rotationByPlayer[player] + 1) % 4;
      refreshPendingPlacement(player);
      syncUI();
      if (player === 2) {
        refreshHumanChoiceReasoning();
      }
    });

    control.flipBtn.addEventListener("click", () => {
      if (!canUsePlayerControls(player)) {
        return;
      }

      game.flippedByPlayer[player] = !game.flippedByPlayer[player];
      refreshPendingPlacement(player);
      syncUI();
      if (player === 2) {
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

  const applyModeSelection = () => {
    const nextMode = modeSelectEl.value;
    if (game.mode === nextMode) {
      return;
    }
    modeSelectEl.value = nextMode;
    resetGame();
    startTurn(1);
  };
  modeSelectEl.addEventListener("change", applyModeSelection);

  if (difficultySelectEl) {
    difficultySelectEl.addEventListener("change", () => {
      game.difficulty = difficultySelectEl.value;
      if (game.mode === "ai" && game.currentPlayer === 2 && !game.isGameOver) {
        applyHumanRecommendation();
      }
      syncUI();
    });
  }

  if (stageRotateBtnEl && stageFlipBtnEl && stageHintBtnEl && stagePassBtnEl && stagePlayBtnEl) {
    stageRotateBtnEl.addEventListener("click", () => {
      const player = game.currentPlayer;
      if (!canUsePlayerControls(player)) {
        return;
      }
      game.rotationByPlayer[player] = (game.rotationByPlayer[player] + 1) % 4;
      refreshPendingPlacement(player);
      syncUI();
      if (player === 2) {
        refreshHumanChoiceReasoning();
      }
    });

    stageFlipBtnEl.addEventListener("click", () => {
      const player = game.currentPlayer;
      if (!canUsePlayerControls(player)) {
        return;
      }
      game.flippedByPlayer[player] = !game.flippedByPlayer[player];
      refreshPendingPlacement(player);
      syncUI();
      if (player === 2) {
        refreshHumanChoiceReasoning();
      }
    });

    stageHintBtnEl.addEventListener("click", () => findHint(game.currentPlayer));
    stagePassBtnEl.addEventListener("click", () => manualPass(game.currentPlayer));
    stagePlayBtnEl.addEventListener("click", () => playPendingMove(game.currentPlayer));
  }

  if (viewBoardBtnEl && viewP1BtnEl && viewP2BtnEl) {
    viewBoardBtnEl.addEventListener("click", () => setMobileView("board"));
    viewP1BtnEl.addEventListener("click", () => setMobileView("p1"));
    viewP2BtnEl.addEventListener("click", () => setMobileView("p2"));
  }

  const bindInlinePiecePicker = (targetEl) => {
    if (!targetEl) {
      return;
    }
    targetEl.addEventListener("click", (event) => {
      const pill = event.target.closest(".piece-pill");
      if (!pill) {
        return;
      }
      const player = Number(pill.dataset.player);
      const pieceId = pill.dataset.pieceId;
      if (!player || !pieceId || !canUsePlayerControls(player)) {
        return;
      }
      game.selectedPieceByPlayer[player] = pieceId;
      game.rotationByPlayer[player] = 0;
      game.flippedByPlayer[player] = false;
      autoPreviewSelectedPiece(player);
      if (player === 2) {
        refreshHumanChoiceReasoning();
      }
      syncUI();
    });

  };

  bindInlinePiecePicker(player1InlineRemainingEl);
  bindInlinePiecePicker(player2InlineRemainingEl);

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

  boardEl.addEventListener("pointerup", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) {
      return;
    }
    event.preventDefault();
    placeFromBoardEvent(Number(cell.dataset.x), Number(cell.dataset.y));
  });

  window.addEventListener("resize", () => {
    if (!isCompactLayout()) {
      setMobileView("board");
    } else if (!["board", "p1", "p2"].includes(game.mobileView)) {
      setMobileView("board");
    }
  });

  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  }, { passive: false });
}

function init() {
  precomputeTransforms();
  startSessionTracking();
  renderCoordinates();
  bindEvents();
  if (difficultySelectEl) {
    difficultySelectEl.value = "medium";
    difficultySelectEl.disabled = modeSelectEl.value !== "ai";
    game.difficulty = difficultySelectEl.value;
  }
  game.playerNames[1] = (player1NameEl.value || "").trim() || "Player 1";
  game.playerNames[2] = (player2NameEl.value || "").trim() || "Human";
  game.playerNames.ai = "AI";
  window.BPCMetrics = {
    export: () => JSON.stringify(loadMetricsState(), null, 2),
    summary: () => ({
      review: loadReviewState(),
      metrics: loadMetricsState()
    }),
    clear: () => {
      localStorage.removeItem(METRICS_STATE_KEY);
      renderMetricsDashboard();
    }
  };
  renderPiecesReference();
  renderMetricsDashboard();
  setMobileView("board");
  resetGame();
  startTurn(1);
}

init();
