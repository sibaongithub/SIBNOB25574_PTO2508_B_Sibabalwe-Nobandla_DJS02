import { podcasts } from "./data.js";
import { createModal } from "./components/createModal.js";
import { createGrid } from "./views/createGrid.js";
import { createFilters } from "./views/createFilters.js";

/**
 * Starts the app: wires the modal close buttons, builds the grid and filters,
 * and does the first render.
 *
 * @principle SRP - Only handles startup. Rendering and filtering live in modules.
 */
function init() {
  const grid = createGrid();

  // close the modal: X button, clicking the backdrop, or Escape
  document.getElementById("mClose").addEventListener("click", createModal.close);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") createModal.close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") createModal.close();
  });

  // the genre + sort dropdowns decide what the grid shows
  const filters = createFilters(podcasts, (visible) => grid.render(visible));
  filters.apply();
}

init();
