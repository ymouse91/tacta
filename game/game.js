const SVG_NS = "http://www.w3.org/2000/svg";
const CARD_W = 240;
const CARD_H = 360;
const CENTER = { x: CARD_W / 2, y: CARD_H / 2 };
const CORNER_SQUARE_SIZE = CARD_W / 2;
const EDGE_THICKNESS = CORNER_SQUARE_SIZE / 2;
const TRIANGLE_LEG = EDGE_THICKNESS * Math.SQRT2;
const EDGE_TRIANGLE_BASE = CORNER_SQUARE_SIZE;
const BOARD_CENTER = { x: 2100, y: 1600 };
const BOARD_CARD_SCALE = 0.4;
const APP_VERSION = "v0.1.3";
const AI_TURN_DELAY_MS = 3000;
const AI_MOVE_DELAY_MS = 700;
const TARGET_OVERLAP_TOLERANCE = 90;
const NON_TARGET_OVERLAP_TOLERANCE = 120;
const ELEMENT_OVERLAP_TOLERANCE = 18;
const FREE_PLACE_GAP = 18;

const playerColors = [
  { id: "blue", label: "Sininen", css: "#66c9ff", symbol: "B" },
  { id: "green", label: "Vihreä", css: "#71d43d", symbol: "G" },
  { id: "orange", label: "Oranssi", css: "#ffad2e", symbol: "O" },
  { id: "pink", label: "Pinkki", css: "#ff3dac", symbol: "P" },
  { id: "purple", label: "Violetti", css: "#9a80ff", symbol: "V" },
  { id: "red", label: "Punainen", css: "#ff4242", symbol: "R" },
];

const suitIds = ["circle", "square", "triangle"];

const elementDefinitions = [
  rectElement("square-top-left", "cornerSquare", "square", null, "top-left", 0, 0, 120, 120),
  rectElement("square-top-right", "cornerSquare", "square", null, "top-right", 120, 0, 120, 120),
  rectElement("square-bottom-right", "cornerSquare", "square", null, "bottom-right", 120, 240, 120, 120),
  rectElement("square-bottom-left", "cornerSquare", "square", null, "bottom-left", 0, 240, 120, 120),
  rectElement("rect-left-long", "edgeRectangle", "rectangle", "long", "left", 0, 0, 60, 360),
  rectElement("rect-right-long", "edgeRectangle", "rectangle", "long", "right", 180, 0, 60, 360),
  rectElement("rect-left-short", "edgeRectangle", "rectangle", "short", "left", 0, 60, 60, 240),
  rectElement("rect-right-short", "edgeRectangle", "rectangle", "short", "right", 180, 60, 60, 240),
  rectElement("rect-top-short", "edgeRectangle", "rectangle", "short", "top", 0, 0, 240, 60),
  rectElement("rect-bottom-short", "edgeRectangle", "rectangle", "short", "bottom", 0, 300, 240, 60),
  polyElement("triangle-corner-top-left", "cornerTriangle", "triangle", "corner", "top-left", [[0, 0], [TRIANGLE_LEG, 0], [0, TRIANGLE_LEG]]),
  polyElement("triangle-corner-top-right", "cornerTriangle", "triangle", "corner", "top-right", [[CARD_W - TRIANGLE_LEG, 0], [CARD_W, 0], [CARD_W, TRIANGLE_LEG]]),
  polyElement("triangle-corner-bottom-right", "cornerTriangle", "triangle", "corner", "bottom-right", [[CARD_W, CARD_H - TRIANGLE_LEG], [CARD_W, CARD_H], [CARD_W - TRIANGLE_LEG, CARD_H]]),
  polyElement("triangle-corner-bottom-left", "cornerTriangle", "triangle", "corner", "bottom-left", [[0, CARD_H - TRIANGLE_LEG], [TRIANGLE_LEG, CARD_H], [0, CARD_H]]),
  polyElement("triangle-edge-top", "edgeTriangle", "triangle", "edge", "top", [[(CARD_W - EDGE_TRIANGLE_BASE) / 2, 0], [CARD_W / 2, EDGE_THICKNESS], [(CARD_W + EDGE_TRIANGLE_BASE) / 2, 0]]),
  polyElement("triangle-edge-right", "edgeTriangle", "triangle", "edge", "right", [[CARD_W, (CARD_H - EDGE_TRIANGLE_BASE) / 2], [CARD_W - EDGE_THICKNESS, CARD_H / 2], [CARD_W, (CARD_H + EDGE_TRIANGLE_BASE) / 2]]),
  polyElement("triangle-edge-bottom", "edgeTriangle", "triangle", "edge", "bottom", [[(CARD_W + EDGE_TRIANGLE_BASE) / 2, CARD_H], [CARD_W / 2, CARD_H - EDGE_THICKNESS], [(CARD_W - EDGE_TRIANGLE_BASE) / 2, CARD_H]]),
  polyElement("triangle-edge-left", "edgeTriangle", "triangle", "edge", "left", [[0, (CARD_H + EDGE_TRIANGLE_BASE) / 2], [EDGE_THICKNESS, CARD_H / 2], [0, (CARD_H - EDGE_TRIANGLE_BASE) / 2]]),
];

const labels = {
  "square-top-left": "ylävasen neliö",
  "square-top-right": "yläoikea neliö",
  "square-bottom-right": "alaoikea neliö",
  "square-bottom-left": "alavasen neliö",
  "rect-left-long": "vasen pitkä nelikulmio",
  "rect-right-long": "oikea pitkä nelikulmio",
  "rect-left-short": "vasen lyhyt nelikulmio",
  "rect-right-short": "oikea lyhyt nelikulmio",
  "rect-top-short": "yläreunan lyhyt nelikulmio",
  "rect-bottom-short": "alareunan lyhyt nelikulmio",
  "triangle-corner-top-left": "ylävasen kulmakolmio",
  "triangle-corner-top-right": "yläoikea kulmakolmio",
  "triangle-corner-bottom-right": "alaoikea kulmakolmio",
  "triangle-corner-bottom-left": "alavasen kulmakolmio",
  "triangle-edge-top": "yläreunan keskikolmio",
  "triangle-edge-right": "oikean reunan keskikolmio",
  "triangle-edge-bottom": "alareunan keskikolmio",
  "triangle-edge-left": "vasemman reunan keskikolmio",
};

let baseCardSet = null;
let game = null;
let selected = { handSide: null, ownElementId: null, targetPlacementId: null, targetElementId: null };
let aiTurnTimer = null;

const setupScreen = document.querySelector("#setup-screen");
const passScreen = document.querySelector("#pass-screen");
const playScreen = document.querySelector("#play-screen");
const scoreScreen = document.querySelector("#score-screen");
const statusEl = document.querySelector("#status");
const playerCountEl = document.querySelector("#player-count");
const gameModeEl = document.querySelector("#game-mode");
const aiCountEl = document.querySelector("#ai-count");
const startGameButton = document.querySelector("#start-game");
const newGameButton = document.querySelector("#new-game");
const inspectBoardButton = document.querySelector("#inspect-board");
const playAgainButton = document.querySelector("#play-again");
const beginTurnButton = document.querySelector("#begin-turn");
const passTitle = document.querySelector("#pass-title");
const passText = document.querySelector("#pass-text");
const playerStrip = document.querySelector("#player-strip");
const handCards = document.querySelector("#hand-cards");
const boardWrap = document.querySelector(".board-wrap");
const board = document.querySelector("#board");
const freePlaceButton = document.querySelector("#free-place");
const scoreList = document.querySelector("#score-list");

startGameButton.addEventListener("click", startGame);
newGameButton.addEventListener("click", showSetup);
inspectBoardButton.addEventListener("click", inspectBoard);
playAgainButton.addEventListener("click", showSetup);
beginTurnButton.addEventListener("click", beginTurn);
freePlaceButton.addEventListener("click", freePlaceSelectedCard);
gameModeEl.addEventListener("change", updateSetupControls);
playerCountEl.addEventListener("change", updateSetupControls);
initBoardDragging();
updateSetupControls();

loadCardStructures();

function setStatus(message) {
  statusEl.textContent = `${message} (${APP_VERSION})`;
}

function currentBoardScale() {
  return BOARD_CARD_SCALE;
}

function updateSetupControls() {
  const mode = gameModeEl.value;

  if (mode === "sabotage") {
    playerCountEl.value = "2";
    playerCountEl.disabled = true;
  } else {
    playerCountEl.disabled = false;
  }

  const playerCount = Number(playerCountEl.value);
  const previousAiCount = Math.min(Number(aiCountEl.value || 0), playerCount);
  aiCountEl.replaceChildren(...Array.from({ length: playerCount + 1 }, (_, count) => {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = count === 1 ? "1 AI-pelaaja" : `${count} AI-pelaajaa`;
    if (count === previousAiCount) option.selected = true;
    return option;
  }));
}

function initBoardDragging() {
  const drag = {
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  };

  boardWrap.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".hit-shape, button, select, input, a")) return;
    drag.active = true;
    drag.moved = false;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.scrollLeft = boardWrap.scrollLeft;
    drag.scrollTop = boardWrap.scrollTop;
    boardWrap.setPointerCapture(event.pointerId);
    boardWrap.classList.add("is-dragging");
  });

  boardWrap.addEventListener("pointermove", (event) => {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    boardWrap.scrollLeft = drag.scrollLeft - dx;
    boardWrap.scrollTop = drag.scrollTop - dy;
    event.preventDefault();
  });

  boardWrap.addEventListener("pointerup", (event) => finishBoardDrag(event, drag));
  boardWrap.addEventListener("pointercancel", (event) => finishBoardDrag(event, drag));
  boardWrap.addEventListener("click", (event) => {
    if (!drag.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.moved = false;
  }, true);
}

function finishBoardDrag(event, drag) {
  if (!drag.active || event.pointerId !== drag.pointerId) return;
  drag.active = false;
  drag.pointerId = null;
  boardWrap.classList.remove("is-dragging");
  if (boardWrap.hasPointerCapture(event.pointerId)) {
    boardWrap.releasePointerCapture(event.pointerId);
  }
}

async function loadCardStructures() {
  try {
    const response = await fetch("./data/card-structures.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    baseCardSet = await response.json();
    validateCardSet(baseCardSet);
    setStatus("Valitse pelaajamäärä ja aloita peli.");
  } catch (error) {
    setStatus(`Korttirakenteiden lataus epäonnistui: ${error.message}`);
    startGameButton.disabled = true;
  }
}

function startGame() {
  clearAiTurnTimer();
  const setup = readSetup();
  const players = setup.playerColors.map((color, index) => ({
    id: color.id,
    name: color.label,
    color,
    deck: shuffle(buildDeckForPlayer(color, index, setup)),
    order: index,
    isAi: index >= setup.playerColors.length - setup.aiCount,
  }));

  game = {
    players,
    mode: setup.mode,
    includedSuits: setup.includedSuits,
    currentPlayerIndex: findStartingPlayerIndex(players),
    placements: [createStartingPlacement()],
    turn: 1,
  };

  selected = { handSide: null, ownElementId: null, targetPlacementId: null, targetElementId: null };
  setupScreen.classList.add("is-hidden");
  scoreScreen.classList.add("is-hidden");
  renderAll();
  showPassScreen("Aloittava pelaaja");
  centerBoard();
}

function readSetup() {
  const mode = gameModeEl.value;
  const playerCount = mode === "sabotage" ? 2 : Number(playerCountEl.value);
  const aiCount = Math.min(Number(aiCountEl.value || 0), playerCount);
  return {
    mode,
    aiCount,
    playerColors: playerColors.slice(0, playerCount),
    includedSuits: includedSuitIdsForMode(mode),
  };
}

function includedSuitIdsForMode(mode) {
  if (mode === "standard") return suitIds;
  if (mode === "limited-1") return randomSuitIds(1);
  if (mode === "sabotage") return randomSuitIds(1);
  return randomSuitIds(2);
}

function randomSuitIds(count) {
  return shuffle(suitIds).slice(0, count);
}

function showSetup() {
  clearAiTurnTimer();
  setupScreen.classList.remove("is-hidden");
  passScreen.classList.add("is-hidden");
  playScreen.classList.add("is-hidden");
  scoreScreen.classList.add("is-hidden");
  setStatus("Valitse pelaajamäärä ja aloita peli.");
}

function showPassScreen(prefix = "Seuraava vuoro") {
  clearAiTurnTimer();
  const player = currentPlayer();
  passTitle.textContent = `${player.isAi ? "Tekoälyn vuoro" : prefix}: ${player.name}`;
  passText.textContent = player.isAi
    ? "Tekoäly miettii seuraavaa siirtoa."
    : `Anna iPad pelaajalle ${player.name}.`;
  beginTurnButton.classList.toggle("is-hidden", player.isAi);
  setupScreen.classList.add("is-hidden");
  scoreScreen.classList.add("is-hidden");
  playScreen.classList.remove("is-hidden");
  passScreen.classList.remove("is-hidden");
  setStatus(player.isAi ? `${player.name} pelaa kohta automaattisesti.` : `${player.name} valmistautuu vuoroon.`);
  if (player.isAi) {
    aiTurnTimer = window.setTimeout(beginTurn, AI_TURN_DELAY_MS);
  }
}

function beginTurn() {
  clearAiTurnTimer();
  passScreen.classList.add("is-hidden");
  playScreen.classList.remove("is-hidden");
  const player = currentPlayer();
  setStatus(player.isAi
    ? `${player.name} valitsee siirtoa.`
    : `${player.name}: valitse toinen kahdesta ulommaisesta kortista.`);
  renderAll();
  if (player.isAi) {
    aiTurnTimer = window.setTimeout(playAiTurn, AI_MOVE_DELAY_MS);
  }
}

function buildDeckForPlayer(color, playerIndex, setup) {
  if (setup.mode === "sabotage") {
    const opponentColor = setup.playerColors[(playerIndex + 1) % setup.playerColors.length];
    const opponentSuit = setup.includedSuits[0];
    const ownSuits = suitIds.filter((suitId) => suitId !== opponentSuit);
    return [
      ...buildCardsForColorAndSuits(color, ownSuits),
      ...buildCardsForColorAndSuits(opponentColor, [opponentSuit]),
    ];
  }
  return buildCardsForColorAndSuits(color, setup.includedSuits);
}

function buildCardsForColorAndSuits(color, includedSuits) {
  return baseCardSet.cards
    .filter((card) => includedSuits.includes(card.suit))
    .map((card, index) => ({
      ...card,
      instanceId: `${color.id}-${card.id}-${index}`,
      colorId: color.id,
      colorLabel: color.label,
      colorCss: color.css,
      flipped: false,
    }));
}

function findStartingPlayerIndex(players) {
  let best = { index: 0, low: Infinity, sum: Infinity };
  players.forEach((player, index) => {
    const outer = outerCards(player.deck);
    const values = outer.map((item) => item.card.value);
    const low = Math.min(...values);
    const sum = values.reduce((total, value) => total + value, 0);
    if (low < best.low || (low === best.low && sum < best.sum)) {
      best = { index, low, sum };
    }
  });
  return best.index;
}

function renderAll() {
  renderPlayers();
  renderHand();
  renderBoard();
  renderState();
}

function renderPlayers() {
  const scores = visibleScores();
  playerStrip.replaceChildren(...game.players.map((item, index) => {
    const row = document.createElement("div");
    row.className = "player-row";
    if (index === game.currentPlayerIndex) row.classList.add("is-current");
    row.innerHTML = `<span class="swatch" style="--player-color:${item.color.css}"></span><strong>${item.name}${item.isAi ? " AI" : ""}</strong><span>${scores[item.id] || 0} p / ${item.deck.length}</span>`;
    return row;
  }));
}

function renderHand() {
  const player = currentPlayer();
  handCards.replaceChildren();
  for (const outer of outerCards(player.deck)) {
    const cardEl = document.createElement("article");
    cardEl.className = "hand-card";
    if (selected.handSide === outer.side) cardEl.classList.add("is-selected");

    const preview = document.createElement("div");
    preview.className = "hand-card-preview";
    preview.append(renderCardSvg({
      card: outer.card,
      mode: "hand",
      color: outer.card.colorCss,
      flipped: outer.flipped,
      placementId: null,
    }));

    const actions = document.createElement("div");
    actions.className = "hand-actions";

    const flip = document.createElement("button");
    flip.type = "button";
    flip.textContent = outer.flipped ? "Peilattu" : "Peilaa";
    flip.disabled = player.isAi;
    flip.addEventListener("click", () => {
      if (currentPlayer().isAi) return;
      outer.card.flipped = !outer.flipped;
      selectHandCard(outer.side);
      renderAll();
    });

    actions.append(flip);
    cardEl.append(preview, actions);
    handCards.append(cardEl);
  }
}

function renderBoard() {
  board.replaceChildren();
  for (const placement of game.placements) {
    const wrapper = document.createElement("div");
    wrapper.className = `board-card ${placement.card.id === "starting-card" ? "start-card" : "is-placed"}`;
    const scale = currentBoardScale();
    wrapper.style.left = `${placement.x + CENTER.x * (1 - scale)}px`;
    wrapper.style.top = `${placement.y + CENTER.y * (1 - scale)}px`;
    wrapper.style.width = `${CARD_W * scale}px`;
    wrapper.style.height = `${CARD_H * scale}px`;
    wrapper.style.transformOrigin = `${CENTER.x * scale}px ${CENTER.y * scale}px`;
    wrapper.style.transform = `rotate(${placement.rotation}deg)`;
    wrapper.append(renderCardSvg({
      card: placement.card,
      mode: "board",
      color: placement.colorCss,
      flipped: placement.flipped,
      placementId: placement.id,
    }));
    board.append(wrapper);
  }
}

function renderCardSvg({ card, mode, color, flipped, placementId }) {
  const svg = createSvg("svg");
  svg.classList.add("card-svg");
  svg.setAttribute("viewBox", `0 0 ${CARD_W} ${CARD_H}`);
  svg.style.setProperty("--card-color", color);

  const group = createSvg("g");
  group.setAttribute("transform", cardTransform(flipped));
  svg.append(group);

  const shell = createSvg("rect");
  shell.classList.add("card-shell");
  shell.setAttribute("x", "0");
  shell.setAttribute("y", "0");
  shell.setAttribute("width", CARD_W);
  shell.setAttribute("height", CARD_H);
  shell.setAttribute("rx", "11");
  group.append(shell);

  const hitShapes = [];
  for (const definition of elementDefinitions) {
    const element = getCardElement(card, definition.id);
    const enabled = card.id === "starting-card" || element.enabled;
    group.append(drawShape(definition, enabled, element.dots > 0));

    if (enabled && element.dots > 0) {
      for (const dot of dotsForDefinition(definition, element.dots)) {
        const dotEl = createSvg("circle");
        dotEl.classList.add("dot");
        dotEl.setAttribute("cx", dot.x);
        dotEl.setAttribute("cy", dot.y);
        dotEl.setAttribute("r", "5.6");
        group.append(dotEl);
      }
    }

    if (mode === "hand" && enabled) {
      hitShapes.push(drawHitShape(definition, {
        selected: selected.ownElementId === definition.id && selected.handSide && selectedCard().instanceId === card.instanceId,
        onClick: () => selectOwnElement(card, definition.id),
      }));
    }

    if (mode === "board") {
      const own = selected.ownElementId ? getDefinition(selected.ownElementId) : null;
      const targetPlacement = game.placements.find((placement) => placement.id === placementId);
      const available = targetPlacement && targetElementIsAvailable(targetPlacement, definition);
      const compatible = Boolean(own && enabled && available && areCompatible(own, definition));
      if (!own || compatible) {
        hitShapes.push(drawHitShape(definition, {
          selected: selected.targetPlacementId === placementId && selected.targetElementId === definition.id,
          compatible,
          onClick: () => placeSelectedCard(placementId, definition.id),
        }));
      }
    }
  }

  drawCenter(group, card, flipped);
  group.append(...hitShapes);
  return svg;
}

function selectHandCard(side) {
  if (currentPlayer().isAi) return;
  selected.handSide = side;
  selected.ownElementId = null;
  selected.targetPlacementId = null;
  selected.targetElementId = null;
  setStatus("Valitse kortista elementti.");
  renderAll();
}

function selectOwnElement(card, elementId) {
  if (currentPlayer().isAi) return;
  const outer = selectedCard();
  if (!outer || outer.instanceId !== card.instanceId) {
    selected.handSide = sideForVisibleCard(card.instanceId);
  }
  selected.ownElementId = elementId;
  selected.targetPlacementId = null;
  selected.targetElementId = null;
  setStatus("Valitse pöydältä yhteensopiva kohde-elementti.");
  renderAll();
}

function placeSelectedCard(targetPlacementId, targetElementId) {
  if (currentPlayer().isAi) return;
  const handCard = selectedCard();
  if (!handCard || !selected.ownElementId) {
    setStatus("Valitse ensin kortti ja siitä elementti.");
    return;
  }

  const targetPlacement = game.placements.find((placement) => placement.id === targetPlacementId);
  const ownDefinition = getDefinition(selected.ownElementId);
  const targetDefinition = getDefinition(targetElementId);
  if (!targetPlacement || !areCompatible(ownDefinition, targetDefinition)) {
    setStatus("Elementit eivät ole yhtenevät.");
    return;
  }

  try {
    const placement = solvePlacement(handCard, ownDefinition, targetPlacement, targetDefinition);
    selected.targetPlacementId = targetPlacementId;
    selected.targetElementId = targetElementId;
    commitPlacement(placement);
  } catch (error) {
    setStatus(error.message);
  }
}

function solvePlacement(handCard, ownDefinition, targetPlacement, targetDefinition) {
  if (!targetElementIsAvailable(targetPlacement, targetDefinition)) {
    throw new Error("kohde-elementti on jo peitossa");
  }

  const targetWorldPoints = geometryPoints(targetDefinition.geometry).map((point) => localToWorld(point, targetPlacement));
  const targetCenter = pointsCenter(targetWorldPoints);
  const targetDirection = worldDirection(elementDirection(targetDefinition), targetPlacement.rotation, targetPlacement.flipped);
  const candidates = [];
  const scale = currentBoardScale();

  for (const rotation of [0, 45, 90, 135, 180, 225, 270, 315]) {
    const ownLocalPoints = geometryPoints(ownDefinition.geometry).map((point) => transformLocalPoint(point, rotation, handCard.flipped, scale));
    const ownCenter = pointsCenter(ownLocalPoints);
    const offset = {
      x: targetCenter.x - ownCenter.x,
      y: targetCenter.y - ownCenter.y,
    };
    const ownWorldPoints = ownLocalPoints.map((point) => ({ x: point.x + offset.x, y: point.y + offset.y }));
    if (!samePointSet(ownWorldPoints, targetWorldPoints)) continue;

    const movingCenter = { x: CENTER.x + offset.x, y: CENTER.y + offset.y };
    const out = normalizeVector({ x: movingCenter.x - targetCenter.x, y: movingCenter.y - targetCenter.y });
    const candidate = { card: handCard, rotation, x: offset.x, y: offset.y, flipped: handCard.flipped };
    if (!targetOverlapStaysInsideElement(candidate, targetPlacement, targetWorldPoints)) continue;
    if (touchesAnyNonTargetCard(candidate, targetPlacement.id)) continue;
    candidates.push({ ...candidate, outsideScore: dot(out, normalizeVector(targetDirection)) });
  }

  const best = candidates.sort((a, b) => b.outsideScore - a.outsideScore)[0];
  if (!best) throw new Error("sijoitus ei ole sallittu: kortti osuisi myös toiseen korttiin tai sopivaa asentoa ei löytynyt");
  return {
    id: `card-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    card: handCard,
    playerId: currentPlayer().id,
    colorCss: handCard.colorCss,
    x: best.x,
    y: best.y,
    rotation: best.rotation,
    flipped: handCard.flipped,
    attachedTo: { placementId: targetPlacement.id, ownElementId: ownDefinition.id, targetElementId: targetDefinition.id },
  };
}

function commitPlacement(placement) {
  game.placements.push(placement);
  removeSelectedCardFromDeck();
  if (isGameOver()) {
    renderAll();
    showScores();
    return;
  }
  advanceTurn();
}

function freePlaceSelectedCard() {
  if (currentPlayer().isAi) return;
  const handCard = selectedCard();
  if (!handCard) {
    setStatus("Valitse ensin kortti.");
    return;
  }
  if (hasAnyLegalMoveForCurrentPlayer()) {
    setStatus("Vapaa sijoitus sallitaan vasta, kun kummallakaan näkyvällä kortilla ei ole laillista siirtoa.");
    renderAll();
    return;
  }
  const freeSpot = findFreePlacementSpot(handCard);
  if (!freeSpot) {
    setStatus("Vapaalle sijoitukselle ei löytynyt erillistä paikkaa pelialueelta.");
    renderAll();
    return;
  }
  commitPlacement({
    id: `free-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    card: handCard,
    playerId: currentPlayer().id,
    colorCss: handCard.colorCss,
    x: freeSpot.x,
    y: freeSpot.y,
    rotation: 0,
    flipped: handCard.flipped,
    attachedTo: null,
  });
}

function removeSelectedCardFromDeck() {
  const player = currentPlayer();
  if (selected.handSide === "front") player.deck.shift();
  if (selected.handSide === "back") player.deck.pop();
  selected = { handSide: null, ownElementId: null, targetPlacementId: null, targetElementId: null };
}

function advanceTurn() {
  clearAiTurnTimer();
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  game.turn += 1;
  renderAll();
  showPassScreen();
}

function showScores() {
  clearAiTurnTimer();
  passScreen.classList.add("is-hidden");
  playScreen.classList.remove("is-hidden");
  scoreScreen.classList.remove("is-hidden");
  const scoreMap = visibleScores();
  const scores = game.players.map((player) => ({
    player,
    score: scoreMap[player.id] || 0,
  })).sort((a, b) => b.score - a.score);
  const winningScore = scores[0]?.score || 0;
  const winners = scores.filter((item) => item.score === winningScore);
  scoreScreen.querySelector("h2").textContent = winners.length === 1
    ? `Voittaja: ${winners[0].player.name}`
    : `Tasapeli: ${winners.map((item) => item.player.name).join(", ")}`;
  scoreList.replaceChildren(...scores.map(({ player, score }) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span>${player.name}</span><strong>${score}</strong>`;
    return row;
  }));
  setStatus("Peli päättyi. Pisteet ovat näkyvissä olevat omat pisteet.");
}

function inspectBoard() {
  scoreScreen.classList.add("is-hidden");
  setStatus("Peli päättyi. Voit tarkastella pelilautaa vapaasti.");
}

function renderState() {
  const outer = selectedCard();
  const legalMoveExists = hasAnyLegalMoveForCurrentPlayer();
  freePlaceButton.disabled = currentPlayer().isAi || !outer || legalMoveExists;
  freePlaceButton.title = legalMoveExists
    ? "Vapaa sijoitus sallitaan vain, jos kummallakaan näkyvällä kortilla ei ole laillista siirtoa."
    : "Sijoita valittu kortti erilleen muista korteista.";
}

function playAiTurn() {
  clearAiTurnTimer();
  if (!game || !currentPlayer().isAi || isGameOver()) return;

  const move = chooseAiMove();
  if (!move) {
    setStatus(`${currentPlayer().name}: siirtoa ei löytynyt.`);
    advanceTurn();
    return;
  }

  selected = {
    handSide: move.side,
    ownElementId: move.ownElementId || null,
    targetPlacementId: move.targetPlacementId || null,
    targetElementId: move.targetElementId || null,
  };

  const handCard = selectedCard();
  if (!handCard) {
    advanceTurn();
    return;
  }
  handCard.flipped = move.flipped;

  if (move.kind === "free") {
    const freeSpot = findFreePlacementSpot(handCard);
    if (!freeSpot) {
      setStatus(`${currentPlayer().name}: vapaata paikkaa ei löytynyt.`);
      advanceTurn();
      return;
    }
    setStatus(`${currentPlayer().name} asetti kortin vapaasti.`);
    const placement = {
      id: `free-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      card: handCard,
      playerId: currentPlayer().id,
      colorCss: handCard.colorCss,
      x: freeSpot.x,
      y: freeSpot.y,
      rotation: 0,
      flipped: handCard.flipped,
      attachedTo: null,
    };
    commitPlacement(placement);
    centerBoardOnPlacement(placement);
    return;
  }

  const targetPlacement = game.placements.find((placement) => placement.id === move.targetPlacementId);
  const ownDefinition = getDefinition(move.ownElementId);
  const targetDefinition = getDefinition(move.targetElementId);
  try {
    setStatus(`${currentPlayer().name} pelasi kortin ${handCard.value}.`);
    const placement = solvePlacement(handCard, ownDefinition, targetPlacement, targetDefinition);
    commitPlacement(placement);
    centerBoardOnPlacement(placement);
  } catch (error) {
    setStatus(`${currentPlayer().name}: ${error.message}`);
    advanceTurn();
  }
}

function chooseAiMove() {
  const legalMoves = allLegalMovesForCurrentPlayer();
  if (legalMoves.length > 0) {
    return legalMoves
      .map((move) => ({ ...move, score: scoreAiMove(move) }))
      .sort((a, b) => b.score - a.score)[0];
  }
  return chooseAiFreeMove();
}

function allLegalMovesForCurrentPlayer() {
  const moves = [];
  for (const outer of outerCards(currentPlayer().deck)) {
    for (const flipped of [false, true]) {
      const testCard = { ...outer.card, flipped };
      for (const ownDefinition of elementDefinitions) {
        const ownElement = getCardElement(testCard, ownDefinition.id);
        if (!ownElement.enabled) continue;
        for (const targetPlacement of game.placements) {
          for (const targetDefinition of elementDefinitions) {
            const targetElement = getCardElement(targetPlacement.card, targetDefinition.id);
            const targetEnabled = targetPlacement.card.id === "starting-card" || targetElement.enabled;
            if (!targetEnabled || !areCompatible(ownDefinition, targetDefinition)) continue;
            try {
              const placement = solvePlacement(testCard, ownDefinition, targetPlacement, targetDefinition);
              moves.push({
                kind: "legal",
                side: outer.side,
                flipped,
                card: testCard,
                placement,
                ownElementId: ownDefinition.id,
                targetPlacementId: targetPlacement.id,
                targetElementId: targetDefinition.id,
              });
            } catch {
              // Other orientations or targets may still be legal.
            }
          }
        }
      }
    }
  }
  return moves;
}

function scoreAiMove(move) {
  const player = currentPlayer();
  const before = visibleScores();
  const after = visibleScoresForPlacements([...game.placements, move.placement]);
  const ownDelta = (after[player.id] || 0) - (before[player.id] || 0);
  const opponentDelta = opponentScoreTotal(after, player.id) - opponentScoreTotal(before, player.id);
  const targetPlacement = game.placements.find((placement) => placement.id === move.targetPlacementId);
  const targetElement = targetPlacement ? getCardElement(targetPlacement.card, move.targetElementId) : { dots: 0 };
  const ownElement = getCardElement(move.card, move.ownElementId);
  const targetOwner = targetPlacement?.card.colorId || null;
  const targetDots = targetElement.enabled ? targetElement.dots : 0;
  const ownElementDots = ownElement.enabled ? ownElement.dots : 0;
  const coversOpponentDots = targetOwner && targetOwner !== player.id ? targetDots : 0;
  const coversOwnDots = targetOwner === player.id ? targetDots : 0;
  const placedOpponentDots = move.card.colorId !== player.id ? ownElementDots : 0;

  return (
    ownDelta * 14
    - opponentDelta * 12
    + coversOpponentDots * 8
    - coversOwnDots * 10
    - placedOpponentDots * 5
    + Math.random() * 0.05
  );
}

function opponentScoreTotal(scores, playerId) {
  return game.players
    .filter((player) => player.id !== playerId)
    .reduce((sum, player) => sum + (scores[player.id] || 0), 0);
}

function chooseAiFreeMove() {
  const candidates = outerCards(currentPlayer().deck)
    .flatMap((outer) => [false, true].map((flipped) => ({ ...outer, flipped })))
    .filter(({ card, flipped }) => findFreePlacementSpot({ ...card, flipped }))
    .map((outer) => ({
      kind: "free",
      side: outer.side,
      flipped: outer.flipped,
      score: outer.card.colorId === currentPlayer().id ? totalDots(outer.card) : -totalDots(outer.card),
    }))
    .sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

function clearAiTurnTimer() {
  if (!aiTurnTimer) return;
  window.clearTimeout(aiTurnTimer);
  aiTurnTimer = null;
}

function outerCards(deck) {
  if (deck.length === 0) return [];
  if (deck.length === 1) return [{ side: "front", card: deck[0], flipped: deck[0].flipped || false }];
  return [
    { side: "front", card: deck[0], flipped: deck[0].flipped || false },
    { side: "back", card: deck[deck.length - 1], flipped: deck[deck.length - 1].flipped || false },
  ];
}

function selectedCard() {
  if (!selected.handSide) return null;
  return outerCards(currentPlayer().deck).find((item) => item.side === selected.handSide)?.card || null;
}

function sideForVisibleCard(instanceId) {
  return outerCards(currentPlayer().deck).find((item) => item.card.instanceId === instanceId)?.side || null;
}

function currentPlayer() {
  return game.players[game.currentPlayerIndex];
}

function isGameOver() {
  return game.players.every((player) => player.deck.length === 0);
}

function hasAnyLegalMoveForCurrentPlayer() {
  if (!game) return false;
  return outerCards(currentPlayer().deck).some(({ card }) => cardHasLegalMove(card));
}

function cardHasLegalMove(card) {
  return [false, true].some((flipped) => {
    const testCard = { ...card, flipped };
    return elementDefinitions.some((ownDefinition) => {
      const ownElement = getCardElement(testCard, ownDefinition.id);
      if (!ownElement.enabled) return false;
      return game.placements.some((targetPlacement) => (
        elementDefinitions.some((targetDefinition) => {
          const targetElement = getCardElement(targetPlacement.card, targetDefinition.id);
          const targetEnabled = targetPlacement.card.id === "starting-card" || targetElement.enabled;
          if (!targetEnabled || !areCompatible(ownDefinition, targetDefinition)) return false;
          try {
            solvePlacement(testCard, ownDefinition, targetPlacement, targetDefinition);
            return true;
          } catch {
            return false;
          }
        })
      ));
    });
  });
}

function findFreePlacementSpot(card) {
  const stepX = CARD_W * currentBoardScale() + FREE_PLACE_GAP;
  const stepY = CARD_H * currentBoardScale() + FREE_PLACE_GAP;
  const start = { x: BOARD_CENTER.x - CARD_W / 2, y: BOARD_CENTER.y - CARD_H / 2 };
  const candidates = [{ x: start.x, y: start.y }];

  for (let ring = 1; ring <= 18; ring += 1) {
    for (let dx = -ring; dx <= ring; dx += 1) {
      candidates.push({ x: start.x + dx * stepX, y: start.y - ring * stepY });
      candidates.push({ x: start.x + dx * stepX, y: start.y + ring * stepY });
    }
    for (let dy = -ring + 1; dy <= ring - 1; dy += 1) {
      candidates.push({ x: start.x - ring * stepX, y: start.y + dy * stepY });
      candidates.push({ x: start.x + ring * stepX, y: start.y + dy * stepY });
    }
  }

  return candidates.find((candidate) => isInsideBoard(candidate) && isFreePlacementIsolated({ card, ...candidate, rotation: 0, flipped: card.flipped }));
}

function isInsideBoard(placement) {
  return cardWorldPolygon(placement).every((point) => (
    point.x >= 0 && point.y >= 0 && point.x <= board.clientWidth && point.y <= board.clientHeight
  ));
}

function isFreePlacementIsolated(candidate) {
  const candidatePolygon = cardWorldPolygon(candidate);
  return game.placements.every((placement) => !polygonsTouchOrOverlap(candidatePolygon, cardWorldPolygon(placement)));
}

function createStartingPlacement() {
  return {
    id: "start",
    card: createStartCard(),
    playerId: null,
    colorCss: "#f3f6f8",
    x: BOARD_CENTER.x - CARD_W / 2,
    y: BOARD_CENTER.y - CARD_H / 2,
    rotation: 0,
    flipped: false,
    attachedTo: null,
  };
}

function createStartCard() {
  return {
    id: "starting-card",
    suit: "start",
    value: "X",
    colorLabel: "Aloitus",
    elements: Object.fromEntries(elementDefinitions.map((definition) => [definition.id, { enabled: true, dots: 0 }])),
  };
}

function validateCardSet(value) {
  if (value.kind !== "tacta-card-structure-set") throw new Error("tuntematon korttidatan tyyppi");
  if (!Array.isArray(value.cards) || !Array.isArray(value.suits)) throw new Error("korttidatan rakenne on puutteellinen");
}

function getCardElement(card, elementId) {
  return card.elements[elementId] || { enabled: false, dots: 0 };
}

function totalDots(card) {
  return Object.values(card.elements).reduce((sum, element) => sum + (element.enabled ? element.dots : 0), 0);
}

function visibleScores() {
  if (!game) return {};
  return visibleScoresForPlacements(game.placements);
}

function visibleScoresForPlacements(placements) {
  const scores = Object.fromEntries(game.players.map((player) => [player.id, 0]));
  placements.forEach((placement, index) => {
    if (!placement.card.colorId || !(placement.card.colorId in scores)) return;
    scores[placement.card.colorId] += visibleDotsForPlacement(placement, index, placements);
  });
  return scores;
}

function visibleDotsForPlacement(placement, placementIndex, placements = game.placements) {
  return dotsForPlacement(placement).filter((dot) => !isCoveredByLaterCard(dot, placementIndex, placements)).length;
}

function dotsForPlacement(placement) {
  const dots = [];
  for (const definition of elementDefinitions) {
    const element = getCardElement(placement.card, definition.id);
    if (!element.enabled || element.dots <= 0) continue;
    for (const dot of dotsForDefinition(definition, element.dots)) {
      dots.push(localToWorld(dot, placement));
    }
  }
  return dots;
}

function isCoveredByLaterCard(dot, placementIndex, placements = game.placements) {
  return placements
    .slice(placementIndex + 1)
    .some((laterPlacement) => pointInConvexPolygon(dot, cardWorldPolygon(laterPlacement)));
}

function getDefinition(elementId) {
  return elementDefinitions.find((definition) => definition.id === elementId);
}

function areCompatible(ownDefinition, targetDefinition) {
  return ownDefinition.shape === targetDefinition.shape && normalizedVariant(ownDefinition) === normalizedVariant(targetDefinition);
}

function normalizedVariant(definition) {
  if (definition.shape === "triangle") return "triangle";
  return definition.variant || definition.shape;
}

function elementDirection(definition) {
  const directions = {
    "top-left": { x: -1, y: -1 },
    "top-right": { x: 1, y: -1 },
    "bottom-right": { x: 1, y: 1 },
    "bottom-left": { x: -1, y: 1 },
    top: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
  };
  return directions[definition.position];
}

function worldDirection(vector, rotation, flipped) {
  let x = vector.x;
  const y = vector.y;
  if (flipped) x *= -1;
  const radians = rotation * Math.PI / 180;
  return {
    x: x * Math.cos(radians) - y * Math.sin(radians),
    y: x * Math.sin(radians) + y * Math.cos(radians),
  };
}

function localToWorld(point, placement) {
  const transformed = transformLocalPoint(point, placement.rotation, placement.flipped, currentBoardScale());
  return { x: transformed.x + placement.x, y: transformed.y + placement.y };
}

function touchesAnyNonTargetCard(candidate, targetPlacementId) {
  const movingPolygon = cardWorldPolygon(candidate);
  const movingElements = activeElementPolygons(candidate);
  return game.placements.some((placement) => {
    if (placement.id === targetPlacementId) return false;
    if (dotsCoveredByPolygon(movingPolygon, placement)) return true;
    if (activeElementsOverlap(movingElements, placement)) return true;
    const cardOverlapArea = polygonArea(convexPolygonIntersection(movingPolygon, cardWorldPolygon(placement)));
    return cardOverlapArea > NON_TARGET_OVERLAP_TOLERANCE;
  });
}

function targetElementIsAvailable(targetPlacement, targetDefinition) {
  const placementIndex = game.placements.findIndex((placement) => placement.id === targetPlacement.id);
  if (placementIndex < 0) return false;
  const targetPolygon = geometryPoints(targetDefinition.geometry).map((point) => localToWorld(point, targetPlacement));
  return game.placements
    .slice(placementIndex + 1)
    .every((laterPlacement) => (
      polygonArea(convexPolygonIntersection(targetPolygon, cardWorldPolygon(laterPlacement))) <= NON_TARGET_OVERLAP_TOLERANCE
    ));
}

function targetOverlapStaysInsideElement(candidate, targetPlacement, targetElementPolygon) {
  const overlap = convexPolygonIntersection(cardWorldPolygon(candidate), cardWorldPolygon(targetPlacement));
  const overlapArea = polygonArea(overlap);
  if (overlapArea < 0.01) return false;
  const targetArea = polygonArea(targetElementPolygon);
  return overlapArea <= targetArea + TARGET_OVERLAP_TOLERANCE;
}

function dotsCoveredByPolygon(polygon, placement) {
  return elementDefinitions.some((definition) => {
    const element = getCardElement(placement.card, definition.id);
    if (!element.enabled || element.dots <= 0) return false;
    return dotsForDefinition(definition, element.dots).some((dot) => pointInConvexPolygon(localToWorld(dot, placement), polygon));
  });
}

function activeElementsOverlap(movingElements, placement) {
  return activeElementPolygons(placement).some((targetPolygon) => (
    movingElements.some((movingPolygon) => (
      polygonArea(convexPolygonIntersection(movingPolygon, targetPolygon)) > ELEMENT_OVERLAP_TOLERANCE
    ))
  ));
}

function activeElementPolygons(placement) {
  return elementDefinitions
    .filter((definition) => {
      const element = getCardElement(placement.card, definition.id);
      return placement.card.id === "starting-card" || element.enabled;
    })
    .map((definition) => geometryPoints(definition.geometry).map((point) => localToWorld(point, placement)));
}

function cardWorldPolygon(placement) {
  return [
    { x: 0, y: 0 },
    { x: CARD_W, y: 0 },
    { x: CARD_W, y: CARD_H },
    { x: 0, y: CARD_H },
  ].map((point) => localToWorld(point, placement));
}

function polygonsTouchOrOverlap(a, b) {
  return [...polygonAxes(a), ...polygonAxes(b)].every((axis) => {
    const projectedA = projectPolygon(a, axis);
    const projectedB = projectPolygon(b, axis);
    return projectedA.max >= projectedB.min - 0.01 && projectedB.max >= projectedA.min - 0.01;
  });
}

function polygonAxes(points) {
  return points.map((point, index) => {
    const next = points[(index + 1) % points.length];
    return normalizeVector({ x: -(next.y - point.y), y: next.x - point.x });
  });
}

function projectPolygon(points, axis) {
  const values = points.map((point) => dot(point, axis));
  return { min: Math.min(...values), max: Math.max(...values) };
}

function convexPolygonIntersection(subjectPolygon, clipPolygon) {
  let output = subjectPolygon;
  const clipOrientation = Math.sign(polygonSignedArea(clipPolygon)) || 1;

  for (let i = 0; i < clipPolygon.length; i += 1) {
    const clipStart = clipPolygon[i];
    const clipEnd = clipPolygon[(i + 1) % clipPolygon.length];
    const input = output;
    output = [];
    if (input.length === 0) break;

    for (let j = 0; j < input.length; j += 1) {
      const current = input[j];
      const previous = input[(j + input.length - 1) % input.length];
      const currentInside = isInsideClipEdge(current, clipStart, clipEnd, clipOrientation);
      const previousInside = isInsideClipEdge(previous, clipStart, clipEnd, clipOrientation);

      if (currentInside) {
        if (!previousInside) output.push(lineIntersection(previous, current, clipStart, clipEnd));
        output.push(current);
      } else if (previousInside) {
        output.push(lineIntersection(previous, current, clipStart, clipEnd));
      }
    }
  }

  return output.filter(Boolean);
}

function isInsideClipEdge(point, edgeStart, edgeEnd, orientation) {
  return orientation * cross(subtract(edgeEnd, edgeStart), subtract(point, edgeStart)) >= -0.01;
}

function lineIntersection(a, b, c, d) {
  const ab = subtract(b, a);
  const cd = subtract(d, c);
  const denominator = cross(ab, cd);
  if (Math.abs(denominator) < 0.00001) return b;
  const t = cross(subtract(c, a), cd) / denominator;
  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

function pointInConvexPolygon(point, polygon) {
  const orientation = Math.sign(polygonSignedArea(polygon)) || 1;
  return polygon.every((start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    return isInsideClipEdge(point, start, end, orientation);
  });
}

function polygonArea(points) {
  return Math.abs(polygonSignedArea(points));
}

function polygonSignedArea(points) {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }
  return sum / 2;
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function cross(a, b) {
  return a.x * b.y - a.y * b.x;
}

function transformLocalPoint(point, rotation, flipped, scale = 1) {
  let x = point.x - CENTER.x;
  const y = point.y - CENTER.y;
  if (flipped) x *= -1;
  const radians = rotation * Math.PI / 180;
  return {
    x: CENTER.x + scale * (x * Math.cos(radians) - y * Math.sin(radians)),
    y: CENTER.y + scale * (x * Math.sin(radians) + y * Math.cos(radians)),
  };
}

function geometryPoints(geometry) {
  if (geometry.kind === "poly") return geometry.points.map(([x, y]) => ({ x, y }));
  const { x, y, w, h } = geometry;
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ];
}

function samePointSet(aPoints, bPoints) {
  if (aPoints.length !== bPoints.length) return false;
  return aPoints.every((aPoint) => bPoints.some((bPoint) => distance(aPoint, bPoint) < 0.01));
}

function pointsCenter(points) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeVector(vector) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function rectElement(id, type, shape, variant, position, x, y, w, h) {
  return { id, type, shape, variant, position, geometry: { kind: "rect", x, y, w, h } };
}

function polyElement(id, type, shape, variant, position, points) {
  return { id, type, shape, variant, position, geometry: { kind: "poly", points } };
}

function drawShape(definition, enabled, hasDots = false) {
  const shape = createGeometryElement(definition.geometry);
  shape.classList.add("shape-fill");
  if (!enabled) shape.classList.add("is-empty");
  if (hasDots) shape.classList.add("has-dots");
  return shape;
}

function drawHitShape(definition, { selected: isSelected = false, compatible = false, blocked = false, onClick }) {
  const hit = createGeometryElement(definition.geometry);
  hit.classList.add("hit-shape");
  if (isSelected) hit.classList.add("is-selected");
  if (compatible) hit.classList.add("is-compatible");
  if (blocked) hit.classList.add("is-blocked");
  hit.setAttribute("role", "button");
  hit.setAttribute("tabindex", "0");
  hit.setAttribute("aria-label", labels[definition.id]);
  hit.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return hit;
}

function createGeometryElement(geometry) {
  const shape = createSvg(geometry.kind === "rect" ? "rect" : "polygon");
  if (geometry.kind === "rect") {
    shape.setAttribute("x", geometry.x);
    shape.setAttribute("y", geometry.y);
    shape.setAttribute("width", geometry.w);
    shape.setAttribute("height", geometry.h);
  } else {
    shape.setAttribute("points", geometry.points.map(([x, y]) => `${x},${y}`).join(" "));
  }
  return shape;
}

function dotsForDefinition(definition, count) {
  if (definition.geometry.kind === "poly") {
    return centeredDotGroup(triangleCentroid(definition.geometry.points), count);
  }
  return rectangleDotLine(boundingBox(definition.geometry), count);
}

function triangleCentroid(points) {
  return {
    x: points.reduce((sum, [x]) => sum + x, 0) / points.length,
    y: points.reduce((sum, [, y]) => sum + y, 0) / points.length,
  };
}

function centeredDotGroup(center, count) {
  const spacing = 22;
  const start = -((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => ({ x: center.x + start + index * spacing, y: center.y }));
}

function rectangleDotLine(box, count) {
  const horizontal = box.w >= box.h;
  return Array.from({ length: count }, (_, index) => {
    const progress = (index + 1) / (count + 1);
    return horizontal
      ? { x: box.x + box.w * progress, y: box.y + box.h / 2 }
      : { x: box.x + box.w / 2, y: box.y + box.h * progress };
  });
}

function boundingBox(geometry) {
  if (geometry.kind === "rect") return geometry;
  const xs = geometry.points.map(([x]) => x);
  const ys = geometry.points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX,
    h: Math.max(...ys) - minY,
  };
}

function drawCenter(group, card, flipped) {
  if (card.id === "starting-card") {
    const center = createSvg("rect");
    center.classList.add("center-suit");
    center.setAttribute("x", "90");
    center.setAttribute("y", "150");
    center.setAttribute("width", "60");
    center.setAttribute("height", "60");
    center.setAttribute("rx", "8");
    group.append(center);
  } else {
    const center = createSvg(card.suit === "circle" ? "circle" : card.suit === "square" ? "rect" : "polygon");
    center.classList.add("center-suit");
    if (card.suit === "circle") {
      center.setAttribute("cx", CENTER.x);
      center.setAttribute("cy", CENTER.y);
      center.setAttribute("r", "31");
    } else if (card.suit === "square") {
      center.setAttribute("x", CENTER.x - 31);
      center.setAttribute("y", CENTER.y - 31);
      center.setAttribute("width", "62");
      center.setAttribute("height", "62");
      center.setAttribute("rx", "8");
    } else {
      center.setAttribute("points", `${CENTER.x},${CENTER.y - 38} ${CENTER.x + 38},${CENTER.y + 31} ${CENTER.x - 38},${CENTER.y + 31}`);
    }
    group.append(center);
  }

  const label = createSvg("text");
  label.classList.add("center-value");
  label.setAttribute("x", CENTER.x);
  label.setAttribute("y", CENTER.y + 1);
  if (flipped) {
    label.setAttribute("transform", `translate(${CENTER.x} ${CENTER.y}) scale(-1 1) translate(${-CENTER.x} ${-CENTER.y})`);
  }
  label.textContent = String(card.value);
  group.append(label);
}

function cardTransform(flipped) {
  return [
    `translate(${CENTER.x} ${CENTER.y})`,
    flipped ? "scale(-1 1)" : "",
    `translate(${-CENTER.x} ${-CENTER.y})`,
  ].filter(Boolean).join(" ");
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function suitLabel(suitId) {
  return baseCardSet.suits.find((suit) => suit.id === suitId)?.label || suitId;
}

function centerBoard() {
  // Wait for the newly shown board layout before calculating its viewport center.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const wrap = document.querySelector(".board-wrap");
    if (!wrap) return;
    const left = BOARD_CENTER.x - wrap.clientWidth / 2;
    const top = BOARD_CENTER.y - wrap.clientHeight / 2;
    wrap.scrollTo({ left, top, behavior: "auto" });
  }));
}

function centerBoardOnPlacement(placement) {
  requestAnimationFrame(() => {
    const wrap = document.querySelector(".board-wrap");
    const center = localToWorld(CENTER, placement);
    wrap.scrollLeft = center.x - wrap.clientWidth / 2;
    wrap.scrollTop = center.y - wrap.clientHeight / 2;
  });
}

function createSvg(tagName) {
  return document.createElementNS(SVG_NS, tagName);
}

registerServiceWorker();

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .catch(() => {});
  });
}
