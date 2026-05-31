/**
 * <podcast-preview>
 *
 * A reusable, stateless podcast preview card built as a native Web Component.
 * It renders inside a Shadow DOM so its styles stay encapsulated, and it only
 * displays the data the parent gives it. When clicked it fires a
 * "podcast-selected" event so the parent app can open a modal.
 *
 * @principle Encapsulation (OOP) - It is a class extending HTMLElement with its
 * own private Shadow DOM; the outside page can't accidentally style or break it.
 * @principle Loose coupling - It communicates "up" with a custom event instead
 * of calling the modal directly, so it doesn't depend on the rest of the app.
 *
 * Pass data with the .data property:
 *   el.data = { id, title, seasons, genres: ["Tech"], updated, image };
 * or with attributes (title, seasons, genres, updated, image, podcast-id).
 */
class PodcastPreview extends HTMLElement {
  /** Attributes that re-render the card when they change. @returns {string[]} */
  static get observedAttributes() {
    return ["image", "title", "seasons", "genres", "updated", "podcast-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.addEventListener("click", this._notify);
    this.addEventListener("keydown", this._onKey);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._notify);
    this.removeEventListener("keydown", this._onKey);
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  /**
   * Lets the parent pass a whole podcast object. It just copies values onto
   * attributes, so the component stays stateless.
   * @param {{id:string,title:string,seasons:number,genres:string[],updated:string,image?:string}} podcast
   */
  set data(podcast) {
    this.setAttribute("podcast-id", podcast.id ?? "");
    this.setAttribute("title", podcast.title ?? "");
    this.setAttribute("seasons", podcast.seasons ?? 0);
    this.setAttribute("genres", (podcast.genres ?? []).join(","));
    this.setAttribute("updated", podcast.updated ?? "");
    this.setAttribute("image", podcast.image ?? "");
  }

  /** Tells the parent this card was selected (event crosses the Shadow DOM). */
  _notify = () => {
    this.dispatchEvent(
      new CustomEvent("podcast-selected", {
        detail: { id: this.getAttribute("podcast-id") },
        bubbles: true,
        composed: true,
      })
    );
  };

  /** Keyboard support: Enter/Space act like a click. @param {KeyboardEvent} e */
  _onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._notify();
    }
  };

  /** "Updated D Month YYYY" from an ISO date. @param {string} iso @returns {string} */
  _updated(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const month = d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
    return `Updated ${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
  }

  /** Builds the card from the current attributes. */
  render() {
    const image = this.getAttribute("image") || "";
    const title = this.getAttribute("title") || "Untitled";
    const seasons = Number(this.getAttribute("seasons") || 0);
    const genres = (this.getAttribute("genres") || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    const updated = this._updated(this.getAttribute("updated"));

    const seasonText = `${seasons} season${seasons === 1 ? "" : "s"}`;
    const tags = genres.map((g) => `<span class="pill">${g}</span>`).join("");
    const cover = `
      <div class="cover">
        <span>Podcast Cover</span>
        ${image ? `<img src="${image}" alt="${title} cover" onerror="this.remove()">` : ""}
      </div>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; cursor: pointer;
                font-family: "Inter", system-ui, -apple-system, sans-serif; }
        :host(:focus-visible) { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 16px; }
        .card { background:#fff; border:1px solid #f0f0f0; border-radius:16px; overflow:hidden;
                box-shadow:0 1px 3px rgba(0,0,0,.06); transition:box-shadow .15s ease, transform .15s ease; }
        :host(:hover) .card { box-shadow:0 10px 28px rgba(0,0,0,.12); transform:translateY(-3px); }
        .cover-wrap { padding:16px 16px 0; }
        .cover { position:relative; width:100%; aspect-ratio:4/3; border-radius:12px; overflow:hidden;
                 background:#9aa1ac; display:flex; align-items:center; justify-content:center;
                 color:#f8fafc; font-weight:500; }
        .cover img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .body { padding:12px 16px 16px; }
        h2 { margin:0 0 8px; font-size:1.125rem; font-weight:700; line-height:1.3; color:#111827; }
        .meta { display:flex; align-items:center; gap:8px; margin:0 0 12px; font-size:.875rem; color:#6b7280; }
        .meta svg { width:16px; height:16px; flex-shrink:0; }
        .tags { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
        .pill { background:#f1f3f5; color:#374151; font-size:.78rem; padding:3px 11px; border-radius:6px; }
        .updated { margin:0; font-size:.875rem; color:#9ca3af; }
      </style>

      <article class="card">
        <div class="cover-wrap">${cover}</div>
        <div class="body">
          <h2>${title}</h2>
          <p class="meta">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${seasonText}
          </p>
          <div class="tags">${tags}</div>
          <p class="updated">${updated}</p>
        </div>
      </article>
    `;
  }
}

// register so <podcast-preview> works in HTML
customElements.define("podcast-preview", PodcastPreview);
