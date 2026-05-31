import { podcasts } from "../data.js";
import { genreNames, longDate, seasonsFor } from "../utils.js";

/**
 * The detail modal, written as one module object since there's only one modal.
 *
 * @principle SRP - Only responsible for filling, opening and closing the modal.
 * It looks the podcast up by id, so the component can stay stateless.
 */
export const createModal = {
  // open the pop up for a podcast id
  open(id) {
    const p = podcasts.find((p) => p.id === id);
    if (!p) return;

    document.getElementById("mTitle").textContent = p.title;
    document.getElementById("mDesc").textContent = p.description;
    document.getElementById("mUpdated").textContent = "Last updated: " + longDate(p.updated);

    document.getElementById("mGenres").innerHTML = genreNames(p.genres)
      .map((name) => `<span class="modal-pill">${name}</span>`)
      .join("");

    const list = seasonsFor(id);
    document.getElementById("mSeasons").innerHTML = list.length
      ? list
          .map(
            (s) => `
        <div class="season-item">
          <span class="season-title">${s.title}</span>
          <span class="episodes">${s.episodes} episode${s.episodes === 1 ? "" : "s"}</span>
        </div>`
          )
          .join("")
      : `<p class="no-seasons">No season details.</p>`;

    document.getElementById("modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  // close the pop up
  close() {
    document.getElementById("modal").classList.add("hidden");
    document.body.style.overflow = "";
  },
};
