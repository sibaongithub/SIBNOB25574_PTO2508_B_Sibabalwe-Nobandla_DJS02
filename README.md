# DJS02 – Web Component: Podcast Preview

## Overview
This project turns the podcast preview into a reusable **Web Component** called
`<podcast-preview>`. It's built with native JavaScript (no frameworks), uses the
**Shadow DOM** so its styles stay encapsulated, and stays **stateless** — it only
shows the data the parent gives it. When a card is clicked it fires a custom
event so the parent app can open a modal, without the component knowing how the
modal works.

The genre and sort dropdowns from the previous project are kept and still work.

---

## What It Does
- Shows a grid of podcast previews, each one a `<podcast-preview>` component.
- Each preview shows the cover (grey placeholder), title, number of seasons,
  genre names, and the last updated date.
- Clicking a preview opens a modal with the full details: description, genres,
  last updated date, and the list of seasons with episode counts.
- The modal closes with the **×** button, clicking outside it, or the **Escape** key.
- **Filter by genre** and **sort** (Recently Updated, Most Popular, Newest) both work.

---

## Project Structure
```
DJS02/
├── index.html              the demo page
├── styles.css              styles for the demo page (the component styles itself)
└── src/
    ├── index.js            starts the app (wiring + first render)
    ├── data.js             the podcast data
    ├── utils.js            small shared helpers (genre names, dates, seasons)
    ├── components/
    │   ├── PodcastPreview.js   the Web Component
    │   └── createModal.js      opens/closes the detail modal
    └── views/
        ├── createGrid.js       renders the <podcast-preview> components
        └── createFilters.js    the genre + sort dropdowns
```

---

## How to Run
Because it uses ES modules, it needs to be served (not opened by double-clicking).

1. Keep the files in the structure above.
2. In VS Code, right-click `index.html` (inside the `DJS02` folder) →
   **Open with Live Server**.

> If the grid is empty, open the browser Console (right-click → Inspect → Console).
> A 404 on `src/index.js` means the `src/` folder isn't sitting next to
> `index.html` in the folder being served.

---

## How to Register the Component
The component registers itself at the bottom of `PodcastPreview.js`:

```js
customElements.define("podcast-preview", PodcastPreview);
```

So you just import the file once and the `<podcast-preview>` tag is available:

```js
import "./components/PodcastPreview.js";
```

---

## How to Pass Data
**With the `.data` property (used in this project):**
```js
const card = document.createElement("podcast-preview");
card.data = {
  id: "10716",
  title: "Something Was Wrong",
  seasons: 14,
  genres: ["Personal Growth", "Investigative Journalism"], // names, not ids
  updated: "2022-11-03T07:00:00.000Z",
  image: "https://..."   // optional – falls back to a grey placeholder
};
document.body.appendChild(card);
```

**Or with attributes in HTML:**
```html
<podcast-preview
  podcast-id="10716"
  title="Something Was Wrong"
  seasons="14"
  genres="Personal Growth,Investigative Journalism"
  updated="2022-11-03T07:00:00.000Z">
</podcast-preview>
```

> The component takes genre **names**. In `createGrid.js` the genre ids from
> `data.js` are turned into names before being passed in, which keeps the
> component simple and stateless.

---

## How to Listen for Interaction Events
When a card is clicked (or Enter/Space is pressed on it), it fires a
**`podcast-selected`** event. It bubbles and is `composed`, so it crosses the
Shadow DOM and you can listen for it on a parent. The `detail` carries the `id`:

```js
grid.addEventListener("podcast-selected", (event) => {
  createModal.open(event.detail.id); // the parent decides what happens
});
```

---

## Deliverables
- A working Web Component (`src/components/PodcastPreview.js`).
- An HTML demo page showcasing it (`index.html`).
- This `README.md` with usage, data passing, and event instructions.
Same structure as before, just updated to match the final modular 
