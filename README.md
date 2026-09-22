# San Diego dream scout — 30 Sep → 4 Oct 2026

A single, self-contained, phone-first itinerary page for John's solo North County
house-scout trip (Oceanside → Vista → San Marcos → Escondido).

Open `index.html` directly — no build step, no network needed. All images live in `img/`.

## Live page (GitHub Pages)

**https://johnbr0phy.github.io/sd-dream-scout/**

Only this folder is published. The workflow at `.github/workflows/pages.yml` uploads
`sd-scout-2026-09/` as the Pages artifact on every push to `main` that touches this folder
(or on a manual run), so the root gallery in the repo is *not* published.

First-time setup, once, in the repo: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The workflow also tries to enable this automatically on its first run.

Note: GitHub Pages on a **private** repository needs GitHub Pro / Team / Enterprise. On the
Free plan the site only publishes if the repository is public.

## What's on the page

- Orange dream header with hearts, a short note to Maya, and a trip-at-a-glance grid
- Sticky day-jump nav (Wed / Thu / Fri / Sat / Sun / Fly·Stay·Car / Cost) that scrolls on a phone
- One section per day with a mood photo, a tap-to-open photo gallery of the area (coast,
  hills, lakes, downtown, parks), and a full timeline: morning coffee, breakfast,
  viewing blocks (neighbourhoods + Operator shortlist counts only — no listing addresses),
  lunch, after-lunch coffee, dinner, drive notes. Coffee and meal stops carry a small
  mood thumbnail (generic specialty coffee / brunch / tacos / pizza — not the actual venues)
- Flights — outbound locked: Alaska nonstop EWR 5:02 PM → SAN 7:58 PM, 5h56, $374 one-way
  for 1 adult economy (Google Flights read 21 Sep 2026 ~8:33pm ET, not booked). Return
  SAN → EWR Sunday 4 Oct is not locked (outbound $374 OW + return TBD). Vista Airbnb base (~$683 / 4 nights),
  and the car: 2026 Tesla Model Y Premium **with FSD included** on Turo, $501 before taxes
  (locked for the plan, not booked), with the 2025 Y LR + FSD add-on and Frontier Model 3
  as alternates
- Solo cost breakdown, coffee tally, and "before we stamp" questions
- Footer: *No bookings yet — stamp to lock*

Source of truth was the trip-plan markdown (`sd-scout-trip-2026-09-30.md`); trip facts that
differed (solo traveller, 1-adult pricing, FSD wording) follow the brief, not the markdown.
No new cafés or restaurants were invented.

## Phone-first notes

`viewport-fit=cover` with `env(safe-area-inset-*)` padding, 17px body text, 44px tap targets,
plain stacked scrolling (no `overflow: hidden` on `html`/`body`, no fixed body, no `100svh` lock).
Galleries are a 2-up grid on phones; every image has `width`/`height`, `loading="lazy"` and
`decoding="async"`. Total image weight ≈ 4.3 MB across 37 files, largest ≈ 370 KB (hero).
Checked at 390px width.

## Photo credits (Wikimedia Commons)

Place photos are the real places. Coffee and food photos are generic mood shots — none of
them are the cafés or restaurants named on the page. No identifiable faces, no private
listing photos.

### Hero, day headers and galleries

| File | Source | Author | Licence |
|---|---|---|---|
| `img/hero-oceanside-coast.jpg` | [Oceanside SW01.jpg](https://commons.wikimedia.org/wiki/File:Oceanside_SW01.jpg) | Scotwriter21 | CC BY-SA 4.0 |
| `img/wed-point-loma-sunset.jpg` | [Sunset at point loma.jpg](https://commons.wikimedia.org/wiki/File:Sunset_at_point_loma.jpg) | Jon Sullivan | Public domain |
| `img/wed-lake-san-marcos.jpg` | [Lakesanmarcos.jpg](https://commons.wikimedia.org/wiki/File:Lakesanmarcos.jpg) | Taylorj661 | Public domain |
| `img/thu-oceanside-pier.jpg` | [Oceanside Pier Sunset.jpg](https://commons.wikimedia.org/wiki/File:Oceanside_Pier_Sunset.jpg) | JAFactsDude | CC0 |
| `img/thu-oceanside-beach-palms.jpg` | [Oceanside, California 01 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Oceanside,_California_01_(cropped).jpg) | Tgormanbrown | CC BY-SA 4.0 |
| `img/thu-oceanside-harbor-sunset.jpg` | [Sunset Oceanside Harbor (52547236325).jpg](https://commons.wikimedia.org/wiki/File:Sunset_Oceanside_Harbor_(52547236325).jpg) | John D. (Flickr) | CC BY 2.0 |
| `img/thu-oceanside-harbor-village.jpg` | [Oceanside Harbor Village.jpg](https://commons.wikimedia.org/wiki/File:Oceanside_Harbor_Village.jpg) | Ccarll | CC BY-SA 4.0 |
| `img/thu-oceanside-under-pier.jpg` | [Under the Oceanside Pier.jpg](https://commons.wikimedia.org/wiki/File:Under_the_Oceanside_Pier.jpg) | Visitor7 | CC BY-SA 3.0 |
| `img/thu-oceanside-lifeguard-tower.jpg` | [Oceanside 1.jpg](https://commons.wikimedia.org/wiki/File:Oceanside_1.jpg) | Visitor7 | CC BY-SA 3.0 |
| `img/thu-oceanside-palms-sky.jpg` | [Oceanside, California 08.jpg](https://commons.wikimedia.org/wiki/File:Oceanside,_California_08.jpg) | Tgormanbrown | CC BY-SA 4.0 |
| `img/fri-vista-hills.jpg` | [San Marcos Mountains seen from Vista, California.jpg](https://commons.wikimedia.org/wiki/File:San_Marcos_Mountains_seen_from_Vista,_California.jpg) | Z3lvs | CC0 |
| `img/fri-vista-main-street-art.jpg` | [Main Street Vista.jpg](https://commons.wikimedia.org/wiki/File:Main_Street_Vista.jpg) | anonymous uploader (PD-self) | Public domain |
| `img/fri-vista-gateway-arch.jpg` | [Vista Gateway.jpg](https://commons.wikimedia.org/wiki/File:Vista_Gateway.jpg) | City of Vista (PD-CAGov) | Public domain |
| `img/fri-vista-botanical-garden.jpg` | [200518 023 Alta Vista Botanical Gardens, Culinary Herb Garden.jpg](https://commons.wikimedia.org/wiki/File:200518_023_Alta_Vista_Botanical_Gardens,_Culinary_Herb_Garden.jpg) | cultivar413 | CC BY 2.0 |
| `img/sat-san-marcos-double-peak.jpg` | [Double Peak Park north.jpg](https://commons.wikimedia.org/wiki/File:Double_Peak_Park_north.jpg) | Alicezeppelin | CC0 |
| `img/sat-double-peak-south.jpg` | [Double Peak Park south.jpg](https://commons.wikimedia.org/wiki/File:Double_Peak_Park_south.jpg) | Alicezeppelin | CC0 |
| `img/sat-san-marcos-lake-view.jpg` | [SanMarcos1.jpg](https://commons.wikimedia.org/wiki/File:SanMarcos1.jpg) | Taylorj661 | Public domain |
| `img/sat-lakehouse-bridge.jpg` | [Lake View from Bridge.jpg](https://commons.wikimedia.org/wiki/File:Lake_View_from_Bridge.jpg) | EnneDee | CC BY-SA 4.0 |
| `img/sun-escondido-dixon-lake.jpg` | [Dixon Lake Escondido Sunrise Aerial](https://commons.wikimedia.org/wiki/File:Mark_Skovorodko_Photography_-_Dixon_Lake_Escondido_Sunrise_Aerial.jpg) | Mark Skovorodko | CC BY-SA 4.0 |
| `img/sun-escondido-grand-arch.jpg` | [Escondido Grand Avenue Sign](https://commons.wikimedia.org/wiki/File:Mark_Skovorodko_Photography_-_Escondido_Grand_Avenue_Sign.jpg) | Mark Skovorodko | CC BY-SA 4.0 |
| `img/sun-escondido-downtown-golden.jpg` | [Escondido Historic Downtown Aerial](https://commons.wikimedia.org/wiki/File:Mark_Skovorodko_Photography_-_Escondido_Historic_Downtown_Aerial.jpg) | Mark Skovorodko | CC BY-SA 4.0 |
| `img/sun-daley-ranch.jpg` | [Daley Ranch Escondido Aerial](https://commons.wikimedia.org/wiki/File:Mark_Skovorodko_Photography_-_Daley_Ranch_Escondido_Aerial.jpg) | Mark Skovorodko | CC BY-SA 4.0 |
| `img/sun-kit-carson-park.jpg` | [Kit Carson Park Escondido](https://commons.wikimedia.org/wiki/File:Mark_Skovorodko_Photography_-_Kit_Carson_Park_Escondido.jpg) | Mark Skovorodko | CC BY-SA 4.0 |
| `img/orange-citrus.jpg` | [Orange -- 2022 -- 9715.jpg](https://commons.wikimedia.org/wiki/File:Orange_--_2022_--_9715.jpg) | Dietmar Rabich | CC BY-SA 4.0 |

### Coffee and meal mood thumbnails (generic — not the venues on the page)

| File | Source | Author | Licence |
|---|---|---|---|
| `img/coffee-heart.jpg` | [Latte art heart Garden Caffé Portugal](https://commons.wikimedia.org/wiki/File:Latte_art_heart_Garden_Caff%C3%A9_Portugal_20190118.jpg) | Londonjackbooks | CC0 |
| `img/coffee-espresso-machine.jpg` | [Modern coffee machine (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Modern_coffee_machine_(Unsplash).jpg) | Crew | CC0 |
| `img/coffee-pourover-chemex.jpg` | [Chemex (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Chemex_(Unsplash).jpg) | Zachary Newton | CC0 |
| `img/coffee-cafe-front.jpg` | [Front Cafe, San Francisco, United States (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Front_Cafe,_San_Francisco,_United_States_(Unsplash).jpg) | Matt Jones | CC0 |
| `img/coffee-muffin-latte.jpg` | [Muffin, Einsteins Coffee Murdoch Square, 2025 (01).jpg](https://commons.wikimedia.org/wiki/File:Muffin,_Einsteins_Coffee_Murdoch_Square,_2025_(01).jpg) | Bahnfrend | CC BY-SA 4.0 |
| `img/coffee-cappuccino-hands.jpg` | [A person holds a cup of cappuccino…](https://commons.wikimedia.org/wiki/File:A_person_holds_a_cup_of_cappuccino_featuring_intricate_latte_art,_sitting_at_a_caf%C3%A9_table.jpg) | Shixart1985 | CC BY 2.0 |
| `img/coffee-cafe-table.jpg` | [Coffee in Montreal (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Coffee_in_Montreal_(Unsplash).jpg) | Luke Chesser | CC0 |
| `img/coffee-latte-reach.jpg` | [A hand reaches for a cup of coffee.jpg](https://commons.wikimedia.org/wiki/File:A_hand_reaches_for_a_cup_of_coffee.jpg) | Shixart1985 | CC BY 2.0 |
| `img/food-brunch-benedict.jpg` | [Eggs Benedict (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Eggs_Benedict_(Unsplash).jpg) | Constance Chen | CC0 |
| `img/food-fish-tacos.jpg` | [Mahi Mahi Tacos - El Coyote - Stierch.jpg](https://commons.wikimedia.org/wiki/File:Mahi_Mahi_Tacos_-_El_Coyote_-_Stierch.jpg) | Sarah Stierch | CC BY 4.0 |
| `img/food-breakfast-toast.jpg` | [Breakfast toast with poached eggs, bacon, tomatoes, avocado.jpg](https://commons.wikimedia.org/wiki/File:Breakfast_toast_with_poached_eggs,_bacon,_tomatoes,_avocado.jpg) | Kgbo | CC BY-SA 4.0 |
| `img/food-margherita-pizza.jpg` | [Margherita pizza (5209912131).jpg](https://commons.wikimedia.org/wiki/File:Margherita_pizza_(5209912131).jpg) | mroach (Flickr) | CC BY-SA 2.0 |
| `img/food-farm-taco.jpg` | [Street Corn Tacos - 50495563872.jpg](https://commons.wikimedia.org/wiki/File:Street_Corn_Tacos_-_50495563872.jpg) | Alabama Extension | CC0 |

Images were resized (≤1600px wide; thumbnails 480px square, centre-cropped) and recompressed
for phones; no other edits. CC BY-SA images are shared here under the same licence.

## Privacy

No credentials, no listing street addresses, no personal emails. Business names and links only.
