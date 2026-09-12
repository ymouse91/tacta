# TACTA project notes

These notes summarize the design discussion so the project can continue on another computer.

## Current goal

Build a digital prototype for testing TACTA card placement. The next design step is to separate:

- card logic: card definitions, ports, standard shapes, values, dots
- card rendering: SVG/visual appearance
- placement logic: selecting one port from the played card, then one matching port on the board

## Rulebook

The original rulebook is stored at:

```text
rules/TACTA_RULES.pdf
```

Reference crops from page 2 are stored under:

```text
reference/cards/
```

## Deck structure

The full deck has:

- 6 colors
- each color has 18 cards
- those 18 cards are 3 suits x 6 card patterns
- suits are circle, square, and triangle
- the six card patterns are the same for each suit

For game logic, color and suit can be layered on top of the six base card patterns.

Important rule: the number in the center of a normal card is also the number of dots on that card.

## Standard shapes

All matching shapes must be the same size and shape. Orientation may change.

- All squares are one standard size.
- All triangles are the same standard isosceles triangle.
- Rectangles need standard types, such as long and short.

The current prototype still needs cleanup here. We agreed that the next implementation pass should make the logical shape definitions authoritative, and rendering should derive from that logic.

## Six base card patterns

### Card 1

- value: 1
- top-left square: empty
- right edge triangle: dotted, 1 dot
- bottom long rectangle: empty

### Card 2

- value: 2
- top-left square: dotted, 2 dots
- right edge triangle: empty
- bottom long rectangle: empty

### Card 3

- value: 3
- left long rectangle: dotted, 3 dots
- top-right corner triangle: empty
- bottom edge triangle: empty

The left rectangle is the same long rectangle as card 2's bottom rectangle, rotated.

### Card 4

- value: 4
- left full-height long rectangle: dotted, 4 dots
- top-right corner triangle: empty
- bottom-right corner triangle: empty

The left rectangle spans the full card height.

### Card 5

- value: 5
- left long rectangle: dotted, 3 dots
- top edge triangle: dotted, 1 dot
- bottom-right corner triangle: dotted, 1 dot

### Card 6

- value: 6
- left full-height long rectangle: dotted, 4 dots
- top-right square: dotted, 2 dots
- bottom-right corner triangle: empty

## Starting card

The starting card is special:

- no owner
- no color
- no suit
- no scoring value
- all ports are empty targets

Its purpose is to provide the target variations needed for placing the normal cards.

Current agreed structure:

- 4 squares in the corners
- 8 triangles total
  - 4 corner triangles
  - 4 side/edge triangles
- 6 rectangles/quadrilaterals
  - 4 short rectangles
  - 2 long rectangles

All of these must use the same standard shape sizes as the normal cards.

## Current prototype

Files:

- `index.html`
- `styles.css`
- `game.js`
- `manifest.webmanifest`

Run locally:

```sh
python3 -m http.server 5173
```

Open:

```text
http://localhost:5173/index.html
```

The current prototype is useful as a test surface, but the next pass should refactor it so that card logic and visual rendering are separate.

## Next step

Refactor into separate modules, for example:

```text
src/cards.js       # logical card definitions
src/shapes.js      # standard shape geometry
src/renderCard.js  # SVG rendering from logical data
src/placement.js   # port matching and placement calculation
```

After that, rebuild the test page from the logical definitions rather than manually drawn SVG-like data.
