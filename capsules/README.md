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

`houses[]` uses `address`, `price` (a number of dollars), `beds`, `baths`, `sqft`,
`yearBuilt`, `hoa`, `notes`, `photo`, and `ranking`.

`photo.kind` is `listing`, `streetview`, or `representative`.

- Listing photos stay on the listing site. Hotlink `photo.url` only when that URL looks stable. Otherwise leave `url` empty and the page shows **View listing photos**. `sourceUrl` is always the listing page.
- Do not copy listing photos into this repo.
- If there is no listing photo and the address is exact, use a Google Street View link (`kind: "streetview"`).
- Last resort: a free-licensed exterior already credited in the root README, `kind: "representative"`, with `photo.credit` filled in. The page labels it **Representative, not this house**.

`ranking.johnScore` is a number only when John gave one. Otherwise `null`. The page says **No score given**.
`ranking.dayOrder` is a number only when the notes put the house in a numbered spot. Otherwise `null`. Do not invent an order inside a group. Put the group name in `dayGroup` and where that wording came from in `orderSource`.

Leave out offer plans, offer timing, and negotiation reasoning. Do not name the baby; say "the baby" if a sentence needs it.

## Thursday 1 Oct photo notes

- 1242 Via Candelas, 1267 Via Candelas, and 1702 Avenida Vista Labera (the notes said "1702 Rancho del Oro"; the public listing at that price, year, and size is Avenida Vista Labera) use hotlinked Coldwell Banker listing photos. Zillow, Redfin, Realtor.com, and Compass did not have a usable active-listing photo URL for these three when the capsule was built.
- 855 Rancho del Oro and the four homes with no address in the notes use `img/fri-vista-hills.jpg` (Z3lvs, CC0), labeled representative.
