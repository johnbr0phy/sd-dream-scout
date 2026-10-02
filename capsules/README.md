# Time capsules

One record per day for this trip only (Wed 30 Sep – Sun 4 Oct 2026).
The JSON is the notes and the houses. The build script fills the planned
timeline and the grocery card from `index.html`, then renders the HTML.

Live index: `capsules/index.html` (GitHub Pages: `/capsules/`).

## Add a day

1. Copy `capsules/2026-10-01.json` to `capsules/YYYY-MM-DD.json`.
   The date has to be one of `2026-09-30`, `2026-10-01`, `2026-10-02`, `2026-10-03`, `2026-10-04`
   so the script can find `#wed`, `#thu`, `#fri`, `#sat`, or `#sun`.
2. Set `date`, `town`, `food`, `notes`, `houses`, and `takeaway`.
   Leave `plannedTimeline` and `groceries` empty. The script replaces those two
   and does not overwrite `notes` or `houses`.
3. From the repo root, with dependencies installed (`npm install`):

   ```bash
   node scripts/build-capsule.mjs YYYY-MM-DD
   ```

   `node scripts/build-capsule.mjs --all` rebuilds every dated JSON and `capsules/index.html`.
4. Commit the JSON and the generated `capsules/YYYY-MM-DD.html` and `capsules/index.html`.

## House fields

`houses[]` uses `address`, `showingTime`, `price` (a number of dollars), `beds`, `baths`, `sqft`,
`yearBuilt`, `hoa`, `mls`, `notes`, `matchSource`, `photo`, and `ranking`.

`showingTime` is the appointment, like `10:00 AM`. The page lists showings in that order.
Ranking groups stay in the order written in the JSON.
`matchSource` says why an address was tied to a tour note, or why it was not.

`photo.kind` is `listing`, `streetview`, or `representative`.

- Listing photos stay on the listing site. Hotlink `photo.url` only when that URL looks stable. Otherwise leave `url` empty and the page shows **View listing photos**. `sourceUrl` is always the listing page.
- Do not copy listing photos into this repo.
- If there is no listing photo and the address is exact, use a Google Street View link (`kind: "streetview"`).
- Last resort: a free-licensed exterior already credited in the root README, `kind: "representative"`, with `photo.credit` filled in. The page labels it **Representative, not this house**.

`ranking.johnScore` is a number only when John gave one. Otherwise `null`. The page says **No score given**.
`ranking.dayOrder` is a number only when the notes put the house in a numbered spot. Otherwise `null`. Do not invent an order inside a group. Put the group name in `dayGroup` and where that wording came from in `orderSource`.

Leave out offer plans, offer timing, and negotiation reasoning. Do not name the baby; say "the baby" if a sentence needs it.

## Thursday 1 Oct photo notes

Every house on the 1 Oct showing schedule uses a hotlinked listing photo. The files are not in this repo.

- 1242 Via Candelas, 1267 Via Candelas, 1702 Avenida Vista Labera, 4724 Ventana Way, 4059 Ivey Vista Way, and 1721 Corte Viejo: Coldwell Banker listing photos.
- 1727 Avenida Vista Labera: Coldwell Banker listing photo.
- 914 Tempera Ct and 1861 Avenida Segovia: CRMLS listing photos.

## Friday 2 Oct photo notes

Every house on the 2 Oct showing schedule uses a hotlinked listing photo. The files are not in this repo. There are no tour notes and no scores yet.

- 6015 Paseo Salinero, 1910 Willow Ridge Dr, 1077 Cordoba Way, 1762 Spyglass Cir, 217 Camille Way, and 509 Avenida Aguila: Coldwell Banker listing photos.
- 1510 Golfcrest Pl: CRMLS listing photo.
