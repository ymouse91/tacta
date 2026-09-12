const CARD_W = 120;
const CARD_H = 180;
const BOARD_SCALE = 1.35;
const SVG_NS = "http://www.w3.org/2000/svg";

const COLORS = {
  start: "#f3f3f3",
  blue: "#66c9ff",
  green: "#71d43d",
  orange: "#ffad2e",
  pink: "#ff3dac",
  purple: "#9a80ff",
  red: "#ff4242",
};

const STANDARD = {
  square: { w: 58, h: 65 },
  longRectH: { w: 120, h: 35 },
  longRectV: { w: 35, h: 120 },
  fullRectV: { w: 35, h: 180 },
  triangleTop: [[28, 0], [60, 42], [92, 0]],
  triangleBottom: [[28, 180], [60, 138], [92, 180]],
  triangleRight: [[120, 58], [78, 90], [120, 122]],
  triangleLeft: [[0, 58], [42, 90], [0, 122]],
  cornerTriangleTopRight: [[78, 0], [120, 0], [120, 42]],
  cornerTriangleBottomRight: [[120, 138], [120, 180], [78, 180]],
  cornerTriangleBottomLeft: [[0, 138], [42, 180], [0, 180]],
  cornerTriangleTopLeft: [[0, 0], [42, 0], [0, 42]],
};

const cardDefinitions = [
  {
    id: "starting-card",
    type: "starting",
    label: "Aloituskortti",
    value: "X",
    color: COLORS.start,
    lines: [
      "M58 0 V65 H0",
      "M62 65 H120 V0",
      "M120 115 H62 V180",
      "M58 180 V115 H0",
      "M0 0 L42 0 L0 42",
      "M78 0 L120 0 L120 42",
      "M120 138 L120 180 L78 180",
      "M0 138 L42 180 L0 180",
      "M28 0 L60 42 L92 0",
      "M120 58 L78 90 L120 122",
      "M92 180 L60 138 L28 180",
      "M0 58 L42 90 L0 122",
      "M0 30 H35 V150 H0",
      "M120 30 H85 V150 H120",
      "M0 35 H120",
      "M0 145 H120",
    ],
    ports: [
      rectPort("top-left-square", "square", "corner-square", 0, 0, 58, 65),
      rectPort("top-right-square", "square", "corner-square", 62, 0, 58, 65),
      rectPort("bottom-right-square", "square", "corner-square", 62, 115, 58, 65),
      rectPort("bottom-left-square", "square", "corner-square", 0, 115, 58, 65),
      triPort("top-left-corner-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleTopLeft),
      triPort("top-right-corner-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleTopRight),
      triPort("bottom-right-corner-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleBottomRight),
      triPort("bottom-left-corner-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleBottomLeft),
      triPort("top-edge-triangle", "triangle", "edge-triangle", ...STANDARD.triangleTop),
      triPort("right-edge-triangle", "triangle", "edge-triangle", ...STANDARD.triangleRight),
      triPort("bottom-edge-triangle", "triangle", "edge-triangle", ...STANDARD.triangleBottom),
      triPort("left-edge-triangle", "triangle", "edge-triangle", ...STANDARD.triangleLeft),
      rectPort("left-long-rectangle", "rectangle", "long", 0, 30, 35, 120),
      rectPort("right-long-rectangle", "rectangle", "long", 85, 30, 35, 120),
      rectPort("top-left-short-rectangle", "rectangle", "short", 0, 0, 120, 35),
      rectPort("top-right-short-rectangle", "rectangle", "short", 0, 0, 120, 35),
      rectPort("bottom-left-short-rectangle", "rectangle", "short", 0, 145, 120, 35),
      rectPort("bottom-right-short-rectangle", "rectangle", "short", 0, 145, 120, 35),
    ],
  },
  {
    id: "card-1",
    value: 1,
    color: COLORS.blue,
    lines: ["M58 0 L58 65 L0 65", "M120 58 L78 90 L120 122", "M0 145 L120 145"],
    ports: [
      rectPort("top-left-square", "square", "corner-square", 0, 0, 58, 65),
      triPort("right-triangle", "triangle", "edge-triangle", ...STANDARD.triangleRight, [{ x: 99, y: 90 }]),
      rectPort("bottom-rectangle", "rectangle", "long", 0, 145, 120, 35),
    ],
  },
  {
    id: "card-2",
    value: 2,
    color: COLORS.green,
    lines: ["M58 0 L58 65 L0 65", "M120 58 L78 90 L120 122", "M0 145 L120 145"],
    ports: [
      rectPort("top-left-square", "square", "corner-square", 0, 0, 58, 65, [{ x: 17, y: 17 }, { x: 43, y: 49 }]),
      triPort("right-triangle", "triangle", "edge-triangle", ...STANDARD.triangleRight),
      rectPort("bottom-rectangle", "rectangle", "long", 0, 145, 120, 35),
    ],
  },
  {
    id: "card-3",
    value: 3,
    color: COLORS.orange,
    lines: ["M0 30 L35 30 L35 150 L0 150", "M78 0 L120 42", "M28 180 L60 138 L92 180"],
    ports: [
      rectPort("left-rectangle", "rectangle", "long", 0, 30, 35, 120, [{ x: 17, y: 58 }, { x: 17, y: 90 }, { x: 17, y: 122 }]),
      triPort("top-right-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleTopRight),
      triPort("bottom-triangle", "triangle", "edge-triangle", ...STANDARD.triangleBottom),
    ],
  },
  {
    id: "card-4",
    value: 4,
    color: COLORS.pink,
    lines: ["M35 0 L35 180", "M78 0 L120 42", "M120 138 L78 180"],
    ports: [
      rectPort("left-rectangle", "rectangle", "long", 0, 0, 35, 180, [{ x: 14, y: 37 }, { x: 14, y: 68 }, { x: 14, y: 104 }, { x: 14, y: 139 }]),
      triPort("top-right-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleTopRight),
      triPort("bottom-right-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleBottomRight),
    ],
  },
  {
    id: "card-5",
    value: 5,
    color: COLORS.purple,
    lines: ["M0 30 L35 30 L35 150 L0 150", "M28 0 L60 42 L92 0", "M78 180 L120 138 L120 180"],
    ports: [
      rectPort("left-rectangle", "rectangle", "long", 0, 30, 35, 120, [{ x: 17, y: 58 }, { x: 17, y: 90 }, { x: 17, y: 122 }]),
      triPort("top-triangle", "triangle", "edge-triangle", ...STANDARD.triangleTop, [{ x: 60, y: 22 }]),
      triPort("bottom-right-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleBottomRight, [{ x: 102, y: 154 }]),
    ],
  },
  {
    id: "card-6",
    value: 6,
    color: COLORS.red,
    lines: ["M35 0 L35 180", "M62 0 L62 65 L120 65", "M78 180 L120 138"],
    ports: [
      rectPort("left-rectangle", "rectangle", "long", 0, 0, 35, 180, [{ x: 14, y: 37 }, { x: 14, y: 68 }, { x: 14, y: 104 }, { x: 14, y: 139 }]),
      rectPort("top-right-square", "square", "corner-square", 62, 0, 58, 65, [{ x: 84, y: 36 }, { x: 105, y: 16 }]),
      triPort("bottom-right-triangle", "triangle", "corner-triangle", ...STANDARD.cornerTriangleBottomRight),
    ],
  },
];

let selected = { cardId: null, portId: null, rotation: 0, flipped: false };
let placedCards = [];
let nextInstanceId = 1;

const hand = document.querySelector("#hand-cards");
const board = document.querySelector("#board");
const statusEl = document.querySelector("#selected-status");

document.querySelector("#flip-card").addEventListener("click", () => {
  selected.flipped = !selected.flipped;
  renderAll();
});

document.querySelector("#rotate-left").addEventListener("click", () => {
  selected.rotation = normalizeRotation(selected.rotation - 90);
  renderAll();
});

document.querySelector("#rotate-right").addEventListener("click", () => {
  selected.rotation = normalizeRotation(selected.rotation + 90);
  renderAll();
});

document.querySelector("#place-center").addEventListener("click", () => {
  if (!selected.cardId) return;
  placedCards.push({
    instanceId: `card-${nextInstanceId++}`,
    definitionId: selected.cardId,
    x: 820,
    y: 480,
    rotation: selected.rotation,
    flipped: selected.flipped,
  });
  renderAll();
});

document.querySelector("#clear-board").addEventListener("click", () => {
  placedCards = [];
  nextInstanceId = 1;
  seedBoard();
  renderAll();
});

seedBoard();
renderAll();

function seedBoard() {
  placedCards.push({
    instanceId: `start-${nextInstanceId++}`,
    definitionId: "starting-card",
    x: 820,
    y: 455,
    rotation: 0,
    flipped: false,
  });
}

function renderAll() {
  renderHand();
  renderBoard();
  updateStatus();
}

function renderHand() {
  hand.replaceChildren();
  for (const card of cardDefinitions.filter((definition) => definition.type !== "starting")) {
    const wrapper = document.createElement("article");
    wrapper.className = "hand-card";
    const label = document.createElement("strong");
    label.textContent = `Kortti ${card.value}`;
    wrapper.append(label);
    wrapper.append(renderCard(card, {
      rotation: selected.cardId === card.id ? selected.rotation : 0,
      flipped: selected.cardId === card.id ? selected.flipped : false,
      source: "hand",
      instanceId: card.id,
    }));
    hand.append(wrapper);
  }
}

function renderBoard() {
  [...board.querySelectorAll(".placed-card")].forEach((el) => el.remove());
  for (const placed of placedCards) {
    const card = getCard(placed.definitionId);
    const wrapper = document.createElement("div");
    wrapper.className = `placed-card ${card.type === "starting" ? "is-starting" : ""}`;
    wrapper.style.left = `${placed.x}px`;
    wrapper.style.top = `${placed.y}px`;
    wrapper.style.width = `${CARD_W * BOARD_SCALE}px`;
    wrapper.style.height = `${CARD_H * BOARD_SCALE}px`;
    wrapper.append(renderCard(card, {
      rotation: placed.rotation,
      flipped: placed.flipped,
      source: "board",
      instanceId: placed.instanceId,
    }));
    board.append(wrapper);
  }
}

function renderCard(card, options) {
  const svg = createSvg("svg");
  svg.classList.add("card-svg");
  svg.setAttribute("viewBox", "-8 -8 136 196");
  svg.setAttribute("aria-label", card.label || `Kortti ${card.value}`);

  const group = createSvg("g");
  group.setAttribute("transform", cardTransform(options.rotation, options.flipped));
  svg.append(group);

  const shell = createSvg("rect");
  shell.classList.add("card-shell");
  shell.setAttribute("x", "0");
  shell.setAttribute("y", "0");
  shell.setAttribute("width", CARD_W);
  shell.setAttribute("height", CARD_H);
  shell.setAttribute("rx", "6");
  shell.setAttribute("stroke", card.color);
  group.append(shell);

  for (const path of card.lines) {
    const line = createSvg("path");
    line.classList.add("shape-line");
    line.setAttribute("d", path);
    line.setAttribute("stroke", card.color);
    group.append(line);
  }

  for (const port of card.ports) drawDots(group, port);

  const center = createSvg(card.type === "starting" ? "rect" : "circle");
  if (card.type === "starting") {
    center.setAttribute("x", "44");
    center.setAttribute("y", "72");
    center.setAttribute("width", "32");
    center.setAttribute("height", "32");
    center.setAttribute("rx", "5");
  } else {
    center.setAttribute("cx", CARD_W / 2);
    center.setAttribute("cy", CARD_H / 2);
    center.setAttribute("r", "15");
  }
  center.setAttribute("fill", card.color);
  group.append(center);

  const value = createSvg("text");
  value.classList.add("card-label");
  value.setAttribute("x", CARD_W / 2);
  value.setAttribute("y", CARD_H / 2 + 1);
  value.textContent = card.value;
  group.append(value);

  for (const port of card.ports) {
    const hit = createSvg(port.kind === "rect" ? "rect" : "polygon");
    hit.classList.add("port-hit");
    if (selected.portId === port.id && selected.cardId === card.id && options.source === "hand") {
      hit.classList.add("is-selected");
    }
    if (selected.portId && options.source === "board") {
      const selectedPort = getPort(getCard(selected.cardId), selected.portId);
      hit.classList.add(canPortsConnect(selectedPort, port) ? "is-targetable" : "is-blocked");
    }
    if (port.kind === "rect") {
      hit.setAttribute("x", port.x);
      hit.setAttribute("y", port.y);
      hit.setAttribute("width", port.w);
      hit.setAttribute("height", port.h);
    } else {
      hit.setAttribute("points", port.points.map((p) => `${p.x},${p.y}`).join(" "));
    }
    hit.setAttribute("data-card-id", card.id);
    hit.setAttribute("data-port-id", port.id);
    hit.setAttribute("data-shape", port.shape);
    hit.setAttribute("data-variant", port.variant);
    hit.setAttribute("tabindex", "0");
    hit.setAttribute("role", "button");
    hit.setAttribute("aria-label", `${options.source === "hand" ? "Valitse" : "Kohdista"} ${card.label || `kortti ${card.value}`}, ${shapeName(port)}`);
    hit.addEventListener("click", (event) => {
      event.stopPropagation();
      if (options.source === "hand") {
        selected.cardId = card.id;
        selected.portId = port.id;
        renderAll();
      } else {
        placeSelectedOnBoardPort(options.instanceId, port.id);
      }
    });
    hit.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      hit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    group.append(hit);
  }
  return svg;
}

function placeSelectedOnBoardPort(targetInstanceId, targetPortId) {
  if (!selected.cardId || !selected.portId) return;

  const movingCard = getCard(selected.cardId);
  const ownPort = getPort(movingCard, selected.portId);
  const targetPlaced = placedCards.find((card) => card.instanceId === targetInstanceId);
  const targetCard = getCard(targetPlaced.definitionId);
  const targetPort = getPort(targetCard, targetPortId);

  if (!canPortsConnect(ownPort, targetPort)) {
    statusEl.textContent = "Muoto ei täsmää";
    return;
  }

  const ownCenter = transformPoint(portCenter(ownPort), selected.rotation, selected.flipped);
  const targetCenter = transformPoint(portCenter(targetPort), targetPlaced.rotation, targetPlaced.flipped);
  placedCards.push({
    instanceId: `card-${nextInstanceId++}`,
    definitionId: selected.cardId,
    x: targetPlaced.x + targetCenter.x * BOARD_SCALE - ownCenter.x * BOARD_SCALE,
    y: targetPlaced.y + targetCenter.y * BOARD_SCALE - ownCenter.y * BOARD_SCALE,
    rotation: selected.rotation,
    flipped: selected.flipped,
    attachedTo: { cardId: targetInstanceId, portId: targetPortId, ownPortId: selected.portId },
  });
  renderAll();
}

function canPortsConnect(a, b) {
  return a.shape === b.shape;
}

function drawDots(group, port) {
  for (const dot of port.dots || []) {
    const element = createSvg("circle");
    element.classList.add("dot");
    element.setAttribute("cx", dot.x);
    element.setAttribute("cy", dot.y);
    element.setAttribute("r", "3.5");
    group.append(element);
  }
}

function cardTransform(rotation, flipped) {
  return [
    `translate(${CARD_W / 2} ${CARD_H / 2})`,
    flipped ? "scale(-1 1)" : "",
    `rotate(${rotation})`,
    `translate(${-CARD_W / 2} ${-CARD_H / 2})`,
  ].filter(Boolean).join(" ");
}

function transformPoint(point, rotation, flipped) {
  let x = point.x - CARD_W / 2;
  let y = point.y - CARD_H / 2;
  if (flipped) x *= -1;
  const radians = rotation * Math.PI / 180;
  const rotatedX = x * Math.cos(radians) - y * Math.sin(radians);
  const rotatedY = x * Math.sin(radians) + y * Math.cos(radians);
  return { x: rotatedX + CARD_W / 2, y: rotatedY + CARD_H / 2 };
}

function rectPort(id, shape, variant, x, y, w, h, dots = []) {
  return { id, shape, variant, x, y, w, h, dots, kind: "rect" };
}

function triPort(id, shape, variant, p1, p2, p3, dots = []) {
  return {
    id,
    shape,
    variant,
    dots,
    kind: "poly",
    points: [
      { x: p1[0], y: p1[1] },
      { x: p2[0], y: p2[1] },
      { x: p3[0], y: p3[1] },
    ],
  };
}

function portCenter(port) {
  if (port.kind === "rect") return { x: port.x + port.w / 2, y: port.y + port.h / 2 };
  return {
    x: port.points.reduce((sum, point) => sum + point.x, 0) / port.points.length,
    y: port.points.reduce((sum, point) => sum + point.y, 0) / port.points.length,
  };
}

function getCard(cardId) {
  return cardDefinitions.find((card) => card.id === cardId);
}

function getPort(card, portId) {
  return card.ports.find((port) => port.id === portId);
}

function normalizeRotation(rotation) {
  return ((rotation % 360) + 360) % 360;
}

function createSvg(tagName) {
  return document.createElementNS(SVG_NS, tagName);
}

function updateStatus() {
  if (!selected.cardId || !selected.portId) {
    statusEl.textContent = "Valitse kuvio";
    return;
  }
  const card = getCard(selected.cardId);
  const port = getPort(card, selected.portId);
  const side = selected.flipped ? "peilattu" : "etupuoli";
  statusEl.textContent = `Kortti ${card.value}, ${shapeName(port)}, ${side}, ${selected.rotation} astetta`;
}

function shapeName(port) {
  if (port.shape === "triangle") return port.variant === "corner-triangle" ? "kulmakolmio" : "kylkikolmio";
  if (port.shape === "square") return "neliö";
  if (port.variant === "long") return "pitkä nelikulmio";
  return "lyhyt nelikulmio";
}
