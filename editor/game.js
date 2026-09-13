const SVG_NS = "http://www.w3.org/2000/svg";
const STORAGE_KEY = "tacta-card-structure-editor-v1";
const CARD_W = 240;
const CARD_H = 360;
const MAX_CARD_DOTS = 6;
const CORNER_SQUARE_SIZE = CARD_W / 2;
const EDGE_THICKNESS = CORNER_SQUARE_SIZE / 2;
const TRIANGLE_LEG = EDGE_THICKNESS * Math.SQRT2;
const EDGE_TRIANGLE_BASE = CORNER_SQUARE_SIZE;

const suits = [
  { id: "circle", label: "Ympyrä", symbol: "C", color: "#78b7ff" },
  { id: "square", label: "Neliö", symbol: "S", color: "#61d394" },
  { id: "triangle", label: "Kolmio", symbol: "T", color: "#ffcf5a" },
];

const elementDefinitions = [
  {
    id: "square-top-left",
    type: "cornerSquare",
    group: "Neliöt",
    label: "Ylävasen neliö",
    shape: "square",
    position: "top-left",
    geometry: { kind: "rect", x: 0, y: 0, w: 120, h: 120 },
  },
  {
    id: "square-top-right",
    type: "cornerSquare",
    group: "Neliöt",
    label: "Yläoikea neliö",
    shape: "square",
    position: "top-right",
    geometry: { kind: "rect", x: 120, y: 0, w: 120, h: 120 },
  },
  {
    id: "square-bottom-right",
    type: "cornerSquare",
    group: "Neliöt",
    label: "Alaoikea neliö",
    shape: "square",
    position: "bottom-right",
    geometry: { kind: "rect", x: 120, y: 240, w: 120, h: 120 },
  },
  {
    id: "square-bottom-left",
    type: "cornerSquare",
    group: "Neliöt",
    label: "Alavasen neliö",
    shape: "square",
    position: "bottom-left",
    geometry: { kind: "rect", x: 0, y: 240, w: 120, h: 120 },
  },
  {
    id: "rect-left-long",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Vasen pitkä nelikulmio",
    shape: "rectangle",
    variant: "long",
    position: "left",
    geometry: { kind: "rect", x: 0, y: 0, w: 60, h: 360 },
  },
  {
    id: "rect-right-long",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Oikea pitkä nelikulmio",
    shape: "rectangle",
    variant: "long",
    position: "right",
    geometry: { kind: "rect", x: 180, y: 0, w: 60, h: 360 },
  },
  {
    id: "rect-left-short",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Vasen lyhyt nelikulmio",
    shape: "rectangle",
    variant: "short",
    position: "left",
    geometry: { kind: "rect", x: 0, y: 60, w: 60, h: 240 },
  },
  {
    id: "rect-right-short",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Oikea lyhyt nelikulmio",
    shape: "rectangle",
    variant: "short",
    position: "right",
    geometry: { kind: "rect", x: 180, y: 60, w: 60, h: 240 },
  },
  {
    id: "rect-top-short",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Yläreunan lyhyt nelikulmio",
    shape: "rectangle",
    variant: "short",
    position: "top",
    geometry: { kind: "rect", x: 0, y: 0, w: 240, h: 60 },
  },
  {
    id: "rect-bottom-short",
    type: "edgeRectangle",
    group: "Nelikulmiot",
    label: "Alareunan lyhyt nelikulmio",
    shape: "rectangle",
    variant: "short",
    position: "bottom",
    geometry: { kind: "rect", x: 0, y: 300, w: 240, h: 60 },
  },
  {
    id: "triangle-corner-top-left",
    type: "cornerTriangle",
    group: "Kolmiot",
    label: "Ylävasen kulmakolmio",
    shape: "triangle",
    variant: "corner",
    position: "top-left",
    geometry: { kind: "poly", points: [[0, 0], [TRIANGLE_LEG, 0], [0, TRIANGLE_LEG]] },
  },
  {
    id: "triangle-corner-top-right",
    type: "cornerTriangle",
    group: "Kolmiot",
    label: "Yläoikea kulmakolmio",
    shape: "triangle",
    variant: "corner",
    position: "top-right",
    geometry: { kind: "poly", points: [[CARD_W - TRIANGLE_LEG, 0], [CARD_W, 0], [CARD_W, TRIANGLE_LEG]] },
  },
  {
    id: "triangle-corner-bottom-right",
    type: "cornerTriangle",
    group: "Kolmiot",
    label: "Alaoikea kulmakolmio",
    shape: "triangle",
    variant: "corner",
    position: "bottom-right",
    geometry: { kind: "poly", points: [[CARD_W, CARD_H - TRIANGLE_LEG], [CARD_W, CARD_H], [CARD_W - TRIANGLE_LEG, CARD_H]] },
  },
  {
    id: "triangle-corner-bottom-left",
    type: "cornerTriangle",
    group: "Kolmiot",
    label: "Alavasen kulmakolmio",
    shape: "triangle",
    variant: "corner",
    position: "bottom-left",
    geometry: { kind: "poly", points: [[0, CARD_H - TRIANGLE_LEG], [TRIANGLE_LEG, CARD_H], [0, CARD_H]] },
  },
  {
    id: "triangle-edge-top",
    type: "edgeTriangle",
    group: "Kolmiot",
    label: "Yläreunan keskikolmio",
    shape: "triangle",
    variant: "edge",
    position: "top",
    geometry: { kind: "poly", points: [[(CARD_W - EDGE_TRIANGLE_BASE) / 2, 0], [CARD_W / 2, EDGE_THICKNESS], [(CARD_W + EDGE_TRIANGLE_BASE) / 2, 0]] },
  },
  {
    id: "triangle-edge-right",
    type: "edgeTriangle",
    group: "Kolmiot",
    label: "Oikean reunan keskikolmio",
    shape: "triangle",
    variant: "edge",
    position: "right",
    geometry: { kind: "poly", points: [[CARD_W, (CARD_H - EDGE_TRIANGLE_BASE) / 2], [CARD_W - EDGE_THICKNESS, CARD_H / 2], [CARD_W, (CARD_H + EDGE_TRIANGLE_BASE) / 2]] },
  },
  {
    id: "triangle-edge-bottom",
    type: "edgeTriangle",
    group: "Kolmiot",
    label: "Alareunan keskikolmio",
    shape: "triangle",
    variant: "edge",
    position: "bottom",
    geometry: { kind: "poly", points: [[(CARD_W + EDGE_TRIANGLE_BASE) / 2, CARD_H], [CARD_W / 2, CARD_H - EDGE_THICKNESS], [(CARD_W - EDGE_TRIANGLE_BASE) / 2, CARD_H]] },
  },
  {
    id: "triangle-edge-left",
    type: "edgeTriangle",
    group: "Kolmiot",
    label: "Vasemman reunan keskikolmio",
    shape: "triangle",
    variant: "edge",
    position: "left",
    geometry: { kind: "poly", points: [[0, (CARD_H + EDGE_TRIANGLE_BASE) / 2], [EDGE_THICKNESS, CARD_H / 2], [0, (CARD_H - EDGE_TRIANGLE_BASE) / 2]] },
  },
];

let cardSet = loadCardSet();
let selectedCardId = cardSet.cards[0].id;
let previewSide = "front";
let focusedElementId = null;

const cardGrid = document.querySelector("#card-grid");
const elementList = document.querySelector("#element-list");
const preview = document.querySelector("#card-preview");
const jsonOutput = document.querySelector("#json-output");
const selectedSuit = document.querySelector("#selected-suit");
const selectedValue = document.querySelector("#selected-value");
const selectedDots = document.querySelector("#selected-dots");
const selectedElements = document.querySelector("#selected-elements");
const completionCount = document.querySelector("#completion-count");
const previewTitle = document.querySelector("#preview-title");
const saveStatus = document.querySelector("#save-status");

document.querySelector("#front-view").addEventListener("click", () => setPreviewSide("front"));
document.querySelector("#back-view").addEventListener("click", () => setPreviewSide("back"));
document.querySelector("#copy-json").addEventListener("click", copyJson);
document.querySelector("#download-json").addEventListener("click", downloadJson);
document.querySelector("#reset-card").addEventListener("click", resetSelectedCard);
document.querySelector("#reset-all").addEventListener("click", resetAllCards);

renderAll();

function createEmptyCardSet() {
  return {
    schemaVersion: 1,
    kind: "tacta-card-structure-set",
    note: "Color-independent 3 x 6 logical card structures. Card backs are generated by mirroring the front side.",
    suits: suits.map(({ id, label }) => ({ id, label })),
    values: [1, 2, 3, 4, 5, 6],
    elementDefinitions: elementDefinitions.map(({ id, type, shape, variant, position }) => ({
      id,
      type,
      shape,
      variant: variant || null,
      position,
    })),
    cards: suits.flatMap((suit) => [1, 2, 3, 4, 5, 6].map((value) => ({
      id: `${suit.id}-${value}`,
      suit: suit.id,
      value,
      targetDots: value,
      maxDots: MAX_CARD_DOTS,
      sides: {
        front: { mirrorOf: null },
        back: { mirrorOf: "front", transform: "mirror-x" },
      },
      elements: {},
    }))),
  };
}

function loadCardSet() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createEmptyCardSet();
  try {
    return migrateCardSet(JSON.parse(stored));
  } catch {
    return createEmptyCardSet();
  }
}

function migrateCardSet(value) {
  const fresh = createEmptyCardSet();
  if (!value || !Array.isArray(value.cards)) return fresh;
  const cardsById = new Map(value.cards.map((card) => [card.id, card]));
  fresh.cards = fresh.cards.map((card) => {
    const stored = cardsById.get(card.id);
    if (!stored || !stored.elements) return card;
    return {
      ...card,
      elements: normalizeStoredElements(stored.elements, card.value),
    };
  });
  return fresh;
}

function normalizeStoredElements(elements, targetDots) {
  let remaining = targetDots;
  return Object.fromEntries(Object.entries(elements)
    .filter(([id]) => elementDefinitions.some((definition) => definition.id === id))
    .map(([id, element]) => {
      const enabled = Boolean(element.enabled);
      const dots = enabled ? Math.min(clampDots(element.dots), remaining) : 0;
      remaining -= dots;
      return [id, { enabled, dots }];
    }));
}

function renderAll() {
  renderCardGrid();
  renderElementList();
  renderPreview();
  renderMeta();
  renderJson();
  save();
}

function renderCardGrid() {
  cardGrid.replaceChildren();
  for (const card of cardSet.cards) {
    const suit = getSuit(card.suit);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card-choice";
    if (card.id === selectedCardId) button.classList.add("is-active");
    if (totalDots(card) === card.value && totalActiveElements(card) > 0) button.classList.add("is-complete");
    button.innerHTML = `<strong>${suit.symbol}${card.value}</strong><span>${totalDots(card)} / ${card.value} pistetta</span>`;
    button.addEventListener("click", () => {
      selectedCardId = card.id;
      focusedElementId = null;
      renderAll();
    });
    cardGrid.append(button);
  }
}

function renderElementList() {
  const card = getSelectedCard();
  elementList.replaceChildren();

  const zones = [
    { id: "top-left", label: "Ylävasen" },
    { id: "top", label: "Yläreuna" },
    { id: "top-right", label: "Yläoikea" },
    { id: "left", label: "Vasen reuna" },
    { id: "center", label: "Kortin elementit", empty: true },
    { id: "right", label: "Oikea reuna" },
    { id: "bottom-left", label: "Alavasen" },
    { id: "bottom", label: "Alareuna" },
    { id: "bottom-right", label: "Alaoikea" },
  ];

  for (const zone of zones) {
    const zoneElement = document.createElement("section");
    zoneElement.className = "element-zone";
    zoneElement.dataset.zone = zone.id;

    if (zone.empty) {
      zoneElement.classList.add("is-center-zone");
      elementList.append(zoneElement);
      continue;
    }

    const zoneDefinitions = elementDefinitions.filter((definition) => definition.position === zone.id);
    const title = document.createElement("h3");
    title.textContent = zone.label;
    zoneElement.append(title);

    for (const definition of zoneDefinitions) {
      zoneElement.append(renderElementRow(card, definition));
    }

    elementList.append(zoneElement);
  }
}

function renderElementRow(card, definition) {
    const element = getCardElement(card, definition.id);
    const row = document.createElement("article");
    row.className = "element-row";
    if (element.enabled) row.classList.add("is-active");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = element.enabled;
    checkbox.setAttribute("aria-label", `${definition.label} kaytossa`);
    checkbox.addEventListener("change", () => {
      updateElement(definition.id, { enabled: checkbox.checked });
    });
    checkbox.addEventListener("focus", () => setFocusedElement(definition.id));

    const name = document.createElement("div");
    name.className = "element-name";
    name.innerHTML = `<strong>${definition.label}</strong><span>${definition.group} - ${positionLabel(definition)}</span>`;

    const token = document.createElement("div");
    token.className = "shape-token";
    token.textContent = shapeToken(definition);

    const main = document.createElement("div");
    main.className = "element-main";
    main.append(checkbox, name, token);

    const dotRange = document.createElement("input");
    dotRange.type = "range";
    dotRange.min = "0";
    dotRange.max = String(Math.min(4, remainingDotCapacity(card, definition.id) + element.dots));
    dotRange.step = "1";
    dotRange.value = String(element.dots);
    dotRange.disabled = !element.enabled;
    dotRange.addEventListener("input", () => {
      updateElement(definition.id, { enabled: true, dots: Number(dotRange.value) });
    });
    dotRange.addEventListener("focus", () => setFocusedElement(definition.id));

    const output = document.createElement("output");
    output.textContent = `${element.dots} p`;

    const dotControl = document.createElement("label");
    dotControl.className = "dot-control";
    if (totalDots(card) > card.value) dotControl.classList.add("is-over");
    dotControl.append(dotRange, output);

    row.append(main, dotControl);
    row.addEventListener("mouseenter", () => setFocusedElement(definition.id, false));
    row.addEventListener("mouseleave", () => setFocusedElement(null, false));
    return row;
}

function renderPreview() {
  const card = getSelectedCard();
  const suit = getSuit(card.suit);
  preview.replaceChildren();
  preview.style.setProperty("--card-color", suit.color);
  previewTitle.textContent = `${suit.label} ${card.value}`;

  const group = createSvg("g");
  if (previewSide === "back") {
    group.setAttribute("transform", `translate(${CARD_W} 0) scale(-1 1)`);
  }
  preview.append(group);

  const shell = createSvg("rect");
  shell.classList.add("card-shell");
  shell.setAttribute("x", "0");
  shell.setAttribute("y", "0");
  shell.setAttribute("width", CARD_W);
  shell.setAttribute("height", CARD_H);
  shell.setAttribute("rx", "11");
  group.append(shell);

  for (const definition of elementDefinitions) {
    const element = getCardElement(card, definition.id);
    const shape = drawShape(definition, element.enabled);
    if (definition.id === focusedElementId) shape.classList.add("is-focused");
    group.append(shape);
    if (element.enabled && element.dots > 0) {
      for (const dot of dotsForDefinition(definition, element.dots)) {
        const circle = createSvg("circle");
        circle.classList.add("dot");
        circle.setAttribute("cx", dot.x);
        circle.setAttribute("cy", dot.y);
        circle.setAttribute("r", "5.6");
        group.append(circle);
      }
    }
  }

  drawCenter(group, suit, card.value);
}

function renderMeta() {
  const card = getSelectedCard();
  const suit = getSuit(card.suit);
  const dots = totalDots(card);
  selectedSuit.textContent = suit.label;
  selectedValue.textContent = String(card.value);
  selectedDots.textContent = `${dots} / ${card.value}`;
  selectedDots.classList.toggle("is-over", dots > card.value);
  selectedElements.textContent = `${totalActiveElements(card)} / ${elementDefinitions.length}`;
  const complete = cardSet.cards.filter((cardItem) => totalDots(cardItem) === cardItem.value && totalActiveElements(cardItem) > 0).length;
  completionCount.textContent = `${complete} / ${cardSet.cards.length}`;
}

function renderJson() {
  jsonOutput.value = JSON.stringify(cardSet, null, 2);
}

function updateElement(elementId, changes) {
  const card = getSelectedCard();
  const current = getCardElement(card, elementId);
  const maxForElement = Math.min(4, remainingDotCapacity(card, elementId) + current.dots);
  const next = {
    enabled: changes.enabled ?? current.enabled,
    dots: Math.min(clampDots(changes.dots ?? current.dots), maxForElement),
  };
  if (!next.enabled) next.dots = 0;
  if (next.dots > 0) next.enabled = true;
  card.elements[elementId] = next;
  focusedElementId = elementId;
  renderAll();
}

function resetSelectedCard() {
  getSelectedCard().elements = {};
  focusedElementId = null;
  renderAll();
}

function resetAllCards() {
  cardSet = createEmptyCardSet();
  selectedCardId = cardSet.cards[0].id;
  focusedElementId = null;
  renderAll();
}

function setPreviewSide(side) {
  previewSide = side;
  document.querySelector("#front-view").classList.toggle("is-active", side === "front");
  document.querySelector("#back-view").classList.toggle("is-active", side === "back");
  renderPreview();
}

function setFocusedElement(elementId, rerender = true) {
  focusedElementId = elementId;
  if (rerender) renderPreview();
}

async function copyJson() {
  await navigator.clipboard.writeText(jsonOutput.value);
  flashStatus("JSON kopioitu");
}

function downloadJson() {
  const blob = new Blob([jsonOutput.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tacta-card-structures.json";
  link.click();
  URL.revokeObjectURL(url);
  flashStatus("JSON ladattu");
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cardSet));
  saveStatus.textContent = "Tallennettu selaimeen";
}

function flashStatus(text) {
  saveStatus.textContent = text;
  window.setTimeout(() => {
    saveStatus.textContent = "Tallennettu selaimeen";
  }, 1600);
}

function getSelectedCard() {
  return cardSet.cards.find((card) => card.id === selectedCardId);
}

function getSuit(suitId) {
  return suits.find((suit) => suit.id === suitId);
}

function getCardElement(card, elementId) {
  return card.elements[elementId] || { enabled: false, dots: 0 };
}

function totalDots(card) {
  return Object.values(card.elements).reduce((sum, element) => sum + (element.enabled ? element.dots : 0), 0);
}

function totalActiveElements(card) {
  return Object.values(card.elements).filter((element) => element.enabled).length;
}

function remainingDotCapacity(card, currentElementId) {
  const otherDots = Object.entries(card.elements)
    .filter(([elementId]) => elementId !== currentElementId)
    .reduce((sum, [, element]) => sum + (element.enabled ? element.dots : 0), 0);
  return Math.max(0, card.value - otherDots);
}

function clampDots(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(4, Math.round(number)));
}

function drawShape(definition, enabled) {
  const geometry = definition.geometry;
  const shape = createSvg(geometry.kind === "rect" ? "rect" : "polygon");
  shape.classList.add("shape-fill");
  if (!enabled) shape.classList.add("is-empty");
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

function drawCenter(group, suit, value) {
  const center = createSvg(suit.id === "circle" ? "circle" : suit.id === "square" ? "rect" : "polygon");
  center.classList.add("center-suit");
  if (suit.id === "circle") {
    center.setAttribute("cx", CARD_W / 2);
    center.setAttribute("cy", CARD_H / 2);
    center.setAttribute("r", "31");
  } else if (suit.id === "square") {
    center.setAttribute("x", CARD_W / 2 - 31);
    center.setAttribute("y", CARD_H / 2 - 31);
    center.setAttribute("width", "62");
    center.setAttribute("height", "62");
    center.setAttribute("rx", "8");
  } else {
    center.setAttribute("points", `${CARD_W / 2},${CARD_H / 2 - 38} ${CARD_W / 2 + 38},${CARD_H / 2 + 31} ${CARD_W / 2 - 38},${CARD_H / 2 + 31}`);
  }
  group.append(center);

  const label = createSvg("text");
  label.classList.add("center-value");
  label.setAttribute("x", CARD_W / 2);
  label.setAttribute("y", CARD_H / 2 + 1);
  label.textContent = String(value);
  group.append(label);
}

function dotsForDefinition(definition, count) {
  if (definition.geometry.kind === "poly") {
    return centeredDotGroup(triangleCentroid(definition.geometry.points), count, "horizontal");
  }

  const box = boundingBox(definition.geometry);
  return rectangleDotLine(box, count);
}

function triangleCentroid(points) {
  return {
    x: points.reduce((sum, [x]) => sum + x, 0) / points.length,
    y: points.reduce((sum, [, y]) => sum + y, 0) / points.length,
  };
}

function centeredDotGroup(center, count, axis) {
  const spacing = 22;
  const start = -((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => {
    const offset = start + index * spacing;
    return axis === "vertical"
      ? { x: center.x, y: center.y + offset }
      : { x: center.x + offset, y: center.y };
  });
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

function shapeToken(definition) {
  if (definition.shape === "square") return "N";
  if (definition.shape === "rectangle") return definition.variant === "long" ? "P" : "L";
  return definition.variant === "corner" ? "K" : "C";
}

function positionLabel(definition) {
  const labels = {
    "top-left": "ylävasen",
    "top-right": "yläoikea",
    "bottom-right": "alaoikea",
    "bottom-left": "alavasen",
    top: "ylä",
    right: "oikea",
    bottom: "ala",
    left: "vasen",
  };
  return labels[definition.position] || definition.position;
}

function createSvg(tagName) {
  return document.createElementNS(SVG_NS, tagName);
}
