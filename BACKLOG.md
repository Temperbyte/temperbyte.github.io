# Free calculator backlog

The weekly build takes the first unchecked item, builds it, and ticks it with the date and URL.
Every calculator: one static page at `/<slug>/index.html`, same structure and `assets/site.css` as the existing calculators
(header nav "Free tools" + "Store", h1, lede, `form.tool`, live result in `#out`, explanation sections, `.note` disclaimer,
`.cta` to the matching paid skill, `figure.share` with the pin image, standard footer), plain JavaScript, no libraries,
nothing sent anywhere. Never invent statistics or legal rules; when a convention varies by market, say so on the page.

## Done

- [x] 2026-10-15 Escalation clause calculator → Offer Comparison (https://payhip.com/b/sfl8H)
- [x] 2026-10-15 Weight trend calculator → Check-in Analyzer (https://payhip.com/b/7gC9P)
- [x] 2026-10-16 Comps price calculator → Pricing Brief (https://payhip.com/b/7mleY)
- [x] 2026-10-16 Price reduction calculator → Seller Update (https://payhip.com/b/UXnhj)
- [x] 2026-10-16 Progressive overload calculator → Program Progression (https://payhip.com/b/gpAwi)

- [x] 2026-10-16 Appraisal gap calculator → Offer Comparison (https://payhip.com/b/sfl8H)
- [x] 2026-10-16 MLS remarks checker → Listing Writer (https://payhip.com/b/60TYy)
- [x] 2026-10-16 Training volume calculator → Intake to Program (https://payhip.com/b/gVueK)

## Next (in this order)

- [ ] **Client adherence calculator** (`/client-adherence-calculator/`) → Check-in Analyzer (https://payhip.com/b/7gC9P). Coaches.
  Inputs for the period: sessions planned / done, days on nutrition target / days logged, step-goal days / days, check-ins due / sent.
  Output: each as a percent and an overall average of the areas filled in. Rule from our skills: under about 75% → don't change targets or add volume; find out what got in the way. 75% or more and the trend is off for two weeks → one small change.
  Never shame wording; add the note that skipping meals to compensate or exercising far beyond the plan is a reason to talk, not to adjust.

- [ ] **Months of inventory calculator** (`/months-of-inventory-calculator/`) → Pricing Brief (https://payhip.com/b/7mleY). Agents.
  Inputs: active listings now, closed sales in the last N months, N (default 6). Months of inventory = active ÷ (sales ÷ N). Absorption rate = (sales ÷ N) ÷ active, as % per month.
  Market read: under about 4 months often called a seller's market, about 4–6 balanced, over 6 a buyer's market; say plainly that thresholds vary by area and price band.
  Optional: the same for a price band to compare.

## Rules for the weekly build

1. Build only the first unchecked item. If research shows a much better idea for the same audience and an existing paid skill, add it to this list for a later week instead of switching.
2. Test before pushing: load the page in Playwright (Chromium is preinstalled), run at least 6 input cases including edge cases (empty fields, zero, huge numbers, bad text), check the math by hand in Python, no page errors, and no horizontal scroll at 375 px width. If anything fails and can't be fixed, don't push; report it.
3. Update `index.html` (right audience section), `sitemap.xml` (new URL, today's date) and the README "Free calculators" section in Temperbyte/temperbyte-skills. Render the 1000×1500 pin image in the existing style to `assets/social/NN-slug.png`, reference it with `og:image` and `figure.share`.
4. Tick the item here with the date.
