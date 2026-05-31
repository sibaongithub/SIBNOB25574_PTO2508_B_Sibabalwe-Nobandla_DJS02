import { genres } from "../data.js";

// the sort options, each just a small compare function
const SORTERS = {
  updated: (a, b) => new Date(b.updated) - new Date(a.updated),
  newest: (a, b) => new Date(b.updated) - new Date(a.updated),
  popular: (a, b) => b.seasons - a.seasons,
};

/**
 * Builds the genre + sort dropdowns and, whenever they change, hands the
 * filtered/sorted list back to the caller to render.
 *
 * @principle SRP - Only works out which podcasts should show; it doesn't render.
 * @param {Object[]} podcasts - The full list.
 * @param {(visible: Object[]) => void} onChange - Called with the list to show.
 * @returns {{ apply: () => void }}
 */
export function createFilters(podcasts, onChange) {
  const genreEl = document.getElementById("genreFilter");
  const sortEl = document.getElementById("sortFilter");

  // fill the genre dropdown with the genres that are actually used
  const used = new Set(podcasts.flatMap((p) => p.genres));
  genres
    .filter((g) => used.has(g.id))
    .forEach((g) => {
      const opt = document.createElement("option");
      opt.value = String(g.id);
      opt.textContent = g.title;
      genreEl.appendChild(opt);
    });

  // work out the list to show from the current dropdown values
  function compute() {
    const genreVal = genreEl.value;
    const filtered =
      genreVal === "all"
        ? [...podcasts]
        : podcasts.filter((p) => p.genres.includes(Number(genreVal)));
    return filtered.sort(SORTERS[sortEl.value] || SORTERS.updated);
  }

  function apply() {
    onChange(compute());
  }

  genreEl.addEventListener("change", apply);
  sortEl.addEventListener("change", apply);

  return { apply };
}
