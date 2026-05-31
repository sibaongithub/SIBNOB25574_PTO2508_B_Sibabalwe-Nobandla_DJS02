import { genres, seasons } from "./data.js";

// shared little helpers used by the grid and the modal

// turn a list of genre ids into readable names
export function genreNames(ids) {
  return ids.map((id) => (genres.find((g) => g.id === id) || {}).title).filter(Boolean);
}

// readable date e.g. "November 3, 2022"
export function longDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// get the seasons for a podcast id
export function seasonsFor(id) {
  return (seasons.find((s) => s.id === id) || {}).seasonDetails || [];
}
