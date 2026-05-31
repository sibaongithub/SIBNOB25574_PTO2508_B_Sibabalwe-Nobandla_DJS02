import { createModal } from "../components/createModal.js";
import { genreNames } from "../utils.js";
import "../components/PodcastPreview.js";

/**
 * Creates the grid that renders <podcast-preview> components.
 *
 * @principle SRP - Only builds the grid and listens for the components' event.
 * @principle Factory pattern - Returns a small { render } API.
 * @returns {{ render: (list: Object[]) => void }}
 */
export function createGrid() {
  const gridEl = document.getElementById("grid");

  // when any card fires its event, open the modal for that podcast
  gridEl.addEventListener("podcast-selected", (e) => createModal.open(e.detail.id));

  return {
    // show the given podcasts as components
    render(list) {
      gridEl.innerHTML = "";
      list.forEach((p) => {
        const card = document.createElement("podcast-preview");
        // pass genre names (not ids) so the component stays simple
        card.data = { ...p, genres: genreNames(p.genres) };
        gridEl.appendChild(card);
      });
    },
  };
}
