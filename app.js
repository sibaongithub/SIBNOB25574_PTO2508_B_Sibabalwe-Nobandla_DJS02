import { podcasts, genres, seasons } from "./data.js";
import "./PodcastPreview.js";

// look up a genre name from its id
const genreName = (id) => (genres.find((g) => g.id === id) || {}).title;

// turn a podcast's genre ids into readable names
const namesFor = (ids) => ids.map(genreName).filter(Boolean);

// get the seasons for a podcast id
const seasonsFor = (id) => (seasons.find((s) => s.id === id) || {}).seasonDetails || [];

// readable date e.g. "November 3, 2022"
const longDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

// create a <podcast-preview> for every podcast and add it to the grid
const grid = document.getElementById("grid");
podcasts.forEach((p) => {
  const card = document.createElement("podcast-preview");
  card.data = { ...p, genres: namesFor(p.genres) };
  grid.appendChild(card);
});

// listen for the component's custom event and open the modal
grid.addEventListener("podcast-selected", (e) => openModal(e.detail.id));

// the pop up
const modal = document.getElementById("modal");

// open the pop up for a podcast
function openModal(id) {
  const p = podcasts.find((p) => p.id === id);
  if (!p) return;

  document.getElementById("mTitle").textContent = p.title;
  document.getElementById("mDesc").textContent = p.description;
  document.getElementById("mUpdated").textContent = "Last updated: " + longDate(p.updated);

  document.getElementById("mGenres").innerHTML = namesFor(p.genres)
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

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// close the pop up
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("mClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
